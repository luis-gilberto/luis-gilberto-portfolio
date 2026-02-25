'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { UserRoleBadge } from '@/components/ui/UserRoleBadge'
import { PartnerLibrary } from '@/components/portal/client/PartnerLibrary'
import { StrategyCard, AssessmentStatus } from '@/components/strategy/StrategyCard'
import { StrategicConfigurationModal } from '@/components/portal/client/StrategicConfigurationModal'
import { useProjectStatus } from '@/hooks/useProjectStatus'
import { ShieldCheck, ArrowRight, LayoutDashboard, Zap, MessageSquare, FileText, Activity, Search, Send, RefreshCw, HelpCircle, Settings, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import gsap from 'gsap'
import { useRouter, redirect } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

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
  
  // HOOK: Global Gating Logic
  const { isCalibrated, isLocked, isAdmin } = useProjectStatus(activeProject)

  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const role = session?.user?.role

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
    // ADMIN BYPASS: Do not redirect admins
    if (status === 'authenticated' && role && role !== 'CLIENT' && role !== 'ADMIN') {
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

  // 0. State for unified Phase and Name
  const [currentPhase, setCurrentPhase] = useState<string>('Phase 2: Strategic planning')
  const [firstName, setFirstName] = useState<string>('Luis (Acme Corp)') // Explicitly set default for admin


  const phaseColor = currentPhase.includes('Discovery') ? 'bg-[#F96F6E]' : 'bg-[#2ED3C6]'

  // ...

  // NEW: API-Based Fetcher to bypass RLS/Client issues
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        // Using a new endpoint is cleaner.
        const dashboardRes = await fetch('/api/dashboard/data');
        
        if (dashboardRes.ok) {
          const data = await dashboardRes.json();
          
          if (data.user) {
             // Fallback for Admin Identity if API returns user name
             const nameParts = (data.user.name || 'Luis (Acme Corp)').split(' ');
             setFirstName(data.user.role === 'ADMIN' ? 'Luis (Acme Corp)' : nameParts[0]);
          }
          
          if (data.project) {
             setActiveProject(data.project);
             setHasProjects(true);
             
             // Phase
             if (data.project.status === 'DISCOVERY') setCurrentPhase('Phase 1: Discovery');
             else if (data.project.status === 'ACTIVE' || data.project.status === 'PLANNING') setCurrentPhase('Phase 2: Strategic planning');
             else if (data.project.status === 'EXECUTION') setCurrentPhase('Phase 3: Execution');
             
             // Assessments
             if (data.assessments) {
                setAssessmentResults(data.assessments);
                setHasAssessment(data.assessments.length > 0);
             }
             
             // Vault
             // ...
          }
        }
      } catch (e) {
        console.error("Dashboard fetch failed", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

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
      const s = res.status?.toLowerCase() || '';
      if (res.isPublished || s === 'published' || s === 'certified') return "PUBLISHED"
      if (s === 'completed') return "COMPLETED"
      if (s === 'submitted' || s === 'under_review' || s === 'manual_review') return "UNDER_REVIEW"
      if (s === 'in_progress') return "IN_PROGRESS"
    }

    // 2. Fallback to localStorage for immediate initialization feedback
    // if (localCompletedStates[id]) return "COMPLETED" // DISABLED: Force DB Truth
    
    return "NOT_STARTED"
  }

  const handleAssessmentClick = (id: string) => {
     if (!isCalibrated) {
       // Trigger project creation or show initialization alert
       setIsCalibrationOpen(true)
       return
     }

     const status = getAssessmentStatus(assessmentResults.find(r => r.type?.toLowerCase() === id.toLowerCase() || r.assessmentType?.toLowerCase() === id.toLowerCase()), id)
     
     // DEADBOLT LOGIC: Prevent re-entry if submitted/under review
     // ADMIN OVERRIDE: Admins can always access the assessment
     // UPDATE: Allow CLIENT to view assessment in read-only mode if completed/under review
     if ((status === 'UNDER_REVIEW' || status === 'COMPLETED' || status === 'PUBLISHED') && role !== 'ADMIN') {
        // Allow navigation but the target page must handle read-only state based on status
        const projectId = activeProject?.id || "active"
        router.push(`/strategy-iq/${projectId}/${id.toLowerCase()}/start`)
        return 
     }
     
     // Use anchored project ID or a default if not yet initialized in DB
     const projectId = activeProject?.id || "active"
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
    return `[${format(date, 'yyyy-MM-dd')}] ${format(date, 'HH:mm')}`
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

  // 5. Authority Handshake Modal
  const [showAuthorityModal, setShowAuthorityModal] = useState(false);

  useEffect(() => {
    // Check if we have an active project and pending request
    if (activeProject?.pendingAuthorityRequest && role === 'CLIENT') {
      setShowAuthorityModal(true);
    }
  }, [activeProject, role]);

  // Loading Skeleton State
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-coral border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* AUTHORITY HANDSHAKE MODAL */}
      <AnimatePresence>
        {showAuthorityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#050505] border border-coral/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                 <ShieldCheck size={120} />
              </div>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center text-coral animate-pulse">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-big-shoulders font-black italic uppercase text-white tracking-wider leading-none">
                    Authority Requested
                  </h2>
                  <p className="text-[10px] font-bold text-coral tracking-[0.3em] uppercase mt-1">
                    Action Required
                  </p>
                </div>
              </div>

              <p className="text-white/60 font-inter text-sm leading-relaxed mb-8 relative z-10">
                Your strategic partner has requested authority to finalize a calibration or assessment. 
                Granting authority locks the current strategic record and enables the next phase of synthesis.
              </p>

              <div className="flex gap-4 relative z-10">
                <Button 
                  onClick={() => setShowAuthorityModal(false)}
                  variant="outline"
                  className="flex-1 border-white/10 hover:bg-white/5 h-12 font-inter font-bold tracking-wider text-xs"
                >
                  Review Later
                </Button>
                <Button 
                  onClick={() => {
                     setIsCalibrationOpen(true);
                     setShowAuthorityModal(false);
                  }}
                  className="flex-1 bg-coral hover:bg-coral/90 text-black h-12 font-bold tracking-widest text-xs uppercase shadow-lg shadow-coral/20"
                >
                  Review & Grant
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-12">
        <div className="space-y-4 w-full">
          <div className="hidden md:flex items-center gap-3">
            <UserRoleBadge />
            <div className="flex items-center gap-2 px-3 py-1.5 h-[32px] rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", phaseColor)} />
              <span className="text-[11px] font-medium text-white/80 whitespace-nowrap">
                {currentPhase}
              </span>
            </div>
            <button 
              onClick={() => setIsCalibrationOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 h-[32px] rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
            >
              <Settings size={12} className="text-coral group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-[11px] font-medium text-white/80 whitespace-nowrap">
                Calibration
              </span>
            </button>
          </div>
          <div className="space-y-1 mt-10 md:mt-0">
            {personalizedUser && (
              <h2 className="text-coral font-bold tracking-[0.3em] text-[10px] uppercase mb-2">
                STRATEGIC BRIEFING
              </h2>
            )}
            <h1 className="flex items-center gap-4 text-[42px] md:text-5xl font-big-shoulders font-black leading-none tracking-wider text-white">
              Welcome back, {firstName}
              <span className="opacity-40 text-3xl">({personalizedUser?.company || 'Acme Corp'})</span>
            </h1>
          </div>
          <p className="text-white/40 max-w-xl text-lg font-inter leading-relaxed hidden md:block mt-2">
            Current mission status for Acme Corp. Track your synthesis progress and access certified artifacts below.
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
                    ctaOverride={!isCalibrated ? "INITIALIZE (REQUIRES CALIBRATION)" : "CONTINUE ASSESSMENT"}
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
                  <p className="text-sm font-inter">Secure line active.<br/>Awaiting transmission.</p>
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
                            "text-[10px] font-mono uppercase tracking-tight",
                            isStrategist ? "text-teal" : "text-white/40"
                          )}>
                            {isStrategist ? "Strategist" : "Partner"}
                            <span className="opacity-30 mx-2">//</span>
                            {msg.createdAt ? formatMessageTime(new Date(msg.createdAt)) : (msg.time || "")}
                          </span>
                        </div>
                      )}
                      <div className={cn(
                        "max-w-[85%] p-4 rounded-xl text-[13px] leading-relaxed transition-all hover:scale-[1.01] font-inter",
                        isMe 
                          ? "bg-[#1A1A1A] text-white border border-white/5 rounded-tr-none ml-auto text-right"
                          : "bg-[#0F1717] text-white border-l-[3px] border-l-teal rounded-tl-none mr-auto text-left" 
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
              {/* Overlay removed per instructions */}
              <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isSending ? "Transmitting..." : "Secure transmission..."}
                disabled={isSending || !activeProject} // Active immediately for VHV32LIT
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
        onSaveSuccess={() => window.location.reload()}
        projectId={activeProject?.id}
      />

    </div>
  )
}
