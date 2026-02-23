import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { sessionId, eventType, payload, projectId, category } = await req.json()

    // If sessionId is not provided (e.g. before session is created), we might need to find it
    // But for now, let's assume we pass projectId and category to find the session
    let targetSessionId = sessionId;

    if (!targetSessionId && projectId && category) {
        const assessmentSession = await prisma.assessmentSession.findUnique({
            where: {
                projectId_assessmentType: {
                    projectId: projectId,
                    assessmentType: category
                }
            },
            select: { id: true }
        });
        targetSessionId = assessmentSession?.id;
    }

    if (!targetSessionId) {
        // Session might not exist yet if it's the very first click. 
        // In a strict audit system, we might want to create it, but for now let's skip or log warning.
        // Or we can create a "Sessionless" audit log if we make sessionId optional, but schema has relation.
        // We will return OK to not block the UI.
        return NextResponse.json({ success: true, warning: "No session found" })
    }

    await prisma.sessionAuditLog.create({
      data: {
        sessionId: targetSessionId,
        actorRole: session.user.role || 'UNKNOWN',
        eventType: eventType,
        payload: payload ? JSON.stringify(payload) : undefined
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[AUDIT LOG ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
