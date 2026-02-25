import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { 
      businessGoals,
      businessOKRs,
      marketingGoals,
      strategicConstraints,
      businessDriver,
      metricName,
      metricTarget,
      metricBaseline,
      operationalPriority,
      cacCurrent,
      cacGoal,
      ltvCurrent,
      ltvGoal,
      conversionCurrent,
      conversionGoal,
      marketingSignal,
      marketingNoise,
      channels
    } = body

    // Verify ownership if not admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEAM_MEMBER') {
      const project = await prisma.project.findUnique({ where: { id: projectId } })
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
      if (project.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'CALIBRATED', // Transition to CALIBRATED upon saving charter
        businessGoals,
        businessOKRs,
        marketingGoals,
        strategicConstraints,
        businessDriver,
        metricName,
        metricTarget,
        metricBaseline,
        operationalPriority,
        cacCurrent,
        cacGoal,
        ltvCurrent,
        ltvGoal,
        conversionCurrent,
        conversionGoal,
        marketingSignal,
        marketingNoise,
        channels: channels || [],
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      project: updatedProject
    })

  } catch (error: any) {
    console.error('CONFIG_SAVE_ERROR:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: error.message 
    }, { status: 500 })
  }
}
