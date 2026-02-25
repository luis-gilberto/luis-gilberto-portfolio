"use client"

import React from 'react'
import { 
  X, 
  ShieldCheck, 
  ChevronRight,
  RefreshCw,
  Printer
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { safeJsonParse } from '@/lib/json-utils'
import ReactMarkdown from 'react-markdown'

import { useRouter } from 'next/navigation'
import { useToast } from "@/components/providers/toast-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { SealOfAuthority } from "@/components/shared/SealOfAuthority"

interface MasterRoadmapModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  project: any
}

export function MasterRoadmapModal({ isOpen, onOpenChange, project }: MasterRoadmapModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeploying, setIsDeploying] = React.useState(false)
  const [activePhaseIndex, setActivePhaseIndex] = React.useState(0)
  const [localStrategicContext, setLocalStrategicContext] = React.useState<any>(null)
  const [strategistIdentity, setStrategistIdentity] = React.useState<any>(null)

  React.useEffect(() => {
    const saved = localStorage.getItem("strategic_context")
    if (saved) {
      try {
        setLocalStrategicContext(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse strategic_context", e)
      }
    }

    // Fetch Strategist Identity
    const fetchIdentity = async () => {
      try {
        const res = await fetch('/api/user/profile')
        if (res.ok) {
          const data = await res.json()
          setStrategistIdentity(data)
        }
      } catch (err) {
        console.error("Failed to fetch identity for signature", err)
      }
    }
    
    if (isOpen) {
      fetchIdentity()
    }
  }, [isOpen])

  if (!project?.masterPlan && !project?.masterRoadmap && !project?.executiveSynthesis) return null

  const roadmapData = project.masterPlan || safeJsonParse(project.masterRoadmap, {
    executiveSynthesis: project.executiveSynthesis || "Strategic synthesis in progress...",
    criticalConstraint: project.criticalConstraint || "Constraint under strategic validation.",
    phases: []
  })

  // Prioritize direct project fields if available
  const executiveSynthesis = project.executiveSynthesis || roadmapData.executiveSynthesis;
  const criticalConstraint = project.criticalConstraint || roadmapData.criticalConstraint;
  const phases = roadmapData.phases || [];

  const isPending = !executiveSynthesis || executiveSynthesis.includes("pending AI synthesis") || executiveSynthesis.includes("System initializing");

  const score = project.overallIntelligenceScore || 0
  
  // Logic of the Close mapping
  const getEngagementTier = (s: number) => {
    if (s < 40) return "Strategic Intelligence"
    if (s <= 70) return "Strategic Planning"
    return "Quick-Start Sprint"
  }

  const engagementTier = getEngagementTier(score)

  const handleApproveAndDeploy = async () => {
    setIsDeploying(true)
    try {
      const response = await fetch('/api/strategy-iq/approve-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId: project.id,
          masterPlan: roadmapData
        })
      })

      if (response.ok) {
        toast("STRATEGY DEPLOYED", "The Master Plan is now active and milestones have been initialized.", "success")
        onOpenChange(false)
        router.refresh()
      } else {
        const error = await response.json()
        toast("DEPLOYMENT FAILED", error.message || "Failed to deploy strategy", "error")
      }
    } catch (err) {
      console.error('Error deploying strategy:', err)
      toast("ERROR", "A fatal error occurred during deployment.", "error")
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1300px] h-[95vh] bg-[#050505] border-white/10 p-0 overflow-hidden flex flex-col gap-0 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        <DialogDescription className="sr-only">
          Confidential intelligence report and multi-phase acceleration plan for {project.title}.
        </DialogDescription>
        {/* Letterhead Header Section */}
        <div className="h-20 md:h-24 border-b border-white/10 flex items-center justify-between px-6 md:px-10 bg-black sticky top-0 z-30">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px] font-bold tracking-[0.5em] text-white/40 mb-1 uppercase">LG / Portal</span>
              <DialogTitle className="text-lg md:text-2xl font-bold font-inter tracking-tight text-white">
                Master Roadmap
              </DialogTitle>
            </div>
            <div className="hidden md:block h-8 w-px bg-white/10" />
            <div className="hidden md:flex flex-col">
              <span className="text-[9px] font-bold text-white/20 tracking-[0.2em] mb-0.5">Project</span>
              <span className="text-[11px] text-white/60 font-medium">{project.title}</span>
            </div>
            <div className="hidden md:flex flex-col ml-4">
              <span className="text-[9px] font-bold text-white/20 tracking-[0.2em] mb-0.5">Reference</span>
              <span className="text-[11px] text-white/60 font-mono">{project.id.slice(-8).toUpperCase()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => window.print()}
              className="hidden md:flex bg-white/5 hover:bg-white/10 text-white/60 font-bold tracking-widest text-[10px] px-6 h-10 rounded-xl border border-white/10 group print:hidden"
            >
              <Printer size={14} className="mr-2 group-hover:scale-110 transition-transform" />
              PRINT DOSSIER
            </Button>
            <Badge className="hidden md:flex bg-white/[0.03] text-white/40 border-white/10 text-[9px] tracking-[0.2em] py-1 px-3 font-bold">
              Confidential advisory
            </Badge>
            <button 
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-white/5 rounded-md text-white/20 hover:text-white transition-all border border-white/10"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1 relative">
          {/* Phase 92: Seal of Authority Watermark - Authoritative Alignment */}
          <div className="absolute top-40 right-40 opacity-5 pointer-events-none z-0">
            <SealOfAuthority size={500} opacity={1} rotate={12} />
          </div>
          
          <div className="absolute bottom-40 left-20 opacity-[0.02] pointer-events-none z-0">
            <SealOfAuthority size={400} opacity={1} rotate={-8} />
          </div>
          
          <div className="p-8 md:p-16 relative z-10">
            <div className="grid grid-cols-12 gap-12 md:gap-16">
              
              {/* Left Column: The Uber Brief (Cols 1-5) */}
              <div className="col-span-12 lg:col-span-5 space-y-12 md:space-y-16">
                
                {/* Aggregate Score Section */}
                <section className="relative">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-1 rounded-full bg-teal" />
                    <h3 className="text-[11px] font-bold tracking-widest text-white/40">
                      Aggregate intelligence score
                    </h3>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="44"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-white/[0.03]"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="44"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={276}
                          strokeDashoffset={276 * (1 - score / 100)}
                          className={cn(
                            "transition-all duration-1000",
                            score > 70 ? "text-teal" : score > 40 ? "text-zinc-500" : "text-coral"
                          )}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-bold text-white font-inter tracking-tighter leading-none">
                          {score}
                        </span>
                        <span className="text-[6px] font-bold text-white/20 uppercase tracking-widest">
                          Score
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-1 gap-3">
                      <div className="p-3 rounded-lg border border-white/10 bg-transparent">
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest block mb-0.5">Recommended service</span>
                        <div className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">
                          {engagementTier}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border border-white/10 bg-transparent">
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest block mb-0.5">Investment range</span>
                        <div className="text-[10px] md:text-xs font-bold text-white">
                          {project.quotedInvestment}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Executive Summary Section */}
                <section className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-1 rounded-full bg-teal" />
                    <h3 className="text-[11px] font-bold tracking-widest text-white/40 uppercase">
                      Executive synthesis
                    </h3>
                  </div>
                  <div className="relative p-0">
                    {isPending ? (
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-full bg-white/5" />
                        <Skeleton className="h-4 w-[90%] bg-white/5" />
                        <Skeleton className="h-4 w-[95%] bg-white/5" />
                        <Skeleton className="h-4 w-[85%] bg-white/5" />
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none text-zinc-300 text-base leading-relaxed font-inter whitespace-pre-wrap prose-strong:text-white prose-strong:font-bold prose-p:mb-4">
                        <ReactMarkdown>
                          {executiveSynthesis}
                        </ReactMarkdown>
                        
                        {localStrategicContext && (
                          <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                            {localStrategicContext.objective && (
                              <div>
                                <h4 className="text-[10px] font-bold text-teal tracking-[0.2em] uppercase mb-2">Primary Objective</h4>
                                <p className="text-sm text-zinc-400">{localStrategicContext.objective}</p>
                              </div>
                            )}
                            {localStrategicContext.okrs && (
                              <div>
                                <h4 className="text-[10px] font-bold text-teal tracking-[0.2em] uppercase mb-2">Active OKRs</h4>
                                <p className="text-sm text-zinc-400 whitespace-pre-wrap">{localStrategicContext.okrs}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>

                {/* Critical Constraint Section */}
                <section>
                  <div className="p-6 rounded-xl border border-coral/10 bg-transparent relative overflow-hidden h-auto">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-1 rounded-full bg-coral" />
                      <h3 className="text-[11px] font-bold tracking-widest text-coral uppercase">
                        Critical constraint
                      </h3>
                    </div>
                    {isPending ? (
                      <Skeleton className="h-6 w-full bg-white/5" />
                    ) : (
                      <div className="text-white text-xl font-normal leading-tight relative z-10 font-inter tracking-tight">
                        {criticalConstraint}
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column: The Strategic Plan (Cols 6-12) */}
              <div className="col-span-12 lg:col-span-7 space-y-16">
                <section>
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-1 h-1 rounded-full bg-teal" />
                    <h3 className="text-[11px] font-bold tracking-widest text-white/40 uppercase">
                      Multi-phase acceleration plan
                    </h3>
                  </div>
                  
                  <div className="relative space-y-0 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
                    {isPending ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="relative pl-12 pb-16">
                          <div className="absolute left-[3px] top-2 w-[9px] h-[9px] rounded-full z-10 border-2 border-[#050505] bg-zinc-800" />
                          <div className="space-y-4">
                            <Skeleton className="h-6 w-48 bg-white/5" />
                            <Skeleton className="h-4 w-full bg-white/5" />
                            <div className="grid grid-cols-2 gap-8 pt-4">
                              <Skeleton className="h-24 bg-white/5" />
                              <Skeleton className="h-24 bg-white/5" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      phases?.map((phase: any, idx: number) => {
                        const isActive = idx === activePhaseIndex;
                        
                        return (
                          <div key={idx} className="relative pl-12 pb-16 last:pb-0 group">
                            {/* Status Dot */}
                            <div className={cn(
                              "absolute left-[3px] top-2 w-[9px] h-[9px] rounded-full z-10 border-2 border-[#050505] transition-all",
                              isActive ? "bg-teal scale-110" : "bg-zinc-800"
                            )} />
                            
                            {/* Task 3: Current Active Phase line */}
                            {isActive && (
                              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-teal z-0" />
                            )}
                            
                            <div className="space-y-8">
                              {/* Header Section */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                  <span className="text-[10px] font-bold text-white/20 tracking-[0.4em] uppercase">
                                    {phase.month || `Phase ${idx + 1}`}
                                  </span>
                                  <div className="h-px flex-1 bg-white/5" />
                                </div>
                                
                                <div className="space-y-1">
                                  <h3 className="text-2xl font-bold text-white font-big-shoulders tracking-widest italic leading-none uppercase">
                                    Phase {idx + 1}: {phase.title}
                                  </h3>
                                  <p className="text-lg text-zinc-400 font-inter leading-relaxed">
                                    {phase.objective || phase.outcome}
                                  </p>
                                </div>
                              </div>

                              {/* Workstream Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-2">
                                {/* Column A: Strategic Initiatives */}
                                <div className="space-y-4">
                                  <h4 className="text-[9px] font-bold text-white/20 tracking-[0.2em] border-b border-white/5 pb-2 uppercase">
                                    Strategic initiatives
                                  </h4>
                                  <ul className="space-y-4">
                                    {phase.tactics?.map((tactic: string, tIdx: number) => {
                                      const isTemplate = tactic.toLowerCase().includes('model') || tactic.toLowerCase().includes('architecture') || tactic.toLowerCase().includes('blueprint') || tactic.toLowerCase().includes('system');
                                      
                                      return (
                                        <li key={tIdx} className="flex items-start gap-3 group/item">
                                          <div className="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0 group-hover/item:bg-teal transition-colors" />
                                          <div className="space-y-1">
                                            <span className="text-[13px] text-zinc-400 leading-relaxed font-inter first-letter:uppercase">
                                              {tactic}
                                            </span>
                                            {isTemplate && (
                                              <Badge variant="outline" className="ml-2 border-teal/30 text-teal text-[7px] tracking-widest h-4 px-1 bg-teal/5">
                                                TEMPLATE
                                              </Badge>
                                            )}
                                          </div>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>

                                {/* Column B: Key Deliverables */}
                                <div className="space-y-4">
                                  <h4 className="text-[9px] font-bold text-white/20 tracking-[0.2em] border-b border-white/5 pb-2 uppercase">
                                    Key deliverables
                                  </h4>
                                  <div className="grid grid-cols-1 gap-2">
                                    {(phase.deliverables || []).length > 0 ? (
                                      phase.deliverables.map((deliverable: string, dIdx: number) => {
                                        const isDeployed = project.deliverables?.some((d: any) => 
                                          d.title.toLowerCase().includes(deliverable.toLowerCase()) && 
                                          d.status?.toUpperCase() === 'PUBLISHED'
                                        );

                                        return (
                                          <div key={dIdx} className={cn(
                                            "flex items-center justify-between p-3 rounded border transition-all group/asset",
                                            isDeployed 
                                              ? "bg-teal/5 border-teal/20" 
                                              : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                          )}>
                                            <div className="flex items-center gap-2">
                                              <div className={cn(
                                                "p-1 rounded transition-colors",
                                                isDeployed ? "bg-teal/10 text-teal" : "bg-white/5 text-white/20 group-hover/asset:text-teal"
                                              )}>
                                                <ShieldCheck size={10} />
                                              </div>
                                              <div className="flex flex-col">
                                                <span className={cn(
                                                  "text-[11px] font-bold tracking-tight first-letter:uppercase",
                                                  isDeployed ? "text-teal" : "text-white/60"
                                                )}>
                                                  {deliverable}
                                                </span>
                                                {isDeployed && (
                                                  <span className="text-[7px] font-bold text-teal/40 tracking-widest uppercase">
                                                    Deployment complete
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <div className="text-[10px] text-white/10 font-medium italic py-1">
                                        Artifacts awaiting strategic configuration
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </section>
              </div>

            </div>

            {/* Task 2: Certified Signature Block */}
            <div className="mt-24 pt-12 border-t border-white/5 flex flex-col items-center text-center space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-500 tracking-[0.4em] uppercase">Formal Certification</p>
                <div className="flex items-center justify-center gap-4 text-white">
                  <span className="text-xl font-big-shoulders font-black tracking-widest uppercase italic">
                    CERTIFIED BY: {strategistIdentity?.name || "LUIS GILBERTO"}
                  </span>
                  <span className="text-white/20">//</span>
                  <span className="text-xl font-big-shoulders font-black tracking-widest uppercase italic text-teal">
                    {strategistIdentity?.title || strategistIdentity?.role === 'ADMIN' ? 'MASTER ARCHITECT' : 'STRATEGIST'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-8 text-[8px] text-zinc-700 font-mono tracking-widest uppercase">
                <span>PROTOCOL: StrategyIQ™ v5.7</span>
                <span>AUTHENTICATION: RSA-4096-SHA256</span>
                <span>ARTIFACT_HASH: {project.id.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Pinned Bottom Bar (Artifact Integrity) */}
        <div className="border-t border-white/10 bg-black p-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/20">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-[9px] text-white font-bold tracking-widest">Certified strategy record</p>
              <p className="text-[9px] text-white/40 tracking-widest mt-0.5">Verified intelligence • Master authorization</p>
            </div>
          </div>
          <Button 
            onClick={handleApproveAndDeploy}
            disabled={isDeploying}
            className="bg-teal hover:bg-teal/90 text-black font-bold tracking-widest px-8 h-12 rounded text-xs shadow-none transition-all w-full md:w-auto"
          >
            {isDeploying ? (
              <><RefreshCw size={14} className="mr-2 animate-spin" /> Deploying...</>
            ) : (
              <><ShieldCheck size={14} className="mr-2" /> Approve & Deploy <ChevronRight size={14} className="ml-2" /></>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
