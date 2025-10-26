const express = require("express");
const {
  getColumnsByBoard,
  renameColumn,
  reorderColumns,
} = require("../controllers/columnController");
const { protect } = require("../middleware/authMiddleware");
const { checkBoardMember } = require("../middleware/boardAuth");

const router = express.Router();

// ✅ Get all columns with tasks for a board
router.get("/:boardId", protect, checkBoardMember, getColumnsByBoard);

// ✅ Rename a column
router.put("/:boardId/:columnId/rename", protect, checkBoardMember, renameColumn);

// ✅ Reorder columns
router.put("/:boardId/reorder", protect, checkBoardMember, reorderColumns);

module.exports = router;
