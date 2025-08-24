const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.User.create({
      data: {
        email,
        name,
        phonenumber,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({
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

    if (!email || !password) {
      return res.status(400).json({ message: "Enter all fields!!" });
    }

    const user = await prisma.User.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);

    const refreshTokenValue = generateRefreshToken(user);

    await prisma.User.update({
      where: { id: user.id },
      data: { refreshToken: refreshTokenValue },
    });

    return res.status(200).json({
      message: "Welcome Back",
      accessToken,
      refreshToken: refreshTokenValue,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login failed: ", err);
    res.status(500).json({ message: "Some error occured" });
  }
};

const handleRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await prisma.User.findUnique({ where: { id: decoded.id } });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Error refreshing token: ", err);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(404).json({ message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    await prisma.User.update({
      where: { id: decoded.id },
      data: { refreshToken: null },
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout failed: ",err);
    res.status(500).json({ message : "Some error occured"});
  }
};

module.exports = { registerUser, loginUser, refreshToken: handleRefreshToken, logoutUser};
