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
    let { projectId, dimension: rawDimension, score, responses } = body

    // Task 4: No more "default" ghost. Expect real ID.
    if (!projectId || projectId === 'default') {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    const dimension = rawDimension.toLowerCase();

    if (!dimension || score === undefined || !responses) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: { dimension: !!dimension, score: score !== undefined, responses: !!responses } 
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

    // Task 3: Format briefSummary as plain text (not JSON)
    const briefSummaryText = insights.join('\n\n')

    // Force DISCOVERY status for project
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'DISCOVERY',
        [`${dimension}Status`]: 'COMPLETED'
      },
      select: { clientId: true, id: true }
    })

    const actualProjectId = project.id;
    const actualClientId = project.clientId;

    if (!actualClientId) {
      return NextResponse.json({ error: 'Could not resolve Client ID', projectId: actualProjectId }, { status: 400 })
    }

    // Task 3: Prisma Upsert Fix - Use separate columns for summary and analysis
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
        briefSummary: briefSummaryText,
        consultantAnalysis: analysis,
        updatedAt: new Date()
      },
      create: {
        clientId: actualClientId,
        projectId: actualProjectId,
        consultantId: session.user.id,
        assessmentType: dimension,
        status: status,
        responses: JSON.stringify(responses),
        intelligenceScore: score,
        isPublished: false,
        briefSummary: briefSummaryText,
        consultantAnalysis: analysis,
      }
    })

    // Log system event for assessment completion
    try {
      await prisma.systemEvent?.create({
        data: {
          type: 'ASSESSMENT_COMPLETE',
          message: `Assessment ${dimension.toUpperCase()} completed for project ${actualProjectId}`,
          metadata: JSON.stringify({ projectId: actualProjectId, dimension, score })
        }
      }).catch(() => {
        // SystemEvent table might not exist yet, ignore if so
        console.log('SystemEvent table missing, skipping event logging');
      });
    } catch (e) {
      // Ignore
    }

    // Update the Project model status field for this dimension
    const statusField = `${dimension}Status`
    await prisma.project.update({
      where: { id: actualProjectId },
      data: {
        [statusField]: 'COMPLETED',
        status: 'DISCOVERY' // Task 3: Use the correct string value 'DISCOVERY'
      }
    })

    return NextResponse.json({ success: true, sessionId: assessmentSession.id })
  } catch (error: any) {
    // Task 1: Improved Error Logging
    console.error("STRATEGY SAVE CRASH:", error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: error.message,
      details: error,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
