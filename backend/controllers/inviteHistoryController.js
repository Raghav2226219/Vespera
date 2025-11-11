// controllers/inviteHistoryController.js
const prisma = require("../config/db");

const getInviteHistory = async (req, res) => {
  try {
    const boardId = parseInt(req.params.boardId);
    if (!boardId)
      return res.status(400).json({ message: "Board ID required" });

    const logs = await prisma.inviteLog.findMany({
      where: { boardId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        action: true,
        createdAt: true,
        inviteId: true, // ✅ ensure backend sends inviteId
        inviteeEmail: true,
        inviter: { select: { id: true, name: true, email: true } },
        acceptedBy: { select: { id: true, name: true, email: true } },
        board: { select: { id: true, title: true } },
        invite: { select: { id: true, email: true, role: true } }, // ✅ include relation
      },
    });

    res.json({ success: true, data: logs });
  } catch (err) {
    console.error("Error fetching invite history: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllInviteHistory = async (req, res) => {
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

    const _page = Math.max(parseInt(page) || 1, 1);
    const _pageSize = Math.min(Math.max(parseInt(pageSize) || 20, 1), 100);
    const skip = (_page - 1) * _pageSize;
    const take = _pageSize;

    const where = {};

    if (boardId) where.boardId = parseInt(boardId);
    if (action) where.action = action;

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { inviteeEmail: { contains: q, mode: "insensitive" } },
        { inviter: { is: { name: { contains: q, mode: "insensitive" } } } },
        { inviter: { is: { email: { contains: q, mode: "insensitive" } } } },
        { acceptedBy: { is: { name: { contains: q, mode: "insensitive" } } } },
        { acceptedBy: { is: { email: { contains: q, mode: "insensitive" } } } },
        { board: { is: { title: { contains: q, mode: "insensitive" } } } },
      ];
    }

    const [total, logs] = await Promise.all([
      prisma.inviteLog.count({ where }),
      prisma.inviteLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        select: {
          id: true,
          action: true,
          createdAt: true,
          inviteId: true, // ✅ added
          inviteeEmail: true,
          inviter: { select: { id: true, name: true, email: true } },
          acceptedBy: { select: { id: true, name: true, email: true } },
          board: { select: { id: true, title: true } },
          invite: { select: { id: true, email: true, role: true } }, // ✅ added
        },
      }),
    ]);

    res.json({
      success: true,
      data: logs,
      page: _page,
      pageSize: _pageSize,
      total,
      totalPages: Math.ceil(total / _pageSize),
    });
  } catch (err) {
    console.error("Error fetching all invite history: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getInviteHistory, getAllInviteHistory };
