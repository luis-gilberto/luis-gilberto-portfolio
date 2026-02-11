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
    const { projectId, masterPlan } = body

    if (!projectId || !masterPlan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Update Project Status and Master Plan
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'ACTIVE',
        masterPlan: masterPlan as any,
        masterRoadmap: JSON.stringify(masterPlan),
        roadmapStatus: 'APPROVED',
        updatedAt: new Date()
      }
    })

    // 2. Create Milestone records for each phase
    if (masterPlan.phases && Array.isArray(masterPlan.phases)) {
      const milestoneData = masterPlan.phases.map((phase: any, index: number) => ({
        title: `${phase.title}: ${phase.objective}`,
        projectId,
        status: 'Pending',
        order: index,
        date: new Date(new Date().setMonth(new Date().getMonth() + index + 1))
      }))

      // Cleanup existing "Phase" milestones to avoid duplicates on re-approval
      await prisma.milestone.deleteMany({
        where: { 
          projectId,
          title: { contains: 'Phase' } 
        }
      })

      await prisma.milestone.createMany({
        data: milestoneData
      })
    }

    return NextResponse.json({ success: true, project: updatedProject })

  } catch (error: any) {
    console.error('[APPROVE_MASTER_POST]', error)
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: error.message 
    }, { status: 500 })
  }
}
