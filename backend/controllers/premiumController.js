const prisma = require("../config/db");

// @desc    Get all premium users
// @route   GET /api/admin/premium/users
// @access  Private/Admin
const getPremiumUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { isPremium: true },
      select: {
        id: true,
        name: true,
        email: true,
        premiumSince: true,
        premiumExpiresAt: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching premium users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Toggle user premium status
// @route   PUT /api/admin/premium/users/:id
// @access  Private/Admin
const toggleUserPremium = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPremium } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        isPremium,
        premiumSince: isPremium ? new Date() : null,
        premiumExpiresAt: isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null, // Default 30 days
      },
    });

    res.json(user);
  } catch (err) {
    console.error("Error updating user premium:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all pricing tiers
// @route   GET /api/admin/premium/tiers
// @access  Private/Admin
const getTiers = async (req, res) => {
  try {
    const tiers = await prisma.pricingTier.findMany({
      orderBy: { price: "asc" },
    });
    res.json(tiers);
  } catch (err) {
    console.error("Error fetching tiers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Manage pricing tier (Create/Update)
// @route   POST /api/admin/premium/tiers
// @access  Private/Admin
const manageTier = async (req, res) => {
  try {
    const { id, name, price, duration, features, isActive } = req.body;

    if (id) {
      // Update
      const tier = await prisma.pricingTier.update({
        where: { id: parseInt(id) },
        data: { name, price, duration, features, isActive },
      });
      return res.json(tier);
    } else {
      // Create
      const tier = await prisma.pricingTier.create({
        data: { name, price, duration, features, isActive: true },
      });
      return res.json(tier);
    }
  } catch (err) {
    console.error("Error managing tier:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete pricing tier
// @route   DELETE /api/admin/premium/tiers/:id
// @access  Private/Admin
const deleteTier = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pricingTier.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Tier deleted" });
  } catch (err) {
    console.error("Error deleting tier:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get revenue stats
// @route   GET /api/admin/premium/revenue
// @access  Private/Admin
const getRevenueStats = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { status: "COMPLETED" },
    });

    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const activeSubs = await prisma.user.count({ where: { isPremium: true } });

    // Group by month (simplified)
    const revenueByMonth = transactions.reduce((acc, curr) => {
      const month = new Date(curr.createdAt).toLocaleString("default", { month: "short" });
      acc[month] = (acc[month] || 0) + curr.amount;
      return acc;
    }, {});

    const chartData = Object.keys(revenueByMonth).map((key) => ({
      name: key,
      revenue: revenueByMonth[key],
    }));

    res.json({ totalRevenue, activeSubs, chartData });
  } catch (err) {
    console.error("Error fetching revenue stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getPremiumUsers,
  toggleUserPremium,
  getTiers,
  manageTier,
  deleteTier,
  getRevenueStats,
};
