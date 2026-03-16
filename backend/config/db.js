const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 5,                  // limit concurrent connections (Neon free tier is limited)
  idleTimeoutMillis: 30000, // release idle connections after 30s (before server kills them)
  connectionTimeoutMillis: 10000, // fail fast if a connection takes >10s
  keepAlive: true,         // send TCP keepalives to detect dead connections early
  keepAliveInitialDelayMillis: 10000,
});

// Reconnect automatically if a pool error occurs (prevents server crash)
pool.on("error", (err) => {
  console.error("PostgreSQL pool error:", err.message);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
