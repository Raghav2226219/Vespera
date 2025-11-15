const express = require("express");
const router = express.Router();
const {
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} = require("../controllers/taskController");

router.post("/:boardId/:columnId", createTask);
router.put("/:id", updateTask);
router.put("/move/:id", moveTask); // ✅ important
router.delete("/:id", deleteTask);

module.exports = router;
