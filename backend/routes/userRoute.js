const express = require("express");
const router = express.Router();
const { registerUser, loginUser, refreshToken, logoutUser} = require("../controllers/userController");

router.get("/", (req, res) => {
  res.send("Home");
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

module.exports = router;
