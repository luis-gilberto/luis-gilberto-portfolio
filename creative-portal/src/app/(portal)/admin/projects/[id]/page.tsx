import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ProjectWarRoom from "@/components/admin/ProjectWarRoom"

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM_MEMBER")) {
    redirect("/dashboard")
  }

  const project = await prisma.project.findUnique({
    where: { id },
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
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-portal-bg">
      <ProjectWarRoom project={project} currentUser={session.user} />
    </div>
  )
}