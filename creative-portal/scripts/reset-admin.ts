const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@luis-gilberto.com';
  const password = 'portal123';
  
  // 1. Generate hash using the EXACT library the app uses
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Generated Hash:', hashedPassword);

  // 2. Upsert the user (Create if not exists, Update if exists)
  // This ensures all required fields like createdAt/updatedAt are populated
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN', // Ensure role is correct
      authorityLevel: 3 // Set authority level to 3
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Luis Gilberto',
      role: 'ADMIN',
      authorityLevel: 3,
      createdAt: new Date()
    },
  });

  // 3. Invalidate all active sessions for this user
  const deletedSessions = await prisma.session.deleteMany({
    where: { userId: user.id }
  });

  console.log(`SUCCESS: User reset complete. Invalidated ${deletedSessions.count} sessions.`);
  console.log('Admin identity recovered. Password reset to portal123.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
