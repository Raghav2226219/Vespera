const express = require("express");
const router = express.Router();
const {registerUser} = require("../controllers/userController");

router.get("/", (req,res) => {
    res.send("Home");
})

router.post("/register", registerUser);

module.exports = router;
