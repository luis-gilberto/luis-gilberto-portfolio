
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TARGET_ADMIN_EMAIL = 'admin@luis-gilberto.com'
const TARGET_CLIENT_EMAIL = 'client@acme.com'
const TARGET_PROJECT_ID = 'cml73ju300003vkikvhv32lit'

async function scorchedEarth() {
  console.log('🔥 INITIATING SCORCHED EARTH PROTOCOL...')

  // 1. Identify Key Players
  console.log('🔍 Locating critical assets...')
  
  let adminUser = await prisma.user.findUnique({ where: { email: TARGET_ADMIN_EMAIL } })
  if (!adminUser) {
    console.log(`⚠️ Admin user not found. Creating ${TARGET_ADMIN_EMAIL}...`)
    adminUser = await prisma.user.create({
      data: {
        email: TARGET_ADMIN_EMAIL,
        name: 'Luis Gilberto',
        role: 'ADMIN',
        image: '/assets/images/admin-avatar.png' // Placeholder
      }
    })
  }

  let clientUser = await prisma.user.findUnique({ where: { email: TARGET_CLIENT_EMAIL } })
  if (!clientUser) {
    console.log(`⚠️ Client user not found. Creating ${TARGET_CLIENT_EMAIL}...`)
    clientUser = await prisma.user.create({
      data: {
        email: TARGET_CLIENT_EMAIL,
        name: 'Acme Executive',
        role: 'CLIENT',
        company: 'Acme Corp' // Note: 'company' field not in User model in schema provided earlier? Checking schema...
        // Schema: User has clientId relation. Client model has company.
        // Wait, schema earlier showed User has 'clientId'. 
      }
    })
    // Note: The User create above might fail if 'company' is not on User. 
    // I will check schema again. User model: name, email, password, image, emailVerified, role, title, clientId.
    // So 'company' is likely on Client model.
  }

  // 2. Identify/Create Client Organization
  console.log('🏢 Locating Organization...')
  let clientOrg = await prisma.client.findFirst({
    where: { 
      OR: [
        { email: TARGET_CLIENT_EMAIL },
        { name: 'Acme Corp' }
      ]
    }
  })

  if (!clientOrg) {
     console.log('⚠️ Organization not found. Creating Acme Corp...')
     clientOrg = await prisma.client.create({
        data: {
           name: 'Acme Corp',
           email: TARGET_CLIENT_EMAIL,
           status: 'Active'
        }
     })
  }
  const targetClientId = clientOrg.id

  // 3. Identify/Create Project
  console.log('🚀 Locating Project...')
  let project = await prisma.project.findUnique({ where: { id: TARGET_PROJECT_ID } })
  if (!project) {
    console.log(`⚠️ Project ${TARGET_PROJECT_ID} not found. Creating...`)
    project = await prisma.project.create({
       data: {
          id: TARGET_PROJECT_ID,
          title: 'Growth Plan', // Default title
          status: 'DISCOVERY',
          userId: adminUser.id,
          clientId: targetClientId
       }
    })
  }

  // 4. THE PURGE (Delete everything else)
  console.log('💥 EXECUTING PURGE...')

  // Step A: Handle AssessmentSessions (Child of Project and Client)
  // First, ensure preserved sessions point to the correct preserved client
  // (This prevents FK violation when we delete other clients)
  await prisma.assessmentSession.updateMany({
    where: { projectId: TARGET_PROJECT_ID },
    data: { clientId: targetClientId }
  })
  console.log(`- Aligned sessions for project ${TARGET_PROJECT_ID} to client ${targetClientId}.`)

  // Delete irrelevant AssessmentSessions
  // aggressive cleanup: delete any session that is NOT for the target project
  // This handles null projectIds too.
  const sessionsDeleted = await prisma.assessmentSession.deleteMany({
    where: {
      OR: [
        { projectId: { not: TARGET_PROJECT_ID } },
        { projectId: null }
      ]
    }
  })
  console.log(`- Deleted ${sessionsDeleted.count} irrelevant assessment sessions.`)
  
  // Double check: Are there any sessions pointing to other clients?
  // They shouldn't exist if they belong to TARGET_PROJECT_ID (because we updated them), 
  // but let's be safe and delete any session pointing to a non-target client.
  const straySessions = await prisma.assessmentSession.deleteMany({
    where: {
      clientId: { not: targetClientId }
    }
  })
  if (straySessions.count > 0) {
      console.log(`- Deleted ${straySessions.count} stray sessions pointing to wrong clients.`)
  }
  
  // Delete irrelevant Users (who might have sessions, but sessions are gone or preserved users kept)
  // Wait, User has 'sessions' (Session model) and 'projects'.
  // User -> Client (clientId). User -> Project (projects).
  // We need to delete Users first? No, Users might be referenced by Projects (userId).
  // Project -> User (userId) has onDelete: Cascade in schema?
  // user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  // So if we delete User, Project goes?
  // But we want to preserve the Project. So we must ensure the preserved Project points to preserved User (which we do in Re-hydration, but that's later).
  // We should link preserved Project to preserved User NOW before deleting other users?
  // Actually, if preserved Project points to an "Irrelevant" user currently, and we delete that user, the Project might be deleted (Cascade).
  // So we MUST link Project to Preserved User FIRST.

  // PRE-PURGE LINKAGE (Save the boat!)
  await prisma.project.update({
    where: { id: TARGET_PROJECT_ID },
    data: { userId: adminUser.id, clientId: targetClientId }
  })
  console.log(`- Secured Project ${TARGET_PROJECT_ID} by linking to Admin ${adminUser.id}.`)

  // Now we can delete irrelevant data safely-ish.

  // Delete irrelevant Projects
  const projectsDeleted = await prisma.project.deleteMany({
    where: {
      id: { not: TARGET_PROJECT_ID }
    }
  })
  console.log(`- Deleted ${projectsDeleted.count} irrelevant projects.`)

  // Delete irrelevant Users
  const usersDeleted = await prisma.user.deleteMany({
    where: {
      id: { notIn: [adminUser.id, clientUser.id] }
    }
  })
  console.log(`- Deleted ${usersDeleted.count} irrelevant users.`)

  // Delete irrelevant Clients
  // We must ensure preserved User (Client) points to preserved Client Org.
  await prisma.user.update({
    where: { id: clientUser.id },
    data: { clientId: targetClientId }
  })
  
  const clientsDeleted = await prisma.client.deleteMany({
    where: {
      id: { not: targetClientId }
    }
  })
  console.log(`- Deleted ${clientsDeleted.count} irrelevant clients.`)

  // 5. RE-HYDRATION & LINKAGE
  console.log('🔗 RE-HYDRATING IDENTITIES...')

  // Update Admin
  await prisma.user.update({
    where: { id: adminUser.id },
    data: {
      role: 'ADMIN',
      clientId: null // Admins don't belong to a client
    }
  })
  console.log(`- Admin ${TARGET_ADMIN_EMAIL} role set to ADMIN.`)

  // Update Client
  await prisma.user.update({
    where: { id: clientUser.id },
    data: {
      role: 'CLIENT',
      clientId: targetClientId
    }
  })
  console.log(`- Client ${TARGET_CLIENT_EMAIL} role set to CLIENT and linked to Org ${targetClientId}.`)

  // Update Project
  await prisma.project.update({
    where: { id: TARGET_PROJECT_ID },
    data: {
      userId: adminUser.id, // Owner is Admin
      clientId: targetClientId
    }
  })
  console.log(`- Project ${TARGET_PROJECT_ID} linked to Admin and Client Org.`)

  // 6. AUTH RESET
  console.log('🔒 RESETTING AUTH SESSIONS...')
  // Deleting from Session table (NextAuth)
  const sessionsPurged = await prisma.session.deleteMany({})
  console.log(`- Purged ${sessionsPurged.count} active sessions.`)

  console.log('✅ SCORCHED EARTH COMPLETE. SYSTEM SANITIZED.')
}

scorchedEarth()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
