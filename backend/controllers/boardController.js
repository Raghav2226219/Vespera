const prisma = require("../config/db");
const { createDefaultColumns } = require("./columnController");
const { Role } = require("@prisma/client"); // ✅ Import Role enum

// ======================= GET ALL BOARDS =======================
const getAllBoards = async (req, res) => {
  try {
    const userId = req.user.id;

    const boards = await prisma.board.findMany({
      where: {
        members: { some: { userId } },
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
          include: { user: { select: { id: true, name: true, email: true, role: true } } },
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

    // ✅ Step 0: Check for duplicate title
    const existingBoard = await prisma.board.findFirst({
      where: { ownerId: userId, title },
    });

    if (existingBoard) {
      return res.status(400).json({ message: "You already have a board with this title." });
    }

    // ✅ Step 1: Create board
    const board = await prisma.board.create({
      data: { title, description, ownerId: userId },
    });

    // ✅ Step 2: Add user as board member
    await prisma.boardMember.create({
      data: { userId, boardId: board.id, role: Role.Owner },
    });

    // ✅ Step 3: Create default columns
    await createDefaultColumns(board.id);

    // ✅ Step 4: Fetch full board with columns
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

    if (!title) {
      return res.status(400).json({ message: "Board title is required." });
    }

    // ✅ Step 0: Check for duplicate title for the same owner
    const duplicateBoard = await prisma.board.findFirst({
      where: { ownerId: userId, title, NOT: { id: boardId } }, // exclude current board
    });

    if (duplicateBoard) {
      return res
        .status(400)
        .json({ message: "You already have another board with this title." });
    }

    // ✅ Step 1: Update the board
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
// ======================= DELETE BOARD =======================
const deleteBoard = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);

    await prisma.board.delete({ where: { id: boardId } });

    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    console.error("Error deleting board", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllBoards,
  getBoardDetails,
  createBoard,
  updateBoard,
  deleteBoard,
};
