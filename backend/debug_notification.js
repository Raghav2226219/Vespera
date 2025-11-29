const prisma = require("./config/db");

async function test() {
  try {
    console.log("Testing Notification access...");
    const count = await prisma.notification.count();
    console.log("Notification count:", count);

    const notifications = await prisma.notification.findMany({
      take: 5,
    });
    console.log("Notifications:", notifications);
  } catch (error) {
    console.error("Error accessing notifications:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
