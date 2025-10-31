const prisma = require("../config/db");
const { createDefaultColumns } = require("./columnController");
const { Role } = require("@prisma/client");

// ======================= GET ALL BOARDS =======================
const getAllBoards = async (req, res) => {
  try {
    const userId = req.user.id;

    const boards = await prisma.board.findMany({
      where: {
        members: { some: { userId } },
        status: "active", // ✅ exclude trashed boards
      },
      include: {
        members: {
          select: {
            id: true,
            role: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
        owner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ boards });
  } catch (err) {
    console.error("Get boards error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= GET BOARD DETAILS =======================
const getBoardDetails = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    if (!board) return res.status(404).json({ message: "Board not found" });

    res.json(board);
  } catch (err) {
    console.error("Error fetching board details: ", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================= CREATE BOARD =======================
const createBoard = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title) return res.status(400).json({ message: "Board title is required." });

    const existingBoard = await prisma.board.findFirst({
      where: { ownerId: userId, title },
    });

    if (existingBoard) {
      return res.status(400).json({ message: "You already have a board with this title." });
    }

    const board = await prisma.board.create({
      data: { title, description, ownerId: userId },
    });

    await prisma.boardMember.create({
      data: { userId, boardId: board.id, role: Role.Owner },
    });

    await createDefaultColumns(board.id);

    const fullBoard = await prisma.board.findUnique({
      where: { id: board.id },
      include: { columns: true },
    });

    res.status(201).json({
      message: "Board created successfully with default columns.",
      board: fullBoard,
    });
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ message: "Server error creating board." });
  }
};

// ======================= UPDATE BOARD =======================
const updateBoard = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title) return res.status(400).json({ message: "Board title is required." });

    const duplicateBoard = await prisma.board.findFirst({
      where: { ownerId: userId, title, NOT: { id: boardId } },
    });

    if (duplicateBoard) {
      return res.status(400).json({ message: "You already have another board with this title." });
    }

    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: { title, description },
      select: { id: true, title: true, description: true },
    });

    res.json(updatedBoard);
  } catch (err) {
    console.error("Error updating board: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= ARCHIVE BOARD =======================
const archiveBoard = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    const userId = req.user.id;

    // ✅ 1. Update the board status to "archived"
    const board = await prisma.board.update({
      where: { id: boardId },
      data: {
        status: "archived",
        archivedAt: new Date(),
        archivedBy: { connect: { id: userId } },
      },
    });

    // ✅ 2. Log the action in BoardAudit
    await prisma.boardAudit.create({
      data: {
        boardId,
        actorId: userId,
        action: "archive",
        details: {
          message: `Board "${board.title}" was archived by user ${userId}`,
        },
      },
    });

    res.status(200).json({
      message: "Board archived successfully.",
      board,
    });
  } catch (err) {
    console.error("Error archiving board:", err);
    res.status(500).json({ message: "Server error archiving board." });
  }
};


// ======================= UNARCHIVE BOARD =======================
const unarchiveBoard = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    const userId = req.user.id;

    // ✅ 1. Update the board back to "active"
    const board = await prisma.board.update({
      where: { id: boardId },
      data: {
        status: "active",
        archivedAt: null,
        archivedBy: { disconnect: true },
      },
    });

    // ✅ 2. Log this action
    await prisma.boardAudit.create({
      data: {
        boardId,
        actorId: userId,
        action: "restore",
        details: {
          message: `Board "${board.title}" was restored from archive by user ${userId}`,
        },
      },
    });

    res.status(200).json({
      message: "Board unarchived successfully.",
      board,
    });
  } catch (err) {
    console.error("Error unarchiving board:", err);
    res.status(500).json({ message: "Server error unarchiving board." });
  }
};

// ======================= MOVE TO TRASH =======================
const moveBoardToTrash = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);

    // Update board status → trashed
    const board = await prisma.board.update({
      where: { id: boardId },
      data: {
        status: "trashed",
        trashedAt: new Date(),
        trashedById: req.user.id,
      },
    });

    // Log the action in BoardAudit
    await prisma.boardAudit.create({
      data: {
        boardId,
        actorId: req.user.id,
        action: "trash",
        details: {
          message: `Board "${board.title}" moved to trash.`,
        },
        ip: req.ip,
        userAgent: req.headers["user-agent"] || "unknown",
      },
    });

    res.json({ message: "Board moved to trash successfully.", board });
  } catch (err) {
    console.error("Error moving board to trash:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= RESTORE FROM TRASH =======================
const restoreBoardFromTrash = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);

    // Update board status → active
    const board = await prisma.board.update({
      where: { id: boardId },
      data: {
        status: "active",
        trashedAt: null,
        trashedById: null,
      },
    });

    // Log the action in BoardAudit
    await prisma.boardAudit.create({
      data: {
        boardId,
        actorId: req.user.id,
        action: "restore",
        details: {
          message: `Board "${board.title}" restored from trash.`,
        },
        ip: req.ip,
        userAgent: req.headers["user-agent"] || "unknown",
      },
    });

    res.json({ message: "Board restored successfully.", board });
  } catch (err) {
    console.error("Error restoring board:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ======================= PERMANENT DELETE =======================
const permanentlyDeleteBoard = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);

    // ✅ Step 1: Fetch board first (for audit log message)
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }

    // ✅ Step 2: Log the permanent deletion BEFORE deleting
    await prisma.boardAudit.create({
      data: {
        boardId: board.id,
        actorId: req.user.id,
        action: "permanently_deleted",
        details: {
          message: `Board "${board.title}" permanently deleted by user ${req.user.id}.`,
        },
        ip: req.ip || null,
        userAgent: req.headers["user-agent"] || null,
      },
    });

    // ✅ Step 3: Now safely delete the board
    await prisma.board.delete({
      where: { id: boardId },
    });

    res.json({ message: "Board permanently deleted." });
  } catch (err) {
    console.error("Error permanently deleting board:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllBoards,
  getBoardDetails,
  createBoard,
  updateBoard,
  archiveBoard,
  unarchiveBoard,
  moveBoardToTrash,
  restoreBoardFromTrash,
  permanentlyDeleteBoard,
};
