
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting Skeleton Key Init...')

  const email = 'admin@luis-gilberto.com'
  const password = 'Admin123!'
  const hashedPassword = await bcrypt.hash(password, 10)

  // 1. Ensure Client Exists
  let client = await prisma.client.findFirst({
    where: { name: 'Internal Admin' }
  })

  if (!client) {
    console.log('Creating Internal Admin client...')
    client = await prisma.client.create({
      data: {
        name: 'Internal Admin',
        company: 'Luis Gilberto Ecosystem',
        status: 'Active',
        email: 'admin-client@luis-gilberto.com'
      }
    })
  } else {
    console.log('Found Internal Admin client.')
  }

  // 2. Upsert Admin User
  console.log(`Upserting admin user: ${email}...`)
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      name: 'Super Admin',
      password: hashedPassword,
      image: 'https://github.com/shadcn.png'
    },
    create: {
      email,
      name: 'Super Admin',
      role: 'ADMIN',
      password: hashedPassword,
      image: 'https://github.com/shadcn.png'
    }
  })

  console.log('\nSUCCESS: Admin Init Complete.')
  console.log('---------------------------------------------------')
  console.log('CREDENTIALS:')
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
