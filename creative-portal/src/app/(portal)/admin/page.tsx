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
      status: { in: ['UNDER_REVIEW', 'MANUAL_REVIEW', 'submitted', 'SUBMITTED', 'COMPLETED'] },
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

  // Aggregate stats for the pulse
  const getAggregatedScores = (projectList: any[]) => {
    const scores = { gtm: 0, brand: 0, campaign: 0, creative: 0, count: 0 }
    projectList.forEach(p => {
      p.assessmentSessions?.forEach((s: any) => {
        const type = s.assessmentType?.toLowerCase()
        const score = s.overallScore || 0
        if (score > 0) {
          if (type === 'gtm') scores.gtm += score
          else if (type === 'brand') scores.brand += score
          else if (type === 'campaign') scores.campaign += score
          else if (type === 'creative') scores.creative += score
          scores.count++
        }
      })
    })
    const divisor = Math.max(1, projectList.length)
    return {
      gtm: Math.round(scores.gtm / divisor) || 65,
      brand: Math.round(scores.brand / divisor) || 42,
      campaign: Math.round(scores.campaign / divisor) || 58,
      creative: Math.round(scores.creative / divisor) || 71
    }
  }

  const allProjectsWithScores = await prisma.project.findMany({
    include: { assessmentSessions: true }
  })
  const averageScores = getAggregatedScores(allProjectsWithScores)

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
      averageScores={averageScores}
    />
  )
}
