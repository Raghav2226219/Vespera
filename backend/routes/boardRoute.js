const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {checkBoardMember, authorizeBoardRoles } = require("../middleware/boardAuth");
const {getBoardDetails, createBoard, updateBoard, deleteBoard} = require("../controllers/boardController");

const router = express.Router();

router.post("/create", protect, createBoard);

router.get("/:boardId", protect, checkBoardMember, getBoardDetails);

router.put("/:boardId", protect, checkBoardMember, authorizeBoardRoles("Owner"), updateBoard);

router.delete("/:boardId", protect, checkBoardMember, authorizeBoardRoles("Owner"), deleteBoard);

module.exports = router;