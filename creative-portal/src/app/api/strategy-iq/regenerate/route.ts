import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { assessmentQuestions, AssessmentCategory } from '@/lib/strategyData'
import { safeJsonParse } from '@/lib/json-utils'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 })
    }

    // Fetch the session
    const assessmentSession = await prisma.assessmentSession.findUnique({
      where: { id: sessionId }
    })

    if (!assessmentSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const responses = safeJsonParse(assessmentSession.responses, {})
    const dimension = assessmentSession.assessmentType as AssessmentCategory
    const score = assessmentSession.intelligenceScore || 0

    let status = 'COMPLETED'
    let insights: string[] = []
    let analysis = ""

    try {
      // Generate Narrative (Brief Summary)
      const questions = assessmentQuestions[dimension] || []
      
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

      if (insights.length === 0) {
        throw new Error("No insights generated")
      }
    } catch (aiError) {
      console.error('Synthesis Error:', aiError)
      status = 'MANUAL_REVIEW'
      insights = [`The ${dimension.toUpperCase()} diagnostic identifies key opportunities for market differentiation. Your current posture reflects a foundational stage.`]
      analysis = "AI Synthesis failed or timed out. Strategist intervention required to finalize narrative."
    }

    // Update the session with the new briefSummary
    await prisma.assessmentSession.update({
      where: { id: sessionId },
      data: {
        status: status,
        briefSummary: JSON.stringify(insights),
        consultantAnalysis: analysis,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, narrative: insights, analysis })
  } catch (error) {
    console.error('Error regenerating narrative:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
