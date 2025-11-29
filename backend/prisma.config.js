const { defineConfig } = require('@prisma/config');
require('dotenv').config();

console.log("Config loaded, URL:", process.env.DATABASE_URL ? "Found" : "Missing");

module.exports = defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
