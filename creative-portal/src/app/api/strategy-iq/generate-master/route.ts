import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateMasterRoadmap } from '@/lib/strategy-ai'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only Admin can generate master roadmap
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { projectId } = body

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })
    }

    const updatedProject = await generateMasterRoadmap(projectId)

    return NextResponse.json({ 
      success: true, 
      project: {
        id: updatedProject.id,
        masterRoadmap: updatedProject.masterRoadmap,
        overallIntelligenceScore: updatedProject.overallIntelligenceScore,
        quotedInvestment: updatedProject.quotedInvestment,
        roadmapStatus: updatedProject.roadmapStatus
      }
    })

  } catch (error: any) {
    console.error('Error generating master roadmap:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: error.message 
    }, { status: 500 })
  }
}
