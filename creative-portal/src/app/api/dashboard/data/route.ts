import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Fetch User
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 2. Fetch Active Project (Prioritize cmlu1efbz0004nkth4pn0w1lb)
    const targetProjectId = 'cmlu1efbz0004nkth4pn0w1lb';
    let project = await prisma.project.findUnique({
      where: { id: targetProjectId },
      include: { client: true }
    })

    // If target doesn't exist or belong to user/client, fallback to latest active
    if (!project || (project.userId !== user.id && project.clientId !== user.client?.id)) {
        project = await prisma.project.findFirst({
            where: { 
                OR: [
                    { userId: user.id },
                    { clientId: user.client?.id } // Include Client Org projects
                ],
                status: { in: ['ACTIVE', 'DISCOVERY', 'PLANNING'] }
            },
            orderBy: { updatedAt: 'desc' },
            include: { client: true }
        })
    }

    if (!project) {
        return NextResponse.json({ user, project: null })
    }

    // 3. Fetch Assessment Sessions for this project to get real status
    // We need to map the session status to the dashboard display logic
    const sessions = await prisma.assessmentSession.findMany({
      where: { projectId: project.id },
      select: {
        assessmentType: true,
        status: true,
        isPublished: true,
        updatedAt: true
      }
    })
    
    // Map sessions to a lookup object
    const sessionMap: Record<string, any> = {}
    sessions.forEach(s => {
      sessionMap[s.assessmentType.toUpperCase()] = s
    })

    // Override project-level status with session-level status if session exists
    // This ensures "In Progress" or "Completed" is accurate based on actual work
    const enrichedProject = {
      ...project,
      gtmStatus: sessionMap['GTM'] ? mapSessionStatus(sessionMap['GTM']) : project.gtmStatus,
      brandStatus: sessionMap['BRAND'] ? mapSessionStatus(sessionMap['BRAND']) : project.brandStatus,
      campaignStatus: sessionMap['CAMPAIGN'] ? mapSessionStatus(sessionMap['CAMPAIGN']) : project.campaignStatus,
      creativeStatus: sessionMap['CREATIVE'] ? mapSessionStatus(sessionMap['CREATIVE']) : project.creativeStatus,
    }

    return NextResponse.json({
      user: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role, // Pass role for UI logic
        company: project.client?.company || 'Acme Corp'
      },
      project: enrichedProject,
      assessments: sessions // Pass raw sessions for detailed mapping in frontend
    })

  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Helper to map AssessmentSession status to Project status enums
function mapSessionStatus(session: any): string {
  if (session.isPublished) return 'PUBLISHED'
  const s = session.status.toLowerCase()
  if (s === 'completed') return 'COMPLETED'
  if (s === 'submitted' || s === 'under_review' || s === 'manual_review') return 'UNDER_REVIEW'
  if (s === 'in_progress') return 'IN_PROGRESS'
  return 'PENDING'
}
