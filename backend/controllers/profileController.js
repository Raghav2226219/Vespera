// controllers/profileController.js
const prisma = require("../config/db");

/* ---------------------------------------------------------
   CREATE PROFILE
   - name and phoneNumber come from User table, not frontend
--------------------------------------------------------- */
const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { dob, gender, address, bio } = req.body;

    // Check if profile exists
    const existingProfile = await prisma.Profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    // Fetch user details for name/phone
    const user = await prisma.User.findUnique({
      where: { id: userId },
      select: {
        name: true,
        phonenumber: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User record not found" });
    }

    // Create profile
    const newProfile = await prisma.Profile.create({
      data: {
        userId,
        name: user.name,               // Auto-filled
        phoneNumber: user.phonenumber, // Auto-filled
        dob: dob ? new Date(dob) : null,
        gender,
        address,
        bio,
      },
    });

    return res.status(200).json({
      message: "Profile created successfully",
      newProfile,
    });
  } catch (err) {
    console.error("Error creating profile: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ---------------------------------------------------------
   GET PROFILE
   - Includes only safe user details (no password)
--------------------------------------------------------- */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await prisma.Profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            emailVerified: true,
            phonenumber: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json(profile);
  } catch (err) {
    console.error("Error fetching details: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ---------------------------------------------------------
   UPDATE PROFILE
   - Updates User (name, phonenumber) and upserts Profile
   - This ensures Profile table stays in sync with User
--------------------------------------------------------- */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phoneNumber, dob, gender, address, bio } = req.body;

    // Update the user basic info (name + phonenumber)
    await prisma.User.update({
      where: { id: userId },
      data: {
        name: name,
        phonenumber: phoneNumber,
      },
    });

    // Upsert the profile so we update if exists, or create if not
    const profile = await prisma.Profile.upsert({
      where: { userId },
      update: {
        name: name,
        phoneNumber: phoneNumber,
        dob: dob ? new Date(dob) : null,
        gender,
        address,
        bio,
      },
      create: {
        userId,
        name: name,
        phoneNumber: phoneNumber,
        dob: dob ? new Date(dob) : null,
        gender,
        address,
        bio,
      },
    });

    // Return profile with safe user info
    const profileWithUser = await prisma.Profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            emailVerified: true,
            phonenumber: true,
          },
        },
      },
    });

    return res.json({ message: "Profile updated successfully", profile: profileWithUser });
  } catch (err) {
    console.error("Error updating profile : ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ---------------------------------------------------------
   DELETE PROFILE
--------------------------------------------------------- */
const deleteProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    let targetUserId = req.user.id;

    if (req.params.userId && req.user.role === "Owner") {
      const parsed = parseInt(req.params.userId, 10);
      if (!Number.isInteger(parsed)) {
        return res.status(400).json({ message: "Invalid userId parameter " });
      }
      targetUserId = parsed;
    }

    const profile = await prisma.Profile.findUnique({
      where: { userId: targetUserId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found!" });
    }

    await prisma.Profile.delete({
      where: { userId: targetUserId },
    });

    return res.status(200).json({ message: "Profile deleted successfully" });
  } catch (err) {
    console.error("Error deleting profile: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ---------------------------------------------------------
   GET ALL PROFILES
--------------------------------------------------------- */
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await prisma.Profile.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        phoneNumber: true,
        dob: true,
        gender: true,
        address: true,
        bio: true,
      },
    });

    res.status(200).json({ profiles });
  } catch (err) {
    console.error("Error fetching all profiles: ", err);
    res.status(500).json({ message: "Intrnal server error " });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getAllProfiles,
};
