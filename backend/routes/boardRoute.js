const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { checkBoardMember, authorizeBoardRoles } = require("../middleware/boardAuth");
const {
  getAllBoards,
  getBoardDetails,
  createBoard,
  updateBoard,
  archiveBoard,
  unarchiveBoard,
  moveBoardToTrash,
  restoreBoardFromTrash,
  permanentlyDeleteBoard,
} = require("../controllers/boardController");

const router = express.Router();

// ✅ Get all boards
router.get("/all", protect, getAllBoards);

// ✅ Create new board
router.post("/create", protect, createBoard);

// ✅ Get board details
router.get("/:boardId", protect, checkBoardMember, getBoardDetails);

// ✅ Update board (only Owner)
router.put("/:boardId", protect, checkBoardMember, authorizeBoardRoles("Owner"), updateBoard);

// ✅ Archive board
router.patch("/:boardId/archive", protect, checkBoardMember, authorizeBoardRoles("Owner"), archiveBoard);

// ✅ Unarchive board
router.patch("/:boardId/unarchive", protect, checkBoardMember, authorizeBoardRoles("Owner"), unarchiveBoard);

// ✅ Move board to Trash (soft delete)
router.patch("/:boardId/trash", protect, checkBoardMember, authorizeBoardRoles("Owner"), moveBoardToTrash);

// ✅ Restore board from Trash
router.patch("/:boardId/restore", protect, checkBoardMember, authorizeBoardRoles("Owner"), restoreBoardFromTrash);

// ✅ Permanently delete board (after 15 days or manual)
router.delete("/:boardId/permanent", protect, checkBoardMember, authorizeBoardRoles("Owner"), permanentlyDeleteBoard);

module.exports = router;
