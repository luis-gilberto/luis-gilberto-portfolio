'use client'

import React, { useEffect, useRef } from 'react'
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
  Printer
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
  const containerRef = useRef<HTMLDivElement>(null)

  // Redirect Admins to the Workbench
  useEffect(() => {
    if (userRole === 'ADMIN') {
      router.push(`/admin/projects/${projectId}/strategy/${dimension}/results`)
    }
  }, [userRole, projectId, dimension, router])
  
  const responses = safeJsonParse(session.responses, {}) as Record<string, number>
  const questions = assessmentQuestions[dimension as AssessmentCategory] || []
  const score = session.intelligenceScore || 0

  const [isPublished, setIsPublished] = React.useState(session.isPublished || false)

  // Generate "The Story" (Summary Narrative)
  const getNarrative = () => {
    // 1. Prefer Certified Narrative if published
    if (isPublished && session.certifiedNarrative) {
      const parsed = safeJsonParse(session.certifiedNarrative)
      if (typeof parsed === 'string') return parsed
      if (parsed && typeof parsed === 'object') return Object.values(parsed).join('\n\n')
      return ""
    }

    // 2. Check if we have a pre-saved summary in the dedicated briefSummary field
    if (session.briefSummary) {
      const parsed = safeJsonParse(session.briefSummary)
      if (typeof parsed === 'string') return parsed
      if (parsed && typeof parsed === 'object') return Object.values(parsed).join('\n\n')
      return ""
    }

    // 3. Check if we have a pre-saved summary in the enriched responses (the hack)
    if (responses.__briefSummary) {
      return Array.isArray(responses.__briefSummary) 
        ? responses.__briefSummary.join('\n\n')
        : responses.__briefSummary;
    }

    // 4. Fallback to on-the-fly generation
    const insights: string[] = []
    
    questions.forEach(q => {
      const selectedScore = responses[q.id]
      if (selectedScore !== undefined) {
        const option = q.options.find(o => o.score === selectedScore)
        if (option?.insight) {
          insights.push(option.insight)
        }
      }
    })
    
    return insights.join('\n\n')
  }

  const narrative = getNarrative()

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        ".result-card",
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "power3.out" 
        }
      )
    }
  }, [])

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-6 space-y-12 pb-20">
      {/* Print Controls (Floating Top Right) */}
      <div className="fixed top-24 right-12 z-40 print:hidden">
        <Button 
          onClick={() => window.print()}
          className="print-roadmap-btn bg-teal hover:bg-teal/90 text-black font-black tracking-[0.2em] px-8 h-12 rounded-xl shadow-2xl shadow-teal/20"
        >
          <Printer size={16} className="mr-2" />
          PRINT DOSSIER
        </Button>
      </div>

      {/* Centered Brand Header */}
      <div className="text-center space-y-2 pt-12">
        <h3 className="text-[10px] font-black tracking-[0.4em] text-white/20 font-big-shoulders italic uppercase">
          Luis Gilberto / Portal
        </h3>
        <div className="flex items-center justify-center gap-2">
          <Badge className="bg-coral/20 text-coral border-none text-[9px] tracking-widest px-3 py-1">
            Partner briefing
          </Badge>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-[9px] font-bold tracking-widest text-white/40">
            Confidential // Project: {projectId.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Transparency Layer Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 print:hidden">
        <div className="flex items-center gap-4">
          <Badge 
            className={cn(
              "font-bold tracking-[0.2em] text-[9px] px-3 py-1 rounded-full",
              isPublished 
                ? "bg-teal text-black" 
                : "bg-white/5 text-white/30 border border-white/5"
            )}
          >
            {isPublished ? 'Certified strategy' : 'Initial intelligence'}
          </Badge>
          {!isPublished && (
            <p className="text-[10px] text-white/30 font-medium italic">
              AI-synthesized narrative based on preliminary inputs. Certification pending review.
            </p>
          )}
        </div>
        {isPublished && (
          <div className="flex items-center gap-2 text-teal">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold tracking-widest">LG-Certified</span>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-10 print:pb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <UserRoleBadge role={userRole} />
            <Badge variant="outline" className="border-teal-500/50 text-teal-400 bg-teal-500/10 tracking-widest text-[10px] px-3 py-1">
              {dimension === 'gtm' ? 'GTM' : dimension} intelligence
            </Badge>
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/20">Intelligence secured</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-big-shoulders tracking-widest italic leading-none print:text-black">
            {dimension === 'gtm' ? 'GTM' : dimension} intelligence
          </h1>
          <p className="text-white/40 max-w-xl text-lg font-inter leading-relaxed italic print:text-zinc-600">
            "The story of {clientName}: captured, analyzed, and secured."
          </p>
        </div>

        <div className="flex items-center gap-4 print:hidden">
          <Button 
            variant="strategy-secondary" 
            onClick={() => router.push('/strategy-iq')}
            className="h-10 px-6 text-[10px] font-bold tracking-widest uppercase"
          >
            <ArrowLeft className="mr-2 h-3 w-3" /> Back to strategy hub
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/projects/${projectId}`)}
            className="h-10 px-6 text-[10px] font-bold tracking-widest uppercase border-white/10 text-white/40 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-3 w-3" /> Back to project overview
          </Button>
        </div>
      </div>

      <div className="results-grid">
        {/* Left Column: Strategic Analysis */}
        <div className="space-y-12">
          <section className="result-card space-y-8">
            <div className="space-y-2">
              <div className="text-[10px] tracking-[0.2em] text-zinc-500 font-bold uppercase">
                {isPublished ? 'Certified strategy' : 'Preliminary intelligence'}
              </div>
              <div className="flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full", isPublished ? "bg-teal" : "bg-teal/40")} />
                  <h2 className="text-[10px] font-bold tracking-[0.2em] text-white/40 font-inter uppercase">
                    Strategic analysis <span className="text-white/10 ml-2">/ The briefing</span>
                  </h2>
                </div>
            </div>

            <div className="space-y-10">
              {narrative ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "relative pl-8 md:pl-10 border-l flex flex-col gap-y-6",
                    isPublished ? "border-teal/30" : "border-white/5"
                  )}
                >
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap text-zinc-300 text-lg leading-relaxed prose-strong:text-white prose-strong:font-bold prose-p:mb-4 prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-2 prose-li:marker:text-teal print:text-black">
                    <ReactMarkdown>
                      {narrative}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ) : (
                <p className="text-zinc-500 italic text-lg font-serif">No strategic insights available for this session.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Actionable Next Steps & Status */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-coral" />
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-white/40 font-inter uppercase">
              Actionable next steps <span className="text-white/10 ml-2">/ Execution</span>
            </h2>
          </div>

          {/* Strategy Status Card */}
          <section className="result-card">
            <Card className="bg-white/5 border-white/10 border overflow-hidden relative print:bg-white print:border-zinc-200">
              <div className="absolute top-0 right-0 p-4 opacity-5 print:hidden">
                <Users size={60} />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-white/5 text-white/40 print:bg-zinc-100">
                    <Clock size={16} />
                  </div>
                  <CardTitle className="text-sm text-white/60 font-bold tracking-widest font-inter uppercase print:text-zinc-600">Strategy status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge className="bg-white/5 text-white/40 border border-white/10 font-bold text-[9px] tracking-widest uppercase print:text-zinc-600">
                  {isPublished ? 'Analysis published' : 'Review in progress'}
                </Badge>
                <p className="text-zinc-400 text-xs leading-relaxed font-inter print:text-zinc-600">
                  {isPublished 
                    ? "Your strategic roadmap has been published and is ready for execution." 
                    : "Strategists are currently calibrating these results. A formal briefing will be provided following our review."}
                </p>
                <div className="pt-4 border-t border-white/5 print:border-zinc-100">
                  <p className="text-[9px] text-zinc-500 font-bold tracking-widest flex items-center gap-2 uppercase">
                    <CheckCircle size={10} /> {isPublished ? 'Verification complete' : 'Estimated review: 24 Hours'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Action Card Placeholder (to make it look substantial) */}
          <section className="result-card">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 print:bg-white print:border-zinc-200">
              <Zap className="text-coral h-6 w-6" />
              <h4 className="text-sm font-bold text-white uppercase tracking-widest print:text-black">Immediate Priorities</h4>
              <ul className="space-y-3">
                {['Align stakeholders on narrative', 'Review certified brief in team sync', 'Initialize next strategic pillar'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-zinc-400 print:text-zinc-600">
                    <div className="w-1 h-1 rounded-full bg-zinc-800" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* IP Protection Notice */}
          <section className="result-card print:hidden">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center space-y-4">
              <ShieldCheck className="mx-auto text-white/20 h-8 w-8" />
              <p className="text-[10px] text-white/20 tracking-[0.3em] font-bold uppercase">
                Proprietary StrategyIQ™ Engine
              </p>
              <Button 
                variant="strategy-secondary" 
                onClick={() => router.push('/dashboard')}
                className="w-full text-[10px] h-10"
              >
                Exit to dashboard
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
