import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { assessmentQuestions, AssessmentCategory } from '@/lib/strategyData'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    console.log('Save API received body:', JSON.stringify(body, null, 2))
    const { projectId, dimension, score, responses } = body

    if (!projectId || !dimension || score === undefined || !responses) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: { projectId: !!projectId, dimension: !!dimension, score: score !== undefined, responses: !!responses } 
      }, { status: 400 })
    }

    let status = 'COMPLETED'
    let insights: string[] = []
    let analysis = ""

    try {
      // Generate Narrative (Brief Summary)
      const questions = assessmentQuestions[dimension as AssessmentCategory] || []
      
      questions.forEach(q => {
        const selectedScore = responses[q.id]
        if (selectedScore !== undefined) {
          const option = q.options.find(o => o.score === selectedScore)
          if (option?.insight) {
            insights.push(option.insight)
          }
        }
      })

      // Generate Consultant Analysis (Internal Layer)
      analysis = `The current score of ${score} reflects a need for systematic intervention in ${dimension.toUpperCase()}. Based on the responses, the primary friction point is alignment between vision and execution.`

      // Fallback Narrative if AI/Logic fails
      if (insights.length === 0) {
        throw new Error("No insights generated")
      }
    } catch (aiError) {
      console.error('Synthesis Error:', aiError)
      status = 'MANUAL_REVIEW'
      insights = [`The ${dimension.toUpperCase()} diagnostic identifies key opportunities for market differentiation. Your current posture reflects a foundational stage.`]
      analysis = "AI Synthesis failed or timed out. Strategist intervention required to finalize narrative."
    }

    const briefSummaryString = JSON.stringify(insights)

    // Find the project - look for DISCOVERY or ACTIVE status
    console.log('Saving assessment for project:', projectId);
    let project = await prisma.project.findFirst({
      where: { 
        id: projectId,
        status: { in: ['ACTIVE', 'DISCOVERY'] }
      },
      select: { clientId: true, id: true }
    })

    // If not found by ID (maybe a mock ID was passed), try to find by the user's active client/project
    if (!project && session.user.email) {
      console.log('Project not found by ID, searching by user email:', session.user.email);
      
      const client = await prisma.client.findUnique({
        where: { email: session.user.email },
        include: {
          projects: {
            where: { status: { in: ['ACTIVE', 'DISCOVERY'] } },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      })

      if (client?.projects?.[0]) {
        project = client.projects[0];
        console.log('Found project via client relationship:', project.id);
      }
    }

    if (!project) {
      console.error('Project not found or inactive:', projectId);
      return NextResponse.json({ error: 'No active/discovery project found', projectId }, { status: 404 })
    }

    const actualProjectId = project.id;
    const clientId = project.clientId;

    if (!clientId) {
      return NextResponse.json({ error: 'Project has no associated Client', projectId: actualProjectId }, { status: 400 })
    }

    // Create or update assessment session (Upsert based on project and type)
    const assessmentSession = await prisma.assessmentSession.upsert({
      where: {
        projectId_assessmentType: {
          projectId: actualProjectId,
          assessmentType: dimension
        }
      },
      update: {
        status: status,
        responses: JSON.stringify(responses),
        intelligenceScore: score,
        briefSummary: briefSummaryString,
        consultantAnalysis: analysis,
        updatedAt: new Date()
      },
      create: {
        clientId: clientId,
        projectId: actualProjectId,
        consultantId: session.user.id,
        assessmentType: dimension,
        status: status,
        responses: JSON.stringify(responses),
        intelligenceScore: score,
        isPublished: false,
        briefSummary: briefSummaryString,
        consultantAnalysis: analysis,
      }
    })

    // Update the Project model status field for this dimension
    const statusField = `${dimension}Status`
    await prisma.project.update({
      where: { id: actualProjectId },
      data: {
        [statusField]: 'COMPLETED',
        status: 'DISCOVERY' // Ensure project is in Discovery state
      }
    })

    return NextResponse.json({ success: true, sessionId: assessmentSession.id })
  } catch (error: any) {
    console.error('Error saving assessment:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
