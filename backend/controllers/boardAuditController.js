const prisma = require("../config/db");

// Get audits for a specific board (filtered by membership)
const getBoardAudits = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    const userId = req.user.id;

    if (!boardId)
      return res.status(400).json({ message: "Board ID required" });

    // 🔒 Check if user is a member of the board
    const isMember = await prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId,
          userId,
        },
      },
    });

    if (!isMember) {
      return res.status(403).json({ message: "Access denied. You are not a member of this board." });
    }

    const audits = await prisma.boardAudit.findMany({
      where: { boardId },
      orderBy: { createdAt: "desc" },
      include: {
        actor: { select: { id: true, name: true, email: true } },
        board: { select: { id: true, title: true } },
      },
    });

    res.json({ success: true, data: audits });
  } catch (err) {
    console.error("Error fetching board audits: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all audits for boards the user is a member of
const getAllBoardAudits = async (req, res) => {
  try {
    const {
      page = "1",
      pageSize = "20",
      boardId,
      action,
      search,
      dateFrom,
      dateTo,
    } = req.query;

    const userId = req.user.id;
    const _page = Math.max(parseInt(page) || 1, 1);
    const _pageSize = Math.min(Math.max(parseInt(pageSize) || 20, 1), 100);
    const skip = (_page - 1) * _pageSize;
    const take = _pageSize;

    // 1️⃣ Find all boards where the user is a member
    const userMemberships = await prisma.boardMember.findMany({
      where: { userId },
      select: { boardId: true },
    });

    const userBoardIds = userMemberships.map((m) => m.boardId);

    if (userBoardIds.length === 0) {
      return res.json({
        success: true,
        data: [],
        page: _page,
        pageSize: _pageSize,
        total: 0,
        totalPages: 0,
      });
    }

    // 🔒 Base filter: Only show audits for boards the user is a member of
    const where = {
      boardId: { in: userBoardIds },
    };

    if (boardId) {
      // Ensure the requested boardId is one of the user's boards
      const parsedBoardId = parseInt(boardId);
      if (!userBoardIds.includes(parsedBoardId)) {
         // If user requests a board they aren't part of, return empty
         return res.json({ success: true, data: [], total: 0, totalPages: 0 });
      }
      where.boardId = parsedBoardId;
    }

    if (action) where.action = action;

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { action: { contains: q, mode: "insensitive" } },
        { actor: { is: { name: { contains: q, mode: "insensitive" } } } },
        { actor: { is: { email: { contains: q, mode: "insensitive" } } } },
        { board: { is: { title: { contains: q, mode: "insensitive" } } } },
      ];
    }

    const [total, audits] = await Promise.all([
      prisma.boardAudit.count({ where }),
      prisma.boardAudit.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: {
          actor: { select: { id: true, name: true, email: true } },
          board: { select: { id: true, title: true } },
        },
      }),
    ]);

    res.json({
      success: true,
      data: audits,
      page: _page,
      pageSize: _pageSize,
      total,
      totalPages: Math.ceil(total / _pageSize),
    });
  } catch (err) {
    console.error("Error fetching all board audits: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getBoardAudits, getAllBoardAudits };
