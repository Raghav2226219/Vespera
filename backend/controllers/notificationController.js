const prisma = require("../config/db");

// Get notifications for the logged-in user
const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit to last 20 notifications
    });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { read: true },
    });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

// Internal helper to create a notification
const createNotification = async (userId, message, type = "SYSTEM") => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        message,
        type,
      },
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  createNotification,
};
