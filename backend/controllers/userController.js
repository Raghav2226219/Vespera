const prisma = require("../config/db");
const bcrypt = require("bcrypt");

const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const registerUser = async (req, res) => {
  try {
    const { email, name, phonenumber, password, role } = req.body;

    if (!email || !name || !phonenumber || !password || !role) {
      return res.status(400).json({ message: "Fill all fields" });
    }

    const existUser = await prisma.User.findUnique({
      where: { email },
    });

    if (existUser) {
      return res.status(400).json({ message: "User already exists!!" });
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = await prisma.User.create({
      data: {
        email,
        name,
        phonenumber,
        password : hashedPassword,
        role,
      },
    });

    res.status(201).json({
      message : "Registration Successful",
      user : { id : newUser.id, email : newUser.email, name : newUser.name, role : newUser.role }
    });
    
  } catch (err) {
    console.error("Error Registering user: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Enter all fields!!" });
    }

    const user = await prisma.User.findUnique({
      where: { email: email },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid password or email" });
    }

    return res.status(200).json({ message: "Welcome Back" });
  } catch (err) {
    console.error("Login failed: ", err);
    res.status(500).json({ message: "Some error occured" });
  }
};

module.exports = { registerUser, loginUser };
