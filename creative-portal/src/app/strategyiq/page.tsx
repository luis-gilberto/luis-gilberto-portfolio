'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { 
  Rocket, 
  Megaphone, 
  Target, 
  Lightbulb, 
  ChevronRight, 
  LayoutDashboard, 
  Settings2,
  CheckCircle,
  PlayCircle,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
// Imports adjusted based on file tree check
import Sidebar from '../../components/dashboard-ui/Sidebar';
import TopNavBar from '@/components/TopNavBar';
import { Button } from '@/components/ui/button';
import AssessmentRunner from '../../components/strategy/AssessmentRunner';
import StrategicBriefModal from '../../components/strategy/StrategicBriefModal';
import { AssessmentCategory } from '@/lib/strategyData';
import { cn } from '@/lib/utils';

type AssessmentState = {
  status: 'pending' | 'in-progress' | 'completed';
  score: number; // 0-100
  answers: Record<string, number>; // Saved answers to allow resuming/editing
};

const CLIENTS = [
  {
    id: 'c1',
    name: 'Acme Corp',
    type: 'Brand Repositioning', // <--- USER: CHANGE THIS TEXT TO UPDATE THE LABEL
    budget: '$25K - $50K',
    timeline: '3-6 months',
    size: '50-200 employees'
  },
  {
    id: 'c2',
    name: 'TechStart Inc',
    type: 'Product Launch (GTM)', // Example of a different type
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
  },
  {
    id: 'brand',
    icon: Megaphone,
    title: 'Brand Intelligence',
    description: 'Positioning, messaging, and systematic brand development.',
    duration: '8-16 WEEKS',
  },
  {
    id: 'campaign',
    icon: Target,
    title: 'Strategic Campaigns',
    description: 'Integrated campaign strategy and optimization.',
    duration: '12-20 WEEKS',
  },
  {
    id: 'creative',
    icon: Lightbulb,
    title: 'Creative Strategy',
    description: 'Content frameworks and scalable creative systems.',
    duration: '4-12 WEEKS',
  },
];

export default function StrategyIQPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState<AssessmentCategory | null>(null);
  const [viewMode, setViewMode] = useState<'dashboard' | 'assessment' | 'results'>('dashboard');
  const [selectedClient, setSelectedClient] = useState(CLIENTS[0]);
  
  // 1. Main State Container
  const [isMounted, setIsMounted] = useState(false);
  const [clientProgress, setClientProgress] = useState<Record<string, AssessmentState>>({ 
    gtm: { status: 'pending', score: 0, answers: [] }, 
    brand: { status: 'pending', score: 0, answers: [] }, 
    campaign: { status: 'pending', score: 0, answers: [] }, 
    creative: { status: 'pending', score: 0, answers: [] }, 
  }); 

  // B. Save State whenever it changes 
  useEffect(() => { 
    setIsMounted(true);
    const saved = localStorage.getItem('strategyiq_progress'); 
    if (saved) { 
      try { 
        setClientProgress(JSON.parse(saved)); 
      } catch (e) { 
        console.error('Failed to parse progress', e); 
      } 
    } 
  }, []);

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
    setActiveAssessment(id as AssessmentCategory);
    setViewMode('assessment');
  };

  const handleAssessmentComplete = (result: { score: number; answers: Record<string, number> }) => {
    if (!activeAssessment) return;
    
    // Check if assessment is already completed
    if (clientProgress[activeAssessment].status === 'completed') {
      const confirmOverwrite = window.confirm('This assessment is locked. Overwrite?');
      if (!confirmOverwrite) return;
    }
    
    setClientProgress(prev => ({
      ...prev,
      [activeAssessment]: {
        status: 'completed',
        score: result.score,
        answers: result.answers
      }
    }));
    
    setViewMode('dashboard');
    setActiveAssessment(null);
  };

  const handleAssessmentClose = () => {
    setViewMode('dashboard');
    setActiveAssessment(null);
  };

  const handleAssessmentNext = () => {
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
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F1ED] font-sans">
      
      <TopNavBar 
        mobileMenuOpen={mobileMenuOpen}
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
          onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        
        <main className={`flex-1 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[256px]'}`}>
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
                
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">
                      StrategyIQ<sup className="text-lg">™</sup> Engine
                    </h1>
                    <p className="text-gray-400 max-w-xl text-lg">
                      Select a strategic dimension to analyze. AI will guide the discovery process and generate the final brief.
                    </p>
                  </div>
                </div>

                {/* CONTEXT BAR */}
                <div className="bg-[#141414] border border-white/5 rounded-xl p-8 mb-12 shadow-sm">
                  <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <h3 className="text-lg font-medium text-white">Client Context</h3>
                    
                    {/* DYNAMIC DROPDOWN (HTML Select Fallback) */}
                    <div className="relative inline-block">
                      <select 
                        className="appearance-none bg-transparent border-none text-xs text-gray-400 hover:text-[#F96F6E] transition-colors outline-none pr-6 cursor-pointer focus:ring-0"
                        value={selectedClient.id}
                        onChange={(e) => setSelectedClient(CLIENTS.find(c => c.id === e.target.value) || CLIENTS[0])}
                      >
                        {CLIENTS.map(c => (
                          <option key={c.id} value={c.id} className="bg-[#1A1A1A] text-gray-200">
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronRight size={14} className="rotate-90 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                  </div>

                  {/* DYNAMIC GRID */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-1.5 font-semibold">Project Type</div>
                      <div className="text-sm font-medium text-gray-200">{selectedClient.type}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-1.5 font-semibold">Budget Range</div>
                      <div className="text-sm font-medium text-gray-200">{selectedClient.budget}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-1.5 font-semibold">Timeline</div>
                      <div className="text-sm font-medium text-gray-200">{selectedClient.timeline}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-1.5 font-semibold">Company Size</div>
                      <div className="text-sm font-medium text-gray-200">{selectedClient.size}</div>
                    </div>
                  </div>
                </div>

                {/* SECTION TITLE */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2 text-white">Strategic <span className="text-[#F96F6E]">Assessment</span> Areas</h2>
                  <p className="text-gray-500 text-sm">Select the primary strategic focus area to begin the intelligence assessment.</p>
                </div>

                {/* CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {assessmentAreas.map((area, index) => {
                    const status = clientProgress[area.id].status;
                    const isCompleted = status === 'completed';
                    
                    return (
                      <div 
                        key={index}
                        onClick={() => handleAssessmentStart(area.id)}
                        className={cn(
                          "group relative p-8 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden",
                          area.isHighlight 
                            ? 'bg-gradient-to-br from-[#2A1515] to-[#1A1A1A] border-[#F96F6E]/20 hover:border-[#F96F6E]/40' 
                            : 'bg-[#141414] border-white/5 hover:border-white/10 hover:bg-[#1A1A1A]',
                          isCompleted && "opacity-80 grayscale-[0.3] hover:opacity-100 hover:grayscale-0"
                        )}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className={cn(
                            "p-3 rounded-lg transition-colors",
                            area.isHighlight ? 'bg-[#F96F6E]/10 text-[#F96F6E]' : 'bg-white/5 text-gray-400',
                            isCompleted && "bg-teal-500/10 text-teal-400"
                          )}>
                            {isCompleted ? <CheckCircle size={24} /> : <area.icon size={24} strokeWidth={1.5} />}
                          </div>
                          <ChevronRight className={cn(
                            "opacity-0 group-hover:opacity-100 transition-opacity",
                            area.isHighlight ? 'text-[#F96F6E]' : 'text-gray-500'
                          )} />
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2 text-white flex items-center gap-2">
                          {area.title}
                          {isCompleted && (
                            <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full font-medium tracking-wide">
                              COMPLETED
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">{area.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className={cn(
                            "text-[10px] font-bold tracking-widest uppercase",
                            area.isHighlight ? 'text-[#F96F6E]' : 'text-[#F96F6E]/80'
                          )}>
                            {area.duration}
                          </div>
                          {isCompleted && (
                            <div className="text-xs font-medium text-white bg-white/5 px-3 py-1 rounded-full">
                              Score: <span className="text-teal-400">{clientProgress[area.id].score}</span>
                            </div>
                          )}
                        </div>

                        {/* Subtle Glow for Highlight Card */}
                        {area.isHighlight && !isCompleted && (
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F96F6E] opacity-5 blur-[80px] pointer-events-none" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* BOTTOM SCORECARD */}
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
                        <h3 className="text-xl font-semibold text-white mb-1">Strategic Intelligence Score</h3>
                        <p className="text-gray-400 text-sm">Aggregate score across all assessment modules.</p>
                      </div>
                    </div>
                    
                    <div className="h-12 w-px bg-white/10 hidden md:block" />
                    
                    <div className="flex-1 w-full relative z-10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Recommended Engagement</span>
                        <span className="text-teal-400 font-bold">{serviceMatch.price}</span>
                      </div>
                      <div className="bg-[#0A0A0A] p-4 rounded-lg border border-white/5 flex items-center justify-between group cursor-pointer hover:border-teal-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="text-teal-500" size={20} />
                          <span className="text-white font-medium">{serviceMatch.title}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={cn(
                          "text-xs text-gray-400 hover:text-white",
                          !hasAnyCompletion && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={!hasAnyCompletion}
                        onClick={() => setIsBriefOpen(true)}
                      >
                        Generate Brief <ChevronRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                  </div>
                </div>
                
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
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      
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
    </div>
  );
}
