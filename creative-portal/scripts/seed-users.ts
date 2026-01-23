import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const users = [
    {
      email: 'admin@luis-gilberto.com',
      name: 'Luis Gilberto (Admin)',
      role: 'ADMIN',
      password
    },
    {
      email: 'consultant@luis-gilberto.com',
      name: 'Senior Consultant',
      role: 'CONSULTANT',
      password
    },
    {
      email: 'client@company.com',
      name: 'Client Partner',
      role: 'CLIENT',
      password
    }
  ]

  console.log('Seeding users...')

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        password: u.password,
        role: u.role
      },
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        password: u.password
      }
    })
    console.log(`Upserted user: ${user.email} with role ${user.role}`)
  }
  
  console.log('Seeding complete. Password for all users is: password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
