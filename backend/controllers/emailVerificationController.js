// controllers/emailVerificationController.js

const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email"); // You already use this in invites

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/* -----------------------------------------------------
   📌 1. SEND VERIFICATION OTP
----------------------------------------------------- */
exports.sendVerificationOTP = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the user's email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, emailVerified: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    // Create OTP entry
    await prisma.emailVerification.create({
      data: {
        userId,
        otpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    // Send OTP email
    await sendEmail({
      to: user.email,
      subject: "Your Email Verification OTP",
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    });

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending verification OTP:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* -----------------------------------------------------
   📌 2. VERIFY OTP
----------------------------------------------------- */
exports.verifyEmailOTP = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    // Find the latest unused OTP for this user
    const otpEntry = await prisma.emailVerification.findFirst({
      where: {
        userId,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpEntry) {
      return res.status(400).json({ message: "No valid OTP found or OTP expired" });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, otpEntry.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark OTP as used
    await prisma.emailVerification.update({
      where: { id: otpEntry.id },
      data: { used: true },
    });

    // Mark user email as verified
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    return res.json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
