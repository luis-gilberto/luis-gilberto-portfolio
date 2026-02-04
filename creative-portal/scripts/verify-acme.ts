import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const projectId = 'cml73ju300003vkikvhv32lit'
  
  const sessions = await prisma.assessmentSession.count({ where: { projectId } })
  const deliverables = await prisma.deliverable.count({ where: { projectId } })
  const project = await prisma.project.findUnique({ where: { id: projectId } })

  console.log('--- VERIFICATION ---')
  console.log('Project ID:', projectId)
  console.log('Assessment Sessions:', sessions)
  console.log('Deliverables:', deliverables)
  console.log('Project Status:', project?.status)
  console.log('GTM Status:', project?.gtmStatus)
  console.log('--------------------')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
