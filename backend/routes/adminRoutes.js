const express = require("express");
const {
  getAllUsers,
  updateUserRole,
  toggleUserSuspension,
  getDashboardStats,
  getAllBoards,
  getAllTasks,
  getAllInvites,
  getGraphStats,
  getTaskStats,
  getInviteStats,
  getGlobalActivityLogs,
  getActivityStats,
  getServerLogs,
  getEmailLogs,
  getSocketLogs,
} = require("../controllers/adminController");
const { getSettings, updateSettings } = require("../controllers/systemConfigController");
const {
  getPremiumUsers,
  toggleUserPremium,
  getTiers,
  manageTier,
  deleteTier,
  getRevenueStats,
} = require("../controllers/premiumController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes are protected and require Admin role
router.use(protect);
router.use(authorize("Admin"));

router.get("/users", getAllUsers);
router.post("/premium/tiers", manageTier);
router.delete("/premium/tiers/:id", deleteTier);
router.get("/premium/revenue", getRevenueStats);

// Log Routes
router.get("/logs/server", getServerLogs);
router.get("/logs/email", getEmailLogs);
router.get("/logs/socket", getSocketLogs);

router.get("/stats", getDashboardStats);
router.get("/boards", getAllBoards);
router.get("/tasks", getAllTasks);
router.get("/invites", getAllInvites);

router.get("/graph-stats", getGraphStats);
router.get("/task-stats", getTaskStats);
router.get("/invite-stats", getInviteStats);

router.get("/activity-logs", getGlobalActivityLogs);
router.get("/activity-stats", getActivityStats);

router.get("/settings", getSettings);
router.put("/settings", updateSettings);

router.get("/premium/users", getPremiumUsers);
router.put("/premium/users/:id/toggle", toggleUserPremium);
router.get("/premium/tiers", getTiers);

module.exports = router;
