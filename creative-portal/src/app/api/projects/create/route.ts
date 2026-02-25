import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, clientId, status, description } = body

    if (!title || !clientId) {
      return NextResponse.json({ error: 'Project title and client are required' }, { status: 400 })
    }

    // Task 2: Atomic Transaction for Project Initialization
    const project = await prisma.$transaction(async (tx) => {
      // 1. Create the Project record
      const newProject = await tx.project.create({
        data: {
          title,
          clientId,
          status: status || 'DISCOVERY',
          userId: session.user.id, // Admin owns it
          brandStatus: 'PENDING',
          campaignStatus: 'PENDING',
          creativeStatus: 'PENDING',
          gtmStatus: 'PENDING',
          startDate: new Date(),
        },
      })

      // 2. Auto-Initialization: Create 4 AssessmentSession records
      const pillars = ['GTM', 'BRAND', 'CAMPAIGN', 'CREATIVE']
      for (const type of pillars) {
        await tx.assessmentSession.create({
          data: {
            projectId: newProject.id,
            clientId: clientId,
            assessmentType: type,
            status: 'NOT_STARTED',
            consultantId: session.user.id,
            isPublished: false
          }
        })
      }

      // 3. Event Log: Create a SystemEvent
      // We check if the SystemEvent model exists first (based on previous LS output it does)
      await tx.systemEvent.create({
        data: {
          type: 'PROJECT_INITIALIZED',
          message: `Project [${title}] initialized by Admin.`,
          projectId: newProject.id,
          userId: session.user.id,
        }
      }).catch(err => console.warn("Failed to log system event:", err))

      return newProject
    })

    return NextResponse.json({
      success: true,
      project
    }, { status: 201 })

  } catch (error: any) {
    console.error("PROJECT_INIT_FAILED:", error)
    return NextResponse.json({ 
      error: 'Project Initialization Failed',
      message: error.message || 'Internal Server Error'
    }, { status: 500 })
  }
}
