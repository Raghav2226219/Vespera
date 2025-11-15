// routes/inviteHistoryRoute.js
const express = require("express");
const { getInviteHistory, getAllInviteHistory } = require("../controllers/inviteHistoryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// NEW: all boards with filters
router.get("/history", protect, getAllInviteHistory);

// Existing: single board
router.get("/history/:boardId", protect, getInviteHistory);

module.exports = router;
