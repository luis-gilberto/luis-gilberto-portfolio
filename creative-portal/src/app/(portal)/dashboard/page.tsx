'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { UserRoleBadge } from '@/components/ui/UserRoleBadge'
import { PartnerLibrary } from '@/components/portal/client/PartnerLibrary'
import { ShieldCheck, ArrowRight, LayoutDashboard, Zap, MessageSquare, FileText } from 'lucide-react'
import gsap from 'gsap'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

// --- SUPABASE CLIENT ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [hasProjects, setHasProjects] = useState(false)
  const [hasAssessment, setHasAssessment] = useState(false)
  const [latestAssessment, setLatestAssessment] = useState<any>(null)
  const [activeProject, setActiveProject] = useState<any>(null)
  const [completedAssessmentCount, setCompletedAssessmentCount] = useState(0)
  const [vaultDeliverables, setVaultDeliverables] = useState<any[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const role = session?.user?.role

  const discoveryProgress = completedAssessmentCount

  const discoveryDimensions = [
    { id: 'gtm', label: 'Go-to-Market', status: activeProject?.gtmStatus },
    { id: 'brand', label: 'Brand Intelligence', status: activeProject?.brandStatus },
    { id: 'campaign', label: 'Strategic Campaigns', status: activeProject?.campaignStatus },
    { id: 'creative', label: 'Creative Strategy', status: activeProject?.creativeStatus },
  ]

  const nextDiscovery = discoveryDimensions.find(d => d.status !== 'COMPLETED')

  useEffect(() => {
    if (status === 'authenticated' && role && role !== 'CLIENT') {
      redirect('/admin')
    }
  }, [status, role])

  useEffect(() => {
    async function checkClientStatus() {
      if (session?.user?.email) {
        if (!supabase) {
          setIsLoading(false)
          return
        }
        const { data: user } = await supabase.from('User').select('id').eq('email', session.user.email).single();
        
        if (user) {
            // 2. Check for Projects
            const { data: projects } = await supabase
                .from('Project')
                .select('*')
                .eq('userId', user.id)
                .in('status', ['ACTIVE', 'DISCOVERY'])
                .order('created_at', { ascending: false });
            
            if (projects && projects.length > 0) {
              setHasProjects(true)
              setActiveProject(projects[0])

              // Fetch count of completed assessments for this project
              const { count, error: countError } = await supabase
                .from('assessment_sessions')
                .select('*', { count: 'exact', head: true })
                .eq('project_id', projects[0].id)
                .in('status', ['COMPLETED', 'PUBLISHED', 'MANUAL_REVIEW', 'UNDER_REVIEW']);
              
              if (!countError) {
                setCompletedAssessmentCount(count || 0);
              }

              // Fetch deliverables for the vault
              try {
                const response = await fetch(`/api/deliverables?projectId=${projects[0].id}`)
                if (response.ok) {
                  const deliverables = await response.json()
                  setVaultDeliverables(deliverables)
                }
              } catch (error) {
                console.error('Error fetching vault deliverables:', error)
              }
            }
            
            // 3. Check for Assessments
            const { data: assessments } = await supabase
                .from('assessment_sessions')
                .select('*')
                .eq('consultant_id', user.id)
                .order('updated_at', { ascending: false });

            if (assessments && assessments.length > 0) {
              setHasAssessment(true);
              setLatestAssessment(assessments[0]);
            }
        }
      }
      setIsLoading(false);
    }
    checkClientStatus();
  }, [session, status]);

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "power3.out" 
        }
      )
    }
  }, [isLoading])

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-coral border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* 1. HERO SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-12">
        <div className="space-y-4 w-full">
          <div className="hidden md:flex items-center gap-3">
            <UserRoleBadge />
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">Systems Online</span>
          </div>
          <h1 className="text-[42px] md:text-6xl font-bold text-white font-big-shoulders tracking-widest uppercase italic leading-none mt-10 md:mt-0">
            Command <span className="text-white/10">Center</span>
          </h1>
          <p className="text-white/40 max-w-xl text-lg font-inter leading-relaxed hidden md:block">
            {activeProject?.status === 'DISCOVERY'
              ? "You are currently in the DISCOVERY phase. Complete all assessments to unlock your full roadmap."
              : hasProjects
                ? "Your strategic ecosystem is active. Monitor progress and access intelligence assets below."
                : "Ready to initialize? Your strategic journey begins with the StrategyIQ assessment."}
          </p>
        </div>
        
        {hasAssessment && (
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal">
              <Zap size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Active Status</div>
              <div className="text-sm font-bold text-white">STRATEGY CAPTURED</div>
            </div>
          </div>
        )}
      </div>

      {/* 2. PRIMARY ROW: ACTIVE PROJECT / WAR ROOM */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-teal" />
          <h2 className="text-sm font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
            ACTIVE ENGAGEMENT <span className="text-white/20 ml-2">/ THE WAR ROOM</span>
          </h2>
        </div>

        {activeProject && completedAssessmentCount > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeProject.status === 'DISCOVERY' ? (
              <div className="lg:col-span-2 group block">
                <div className="h-full relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-[#141414] to-transparent border border-coral/20 hover:border-coral/40 transition-all duration-500 shadow-[0_0_40px_rgba(249,111,110,0.05)]">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Zap size={120} className="text-coral" />
                  </div>
                  <div className="relative z-10 flex flex-col justify-between h-full gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-coral/10 text-coral border border-coral/20 text-[10px] uppercase tracking-widest px-3 py-1">
                          PHASE: DISCOVERY
                        </Badge>
                        <span className="text-xs font-mono text-white/40">PROGRESS: {discoveryProgress}/4</span>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-4xl font-bold text-white font-big-shoulders tracking-widest uppercase italic">
                          {nextDiscovery ? `Synthesizing ${nextDiscovery.label}` : 'Discovery Complete'}
                        </h3>
                        <p className="text-white/40 text-sm max-w-md font-inter leading-relaxed">
                          {nextDiscovery 
                            ? `Complete ${nextDiscovery.label} to unlock your full Strategic Roadmap.`
                            : "Your discovery phase is complete. Our team is finalizing your Strategic Roadmap."}
                        </p>
                      </div>

                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(discoveryProgress / 4) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-coral to-coral/50"
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {discoveryDimensions.map((d) => (
                          <div key={d.id} className="space-y-2">
                            <div className={`h-1 rounded-full ${d.status === 'COMPLETED' ? 'bg-teal' : 'bg-white/10'}`} />
                            <span className={`text-[8px] uppercase tracking-tighter font-bold block truncate ${d.status === 'COMPLETED' ? 'text-teal' : 'text-white/20'}`}>
                              {d.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href="/strategy-iq" className="flex items-center gap-4 group/btn w-fit">
                      <div className="w-12 h-12 rounded-full bg-coral flex items-center justify-center text-white group-hover/btn:scale-110 transition-transform shadow-lg shadow-coral/20">
                        <ArrowRight size={20} />
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-widest">
                        {nextDiscovery ? 'Continue Discovery' : 'Enter Strategy Engine'}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <Link href={`/projects/${activeProject.id}`} className="lg:col-span-2 group block">
                <div className="h-full relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-teal/50 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(46,211,198,0.1)]">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <LayoutDashboard size={120} />
                  </div>
                  <div className="relative z-10 flex flex-col justify-between h-full gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-teal/10 text-teal text-[10px] font-bold tracking-widest uppercase border border-teal/20">
                          {activeProject.status || 'ACTIVE'}
                        </span>
                      </div>
                      <h3 className="text-4xl font-bold text-white font-big-shoulders tracking-widest uppercase">
                        {activeProject.title}
                      </h3>
                      <p className="text-white/40 text-sm max-w-md font-inter leading-relaxed">
                        Tactical dashboard for real-time updates, deliverables, and communication threads.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                        <ArrowRight size={20} />
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-widest">Enter War Room</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            <div className="flex flex-col gap-6">
              <Link href="/messages" className="group bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <MessageSquare size={20} />
                  </div>
                  <h4 className="font-bold text-white uppercase tracking-widest text-sm">Messages</h4>
                </div>
                <p className="text-xs text-white/40 font-inter">Direct strategic alignment thread.</p>
              </Link>
              <Link href="/documents" className="group bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <FileText size={20} />
                  </div>
                  <h4 className="font-bold text-white uppercase tracking-widest text-sm">Assets</h4>
                </div>
                <p className="text-xs text-white/40 font-inter">Contracts, invoices, and final deliverables.</p>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-12 rounded-3xl border-2 border-dashed border-white/20 bg-[#0A0A0A]/80 backdrop-blur-2xl flex flex-col items-center justify-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
              <LayoutDashboard size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white/60">No Active Project Found</h3>
              <p className="text-white/30 max-w-xs text-sm">
                Complete your StrategyIQ assessment to initialize your first project thread.
              </p>
            </div>
            <Link href="/strategy-iq" className="bg-coral hover:bg-coral/90 text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-lg shadow-coral/20">
              Enter Strategy Engine
            </Link>
          </div>
        )}
      </section>

      {/* 2.5 THE VAULT SECTION */}
      {vaultDeliverables.length > 0 && (
        <section id="vault" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-coral" />
            <h2 className="text-sm font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
              THE VAULT <span className="text-white/20 ml-2">/ CERTIFIED DELIVERABLES</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaultDeliverables.map((deliverable) => (
              <Link 
                key={deliverable.id} 
                href={deliverable.fileUrl || '#'}
                className="group p-6 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/10 hover:border-coral/50 transition-all duration-300 shadow-xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-coral group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-coral/30 text-coral bg-coral/5">
                    {deliverable.type?.replace('_', ' ') || 'DELIVERABLE'}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 font-big-shoulders tracking-widest uppercase">
                  {deliverable.title}
                </h3>
                
                <p className="text-xs text-white/40 mb-6 font-inter leading-relaxed">
                  Certified strategic intelligence asset. Securely stored in the LG Ecosystem Vault.
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] text-white/20 font-mono">
                    {deliverable.createdAt ? new Date(deliverable.createdAt).toLocaleDateString() : 'DATE PENDING'}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-coral uppercase tracking-widest group-hover:gap-3 transition-all">
                    View Brief <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. SECONDARY ROW: PARTNER LIBRARY */}
      <section className="py-12">
        <PartnerLibrary />
      </section>

      {/* 4. TERTIARY ROW: STRATEGY STATUS */}
      <section className="py-12 pb-24">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-coral" />
          <h2 className="text-sm font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
            STRATEGY ENGINE <span className="text-white/20 ml-2">/ INTELLIGENCE STATUS</span>
          </h2>
        </div>

        <Link 
          href="/strategy-iq" 
          className="group block"
        >
          <div className="bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl hover:bg-[#0A0A0A]/90 transition-all flex flex-col md:flex-row justify-between items-center gap-8 border-l-4 border-l-coral shadow-xl">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-coral/10 flex items-center justify-center text-coral group-hover:rotate-12 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white font-big-shoulders tracking-widest uppercase">
                  Latest Strategy Status
                </h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-md font-inter">
                  {hasAssessment 
                    ? "Your assessment is currently under human review. Refined results will appear here."
                    : "StrategyIQ assessment required. Initialize to unlock project roadmap."}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-xs font-bold text-coral uppercase tracking-[0.2em]">
              {hasAssessment ? "View Results" : "Continue Strategy Engine"}
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>
      </section>

    </div>
  )
}
