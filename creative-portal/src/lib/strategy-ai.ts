import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'
import { assessmentQuestions, AssessmentCategory } from '@/lib/strategyData'
import { safeJsonParse } from '@/lib/json-utils'
import { artifactLibrary } from './artifactLibrary'

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
          You are a Senior Strategic Consultant. Generate a high-impact, structured "Advisory Brief" synthesis for a ${currentDimension.toUpperCase()} diagnostic.
          
          Client: ${assessmentSession.client?.name || 'Acme Corp'}
          Project: ${assessmentSession.project?.title || 'Strategic Discovery'}
          Overall Intelligence Score: ${assessmentSession.intelligenceScore}/100
          
          Data Points:
          ${dataPoints.map(dp => `- ${dp.question}: ${dp.answer} (Insight: ${dp.insight})`).join('\n')}
          
          Requirements:
          - Generate an "executive_snapshot" (1-2 sentences) summarizing the project's current state.
          - Generate EXACTLY 5 strategic sections.
          - Section 1 MUST be titled "Market Positioning".
          - Each section must have 1-2 punchy, "consultant-grade" advisory paragraphs in "content".
          - Each section must include a "posture" label (AT_RISK, OPTIMIZING, or CALIBRATED) based on the postureScore (0-49: AT_RISK, 50-74: OPTIMIZING, 75-100: CALIBRATED).
          - Each section must include 2-3 specific "key_insights" as an array of strings.
          - Use a bold, authoritative, yet advisory tone.
          - Return the result as a JSON object with this EXACT structure:
          {
            "executive_snapshot": "Advisory summary...",
            "sections": [
              {
                "id": 1,
                "title": "Market Positioning",
                "posture": "CALIBRATED",
                "content": "Advisory narrative content...",
                "key_insights": ["Insight A", "Insight B"]
              }
            ]
          }
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
          if (parsed.sections && Array.isArray(parsed.sections)) {
            generatedSummary = JSON.stringify(parsed)
          }
        }
      } catch (aiError) {
        console.error('OpenAI Error:', aiError)
      }
    }

    // 3. Fallback to Rule-Based Synthesis if AI fails or key is missing
    if (!generatedSummary) {
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

export async function generateMasterRoadmap(projectId: string) {
  try {
    // 1. Fetch project and all assessment sessions
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        assessmentSessions: true,
        client: true
      }
    })

    if (!project) throw new Error("Project not found")

    const dimensions = ['gtm', 'brand', 'campaign', 'creative']
    const publishedSessions = project.assessmentSessions.filter(s => s.status === 'PUBLISHED' && s.certifiedNarrative)

    if (publishedSessions.length < 4) {
      const missing = dimensions.filter(d => !publishedSessions.find(s => s.assessmentType.toLowerCase() === d))
      throw new Error(`Incomplete strategy. Missing published results for: ${missing.join(', ')}`)
    }

    // 2. Prepare context
    const briefsContext = publishedSessions.map(s => {
      return `DIMENSION: ${s.assessmentType.toUpperCase()}\nCERTIFIED NARRATIVE:\n${s.certifiedNarrative}\nSCORE: ${s.intelligenceScore}/100`
    }).join('\n\n---\n\n')

    const configContext = `
      PRIMARY BUSINESS GOALS: ${project.primaryBusinessGoals || 'Awaiting Strategic Configuration'}
      BUSINESS OKRs: ${project.businessOKRs || 'Awaiting Strategic Configuration'}
      STRATEGIC CONSTRAINTS: ${project.strategicConstraints || 'Awaiting Strategic Configuration'}
    `

    const libraryContext = artifactLibrary.map(a => `- ${a.title} (Type: ${a.type})`).join('\n')

    const avgScore = Math.round(publishedSessions.reduce((acc, s) => acc + (s.intelligenceScore || 0), 0) / 4)

    let masterPlan: any = null
    let timeline: any[] = []

    // 3. Trigger OpenAI
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'mock-key') {
      const prompt = `
        Synthesize these 4 certified strategist narratives and the provided Strategic Configuration into a 1 Master Strategic Roadmap.
        
        CERTIFIED BRIEFS:
        ${briefsContext}
        
        STRATEGIC CONFIGURATION:
        ${configContext}

        AVAILABLE ARTIFACT TEMPLATES:
        ${libraryContext}
        
        Requirements:
        1. Deep Extraction: Analyze the narratives to extract specific tactics that directly address the STRATEGIC CONSTRAINTS and align with the BUSINESS OKRs.
        2. Executive Synthesis: Write a 2-paragraph advisory narrative. 
           - Paragraph 1 (The Diagnosis): Summarize the project's current state based on the 4 assessment scores and the "Strategic Constraints" entered in the Config tab.
           - Paragraph 2 (The Path): Synthesize how the "Business OKRs" will be achieved through the proposed 3-phase roadmap.
           - Tone: Board-level, authoritative, calm, and visionary. 
           - Constraints: Do not use bullet points, technical labels, or markdown symbols (like ### or *). Use only plain text paragraphs.
        3. Critical Constraint: Identify the single biggest bottleneck identified from the briefs. IMPORTANT: If a manual constraint is provided in the STRATEGIC CONFIGURATION, prioritize and use that as the primary Critical Constraint.
        4. Organize these tactics into a 3-Phase Project Schedule (Month 1, 2, 3).
        5. For each phase, provide:
           - Objective: A high-level goal for the month.
           - Tactics: A list of 3-5 specific, actionable tactics.
           - Deliverables: Map at least 1 tactic per phase to an AVAILABLE ARTIFACT TEMPLATE if appropriate.
           - Expected Outcome: What success looks like at the end of this phase.
        
        Return the response as a JSON object with this EXACT structure:
        {
          "executiveSynthesis": "The 2-paragraph high-level advisory narrative (plain text).",
          "criticalConstraint": "The single biggest bottleneck identified.",
          "phases": [
            { 
              "id": "phase1",
              "title": "Foundation & Alignment", 
              "month": "Month 1",
              "objective": "...", 
              "tactics": ["...", "..."],
              "deliverables": ["GTM Operating Model", "..."],
              "outcome": "..."
            }
          ]
        }
      `

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a world-class Senior Full-Stack Architect and AI Specialist. You synthesize complex business data into boardroom-level strategic plans. You only respond with valid JSON." },
          { role: "user", content: prompt }
        ],
        model: "gpt-4o",
        response_format: { type: "json_object" }
      })

      const content = completion.choices[0].message.content
      if (content) {
        masterPlan = safeJsonParse(content, null)
        
        // Task 3: Priority for Strategic Configuration Constraint
        if (project.strategicConstraints && masterPlan) {
           masterPlan.criticalConstraint = project.strategicConstraints;
        }

        timeline = masterPlan?.phases || []
      }
    }

    // 4. Fallback if AI fails
    if (!masterPlan) {
      masterPlan = {
        executiveSynthesis: "System initializing: Master Strategic Roadmap pending AI synthesis and strategic configuration validation.",
        criticalConstraint: project.strategicConstraints || "Awaiting Strategic Configuration",
        phases: [
          { id: "phase1", title: "Alignment & Foundation", month: "Month 1", objective: "Establish Foundation", tactics: ["Initial setup"], deliverables: ["Discovery Report"], outcome: "Systems Ready" },
          { id: "phase2", title: "Executional Momentum", month: "Month 2", objective: "Scale Operations", tactics: ["Growth push"], deliverables: ["Execution Brief"], outcome: "Growth Visible" },
          { id: "phase3", title: "Intelligence & Optimization", month: "Month 3", objective: "Optimize Systems", tactics: ["Refinement"], deliverables: ["Optimization Guide"], outcome: "Peak Efficiency" }
        ]
      }
    }

    // 5. Investment Calculator (Task 4)
    let totalArtifactCost = 0
    const allDeliverables = masterPlan.phases.flatMap((p: any) => p.deliverables || [])
    
    allDeliverables.forEach((d: string) => {
      const template = artifactLibrary.find(a => a.title.toLowerCase() === d.toLowerCase() || d.toLowerCase().includes(a.title.toLowerCase()))
      if (template) {
        totalArtifactCost += template.unitCost
      } else {
        totalArtifactCost += 1500 // Base cost for custom artifacts
      }
    })

    // Narrowed Investment Range logic
    const minInvestment = totalArtifactCost
    const maxInvestment = Math.round(totalArtifactCost * 1.4)
    const quotedInvestment = `$${minInvestment.toLocaleString()} - $${maxInvestment.toLocaleString()}`

    // 6. Update Project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        masterPlan: masterPlan as any,
        masterRoadmap: JSON.stringify(masterPlan),
        overallIntelligenceScore: avgScore,
        quotedInvestment,
        roadmapStatus: 'GENERATED'
      }
    })

    // 7. Generate Milestones
    if (timeline.length > 0) {
      const milestoneData = timeline.map((phase, index) => ({
        title: `${phase.title}: ${phase.objective}`,
        projectId,
        status: 'Pending',
        order: index,
        date: new Date(new Date().setMonth(new Date().getMonth() + index + 1))
      }))

      await prisma.milestone.deleteMany({
        where: { 
          projectId,
          title: { contains: 'Phase' } 
        }
      })

      await prisma.milestone.createMany({
        data: milestoneData
      })
    }

    return updatedProject

  } catch (error) {
    console.error('Error generating master roadmap:', error)
    throw error
  }
}
