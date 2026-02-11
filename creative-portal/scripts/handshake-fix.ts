import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("CRITICAL AUDIT: Starting Acme Handshake Fix...")

  // 1. Find User
  const user = await prisma.user.findUnique({
    where: { email: 'client@acme.com' }
  })

  if (!user) {
    console.error("FAIL: User client@acme.com not found!")
    return
  }
  console.log(`PASS: Found User: ${user.name} (${user.id})`)

  // 2. Find target Project VHV32LIT
  const targetProject = await prisma.project.findFirst({
    where: {
      id: { endsWith: 'vhv32lit' }
    },
    include: {
      assessmentSessions: true
    }
  })

  if (!targetProject) {
    console.error("FAIL: Project ending with VHV32LIT not found!")
    return
  }
  console.log(`PASS: Found Target Project: ${targetProject.title} (${targetProject.id})`)
  console.log(`INFO: Assessment sessions in target: ${targetProject.assessmentSessions.length}`)

  // 3. Hard-Link: Update Project to belong exclusively to this user
  await prisma.project.update({
    where: { id: targetProject.id },
    data: { 
      userId: user.id,
      status: 'ACTIVE' // Ensure it's active
    }
  })
  console.log(`SYNC: Project ${targetProject.id} is now hard-linked to User ${user.id}`)

  // 4. Cleanup: Delete ghost projects
  const ghostProjects = await prisma.project.findMany({
    where: {
      userId: user.id,
      NOT: { id: targetProject.id }
    }
  })

  console.log(`AUDIT: Found ${ghostProjects.length} ghost projects for deletion.`)
  for (const p of ghostProjects) {
    console.log(`DELETE: Purging ghost project: ${p.title} (${p.id})`)
    await prisma.project.delete({ where: { id: p.id } })
  }

  console.log("HANDSHAKE COMPLETE: Acme Partner is now synced to VHV32LIT.")
}

main()
  .catch((e) => {
    console.error("FATAL ERROR:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
