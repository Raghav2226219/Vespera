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
        status: "active",
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
    console.error("Get boards error:", err);
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
    console.error("Error fetching board details:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= CREATE BOARD =======================
const createBoard = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title)
      return res.status(400).json({ message: "Board title is required." });

    const existingBoard = await prisma.board.findFirst({
      where: { ownerId: userId, title },
    });

    if (existingBoard)
      return res
        .status(400)
        .json({ message: "You already have a board with this title." });

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

    res
      .status(201)
      .json({ message: "Board created successfully.", board: fullBoard });
  } catch (err) {
    console.error("Error creating board:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= UPDATE BOARD =======================
const updateBoard = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title)
      return res.status(400).json({ message: "Board title is required." });

    const duplicateBoard = await prisma.board.findFirst({
      where: { ownerId: userId, title, NOT: { id: boardId } },
    });

    if (duplicateBoard)
      return res
        .status(400)
        .json({ message: "You already have another board with this title." });

    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: { title, description },
      select: { id: true, title: true, description: true },
    });

    res.json(updatedBoard);
  } catch (err) {
    console.error("Error updating board:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= ARCHIVE BOARD =======================
const archiveBoard = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    const board = await prisma.board.findUnique({ where: { id: boardId } });

    if (!board) return res.status(404).json({ message: "Board not found" });

    await prisma.board.update({
      where: { id: boardId },
      data: { status: "archived", archivedAt: new Date() },
    });

    await prisma.boardAudit.create({
      data: {
        boardId,
        actorId: req.user.id,
        action: "archived",
        details: { message: `Board "${board.title}" archived.` },
      },
    });

    res.json({ message: "Board archived successfully." });
  } catch (err) {
    console.error("Error archiving board:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= UNARCHIVE BOARD =======================
const unarchiveBoard = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    const board = await prisma.board.findUnique({ where: { id: boardId } });

    if (!board) return res.status(404).json({ message: "Board not found" });

    await prisma.board.update({
      where: { id: boardId },
      data: { status: "active", archivedAt: null },
    });

    await prisma.boardAudit.create({
      data: {
        boardId,
        actorId: req.user.id,
        action: "unarchived",
        details: { message: `Board "${board.title}" unarchived.` },
      },
    });

    res.json({ message: "Board unarchived successfully." });
  } catch (err) {
    console.error("Error unarchiving board:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= GET ALL ARCHIVED BOARDS =======================
const getAllArchivedBoards = async (req, res) => {
  try {
    const userId = req.user.id;
    const boards = await prisma.board.findMany({
      where: { members: { some: { userId } }, status: "archived" },
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
      orderBy: { archivedAt: "desc" },
    });

    res.json({ boards });
  } catch (err) {
    console.error("Error fetching archived boards:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= GET ARCHIVED BOARD BY ID =======================
const getArchivedBoardById = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    const userId = req.user.id;

    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        status: "archived",
        members: { some: { userId } },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    if (!board)
      return res
        .status(404)
        .json({ message: "Board not found or not archived" });

    res.json(board);
  } catch (err) {
    console.error("Error fetching archived board:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= MOVE BOARD TO TRASH =======================
const moveBoardToTrash = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    const board = await prisma.board.findUnique({ where: { id: boardId } });

    if (!board) return res.status(404).json({ message: "Board not found" });

    await prisma.board.update({
      where: { id: boardId },
      data: { status: "trashed", trashedAt: new Date() },
    });

    await prisma.boardAudit.create({
      data: {
        boardId,
        actorId: req.user.id,
        action: "moved_to_trash",
        details: { message: `Board "${board.title}" moved to trash.` },
      },
    });

    res.json({ message: "Board moved to trash successfully." });
  } catch (err) {
    console.error("Error moving board to trash:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= RESTORE BOARD FROM TRASH =======================
const restoreBoardFromTrash = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    const board = await prisma.board.findUnique({ where: { id: boardId } });

    if (!board) return res.status(404).json({ message: "Board not found" });

    await prisma.board.update({
      where: { id: boardId },
      data: { status: "active", trashedAt: null },
    });

    await prisma.boardAudit.create({
      data: {
        boardId,
        actorId: req.user.id,
        action: "restored_from_trash",
        details: { message: `Board "${board.title}" restored from trash.` },
      },
    });

    res.json({ message: "Board restored successfully." });
  } catch (err) {
    console.error("Error restoring board:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= PERMANENTLY DELETE BOARD =======================
const permanentlyDeleteBoard = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    const board = await prisma.board.findUnique({ where: { id: boardId } });

    if (!board) return res.status(404).json({ message: "Board not found" });

    await prisma.boardAudit.create({
      data: {
        boardId: board.id,
        actorId: req.user.id,
        action: "permanently_deleted",
        details: { message: `Board "${board.title}" permanently deleted.` },
      },
    });

    await prisma.board.delete({ where: { id: boardId } });

    res.json({ message: "Board permanently deleted." });
  } catch (err) {
    console.error("Error permanently deleting board:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= GET ALL TRASHED BOARDS =======================
const getAllTrashedBoards = async (req, res) => {
  try {
    const userId = req.user.id;
    const boards = await prisma.board.findMany({
      where: { members: { some: { userId } }, status: "trashed" },
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
      orderBy: { trashedAt: "desc" },
    });

    res.json({ boards });
  } catch (err) {
    console.error("Error fetching trashed boards:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= EXPORT =======================
module.exports = {
  getAllBoards,
  getBoardDetails,
  createBoard,
  updateBoard,
  archiveBoard,
  unarchiveBoard,
  getAllArchivedBoards,
  getArchivedBoardById,
  getAllTrashedBoards,
  moveBoardToTrash,
  restoreBoardFromTrash,
  permanentlyDeleteBoard,
};
