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

  // RULE 1: If no session exists OR assessment status is NOT COMPLETED, redirect back to assessment form
  const validStatuses = ['COMPLETED', 'PUBLISHED', 'UNDER_REVIEW', 'MANUAL_REVIEW', 'completed', 'submitted'];
  const isComplete = assessmentSession && validStatuses.includes(assessmentSession.status?.toUpperCase());

  if (!assessmentSession || !isComplete) {
    console.log(`[StrategyIQResultsPage] Assessment incomplete or missing. Redirecting to questions.`);
    redirect(`/strategy-iq/${projectId}/${dimension}`);
  }

  // RULE 2: If the assessment IS COMPLETED but the briefSummary (AI Synthesis) is missing, ONLY THEN show the "Synthesis in Progress" screen
  if (!assessmentSession.briefSummary && !assessmentSession.certifiedNarrative) {
    console.log(`[DEBUG] Force Generating Narrative for Session: ${assessmentSession.id}`);
    
    // Check API Key
    const hasApiKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'mock-key';
    
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

  // If after generation attempt we still don't have a summary, show the processing screen
  if (!assessmentSession.briefSummary && !assessmentSession.certifiedNarrative) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6">
        {/* Global Chrome: Logo & Phase Badge Only */}
        <div className="fixed top-0 left-0 right-0 h-16 px-8 flex items-center justify-between border-b border-white/5 bg-[#050505]">
          <div className="flex items-center gap-4">
            <span className="text-white font-big-shoulders font-black tracking-widest text-xl uppercase italic">LG // PORTAL ADMIN</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 rounded-full border border-teal/20 bg-teal/5 text-teal text-[9px] font-bold tracking-[0.2em] uppercase">Phase 8.1 // Discovery Synthesis</div>
          </div>
        </div>

        <div className="text-center space-y-8 max-w-md animate-in fade-in zoom-in duration-700">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-teal/5 border border-teal/20 flex items-center justify-center text-teal mx-auto">
              <Bot size={40} className="animate-pulse" />
            </div>
            <div className="absolute inset-0 border-t-2 border-teal rounded-full animate-spin duration-[2000ms]" />
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white uppercase tracking-[0.2em] font-big-shoulders italic">Finalizing Discovery Data</h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-inter italic">
              StrategyIQ™ is verifying your inputs. If this takes longer than 10 seconds, please ensure all assessment questions were submitted.
            </p>
          </div>

          <div className="pt-4 flex flex-col items-center gap-6">
             <RefreshButton projectId={projectId} dimension={dimension} autoRefresh={true} />
             
             {/* Standard Breadcrumb Only */}
             <div className="pt-8 border-t border-white/5 w-full">
               <Breadcrumbs 
                  showBack={false}
                  items={[
                    { label: 'DASHBOARD', href: '/dashboard' },
                    { label: (project.client?.name || project.client?.company || 'ACME CORP').toUpperCase(), href: `/admin/projects/${project.id}` },
                    { label: `${dimension.toUpperCase()} STRATEGY`, active: true }
                  ]} 
                />
             </div>
          </div>
        </div>
      </div>
    )
  }

  // RULE 3: If completed and summary exists, show ResultsView
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
