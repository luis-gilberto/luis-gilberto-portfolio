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

    const { projectId, content } = await req.json()

    if (!projectId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify user belongs to project or is admin
    // Lookup-First Logic: Try to find by UUID first. 
    // Note: If customId existed in schema, we would check both: OR: [{ id: projectId }, { customId: projectId }]
    let project = await prisma.project.findFirst({
      where: {
        id: projectId
      },
      select: { id: true, userId: true }
    })

    // CRITICAL FIX: If project is missing (Ghost ID from reset), Auto-Initialize a new project logic was removed in favor of 404
    if (!project) {
      console.warn(`[MESSAGES_SEND] Project ${projectId} not found (Ghost ID).`)
      
      return NextResponse.json({ 
        error: 'Project not found. Cannot attach message to a non-existent record.',
        code: 'PROJECT_NOT_FOUND'
      }, { status: 404 })
    }

    const isStrategist = session.user.role === 'ADMIN' || session.user.role === 'TEAM_MEMBER'
    const isOwner = project.userId === session.user.id

    if (!isStrategist && !isOwner) {
      console.error('[MESSAGES_SEND] Forbidden:', { role: session.user.role, owner: project.userId, user: session.user.id })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Lookup-Second Logic: Ensure sender exists (Ghost User from Stale Session)
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    })

    if (!sender) {
      return NextResponse.json({ 
        error: 'User identity lost. Please sign out and log in again.',
        code: 'USER_NOT_FOUND' 
      }, { status: 401 })
    }

    console.log('[MESSAGES_SEND] Creating message for project:', projectId)

    const message = await prisma.message.create({
      data: {
        content,
        projectId: project.id, // Use verified project ID
        senderId: sender.id,   // Use verified Sender ID
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            image: true
          }
        }
      }
    })

    console.log('[MESSAGES_SEND] Success:', message.id)
    return NextResponse.json(message)
  } catch (error: any) {
    console.error('[MESSAGES_SEND_POST] Error:', error)
    // Detailed error for debugging
    const errorMessage = error?.message || 'Internal Server Error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
