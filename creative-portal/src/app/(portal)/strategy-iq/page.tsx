'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { 
  Rocket, 
  Megaphone, 
  Target, 
  Lightbulb, 
  ChevronRight, 
  ArrowRight,
  LayoutDashboard, 
  Settings2,
  CheckCircle,
  PlayCircle,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  FileText,
  HelpCircle,
  X
} from 'lucide-react';
import { StrategyCard, AssessmentStatus } from '@/components/strategy/StrategyCard';
import { AnimatePresence, motion } from 'framer-motion';
// Imports adjusted based on file tree check
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import AssessmentRunner from '@/components/strategy/AssessmentRunner';
import StrategicBriefModal from '@/components/strategy/StrategicBriefModal';
import { AssessmentCategory } from '@/lib/strategyData';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/providers/toast-provider';
import { safeJsonParse } from '@/lib/json-utils';

import { useSession } from 'next-auth/react';

import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CLIENT ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

type AssessmentState = {
  status: 'pending' | 'in-progress' | 'completed';
  score: number; // 0-100
  answers: Record<string, number>; // Saved answers to allow resuming/editing
  isPublished?: boolean;
};

const CLIENTS = [
  {
    id: 'cml73ju300003vkikvhv32lit', // Real Acme Project ID
    name: 'Acme Corp',
    email: 'client@acme.com',
    type: 'Brand Repositioning',
    budget: '$25K - $50K',
    timeline: '3-6 months',
    size: '50-200 employees'
  },
  {
    id: 'c2',
    name: 'TechStart Inc',
    email: 'techstart@example.com',
    type: 'Product Launch (GTM)',
    budget: '$50K - $100K',
    timeline: '6-9 months',
    size: '20-50 employees'
  }
];

const assessmentAreas = [
  {
    id: 'gtm',
    icon: Rocket,
    title: 'Go-to-Market Sprint',
    description: 'Market entry strategy, positioning, and launch roadmap.',
    duration: '6-12 WEEKS',
    isHighlight: false,
    education: {
      title: 'Why GTM Strategy?',
      points: [
        'Market entry timing: Launching when your audience is most receptive.',
        'Channel selection: Identifying where your high-value customers live.',
        'Risk mitigation: Avoiding expensive pivots by validating demand early.'
      ]
    }
  },
  {
    id: 'brand',
    icon: Megaphone,
    title: 'Brand Intelligence',
    description: 'Positioning, messaging, and systematic brand development.',
    duration: '8-16 WEEKS',
    isHighlight: true,
    education: {
      title: 'Why Brand Intelligence?',
      points: [
        'Competitive Moat: Positioning that makes price irrelevant.',
        'Messaging Clarity: Cutting through the noise with a clear value prop.',
        'Consistency: Building trust through a systematic visual and narrative identity.'
      ]
    }
  },
  {
    id: 'campaign',
    icon: Target,
    title: 'Strategic Campaigns',
    description: 'Integrated campaign strategy and optimization.',
    duration: '12-20 WEEKS',
    isHighlight: false,
    education: {
      title: 'Why Strategic Campaigns?',
      points: [
        'Lead Generation: Turning your strategy into a predictable revenue engine.',
        'Multi-Channel Sync: Ensuring every touchpoint reinforces the same goal.',
        'Data-Driven Iteration: Constant optimization based on real-world performance.'
      ]
    }
  },
  {
    id: 'creative',
    icon: Lightbulb,
    title: 'Creative Strategy',
    description: 'Content frameworks and scalable creative systems.',
    duration: '4-12 WEEKS',
    isHighlight: false,
    education: {
      title: 'Why Creative Strategy?',
      points: [
        'Pattern Interruption: Visual hooks that stop the scroll.',
        'Narrative Resonance: Stories that connect with human psychology.',
        'Scalable Systems: Content frameworks that grow with your business.'
      ]
    }
  },
];

export default function StrategyIQPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState<AssessmentCategory | null>(null);
  const [viewMode, setViewMode] = useState<'dashboard' | 'assessment' | 'results'>('dashboard');
  const [selectedClient, setSelectedClient] = useState(CLIENTS[0]);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [educationModal, setEducationModal] = useState<any>(null);
  const [dbClients, setDbClients] = useState<any[]>([]);

  // 1. Database-First State Management
  const [isMounted, setIsMounted] = useState(false);
  const [clientProgress, setClientProgress] = useState<Record<string, AssessmentState>>({ 
    gtm: { status: 'pending', score: 0, answers: {} }, 
    brand: { status: 'pending', score: 0, answers: {} }, 
    campaign: { status: 'pending', score: 0, answers: {} }, 
    creative: { status: 'pending', score: 0, answers: {} }, 
  }); 

  const role = session?.user?.role;

  // 1. Fetch real clients for Admins
  useEffect(() => {
    async function fetchClients() {
      if (role === 'ADMIN' || role === 'CONSULTANT') {
        try {
          const res = await fetch('/api/admin/clients');
          if (res.ok) {
            const data = await res.json();
            setDbClients(data);
            if (data.length > 0) {
              const mapped = data.map((c: any) => ({
                id: c.id,
                email: c.email,
                name: c.name,
                type: c.projectType || 'PHASE: PLANNING',
                budget: c.budgetRange || 'TBD',
                timeline: c.timeline || 'TBD',
                size: c.companySize || 'TBD'
              }));
              setSelectedClient(mapped[0]);
            }
          }
        } catch (error) {
          console.error('Error fetching clients:', error);
        }
      }
    }
    fetchClients();
  }, [role]);

  // 2. Fetch Project Data for Partners or selected client (Priority)
  useEffect(() => {
    async function fetchProjectData() {
      const targetUserEmail = (role === 'CLIENT') ? session?.user?.email : selectedClient?.email;
      
      if (targetUserEmail) {
        try {
          if (!supabase) return;
          
          const { data: user } = await supabase.from('User').select('id').eq('email', targetUserEmail).single();
          if (user) {
            const { data: projects } = await supabase
              .from('Project')
              .select('*')
              .eq('userId', user.id)
              .in('status', ['ACTIVE', 'DISCOVERY']);
            
            if (projects && projects.length > 0) {
              // Task 2: Anchor to Acme Project VHV32LIT
              const activeProj = projects.find((p: any) => p.id.endsWith('vhv32lit')) || projects[0];
              setActiveProject(activeProj);
              
              if (role !== 'CLIENT') {
                setSelectedClient(prev => ({
                  ...prev,
                  id: activeProj.id
                }));
              } else {
                setSelectedClient({
                  ...CLIENTS[0],
                  id: activeProj.id,
                  name: activeProj.title
                });
              }

              // Fetch real progress from DB (Master Record)
              const { data: assessments } = await supabase
                .from('assessment_sessions')
                .select('*')
                .eq('project_id', activeProj.id);

              if (assessments) {
                const progress: Record<string, AssessmentState> = {
                  gtm: { status: 'pending', score: 0, answers: {} },
                  brand: { status: 'pending', score: 0, answers: {} },
                  campaign: { status: 'pending', score: 0, answers: {} },
                  creative: { status: 'pending', score: 0, answers: {} },
                };

                assessments.forEach((a: any) => {
                  const type = a.assessment_type.toLowerCase()
                  if (progress[type]) {
                    progress[type] = {
                      status: a.status as any,
                      score: a.intelligence_score,
                      answers: safeJsonParse(a.responses, {}),
                      isPublished: a.isPublished
                    };
                  }
                });
                setClientProgress(progress);
              }
            }
          }
        } catch (err) {
          console.error('Error fetching project data:', err);
        }
      }
      setIsLoading(false);
    }
    
    if (isMounted) {
      fetchProjectData();
    }
  }, [session, role, isMounted, selectedClient?.email]);

  // 3. Session Backup (Secondary)
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('strategyiq_progress');
    if (saved) {
      setClientProgress(prev => {
        const local = safeJsonParse(saved, {});
        // Only use local if it has more data or DB failed
        return { ...prev, ...local };
      });
    }
  }, []);

  // Effect to keep localStorage updated as secondary backup
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('strategyiq_progress', JSON.stringify(clientProgress));
    }
  }, [clientProgress, isMounted]);
  
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // 2. Intelligence Score Calculation
  const overallScore = useMemo(() => {
    const completed = Object.values(clientProgress).filter(p => p.status === 'completed');
    if (completed.length === 0) return 0;
    const total = completed.reduce((sum, p) => sum + p.score, 0);
    return Math.round(total / completed.length);
  }, [clientProgress]);
  
  const hasAnyCompletion = useMemo(() => {
    return Object.values(clientProgress).some(p => p.status === 'completed');
  }, [clientProgress]);

  // 3. Service Matching Logic
  const getServiceMatch = (score: number) => {
    if (score === 0) return { title: 'Waiting for Data', price: '$0' };
    
    // Logic extracted from The Hub (scopeiq/index.html)
    // Mapped to Intelligence Score as a proxy for complexity/maturity
    if (score < 30) return { title: 'Quick-Start Sprint', price: '$3K - $8K' };
    if (score < 50) return { title: 'Strategic Planning', price: '$8K - $18K' };
    if (score < 70) return { title: 'Fractional Leadership', price: '$3K - $6K/mo' };
    if (score < 85) return { title: 'Growth Partnership', price: '$8K - $15K/mo' };
    
    return { title: 'Strategic Intelligence', price: '$15K - $30K' };
  };

  const serviceMatch = getServiceMatch(overallScore);

  useEffect(() => {
    if (contentRef.current && viewMode === 'dashboard') {
      // @ts-ignore
      gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [viewMode]);

  const handleAssessmentStart = (id: string) => {
    const role = session?.user?.role || 'CLIENT';
    const isCompleted = clientProgress[id].status === 'completed';
    
    if (isCompleted) {
      // Use activeProject ID, then selectedClient ID, then fallback
      const projectId = activeProject?.id || (selectedClient.id !== 'c1' && selectedClient.id !== 'c2' ? selectedClient.id : 'default');
      
      if (role === 'ADMIN') {
        router.push(`/admin/projects/${projectId}/strategy/${id}/results`);
      } else {
        router.push(`/strategy-iq/${projectId}/${id}/results`);
      }
      return; 
    }
    
    setActiveAssessment(id as AssessmentCategory);
    setViewMode('assessment');
  };

  const handleAssessmentComplete = async (result: { score: number; answers: Record<string, number> }) => {
    if (!activeAssessment) return;
    
    // Auto-Initialization Logic for Homeless Clients
    let projectId = activeProject?.id || (selectedClient.id !== 'c1' && selectedClient.id !== 'c2' ? selectedClient.id : null);

    if (!projectId || projectId === 'default' || projectId === 'c1' || projectId === 'c2') {
      try {
        // We'll call a new auto-init API or just use the existing admin client creation logic
        // For now, let's attempt to find or create a project via a new internal endpoint or direct prisma if we were server-side
        // Since we are client-side, we should call an API.
        const initRes = await fetch('/api/strategy-iq/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: session?.user?.email || selectedClient.email,
            company: selectedClient.name
          })
        });

        if (initRes.ok) {
          const newProject = await initRes.json();
          projectId = newProject.id;
          setActiveProject(newProject);
        } else {
          throw new Error('Failed to auto-initialize project');
        }
      } catch (err) {
        console.error('Auto-init failed:', err);
        toast("INITIALIZATION FAILED", "No active project found and auto-initialization failed. Please contact support.", "error")
        throw err;
      }
    }

    try {
      const response = await fetch('/api/strategy-iq/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          dimension: activeAssessment,
          score: result.score,
          responses: result.answers
        })
      });

      if (response.ok) {
        setClientProgress(prev => ({
          ...prev,
          [activeAssessment]: {
            status: 'completed',
            score: result.score,
            answers: result.answers
          }
        }));
        
        // Redirect logic: Admin goes to Workbench, Partner goes to Results
        setTimeout(() => {
          if (session?.user?.role === 'ADMIN') {
            router.push(`/admin/projects/${projectId}/strategy/${activeAssessment}/results`);
          } else {
            router.push(`/strategy-iq/${projectId}/${activeAssessment}/results`);
          }
          
          setActiveAssessment(null);
          setViewMode('dashboard');
        }, 500);
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: 'Unknown server error', status: response.status };
        }
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      throw error;
    }
  };

  const handleAssessmentClose = () => {
    setViewMode('dashboard');
    setActiveAssessment(null);
  };

  const handlePublish = (category: AssessmentCategory) => {
    setClientProgress(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        isPublished: true
      }
    }));
    
    // Also save to localStorage for persistence in this demo
    const saved = localStorage.getItem('strategyiq_progress');
    if (saved) {
      const parsed = safeJsonParse(saved, {});
      if (parsed[category]) {
        parsed[category].isPublished = true;
        localStorage.setItem('strategyiq_progress', JSON.stringify(parsed));
      }
    }
  };

  const handleAssessmentNext = (nextCategory: AssessmentCategory) => {
    const sequence: AssessmentCategory[] = ['gtm', 'brand', 'campaign', 'creative'];
    const currentIndex = sequence.indexOf(activeAssessment as AssessmentCategory);
    
    if (currentIndex >= 0 && currentIndex < sequence.length - 1) {
      const nextId = sequence[currentIndex + 1];
      setActiveAssessment(nextId);
      // Ensure we stay in assessment mode (or re-trigger it)
      setViewMode('assessment');
    } else {
      // If we are at the end, go back to dashboard
      setViewMode('dashboard');
      setActiveAssessment(null);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-full bg-[#0A0A0A] text-[#F4F1ED] font-sans">
      <div className="flex">
        <main className="flex-1 transition-all duration-300 ease-in-out">
          <AnimatePresence mode="wait">
            {viewMode === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                ref={contentRef} 
                className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12"
              >
                <Breadcrumbs 
                  items={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'StrategyIQ™ Engine', active: true }
                  ]} 
                />
                
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-medium text-zinc-400 tracking-tight font-inter mb-2">
                      StrategyIQ™ Engine
                    </h1>
                    <p className="text-zinc-500 max-w-xl text-lg font-inter leading-relaxed italic">
                      Analyze your current posture and unlock bespoke strategic roadmaps across our four core intelligence pillars.
                    </p>
                  </div>
                </div>

                {/* CONTEXT BAR (Locked for Partners) */}
                {role !== 'CLIENT' ? (
                  <div className="bg-[#141414] border border-white/5 rounded-xl p-8 mb-12 shadow-sm">
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-coral" />
                        <h3 className="text-[11px] font-bold tracking-widest text-white/40 uppercase">
                          Client context
                        </h3>
                      </div>
                      
                      {/* DYNAMIC DROPDOWN (HTML Select Fallback) */}
                      <div className="relative inline-block">
                        <select 
                          className="appearance-none bg-transparent border-none text-[10px] font-bold text-zinc-500 hover:text-teal transition-colors outline-none pr-6 cursor-pointer focus:ring-0 uppercase tracking-widest"
                          value={selectedClient.id}
                          onChange={(e) => {
                            const found = dbClients.find(c => c.id === e.target.value);
                            if (found) {
                              setSelectedClient({
                                id: found.id,
                                email: found.email,
                                name: found.name,
                                type: found.projectType || 'PHASE: PLANNING',
                                budget: found.budgetRange || 'TBD',
                                timeline: found.timeline || 'TBD',
                                size: found.companySize || 'TBD'
                              });
                            }
                          }}
                        >
                          {dbClients.length > 0 ? (
                            dbClients.map(c => (
                              <option key={c.id} value={c.id} className="bg-[#1A1A1A] text-gray-200">
                                {c.name}
                              </option>
                            ))
                          ) : (
                            <option value="none" className="bg-[#1A1A1A] text-gray-200">No clients found</option>
                          )}
                        </select>
                        <ChevronRight size={14} className="rotate-90 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                      </div>
                    </div>

                    {/* DYNAMIC GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-2 font-bold">Project Type</div>
                        <div className="text-sm font-medium text-zinc-400">{selectedClient.type}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-2 font-bold">Budget Range</div>
                        <div className="text-sm font-medium text-zinc-400">{selectedClient.budget}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-2 font-bold">Timeline</div>
                        <div className="text-sm font-medium text-zinc-400">{selectedClient.timeline}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-2 font-bold">Company Size</div>
                        <div className="text-sm font-medium text-zinc-400">{selectedClient.size}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-12">
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-6 rounded-2xl backdrop-blur-sm">
                      <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal">
                        <Rocket size={24} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-white/20 tracking-widest">Active intelligence</div>
                        <h3 className="text-2xl font-bold text-white font-big-shoulders tracking-widest italic">
                          Strategy engine: <span className="text-teal">{selectedClient.name}</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION TITLE */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                    <h2 className="text-[11px] font-bold tracking-widest text-white/40 uppercase">
                      Strategic assessment areas
                    </h2>
                  </div>
                  <p className="text-zinc-500 text-lg font-inter italic">Select the primary strategic focus area to begin the intelligence assessment.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {assessmentAreas.map((area) => {
                     const p = clientProgress[area.id]
                     let status: AssessmentStatus = "NOT_STARTED"
                     
                     // 1. Check DB progress first
                     if (p.isPublished) status = "PUBLISHED"
                     else if (p.status === 'completed' || p.status === 'COMPLETED' || p.status === 'PUBLISHED') status = "PUBLISHED"
                     else if (p.status === 'UNDER_REVIEW' || p.status === 'MANUAL_REVIEW') status = "UNDER_REVIEW"
                     else if (p.status === 'in-progress' || p.status === 'IN_PROGRESS') status = "IN_PROGRESS"

                     // 2. Check local completed state fallback
                     const isLocalCompleted = typeof window !== 'undefined' && localStorage.getItem(`${area.id.toLowerCase()}_assessment_completed`) === 'true'
                     if (status === "NOT_STARTED" && isLocalCompleted) status = "COMPLETED"

                     return (
                       <StrategyCard
                         key={area.id}
                         id={area.id}
                         title={area.title}
                         description={area.description}
                         status={status}
                         projectId={activeProject?.id || "cml73ju300003vkikvhv32lit"}
                         onClick={() => handleAssessmentStart(area.id)}
                       />
                     )
                   })}
                </div>

                {/* BOTTOM SCORECARD (Admin Only) */}
      {session?.user?.role !== 'CLIENT' && (
        <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="bg-[#141414] rounded-xl p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[100px] pointer-events-none" />
                    
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-24 h-24 rounded-full bg-[#0A0A0A] border-4 border-white/5 flex items-center justify-center relative">
                        <span className="text-3xl font-bold text-white">{overallScore}</span>
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/5" />
                          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="8" fill="none" className="text-teal-500 transition-all duration-1000" strokeDasharray="289" strokeDashoffset={289 - (289 * overallScore) / 100} strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">Strategic intelligence score</h3>
                        <p className="text-gray-400 text-sm">Aggregate score across all assessment modules.</p>
                      </div>
                    </div>
                    
                    <div className="h-12 w-px bg-white/10 hidden md:block" />
                    
                    <div className="flex-1 w-full relative z-10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs tracking-wider text-gray-500 font-medium">Recommended engagement</span>
                        <span className="text-teal-400 font-bold">{serviceMatch.price}</span>
                      </div>
                      <div className="bg-[#0A0A0A] p-4 rounded-lg border border-white/5 flex items-center justify-between group cursor-pointer hover:border-teal-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="text-teal-500" size={20} />
                          <span className="text-white font-medium">{serviceMatch.title}</span>
                      </div>
                      {session?.user?.role !== 'CLIENT' && (
                        <Button 
                          size="sm" 
                          variant="strategy-secondary" 
                          className={cn(
                            "text-[9px] h-8 px-4",
                            !hasAnyCompletion && "opacity-50 cursor-not-allowed"
                          )}
                          disabled={!hasAnyCompletion}
                          onClick={() => setIsBriefOpen(true)}
                        >
                          Generate brief <ChevronRight size={14} className="ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                  </div>
                </div>
              )}
                
              </motion.div>
            ) : (
              <motion.div
                key="assessment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12"
              >
                {viewMode === 'assessment' && activeAssessment && (
                  <AssessmentRunner 
                    key={activeAssessment}
                    category={activeAssessment}
                    initialAnswers={clientProgress[activeAssessment].answers}
                    onComplete={handleAssessmentComplete}
                    onClose={handleAssessmentClose}
                    onStartNext={handleAssessmentNext}
                    userRole={session?.user?.role || 'CLIENT'}
                    isPublished={clientProgress[activeAssessment].isPublished}
                    onPublish={() => handlePublish(activeAssessment)}
                    projectId={activeProject?.id}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      
      {session?.user?.role !== 'CLIENT' && (
        <StrategicBriefModal 
          isOpen={isBriefOpen}
          onClose={() => setIsBriefOpen(false)}
          data={{
            clientName: selectedClient.name,
            overallScore: overallScore,
            serviceTitle: serviceMatch.title,
            servicePrice: serviceMatch.price,
            answers: Object.values(clientProgress).reduce((acc, curr) => ({ ...acc, ...curr.answers }), {}),
            categoryScores: Object.keys(clientProgress).reduce((acc, key) => ({ ...acc, [key]: clientProgress[key].score }), {})
          }}
        />
      )}

      {/* Education Modal */}
      <AnimatePresence>
        {educationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEducationModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-[32px] bg-[#141414] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center text-coral">
                      <HelpCircle size={20} />
                    </div>
                    <h2 className="text-3xl font-big-shoulders font-bold tracking-widest italic text-white">
                      {educationModal.title}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setEducationModal(null)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  {educationModal.points.map((point: string, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-coral mt-2.5 shrink-0" />
                      <p className="text-gray-400 text-lg leading-relaxed font-inter italic">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => setEducationModal(null)}
                  variant="strategy-primary"
                  className="w-full py-6 text-[10px]"
                >
                  Understood
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
