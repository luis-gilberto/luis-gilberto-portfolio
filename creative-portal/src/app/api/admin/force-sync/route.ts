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
    const { email, projectId } = await req.json()

    if (!email || !projectId) {
      return NextResponse.json({ error: "Missing email or projectId" }, { status: 400 })
    }

    // 1. Find the User
    const user = await prisma.user.findUnique({
      where: { email },
      include: { projects: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 2. Find the target Project
    const targetProject = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!targetProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // 3. Perform the hard-link
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        clientId: targetProject.clientId
      }
    })

    await prisma.project.update({
      where: { id: targetProject.id },
      data: {
        userId: user.id,
        clientId: targetProject.clientId
      }
    })

    // 4. Cleanup: Delete other projects for this user
    const otherProjects = user.projects.filter(p => p.id !== targetProject.id)
    for (const p of otherProjects) {
      console.log(`[CLEANUP] Deleting redundant project: ${p.id}`)
      await prisma.project.delete({ where: { id: p.id } })
    }

    console.log(`[FORCE SYNC] User ${email} anchored to Project ${projectId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[FORCE SYNC ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
