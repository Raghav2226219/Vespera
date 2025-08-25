require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

const userRoute = require("./routes/userRoute");
const profileRoute = require("./routes/profileRoute");

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoute);
app.use("/api/profile", profileRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port... ${PORT}`);
});
