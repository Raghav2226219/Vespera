require("dotenv").config();

const express = require("express");
const app = express();
const cron = require("node-cron");
const prisma = require("./config/db");
const cors = require("cors");

app.use(express.json());

app.use(cors({
  origin : "http://localhost:5173",
  credentials : true,
}))

const userRoute = require("./routes/userRoute");
const profileRoute = require("./routes/profileRoute");
const boardRoute = require("./routes/boardRoute");
const inviteRoute = require("./routes/inviteRoute");
const inviteHistoryRoute = require("./routes/inviteHistoryRoute");
const columnRoutes = require("./routes/columnRoutes");
const taskRoutes = require("./routes/taskRoutes");

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

cron.schedule("0 * * * *", async () => {
  try{
    const cutoff = new Date(Date.now() - 1 * 60 * 60 * 1000);
    const deleted  = await prisma.invite.deleteMany({
      where : {
        cancelled : true,
        cancelledAt : { lt : cutoff},
      },
    });

    if (deleted.count > 0){
      console.log(` Cleaned up ${deleted.count} cancelled invites`);
    }

  }catch(err){
    console.error("Error pruning cancelled invites: ", err);
    
  }
})

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port... ${PORT}`);
});
