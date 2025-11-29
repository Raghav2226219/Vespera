const prisma = require("../config/db");
// Trigger restart for new prisma client

// @desc    Get all users (with pagination & search)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const role = req.query.role || "";
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };

    if (role) {
      where.role = role;
    }

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isSuspended: true,
        createdAt: true,
        _count: {
          select: {
            Board: true, // Boards owned
            BoardMember: true, // Boards joined
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      users,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = parseInt(req.params.id);

    if (!["Admin", "Owner", "Editor", "Viewer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, role: true },
    });

    res.json({ message: "User role updated", user });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Toggle user suspension
// @route   PUT /api/admin/users/:id/suspend
// @access  Private/Admin
const toggleUserSuspension = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isSuspended: !user.isSuspended },
      select: { id: true, name: true, isSuspended: true },
    });

    res.json({
      message: `User ${updatedUser.isSuspended ? "suspended" : "activated"}`,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error toggling suspension:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, activeBoards, totalTasks, pendingInvites] = await Promise.all([
      prisma.user.count(),
      prisma.board.count({ where: { status: "active" } }),
      prisma.task.count(),
      prisma.invite.count({ where: { used: false, cancelled: false } }),
    ]);

    res.json({
      totalUsers,
      activeBoards,
      totalTasks,
      pendingInvites,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all boards
// @route   GET /api/admin/boards
// @access  Private/Admin
const getAllBoards = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const where = {
      title: { contains: search, mode: "insensitive" },
    };

    const total = await prisma.board.count({ where });

    const boards = await prisma.board.findMany({
      where,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        owner: { select: { name: true, email: true } },
        _count: { select: { members: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    res.json({ boards, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Error fetching boards:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all tasks
// @route   GET /api/admin/tasks
// @access  Private/Admin
const getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const where = {
      title: { contains: search, mode: "insensitive" },
    };

    const total = await prisma.task.count({ where });

    const tasks = await prisma.task.findMany({
      where,
      select: {
        id: true,
        title: true,
        priority: true,
        createdAt: true,
        column: { select: { name: true, board: { select: { title: true } } } },
        mentions: { select: { user: { select: { name: true } } } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // Map to flatten structure if needed
    const formattedTasks = tasks.map(t => ({
      ...t,
      status: t.column.name,
      boardTitle: t.column.board.title,
    }));

    res.json({ tasks: formattedTasks, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all invites
// @route   GET /api/admin/invites
// @access  Private/Admin
const getAllInvites = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const where = {
      email: { contains: search, mode: "insensitive" },
    };

    const total = await prisma.invite.count({ where });

    const invites = await prisma.invite.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        used: true,
        cancelled: true,
        createdAt: true,
        expiresAt: true,
        board: { select: { title: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    res.json({ invites, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Error fetching invites:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get graph stats
// @route   GET /api/admin/graph-stats
// @access  Private/Admin
const getGraphStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Helper to group by date
    const groupByDate = (data) => {
      const counts = {};
      data.forEach(item => {
        const date = item.createdAt.toISOString().split('T')[0];
        counts[date] = (counts[date] || 0) + 1;
      });
      return Object.entries(counts).map(([date, count]) => ({ date, count }));
    };

    const [users, boards, tasks, invites] = await Promise.all([
      prisma.user.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
      prisma.board.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
      prisma.task.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
      prisma.invite.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
    ]);

    res.json({
      users: groupByDate(users),
      boards: groupByDate(boards),
      tasks: groupByDate(tasks),
      invites: groupByDate(invites),
    });
  } catch (err) {
    console.error("Error fetching graph stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get task statistics for pie charts
// @route   GET /api/admin/task-stats
// @access  Private/Admin
const getTaskStats = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      select: { 
        column: { select: { name: true } },
        priority: true, 
        dueDate: true 
      },
    });

    // Group by Status
    const statusCounts = {};
    tasks.forEach((task) => {
      const status = task.column ? task.column.name : "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // Group by Priority
    const priorityCounts = {};
    tasks.forEach((task) => {
      priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
    });
    const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));

    // Group by Due Date
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    const dueDateCounts = {
      Overdue: 0,
      "Due Soon": 0,
      Future: 0,
      "No Due Date": 0,
    };

    tasks.forEach((task) => {
      if (!task.dueDate) {
        dueDateCounts["No Due Date"]++;
      } else {
        const date = new Date(task.dueDate);
        if (date < now) {
          dueDateCounts["Overdue"]++;
        } else if (date <= threeDaysFromNow) {
          dueDateCounts["Due Soon"]++;
        } else {
          dueDateCounts["Future"]++;
        }
      }
    });
    const dueDateData = Object.entries(dueDateCounts).map(([name, value]) => ({ name, value }));

    res.json({
      status: statusData,
      priority: priorityData,
      dueDate: dueDateData,
    });
  } catch (err) {
    console.error("Error fetching task stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get invite statistics for pie charts
// @route   GET /api/admin/invite-stats
// @access  Private/Admin
const getInviteStats = async (req, res) => {
  try {
    const invites = await prisma.invite.findMany({
      select: {
        role: true,
        used: true,
        cancelled: true,
        expiresAt: true,
      },
    });

    // Group by Status
    const statusCounts = {
      Pending: 0,
      Accepted: 0,
      Cancelled: 0,
      Expired: 0,
    };

    const now = new Date();

    invites.forEach((invite) => {
      if (invite.used) {
        statusCounts["Accepted"]++;
      } else if (invite.cancelled) {
        statusCounts["Cancelled"]++;
      } else if (new Date(invite.expiresAt) < now) {
        statusCounts["Expired"]++;
      } else {
        statusCounts["Pending"]++;
      }
    });
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // Group by Role
    const roleCounts = {};
    invites.forEach((invite) => {
      roleCounts[invite.role] = (roleCounts[invite.role] || 0) + 1;
    });
    const roleData = Object.entries(roleCounts).map(([name, value]) => ({ name, value }));

    res.json({
      status: statusData,
      role: roleData,
    });
  } catch (err) {
    console.error("Error fetching invite stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get global activity logs
// @route   GET /api/admin/activity-logs
// @access  Private/Admin
const getGlobalActivityLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { userId, type, startDate, endDate } = req.query;

    // Build filters
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Fetch logs from all sources
    // Note: This is a simplified approach. Ideally, we'd use a union query or separate log service.
    // For now, we fetch recent logs from each and merge in memory (not efficient for huge data but works for MVP).
    
    const [systemLogs, boardAudits, taskAudits, inviteLogs] = await Promise.all([
      prisma.systemLog.findMany({
        where: { ...dateFilter, ...(userId && { userId: parseInt(userId) }) },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: 100, // Limit fetch for performance
      }),
      prisma.boardAudit.findMany({
        where: { ...dateFilter, ...(userId && { actorId: parseInt(userId) }) },
        include: { actor: { select: { name: true, email: true } }, board: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.taskAudit.findMany({
        where: { ...dateFilter, ...(userId && { actorId: parseInt(userId) }) },
        include: { actor: { select: { name: true, email: true } }, task: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.inviteLog.findMany({
        where: { ...dateFilter, ...(userId && { inviterId: parseInt(userId) }) },
        include: { inviter: { select: { name: true, email: true } }, invite: { select: { email: true } } },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    ]);

    // Normalize and merge
    let allLogs = [
      ...systemLogs.map(l => ({ ...l, type: "SYSTEM", details: l.action })),
      ...boardAudits.map(l => ({ ...l, type: "BOARD", details: `${l.action} on board "${l.board.title}"`, user: l.actor })),
      ...taskAudits.map(l => ({ ...l, type: "TASK", details: `${l.action} on task "${l.task?.title || 'Unknown'}"`, user: l.actor })),
      ...inviteLogs.map(l => ({ ...l, type: "INVITE", details: `${l.action} invite to ${l.invite.email}`, user: l.inviter })),
    ];

    // Filter by type if requested
    if (type) {
      allLogs = allLogs.filter(log => log.type === type);
    }

    // Sort by date desc
    allLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const total = allLogs.length;
    const paginatedLogs = allLogs.slice(skip, skip + limit);

    res.json({
      logs: paginatedLogs,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching activity logs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get activity statistics
// @route   GET /api/admin/activity-stats
// @access  Private/Admin
const getActivityStats = async (req, res) => {
  try {
    const [systemCount, boardCount, taskCount, inviteCount] = await Promise.all([
      prisma.systemLog.count(),
      prisma.boardAudit.count(),
      prisma.taskAudit.count(),
      prisma.inviteLog.count(),
    ]);

    const data = [
      { name: "System", value: systemCount },
      { name: "Board", value: boardCount },
      { name: "Task", value: taskCount },
      { name: "Invite", value: inviteCount },
    ];

    res.json(data);
  } catch (err) {
    console.error("Error fetching activity stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get Server Logs (File)
// @route   GET /api/admin/logs/server
// @access  Private/Admin
const getServerLogs = async (req, res) => {
  try {
    const fs = require("fs");
    const path = require("path");
    const type = req.query.type || "combined"; // combined or error
    const logFile = path.join(__dirname, `../${type}.log`);

    if (!fs.existsSync(logFile)) {
      return res.json([]);
    }

    // Read last 100 lines
    const data = fs.readFileSync(logFile, "utf8");
    const lines = data.trim().split("\n").slice(-100).reverse();
    const logs = lines.map((line) => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return { message: line };
      }
    });

    res.json(logs);
  } catch (err) {
    console.error("Error reading logs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get Email Logs (DB)
// @route   GET /api/admin/logs/email
// @access  Private/Admin
const getEmailLogs = async (req, res) => {
  try {
    const logs = await prisma.systemLog.findMany({
      where: { action: "EMAIL_SENT" },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: { select: { name: true, email: true } } },
    });
    res.json(logs);
  } catch (err) {
    console.error("Error fetching email logs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get Socket Logs (DB)
// @route   GET /api/admin/logs/socket
// @access  Private/Admin
const getSocketLogs = async (req, res) => {
  try {
    const logs = await prisma.systemLog.findMany({
      where: { action: { in: ["SOCKET_CONNECT", "SOCKET_DISCONNECT"] } },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: { select: { name: true, email: true } } },
    });
    res.json(logs);
  } catch (err) {
    console.error("Error fetching socket logs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
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
};
