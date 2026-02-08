'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { UserRoleBadge } from '@/components/ui/UserRoleBadge'
import { PartnerLibrary } from '@/components/portal/client/PartnerLibrary'
import { ShieldCheck, ArrowRight, LayoutDashboard, Zap, MessageSquare, FileText, Activity, Search, Send } from 'lucide-react'
import gsap from 'gsap'
import { redirect } from 'next/navigation'
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
  const [activeProject, setActiveProject] = useState<any>(null)
  const [completedAssessmentCount, setCompletedAssessmentCount] = useState(0)
  const [vaultDeliverables, setVaultDeliverables] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const role = session?.user?.role

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
        return { label: 'PUBLISHED', action: 'View Final Brief', color: 'text-teal', bg: 'bg-teal/10', border: 'border-teal/20', icon: ShieldCheck }
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

              // Fetch messages
              const { data: msgs } = await supabase
                .from('messages')
                .select('*')
                .eq('user_email', session.user.email)
                .order('created_at', { ascending: true })
              
              if (msgs) {
                setMessages(msgs.map(m => ({
                  id: m.id,
                  user: m.user_name || 'Partner',
                  content: m.content,
                  time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isClient: !!m.is_client,
                  role: m.role || 'PARTNER'
                })))
              }

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !supabase || !session?.user?.email) return

    const msg = {
      id: Date.now(),
      user: session.user.name || 'Partner',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isClient: true,
      role: role
    }

    setMessages(prev => [...prev, msg])
    setNewMessage('')

    try {
      await supabase.from('messages').insert({
        user_email: session.user.email,
        user_name: session.user.name || 'Partner',
        content: newMessage,
        is_client: true,
        role: role
      })
    } catch (err) {
      console.error('Error sending message:', err)
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
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">Systems Online</span>
          </div>
          <h1 className="text-[42px] md:text-6xl font-bold text-white font-big-shoulders tracking-widest uppercase italic leading-none mt-10 md:mt-0">
            {activeProject?.status === 'DISCOVERY' ? 'Strategic' : 'Command'} <span className="text-white/10">{activeProject?.status === 'DISCOVERY' ? 'Command' : 'Center'}</span>
          </h1>
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
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Active Status</div>
              <div className="text-sm font-bold text-white">STRATEGY CAPTURED</div>
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
            <h2 className="text-sm font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
              ENGAGEMENT LEDGER <span className="text-white/20 ml-2">/ STRATEGIC TRACKS</span>
            </h2>
          </div>

          <div className="space-y-4">
            {pillars.map((pillar) => {
              const status = getPillarStatus(pillar.key)
              const StatusIcon = status.icon
              return (
                <div 
                  key={pillar.id}
                  className="group relative flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-xl ${status.bg} flex items-center justify-center ${status.color}`}>
                      <StatusIcon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-big-shoulders tracking-wider uppercase italic">
                        {pillar.label}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {status.label === 'PUBLISHED' ? (
                      <Link 
                        href={`/projects/${activeProject?.id}/strategy/${pillar.id}/results`}
                        className="flex items-center gap-2 text-[10px] font-bold text-teal uppercase tracking-widest hover:gap-3 transition-all"
                      >
                        {status.action} <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <Link 
                        href="/strategy-iq"
                        className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:gap-3 transition-all ${status.label === 'NOT STARTED' ? 'text-white/40' : 'text-coral'}`}
                      >
                        {status.action} <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* COMM LINK SIDE */}
        <section className="lg:col-span-5 space-y-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-coral" />
            <h2 className="text-sm font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
              THE COMM LINK <span className="text-white/20 ml-2">/ DIRECT ALIGNMENT</span>
            </h2>
          </div>

          <div className="flex flex-col h-[500px] rounded-3xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-sm">
            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                  <MessageSquare size={48} />
                  <p className="text-sm font-inter">No secure transmissions found.<br/>Initialize alignment below.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isLG = msg.role === 'ADMIN' || msg.role === 'TEAM_MEMBER'
                  return (
                    <div key={msg.id} className={`flex flex-col ${msg.isClient ? 'items-start' : 'items-end'} space-y-1`}>
                      <div className="flex items-center gap-2 px-1">
                        <span className={`text-[8px] font-bold tracking-widest uppercase ${isLG ? 'text-teal' : 'text-white/40'}`}>
                          {isLG ? 'STRATEGIST / LG' : 'PARTNER / CLIENT'}
                        </span>
                        <span className="text-[8px] text-white/20 font-mono">{msg.time}</span>
                      </div>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-inter leading-relaxed ${
                        isLG 
                          ? 'bg-transparent border border-teal/30 text-white shadow-[0_0_20px_rgba(46,211,198,0.05)]' 
                          : 'bg-white/10 text-white/80'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 flex gap-3">
              <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Secure transmission..."
                className="bg-white/5 border-white/10 focus:border-coral/50 text-white placeholder:text-white/20 rounded-xl h-12"
              />
              <Button 
                type="submit"
                className="bg-coral hover:bg-coral/90 text-white w-12 h-12 rounded-xl p-0 flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-coral/20"
              >
                <Send size={20} />
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

      {/* 4. PARTNER LIBRARY */}
      <section className="py-12">
        <PartnerLibrary />
      </section>

    </div>
  )
}
