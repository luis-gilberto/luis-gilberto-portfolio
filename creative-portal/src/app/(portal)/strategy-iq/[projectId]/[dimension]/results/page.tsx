import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ResultsView } from '@/components/strategy/ResultsView'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import RefreshButton from '@/components/strategy/RefreshButton'
import { Rocket, Bot } from 'lucide-react'
import { generateStrategyNarrative } from '@/lib/strategy-ai'

interface PageProps {
  params: Promise<{
    projectId: string
    dimension: string
  }>
}

export default async function StrategyIQResultsPage({ params }: PageProps) {
  const { projectId: rawProjectId, dimension: rawDimension } = await params
  
  // Task 1: Server-Side X-Ray & Normalization
  console.log("[DEBUG] Results Page Params:", { projectId: rawProjectId, dimension: rawDimension });
  const dimension = rawDimension.toLowerCase();
  
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const role = session.user.role

  // Handle "active" alias
  let projectId = rawProjectId;
  if (projectId === 'active') {
    const userProject = await prisma.project.findFirst({
      where: { userId: session.user.id, status: { in: ['ACTIVE', 'DISCOVERY'] } },
      orderBy: { updatedAt: 'desc' }
    });
    if (userProject) projectId = userProject.id;
  }

  // Handle project fetching - No more "default" ghost
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { client: true }
  });

  // KILL SWITCH: Verify project status for non-admins
  const isCalibrated = project?.status === 'CALIBRATED' || project?.status === 'ACTIVE' || project?.status === 'CERTIFIED';
  if (role !== 'ADMIN' && !isCalibrated) {
    redirect('/dashboard?error=calibration_required');
  }

  if (!project || !project.clientId) {
    console.log(`[StrategyIQResultsPage] Project or Client missing for ID: ${projectId}`)
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center text-coral mx-auto animate-pulse">
            <Rocket size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest font-big-shoulders italic">Initializing Intelligence</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            We're calibrating the StrategyIQ™ Engine for this project. If you've just completed an assessment, please wait a moment.
          </p>
          <a href="/strategy-iq" className="inline-block text-coral hover:text-coral/80 text-xs font-bold uppercase tracking-widest pt-4">
            Back to Strategy Hub
          </a>
        </div>
      </div>
    )
  }

  // Fetch the latest session for this dimension (Normalized to lowercase)
  let assessmentSession = await prisma.assessmentSession.findFirst({
    where: {
      projectId: project.id,
      assessmentType: {
        equals: dimension,
        mode: 'insensitive'
      },
      status: {
        in: role === 'ADMIN' 
          ? ['COMPLETED', 'PUBLISHED', 'UNDER_REVIEW', 'MANUAL_REVIEW', 'completed', 'submitted'] 
          : ['COMPLETED', 'PUBLISHED', 'completed', 'submitted', 'under_review', 'manual_review', 'UNDER_REVIEW', 'MANUAL_REVIEW']
      }
    },
    include: {
      project: true,
      client: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  // --- TASK 2: HARD FORCE GENERATION LOGIC ---
  if (assessmentSession && !assessmentSession.briefSummary && !assessmentSession.certifiedNarrative) {
    console.log(`[DEBUG] Force Generating Narrative for Session: ${assessmentSession.id}`);
    
    // Check API Key
    const hasApiKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'mock-key';
    console.log("[DEBUG] AI Config Check:", { hasApiKey });

    try {
      // Explicitly call the generation utility
      const updatedSession = await generateStrategyNarrative(assessmentSession);
      
      if (updatedSession && updatedSession.briefSummary) {
        console.log("[DEBUG] Hard Save Successful. Narrative Length:", updatedSession.briefSummary.length);
        assessmentSession = updatedSession as any;
      }
    } catch (healError) {
      console.error('[DEBUG] Hard Force Generation Failed:', healError);
    }
  }

  if (!assessmentSession) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center text-teal mx-auto animate-bounce">
            <Bot size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest font-big-shoulders italic">Processing Results</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Our AI is currently synthesizing your narrative. This process usually takes 5-10 seconds. 
          </p>
          <div className="pt-4">
             <RefreshButton projectId={projectId} dimension={dimension} autoRefresh={true} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-12 pb-12">
      <ResultsView 
        session={assessmentSession}
        projectId={projectId}
        dimension={dimension}
        userRole={role}
        clientName={project.client?.name || 'Partner'}
      />
    </div>
  )
}
