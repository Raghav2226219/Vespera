const express = require("express");
const { createInvite, acceptInvite, validateInvite, getPendingInvites} = require("../controllers/inviteController");
const { protect } = require("../middleware/authMiddleware");
const { checkBoardMember, authorizeBoardRoles } = require("../middleware/boardAuth");

const router = express.Router();

router.post("/accept", protect, acceptInvite);

router.post("/:boardId", protect, checkBoardMember, authorizeBoardRoles("Owner"), createInvite);

router.get("/validate", validateInvite);

router.get("/:boardId/admin", protect, checkBoardMember, getPendingInvites);

module.exports = router;