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
  
  const responses = JSON.parse(session.responses || '{}') as Record<string, number>
  const questions = assessmentQuestions[dimension as AssessmentCategory] || []
  const score = session.intelligenceScore || 0

  const [isPublished, setIsPublished] = React.useState(session.isPublished || false)

  // Generate "The Story" (Summary Narrative)
  const getNarrative = () => {
    // 1. Prefer Certified Narrative if published
    if (isPublished && session.certifiedNarrative) {
      try {
        const parsed = JSON.parse(session.certifiedNarrative)
        if (Array.isArray(parsed)) return parsed
        return [session.certifiedNarrative] // If it's a plain string from editor
      } catch (e) {
        return [session.certifiedNarrative]
      }
    }

    // 2. Check if we have a pre-saved summary in the dedicated briefSummary field
    if (session.briefSummary) {
      try {
        const parsed = JSON.parse(session.briefSummary)
        if (Array.isArray(parsed)) return parsed
      } catch (e) {
        console.error('Error parsing briefSummary field:', e)
      }
    }

    // 2. Check if we have a pre-saved summary in the enriched responses (the hack)
    if (responses.__briefSummary && Array.isArray(responses.__briefSummary)) {
      return responses.__briefSummary;
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
    
    return insights
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
    <div ref={containerRef} className="max-w-5xl mx-auto px-6 space-y-12">
      {/* Transparency Layer Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-4">
          <Badge 
            className={cn(
              "font-black tracking-[0.2em] uppercase text-[10px] px-4 py-1.5 rounded-full",
              isPublished 
                ? "bg-teal text-black" 
                : "bg-white/10 text-white/40 border border-white/5"
            )}
          >
            {isPublished ? 'Certified Strategy' : 'Initial Intelligence'}
          </Badge>
          {!isPublished && (
            <p className="text-[11px] text-white/40 font-medium italic">
              This is an immediate AI-synthesized narrative based on your inputs. Our strategy team is currently certifying these findings.
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
            <UserRoleBadge />
            <Badge variant="outline" className="border-teal-500/50 text-teal-400 bg-teal-500/10 uppercase tracking-widest text-[10px] px-3 py-1">
              {dimension.toUpperCase()} ANALYSIS
            </Badge>
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">Intelligence Secured</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-big-shoulders tracking-widest uppercase italic leading-none">
            {dimension} Intelligence
          </h1>
          <p className="text-white/40 max-w-xl text-lg font-inter leading-relaxed italic">
            "The Story of {clientName}—captured, analyzed, and secured."
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/strategyiq')}
            className="border-white/10 text-white hover:bg-white/5 uppercase tracking-widest text-[10px] h-10 px-6"
          >
            <ArrowLeft className="mr-2 h-3 w-3" /> Back to Engine
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: The Story */}
        <div className="lg:col-span-2 space-y-12">
          {/* Editorial Summary */}
          <section className="result-card space-y-12">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-teal" />
              <h2 className="text-sm font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
                STRATEGIC NARRATIVE <span className="text-white/20 ml-2">/ THE STORY</span>
              </h2>
            </div>

            <div className="space-y-16">
              {narrative.length > 0 ? (
                narrative.map((insight, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="relative pl-8 md:pl-12 border-l border-white/5 hover:border-teal/30 transition-colors"
                  >
                    <p className="text-2xl md:text-3xl lg:text-4xl text-gray-100 leading-relaxed font-serif italic tracking-tight opacity-90">
                      {insight}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 italic text-2xl font-serif">No strategic insights available for this session.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Status & Next Steps */}
        <div className="space-y-8">
          {/* Human-In-The-Loop Card */}
          <section className="result-card">
            <Card className="bg-gradient-to-br from-teal/20 to-transparent border-teal/30 border-2 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users size={80} />
              </div>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-teal/20 text-teal">
                    <Clock size={20} />
                  </div>
                  <CardTitle className="text-lg text-white font-big-shoulders tracking-widest uppercase italic">Strategy Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge className="bg-teal text-black font-bold text-[10px] uppercase tracking-widest">
                  {isPublished ? 'Analysis Published' : 'Under Human Review'}
                </Badge>
                <p className="text-gray-300 text-sm leading-relaxed font-inter">
                  {isPublished 
                    ? "Your strategic roadmap has been published and is ready for execution." 
                    : "Luis Gilberto Strategists are currently reviewing these results. A full strategic roadmap will be published following our next consultation."}
                </p>
                <div className="pt-4 border-t border-teal/20">
                  <p className="text-[10px] text-teal/60 uppercase font-bold tracking-widest flex items-center gap-2">
                    <CheckCircle size={10} /> {isPublished ? 'Verification Complete' : 'Estimated review: 24 Hours'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* IP Protection Notice */}
          <section className="result-card">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center space-y-4">
              <ShieldCheck className="mx-auto text-white/20 h-8 w-8" />
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">
                Proprietary StrategyIQ™ Engine
              </p>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard')}
                className="w-full text-xs text-gray-500 hover:text-white"
              >
                Exit to Dashboard
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
