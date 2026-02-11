import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { clientId, userId, projectId } = await req.json()

    if (!clientId || !userId || !projectId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1. Hard-link User to Client
    await prisma.user.update({
      where: { id: userId },
      data: { clientId }
    })

    // 2. Hard-link Project to User and Client
    await prisma.project.update({
      where: { id: projectId },
      data: { 
        userId,
        clientId
      }
    })

    // 3. Cleanup: Find other projects for this user/client that might be duplicates
    // Heuristic: Projects with same title but different ID, or projects with no assessments
    const otherProjects = await prisma.project.findMany({
      where: {
        clientId,
        id: { not: projectId }
      },
      include: {
        assessmentSessions: true
      }
    })

    for (const p of otherProjects) {
      if (p.assessmentSessions.length === 0) {
        console.log(`[CLEANUP] Deleting orphan project: ${p.id}`)
        await prisma.project.delete({ where: { id: p.id } })
      }
    }

    console.log(`[DATA SYNC] Hard-linked User:${userId} to Client:${clientId} and Project:${projectId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[HARD-LINK ERROR]", error)
    return NextResponse.json({ error: "Failed to synchronize mapping" }, { status: 500 })
  }
}
