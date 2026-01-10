
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@luis-gilberto.com'
  
  console.log(`Checking for existing user with email: ${email}...`)
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      name: 'Super Admin'
    },
    create: {
      email,
      name: 'Super Admin',
      role: 'ADMIN',
      image: 'https://github.com/shadcn.png' // Placeholder image
    },
  })

  console.log('\nSUCCESS: Admin user verified/created!')
  console.log('---------------------------------------------------')
  console.log('LOGIN CREDENTIALS:')
  console.log(`Email: ${email}`)
  console.log('Code:  (Any random text, e.g., "123456")')
  console.log('---------------------------------------------------')
  console.log('NOTE: The current auth setup uses a "Dev Credentials" provider')
  console.log('that bypasses password checks and relies on email matching.')
  console.log('Just enter the email above in the login form.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
