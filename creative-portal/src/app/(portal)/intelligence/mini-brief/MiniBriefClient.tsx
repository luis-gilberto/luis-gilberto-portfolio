"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ArrowLeft, CheckCircle, ShieldCheck, Plus, X, RefreshCw, Wand2, Loader2, Upload, Image as ImageIcon, Trash2, ChevronRight } from 'lucide-react'
import { useToast } from '@/components/providers/toast-provider'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Label } from '@/components/ui/label'

interface MiniBriefClientProps {
  session: any
}

const PILLARS = {
  gtm: "GTM Strategy",
  brand: "Brand Positioning",
  campaign: "Campaign Ops",
  creative: "Creative Direction"
}

export default function MiniBriefClient({ session }: MiniBriefClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  
  // Composer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [composerDimension, setComposerDimension] = useState("gtm")
  const [composerNotes, setComposerNotes] = useState("")
  const [composerImage, setComposerImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiDraft, setAiDraft] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Parse existing data
  const initialData = session.certifiedNarrative ? JSON.parse(session.certifiedNarrative) : {}
  
  const [insights, setInsights] = useState<string[]>(initialData.insights || [])
  const [newInsight, setNewInsight] = useState("")
  const [solutions, setSolutions] = useState(initialData.solutions || "")
  const [consultantPov, setConsultantPov] = useState(initialData.consultantPov || "")

  const handleAddInsight = () => {
    if (newInsight.trim()) {
      setInsights([...insights, newInsight.trim()])
      setNewInsight("")
    }
  }

  const handleRemoveInsight = (index: number) => {
    setInsights(insights.filter((_, i) => i !== index))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setComposerImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateDraft = async () => {
    setIsGenerating(true)
    setAiDraft(null)
    try {
      const response = await fetch('/api/ai/composer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dimension: composerDimension,
          notes: composerNotes,
          image: composerImage
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setAiDraft(data)
        toast("DRAFT GENERATED", "AI Composer has created a strategic draft.", "success")
      } else {
        toast("GENERATION FAILED", "Could not generate draft.", "error")
      }
    } catch (error) {
      console.error(error)
      toast("ERROR", "System error.", "error")
    } finally {
      setIsGenerating(false)
    }
  }

  const applySection = (section: 'posture' | 'insights' | 'solutions' | 'pov') => {
    if (!aiDraft) return

    const confirmOverwrite = (currentValue: any) => {
      if (currentValue && (typeof currentValue === 'string' ? currentValue.length > 0 : currentValue.length > 0)) {
        return window.confirm("Applying this draft will overwrite your current progress. Continue?")
      }
      return true
    }

    if (section === 'insights') {
      if (!confirmOverwrite(insights)) return
      setInsights(aiDraft.strategic_insights || [])
    } else if (section === 'solutions') {
      if (!confirmOverwrite(solutions)) return
      const formattedSolutions = aiDraft.proposed_solutions
        .map((s: any) => `**${s.pillar}**: ${s.solution}`)
        .join('\n\n')
      setSolutions(formattedSolutions)
    } else if (section === 'pov') {
      if (!confirmOverwrite(consultantPov)) return
      setConsultantPov(aiDraft.consultant_pov || "")
    }
    
    toast("APPLIED", "Draft content applied to workspace.", "success")
  }

  const handleCertify = async () => {
    setIsSaving(true)
    try {
      const payload = {
        ...initialData,
        insights,
        solutions,
        consultantPov,
        certifiedAt: new Date().toISOString(),
        status: 'CERTIFIED'
      }

      const response = await fetch('/api/assessment/session/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          certifiedNarrative: JSON.stringify(payload),
          status: 'CERTIFIED', // Lock it
          isPublished: true
        })
      })

      if (response.ok) {
        toast("BRIEF CERTIFIED", "Strategic module has been locked and vaulted.", "success")
        router.refresh()
        router.push(`/admin/projects/${session.projectId}`)
      } else {
        toast("CERTIFICATION FAILED", "Could not save brief.", "error")
      }
    } catch (error) {
      console.error(error)
      toast("ERROR", "System error.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-inter p-8 md:p-12 relative overflow-hidden">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-white/40 hover:text-white uppercase tracking-widest text-[10px] font-bold p-0 hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-[10px] font-bold tracking-widest text-teal uppercase">
            Mini Brief Workspace
          </span>
        </div>
        <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-white/5 hover:bg-white/10 text-teal border border-teal/20 h-9 px-4 text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              <Wand2 size={14} className="mr-2" />
              Co-Pilot Composer
            </Button>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-coral animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                    Live Editor
                </span>
            </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-16">
        
        {/* Section 1: Current Posture (Read Only) */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-teal" />
            <h2 className="text-[12px] font-bold tracking-[0.2em] text-white/60 uppercase font-big-shoulders">
              Current Posture // AI Synthesis
            </h2>
          </div>
          <div className="p-8 border border-white/10 bg-white/[0.02] rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal/50" />
            <div className="prose prose-invert max-w-none text-zinc-300 text-lg leading-relaxed font-serif italic whitespace-pre-wrap">
              {session.briefSummary || initialData.narrative || "No synthesis generated yet."}
            </div>
          </div>
        </section>

        {/* Section 2: Key Insights (Editable List) */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-coral" />
            <h2 className="text-[12px] font-bold tracking-[0.2em] text-white/60 uppercase font-big-shoulders">
              Key Strategic Insights
            </h2>
          </div>
          
          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded group hover:border-white/10 transition-colors">
                <div className="mt-1 text-teal">
                  <CheckCircle size={14} />
                </div>
                <p className="flex-1 text-zinc-300 font-light">{insight}</p>
                <button 
                  onClick={() => handleRemoveInsight(idx)}
                  className="text-white/20 hover:text-coral transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            <div className="flex gap-4">
              <Input 
                value={newInsight}
                onChange={(e) => setNewInsight(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddInsight()}
                placeholder="Add a key insight..."
                className="bg-transparent border-white/10 text-white placeholder:text-white/20 focus:border-teal transition-colors"
              />
              <Button 
                onClick={handleAddInsight}
                disabled={!newInsight.trim()}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </section>

        {/* Section 3: Proposed Solutions */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
           <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <h2 className="text-[12px] font-bold tracking-[0.2em] text-white/60 uppercase font-big-shoulders">
              Proposed Solutions
            </h2>
          </div>
          <Textarea 
            value={solutions}
            onChange={(e) => setSolutions(e.target.value)}
            placeholder="Outline the strategic solution architecture..."
            className="min-h-[150px] bg-transparent border-white/10 text-zinc-300 text-lg font-light leading-relaxed focus:border-teal p-6 rounded-xl resize-none placeholder:text-white/10 placeholder:italic"
          />
        </section>

        {/* Section 4: Consultant's POV */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-coral" />
            <h2 className="text-[12px] font-bold tracking-[0.2em] text-white/60 uppercase font-big-shoulders">
              Consultant's POV
            </h2>
          </div>
          <div className="relative">
             <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-coral/50 to-transparent" />
             <Textarea 
                value={consultantPov}
                onChange={(e) => setConsultantPov(e.target.value)}
                placeholder="Final mandate and directional guidance..."
                className="min-h-[150px] bg-transparent border-none text-white text-xl font-serif italic leading-relaxed focus:ring-0 p-0 pl-4 resize-none placeholder:text-white/10"
             />
          </div>
        </section>

        {/* Footer Actions */}
        <div className="pt-16 pb-32 flex justify-end">
          <Button 
            onClick={handleCertify}
            disabled={isSaving || !consultantPov}
            className="h-14 px-8 bg-coral hover:bg-coral/90 text-white font-bold tracking-widest uppercase text-xs rounded-none transition-all hover:translate-y-[-2px]"
          >
            {isSaving ? <RefreshCw className="mr-2 animate-spin" /> : <ShieldCheck className="mr-2" />}
            Certify Mini Brief
          </Button>
        </div>

      </main>

      {/* Magic Wand Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="fixed top-0 right-0 bottom-0 w-[400px] bg-[#0A0A0A] border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center text-teal">
                    <Wand2 size={16} />
                  </div>
                  <h3 className="text-xl font-black font-big-shoulders italic uppercase tracking-wide text-white">
                    Co-Pilot Composer
                  </h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)} className="text-white/40 hover:text-white">
                  <X size={18} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Inputs */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold tracking-widest uppercase text-white/40">Assessment Dimension</Label>
                    <div className="relative">
                      <select
                        value={composerDimension}
                        onChange={(e) => setComposerDimension(e.target.value)}
                        className="w-full h-10 bg-white/5 border border-white/10 rounded px-3 text-sm text-white appearance-none focus:border-teal outline-none"
                      >
                        {Object.entries(PILLARS).map(([key, label]) => (
                          <option key={key} value={key} className="bg-[#0A0A0A] text-white">{label}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-3 top-3 w-4 h-4 text-white/20 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold tracking-widest uppercase text-white/40">Raw Notes / Context</Label>
                    <Textarea 
                      value={composerNotes}
                      onChange={(e) => setComposerNotes(e.target.value)}
                      placeholder="Paste rough notes, transcripts, or bullet points..."
                      className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-teal resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold tracking-widest uppercase text-white/40">Visual Context (Optional)</Label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "border border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all group",
                        composerImage ? "border-teal/50 bg-teal/5" : "border-white/10 hover:border-white/20 hover:bg-white/5"
                      )}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {composerImage ? (
                        <div className="relative w-full aspect-video rounded overflow-hidden">
                          <img src={composerImage} alt="Context" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); setComposerImage(null); }}>
                              <Trash2 size={14} className="mr-2" /> Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-3 group-hover:text-teal group-hover:bg-teal/10 transition-colors">
                            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                          </div>
                          <p className="text-xs text-zinc-400 font-medium">Click to upload screenshot</p>
                        </>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerateDraft}
                    disabled={isGenerating || (!composerNotes && !composerImage)}
                    className="w-full bg-teal text-[#050505] hover:bg-teal/90 font-bold tracking-widest uppercase text-[10px] h-10"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={14} /> Synthesizing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2" size={14} /> Generate Draft
                      </>
                    )}
                  </Button>
                </div>

                {/* Draft Output */}
                {aiDraft && (
                  <div className="space-y-6 pt-6 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-white/60">Generated Draft</h4>
                    </div>

                    {/* Insights */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Strategic Insights</span>
                        <Button size="sm" variant="ghost" onClick={() => applySection('insights')} className="h-6 text-[9px] text-teal hover:text-teal/80 hover:bg-teal/10 uppercase tracking-widest font-bold">
                          Apply
                        </Button>
                      </div>
                      <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                        {aiDraft.strategic_insights?.slice(0, 3).map((i: string, idx: number) => (
                          <li key={idx}>{i}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Solutions */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Proposed Solutions</span>
                        <Button size="sm" variant="ghost" onClick={() => applySection('solutions')} className="h-6 text-[9px] text-teal hover:text-teal/80 hover:bg-teal/10 uppercase tracking-widest font-bold">
                          Apply
                        </Button>
                      </div>
                      <div className="text-xs text-zinc-400 space-y-2">
                        {aiDraft.proposed_solutions?.slice(0, 2).map((s: any, idx: number) => (
                          <div key={idx}>
                            <span className="text-white font-bold">{s.pillar}:</span> {s.solution.substring(0, 50)}...
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* POV */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Consultant's POV</span>
                        <Button size="sm" variant="ghost" onClick={() => applySection('pov')} className="h-6 text-[9px] text-teal hover:text-teal/80 hover:bg-teal/10 uppercase tracking-widest font-bold">
                          Apply
                        </Button>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-3">
                        {aiDraft.consultant_pov}
                      </p>
                    </div>

                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
