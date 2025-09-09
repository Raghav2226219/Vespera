const express = require("express");
const { getInviteHistory } = require("../controllers/inviteHistoryController");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:boardId", protect, getInviteHistory);

module.exports = router;