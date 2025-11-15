// routes/emailVerificationRoute.js

const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  sendVerificationOTP,
  verifyEmailOTP,
} = require("../controllers/emailVerificationController");

// Send OTP
router.post("/send", protect, sendVerificationOTP);

// Verify OTP
router.post("/verify", protect, verifyEmailOTP);

module.exports = router;
