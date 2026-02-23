import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 HUNTING FOR GHOST RECORDS...')
  console.log('Target Statuses: COMPLETED, MANUAL_REVIEW, UNDER_REVIEW, submitted, SUBMITTED')

  const ghosts = await prisma.assessmentSession.findMany({
    where: {
      status: {
        in: ['COMPLETED', 'MANUAL_REVIEW', 'UNDER_REVIEW', 'submitted', 'SUBMITTED']
      }
    },
    include: {
      client: true,
      project: true
    }
  })

  if (ghosts.length === 0) {
    console.log('✅ No pending tasks found in the database.')
  } else {
    console.log(`👻 Found ${ghosts.length} record(s) matching pending criteria:\n`)
    
    for (const g of ghosts) {
      console.log('---------------------------------------------------')
      console.log(`ID:           ${g.id}`)
      console.log(`Status:       ${g.status}`)
      console.log(`Type:         ${g.assessmentType}`)
      console.log(`Project ID:   ${g.projectId}`)
      console.log(`Project Name: ${g.project?.title || 'NULL (Orphaned)'}`)
      console.log(`Client:       ${g.client?.name || 'NULL (Orphaned)'} (${g.client?.email || 'N/A'})`)
      console.log(`Consultant:   ${g.consultantId || 'Unassigned'}`)
      console.log(`Updated At:   ${g.updatedAt}`)
      console.log('---------------------------------------------------')
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
