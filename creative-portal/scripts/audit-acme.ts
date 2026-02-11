import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Starting Project Audit & Re-assignment...")

  // 1. Find User
  const user = await prisma.user.findUnique({
    where: { email: 'client@acme.com' }
  })

  if (!user) {
    console.error("User client@acme.com not found!")
    return
  }
  console.log(`Found User: ${user.name} (${user.id})`)

  // 2. Find target Project VHV32LIT
  // Since the user might be referring to the end of a CUID, we use endsWith or findFirst
  const project = await prisma.project.findFirst({
    where: {
      id: { endsWith: 'vhv32lit' }
    }
  })

  if (!project) {
    console.error("Project ending with VHV32LIT not found!")
    // Let's list all projects to see what we have
    const allProjects = await prisma.project.findMany({ select: { id: true, title: true } })
    console.log("Available Projects:", allProjects)
    return
  }
  console.log(`Found Project: ${project.title} (${project.id})`)

  // 3. Re-assign Project to User
  await prisma.project.update({
    where: { id: project.id },
    data: { userId: user.id }
  })
  console.log(`Project ${project.id} explicitly associated with User ${user.id}`)

  // 4. Cleanup other projects for this user
  const otherProjects = await prisma.project.findMany({
    where: {
      userId: user.id,
      NOT: { id: project.id }
    }
  })

  console.log(`Found ${otherProjects.length} other projects to cleanup.`)
  for (const p of otherProjects) {
    console.log(`Deleting project: ${p.title} (${p.id})`)
    await prisma.project.delete({ where: { id: p.id } })
  }

  console.log("Audit & Cleanup Complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
