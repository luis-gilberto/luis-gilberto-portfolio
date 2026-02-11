import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TEAM_MEMBER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { projectId, businessOKRs, strategicConstraints, primaryBusinessGoals } = body

    console.log("ATTEMPTING_CONFIG_SAVE:", { projectId, hasOKRs: !!businessOKRs, hasConstraints: !!strategicConstraints, hasGoals: !!primaryBusinessGoals })

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        businessOKRs,
        strategicConstraints,
        primaryBusinessGoals,
        updatedAt: new Date()
      }
    })

    console.log("CONFIG_SAVE_SUCCESS:", projectId)

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
