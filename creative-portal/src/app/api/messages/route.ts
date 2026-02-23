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
    const archived = searchParams.get('archived') === 'true'

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Role-based Access Control for Archives
    if (archived && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Audit logs are restricted to administrators.' }, { status: 403 })
    }

    const whereCondition: any = { projectId }
    
    if (archived) {
      whereCondition.archivedAt = { not: null }
    } else {
      whereCondition.archivedAt = null
    }

    const messages = await prisma.message.findMany({
      where: whereCondition,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

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

    // Lookup-First Logic: Ensure project exists before attaching message
    let project = await prisma.project.findFirst({
      where: { id: projectId },
      select: { id: true }
    })

    if (!project) {
       // Check if customId exists (if schema supports it)
       // project = await prisma.project.findUnique({ where: { customId: projectId } })
       
       if (!project) {
          return NextResponse.json({ 
            error: 'Project not found. Cannot attach message to a non-existent record.',
            code: 'PROJECT_NOT_FOUND' 
          }, { status: 404 })
       }
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

    const message = await prisma.message.create({
      data: {
        content,
        projectId: project.id, // Use verified UUID
        senderId: sender.id,   // Use verified Sender ID
      },
      include: {
        sender: true
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
