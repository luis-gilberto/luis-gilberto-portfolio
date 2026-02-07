import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'
import { assessmentQuestions, AssessmentCategory } from '@/lib/strategyData'
import { safeJsonParse } from '@/lib/json-utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key',
})

export async function generateStrategyNarrative(assessmentSession: any) {
  try {
    const responses = safeJsonParse(assessmentSession.responses, {})
    const currentDimension = assessmentSession.assessmentType as AssessmentCategory
    const questions = assessmentQuestions[currentDimension] || []

    // 1. Prepare context for AI
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

    // 2. Trigger OpenAI if key exists
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
        
        if (content) {
          const parsed = safeJsonParse(content, {})
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

    // 3. Fallback to Rule-Based Synthesis if AI fails or key is missing
    if (!generatedSummary) {
      console.log('Using fallback rule-based synthesis')
      const insights = dataPoints.map(dp => dp.insight).filter(Boolean)
      if (insights.length === 0) {
        insights.push(`The ${currentDimension.toUpperCase()} diagnostic identifies key opportunities for market differentiation. Your current posture reflects a foundational stage.`)
      }
      generatedSummary = JSON.stringify(insights)
    }

    // 4. Update the session
    return await prisma.assessmentSession.update({
      where: { id: assessmentSession.id },
      data: {
        briefSummary: generatedSummary,
        updatedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Error generating strategy narrative:', error)
    throw error
  }
}
