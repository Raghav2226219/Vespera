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

const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.User.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phonenumber: true,
        role: true,
        emailVerified: true,
        isSuspended: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);

  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateBasicInfo = async (req, res) => {
  try {
    const { name, phonenumber } = req.body;

    const updated = await prisma.User.update({
      where: { id: req.user.id },
      data: { name, phonenumber },
    });

    res.json({ message: "User updated", user: updated });
  } catch (err) {
    console.error("User update failed:", err);
    res.status(500).json({ message: "Internal error" });
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

    // Log login activity
    await prisma.systemLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

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
    res.status(500).json({ message: "Some error occurred" });
  }
};

const requestUnsuspend = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.User.findUnique({ where: { id: userId } });

    if (!user.isSuspended) {
      return res.status(400).json({ message: "User is not suspended" });
    }

    const { reason } = req.body;

    // Find all admins
    const admins = await prisma.User.findMany({
      where: { role: "Admin" },
    });

    // Create notification for each admin
    const notifications = admins.map((admin) => ({
      userId: admin.id,
      message: `User ${user.name} (${user.email}) has requested to be unsuspended. Reason: "${reason || "No reason provided"}"`,
      type: "ALERT",
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    res.json({ message: "Request sent to admins" });
  } catch (error) {
    console.error("Error requesting unsuspend:", error);
    res.status(500).json({ message: "Failed to send request" });
  }
};

module.exports = { registerUser, loginUser, verifyUser, logoutUser, getMe, updateBasicInfo, requestUnsuspend };
