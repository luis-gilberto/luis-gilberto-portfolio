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
  Send
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

    // 2. Check if we have a pre-saved summary in the enriched responses (the hack)
    if (responses.__briefSummary) {
      return Array.isArray(responses.__briefSummary) 
        ? responses.__briefSummary.join('\n\n')
        : responses.__briefSummary;
    }

    // 3. Fallback to on-the-fly generation
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
    <div ref={containerRef} className="max-w-3xl mx-auto px-6 space-y-12 pb-20">
      {/* Centered Brand Header */}
      <div className="text-center space-y-2 pt-12">
        <h3 className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase font-big-shoulders italic">
          Luis Gilberto / Portal
        </h3>
        <div className="flex items-center justify-center gap-2">
          <Badge className="bg-coral/20 text-coral border-none text-[9px] uppercase tracking-widest px-3 py-1">
            Partner Briefing
          </Badge>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase">
            Confidential
          </span>
        </div>
      </div>

      {/* Transparency Layer Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
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
            <span className="text-[10px] font-bold uppercase tracking-widest">LG-Certified</span>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <UserRoleBadge role={userRole} />
            <Badge variant="outline" className="border-teal-500/50 text-teal-400 bg-teal-500/10 tracking-widest text-[10px] px-3 py-1">
              {dimension === 'gtm' ? 'GTM' : dimension} intelligence
            </Badge>
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/20">Intelligence secured</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-big-shoulders tracking-widest italic leading-none">
            {dimension === 'gtm' ? 'GTM' : dimension} intelligence
          </h1>
          <p className="text-white/40 max-w-xl text-lg font-inter leading-relaxed italic">
            "The Story of {clientName}—captured, analyzed, and secured."
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="strategy-secondary" 
            onClick={() => router.push('/strategy-iq')}
            className="h-10 px-6 text-[10px]"
          >
            <ArrowLeft className="mr-2 h-3 w-3" /> Back to Strategy Engine
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: The Story */}
        <div className="lg:col-span-2 space-y-12">
          {/* Editorial Summary */}
          <section className="result-card space-y-8">
            <div className="space-y-2">
              <div className="text-[10px] tracking-[0.2em] text-zinc-500 font-bold">
                {isPublished ? 'Certified strategy' : 'Preliminary intelligence (Pending review)'}
              </div>
              <div className="flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full", isPublished ? "bg-teal" : "bg-teal/40")} />
                  <h2 className="text-[10px] font-bold tracking-[0.2em] text-white/40 font-inter">
                    Strategic briefing <span className="text-white/10 ml-2">/ The story</span>
                  </h2>
                </div>
            </div>

            <div className="space-y-10">
              {narrative ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "relative pl-8 md:pl-10 border-l",
                    isPublished ? "border-teal/30" : "border-white/5"
                  )}
                >
                  <div className="prose prose-invert prose-sm md:prose-base prose-p:leading-relaxed prose-pre:whitespace-pre-wrap whitespace-pre-wrap max-w-none text-zinc-300 prose-p:mb-6 prose-strong:text-white prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6 prose-ul:space-y-2 prose-li:pl-2 prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-6 prose-ol:space-y-2 prose-li:marker:text-teal">
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

        {/* Right Column: Status & Next Steps */}
        <div className="space-y-8">
          {/* Human-In-The-Loop Card */}
          <section className="result-card">
            <Card className="bg-white/5 border-white/10 border overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Users size={60} />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-white/5 text-white/40">
                    <Clock size={16} />
                  </div>
                  <CardTitle className="text-sm text-white/60 font-bold tracking-widest font-inter">Strategy status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge className="bg-white/5 text-white/40 border border-white/10 font-bold text-[9px] tracking-widest">
                  {isPublished ? 'Analysis published' : 'Review in progress'}
                </Badge>
                <p className="text-zinc-400 text-xs leading-relaxed font-inter">
                  {isPublished 
                    ? "Your strategic roadmap has been published and is ready for execution." 
                    : "Strategists are currently calibrating these results. A formal briefing will be provided following our review."}
                </p>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[9px] text-zinc-500 font-bold tracking-widest flex items-center gap-2">
                    <CheckCircle size={10} /> {isPublished ? 'Verification complete' : 'Estimated review: 24 Hours'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* IP Protection Notice */}
          <section className="result-card">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center space-y-4">
              <ShieldCheck className="mx-auto text-white/20 h-8 w-8" />
              <p className="text-[10px] text-white/20 tracking-[0.3em] font-bold">
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
