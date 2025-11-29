const express = require("express");
const { 
  registerUser, 
  loginUser, 
  verifyUser, 
  logoutUser, 
  getMe, 
  updateBasicInfo,
  requestUnsuspend 
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { checkSignupAllowed } = require("../middleware/configMiddleware");

const router = express.Router();

router.get("/", (req, res) => res.send("Home"));
router.post("/register", checkSignupAllowed, registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/me", protect, getMe);
router.put("/update-basic", protect, updateBasicInfo);

// Check session via cookie
router.get("/verify", protect, verifyUser);

router.post("/request-unsuspend", protect, (req, res, next) => {
    // Allow suspended users to access this route
    if (req.user) {
        req.user.isSuspended = false; // Temporarily bypass suspension check if it exists in protect
    }
    next();
}, requestUnsuspend);

module.exports = router;
