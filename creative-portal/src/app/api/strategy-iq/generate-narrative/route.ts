import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateStrategyNarrative } from '@/lib/strategy-ai'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { sessionId, projectId, dimension } = body

    if (!sessionId && (!projectId || !dimension)) {
      return NextResponse.json({ error: 'Missing session ID or Project/Dimension' }, { status: 400 })
    }

    // 1. Fetch the session data
    let assessmentSession;
    if (sessionId) {
      assessmentSession = await prisma.assessmentSession.findUnique({
        where: { id: sessionId },
        include: { project: true, client: true }
      })
    } else {
      assessmentSession = await prisma.assessmentSession.findFirst({
        where: { 
          projectId: projectId,
          assessmentType: {
            equals: dimension,
            mode: 'insensitive'
          }
        },
        include: { project: true, client: true }
      })
    }

    if (!assessmentSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Auth check: Admin or the project owner
    if (session.user.role !== 'ADMIN') {
      const project = await prisma.project.findUnique({
        where: { id: assessmentSession.projectId || projectId },
        select: { userId: true }
      })
      if (project?.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // 2. Generate the narrative using the shared utility
    const updatedSession = await generateStrategyNarrative(assessmentSession)

    return NextResponse.json({ success: true, briefSummary: updatedSession.briefSummary })

  } catch (error: any) {
    console.error('Error generating narrative:', error)
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 })
  }
}
