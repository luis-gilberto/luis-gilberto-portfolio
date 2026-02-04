import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'client@acme.com' },
    include: {
      projects: true
    }
  })

  const client = await prisma.client.findUnique({
    where: { email: 'client@acme.com' }
  })

  if (!user) {
    console.log('User client@acme.com not found')
  } else {
    console.log('User found:', user.id)
  }

  if (!client) {
    console.log('Client client@acme.com not found')
  } else {
    console.log('Client found:', client.id)
  }

  if (user) {
    console.log('Projects:', user.projects.map(p => ({ id: p.id, title: p.title, status: p.status, clientId: p.clientId })))
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
