const prisma = require("../config/db");

const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, phoneNumber, dob, gender, address, bio, profilePic } =
      req.body;

    const existingProfile = await prisma.Profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const newProfile = await prisma.Profile.create({
      data: {
        userId,
        name,
        phoneNumber,
        dob: dob ? new Date(dob) : null,
        gender,
        address,
        bio,
        profilePic,
      },
    });

    return res
      .status(200)
      .json({ message: "Profile created successfully", newProfile });
  } catch (err) {
    console.error("Error creating profile: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await prisma.Profile.findUnique({
      where: { userId },
      include: { user: false },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json(profile);
  } catch (err) {
    console.error("Error fetching details: ", err);
    res.status(500).json({ message: "Internal server error"});
  }
};

const updateProfile = async (req,res) => {
    try{
        const userId = req.user.id;

        const {name, phoneNumber, dob, gender, address, bio, profilePic } = req.body;

        const profile = await prisma.Profile.update({
            where: {userId},
            data: {
                name,
                phoneNumber,
                dob : dob ? new Date(dob) : null,
                gender,
                address,
                bio,
                profilePic
            }
        });

        return res.json({ message: "Profile updated successfully", profile});

    }catch(err){
        console.error("Error updating profile : ", err);
        res.status(500).json({ message: "Internal server error"});
    }
};

const deleteProfile = async (req,res) => {
    try{

        if(!req.user){
            return res.status(401).json({ message: "Not authorized"});
        }

        const targetUserId = req.user.id;

        if(req.params.userId && req.user.role === "Owner"){
            const parsed = parseInt(req.params.userId, 10);

            if(!Number.isInteger(parsed)){
                return res.status(400).json({message: "Invalid userId parameter "});
            }

            targetUserId = parsed;
        }

        const profile = await prisma.Profile.findUnique({
            where : { userId: targetUserId}
        });

        if(!profile){
            return res.status(404).json({message: "Profile not found!"});
        }

        await prisma.Profile.delete({
            where : {userId : targetUserId}
        });

        return res.status(200).json({ message : "Profile deleted successfully"});

    }catch(err){
        console.error("Error deleting profile: ",err);
        res.status(500).json({message : "Internal server error"});
    }
}

module.exports = {createProfile, getProfile, updateProfile, deleteProfile};
