const prisma = require("../config/db");

const checkMaintenanceMode = async (req, res, next) => {
  try {
    // Skip for Admin routes or Login
    if (req.path.startsWith("/api/admin") || req.path === "/api/user/login") {
      return next();
    }

    const config = await prisma.systemConfig.findUnique({
      where: { key: "maintenance_mode" },
    });

    if (config && config.value === true) {
      // Check if user is Admin/Owner via JWT cookie
      const token = req.cookies.token;
      if (token) {
        try {
          const jwt = require("jsonwebtoken");
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded.role === "Admin" || decoded.role === "Owner") {
            return next();
          }
        } catch (e) {
          // Token invalid, proceed to block
        }
      }

      return res.status(503).json({ 
        message: "System is currently under maintenance. Please try again later.",
        maintenance: true 
      });
    }

    next();
  } catch (err) {
    console.error("Maintenance check error:", err);
    next(); // Fail open to avoid blocking if DB is down
  }
};

const checkSignupAllowed = async (req, res, next) => {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: "allow_signups" },
    });

    if (config && config.value === false) {
      return res.status(403).json({ message: "New user signups are currently disabled." });
    }

    next();
  } catch (err) {
    console.error("Signup check error:", err);
    next();
  }
};

module.exports = {
  checkMaintenanceMode,
  checkSignupAllowed,
};
