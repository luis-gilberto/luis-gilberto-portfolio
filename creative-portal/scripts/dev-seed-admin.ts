import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.PORTAL_ADMIN_EMAIL || 'admin@luis-gilberto.com'
  const pwd = process.env.PORTAL_ADMIN_PASSWORD || 'admin123'
  const password = await bcrypt.hash(pwd, 10)

  await prisma.user.upsert({
    where: { email },
    update: { name: 'System Admin', role: 'ADMIN', password },
    create: { email, name: 'System Admin', role: 'ADMIN', password },
  })
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
