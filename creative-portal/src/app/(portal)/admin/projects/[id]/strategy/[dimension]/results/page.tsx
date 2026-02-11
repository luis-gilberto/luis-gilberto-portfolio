import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { StrategyWorkbench } from '@/components/strategy/StrategyWorkbench'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

interface PageProps {
  params: Promise<{
    id: string
    dimension: string
  }>
}

export default async function AdminStrategyWorkbenchPage({ params }: PageProps) {
  const { id: projectId, dimension } = await params
  const session = await getServerSession(authOptions)
  
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { client: true }
  })

  if (!project || !project.clientId) {
    redirect('/admin')
  }

  // Fetch the latest session for this dimension
  const assessmentSession = await prisma.assessmentSession.findFirst({
    where: {
      projectId: projectId,
      assessmentType: dimension
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  if (!assessmentSession) {
    // If no session exists, redirect to initialize it or back to project
    redirect(`/admin/projects/${projectId}`)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
        <Breadcrumbs 
          items={[
            { label: 'Admin Dashboard', href: '/admin' },
            { label: project.title, href: `/admin/projects/${projectId}` },
            { label: `${dimension.toUpperCase()} Strategy`, active: true }
          ]} 
        />
      </div>
      <StrategyWorkbench 
        session={assessmentSession}
        projectId={projectId}
        dimension={dimension}
        clientName={project.client?.name || 'Partner'}
      />
    </div>
  )
}
