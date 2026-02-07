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
    const dimension = searchParams.get('dimension')

    if (!projectId || !dimension) {
      return NextResponse.json({ error: 'Missing projectId or dimension' }, { status: 400 })
    }

    const assessmentSession = await prisma.assessmentSession.findFirst({
      where: {
        projectId: projectId,
        assessmentType: {
          equals: dimension,
          mode: 'insensitive'
        }
      }
    })

    return NextResponse.json(assessmentSession)
  } catch (error: any) {
    console.error('Fetch session error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
