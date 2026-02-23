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
    // Map incoming frontend keys to DB schema keys
    const { 
      projectId, 
      businessDriver,
      operationalPriority,
      // Mapping from Modal -> DB
      metricOfRecord, metricName,
      baseline, metricBaseline,
      target, metricTarget,
      cacCurrent,
      cacTarget, cacGoal,
      ltvCurrent,
      ltvTarget, ltvGoal,
      crCurrent, conversionCurrent,
      crTarget, conversionGoal,
      operationalHistorySignal, marketingSignal,
      operationalHistoryNoise, marketingNoise,
      channelEcosystem, channels
    } = body

    if (!projectId) {
       console.error('[INTEGRITY_VIOLATION]: Attempted to update project config without ID.');
       return NextResponse.json({ error: 'Missing Project Identifier: Cannot update configuration without a valid Project ID.' }, { status: 400 })
    }
    const targetProjectId = projectId;

    // Verify ownership if not admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEAM_MEMBER') {
       const project = await prisma.project.findUnique({ where: { id: targetProjectId } })
       if (!project) {
           return NextResponse.json({ error: 'Project not found' }, { status: 404 })
       }
       if (project.userId !== session.user.id) {
           return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
       }
    }

    console.log("[DB_UPDATE_START]:", targetProjectId, "CALIBRATED")

    // Strict Update Logic - Never Create
    const updatedProject = await prisma.project.update({
      where: { id: targetProjectId },
      data: {
        status: 'CALIBRATED', // Force transition to CALIBRATED
        businessDriver,
        operationalPriority,
        // Coalesce Mapped Fields
        metricName: metricName || metricOfRecord,
        metricBaseline: metricBaseline || baseline,
        metricTarget: metricTarget || target,
        cacCurrent: cacCurrent,
        cacGoal: cacGoal || cacTarget,
        ltvCurrent: ltvCurrent,
        ltvGoal: ltvGoal || ltvTarget,
        conversionCurrent: conversionCurrent || crCurrent,
        conversionGoal: conversionGoal || crTarget,
        marketingSignal: marketingSignal || operationalHistorySignal,
        marketingNoise: marketingNoise || operationalHistoryNoise,
        channels: channels || channelEcosystem || [],
        updatedAt: new Date()
      }
    })

    console.log("[DB_UPDATE_SUCCESS]:", updatedProject.status)

    return NextResponse.json({ 
      success: true, 
      project: updatedProject
    })

  } catch (error: any) {
    console.error('CONFIG_SAVE_ERROR:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: error.message,
      code: error.code
    }, { status: 500 })
  }
}
