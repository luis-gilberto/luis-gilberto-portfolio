import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const userEmail = 'client@acme.com'
  
  console.log(`Re-initializing Acme Corp (${userEmail})...`)

  // 1. Find User
  let user = await prisma.user.findUnique({
    where: { email: userEmail }
  })

  if (!user) {
    console.log('User not found, creating user...')
    user = await prisma.user.create({
      data: {
        email: userEmail,
        name: 'Acme Client',
        role: 'CLIENT'
      }
    })
  }

  // 2. Find or Create Client
  let client = await prisma.client.findUnique({
    where: { email: userEmail }
  })

  if (!client) {
    console.log('Client record not found, creating client...')
    client = await prisma.client.create({
      data: {
        email: userEmail,
        name: 'Acme Corp',
        company: 'Acme Corp',
        status: 'Active'
      }
    })
  }

  // 3. Find or Create Project
  let project = await prisma.project.findFirst({
    where: { 
      userId: user.id,
      status: 'DISCOVERY'
    }
  })

  if (project) {
    console.log('Acme already has a DISCOVERY project:', project.id)
    // Ensure it's linked to the correct client
    if (project.clientId !== client.id) {
      console.log('Linking project to correct client ID...')
      project = await prisma.project.update({
        where: { id: project.id },
        data: { clientId: client.id }
      })
    }
  } else {
    console.log('Creating new Discovery project...')
    project = await prisma.project.create({
      data: {
        title: 'Acme Strategic Discovery',
        status: 'DISCOVERY',
        clientId: client.id,
        userId: user.id
      }
    })
  }

  console.log('--- RE-INIT COMPLETE ---')
  console.log('User ID:', user.id)
  console.log('Client ID:', client.id)
  console.log('Project ID:', project.id)
  console.log('Project Status:', project.status)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
