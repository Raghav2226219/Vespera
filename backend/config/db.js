const { PrismaClient } = require("@prisma/client");
// This imports the auto-generated Prisma Client
const prisma = new PrismaClient();
// Creates a single Prisma instance to talk to your PostgreSQL
module.exports = prisma;
// reuse the same instance across your controllers instead of creating new ones every time
