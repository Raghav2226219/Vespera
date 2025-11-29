const prisma = require("../config/db");

// @desc    Get audits for a specific task
// @route   GET /api/task-audits/task/:taskId
// @access  Private
const getTaskAudits = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // 1. Check if task exists and get its boardId
    // We need to know the boardId to check membership
    // However, if the task is deleted, we might only have the audit logs.
    // But the audit log has boardId.
    // So let's query the audits directly, but we need to verify access.
    // If the task exists, we can check its board.
    // If the task is deleted, we can check the boardId from the audits (assuming they belong to the same board).
    
    // Let's first try to find the task to get the boardId easily.
    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
      select: { column: { select: { boardId: true } } }
    });

    let boardId;
    if (task) {
      boardId = task.column.boardId;
    } else {
      // Task might be deleted. Check if there are any audits for this taskId
      // and get the boardId from there.
      const audit = await prisma.taskAudit.findFirst({
        where: { taskId: parseInt(taskId) },
        select: { boardId: true }
      });
      if (!audit) {
        return res.status(404).json({ message: "No audits found for this task" });
      }
      boardId = audit.boardId;
    }

    // 2. Check if user is a member of the board
    const isMember = await prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId: boardId,
          userId: req.user.id,
        },
      },
    });

    if (!isMember) {
      return res.status(403).json({ message: "Not authorized to view audits for this board" });
    }

    // 3. Fetch audits
    const audits = await prisma.taskAudit.findMany({
      where: { taskId: parseInt(taskId) },
      include: {
        actor: {
          select: { id: true, name: true, email: true },
        },
        task: {
            select: { title: true }
        },
        board: {
            select: { title: true }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    const total = await prisma.taskAudit.count({
      where: { taskId: parseInt(taskId) },
    });

    res.json({
      audits,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalAudits: total,
    });
  } catch (error) {
    console.error("Error fetching task audits:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all task audits for boards the user is a member of
// @route   GET /api/task-audits/all
// @access  Private
const getAllTaskAudits = async (req, res) => {
  try {
    const { page = 1, limit = 20, boardId, action, search, dateFrom, dateTo } = req.query;
    const skip = (page - 1) * limit;

    // 1. Get all board IDs the user is a member of
    const userMemberships = await prisma.boardMember.findMany({
      where: { userId: req.user.id },
      select: { boardId: true },
    });
    const userBoardIds = userMemberships.map((m) => m.boardId);

    if (userBoardIds.length === 0) {
      return res.json({ audits: [], page: 1, totalPages: 0, totalAudits: 0 });
    }

    // 2. Build filter
    const where = {
      boardId: { in: userBoardIds }, // Base security rule
    };

    if (boardId) {
      // Verify user is member of this specific board
      if (!userBoardIds.includes(parseInt(boardId))) {
        return res.status(403).json({ message: "Not authorized for this board" });
      }
      where.boardId = parseInt(boardId);
    }

    if (action) {
      where.action = action;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(new Date(dateTo).setHours(23, 59, 59, 999));
    }

    if (search) {
      where.OR = [
        { actor: { name: { contains: search, mode: "insensitive" } } },
        { details: { path: ['title'], string_contains: search } }, // Search in JSON details? Prisma support for JSON filtering varies.
        // Alternatively, search task title if task exists
        { task: { title: { contains: search, mode: "insensitive" } } },
        // Or board title
        { board: { title: { contains: search, mode: "insensitive" } } }
      ];
    }

    // 3. Fetch audits
    const audits = await prisma.taskAudit.findMany({
      where,
      include: {
        actor: {
          select: { id: true, name: true, email: true },
        },
        task: {
            select: { title: true }
        },
        board: {
            select: { title: true }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    const total = await prisma.taskAudit.count({ where });

    res.json({
      audits,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalAudits: total,
    });
  } catch (error) {
    console.error("Error fetching all task audits:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTaskAudits,
  getAllTaskAudits,
};
