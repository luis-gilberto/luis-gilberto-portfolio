
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- DIAGNOSTIC START ---');
  const email = 'admin@luis-gilberto.com';
  const password = 'password123'; // Updated to correct password

  console.log(`Checking user: ${email}`);
  
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.error('FAIL: User not found in database!');
    return;
  }

  console.log('User found:', {
    id: user.id,
    email: user.email,
    role: user.role,
    passwordHash: user.password ? user.password.substring(0, 10) + '...' : 'NULL'
  });

  if (!user.password) {
    console.error('FAIL: User has no password set!');
    return;
  }

  console.log(`Testing password: "${password}"`);
  
  // Test 1: Direct Compare
  const isValid = await bcrypt.compare(password, user.password);
  console.log(`Result of bcrypt.compare(password, hash): ${isValid}`);

  if (isValid) {
    console.log('SUCCESS: Credentials are valid at the database level.');
  } else {
    console.error('FAIL: Password mismatch at database level.');
    console.log('Generating new hash for verification...');
    const newHash = await bcrypt.hash(password, 10);
    console.log('New Hash would be:', newHash);
  }
  
  console.log('--- DIAGNOSTIC END ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
