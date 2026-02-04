import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const projectId = 'cml73ju300003vkikvhv32lit'
  const userEmail = 'client@acme.com'

  console.log(`Starting Hard Reset for Acme Corp (${userEmail})...`)

  // 1. Delete all AssessmentSessions
  const deletedSessions = await prisma.assessmentSession.deleteMany({
    where: { projectId: projectId }
  })
  console.log(`Deleted ${deletedSessions.count} assessment sessions.`)

  // 2. Delete all Deliverables
  const deletedDeliverables = await prisma.deliverable.deleteMany({
    where: { projectId: projectId }
  })
  console.log(`Deleted ${deletedDeliverables.count} deliverables.`)

  // 3. Delete all Milestones
  const deletedMilestones = await prisma.milestone.deleteMany({
    where: { projectId: projectId }
  })
  console.log(`Deleted ${deletedMilestones.count} milestones.`)

  // 4. Delete all TimelineEvents
  const deletedEvents = await prisma.timelineEvent.deleteMany({
    where: { projectId: projectId }
  })
  console.log(`Deleted ${deletedEvents.count} timeline events.`)

  // 5. Reset Project Status and Flags
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      status: 'DISCOVERY',
      gtmStatus: 'PENDING',
      brandStatus: 'PENDING',
      campaignStatus: 'PENDING',
      creativeStatus: 'PENDING'
    }
  })
  console.log(`Reset project status to DISCOVERY and cleared all status flags.`)

  console.log('Hard Reset Complete.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
