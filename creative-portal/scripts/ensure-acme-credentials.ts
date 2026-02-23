import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'client@acme.com'
  const password = 'password123'
  const hashedPassword = await bcrypt.hash(password, 10)

  console.log(`Setting credentials for ${email}...`)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'CLIENT',
      name: 'Acme Client'
    },
    create: {
      email,
      name: 'Acme Client',
      role: 'CLIENT',
      password: hashedPassword,
      image: 'https://github.com/shadcn.png'
    }
  })

  console.log('---------------------------------------------------')
  console.log('✅ ACME CLIENT CREDENTIALS SET')
  console.log(`Email:    ${email}`)
  console.log(`Password: ${password}`)
  console.log('---------------------------------------------------')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
