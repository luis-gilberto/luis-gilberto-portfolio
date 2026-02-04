import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    console.log("Incoming API Body:", body)

    const projectId = body.projectId || body.id
    const dimension = body.dimension?.toLowerCase()
    const { sessionId, consultantAnalysis, certifiedNarrative, isPublished } = body

    if (!projectId || !dimension) {
      console.error("Missing critical fields:", { projectId, dimension })
      return NextResponse.json({ error: 'Missing Project ID or Dimension' }, { status: 400 })
    }

    // 1. Hyper-resilient lookup
    let assessmentSession = await prisma.assessmentSession.findFirst({
      where: { 
        projectId: projectId,
        assessmentType: dimension
      },
      include: { project: true }
    })

    // If not found, try finding by sessionId if provided
    if (!assessmentSession && sessionId) {
      assessmentSession = await prisma.assessmentSession.findUnique({
        where: { id: sessionId },
        include: { project: true }
      })
    }

    let updatedSession;

    if (assessmentSession) {
      // Update existing
      updatedSession = await prisma.assessmentSession.update({
        where: { id: assessmentSession.id },
        data: {
          isPublished: isPublished ?? true,
          status: isPublished !== false ? 'PUBLISHED' : 'COMPLETED',
          consultantAnalysis: consultantAnalysis,
          certifiedNarrative: certifiedNarrative,
          updatedAt: new Date()
        }
      })
    } else {
      // Create new if missing (prevents "Not Found" error from blocking publish)
      // We need a clientId to create a session, so we fetch it from the project
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { clientId: true }
      })

      if (!project || !project.clientId) {
        return NextResponse.json({ error: 'Project or Client context not found for creation' }, { status: 404 })
      }

      updatedSession = await prisma.assessmentSession.create({
        data: {
          projectId,
          clientId: project.clientId,
          consultantId: session.user.id,
          assessmentType: dimension,
          isPublished: isPublished ?? true,
          status: isPublished !== false ? 'PUBLISHED' : 'COMPLETED',
          consultantAnalysis: consultantAnalysis,
          certifiedNarrative: certifiedNarrative,
        }
      })
    }

    // 2. Vault Creation Safety (Separate try/catch)
    if (updatedSession.projectId && (isPublished !== false)) {
      try {
        const typeLabel = (dimension || updatedSession.assessmentType).toUpperCase()
        await prisma.deliverable.create({
          data: {
            projectId: updatedSession.projectId,
            title: `${typeLabel} Strategic Mini-Brief`,
            type: 'STRATEGY_BRIEF',
            status: 'COMPLETED',
            dueDate: new Date(),
            fileUrl: `/strategy-iq/${updatedSession.projectId}/${dimension}/results`
          }
        })
        console.log("Vault deliverable created successfully")
      } catch (vaultError) {
        console.error("Vault creation failed (non-blocking):", vaultError)
        // We don't return error here so the main publish succeeds
      }
    }

    return NextResponse.json({ success: true, session: updatedSession })
  } catch (error: any) {
    console.error('Error publishing narrative:', error)
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 })
  }
}
