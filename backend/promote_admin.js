const prisma = require("./config/db");

async function main() {
  const email = "raghavgarg2226219@gmail.com"; // Targeting the user with ID 12
  
  const user = await prisma.user.update({
    where: { email },
    data: { role: "Admin" },
  });
  
  console.log(`User ${user.email} promoted to ${user.role}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
