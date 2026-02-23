import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key',
})

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json()

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { client: true }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // 1. Prepare Data for AI
    const prompt = `
      You are a Senior Strategic Consultant. Generate a "Strategic Synthesis" based on the following Client Charter.
      
      CLIENT: ${project.client?.name || 'Acme Corp'}
      PROJECT: ${project.title}
      
      CHARTER DATA:
      - Business Driver: ${project.businessDriver || 'Not Set'}
      - Metric: ${project.metricName || 'Not Set'} (Target: ${project.metricTarget || 'N/A'}, Base: ${project.metricBaseline || 'N/A'})
      - Operational Priority: ${project.operationalPriority || 'Not Set'}
      - Benchmarks: CAC: ${project.cacCurrent || 'N/A'}->${project.cacGoal || 'N/A'}, LTV: ${project.ltvCurrent || 'N/A'}->${project.ltvGoal || 'N/A'}
      - Constraints: ${project.strategicConstraints || 'None'}
      - History (Signal): ${project.marketingSignal || 'None'}
      - History (Noise): ${project.marketingNoise || 'None'}
      
      REQUIREMENTS:
      1. Write exactly 2 paragraphs.
      2. Paragraph 1: "The Diagnosis" - Assess the current state and constraints.
      3. Paragraph 2: "The Strategic Mandate" - Define the path forward based on the driver and metrics.
      4. Tone: Board-level, authoritative, concise. No fluff.
      5. Constraint: NO em-dashes (—). Use colons or commas. Sentence case.
      
      Return ONLY the raw text of the 2 paragraphs, separated by a double newline.
    `

    let strategicNarrative = "Strategic narrative generation failed."

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'mock-key') {
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: "You are a strategic consultant." },
            { role: "user", content: prompt }
          ],
          model: "gpt-4o",
        })
        strategicNarrative = completion.choices[0].message.content || strategicNarrative
      } catch (e) {
        console.error("OpenAI Error", e)
        strategicNarrative = "AI Service Unavailable. Manual synthesis required."
      }
    } else {
        // Mock generation for dev
        strategicNarrative = `The diagnosis reveals a foundational gap in ${project.operationalPriority || 'operations'}, constrained by ${project.strategicConstraints || 'market friction'}. Current performance metrics indicate a need for immediate recalibration of the ${project.businessDriver || 'growth'} engine to align with the client's aggressive targets.\n\nThe strategic mandate is to accelerate ${project.metricName || 'growth'} by leveraging high-fidelity creative assets. We will deploy a targeted campaign infrastructure to bridge the gap between current baselines and the ${project.metricTarget || 'target'} objective, ensuring long-term sustainability.`
    }

    // 2. Persist to Project (masterPlan hack)
    // We use masterPlan JSON to store the narrative since we can't migrate schema easily
    const currentMasterPlan = (project.masterPlan as any) || {}
    const updatedMasterPlan = {
        ...currentMasterPlan,
        strategicNarrative
    }
    
    await prisma.project.update({
        where: { id: projectId },
        data: {
            masterPlan: updatedMasterPlan,
            status: 'CALIBRATED' // Lock the charter
        }
    })

    // 3. Create Vault Artifact (AssessmentSession + Deliverable)
    
    // 3a. Create/Update Session (Type: STRATEGIC_CHARTER)
    const sessionPayload = {
        narrative: strategicNarrative,
        charter: {
            driver: project.businessDriver,
            metric: project.metricName,
            constraints: project.strategicConstraints,
        },
        certifiedAt: new Date().toISOString()
    }
    
    let sessionId = null;

    // Check if session exists
    const existingSession = await prisma.assessmentSession.findUnique({
        where: {
            projectId_assessmentType: {
                projectId,
                assessmentType: 'STRATEGIC_CHARTER'
            }
        }
    })

    if (existingSession) {
        await prisma.assessmentSession.update({
            where: { id: existingSession.id },
            data: {
                certifiedNarrative: JSON.stringify(sessionPayload),
                status: 'PUBLISHED',
                briefSummary: strategicNarrative,
                isPublished: true
            }
        })
        sessionId = existingSession.id
    } else {
        if (project.clientId) {
            const newSession = await prisma.assessmentSession.create({
                data: {
                    projectId,
                    clientId: project.clientId,
                    consultantId: project.userId, 
                    assessmentType: 'STRATEGIC_CHARTER',
                    status: 'PUBLISHED',
                    certifiedNarrative: JSON.stringify(sessionPayload),
                    briefSummary: strategicNarrative,
                    isPublished: true
                }
            })
            sessionId = newSession.id
        }
    }

    // 3b. Create Deliverable
    const existingDeliverable = await prisma.deliverable.findFirst({
        where: {
            projectId,
            title: 'Strategic Foundation Artifact'
        }
    })

    if (!existingDeliverable) {
        await prisma.deliverable.create({
            data: {
                projectId,
                title: 'Strategic Foundation Artifact',
                type: 'Strategy Brief',
                status: 'PUBLISHED',
                fileUrl: sessionId ? `/intelligence/mini-brief?sessionId=${sessionId}` : '#', // Link to the mini brief
            }
        })
    }

    return NextResponse.json({ success: true, narrative: strategicNarrative })

  } catch (error) {
    console.error('Error generating synthesis:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
