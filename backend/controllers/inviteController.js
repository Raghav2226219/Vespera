const prisma = require("../config/db");
const { generateInviteToken, hashToken } = require("../utils/tokenUtils");
const sendEmail = require("../utils/email");
const bcrypt = require("bcrypt");

const createInvite = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { boardId } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
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

    const link = `http://localhost:5173/accept-invite?token=${rawToken}`; // to be modified when frontend will be made

    await sendEmail({
      to: email,
      subject: "You've been invited to join a board !! !!",
      text: `Click below to accept your invite:
            ${link}
            This link expires in 7 days.
            `,
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
    const { token } = req.body;
    const userId = req.user.id;

    if (!token) {
      return res.status(400).json({ message: "Invite token required" });
    }

    const invites = await prisma.Invite.findMany({
      where: {
        used: false,
        expiresAt: { gt: new Date() },
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

    const existing = await prisma.BoardMember.findUnique({
      where: { boardId_userId: { boardId: invite.boardId, userId } },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You are already a member of this board" });
    }

    await prisma.BoardMember.create({
      data: {
        boardId: invite.boardId,
        userId,
        role: invite.role,
      },
    });

    await prisma.invite.update({
      where: { id: invite.id },
      data: { used: true },
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
      expiresAt: invite.existingAt,
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

    const invite = await prisma.invite.findUnique({
      where: { id: inviteId },
      include: { board: true },
    });

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    const membership = await prisma.boardMember.findUnique({
      where: {
        boardId_userId: { boardId: invite.boardId, userId },
      },
    });

    if (!membership || !["Owner", "Admin"].includes(membership.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.invite.update({
      where: { id: inviteId },
      data: {
        cancelled: true,
        cancelledAt: new Date(),
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
  cancelInvite
};
