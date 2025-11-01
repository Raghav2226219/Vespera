const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { checkBoardMember, authorizeBoardRoles } = require("../middleware/boardAuth");
const {
  getAllBoards,
  getBoardDetails,
  getAllArchivedBoards,
  getArchivedBoardById,
  getAllTrashedBoards,
  createBoard,
  updateBoard,
  archiveBoard,
  unarchiveBoard,
  moveBoardToTrash,
  restoreBoardFromTrash,
  permanentlyDeleteBoard,
} = require("../controllers/boardController");

const router = express.Router();

// ✅ Active boards
router.get("/all", protect, getAllBoards);
router.get("/:boardId", protect, checkBoardMember, getBoardDetails);

// ✅ Archived boards
router.get("/archived/all", protect, getAllArchivedBoards);
router.get("/archived/:boardId", protect, getArchivedBoardById);

// ✅ Trashed boards
router.get("/trashed/all", protect, getAllTrashedBoards);

// ✅ Create & Modify
router.post("/create", protect, createBoard);
router.put("/:boardId", protect, checkBoardMember, authorizeBoardRoles("Owner"), updateBoard);

// ✅ Archive / Unarchive / Trash / Restore / Delete
router.patch("/:boardId/archive", protect, checkBoardMember, authorizeBoardRoles("Owner"), archiveBoard);
router.patch("/:boardId/unarchive", protect, checkBoardMember, authorizeBoardRoles("Owner"), unarchiveBoard);
router.patch("/:boardId/trash", protect, checkBoardMember, authorizeBoardRoles("Owner"), moveBoardToTrash);
router.patch("/:boardId/restore", protect, checkBoardMember, authorizeBoardRoles("Owner"), restoreBoardFromTrash);
router.delete("/:boardId/permanent", protect, checkBoardMember, authorizeBoardRoles("Owner"), permanentlyDeleteBoard);

module.exports = router;
