import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { assessmentQuestions, AssessmentCategory } from '@/lib/strategyData'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key',
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    console.log('Generate Narrative received body:', JSON.stringify(body, null, 2))
    const { sessionId, projectId, dimension } = body

    if (!sessionId && (!projectId || !dimension)) {
      return NextResponse.json({ error: 'Missing session ID or Project/Dimension' }, { status: 400 })
    }

    // 1. Fetch the session data
    let assessmentSession;
    if (sessionId) {
      assessmentSession = await prisma.assessmentSession.findUnique({
        where: { id: sessionId },
        include: { project: true, client: true }
      })
    } else {
      assessmentSession = await prisma.assessmentSession.findFirst({
        where: { 
          projectId: projectId,
          assessmentType: dimension
        },
        include: { project: true, client: true }
      })
    }

    if (!assessmentSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const responses = JSON.parse(assessmentSession.responses || '{}')
    const currentDimension = assessmentSession.assessmentType as AssessmentCategory
    const questions = assessmentQuestions[currentDimension] || []

    // 2. Prepare context for AI
    const dataPoints = questions.map(q => {
      const selectedScore = responses[q.id]
      const option = q.options.find(o => o.score === selectedScore)
      return {
        question: q.question,
        answer: option?.label || 'N/A',
        insight: option?.insight || '',
        consultantContext: q.consultantGuide?.context || ''
      }
    })

    let generatedSummary = ""

    // 3. Trigger OpenAI if key exists
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'mock-key') {
      try {
        const prompt = `
          You are a Senior Strategic Consultant. Generate a concise, high-impact "Mini-Brief" synthesis for a ${currentDimension.toUpperCase()} diagnostic.
          
          Client: ${assessmentSession.client?.name || 'Acme Corp'}
          Project: ${assessmentSession.project?.title || 'Strategic Discovery'}
          Overall Intelligence Score: ${assessmentSession.intelligenceScore}/100
          
          Data Points:
          ${dataPoints.map(dp => `- ${dp.question}: ${dp.answer} (Insight: ${dp.insight})`).join('\n')}
          
          Requirements:
          - Generate 5-7 punchy, "consultant-grade" insights.
          - Use a bold, authoritative, yet advisory tone.
          - Focus on specific opportunities and risks identified.
          - Return the result as a JSON array of strings under the key "insights".
        `

        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: "You are a world-class business strategist. You only respond with valid JSON." }, 
            { role: "user", content: prompt }
          ],
          model: "gpt-4o",
          response_format: { type: "json_object" }
        })

        const content = completion.choices[0].message.content
        console.log('OpenAI Response Content:', content)
        
        if (content) {
          const parsed = JSON.parse(content)
          // Handle various possible JSON structures from AI
          const insights = parsed.insights || parsed.summary || (Array.isArray(parsed) ? parsed : Object.values(parsed)[0])
          if (Array.isArray(insights)) {
            generatedSummary = JSON.stringify(insights)
          } else if (typeof insights === 'string') {
            generatedSummary = JSON.stringify([insights])
          }
        }
      } catch (aiError) {
        console.error('OpenAI Error:', aiError)
      }
    }

    // 4. Fallback to Rule-Based Synthesis if AI fails or key is missing
    if (!generatedSummary) {
      console.log('Using fallback rule-based synthesis')
      const insights = dataPoints.map(dp => dp.insight).filter(Boolean)
      if (insights.length === 0) {
        insights.push(`The ${currentDimension.toUpperCase()} diagnostic identifies key opportunities for market differentiation. Your current posture reflects a foundational stage.`)
      }
      generatedSummary = JSON.stringify(insights)
    }

    // 5. Update the session
    const updatedSession = await prisma.assessmentSession.update({
      where: { id: assessmentSession.id },
      data: {
        briefSummary: generatedSummary,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, briefSummary: generatedSummary })

  } catch (error: any) {
    console.error('Error generating narrative:', error)
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 })
  }
}
