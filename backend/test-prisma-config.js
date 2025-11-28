require('dotenv').config();
console.log('DATABASE_URL is:', process.env.DATABASE_URL ? 'DEFINED' : 'UNDEFINED');

try {
  const prisma = require('./config/db');
  console.log('db.js loaded');
  
  prisma.$connect().then(() => {
    console.log('✅ Connected');
    prisma.$disconnect();
  }).catch(e => {
    console.error('❌ Connect failed:', e);
  });

} catch (e) {
  console.error('❌ Require failed:', e);
}
