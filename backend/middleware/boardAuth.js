const prisma = require("../config/db");

const checkBoardMember = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const boardId = parseInt(req.params.boardId || req.body.boardId);

    if (!boardId) {
      return res.status(400).json({ message: "Board ID required" });
    }

    // Step 1: Check membership
    let membership = await prisma.boardMember.findUnique({
      where: {
        boardId_userId: { boardId, userId },
      },
      include: { board: true },
    });

    // Step 2: If not a member, check if user is board owner
    if (!membership) {
      const board = await prisma.board.findUnique({
        where: { id: boardId },
        select: { id: true, ownerId: true, title: true },
      });

      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      if (board.ownerId === userId) {
        // ✅ Auto-create missing membership if owner is not yet in the member table
        membership = await prisma.boardMember.upsert({
          where: {
            boardId_userId: { boardId, userId },
          },
          update: { role: "Owner" }, // Force update role to Owner if exists but wrong
          create: {
            boardId,
            userId,
            role: "Owner",
          },
          include: { board: true },
        });
      } else {
        return res
          .status(403)
          .json({ message: "Access denied: not a board member" });
      }
    } else {
      // ✅ Self-healing: If user IS a member but is actually the OWNER, ensure role is Owner
      // (This fixes the "Access denied insufficient role" bug if data got out of sync)
      const board = await prisma.board.findUnique({
        where: { id: boardId },
        select: { ownerId: true },
      });

      if (board && board.ownerId === userId && membership.role !== "Owner") {
        membership = await prisma.boardMember.update({
          where: { id: membership.id },
          data: { role: "Owner" },
          include: { board: true },
        });
      }
    }

    req.boardMember = membership;
    req.board = membership.board;
    next();
  } catch (err) {
    console.error("checkBoardMember error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const authorizeBoardRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.boardMember) {
      return res.status(500).json({ message: "Board membership not checked" });
    }

    if (!allowedRoles.includes(req.boardMember.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient role" });
    }

    next();
  };
};

const isBoardOwner = (req) => {
  if (!req.boardMember) {
    throw new Error("Board membership not checked yet");
  }
  return req.boardMember.role === "Owner";
};

module.exports = { checkBoardMember, authorizeBoardRoles, isBoardOwner };