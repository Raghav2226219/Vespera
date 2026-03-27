const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;

// Neon serverless postgres requires distinct settings to prevent premature termination.
// Using connectionTimeoutMillis can cause 'Connection terminated due to connection timeout'
// if the proxy takes too long to wake up the compute endpoint.
const pool = new Pool({
  connectionString,
  max: 5,                   // limit concurrent connections (Neon free tier is limited)
  idleTimeoutMillis: 30000, // release idle connections after 30s
  allowExitOnIdle: true,
});

// Reconnect automatically if a pool error occurs (prevents server crash)
pool.on("error", (err) => {
  console.error("PostgreSQL pool error:", err.message);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
