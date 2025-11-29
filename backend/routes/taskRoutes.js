const express = require("express");
const router = express.Router();
const {
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

router.post("/:boardId/:columnId", protect, createTask);
router.put("/:id", protect, updateTask);
router.put("/move/:id", protect, moveTask); // ✅ important
router.delete("/:id", protect, deleteTask);

module.exports = router;
