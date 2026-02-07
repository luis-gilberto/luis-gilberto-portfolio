'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, 
  RefreshCw, 
  ArrowLeft, 
  Zap, 
  Bot,
  Users,
  CheckCircle,
  Send,
  Eye,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ResultsView } from './ResultsView'

interface StrategyWorkbenchProps {
  session: any
  projectId: string
  dimension: string
  clientName: string
}

export function StrategyWorkbench({ 
  session, 
  projectId, 
  dimension, 
  clientName 
}: StrategyWorkbenchProps) {
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublished, setIsPublished] = useState(session.isPublished || false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  // Workbench State
  const [editedNarrative, setEditedNarrative] = useState(
    session.certifiedNarrative || 
    (session.briefSummary ? session.briefSummary : "")
  )
  const [consultantAnalysis, setConsultantAnalysis] = useState(session.consultantAnalysis || "")

  const handleUpdate = async (publish: boolean = false) => {
    if (publish) setIsPublishing(true)
    else setIsSaving(true)
    
    setSaveStatus('idle')

    try {
      const response = await fetch(`/api/strategy-iq/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: session.id,
          projectId: projectId,
          dimension: dimension,
          certifiedNarrative: editedNarrative,
          consultantAnalysis: consultantAnalysis,
          isPublished: publish || isPublished
        })
      })
      
      if (response.ok) {
        if (publish) setIsPublished(true)
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 3000)
        router.refresh()
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Error updating assessment:', error)
      setSaveStatus('error')
    } finally {
      setIsPublishing(false)
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8 pb-20">
      {/* Header / Command Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0F0F0F] border border-white/5 p-8 rounded-[32px] sticky top-24 z-30 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="rounded-full w-12 h-12 p-0 text-white/40 hover:text-coral hover:bg-coral/5 transition-all border border-white/5"
          >
            <ArrowLeft size={24} />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Badge className="bg-coral/20 text-coral border-none text-[10px] uppercase tracking-widest px-3 py-1">
                Strategy Workbench
              </Badge>
              <h1 className="text-3xl font-big-shoulders font-bold tracking-widest text-white uppercase italic">
                {dimension.toUpperCase()} / {clientName}
              </h1>
            </div>
            <p className="text-xs text-white/40 tracking-wider font-mono">
              RAW INTELLIGENCE DRAFT // STATUS: {isPublished ? 'CERTIFIED' : 'UNVETTED'}
              {saveStatus === 'success' && <span className="text-teal ml-4">✓ CHANGES SAVED</span>}
              {saveStatus === 'error' && <span className="text-coral ml-4">⚠ SAVE FAILED</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="outline"
            className={cn(
              "border-white/10 uppercase tracking-widest text-[10px] font-black h-12 px-8 rounded-full transition-all",
              isPreviewMode ? "bg-white text-black hover:bg-white/90" : "text-white/60 hover:text-white"
            )}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <><ArrowLeft className="mr-2 h-4 w-4" /> Back to Workbench</>
            ) : (
              <><Eye className="mr-2 h-4 w-4" /> Preview Partner View</>
            )}
          </Button>

          {!isPreviewMode && (
            <>
              <Button 
                variant="outline"
                disabled={isSaving || isPublishing}
                onClick={() => handleUpdate(false)}
                className="border-white/10 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-black h-12 px-8 rounded-full"
              >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <FileText className="mr-2 h-4 w-4" />}
                Save Draft
              </Button>

              <Button 
                onClick={() => handleUpdate(true)}
                disabled={isPublishing || isPublished}
                className={cn(
                  "rounded-full px-10 py-6 uppercase tracking-[0.2em] text-[10px] font-black transition-all duration-500",
                  isPublished 
                    ? "bg-white/5 text-white/40 border border-white/10 cursor-not-allowed" 
                    : "bg-teal text-black hover:bg-teal/80 shadow-[0_0_30px_rgba(46,211,198,0.3)]"
                )}
              >
                {isPublishing ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : isPublished ? (
                  <><ShieldCheck className="h-4 w-4 mr-2" /> Strategy Certified</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" /> Certify & Publish Brief</>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {isPreviewMode ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#050505] min-h-screen pt-12 rounded-[40px] border border-white/5"
        >
          <ResultsView 
            session={{
              ...session,
              certifiedNarrative: editedNarrative,
              isPublished: isPublished
            }}
            projectId={projectId}
            dimension={dimension}
            userRole="CLIENT"
            clientName={clientName}
          />
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Score & Metrics */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden">
              <CardHeader className="p-6 border-b border-white/5">
                <CardTitle className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Intelligence Score</CardTitle>
              </CardHeader>
              <CardContent className="p-8 text-center">
                <div className="text-7xl font-big-shoulders font-bold text-teal mb-2">
                  {session.intelligenceScore}<span className="text-2xl text-white/20">/100</span>
                </div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Aggregate Posture</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden">
              <CardHeader className="p-6 border-b border-white/5">
                <CardTitle className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Rec. Engagement</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-2xl font-bold text-white mb-1">$12,000 - $18,000</div>
                <p className="text-[10px] text-coral uppercase tracking-widest font-bold flex items-center gap-2">
                  <Zap size={12} /> High Service Match
                </p>
              </CardContent>
            </Card>

            <div className="p-6 rounded-3xl bg-teal/5 border border-teal-500/20">
              <h4 className="text-[10px] font-bold text-teal uppercase tracking-[0.2em] mb-4">Internal Rationale</h4>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <Bot className="text-teal/40 shrink-0" size={16} />
                  <p className="text-xs text-white/60 leading-relaxed italic">
                    "AI Synthesis suggests a focus on operational scale over brand depth for this specific posture."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Center: The Narrative Workbench */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal flex items-center gap-2">
                  <FileText size={14} /> Certified Strategic Narrative
                </Label>
                <Badge variant="outline" className="text-[9px] border-white/10 text-white/20">
                  MARKDOWN SUPPORTED
                </Badge>
              </div>
              <Textarea 
                value={editedNarrative}
                onChange={(e) => setEditedNarrative(e.target.value)}
                className="min-h-[600px] bg-white/2 border-white/5 focus:border-teal/50 transition-all p-10 text-lg leading-relaxed font-serif italic text-white/90 rounded-[32px] shadow-2xl"
                placeholder="The raw AI intelligence is populated here. Edit, refine, and certify the final narrative..."
              />
            </div>
          </div>

          {/* Right: Secret Sauce / Internal Analysis */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-coral flex items-center gap-2">
                <Users size={14} /> Consultant Secret Sauce
              </Label>
              <Textarea 
                value={consultantAnalysis}
                onChange={(e) => setConsultantAnalysis(e.target.value)}
                className="min-h-[400px] bg-black/40 border-white/5 focus:border-coral/50 transition-all p-6 text-sm leading-relaxed font-inter text-white/60 rounded-3xl"
                placeholder="Add internal reasoning, pricing strategies, or sensitive context not visible to the Partner's primary brief..."
              />
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <h5 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ShieldCheck size={12} /> Privacy Protocol
                </h5>
                <p className="text-[9px] text-white/20 leading-relaxed">
                  This field is strictly for internal strategist context. It will NOT be displayed in the Partner's Strategic Brief view.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
