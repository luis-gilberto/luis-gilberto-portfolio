
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key',
})

const PILLARS = {
  gtm: ["Market Definition", "Targeting", "Channel Strategy", "Sales Motion", "Pricing Model"],
  brand: ["Core Identity", "Voice & Tone", "Visual System", "Audience Resonance", "Competitive Moat"],
  campaign: ["Objective", "Key Message", "Channel Mix", "Budget Allocation", "Measurement"],
  creative: ["Visual Direction", "Messaging Hierarchy", "Asset Requirements", "Production Value", "Hook Strategy"]
}

export async function POST(req: Request) {
  try {
    const { dimension, notes, image } = await req.json()

    if (!dimension) {
      return NextResponse.json({ error: 'Dimension is required' }, { status: 400 })
    }

    const selectedPillars = PILLARS[dimension as keyof typeof PILLARS] || PILLARS.gtm

    const prompt = `
      You are a Senior Strategic Consultant acting as a "Co-Pilot Composer".
      Your task is to analyze the provided inputs (Text Notes + Optional Image) and generate a structured "Advisory Brief" for a ${dimension.toUpperCase()} assessment.

      INPUTS:
      - Dimension: ${dimension}
      - Raw Notes: "${notes || 'No text notes provided.'}"
      - Image: ${image ? 'Image provided (Assessment Screenshot or Whiteboard)' : 'No image provided.'}

      FRAMEWORK (The 4-Part Formula):
      1. Current Posture: A 3-4 sentence diagnostic summary of the current state.
      2. Strategic Insights: 3-5 key bullet points identifying gaps, opportunities, or red flags.
      3. Proposed Solutions: A structured solution architecture. MUST use the following 5 Pillars for this section: ${selectedPillars.join(', ')}.
      4. Consultant's POV: A final authoritative mandate or directional guidance (1-2 paragraphs).

      CONSTRAINTS:
      - Tone: Board-level, authoritative, professional, yet advisory.
      - Formatting: NO Markdown. Plain text only for values.
      - Punctuation: ZERO em-dashes (—). Use colons (:) or commas (,) instead.
      - Casing: Sentence case for all headers and labels.
      - Output: STRICT JSON format.

      JSON STRUCTURE:
      {
        "current_posture": "Diagnostic summary...",
        "strategic_insights": ["Insight 1", "Insight 2", ...],
        "proposed_solutions": [
          { "pillar": "${selectedPillars[0]}", "solution": "..." },
          ... (for all 5 pillars)
        ],
        "consultant_pov": "Final mandate..."
      }
    `

    const messages: any[] = [
      { role: "system", content: "You are a specialized AI Strategy Consultant. You output valid JSON only." },
      { 
        role: "user", 
        content: [
          { type: "text", text: prompt }
        ]
      }
    ]

    if (image) {
      messages[1].content.push({
        type: "image_url",
        image_url: {
          url: image
        }
      })
    }

    // Mock response if no API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'mock-key') {
      const mockResponse = {
        current_posture: `Based on the provided inputs, the ${dimension} strategy appears to be in an early validation phase. The current approach lacks specific targeting mechanisms required for scale.`,
        strategic_insights: [
            "Target audience definition is too broad, leading to potential budget wastage.",
            "Competitive differentiation is not clearly articulated in current materials.",
            "Channel strategy relies heavily on a single source, creating dependency risk."
        ],
        proposed_solutions: selectedPillars.map((p: string) => ({
            pillar: p,
            solution: `Strategic optimization of ${p} to align with growth targets.`
        })),
        consultant_pov: "The immediate mandate is to narrow the focus. By creating a 'Beachhead Segment', we can validate the core value proposition before scaling spend. This requires a pivot from generalist messaging to specific problem-solving."
      }
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      return NextResponse.json(mockResponse)
    }

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-4o",
      max_tokens: 1500,
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0].message.content
    if (!content) throw new Error("No content generated")

    return NextResponse.json(JSON.parse(content))

  } catch (error) {
    console.error('Error in AI Composer:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
