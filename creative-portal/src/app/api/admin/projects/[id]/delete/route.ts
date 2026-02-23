import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const params = await props.params;
    const projectId = params.id;

    // 1. Security Verification
    // Verify that the requesting userId has role === 'ADMIN' and authority_level === 3
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'UNAUTHORIZED: Admin Role Required' },
        { status: 403 }
      )
    }

    // Fetch full user details to check authorityLevel since session might not have it updated
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { authorityLevel: true }
    })

    if (!user || user.authorityLevel !== 3) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED: Level 3 Authority Required' },
        { status: 403 }
      )
    }

    if (!projectId) {
      return NextResponse.json({ error: 'Missing Project ID' }, { status: 400 })
    }

    console.log(`[DANGER ZONE] Initiating Purge for Project: ${projectId} by Admin: ${session.user.email}`)

    // 2. Cascading Delete Logic (Transaction)
    await prisma.$transaction(async (tx) => {
      // A. Delete Assessment Sessions (No Cascade defined in schema)
      const deletedSessions = await tx.assessmentSession.deleteMany({
        where: { projectId: projectId }
      })
      console.log(`- Deleted ${deletedSessions.count} assessment sessions.`)

      // B. Delete Project
      // This will cascade to: Messages, Deliverables, Documents, Milestones, TimelineEvents
      const deletedProject = await tx.project.delete({
        where: { id: projectId }
      })
      console.log(`- Deleted project record: ${deletedProject.title}`)
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Project record purged successfully.' 
    })

  } catch (error) {
    console.error('[DANGER ZONE] Purge Failed:', error)
    return NextResponse.json(
      { error: 'Internal System Error: Purge Failed' },
      { status: 500 }
    )
  }
}
