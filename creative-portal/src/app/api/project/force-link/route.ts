import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Task 1: Database Re-Anchoring (Prisma/SQL)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') { // Admin only tool for safety
      return NextResponse.json({ error: 'Unauthorized: Admin Access Required' }, { status: 401 })
    }

    const { projectId, companyName } = await req.json()

    if (!projectId || !companyName) {
      return NextResponse.json({ error: 'Missing projectId or companyName' }, { status: 400 })
    }

    console.log(`[DB_REANCHOR] Starting re-anchor for Project ${projectId} to ${companyName}`);

    // 1. Find the Organization (Client) Record
    const client = await prisma.client.findFirst({
      where: { 
        company: {
            contains: companyName,
            mode: 'insensitive'
        }
      }
    });

    if (!client) {
      return NextResponse.json({ error: `Client Organization '${companyName}' not found.` }, { status: 404 })
    }

    // 2. Update the Project to point to this Client
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        clientId: client.id,
        // Ensure status is at least DISCOVERY
        status: {
            set: 'DISCOVERY' 
        }
      }
    });

    // 3. Link the User to the Client if not already
    // This ensures when they log in, they are associated with this client record
    // We assume the user associated with the project should be linked
    if (updatedProject.userId) {
        await prisma.user.update({
            where: { id: updatedProject.userId },
            data: { clientId: client.id }
        });
    }

    console.log(`[DB_REANCHOR] Success: Linked Project ${projectId} to Client ${client.id} (${client.company})`);

    return NextResponse.json({ 
      success: true, 
      project: updatedProject,
      client: { id: client.id, company: client.company }
    })

  } catch (error: any) {
    console.error('[DB_REANCHOR_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
