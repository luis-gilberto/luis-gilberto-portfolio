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
    let { projectId, dimension: rawDimension, score, responses } = body

    // Task 4: Resolve "active" or "latest" to real ID
    let resolvedProjectId: string = projectId;
    
    // Self-Healing Logic: Verify project exists or recreate it
    let project = await prisma.project.findFirst({
      where: { 
        OR: [
          { id: projectId }, 
          { customId: projectId }
        ] 
      }
    });

    if (projectId === 'active' || projectId === 'latest' || !project) {
      // Find the latest project for the user OR their associated client (Duplicate-Proofing V6.2)
      const latestProject = await prisma.project.findFirst({
        where: { 
          OR: [
            { userId: session.user.id },
            { clientId: session.user.clientId }
          ]
        },
        orderBy: { updatedAt: 'desc' },
        select: { id: true, clientId: true }
      });
      
      if (!latestProject) {
        // Fallback: Final check if there is ANY project for the user or client
        const anyProject = await prisma.project.findFirst({
           where: { 
             OR: [
               { userId: session.user.id },
               { clientId: session.user.clientId }
             ]
           },
           orderBy: { updatedAt: 'desc' },
           select: { id: true, clientId: true }
        });
        
        if (anyProject) {
             resolvedProjectId = anyProject.id;
             // We need to fetch the full project to get clientId
             project = await prisma.project.findUnique({ where: { id: resolvedProjectId }});
        } else {
             // CRITICAL SELF-HEALING: Create a new project if absolutely nothing exists
             // This prevents the "Foreign Key" crash
             console.log("[SELF-HEALING] No project found. Creating new 'Strategy Calibration' project.");
             
             // First ensure a client exists
             let client = await prisma.client.findFirst({ where: { email: session.user.email } });
             if (!client) {
                client = await prisma.client.create({
                    data: {
                        name: session.user.name || "Valued Client",
                        email: session.user.email,
                        status: "Active"
                    }
                });
             }

             project = await prisma.project.create({
                data: {
                    title: "Strategy Calibration",
                    userId: session.user.id,
                    clientId: client.id,
                    status: 'DISCOVERY'
                }
             });
             resolvedProjectId = project.id;
        }
      } else {
          resolvedProjectId = latestProject.id;
          project = await prisma.project.findUnique({ where: { id: resolvedProjectId }});
      }
    } else {
        // Project was found by ID directly
        resolvedProjectId = project.id;
    }

    if (!project || !project.clientId) {
        return NextResponse.json({ error: 'System Error: Failed to resolve project context.' }, { status: 500 })
    }

    const actualClientId = project.clientId;
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
      status = 'MANUAL_REVIEW'
      insights = [`The ${dimension.toUpperCase()} diagnostic identifies key opportunities for market differentiation. Your current posture reflects a foundational stage.`]
      analysis = "AI Synthesis failed or timed out. Strategist intervention required to finalize narrative."
    }

    // Task 3: Format briefSummary as plain text (not JSON)
    const briefSummaryText = insights.join('\n\n')

    // Force DISCOVERY status for project
    try {
      await prisma.project.update({
        where: { id: resolvedProjectId },
        data: {
          status: 'DISCOVERY',
          [`${dimension}Status`]: 'COMPLETED'
        }
      })
    } catch (updateError: any) {
      console.error('Project update failed (Non-fatal):', updateError);
    }

    // Task 3: Prisma Upsert Fix - Use separate columns for summary and analysis
    const assessmentSession = await prisma.assessmentSession.upsert({
      where: {
        projectId_assessmentType: {
          projectId: resolvedProjectId,
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
        projectId: resolvedProjectId,
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

    return NextResponse.json({ success: true, sessionId: assessmentSession.id, projectId: resolvedProjectId })
  } catch (error: any) {
    console.error('CRITICAL: Strategy-IQ Save Error:', error);
    
    // Defensive error serialization to avoid circular references
    const errorResponse = {
      error: 'Internal Server Error',
      message: error.message || 'Unknown error occurred',
      code: error.code
    };

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
