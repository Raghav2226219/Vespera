const express = require("express");
const {protect, authorize} = require("../middleware/authMiddleware");
const { createProfile, getProfile, updateProfile, deleteProfile, getAllProfiles} = require("../controllers/profileController");

const router = express.Router();

router.post("/create",protect,createProfile);
router.get("/me",protect,getProfile);
router.put("/update",protect,updateProfile);
router.delete("/delete",protect,deleteProfile);
router.delete("/delete/:userId", protect, authorize("Owner"), deleteProfile);
router.get("/all",protect,authorize("Owner"), getAllProfiles);

module.exports = router;