import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required for audit actions.' }, { status: 403 })
    }

    const { projectId } = await req.json()

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Perform the "Soft Delete" / Archival
    const result = await prisma.message.updateMany({
      where: {
        projectId: projectId,
        archivedAt: null // Only archive active messages
      },
      data: {
        archivedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      count: result.count,
      message: `Successfully archived ${result.count} transmissions.` 
    })
  } catch (error) {
    console.error('Error archiving messages:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
