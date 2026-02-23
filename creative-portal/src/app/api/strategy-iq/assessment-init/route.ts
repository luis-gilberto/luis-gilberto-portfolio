import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { projectId, dimension } = body

    if (!projectId || !dimension) {
      return NextResponse.json({ error: 'Missing projectId or dimension' }, { status: 400 })
    }

    // Ensure we have a valid project first
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, clientId: true }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Upsert the AssessmentSession
    // We use upsert to ensure it exists and return it
    const assessmentSession = await prisma.assessmentSession.upsert({
      where: {
        projectId_assessmentType: {
          projectId: projectId,
          assessmentType: dimension
        }
      },
      update: {}, // No changes if exists, just fetch
      create: {
        projectId: projectId,
        assessmentType: dimension,
        clientId: project.clientId || session.user.id, // Fallback to user ID if no client ID (should handle gracefully)
        consultantId: session.user.id,
        status: 'in_progress',
        responses: '{}',
        currentQuestion: 0
      }
    })

    return NextResponse.json({ 
      success: true, 
      sessionId: assessmentSession.id,
      responses: assessmentSession.responses ? JSON.parse(assessmentSession.responses) : {},
      currentQuestion: assessmentSession.currentQuestion || 0
    })

  } catch (error: any) {
    console.error('Assessment Init Error:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
