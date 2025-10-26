const prisma = require("../config/db");

// ✅ Create Default Columns (called after board creation)
const createDefaultColumns = async (boardId) => {
  const defaultColumns = [
    { name: "To Do", position: 1 },
    { name: "In Progress", position: 2 },
    { name: "Done", position: 3 },
  ];

  await prisma.column.createMany({
    data: defaultColumns.map(col => ({
      ...col,
      boardId: boardId,
    })),
  });

  return true;
};

// ✅ Get all columns (with tasks)
const getColumnsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const columns = await prisma.column.findMany({
      where: { boardId: parseInt(boardId) },
      include: {
        tasks: {
          orderBy: { position: "asc" },
        },
      },
      orderBy: { position: "asc" },
    });

    res.json(columns);
  } catch (err) {
    console.error("Error fetching columns: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Rename a column
const renameColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { name } = req.body;

    const updated = await prisma.column.update({
      where: { id: parseInt(columnId) },
      data: { name },
    });

    res.json(updated);
  } catch (err) {
    console.error("Error renaming column: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Reorder Columns
const reorderColumns = async (req, res) => {
  try {
    const { newOrder } = req.body;
    // newOrder = [ {id: 1, position: 1}, {id: 2, position: 2}, ... ]

    const updates = newOrder.map(col =>
      prisma.column.update({
        where: { id: col.id },
        data: { position: col.position },
      })
    );

    await prisma.$transaction(updates);

    res.json({ message: "Column order updated" });
  } catch (err) {
    console.error("Error reordering columns: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createDefaultColumns,
  getColumnsByBoard,
  renameColumn,
  reorderColumns,
};
