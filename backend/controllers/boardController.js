const prisma = require("../config/db");

const getAllBoards = async (req, res) => {
  try {
    const userId = req.user.Id;

    const boards = await prisma.Board.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            role: true,
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        owner: {
          select: { id: true, name: true, email: true },
        },
      }
    });

    res.json({ boards });

  } catch (err) {
    console.error("Get boards error: ", err);
    res.status(500).json({ message: "Server error"});
  }
};

const getBoardDetails = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);

    const board = await prisma.Board.findUnique({
      where: { id: boardId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
        },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json(board);
  } catch (err) {
    console.error("Error fetching board details: ", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const createBoard = async (req, res) => {
  try {
    const { title, description } = req.body;

    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const existingBoard = await prisma.board.findFirst({
      where: { ownerId: userId, title },
    });

    if (existingBoard) {
      return res
        .status(400)
        .json({ message: "Board already exists with similar title" });
    }

    const board = await prisma.Board.create({
      data: {
        title,
        description,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "Owner",
          },
        },
      },
    });

    res.status(201).json(board);
  } catch (err) {
    console.error("Error creating board: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateBoard = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    const { title, description } = req.body;

    const updatboard = await prisma.board.update({
      where: { id: boardId },
      data: {
        title,
        description,
      },
      select: {
        id: true,
        title : true,
        description : true
      }
    });

    res.json(updatboard);
  } catch (err) {
    console.error("Error updating board: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);

    await prisma.Board.delete({
      where: { id: boardId },
    });

    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    console.error("Error deleting board", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllBoards, getBoardDetails, createBoard, updateBoard, deleteBoard };
