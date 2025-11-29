const prisma = require("./config/db");

async function main() {
  // Promoting the other user found in the list just in case
  const email = "raghav19092004@gmail.com"; 
  
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
