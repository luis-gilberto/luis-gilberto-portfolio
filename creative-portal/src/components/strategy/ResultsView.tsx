'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, 
  RefreshCw, 
  ArrowLeft, 
  BookOpen, 
  Zap, 
  Users, 
  Bot,
  CheckCircle,
  Clock,
  Send,
  Printer,
  Star,
  ChevronDown,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { assessmentQuestions, AssessmentCategory } from '@/lib/strategyData'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

import { UserRoleBadge } from '@/components/ui/UserRoleBadge'
import ReactMarkdown from 'react-markdown'
import { safeJsonParse } from '@/lib/json-utils'
import { cn } from '@/lib/utils'
import { SealOfAuthority } from '@/components/shared/SealOfAuthority'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { OperatingCharterModal } from './OperatingCharterModal'
import { useToast } from '@/components/providers/toast-provider'

interface StrategicSection {
  id: number
  title: string
  content: string
  posture: 'AT_RISK' | 'OPTIMIZING' | 'CALIBRATED'
  key_insights: string[]
}

interface StrategyData {
  intro: string
  sections: StrategicSection[]
  consultant_pov: string
}

interface ResultsViewProps {
  session: any
  projectId: string
  dimension: string
  userRole: string
  clientName: string
}

export function ResultsView({ 
  session, 
  projectId, 
  dimension, 
  userRole,
  clientName 
}: ResultsViewProps) {
  const router = useRouter()
  const { toast } = useToast()
  const containerRef = useRef<HTMLDivElement>(null)
  const [starredInsights, setStarredInsights] = useState<Set<string>>(new Set())
  const [isCharterOpen, setIsCharterOpen] = useState(false)
  const [isCertifying, setIsCertifying] = useState(false)
  const [status, setStatus] = useState(session.status || 'PENDING')

  // Redirect Admins to the Workbench (Keep this if needed, but the user requested an Admin Loop in this page)
  // Actually, the user says "The Admin must have a 'Certification Workbench' toggle to move the status from PENDING to CERTIFIED."
  // So I'll keep the Admin on this page for now if they are in "Workbench" mode.

  const responses = safeJsonParse(session.responses, {}) as Record<string, number>
  const questions = assessmentQuestions[dimension as AssessmentCategory] || []
  const overallScore = session.intelligenceScore || 0
  const isPublished = session.isPublished || false

  // Parse Strategy Data
  const getStrategyData = (): StrategyData => {
    let rawData: any = null
    
    if (status === 'CERTIFIED' && session.certifiedNarrative) {
      rawData = safeJsonParse(session.certifiedNarrative)
    } else if (session.briefSummary) {
      rawData = safeJsonParse(session.briefSummary)
    }

    // Default 5-Pillar Structure
    const defaultPillars = [
      "Market Positioning",
      "Target Audience",
      "Messaging",
      "Sales Readiness",
      "Growth Systems"
    ]

    // Task 1: The Three-Zone Parser Logic
    if (typeof rawData === 'string' && rawData.length > 0) {
      const markdownString = rawData;
      
      // 1. SPLIT BY ZONES
      // Zone 1: Intro (Everything before "1. ")
      // Zone 2: Pillars (From "1. " to "Consultant's POV")
      // Zone 3: POV (Everything after "Consultant's POV")
      
      const povSplit = markdownString.split(/Consultant[’']s POV:?/i);
      const prePovContent = povSplit[0];
      const povContent = povSplit.length > 1 ? povSplit[1].trim() : "";
      
      const firstHeaderIndex = prePovContent.search(/(?:^|\n)1\.\s+/);
      
      const intro = firstHeaderIndex > -1 ? prePovContent.substring(0, firstHeaderIndex).trim() : "";
      const pillarsContent = firstHeaderIndex > -1 ? prePovContent.substring(firstHeaderIndex) : prePovContent;

      // 2. PARSE PILLARS
      const sectionsFound: StrategicSection[] = [];
      const splitPattern = /(?:^|\n)(\d+)\.\s+(.*?)(?:\r?\n|$)/g;
      
      const headers = [];
      let match;
      while ((match = splitPattern.exec(pillarsContent)) !== null) {
        headers.push({
          id: parseInt(match[1]),
          title: match[2].trim(),
          startIndex: match.index,
          endOfHeaderIndex: match.index + match[0].length
        });
      }

      if (headers.length > 0) {
        headers.forEach((header, i) => {
          const nextHeader = headers[i + 1];
          const contentStart = header.endOfHeaderIndex;
          const contentEnd = nextHeader ? nextHeader.startIndex : pillarsContent.length;
          const rawContent = pillarsContent.substring(contentStart, contentEnd).trim();
          
          sectionsFound.push({
            id: header.id,
            title: header.title,
            content: rawContent || "Analysis pending...",
            posture: 'OPTIMIZING',
            key_insights: []
          });
        });
      } else {
         // Fallback if no numbered headers found
         sectionsFound.push({
            id: 1,
            title: "Executive Summary",
            content: pillarsContent,
            posture: 'OPTIMIZING',
            key_insights: []
         });
      }

      return {
        intro: intro || "Strategic narrative synthesized from consultant dossier.",
        sections: sectionsFound,
        consultant_pov: povContent
      };
    }
    
    // Fallback for legacy data structures
    return {
      intro: "Legacy data format detected.",
      sections: [],
      consultant_pov: ""
    }
  }

  const strategyData = getStrategyData()

  const handleCertify = async () => {
    setIsCertifying(true)
    try {
      const res = await fetch('/api/strategy-iq/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId, 
          dimension,
          certifiedNarrative: session.briefSummary // Using briefSummary as certified for this toggle
        })
      })

      if (res.ok) {
        setStatus('CERTIFIED')
        toast("STRATEGY CERTIFIED", "The results are now visible to the client with the Seal of Authority.", "success")
      } else {
        throw new Error('Certification failed')
      }
    } catch (err) {
      console.error(err)
      toast("CERTIFICATION FAILED", "Could not update status. Please try again.", "error")
    } finally {
      setIsCertifying(false)
    }
  }

  const getPostureStyles = (posture: string) => {
    switch (posture) {
      case 'AT_RISK':
        return { label: 'At Risk', color: 'text-coral border-coral/20 bg-coral/5', dot: 'bg-coral' }
      case 'OPTIMIZING':
        return { label: 'Optimizing', color: 'text-amber-500 border-amber-500/20 bg-amber-500/5', dot: 'bg-amber-500' }
      case 'CALIBRATED':
      default:
        return { label: 'Calibrated', color: 'text-teal border-teal/20 bg-teal/5', dot: 'bg-teal' }
    }
  }

  const toggleStar = (id: string) => {
    const newStars = new Set(starredInsights)
    if (newStars.has(id)) newStars.delete(id)
    else newStars.add(id)
    setStarredInsights(newStars)
  }

  useEffect(() => {
    if (containerRef.current && status === 'CERTIFIED') {
      gsap.fromTo(
        ".pillar-item",
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "power2.out" 
        }
      )
    }
  }, [strategyData.sections, status])
  
  // Task 4: The "Luxe" Document Surface
  // Max-width 900px, Centered
  return (
    <div ref={containerRef} className="max-w-[900px] mx-auto px-4 md:px-10 pb-20 pt-6 animate-in fade-in duration-700">
      {/* Wayfinding */}
      <div className="mb-12 space-y-4">
        <Breadcrumbs 
          showBack={true}
          backHref={userRole === 'ADMIN' ? `/admin/projects/${projectId}` : `/strategy-iq`}
          items={[
            { label: 'DASHBOARD', href: '/dashboard' },
            { label: clientName.toUpperCase(), href: userRole === 'ADMIN' ? `/admin/projects/${projectId}` : `/strategy-iq` },
            { label: `${dimension.toUpperCase()} STRATEGY`, active: true }
          ]} 
        />
      </div>

      {/* Admin Certification Workbench */}
      {userRole === 'ADMIN' && status !== 'CERTIFIED' && (
        <div className="mb-12 p-8 rounded-3xl bg-teal/5 border border-teal/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(46,211,198,0.05)]">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-teal font-big-shoulders tracking-widest uppercase italic">Certification Workbench</h3>
            <p className="text-zinc-500 text-sm font-inter">Review the AI synthesis below. Once approved, click certify to release the Seal of Authority to the client.</p>
          </div>
          <Button
            onClick={handleCertify}
            disabled={isCertifying}
            variant="strategy-primary"
            className="px-12 h-14 text-[10px] font-bold tracking-[0.2em] uppercase shrink-0"
          >
            {isCertifying ? 'Certifying...' : 'Certify Strategic Brief'}
          </Button>
        </div>
      )}

      {(status === 'CERTIFIED' || userRole === 'ADMIN') ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* Header & Intro */}
            <div className="relative flex justify-between items-start">
              <div className="space-y-4 max-w-2xl">
                <div className="text-[10px] font-medium tracking-[0.3em] text-zinc-500 font-inter uppercase">
                  Partner // Strategic intelligence
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white font-big-shoulders tracking-widest italic leading-none">
                  {dimension === 'gtm' ? 'GTM' : dimension.charAt(0).toUpperCase() + dimension.slice(1)} brief
                </h1>
                
                {/* Intro Zone */}
                {strategyData.intro && (
                  <div className="text-zinc-300 text-lg font-inter font-light leading-[1.8] border-l border-zinc-800 pl-6 mt-6">
                    <ReactMarkdown>{strategyData.intro}</ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Seal of Authority Watermark - Page 12 Alignment */}
              <SealOfAuthority 
                size={280} 
                className="absolute top-10 right-10 rotate-12 opacity-[0.05] text-teal z-0" 
              />
            </div>

            {/* Tactical Accordions */}
            <div className="space-y-6">
              <Accordion type="single" defaultValue="pillar_1" className="space-y-4">
                {strategyData.sections.map((section, idx) => {
                  const posture = getPostureStyles(section.posture)
                  const pillarId = `pillar_${idx + 1}`
                  const isStarred = starredInsights.has(pillarId)
                  
                  return (
                    <AccordionItem 
                      key={pillarId} 
                      value={pillarId}
                      className="pillar-item border border-white/5 bg-white/[0.02] rounded-2xl overflow-hidden hover:bg-white/[0.03] transition-all"
                    >
                      <AccordionTrigger className="px-6 md:px-8 py-6 hover:no-underline group">
                        <div className="flex flex-1 items-center justify-between mr-4">
                          <div className="flex items-center gap-6">
                            <span className="text-coral font-mono text-sm font-bold opacity-60">
                              {(idx + 1).toString().padStart(2, '0')}.
                            </span>
                            <h3 className="text-lg md:text-xl font-display font-medium text-zinc-200 group-hover:text-white transition-colors tracking-tight">
                              {section.title}
                            </h3>
                          </div>
                          
                          <div className={cn(
                            "flex items-center gap-3 px-3 py-1 rounded-full border text-[9px] font-bold tracking-widest uppercase transition-all",
                            posture.color
                          )}>
                            <div className={cn("w-1 h-1 rounded-full", posture.dot)} />
                            {posture.label}
                          </div>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="px-6 md:px-8 pb-8 pt-2">
                        <div className={cn(
                          "relative p-8 rounded-2xl border border-white/5 transition-all duration-500",
                          isStarred ? "bg-teal/[0.03] border-teal/10 shadow-[inset_0_0_20px_rgba(46,211,198,0.05)]" : "bg-black/20"
                        )}>
                          <div className="flex flex-col gap-8">
                            <div className="text-zinc-400 text-base leading-[1.6] font-inter">
                              <ReactMarkdown components={{
                                p: ({children}) => <p className="mb-4 last:mb-0">{children}</p>,
                                ul: ({children}) => <ul className="hidden">{children}</ul>, 
                                li: ({children}) => <li className="hidden">{children}</li>,
                                a: ({children}) => <span className="text-zinc-400">{children}</span> 
                              }}>
                                {section.content}
                              </ReactMarkdown>
                            </div>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleStar(pillarId)
                              }}
                              className={cn(
                                "absolute top-6 right-6 p-2 rounded-full transition-all duration-300",
                                isStarred ? "text-teal bg-teal/10 scale-110" : "text-zinc-700 hover:text-zinc-500 bg-white/5"
                              )}
                            >
                              <Star size={18} fill={isStarred ? "currentColor" : "none"} />
                            </button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>

            {/* Consultant's POV (The Signature Block) */}
            {strategyData.consultant_pov && (
              <div className="relative mt-16 p-10 rounded-3xl bg-[rgba(46,211,198,0.03)] border-y-2 border-dashed border-white/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050505] px-4 text-teal text-[10px] font-bold uppercase tracking-[0.2em] font-big-shoulders">
                  Strategic Consensus
                </div>
                
                <h3 className="text-2xl font-serif italic text-white mb-6 text-center">
                  Consultant’s POV: What This All Means
                </h3>
                
                <div className="prose prose-invert max-w-none text-zinc-300 text-lg leading-relaxed font-serif italic text-center">
                   <ReactMarkdown>{strategyData.consultant_pov}</ReactMarkdown>
                </div>

                <div className="flex justify-center mt-8">
                   <div className="h-px w-24 bg-teal/30" />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Status & Charters */}
          <div className="lg:col-span-4 space-y-8">
            {/* Strategy Status Card */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                <h2 className="text-[10px] font-bold tracking-[0.3em] text-white/40 font-inter uppercase">
                  Project governance
                </h2>
              </div>

              <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden relative group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-teal/10 text-teal border-teal/20 font-bold text-[9px] tracking-widest uppercase h-6 px-3">
                      STRATEGY STATUS: {status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-zinc-400 text-sm leading-relaxed font-inter italic">
                    "This brief has been formally certified and locked into the project's permanent intelligence record."
                  </p>
                  
                  <button 
                    onClick={() => setIsCharterOpen(true)}
                    className="text-[10px] font-bold text-zinc-500 hover:text-teal flex items-center gap-2 uppercase tracking-widest transition-colors group"
                  >
                    View full certification details <ChevronDown size={12} className="-rotate-90 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[9px] text-zinc-600 font-bold tracking-[0.2em] flex items-center gap-2 uppercase">
                      <CheckCircle size={10} className="text-teal" /> 
                      Protocol: v5.7 Certified
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Export Action */}
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-4 text-coral opacity-5 group-hover:opacity-10 transition-opacity">
                <Download size={120} />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Permanent Record</h4>
                <p className="text-zinc-400 text-xs font-inter leading-relaxed italic">Export this intelligence brief as a high-tier advisory dossier.</p>
              </div>

              <Button 
                onClick={() => window.print()}
                className="w-full bg-coral hover:bg-coral/90 text-black font-black tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-coral/10 uppercase text-xs"
              >
                <Download size={16} className="mr-3" />
                Export Strategic Dossier
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* PENDING STATE */
        <div className="min-h-[600px] flex flex-col items-center justify-center text-center space-y-12">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border border-teal/20 animate-pulse flex items-center justify-center">
              <Bot size={48} className="text-teal opacity-50" />
            </div>
            <div className="absolute inset-0 border-t-2 border-teal rounded-full animate-spin duration-[3000ms]" />
          </div>
          
          <div className="space-y-4 max-w-lg">
            <h2 className="text-4xl font-bold text-white font-big-shoulders tracking-[0.2em] uppercase italic">
              Finalizing Discovery Data
            </h2>
            <p className="text-zinc-500 font-inter text-lg italic leading-relaxed">
              StrategyIQ™ is verifying your inputs. If this takes longer than 10 seconds, please ensure all assessment questions were submitted.
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-full bg-white/5 border border-white/10 px-8">
            <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-400 tracking-[0.3em] uppercase">Queue Status: High Priority</span>
          </div>
        </div>
      )}

      {/* Methodology Footer */}
      <div className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
          StrategyIQ DNA: (Human Context + Client Data) × AI Synthesis = <span className="text-coral">Advisory Grade</span>
        </div>
        
        <div className="flex items-center gap-8 text-[8px] text-zinc-700 opacity-50 font-mono tracking-widest uppercase">
          <span>Artifact ID: {projectId.toUpperCase()}</span>
          <span>Protocol: StrategyIQ™ v5.7</span>
        </div>
      </div>

      <OperatingCharterModal 
        isOpen={isCharterOpen} 
        onClose={() => setIsCharterOpen(false)} 
      />
    </div>
  )
}
