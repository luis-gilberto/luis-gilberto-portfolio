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
  FileText,
  Lightbulb,
  AlertTriangle,
  Download
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
  const [isEditing, setIsEditing] = useState(true) // Toggle between Edit (Inter) and Preview (Playfair)

  // Deadbolt Validation: Require "Consultant's POV" string
  const hasHumanPOV = editedNarrative.includes("Consultant's POV") || editedNarrative.includes("Consultant’s POV")

  const handleUpdate = async (publish: boolean = false) => {
    if (publish && !hasHumanPOV) return // Prevent certification if POV missing
    
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

  const score = session.intelligenceScore;
  const scoreColor = score <= 40 ? 'text-at-risk' : score <= 70 ? 'text-optimizing' : 'text-calibrated';
  
  // Engagement Card Logic
  const getEngagementTier = (score: number) => {
    if (score <= 40) return { range: '$3k - $8k', type: 'Rescue Sprint' }
    if (score <= 70) return { range: '$8k - $15k', type: 'Growth Partnership' }
    return { range: '$15k - $25k', type: 'Strategic Planning' }
  }
  
  const engagement = getEngagementTier(score)

  return (
    <div className="min-h-screen bg-[#050505] text-[#F4F1ED] font-sans selection:bg-teal/20">
      
      {/* 2. HEADER & ACTION BAR ALIGNMENT */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 z-50 px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-big-shoulders font-bold tracking-widest text-white uppercase italic">
            LG // PORTAL
          </h1>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3 h-8 px-4 rounded-full border border-white/5 bg-white/[0.02]">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full",
            isPublished ? "bg-teal" : "bg-amber-500 animate-pulse"
          )} />
          <span className={cn(
            "text-[9px] font-bold tracking-widest uppercase",
            isPublished ? "text-teal" : "text-amber-500"
          )}>
            {isPublished ? 'Certified' : 'Unvetted'}
          </span>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="pt-32 pb-40 px-4 lg:px-8 max-w-[1800px] mx-auto">
        <div className={cn(
          "grid gap-8 lg:gap-12 items-start transition-all duration-500",
          !isEditing ? "grid-cols-1 max-w-[900px] mx-auto" : "grid-cols-1 lg:grid-cols-[280px_1fr_320px]"
        )}>
          
          {/* Column A (THE SIGNAL - Left) - Hidden in Preview */}
          {isEditing && (
            <div className="space-y-8 lg:sticky lg:top-32 animate-in fade-in slide-in-from-left-4 duration-500 order-2 lg:order-1">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] font-big-shoulders">
                  Intelligence Score
                </Label>
                
                <div className="relative pt-2">
                  <div className="flex items-end gap-2 mb-2">
                    <span className={cn("text-6xl font-big-shoulders font-black leading-none tracking-tight", scoreColor)}>
                      {score}
                    </span>
                    <span className="text-sm text-zinc-600 font-mono mb-1">/100</span>
                  </div>
                  
                  {/* Horizontal Progress Bar */}
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full rounded-full", score <= 40 ? 'bg-at-risk' : score <= 70 ? 'bg-optimizing' : 'bg-calibrated')}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] font-big-shoulders">
                  Recommended Fee
                </Label>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="text-xl font-medium text-zinc-200 mb-1 font-inter">{engagement.range}</div>
                  <div className="text-[10px] text-calibrated font-mono uppercase tracking-widest">
                    {engagement.type}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Column B (THE WORK - Center) */}
          <div className="space-y-8 order-1 lg:order-2">
            {/* The Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
                <span>Admin Dashboard</span>
                <span className="text-zinc-800">/</span>
                <span>{clientName}</span>
                <span className="text-zinc-800">/</span>
                <span className="text-zinc-400">{dimension}</span>
              </div>

              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsEditing(true)}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors font-big-shoulders",
                    isEditing ? "text-white" : "text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  Edit
                </button>
                <div className="w-px h-3 bg-white/10" />
                <button 
                  onClick={() => setIsEditing(false)}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors font-big-shoulders",
                    !isEditing ? "text-white" : "text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  Preview
                </button>
              </div>
            </div>

            {/* The Editor */}
            {isEditing ? (
              <div className="relative min-h-[60vh]">
                <Textarea 
                  value={editedNarrative}
                  onChange={(e) => setEditedNarrative(e.target.value)}
                  className="w-full h-full min-h-[60vh] bg-transparent border-none p-0 text-[1.1rem] leading-[1.8] font-inter font-light text-zinc-300 focus-visible:ring-0 resize-none placeholder:text-zinc-800 selection:bg-teal/20"
                  placeholder="Begin strategic synthesis..."
                  spellCheck={false}
                />
                
                {/* AI Intelligence Assist */}
                <div className="mt-8 pt-6 border-t border-teal/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Bot size={12} className="text-teal" />
                    <span className="text-[9px] font-bold text-teal uppercase tracking-[0.2em] font-big-shoulders">
                      AI Intelligence Assist
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-inter leading-relaxed italic">
                    "The intelligence score suggests a misalignment in GTM execution. Recommended focus on channel consolidation before scaling spend."
                  </p>
                </div>
              </div>
            ) : (
              <div className="min-h-[60vh] prose prose-invert prose-p:text-[rgba(255,255,255,0.85)] prose-p:font-inter prose-p:font-light prose-p:leading-[1.8] prose-headings:font-big-shoulders prose-headings:uppercase prose-headings:tracking-wider prose-headings:font-black max-w-none">
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
              </div>
            )}
          </div>

          {/* Column C (THE CONTEXT - Right) - Hidden in Preview */}
          {isEditing && (
            <div className="space-y-8 lg:sticky lg:top-32 animate-in fade-in slide-in-from-right-4 duration-500 order-3 lg:order-3">
              <div className="pl-0 lg:pl-6 border-l-0 lg:border-l-[3px] border-coral space-y-4">
                <Label className="text-[9px] font-bold text-coral uppercase tracking-[0.2em] flex items-center gap-2 font-big-shoulders">
                  <Users size={12} /> Consultant Secret Sauce
                </Label>
                
                <Textarea 
                  value={consultantAnalysis}
                  onChange={(e) => setConsultantAnalysis(e.target.value)}
                  className="w-full h-[400px] bg-transparent border-none p-0 text-sm leading-relaxed font-inter font-light text-[rgba(255,255,255,0.85)] focus-visible:ring-0 resize-none placeholder:text-zinc-800"
                  placeholder="Internal strategist notes, pricing leverage, and sensitive context..."
                />
              </div>

              <div className="pl-0 lg:pl-6">
                <div className="p-0">
                  <div className="flex items-center gap-2 mb-2 text-zinc-600">
                    <ShieldCheck size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-widest font-big-shoulders">Privacy Protocol</span>
                  </div>
                  <p className="text-[10px] text-zinc-700 leading-relaxed font-inter">
                    Content in this column is strictly internal and will never be visible to the client.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* The Control Bar (Sticky Bottom) */}
      <div className="fixed bottom-0 lg:bottom-8 left-0 lg:left-1/2 lg:-translate-x-1/2 w-full lg:max-w-5xl px-0 lg:px-8 z-50">
        <div className="flex items-center justify-between bg-[#0A0A0ACC] backdrop-blur-[10px] border-t border-white/10 p-4 rounded-none lg:rounded shadow-2xl shadow-black/50">
          
          {/* Button 1 (Left-align) */}
          <Button 
            variant="ghost"
            onClick={() => handleUpdate(false)}
            disabled={isSaving}
            className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:text-white transition-colors h-10 px-6 rounded hover:bg-white/5"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>

          {/* Right Group */}
          <div className="flex items-center gap-4">
            {/* Button 2 (Export) */}
            <Button 
              variant="outline"
              className="h-10 px-6 rounded border-coral text-coral hover:bg-coral/10 hover:text-coral transition-all text-[10px] font-bold uppercase tracking-[0.1em] bg-transparent"
            >
              <Download size={14} className="mr-2" />
              Export strategic dossier
            </Button>

            {/* Button 3 (Certify) - Deadbolt Validated */}
            <div className="relative group">
              <Button 
                onClick={() => handleUpdate(true)}
                disabled={isPublishing || isPublished || !hasHumanPOV}
                className={cn(
                  "h-10 px-6 rounded text-[10px] font-bold uppercase tracking-[0.1em] transition-all",
                  isPublished 
                    ? "bg-teal/10 text-teal cursor-default border border-teal/20" 
                    : !hasHumanPOV 
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5" 
                      : "bg-calibrated text-[#050505] hover:bg-calibrated/90"
                )}
              >
                {isPublished ? (
                  <><CheckCircle size={14} className="mr-2" /> Certified</>
                ) : (
                  <><Send size={14} className="mr-2" /> Certify & publish</>
                )}
              </Button>
              
              {/* Validation Tooltip */}
              {!hasHumanPOV && !isPublished && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-black border border-coral/50 text-coral text-[9px] font-bold uppercase tracking-widest rounded text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Human POV required for certification
                  <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-coral/50 rotate-45" />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
