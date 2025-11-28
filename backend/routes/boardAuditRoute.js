const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getBoardAudits, getAllBoardAudits } = require("../controllers/boardAuditController");

router.get("/board/:boardId", protect, getBoardAudits);
router.get("/all", protect, getAllBoardAudits);

module.exports = router;
