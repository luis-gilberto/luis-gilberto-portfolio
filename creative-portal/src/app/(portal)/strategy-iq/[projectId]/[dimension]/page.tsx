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
  const { projectId, dimension } = await params
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const role = session.user.role

  // Handle 'default' projectId for demo purposes
  let project;
  if (projectId === 'default') {
    project = await prisma.project.findFirst({
      include: { client: true }
    })
  } else {
    project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { client: true }
    })
  }

  if (!project || !project.clientId) {
    console.log(`[StrategyIQEntryGate] Project not found for ID: ${projectId}`)
    return (
      <div className="p-12 text-center">
        <h1 className="text-2xl font-bold text-white">Project Not Found</h1>
        <p className="text-gray-400">The requested project context is invalid.</p>
      </div>
    )
  }

  const existingSession = await prisma.assessmentSession.findFirst({
    where: {
      clientId: project.clientId,
      assessmentType: dimension,
      status: 'completed'
    }
  })

  console.log(`[StrategyIQEntryGate] Debug:`, {
    role,
    projectId,
    dimension,
    clientId: project.clientId,
    assessmentFound: !!existingSession
  })

  if (existingSession) {
    // If result exists and user is CLIENT, redirect to read-only results
    // CLIENTs are NEVER allowed to overwrite completed assessments
    console.log(`[StrategyIQEntryGate] Result exists, redirecting to /results`)
    redirect(`/strategy-iq/${projectId}/${dimension}/results`)
  }

  // If no result exists, we need to show the assessment form
  console.log(`[StrategyIQEntryGate] No result exists, redirecting to /start`)
  redirect(`/strategy-iq/${projectId}/${dimension}/start`)
}
