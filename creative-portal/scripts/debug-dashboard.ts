import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const projectId = 'cml73ju300003vkikvhv32lit'
  
  console.log('--- DB INSPECTION ---')
  
  // 1. Check Project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { client: true }
  })
  console.log('Project found:', !!project)
  if (project) {
    console.log('Project Status:', project.status)
    console.log('Client ID:', project.clientId)
  }

  // 2. Check Assessment Sessions
  const sessions = await prisma.assessmentSession.findMany({
    where: { projectId: projectId }
  })
  console.log('Assessment Sessions:', sessions.length)
  sessions.forEach(s => {
    console.log(`- Type: ${s.assessmentType}, Status: ${s.status}`)
  })

  // 3. Check User
  if (project?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: project.userId }
    })
    console.log('User Name:', user?.name)
    console.log('User Email:', user?.email)
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
