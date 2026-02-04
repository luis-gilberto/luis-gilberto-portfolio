import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })
    }

    // Ensure the project belongs to the user (if CLIENT)
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true, clientId: true }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (session.user.role === 'CLIENT' && project.userId !== session.user.id) {
        // Also check if the client email matches the user email
        const client = await prisma.client.findUnique({
            where: { id: project.clientId || '' }
        })
        if (!client || client.email !== session.user.email) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
    }

    const deliverables = await prisma.deliverable.findMany({
      where: {
        projectId: projectId,
        OR: [
            { type: 'STRATEGY_BRIEF' },
            { status: 'COMPLETED' }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(deliverables)
  } catch (error: any) {
    console.error('Error fetching deliverables:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
