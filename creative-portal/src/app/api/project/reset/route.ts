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

    const { projectId } = await req.json()

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // 1. Delete all assessment sessions for this project
    await prisma.assessmentSession.deleteMany({
      where: { projectId }
    })

    // 2. Reset project statuses
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'DISCOVERY',
        brandStatus: 'PENDING',
        campaignStatus: 'PENDING',
        creativeStatus: 'PENDING',
        gtmStatus: 'PENDING',
        roadmapStatus: 'PENDING',
        masterPlan: null,
        masterRoadmap: null,
        businessOKRs: null,
        strategicConstraints: null,
        primaryBusinessGoals: null
      }
    })

    return NextResponse.json({ success: true, message: 'Project reset successful' })
  } catch (error: any) {
    console.error('Error resetting project:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
