import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- DATA FIX: RE-ANCHOR ACME USER ---')
  
  // 1. Find the Client
  const client = await prisma.client.findFirst({
    where: { name: { contains: 'Acme', mode: 'insensitive' } }
  })
  
  if (!client) {
    console.error('Client "Acme Corp" not found.')
    return
  }
  console.log(`Found Client: ${client.name} (${client.id})`)

  // 2. Find the Project
  const project = await prisma.project.findFirst({
    where: { 
      clientId: client.id,
      title: { contains: 'Strategic Growth Plan', mode: 'insensitive' }
    }
  })

  if (!project) {
    console.error('Project "Strategic Growth Plan" not found for Acme.')
    // Let's see what projects DO exist for Acme
    const allAcmeProjects = await prisma.project.findMany({ where: { clientId: client.id } })
    console.log('Existing Acme Projects:', allAcmeProjects.map(p => ({ id: p.id, title: p.title })))
    return
  }
  console.log(`Found Project: ${project.title} (${project.id})`)

  // 3. Find the User
  const user = await prisma.user.findUnique({
    where: { email: 'client@acme.com' }
  })

  if (!user) {
    console.error('User "client@acme.com" not found.')
    return
  }
  console.log(`Found User: ${user.email} (${user.id})`)

  // 4. Perform the Fix
  console.log('Updating user linkage...')
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      clientId: client.id
    }
  })

  // Update project to belong to this user as well
  await prisma.project.update({
    where: { id: project.id },
    data: {
      userId: user.id
    }
  })

  console.log('--- SUCCESS: Acme User re-anchored to Strategic Growth Plan ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
