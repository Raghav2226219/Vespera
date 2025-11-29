const prisma = require("./config/db");

async function main() {
  try {
    const search = "";
    const where = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };

    console.log("Attempting to fetch users with query:", JSON.stringify(where, null, 2));

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
            Board: true,
            BoardMember: true,
          },
        },
      },
      skip: 0,
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    console.log("Success! Found users:", users.length);
    console.log(users[0]);
  } catch (err) {
    console.error("Error executing query:");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
