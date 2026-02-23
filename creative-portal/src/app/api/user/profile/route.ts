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
        client: {
          include: {
            projects: {
              where: { status: { in: ['ACTIVE', 'DISCOVERY'] } },
              select: { id: true, title: true }
            }
          }
        },
        projects: {
          where: { status: { in: ['ACTIVE', 'DISCOVERY'] } },
          select: { id: true, title: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 3. Fetch Active Project (Prioritize VHV32LIT / cmlu1efbz0004nkth4pn0w1lb)
    const targetProjectId = 'cmlu1efbz0004nkth4pn0w1lb';
    
    // Determine the linked project (Client Org Project takes precedence for Clients)
    let activeProject = user.client?.projects?.find(p => p.id === targetProjectId) || user.projects?.find(p => p.id === targetProjectId);
    
    // If specific target not found, fallback to any active
    if (!activeProject) {
        activeProject = user.client?.projects?.[0] || user.projects?.[0];
    }

    return NextResponse.json({
      name: user.name || "",
      email: user.email || "",
      company: user.client?.company || "",
      title: (user as any).title || "", // Assuming title might exist in metadata or we add it
      role: user.role,
      linkedProjectId: activeProject?.id || "",
      linkedProjectTitle: activeProject?.title || ""
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
