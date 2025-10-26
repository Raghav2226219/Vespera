const express = require("express");
const {
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { checkBoardMember } = require("../middleware/boardAuth");

const router = express.Router();

// ✅ Create a task in a column
router.post("/:boardId/:columnId", protect, checkBoardMember, createTask);

// ✅ Update task details
router.put("/:taskId", protect, checkBoardMember, updateTask);

// ✅ Move task between columns (drag-drop)
router.put("/move/:taskId", protect, checkBoardMember, moveTask);

// ✅ Delete task
router.delete("/:taskId", protect, checkBoardMember, deleteTask);

module.exports = router;
