import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const adminEmail = process.env.PORTAL_ADMIN_EMAIL
  if (adminEmail && session.user?.email !== adminEmail) {
    redirect('/login')
  }

  const totalClients = await prisma.client.count()
  const totalProjects = await prisma.project.count()

  const activeProjectsCount = await prisma.project.count({
    where: {
      status: { in: ['Active', 'In Progress', 'DISCOVERY'] },
    },
  })

  const pendingTasks = await prisma.assessmentSession.count({
    where: {
      status: { in: ['COMPLETED', 'MANUAL_REVIEW', 'UNDER_REVIEW'] },
    },
  })

  const recentProjects = await prisma.project.findMany({
    take: 3,
    orderBy: { updatedAt: 'desc' },
    include: { client: true },
  })

  // Fetch real system events
  const systemEvents = await prisma.systemEvent?.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  }).catch(() => []) || []

  return (
    <AdminDashboardClient
      stats={{
        totalClients,
        totalProjects,
        activeProjects: activeProjectsCount,
        pendingTasks: pendingTasks,
      }}
      projects={recentProjects}
      systemEvents={systemEvents}
    />
  )
}
