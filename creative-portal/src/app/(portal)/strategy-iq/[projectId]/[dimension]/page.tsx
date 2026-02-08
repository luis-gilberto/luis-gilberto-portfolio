import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AssessmentCategory } from '@/lib/strategyData'

interface PageProps {
  params: Promise<{
    projectId: string
    dimension: string
  }>
}

export default async function StrategyIQEntryGate({ params }: PageProps) {
  const { projectId, dimension: rawDimension } = await params
  const dimension = rawDimension.toLowerCase()
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const role = session.user.role

  // Handle project fetching - No more "default" ghost
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { client: true }
  })

  if (!project || !project.clientId) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-2xl font-bold text-white">Project Not Found</h1>
        <p className="text-gray-400">The requested project context is invalid.</p>
      </div>
    )
  }

  const existingSession = await prisma.assessmentSession.findFirst({
    where: {
      projectId: project.id,
      assessmentType: {
        equals: dimension,
        mode: 'insensitive'
      },
      status: { in: ['COMPLETED', 'PUBLISHED', 'completed'] }
    }
  })

  if (existingSession) {
    // If result exists and user is CLIENT, redirect to read-only results
    // CLIENTs are NEVER allowed to overwrite completed assessments
    redirect(`/strategy-iq/${projectId}/${dimension}/results`)
  }

  // If no result exists, we need to show the assessment form
  redirect(`/strategy-iq/${projectId}/${dimension}/start`)
}
