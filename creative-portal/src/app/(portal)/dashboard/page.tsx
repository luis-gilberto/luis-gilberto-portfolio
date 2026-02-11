'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { UserRoleBadge } from '@/components/ui/UserRoleBadge'
import { PartnerLibrary } from '@/components/portal/client/PartnerLibrary'
import { StrategyCard, AssessmentStatus } from '@/components/strategy/StrategyCard'
import { StrategicConfigurationModal } from '@/components/portal/client/StrategicConfigurationModal'
import { ShieldCheck, ArrowRight, LayoutDashboard, Zap, MessageSquare, FileText, Activity, Search, Send, RefreshCw, HelpCircle, Settings, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import gsap from 'gsap'
import { useRouter, redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
  const [assessmentResults, setAssessmentResults] = useState<any[]>([])
  const [localCompletedStates, setLocalCompletedStates] = useState<Record<string, boolean>>({})
  const [activeProject, setActiveProject] = useState<any>(null)
  const [completedAssessmentCount, setCompletedAssessmentCount] = useState(0)
  const [vaultDeliverables, setVaultDeliverables] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false)
  const [personalizedUser, setPersonalizedUser] = useState<any>(null)
  const [isCalibrated, setIsCalibrated] = useState(false)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const role = session?.user?.role

  const checkCalibration = () => {
    const config = localStorage.getItem('lg_strategic_config')
    setIsCalibrated(config !== null)
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        setPersonalizedUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse personalized user', e)
      }
    }

    // updateDashboardState equivalent: Check localStorage for completed assessments
    const states: Record<string, boolean> = {}
    pillars.forEach(p => {
      const isCompleted = localStorage.getItem(`${p.id}_assessment_completed`) === 'true'
      states[p.id] = isCompleted
    })
    setLocalCompletedStates(states)

    // Check for strategic calibration
    checkCalibration()
  }, [])

  const discoveryProgress = completedAssessmentCount

  const pillars = [
    { id: 'gtm', label: 'GTM Strategy', key: 'gtmStatus' },
    { id: 'brand', label: 'Brand Position', key: 'brandStatus' },
    { id: 'campaign', label: 'Campaign Ops', key: 'campaignStatus' },
    { id: 'creative', label: 'Creative Dir', key: 'creativeStatus' },
  ]

  const getPillarStatus = (pillarKey: string) => {
    const status = activeProject?.[pillarKey] || 'NOT_STARTED'
    
    switch (status) {
      case 'PUBLISHED':
        return { label: 'PUBLISHED', action: 'VIEW BRIEF', color: 'text-teal', bg: 'bg-teal/10', border: 'border-teal/20', icon: ShieldCheck }
      case 'COMPLETED':
      case 'MANUAL_REVIEW':
      case 'UNDER_REVIEW':
        return { label: 'AWAITING LG REVIEW', action: 'View Status', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: Activity }
      case 'IN_PROGRESS':
        return { label: 'IN PROGRESS', action: 'Resume', color: 'text-coral', bg: 'bg-coral/10', border: 'border-coral/20', icon: Zap }
      default:
        return { label: 'NOT STARTED', action: 'Initialize', color: 'text-white/20', bg: 'bg-white/5', border: 'border-white/10', icon: LayoutDashboard }
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && role && role !== 'CLIENT') {
      redirect('/admin')
    }
  }, [status, role])

  const fetchMessages = useCallback(async (projectId: string) => {
    try {
      const msgResponse = await fetch(`/api/messages?projectId=${projectId}`)
      if (msgResponse.ok) {
        const msgs = await msgResponse.json()
        setMessages(msgs.map((m: any) => ({
          id: m.id,
          user: m.sender?.name || 'User',
          content: m.content,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isClient: m.senderId === session?.user?.id,
          role: m.sender?.role,
          sender: m.sender,
          createdAt: m.createdAt
        })))
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }, [session?.user?.id])

  useEffect(() => {
    async function checkClientStatus() {
      if (session?.user?.email) {
        if (!supabase) {
          setIsLoading(false)
          return
        }
        const { data: user } = await supabase.from('User').select('id').eq('email', session.user.email).single();
        
        if (user) {
            // 2. Check for Projects - Anchor to VHV32LIT if it exists, otherwise most recent
            const { data: projects } = await supabase
                .from('Project')
                .select('*')
                .eq('userId', user.id)
                .in('status', ['ACTIVE', 'DISCOVERY'])
                .order('updatedAt', { ascending: false });
            
            if (projects && projects.length > 0) {
              setHasProjects(true)
              // Task 2: Anchor logic
              const anchoredProject = projects.find(p => p.id.endsWith('vhv32lit')) || projects[0];
              setActiveProject(anchoredProject)
              
              console.log("CHAT LOADING FOR PROJECT:", anchoredProject.id);

              // Fetch count of completed assessments for this project
              const { count, error: countError } = await supabase
                .from('assessment_sessions')
                .select('*', { count: 'exact', head: true })
                .eq('project_id', anchoredProject.id)
                .in('status', ['COMPLETED', 'PUBLISHED', 'MANUAL_REVIEW', 'UNDER_REVIEW']);
              
              if (!countError) {
                setCompletedAssessmentCount(count || 0);
              }

              // Fetch messages
              await fetchMessages(anchoredProject.id)

              // Fetch deliverables for the vault
              try {
                const response = await fetch(`/api/deliverables?projectId=${anchoredProject.id}`)
                if (response.ok) {
                  const deliverables = await response.json()
                  setVaultDeliverables(deliverables)
                }
              } catch (error) {
                console.error('Error fetching vault deliverables:', error)
              }

              // 3. Check for Assessments
              const { data: assessments } = await supabase
                  .from('assessment_sessions')
                  .select('*')
                  .eq('project_id', anchoredProject.id)
                  .order('updated_at', { ascending: false });

              if (assessments && assessments.length > 0) {
                setHasAssessment(true);
                setLatestAssessment(assessments[0]);
                setAssessmentResults(assessments);
              }
            }
        }
      }
      setIsLoading(false);
    }
    checkClientStatus();
  }, [session, status, fetchMessages]);

  const [isSending, setIsSending] = useState(false)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAssessmentStatus = (res: any, id: string): AssessmentStatus => {
    // 1. Check database results first (fetched for Project VHV32LIT)
    if (res) {
      if (res.isPublished) return "PUBLISHED"
      if (res.status === 'completed' || res.status === 'COMPLETED' || res.status === 'PUBLISHED') return "PUBLISHED"
      if (res.status === 'UNDER_REVIEW' || res.status === 'MANUAL_REVIEW') return "UNDER_REVIEW"
      if (res.status === 'in_progress' || res.status === 'IN_PROGRESS') return "IN_PROGRESS"
    }

    // 2. Fallback to localStorage for immediate initialization feedback
    if (localCompletedStates[id]) return "COMPLETED"
    
    return "NOT_STARTED"
  }

  const handleAssessmentClick = (id: string) => {
     if (!isCalibrated) {
       // Trigger project creation or show initialization alert
       setIsCalibrationOpen(true)
       return
     }
     
     // Use anchored project ID or a default if not yet initialized in DB
     const projectId = activeProject?.id || "cml73ju300003vkikvhv32lit"
     router.push(`/strategy-iq/${projectId}/${id.toLowerCase()}/start`)
   }

  // 4. Update the assessment list mapping to use StrategyCard
  const assessments = [
    { id: 'gtm', title: 'GTM Strategy', description: 'Market entry and channel optimization', result: assessmentResults.find(r => r.type === 'GTM' || r.assessmentType === 'GTM') },
    { id: 'brand', title: 'Brand Position', description: 'Identity, voice, and market perception', result: assessmentResults.find(r => r.type === 'BRAND' || r.assessmentType === 'BRAND') },
    { id: 'campaign', title: 'Campaign Ops', description: 'Funnel efficiency and lead acquisition', result: assessmentResults.find(r => r.type === 'CAMPAIGN' || r.assessmentType === 'CAMPAIGN') },
    { id: 'creative', title: 'Creative Dir', description: 'Visual systems and asset production', result: assessmentResults.find(r => r.type === 'CREATIVE' || r.assessmentType === 'CREATIVE') },
  ]

  const formatMessageTime = (date: Date) => {
    if (!date || isNaN(date.getTime())) return ''
    return `[${format(date, 'EEE, MMM d')}] ${format(date, 'h:mm a')}`
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !session?.user?.id || !activeProject) return

    setIsSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          projectId: activeProject.id,
          senderId: (session.user as any).id
        })
      })

      if (res.ok) {
        setNewMessage('')
        await fetchMessages(activeProject.id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSending(false)
    }
  }

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
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">
              {personalizedUser ? personalizedUser.company : 'Systems online'}
            </span>
            <div className="w-px h-4 bg-white/10 mx-2" />
            <button 
              onClick={() => setIsCalibrationOpen(true)}
              className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-coral hover:text-white transition-colors uppercase group"
            >
              <Settings size={12} className="group-hover:rotate-90 transition-transform duration-500" />
              Strategic Calibration
            </button>
          </div>
          <div className="space-y-1 mt-10 md:mt-0">
            {personalizedUser && (
              <h2 className="text-coral font-bold tracking-[0.3em] text-[10px] uppercase mb-2">
                Welcome back, {personalizedUser.name}
              </h2>
            )}
            <h1 className="text-[42px] md:text-5xl font-bold text-white font-big-shoulders tracking-widest italic leading-none">
              {activeProject?.status === 'DISCOVERY' ? 'Strategic' : 'Command'} Center
            </h1>
          </div>
          <p className="text-white/40 max-w-xl text-lg font-inter leading-relaxed hidden md:block">
            {activeProject?.status === 'DISCOVERY'
              ? "Phase-aware intelligence surface. Complete your assessments to unlock high-fidelity strategic briefs."
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
              <div className="text-[10px] font-bold text-white/20 tracking-widest">Active status</div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">Strategy captured</div>
            </div>
          </div>
        )}
      </div>

      {/* 2. PRIMARY ROW: ENGAGEMENT LEDGER & COMM LINK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEDGER SIDE */}
        <section className="lg:col-span-7 space-y-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-teal" />
            <h2 className="text-sm font-bold tracking-widest text-white/60 font-big-shoulders italic uppercase">
              Engagement ledger <span className="text-white/20 ml-2">/ Strategic dimensions</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {assessments.map((a) => (
                  <StrategyCard
                    key={a.id}
                    id={a.id}
                    title={a.title}
                    description={a.description}
                    status={getAssessmentStatus(a.result, a.id)}
                    projectId={activeProject?.id || "cml73ju300003vkikvhv32lit"}
                    onClick={() => handleAssessmentClick(a.id)}
                    isDashboard={true}
                    ctaOverride={!isCalibrated ? "INITIALIZE (REQUIRES CALIBRATION)" : "BEGIN ASSESSMENT"}
                    isUnlocked={isCalibrated}
                    dataUrl={`assessments/${a.id.toLowerCase()}.html`}
                  />
                ))}
          </div>
        </section>

        {/* COMM LINK SIDE */}
        <section className="lg:col-span-5 space-y-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-coral" />
            <h2 className="text-sm font-bold tracking-widest text-white/60 font-big-shoulders italic">
              The comm link <span className="text-white/20 ml-2">/ Direct alignment</span>
            </h2>
          </div>

          <div className="flex flex-col h-[500px] rounded-3xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-sm relative z-[60] shadow-2xl">
            {/* Messages Area */}
            <div ref={chatScrollRef} className="flex-grow overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                  <MessageSquare size={48} />
                  <p className="text-sm font-inter">No secure transmissions found.<br/>Initialize alignment below.</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isStrategist = msg.role === 'ADMIN' || msg.role === 'TEAM_MEMBER' || msg.sender?.role === 'ADMIN' || msg.sender?.role === 'TEAM_MEMBER'
                  const isMe = msg.isClient || msg.senderId === session?.user?.id
                  const showHeader = idx === 0 || messages[idx - 1].senderId !== msg.senderId
                  
                  return (
                    <div key={msg.id} className={cn(
                      "flex flex-col",
                      isMe ? 'items-end' : 'items-start',
                      !showHeader && "-mt-4"
                    )}>
                      {showHeader && (
                        <div className="flex items-center gap-2 mb-2 px-1">
                          <span className={cn(
                            "text-[8px] font-bold tracking-[0.2em] uppercase",
                            isStrategist ? "text-teal" : "text-white/20"
                          )}>
                            {isStrategist ? "LG / STRATEGIST" : "PARTNER"}
                          </span>
                          <span className="text-[8px] text-zinc-600 uppercase tracking-tighter font-mono">
                            {msg.createdAt ? formatMessageTime(new Date(msg.createdAt)) : (msg.time || "")}
                          </span>
                        </div>
                      )}
                      <div className={cn(
                        "max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed transition-all hover:scale-[1.01]",
                        isMe 
                          ? "bg-coral text-black font-medium rounded-tr-none shadow-lg shadow-coral/10"
                          : "bg-white/10 text-white rounded-tl-none border border-white/5" 
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 flex gap-2 relative">
              {!activeProject && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center px-6 text-center">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-coral tracking-[0.2em] uppercase">
                    <AlertCircle size={14} />
                    Project Initialization Required
                  </div>
                </div>
              )}
              <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isSending ? "Transmitting..." : "Secure transmission..."}
                disabled={isSending || !activeProject}
                className="bg-white/5 border-white/10 focus:border-coral/50 text-white placeholder:text-white/20 rounded-xl h-14 md:h-12 text-sm"
              />
              <Button 
                type="submit"
                disabled={isSending || !newMessage.trim() || !activeProject}
                className="bg-coral hover:bg-coral/90 text-white w-14 md:w-12 h-14 md:h-12 rounded-xl p-0 flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-coral/20 shrink-0"
              >
                {isSending ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
              </Button>
            </form>
          </div>
        </section>
      </div>

      {/* 3. THE VAULT SECTION */}
      {vaultDeliverables.length > 0 && (
        <section id="vault" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-coral" />
            <h2 className="text-sm font-bold tracking-widest text-white/60 font-big-shoulders italic">
              The vault <span className="text-white/20 ml-2">/ Certified deliverables</span>
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
                  <Badge variant="outline" className="text-[9px] tracking-widest border-coral/30 text-coral bg-coral/5">
                    {deliverable.type?.replace('_', ' ') || 'Deliverable'}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 font-big-shoulders tracking-widest">
                  {deliverable.title}
                </h3>
                
                <p className="text-xs text-white/40 mb-6 font-inter leading-relaxed">
                  Certified strategic intelligence asset. Securely stored in the LG Ecosystem Vault.
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] text-white/20 font-mono">
                    {deliverable.createdAt ? new Date(deliverable.createdAt).toLocaleDateString() : 'Date pending'}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-coral tracking-widest group-hover:gap-3 transition-all">
                    View Brief <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. PARTNER LIBRARY */}
      <section className="py-12">
        <PartnerLibrary />
      </section>

      <StrategicConfigurationModal 
        isOpen={isCalibrationOpen} 
        onClose={() => setIsCalibrationOpen(false)} 
        onSaveSuccess={checkCalibration}
      />

    </div>
  )
}
