const { PrismaClient } = require('@prisma/client');

async function main() {
  console.log('Testing Multiple DB connections...');
  const clients = [];
  try {
    for (let i = 0; i < 20; i++) {
      console.log(`Connecting client ${i + 1}...`);
      const prisma = new PrismaClient();
      await prisma.$connect();
      await prisma.user.count();
      clients.push(prisma);
      console.log(`Client ${i + 1} connected.`);
    }
    console.log('SUCCESS: Connected 20 clients.');
  } catch (e) {
    console.error('ERROR: Failed during connection stress test.', e);
  } finally {
    for (const client of clients) {
      await client.$disconnect();
    }
  }
}

main();