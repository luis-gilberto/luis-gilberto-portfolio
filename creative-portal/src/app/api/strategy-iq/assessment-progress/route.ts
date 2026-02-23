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

    const body = await req.json()
    const { projectId, questionId, assessmentInstanceId, selectedOptionId, score } = body

    if (!projectId || !questionId || !assessmentInstanceId || !selectedOptionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify Session Exists
    const assessmentSession = await prisma.assessmentSession.findUnique({
      where: { id: assessmentInstanceId }
    })

    if (!assessmentSession) {
      return NextResponse.json({ error: 'Assessment session not found' }, { status: 404 })
    }

    // Parse existing responses
    let responses = {}
    if (assessmentSession.responses) {
      try {
        responses = JSON.parse(assessmentSession.responses)
      } catch (e) {
        console.error('JSON Parse Error:', e)
      }
    }

    // Update responses
    responses[questionId] = score

    // Update Session
    await prisma.assessmentSession.update({
      where: { id: assessmentInstanceId },
      data: {
        responses: JSON.stringify(responses),
        currentQuestion: assessmentSession.currentQuestion ? assessmentSession.currentQuestion + 1 : 1, // Increment
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, message: 'Progress saved' })

  } catch (error: any) {
    console.error('Assessment Progress Error:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
