const express = require("express");
const { createInvite, acceptInvite, validateInvite, getPendingInvites, cancelInvite} = require("../controllers/inviteController");
const { protect } = require("../middleware/authMiddleware");
const { checkBoardMember, authorizeBoardRoles } = require("../middleware/boardAuth");

const router = express.Router();

router.post("/accept", protect, acceptInvite);

router.post("/:boardId", protect, checkBoardMember, authorizeBoardRoles("Owner","Admin"), createInvite);

router.get("/validate", validateInvite);

router.get("/:boardId/admin", protect, checkBoardMember, getPendingInvites);

router.delete("/:inviteId/cancel",protect,cancelInvite);


module.exports = router;