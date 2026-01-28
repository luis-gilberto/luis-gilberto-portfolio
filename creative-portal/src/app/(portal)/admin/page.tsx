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
      status: { in: ['Active', 'In Progress'] },
    },
  })

  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { startDate: 'desc' },
    include: { client: true },
  })

  return (
    <AdminDashboardClient
      stats={{
        totalClients,
        totalProjects,
        activeProjects: activeProjectsCount,
        pendingTasks: 0,
      }}
      projects={recentProjects}
    />
  )
}
