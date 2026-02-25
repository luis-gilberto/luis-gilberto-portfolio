import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AnalyticsClient from '@/app/(portal)/analytics/AnalyticsClient'

interface ProjectAnalyticsPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectAnalyticsPage({ params }: ProjectAnalyticsPageProps) {
  const { projectId } = await params
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch the specific project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      client: true,
      assessmentSessions: true
    }
  })

  if (!project) {
    notFound()
  }

  // Security check: Ensure the partner owns this project
  if (session.user?.role === 'CLIENT' && project.client?.email !== session.user.email) {
    redirect('/dashboard')
  }

  // Aggregate scores for the radar (specific to this project)
  const scores = {
    gtm: project.assessmentSessions?.find((s: any) => s.assessmentType?.toLowerCase() === 'gtm')?.overallScore || 45,
    brand: project.assessmentSessions?.find((s: any) => s.assessmentType?.toLowerCase() === 'brand')?.overallScore || 30,
    campaign: project.assessmentSessions?.find((s: any) => s.assessmentType?.toLowerCase() === 'campaign')?.overallScore || 55,
    creative: project.assessmentSessions?.find((s: any) => s.assessmentType?.toLowerCase() === 'creative')?.overallScore || 60,
  }

  return (
    <AnalyticsClient 
      isAdmin={false}
      projects={[project]}
      aggregatedScores={scores}
    />
  )
}
