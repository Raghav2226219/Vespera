const prisma = require("../config/db");

// ✅ In-memory cache for public config (avoids hammering DB on every poll)
let publicConfigCache = { maintenance: false, allowSignups: true, expiresAt: 0 };
const CACHE_TTL_MS = 60_000; // 60 seconds

// @desc    Get all system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
  try {
    const settings = await prisma.systemConfig.findMany();
    const formattedSettings = {};
    settings.forEach((s) => {
      formattedSettings[s.key] = s.value;
    });

    // Default settings if not present
    const defaults = {
      emailTemplates: {
        invite: { subject: "You're invited!", body: "You have been invited to join..." },
        mention: { subject: "You were mentioned", body: "You were mentioned in a task..." },
        deadline: { subject: "Task Deadline", body: "A task is due soon..." },
      },
      notifications: {
        email: true,
        inApp: true,
      },
      reminders: {
        defaultTiming: "24h",
      },
      maintenance_mode: false,
      allow_signups: true,
      max_board_size: 100,
      password_policy: {
        minLength: 8,
        requireSpecialChar: false,
      },
      rate_limits: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      },
    };

    res.json({ ...defaults, ...formattedSettings });
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ message: "Key and value are required" });
    }

    const updated = await prisma.systemConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    // Invalidate public cache immediately when these settings change
    if (key === "maintenance_mode" || key === "allow_signups") {
      publicConfigCache.expiresAt = 0;
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get public system status (maintenance mode & signups) — no auth required
// @route   GET /api/config/status
// @access  Public
const getPublicStatus = async (req, res) => {
  try {
    const now = Date.now();

    // Return cached value if still fresh
    if (now < publicConfigCache.expiresAt) {
      return res.json({ 
        maintenance: publicConfigCache.maintenance,
        allowSignups: publicConfigCache.allowSignups
      });
    }

    // Cache expired — fetch from DB
    const configs = await prisma.systemConfig.findMany({
      where: { key: { in: ["maintenance_mode", "allow_signups"] } }
    });

    let maintenance = false;
    let allowSignups = true;

    configs.forEach(c => {
      if (c.key === "maintenance_mode") maintenance = c.value === true || c.value === "true";
      if (c.key === "allow_signups") allowSignups = c.value !== false && c.value !== "false";
    });

    publicConfigCache = { maintenance, allowSignups, expiresAt: now + CACHE_TTL_MS };

    res.json({ maintenance, allowSignups });
  } catch (err) {
    console.error("Error fetching public status:", err);
    res.json({ 
      maintenance: publicConfigCache.maintenance ?? false,
      allowSignups: publicConfigCache.allowSignups ?? true
    }); 
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getPublicStatus,
};
