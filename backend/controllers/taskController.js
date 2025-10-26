const prisma = require("../config/db");

// ✅ Create new task in a column
const createTask = async (req, res) => {
  try {
    const { boardId, columnId } = req.params;
    const { title, description, assignedTo } = req.body;

    const column = await prisma.column.findUnique({
      where: { id: parseInt(columnId) },
    });

    if (!column || column.boardId !== parseInt(boardId)) {
      return res.status(404).json({ message: "Column not found in this board" });
    }

    // find position (max + 1)
    const maxPosition = await prisma.task.aggregate({
      where: { columnId: parseInt(columnId) },
      _max: { position: true },
    });

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        columnId: parseInt(columnId),
        assignedTo: assignedTo ? parseInt(assignedTo) : null,
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
    const { title, description, assignedTo } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: {
        title,
        description,
        assignedTo: assignedTo ? parseInt(assignedTo) : null,
      },
    });

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Move Task (Drag-Drop)
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

// ✅ Delete Task
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
