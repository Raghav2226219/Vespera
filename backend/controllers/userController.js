// controllers/userController.js
const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Issue JWT and set httpOnly cookie
const issueTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
  httpOnly: true,
  sameSite: "none",   // allow cross-origin cookie
  secure: true,       // required for sameSite: 'none' (even on localhost via HTTPS)
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
  return token;
};

const registerUser = async (req, res) => {
  try {
    const { email, name, phonenumber, password, role } = req.body;

    if (!email || !name || !phonenumber || !password || !role) {
      return res.status(400).json({ message: "Fill all fields" });
    }

    const existUser = await prisma.User.findUnique({ where: { email } });
    if (existUser) return res.status(400).json({ message: "User already exists!!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.User.create({
      data: { email, name, phonenumber, password: hashedPassword, role },
    });

    // Auto-login on register (sets cookie)
    issueTokenAndSetCookie(res, newUser.id);

    return res.status(201).json({
      message: "Registration Successful",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Error Registering user: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await prisma.User.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    issueTokenAndSetCookie(res, user.id);

    return res.status(200).json({
      message: "Welcome Back",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login failed: ", err);
    res.status(500).json({ message: "Some error occurred" });
  }
};

const verifyUser = async (req, res) => {
  // `protect` middleware attaches req.user
  return res.status(200).json({ message: "User is authenticated", user: req.user });
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout failed: ", err);
    res.status(500).json({ message: "Some error occurred" });
  }
};

module.exports = { registerUser, loginUser, verifyUser, logoutUser };
