import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, company } = await req.json()
    const targetEmail = email || session.user.email

    if (!targetEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: targetEmail }
    })

    if (!user) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 })
    }

    // Find the client record by email
    const client = await prisma.client.findUnique({
      where: { email: targetEmail }
    })

    if (!client) {
      // If no client record exists, we might need to create one or just use the user ID
      // For now, let's assume a client record should exist if they are in the strategy hub
      return NextResponse.json({ error: 'Client record not found' }, { status: 404 })
    }

    // Check if they already have a Discovery or Active project
    const existingProject = await prisma.project.findFirst({
      where: {
        clientId: client.id,
        status: { in: ['ACTIVE', 'DISCOVERY'] }
      }
    })

    if (existingProject) {
      console.log("[DATA ACCESS] User Role:", session.user.role, "ProjectID:", existingProject.id, "ClientID:", client.id);
      return NextResponse.json(existingProject)
    }

    // Auto-create a Discovery project
    const newProject = await prisma.project.create({
      data: {
        title: `${company || client.name || 'Client'} - Strategic Discovery`,
        status: 'DISCOVERY',
        clientId: client.id,
        userId: user.id
      }
    })

    console.log("[DATA ACCESS] User Role:", session.user.role, "ProjectID:", newProject.id, "ClientID:", client.id, "(AUTO-INIT)");
    return NextResponse.json(newProject)

  } catch (error: any) {
    console.error('CRITICAL: Strategy-IQ Init Error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: error.message || 'Unknown error during initialization' 
    }, { status: 500 })
  }
}
