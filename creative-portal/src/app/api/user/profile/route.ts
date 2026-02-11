import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: {
        client: true,
        projects: {
          where: { status: { in: ['ACTIVE', 'DISCOVERY'] } },
          select: { id: true, title: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      name: user.name || "",
      email: user.email || "",
      company: user.client?.company || "",
      title: (user as any).title || "", // Assuming title might exist in metadata or we add it
      role: user.role,
      linkedProjectId: user.projects[0]?.id || "",
      linkedProjectTitle: user.projects[0]?.title || ""
    })
  } catch (error) {
    console.error("[PROFILE GET ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, company, title } = await req.json()

    const user = await prisma.user.update({
      where: { email: session.user.email as string },
      data: { 
        name,
        title,
        // Update client company if linked
        client: {
          update: {
            company
          }
        }
      },
      include: {
        client: true
      }
    })

    console.log(`[PROFILE SYNC] Updated User:${user.id} Profile`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PROFILE POST ERROR]", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
