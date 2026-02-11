import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import ProjectWarRoom from "@/components/admin/ProjectWarRoom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, ArrowLeft } from "lucide-react"

interface ProjectPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { projectId } = await params
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  let project = null;
  try {
    project = await prisma.project.findUnique({
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
  } catch (error) {
    console.error("Failed to fetch project:", error);
  }

  if (!project) {
    notFound();
  }

  // Check if the user has access to this project
  const isOwner = project.userId === session.user.id;
  const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'TEAM_MEMBER';

  if (!isOwner && !isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-portal-bg">
      <ProjectWarRoom project={project} currentUser={session.user} />
    </div>
  )
}
