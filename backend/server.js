require("dotenv").config();

const express = require("express");
const app = express();
const cron = require("node-cron");
const prisma = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser"); 

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // ← allow cookies
  })
);

// ====== ROUTES ======
const userRoute = require("./routes/userRoute");
const profileRoute = require("./routes/profileRoute");
const boardRoute = require("./routes/boardRoute");
const inviteRoute = require("./routes/inviteRoute");
const inviteHistoryRoute = require("./routes/inviteHistoryRoute");
const columnRoutes = require("./routes/columnRoutes");
const taskRoutes = require("./routes/taskRoutes");
const testRoute = require("./routes/testRoute");
const emailVerificationRoute = require("./routes/emailVerificationRoute");
const taskMentionRoute = require("./routes/taskMentionRoute");
const boardAuditRoutes = require("./routes/boardAuditRoute");
const taskAuditRoutes = require("./routes/taskAuditRoute");

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/board", boardRoute);
app.use("/api/invites", inviteRoute);
app.use("/api/invite-history", inviteHistoryRoute);
app.use("/api/columns", columnRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/test", testRoute);
app.use("/api/email", emailVerificationRoute);
app.use("/api/task-mentions", taskMentionRoute);
app.use("/api/board-audits", boardAuditRoutes);
app.use("/api/task-audits", taskAuditRoutes);

// ====== EXISTING CRON: Clean cancelled invites every hour ======
cron.schedule("0 * * * *", async () => {
  try {
    const cutoff = new Date(Date.now() - 1 * 60 * 60 * 1000);
    const deleted = await prisma.invite.deleteMany({
      where: {
        cancelled: true,
        cancelledAt: { lt: cutoff },
      },
    });

    if (deleted.count > 0) {
      console.log(`🧹 Cleaned up ${deleted.count} cancelled invites`);
    }
  } catch (err) {
    console.error("Error pruning cancelled invites:", err);
  }
});


// ====== 🧩 NEW CRON: Auto-delete trashed boards after 15 days ======
cron.schedule("0 1 * * *", async () => {  // Runs daily at 1 AM
  try {
    const cutoff = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000); // 15 days ago

    // Find all trashed boards older than 15 days
    const oldBoards = await prisma.board.findMany({
      where: {
        isTrashed: true,
        trashedAt: { lt: cutoff },
      },
      select: { id: true, title: true, ownerId: true },
    });

    if (oldBoards.length > 0) {
      for (const board of oldBoards) {
        await prisma.board.delete({ where: { id: board.id } });

        // Log deletion
        await prisma.actionLog.create({
          data: {
            boardId: board.id,
            userId: board.ownerId,
            action: "AUTO_DELETED",
            description: `Board "${board.title}" auto-deleted after 15 days in trash.`,
          },
        });
      }

      console.log(`🗑️ Auto-deleted ${oldBoards.length} trashed boards.`);
    }
  } catch (err) {
    console.error("Error auto-deleting trashed boards:", err);
  }
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
