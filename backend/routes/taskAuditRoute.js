const express = require("express");
const router = express.Router();
const { getTaskAudits, getAllTaskAudits } = require("../controllers/taskAuditController");
const { protect } = require("../middleware/authMiddleware");

router.get("/task/:taskId", protect, getTaskAudits);
router.get("/all", protect, getAllTaskAudits);

module.exports = router;
