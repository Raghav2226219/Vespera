const prisma = require("../config/db");
const { generateInviteToken, hashToken } = require("../utils/tokenUtils");
const sendEmail = require("../utils/email");
const bcrypt = require("bcrypt");

const createInvite = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { boardId } = req.params;
    const inviterRole = req.boardMember.role;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    if (inviterRole !== "Owner" && inviterRole !== "Admin") {
      return res.status(403).json({
        message: "Only Owner or Admin can send invites",
      });
    }

    const rawToken = generateInviteToken();
    const tokenHash = await hashToken(rawToken);

    const invite = await prisma.Invite.create({
      data: {
        boardId: parseInt(boardId),
        email,
        role: role || "Viewer",
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const link = `http://localhost:5173/accept-invite?token=${rawToken}`;

    const htmlContent = `
  <div style="font-family: 'Inter', 'Segoe UI', sans-serif; background: linear-gradient(135deg, #0b1914, #132d1f, #193a29); padding: 50px 20px; color: #fefce8; text-align: center;">
    <div style="max-width: 550px; margin: auto; background: rgba(17, 30, 24, 0.8); border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 24px; box-shadow: 0 10px 40px rgba(163, 230, 53, 0.1); overflow: hidden;">
      
      <div style="background: rgba(255, 255, 255, 0.03); padding: 35px 30px; border-bottom: 1px solid rgba(250, 204, 21, 0.1);">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;
                   background: linear-gradient(to right, #facc15, #a3e635, #4ade80);
                   -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                   text-shadow: 0 0 20px rgba(250, 204, 21, 0.3);">
          Welcome to Vespera 🌙
        </h1>
      </div>

      <div style="padding: 40px 30px;">
        <p style="font-size: 17px; color: #d9f99d; margin-bottom: 16px; font-weight: 500;">Hello there, 👋</p>
        <p style="font-size: 16px; color: #bbf7d0; line-height: 1.6; margin-bottom: 35px;">
          You have been invited to collaborate on a <strong style="color: #facc15;">Vespera Board</strong> 
          as a <b style="color: #a3e635;">${role || "Member"}</b>.<br><br>
          Join your team to manage tasks, create ideas, and grow together.
        </p>

        <div style="margin: 35px 0;">
          <a href="${link}"
            style="display: inline-block; background: linear-gradient(to right, #facc15, #a3e635);
                   color: #064e3b; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 36px;
                   border-radius: 14px; box-shadow: 0 4px 20px rgba(250, 204, 21, 0.4);
                   text-transform: uppercase; letter-spacing: 0.5px;">
            Accept Invitation
          </a>
        </div>

        <p style="font-size: 13px; color: #86efac; font-style: italic;">This link securely expires in 7 days.</p>
      </div>

      <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(250, 204, 21, 0.2), transparent);"></div>

      <div style="padding: 24px; font-size: 12px; color: #64748b; background: rgba(2, 6, 23, 0.5);">
        <p style="margin: 0;">If you weren't expecting this invitation, you can safely ignore this email.</p>
        <p style="margin-top: 10px;">© 2025 Vespera — Built to Create, Together.</p>
      </div>
    </div>
  </div>
`;

    await sendEmail({
      to: email,
      subject: "🌿 Vespera Invitation — Join the Board",
      html: htmlContent,
    });

    await prisma.inviteLog.create({
      data: {
        boardId: parseInt(boardId),
        inviteId: invite.id,
        inviterId: req.user.id,
        inviteeEmail: invite.email,
        action: "SENT",
      },
    });

    res
      .status(201)
      .json({ message: "Invite created & email sent", inviteId: invite.id });
  } catch (err) {
    console.error("Error creating invite: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

const acceptInvite = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated. Please login to accept this invite.",
      });
    }

    const { token } = req.body;
    const userId = req.user.id;

    if (!token) {
      return res.status(400).json({ message: "Invite token required" });
    }

    const invites = await prisma.Invite.findMany({
      where: {
        used: false,
        cancelled: false,
        expiresAt: { gt: new Date() },
      },
      include: {
        board: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    let invite = null;
    for (const inv of invites) {
      const match = await bcrypt.compare(token, inv.tokenHash);
      if (match) {
        invite = inv;
        break;
      }
    }

    if (!invite) {
      return res.status(400).json({ message: "Invalid or expired invite" });
    }

    const user = await prisma.User.findUnique({
      where: { id: userId },
    });

    if (!user || user.email !== invite.email) {
      await prisma.Invite.update({
        where: { id: invite.id },
        data: { cancelled: true },
      });

      await prisma.InviteLog.create({
        data: {
          boardId: invite.boardId,
          inviteId: invite.id,
          inviterId: invite.board.ownerId,
          inviteeEmail: invite.email,
          action: "SUSPICIOUS",
        },
      });

      const owner = invite.board.members.find((m) => m.role === "Owner");

      if (owner && owner.user?.email) {
        await sendEmail({
          to: owner.user.email,
          subject: "Vespera - Suspicious Invite Attempt Blocked",
          html: `
          <p>Hello,</p>
          <p>Someone tried to accept an invite to <strong>${invite.board.title}</strong> that was not meant for them.</p>
          <p>The invite for <strong>${invite.email}</strong> has now been <b>cancelled</b> for safety.</p>
          <p>If this was unexpected, please consider inviting the correct user again.</p>
          `,
        });
      }

      return res.status(403).json({
        message: "This invite was not for your account and has been cancelled.",
      });
    }

    // ✅ Idempotent: if already a member, return success instead of 400
    const existing = await prisma.BoardMember.findUnique({
      where: { boardId_userId: { boardId: invite.boardId, userId } },
    });

    if (existing) {
      return res.status(200).json({
        message: "Already a member — skipping duplicate accept",
        boardId: invite.boardId,
      });
    }

    await prisma.BoardMember.create({
      data: {
        boardId: invite.boardId,
        userId,
        role: invite.role,
      },
    });

    await prisma.Invite.update({
      where: { id: invite.id },
      data: { used: true },
    });

    await prisma.InviteLog.create({
      data: {
        boardId: invite.boardId,
        inviteId: invite.id,
        inviterId: invite.board.ownerId,
        acceptedById: userId,
        inviteeEmail: invite.email,
        action: "ACCEPTED",
      },
    });

    res.json({
      message: "Invite accepted successfully",
      boardId: invite.boardId,
    });
  } catch (err) {
    console.error("Error accepting invite: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

const validateInvite = async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res
        .status(400)
        .json({ valid: false, reason: "Invite Token required" });
    }

    const invites = await prisma.Invite.findMany({
      where: {
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { board: true },
    });

    let invite = null;

    for (const inv of invites) {
      const match = await bcrypt.compare(token, inv.tokenHash);
      if (match) {
        invite = inv;
        break;
      }
    }

    if (!invite) {
      return res
        .status(400)
        .json({ valid: false, reason: "Invalid or expired invite" });
    }

    res.json({
      valid: true,
      boardId: invite.boardId,
      boardTitle: invite.board.title,
      email: invite.email,
      role: invite.role,
      expiresAt: invite.expiresAt,
      cancelled: invite.cancelled,
    });
  } catch (err) {
    console.error("Error validating invite: ", err);
    res.status(500).json({ valid: false, reason: "Server error" });
  }
};

const getPendingInvites = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    const userId = req.user.id;

    if (!boardId) {
      return res.status(400).json({ message: "Board ID required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const membership = await prisma.BoardMember.findUnique({
      where: {
        boardId_userId: { boardId, userId },
      },
    });

    if (!membership) {
      return res
        .status(403)
        .json({ message: "Access denied: not a board member" });
    }

    if (!["Owner", "Admin"].includes(membership.role)) {
      return res
        .status(403)
        .json({ message: "Access denied : Only Admin/Owner can access" });
    }

    const total = await prisma.invite.count({
      where: {
        boardId,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    const invites = await prisma.invite.findMany({
      where: {
        boardId,
        used: false,
        cancelled: false,
        expiresAt: { gt: new Date() },
      },
      select: {
        email: true,
        role: true,
        expiresAt: true,
      },
      orderBy: { expiresAt: "asc" },
      skip,
      take: limit,
    });

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      invites,
    });
  } catch (err) {
    console.error("Error fetching invites : ", err);
    res.status(500).json({ message: "Server error" });
  }
};

const cancelInvite = async (req, res) => {
  try {
    const inviteId = parseInt(req.params.inviteId);
    const userId = req.user.id;

    const invite = await prisma.Invite.findUnique({
      where: { id: inviteId },
      include: { board: true },
    });

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    const membership = await prisma.BoardMember.findUnique({
      where: {
        boardId_userId: { boardId: invite.boardId, userId },
      },
    });

    if (!membership || !["Owner", "Admin"].includes(membership.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.Invite.update({
      where: { id: inviteId },
      data: {
        cancelled: true,
        cancelledAt: new Date(),
      },
    });

    await prisma.InviteLog.create({
      data: {
        boardId: invite.boardId,
        inviteId: invite.id,
        inviterId: req.user.id,
        inviteeEmail: invite.email,
        action: "CANCELLED",
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Invite canceled successfully" });
  } catch (err) {
    console.error("Error cancelling invite : ", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createInvite,
  acceptInvite,
  validateInvite,
  getPendingInvites,
  cancelInvite,
};
