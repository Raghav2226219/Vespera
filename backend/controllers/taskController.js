const prisma = require("../config/db");

// ✅ Create Task
const createTask = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ message: "Task title is required." });

    const todoColumn = await prisma.column.findFirst({
      where: {
        boardId: parseInt(boardId),
        OR: [
          { name: { equals: "To Do", mode: "insensitive" } },
          { name: { equals: "Todo", mode: "insensitive" } },
          { name: { equals: "ToDo", mode: "insensitive" } },
        ],
      },
    });

    if (!todoColumn)
      return res.status(404).json({ message: 'Default "To Do" column not found.' });

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
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title, description },
    });

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Move Task (Drag & Drop)
const moveTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetColumnId, newPosition } = req.body;

    // ✅ Fix: Allow position 0 and check for undefined
    if (targetColumnId === undefined || newPosition === undefined) {
      return res
        .status(400)
        .json({ message: "targetColumnId and newPosition are required." });
    }

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const oldColumnId = task.columnId;
    const newColumnId = parseInt(targetColumnId);
    const newPos = parseInt(newPosition);

    await prisma.$transaction(async (tx) => {
      // Adjust positions in old column
      await tx.task.updateMany({
        where: { columnId: oldColumnId, position: { gt: task.position } },
        data: { position: { decrement: 1 } },
      });

      // Shift tasks in the new column to make space
      await tx.task.updateMany({
        where: { columnId: newColumnId, position: { gte: newPos } },
        data: { position: { increment: 1 } },
      });

      // Finally, move the task
      await tx.task.update({
        where: { id: parseInt(id) },
        data: { columnId: newColumnId, position: newPos },
      });
    });

    res.json({ message: "Task moved successfully." });
  } catch (err) {
    console.error("Error moving task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id);

    if (isNaN(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    // ✅ Optional: check if task exists before deleting
    const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ Delete task safely
    await prisma.task.delete({
      where: { id: taskId },
    });

    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting task:", err);

    // ✅ Handle foreign key constraint error
    if (err.code === "P2003") {
      return res.status(409).json({
        message:
          "Cannot delete task because it is still referenced by another record.",
      });
    }

    res.status(500).json({ message: "Server error while deleting task." });
  }
};


module.exports = {
  createTask,
  updateTask,
  moveTask,
  deleteTask,
};
