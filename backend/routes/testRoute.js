// routes/testRoute.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.get("/test-cookie", protect, (req, res) => {
  res.json({
    success: true,
    message: "Cookie received and verified ✅",
    user: req.user,
  });
});

module.exports = router;
