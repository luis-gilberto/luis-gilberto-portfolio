import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ProjectWarRoom from "@/components/admin/ProjectWarRoom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { ToastProvider } from "@/components/providers/toast-provider"

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

  let project = null;
  try {
    project = await prisma.project.findUnique({
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
          where: {
            archivedAt: null
          },
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
    return (
      <div className="min-h-screen bg-portal-bg flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-white/5 border-white/10 text-white">
          <CardContent className="pt-12 pb-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center text-coral mx-auto">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-big-shoulders tracking-widest uppercase">Project Data Unavailable</h2>
              <p className="text-white/40 text-sm italic">
                The strategic intelligence for this record could not be retrieved or the link is invalid.
              </p>
            </div>
            <Link href="/dashboard" passHref>
              <Button variant="outline" className="border-white/10 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-black h-12 px-8 rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-portal-bg">
      <ToastProvider>
        <ProjectWarRoom project={project} currentUser={session.user} />
      </ToastProvider>
    </div>
  )
}