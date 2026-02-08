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

    let { projectId, dimension, certifiedNarrative, consultantAnalysis, status } = body
    
    // Task 1: Validation
    if (!projectId || !dimension || certifiedNarrative === undefined) {
      console.error("[PUBLISH API] Validation Failed: Missing required fields", { projectId, dimension, hasNarrative: !!certifiedNarrative });
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: { projectId: !!projectId, dimension: !!dimension, certifiedNarrative: !!certifiedNarrative } 
      }, { status: 400 })
    }

    const finalDimension = dimension.toLowerCase()
    const finalStatus = status || 'PUBLISHED'

    // Task 2: The "Force-Update" API Route
    
    const updatedSession = await prisma.assessmentSession.update({
      where: {
        projectId_assessmentType: {
          projectId: projectId,
          assessmentType: finalDimension
        }
      },
      data: {
        certifiedNarrative: certifiedNarrative,
        consultantAnalysis: consultantAnalysis,
        status: finalStatus,
        isPublished: finalStatus === 'PUBLISHED',
        updatedAt: new Date()
      }
    })

    // Update the Project model status field for this dimension
    const statusField = `${finalDimension}Status`
    await prisma.project.update({
      where: { id: projectId },
      data: {
        [statusField]: 'COMPLETED',
        status: 'DISCOVERY'
      }
    })

    // 2. Vault Deliverable Sync (Resilient Update)
    if (finalStatus === 'PUBLISHED') {
      try {
        const typeLabel = finalDimension.toUpperCase()
        const title = `${typeLabel} Strategic Mini-Brief`
        
        // Find existing deliverable for this project and title
        const existingDeliverable = await prisma.deliverable.findFirst({
          where: { projectId, title }
        })

        if (existingDeliverable) {
          await prisma.deliverable.update({
            where: { id: existingDeliverable.id },
            data: {
              status: 'COMPLETED',
              updatedAt: new Date(), // Force timestamp update
              fileUrl: `/strategy-iq/${projectId}/${finalDimension}/results`
            }
          })
        } else {
          await prisma.deliverable.create({
            data: {
              projectId: projectId,
              title: title,
              type: 'STRATEGY_BRIEF',
              status: 'COMPLETED',
              dueDate: new Date(),
              fileUrl: `/strategy-iq/${projectId}/${finalDimension}/results`
            }
          })
        }
      } catch (vaultError) {
        console.error("[PUBLISH API] Vault Sync Failed:", vaultError)
      }
    }

    return NextResponse.json({ success: true, updatedData: updatedSession })
  } catch (error: any) {
    console.error('[PUBLISH API] Fatal Error:', error)
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 })
  }
}
