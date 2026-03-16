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

    // 📝 Audit Log: Created
    await prisma.taskAudit.create({
      data: {
        taskId: newTask.id,
        boardId: parseInt(boardId),
        actorId: req.user.id,
        action: "created",
        details: {
          title: newTask.title,
          priority: newTask.priority,
          status: todoColumn.name,
          dueDate: null,
          mentions: []
        }
      }
    });

    // 📡 Socket.IO: Emit task created event
    const io = req.app.get("io");
    io.to(`board_${boardId}`).emit("task:created", newTask);

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
    console.log(`Updating task ${id}. Body:`, req.body);
    const { title, description, priority, dueDate } = req.body;

    let updateData = { title, description, priority };
    
    // Only add dueDate to updateData if it's provided (to avoid overwriting with undefined if not sent)
    // But wait, if I want to clear it? The user might send null. 
    // For now, let's assume we are setting it.
    if (dueDate !== undefined) {
        updateData.dueDate = dueDate ? new Date(dueDate) : null; // Ensure it's a Date object or null
    }

    // Auto-update priority based on days remaining
    if (dueDate) {
        const due = new Date(dueDate);
        const now = new Date();
        const diffInMs = due - now;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInDays <= 5) {
            updateData.priority = "HIGH";
        } else if (diffInDays <= 15) {
            updateData.priority = "MEDIUM";
        } else {
            updateData.priority = "LOW";
        }
        console.log(`Auto-setting priority to ${updateData.priority} (Days left: ${diffInDays.toFixed(1)})`);
    }

    console.log("Update data prepared:", updateData);

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { column: true, mentions: { include: { user: { select: { name: true } } } } }
    });

    // 📝 Audit Log: Updated
    await prisma.taskAudit.create({
      data: {
        taskId: updatedTask.id,
        boardId: updatedTask.column.boardId,
        actorId: req.user.id,
        action: "updated",
        details: {
          title: updatedTask.title,
          priority: updatedTask.priority,
          status: updatedTask.column.name,
          dueDate: updatedTask.dueDate,
          mentions: updatedTask.mentions.map(m => m.user.name)
        }
      }
    });

    // 📡 Socket.IO: Emit task updated event
    const io = req.app.get("io");
    io.to(`board_${updatedTask.column.boardId}`).emit("task:updated", updatedTask);

    console.log("Task updated successfully:", updatedTask);
    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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

    // ✅ Run as plain sequential queries to avoid P2028 transaction timeout
    // on remote/cloud databases (no interactive transaction needed here).

    // Step 1: Shift tasks down in the old column (fill the gap left by removed task)
    await prisma.task.updateMany({
      where: { columnId: oldColumnId, position: { gt: task.position } },
      data: { position: { decrement: 1 } },
    });

    // Step 2: Shift tasks up in the destination column (make room at newPos)
    await prisma.task.updateMany({
      where: { columnId: newColumnId, position: { gte: newPos } },
      data: { position: { increment: 1 } },
    });

    // Step 3: Move the task to its new column and position
    const movedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { columnId: newColumnId, position: newPos },
      include: { column: true },
    });

    // 📝 Audit Log: Moved
    await prisma.taskAudit.create({
      data: {
        taskId: movedTask.id,
        boardId: movedTask.column.boardId,
        actorId: req.user.id,
        action: "moved",
        details: {
          title: movedTask.title,
          priority: movedTask.priority,
          status: movedTask.column.name,
          fromColumnId: oldColumnId,
          toColumnId: newColumnId,
        },
      },
    });

    // 📡 Socket.IO: Emit task moved event
    const io = req.app.get("io");
    io.to(`board_${movedTask.column.boardId}`).emit("task:moved", {
      taskId: movedTask.id,
      sourceColumnId: oldColumnId,
      targetColumnId: newColumnId,
      newPosition: newPos,
      task: movedTask // Send full task in case it's needed
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
    // First fetch details for audit
    const taskToDelete = await prisma.task.findUnique({
        where: { id: taskId },
        include: { column: true }
    });

    if (taskToDelete) {
        await prisma.taskAudit.create({
            data: {
                taskId: null, // Task is being deleted, but we can keep ID if we want, but relation is SetNull. 
                              // Actually, if we set taskId here, and then delete task, it will be set to null by DB.
                              // So we can set it.
                // Wait, if we delete the task in the next step, the relation sets it to null.
                // But we want to preserve the history.
                // The `taskId` field in TaskAudit is Int?.
                // If we set it to `taskId`, it will become null.
                // But we can store the ID in details if we want to search by it later (though hard).
                boardId: taskToDelete.column.boardId,
                actorId: req.user.id,
                action: "deleted",
                details: {
                    title: taskToDelete.title,
                    priority: taskToDelete.priority,
                    status: taskToDelete.column.name,
                    taskId: taskToDelete.id // Store ID in details
                }
            }
        });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    // 📡 Socket.IO: Emit task deleted event
    // We need boardId to broadcast. We can get it from taskToDelete (fetched above).
    if (taskToDelete) {
        const io = req.app.get("io");
        io.to(`board_${taskToDelete.column.boardId}`).emit("task:deleted", {
            taskId: taskId,
            columnId: taskToDelete.columnId
        });
    }

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
