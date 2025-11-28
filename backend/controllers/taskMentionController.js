const prisma = require("../config/db");

// ✅ Add Mention
const addMention = async (req, res) => {
  try {
    const { taskId, userId } = req.body;

    if (!taskId || !userId) {
      return res.status(400).json({ message: "Task ID and User ID are required." });
    }

    // Check if task exists
    const task = await prisma.task.findUnique({ where: { id: parseInt(taskId) } });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if mention already exists
    const existingMention = await prisma.taskMention.findFirst({
      where: {
        taskId: parseInt(taskId),
        userId: parseInt(userId),
      },
    });

    if (existingMention) {
      return res.status(409).json({ message: "User is already mentioned in this task." });
    }

    const newMention = await prisma.taskMention.create({
      data: {
        taskId: parseInt(taskId),
        userId: parseInt(userId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            // Add other user fields if needed for frontend display
          },
        },
      },
    });

    res.status(201).json(newMention);
  } catch (err) {
    console.error("Error adding mention:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Remove Mention
const removeMention = async (req, res) => {
  try {
    const { id } = req.params;

    const mention = await prisma.taskMention.findUnique({
      where: { id: parseInt(id) },
    });

    if (!mention) {
      return res.status(404).json({ message: "Mention not found." });
    }

    await prisma.taskMention.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Mention removed successfully." });
  } catch (err) {
    console.error("Error removing mention:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Mentions for a Task
const getMentions = async (req, res) => {
  try {
    const { taskId } = req.params;

    const mentions = await prisma.taskMention.findMany({
      where: { taskId: parseInt(taskId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(mentions);
  } catch (err) {
    console.error("Error fetching mentions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addMention,
  removeMention,
  getMentions,
};
