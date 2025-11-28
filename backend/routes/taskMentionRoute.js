const express = require("express");
const router = express.Router();
const {
  addMention,
  removeMention,
  getMentions,
} = require("../controllers/taskMentionController");

// Add a mention
router.post("/", addMention);

// Remove a mention
router.delete("/:id", removeMention);

// Get mentions for a task
router.get("/:taskId", getMentions);

module.exports = router;
