import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ResultsView } from '@/components/strategy/ResultsView'

interface PageProps {
  params: Promise<{
    projectId: string
    dimension: string
  }>
}

export default async function StrategyIQResultsPage({ params }: PageProps) {
  const { projectId, dimension } = await params
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const role = session.user.role

  // Handle 'default' projectId for demo purposes or fetch by real ID
  let project;
  if (projectId === 'default') {
    // If we have a session user who is a CLIENT, we should fetch THEIR project specifically
    if (role === 'CLIENT') {
      project = await prisma.project.findFirst({
        where: { userId: session.user.id },
        include: { client: true }
      })
    } else {
      // Admin fallback
      project = await prisma.project.findFirst({
        include: { client: true }
      })
    }
  } else {
    project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { client: true }
    })
  }

  console.log(`[StrategyIQResultsPage] Server Debug:`, {
    userRole: role,
    userId: session.user.id,
    projectIdFromUrl: projectId,
    resolvedProjectId: project?.id,
    dimension
  })

  if (!project || !project.clientId) {
    console.log(`[StrategyIQResultsPage] Project or Client missing for ID: ${projectId}`)
    redirect('/dashboard')
  }

  // Fetch the latest session for this dimension (could be completed or published)
  const assessmentSession = await prisma.assessmentSession.findFirst({
    where: {
      clientId: project.clientId,
      assessmentType: dimension,
      status: {
        in: role === 'ADMIN' 
          ? ['COMPLETED', 'PUBLISHED', 'UNDER_REVIEW', 'MANUAL_REVIEW', 'completed'] 
          : ['COMPLETED', 'PUBLISHED', 'completed']
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  console.log(`[StrategyIQResultsPage] Debug:`, {
    role,
    projectId,
    dimension,
    clientId: project.clientId,
    assessmentFound: !!assessmentSession
  })

  if (!assessmentSession) {
    console.log(`[StrategyIQResultsPage] NO SESSION FOUND. Redirecting to dashboard.`)
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-12">
      <ResultsView 
        session={assessmentSession}
        projectId={projectId}
        dimension={dimension}
        userRole={role}
        clientName={project.client?.name || 'Partner'}
      />
    </div>
  )
}
