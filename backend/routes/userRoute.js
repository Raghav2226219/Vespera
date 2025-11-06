// routes/userRoute.js
const express = require("express");
const { registerUser, loginUser, verifyUser, logoutUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", (req, res) => res.send("Home"));
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Check session via cookie
router.get("/verify", protect, verifyUser);

module.exports = router;
