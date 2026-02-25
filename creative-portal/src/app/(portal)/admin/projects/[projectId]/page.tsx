import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import ProjectWarRoom from "@/components/admin/ProjectWarRoom"

interface ProjectPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function AdminProjectDetailPage({ params }: ProjectPageProps) {
  const { projectId } = await params
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user?.role !== 'ADMIN' && session.user?.role !== 'TEAM_MEMBER') {
    redirect("/dashboard")
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      client: true,
      assessmentSessions: {
        orderBy: { updatedAt: 'desc' }
      },
      deliverables: {
        orderBy: { createdAt: 'desc' }
      },
      milestones: {
        orderBy: { date: 'asc' }
      },
      timelineEvents: {
        orderBy: { date: 'desc' }
      },
      messages: {
        include: {
          sender: true
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <ProjectWarRoom project={project} currentUser={session.user} />
    </div>
  )
}
