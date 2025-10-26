const prisma = require("../config/db");

// ✅ Create new task (always goes to "To Do" column)
const createTask = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required." });
    }

    // Find "To Do" column
    const todoColumn = await prisma.column.findFirst({
      where: { boardId: parseInt(boardId),   name: { in: ["To Do", "Todo", "ToDo"], mode: "insensitive" },},
    });

    if (!todoColumn) {
      return res.status(404).json({ message: 'Default "To Do" column not found.' });
    }

    // Get next position
    const maxPosition = await prisma.task.aggregate({
      where: { columnId: todoColumn.id },
      _max: { position: true },
    });

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        columnId: todoColumn.id,
        position: (maxPosition._max.position || 0) + 1,
      },
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error creating task: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update task
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: { title, description },
    });

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Move task (Drag & Drop)
const moveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { targetColumnId, newPosition } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.update({
      where: { id: task.id },
      data: {
        columnId: parseInt(targetColumnId),
        position: parseInt(newPosition),
      },
    });

    res.json({ message: "Task moved successfully" });
  } catch (err) {
    console.error("Error moving task: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete task
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    await prisma.task.delete({
      where: { id: parseInt(taskId) },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTask,
  updateTask,
  moveTask,
  deleteTask,
};
