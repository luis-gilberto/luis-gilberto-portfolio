import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const clients = await prisma.client.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            clientId: true
          }
        },
        projects: {
          include: {
            assessmentSessions: {
              select: {
                status: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error("[MAPPING API ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch mapping data" }, { status: 500 })
  }
}
