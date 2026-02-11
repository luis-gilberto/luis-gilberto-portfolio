"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { motion } from "framer-motion"
import { 
  Clock, 
  FileText, 
  Send, 
  User, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  FileCode,
  ArrowLeft,
  Rocket,
  ArrowRight,
  Eye,
  Bot,
  ShieldCheck,
  CheckCircle,
  RefreshCw,
  Zap,
  Image as ImageIcon,
  ChevronRight,
  MessageSquare,
  Lock,
  Unlock,
  History,
  Settings,
  Target,
  Flag,
  Library,
  Printer
} from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/components/providers/toast-provider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { EditorialReviewModal } from "@/components/strategy/EditorialReviewModal"
import { MasterRoadmapModal } from "@/components/strategy/MasterRoadmapModal"

interface ProjectWarRoomProps {
  project: any
  currentUser: any
}

const STRATEGY_MODULES = [
  { id: 'gtm', title: 'GTM Strategy', icon: Rocket, color: 'text-teal-400', bg: 'bg-teal-400/10' },
  { id: 'brand', title: 'Brand Position', icon: User, color: 'text-coral', bg: 'bg-coral/10' },
  { id: 'campaign', title: 'Campaign Ops', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'creative', title: 'Creative Dir', icon: FileCode, color: 'text-purple-400', bg: 'bg-purple-400/10' },
]

type WorkspaceMode = 'INTELLIGENCE' | 'VAULT' | 'ROADMAP' | 'COMMS' | 'CONFIG'

export default function ProjectWarRoom({ project, currentUser }: ProjectWarRoomProps) {
  const router = useRouter()
  const { toast } = useToast()
  const params = useParams()
  const urlProjectId = params.id as string

  const getStatusColor = (status: string) => {
    if (!status) return "text-white/30 border-white/10 bg-white/5"
    switch (status.toUpperCase()) {
      case "COMPLETE":
      case "APPROVED":
      case "COMPLETED":
      case "PUBLISHED":
        return "text-teal border-teal/30 bg-teal/10"
      case "PENDING":
      case "IN_PROGRESS":
      case "ACTIVE":
        return "text-coral border-coral/30 bg-coral/10"
      default:
        return "text-white/30 border-white/10 bg-white/5"
    }
  }

  const getAssessmentStatus = (moduleId: string) => {
    const statusField = `${moduleId}Status`
    const projectStatus = project[statusField]
    const session = (project.assessmentSessions || project.client?.assessmentSessions)?.find(
      (s: any) => s.assessmentType === moduleId && 
      ['COMPLETED', 'PUBLISHED', 'MANUAL_REVIEW', 'UNDER_REVIEW'].includes(s.status?.toUpperCase())
    )
    if (projectStatus === 'COMPLETED') {
      return session || { status: 'COMPLETED', assessmentType: moduleId }
    }
    return session
  }

  const handleForceGenerate = (moduleId: string) => {
    router.push(`/strategy-iq/${project.id}/${moduleId}/start`)
  }

  // Task 1: Asset-to-Dimension Mapping
  const getDimensionFromTitle = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes('gtm')) return 'gtm'
    if (t.includes('brand')) return 'brand'
    if (t.includes('campaign')) return 'campaign'
    if (t.includes('creative')) return 'creative'
    return null
  }

  const [mode, setMode] = useState<WorkspaceMode>(currentUser.role === 'CLIENT' ? 'VAULT' : 'INTELLIGENCE')
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(project.messages || [])
  const [isSending, setIsSending] = useState(false)
  const [showPulse, setShowPulse] = useState(false)
  
  // Editorial Review State
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [reviewSession, setReviewSession] = useState<any>(null)
  const [consultantAnalysis, setConsultantAnalysis] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewOnly, setViewModeOnly] = useState(false)
  const [isRevisionMode, setIsRevisionMode] = useState(false)
  const [isGeneratingMaster, setIsGeneratingMaster] = useState(false)
  const [showMasterRoadmap, setShowMasterRoadmap] = useState(false)
  const [activePhaseIndex, setActivePhaseIndex] = useState(0)

  // Strategic Configuration State
  const [businessOKRs, setBusinessOKRs] = useState(project.businessOKRs || "")
  const [strategicConstraints, setStrategicConstraints] = useState(project.strategicConstraints || "")
  const [primaryBusinessGoals, setPrimaryBusinessGoals] = useState(project.primaryBusinessGoals || "")
  const [isSavingConfig, setIsSavingConfig] = useState(false)
  const [isConfigEditing, setIsConfigEditing] = useState(!project.primaryBusinessGoals && !project.businessOKRs && !project.strategicConstraints)

  const handleSaveConfig = async () => {
    setIsSavingConfig(true)
    try {
      const response = await fetch('/api/project/update-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          businessOKRs,
          strategicConstraints,
          primaryBusinessGoals
        })
      })
      if (response.ok) {
        toast("CONFIGURATION SECURED", "Strategic parameters have been updated.", "success")
        setIsConfigEditing(false)
        router.refresh()
      } else {
        toast("SAVE FAILED", "Failed to update strategic parameters.", "error")
      }
    } catch (error) {
      console.error('Error saving config:', error)
      toast("ERROR", "A fatal error occurred during save.", "error")
    } finally {
      setIsSavingConfig(false)
    }
  }

  const publishedSessions = STRATEGY_MODULES.filter(m => {
    const s = getAssessmentStatus(m.id)
    return s && s.status?.toUpperCase() === 'PUBLISHED'
  })

  const isMasterReady = publishedSessions.length === 4

  // Task: Adaptive Synthesis Messaging Logic
  const getSynthesisContent = () => {
    const hasRoadmap = !!project.masterPlan;
    const roadmapData = project.masterPlan as any;
    const completedCount = publishedSessions.length;
    
    if (hasRoadmap) {
      const isMissingCriticalFields = !roadmapData?.executiveSynthesis || !roadmapData?.criticalConstraint;
      
      return {
        title: "Executive alignment",
        description: isMissingCriticalFields 
          ? "Strategic synthesis requires recalibration to populate executive insights and critical constraints."
          : "This is where your inputs were distilled into one clear direction. Your master roadmap is the single source of truth and primary home base for leadership meetings, identifying your single critical constraint.",
        buttonText: isMissingCriticalFields ? "Regenerate executive roadmap" : "View executive roadmap",
        state: 'GENERATED',
        forceRegenerate: isMissingCriticalFields
      };
    }

    if (completedCount < 2) {
      return {
        title: "Strategic convergence",
        description: "This is where individual insights acknowledge they are stronger together. The master roadmap is the bridge between individual insights and a unified execution plan. Complete at least two assessments to initialize the roadmap logic.",
        buttonText: "Initialize roadmap logic",
        state: 'PRE'
      };
    }

    // Partial Completion
    const completedModules = publishedSessions.map(s => STRATEGY_MODULES.find(m => m.id === s.assessmentType)?.title).join(', ');
    const remainingCount = STRATEGY_MODULES.length - completedCount;
    
    return {
      title: "Scope extraction",
      description: `Your roadmap reflects the scope you chose, not a forced framework. We are currently synthesizing the specific inputs from ${completedModules} into a tailored execution plan. ${remainingCount > 0 ? `While you can generate the roadmap with these inputs, completing the remaining ${remainingCount} pillar${remainingCount > 1 ? 's' : ''} will provide a more comprehensive strategic snapshot.` : 'All selected pillars are now ready for final synthesis.'}`,
      buttonText: "Generate master strategic roadmap",
      state: 'PARTIAL'
    };
  };

  const synthesisContent = getSynthesisContent();

  const handleGenerateMaster = async () => {
    if (synthesisContent.state === 'GENERATED' && !synthesisContent.forceRegenerate) {
      setShowMasterRoadmap(true);
      return;
    }
    
    if (!isMasterReady || isGeneratingMaster) return
    setIsGeneratingMaster(true)
    try {
      const response = await fetch('/api/strategy-iq/generate-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id })
      })
      if (response.ok) {
        toast("ROADMAP GENERATED", "The Master Strategic Roadmap has been synthesized and milestones updated.", "success")
        router.refresh()
        setShowMasterRoadmap(true)
      } else {
        const error = await response.json()
        toast("GENERATION FAILED", error.message || "Failed to generate roadmap", "error")
      }
    } catch (error) {
      console.error('Error generating master roadmap:', error)
      toast("ERROR", "A fatal error occurred during synthesis.", "error")
    } finally {
      setIsGeneratingMaster(false)
    }
  }

  const openReview = async (session: any, forceGenerate: boolean = false, readOnly: boolean = false) => {
    setReviewSession(session)
    // Task 1: Initialize with certifiedNarrative, briefSummary, or empty string
    setConsultantAnalysis(session.certifiedNarrative || session.briefSummary || "")
    setViewModeOnly(readOnly)
    setIsRevisionMode(false) // Reset revision mode on open
    setIsReviewOpen(true)
    
    if ((forceGenerate || !session.briefSummary) && !readOnly) {
      handleGenerateNarrative(session.id)
    }

    if (session?.status && ['COMPLETED', 'MANUAL_REVIEW'].includes(session.status.toUpperCase()) && !readOnly) {
      try {
        await fetch('/api/assessment/session/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: session.id, status: 'UNDER_REVIEW' })
        })
      } catch (error) {
        console.error('Error updating session status:', error)
      }
    }
  }

  const handleGenerateNarrative = async (sessionId: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/strategy-iq/generate-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId,
          projectId: urlProjectId || project.id,
          dimension: reviewSession?.assessmentType
        })
      })
      if (response.ok) {
        const data = await response.json()
        setReviewSession((prev: any) => ({
          ...prev,
          briefSummary: data.briefSummary
        }))
      }
    } catch (error) {
      console.error('Error generating narrative:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUnlock = async () => {
    if (!reviewSession || currentUser.role !== 'ADMIN') return
    
    setIsRevisionMode(true)
    setViewModeOnly(false)

    try {
      await fetch('/api/assessment/session/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: reviewSession.id, 
          status: 'UNDER_REVIEW',
          isPublished: false
        })
      })
    } catch (error) {
      console.error('Error unlocking session:', error)
    }
  }

  const handlePublish = async (sessionToPublish?: any, notes?: string) => {
    const session = sessionToPublish || reviewSession
    const projectId = (params.id as string) || project.id
    let dimension = (session?.assessmentType || reviewSession?.assessmentType || "").toLowerCase()

    // Task 1: Capture the "Live" State
    const textareaElement = document.querySelector('textarea[name="certifiedNarrative"]') as HTMLTextAreaElement;
    const rawNotes = notes !== undefined ? notes : (textareaElement?.value || consultantAnalysis);
    
    // Task 4: Data Sanitization (Asset Integrity Check)
    const sanitizedNotes = rawNotes.trim();
    
    // Logic: Strip non-meaningful character strings and check length
    const isRandomNoise = (str: string) => {
      // Simple heuristic: if a string has very few vowels or too many consecutive consonants, it might be noise
      // We only check this for very short strings that aren't clearly structured
      const words = str.split(/\s+/);
      if (words.length < 3 && str.length > 10) {
        const vowels = str.match(/[aeiou]/gi);
        if (!vowels || vowels.length / str.length < 0.1) return true;
      }
      return false;
    };

    if (sanitizedNotes.length < 10 || isRandomNoise(sanitizedNotes)) {
      toast("ASSET INTEGRITY ERROR", "The narrative is too short or contains non-meaningful content.", "error");
      return;
    }

    console.log("SENDING TO API:", { projectId, dimension, certifiedNarrative: sanitizedNotes });
    
    if (!projectId || !dimension) {
      console.error("Context Lost - Fatal Blocker:", { projectId, dimension });
      return;
    }

    if (isPublishing) return
    setIsPublishing(true)

    try {
      const response = await fetch('/api/strategy-iq/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: session?.id, 
          projectId: projectId,
          dimension: dimension,
          certifiedNarrative: sanitizedNotes,
          status: 'PUBLISHED'
        })
      })

      if (response.ok) {
        setIsReviewOpen(false)
        setIsRevisionMode(false)
        
        // Task 4: UI Refresh & Validation (Force dump cache)
        router.refresh()
        
        // Local state sync for immediate feedback
        const result = await response.json()
        setReviewSession(result.updatedData || null)
        
        toast("STRATEGY CERTIFIED", "Narrative published to Partner Vault and localized to project assets.", "success")
        
        // Trigger pulse effect
        setShowPulse(true)
        setTimeout(() => {
          setShowPulse(false)
          // Final fallback to ensure DB sync is visible
          router.refresh()
        }, 2000)
      } else {
        const errorData = await response.json()
        toast("PUBLISHING FAILED", errorData.error || "Unknown error", "error")
      }
    } catch (error) {
      console.error('Error publishing:', error)
    } finally {
      setIsPublishing(false)
    }
  }

  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' })
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, mode])

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return
    setIsSending(true)
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, content: message })
      })
      if (response.ok) {
        const newMessage = await response.json()
        setMessages([...messages, newMessage])
        setMessage("")
        
        // Task 2: Visual Feedback
        setShowPulse(true)
        setTimeout(() => setShowPulse(false), 1000)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-portal-bg overflow-hidden font-inter">
      {/* Task 3: 2-Zone Layout (Stage 75%, Sidecar 25%) */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden h-full">
        
        {/* --- THE STAGE (Cols 1-9, 75%) --- */}
        <div className="col-span-12 lg:col-span-9 flex flex-col overflow-hidden border-r border-white/10 bg-[#0A0A0A]">
          
          {/* V5.7 Simplified Header & TOC */}
          <div className="pt-12 pb-8 px-8 flex flex-col items-center border-b border-white/5">
            {/* Wayfinding (Top Left) */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-12">
              <Link 
                href="/dashboard" 
                className="text-[10px] font-bold text-zinc-500 hover:text-coral tracking-[0.2em] uppercase transition-all flex items-center gap-2 group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to projects
              </Link>

              <Button 
                onClick={() => window.print()}
                className="bg-white/5 hover:bg-white/10 text-white/60 font-bold tracking-widest text-[10px] px-6 h-10 rounded-xl border border-white/10 group print:hidden"
              >
                <Printer size={14} className="mr-2 group-hover:scale-110 transition-transform" />
                PRINT DOSSIER
              </Button>
            </div>

            {/* Project Identity (Centered) */}
            <div className="text-center mb-16">
              <h1 className="text-2xl md:text-3xl font-medium text-zinc-400 tracking-tight font-inter">
                {project.client?.name || 'Partner'} // {project.title}
              </h1>
            </div>

            {/* Workspace TOC (Horizontal Switcher) */}
            <nav className="flex items-center lg:justify-center justify-start gap-8 md:gap-12 overflow-x-auto no-scrollbar w-full pb-2 px-4 lg:px-0">
              {(['INTELLIGENCE', 'VAULT', 'ROADMAP', ...(currentUser.role === 'ADMIN' ? ['CONFIG'] : [])] as WorkspaceMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "relative py-2 text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase transition-all whitespace-nowrap flex-shrink-0",
                    mode === m ? "text-white" : "text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  {m.charAt(0) + m.slice(1).toLowerCase()}
                  {mode === m && (
                    <motion.div 
                      layoutId="toc-underline"
                      className="absolute -bottom-[9px] left-0 right-0 h-[2px] bg-teal" 
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 md:p-16 max-w-5xl mx-auto">
              {/* Intelligence Mode */}
              {mode === 'INTELLIGENCE' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-1 duration-500">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                      <h2 className="text-[11px] font-bold tracking-widest text-white/40">
                        Strategic intelligence pillars
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {STRATEGY_MODULES.map((module) => {
                        const session = getAssessmentStatus(module.id)
                        const isPublished = session?.status?.toUpperCase() === 'PUBLISHED'
                        const isPending = !session
                        
                        return (
                          <div key={module.id} className={cn(
                            "p-8 rounded-xl border border-white/10 bg-white/[0.01] transition-all",
                            isPending && "opacity-40 grayscale"
                          )}>
                            <div className="flex justify-between items-start mb-8">
                              <div className="flex items-center gap-4">
                                <div className={cn("p-2.5 rounded border border-white/10 text-white/40", !isPending && "text-teal border-teal/20")}>
                                  <module.icon size={18} />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-white tracking-tight">{module.title}</h3>
                                  <span className="text-[10px] text-white/20 font-bold tracking-widest">
                                    {session?.status || 'Pending'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              {isPending ? (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleForceGenerate(module.id)}
                                  className="w-full bg-white/5 hover:bg-white/10 text-white/40 border border-white/10 text-[9px] font-bold tracking-widest h-10"
                                >
                                  Initialize
                                </Button>
                              ) : (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => openReview(session, true, currentUser.role !== 'ADMIN')}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 border border-white/10 text-[9px] font-bold tracking-widest h-10"
                                  >
                                    {isPublished ? (currentUser.role === 'ADMIN' ? "Manage brief" : "View brief") : "Review intelligence"}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    onClick={() => openReview(session, false, true)}
                                    className="bg-white/5 hover:bg-white/10 text-white/40 border border-white/10 text-[9px] font-bold tracking-widest h-10 px-4"
                                  >
                                    <Eye size={14} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="pt-16 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-10">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        synthesisContent.state === 'GENERATED' ? "bg-teal" : "bg-coral"
                      )} />
                      <h2 className="text-[11px] font-bold tracking-widest text-white/40 uppercase">
                        Master roadmap synthesis
                      </h2>
                    </div>

                    <div className={cn(
                      "border border-white/10 p-10 rounded-2xl relative overflow-hidden transition-all duration-500",
                      synthesisContent.state === 'PRE' && "opacity-40 grayscale"
                    )}>
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl">
                          <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                            {synthesisContent.title}
                          </h3>
                          <p className="text-sm text-zinc-400 leading-relaxed font-serif italic">
                            {synthesisContent.description}
                          </p>
                        </div>
                        
                        <Button 
                          onClick={handleGenerateMaster}
                          disabled={(synthesisContent.state === 'PRE') || isGeneratingMaster || (currentUser.role !== 'ADMIN' && !project.masterPlan)}
                          className={cn(
                            "h-14 px-10 rounded text-xs font-bold tracking-widest transition-all",
                            (synthesisContent.state !== 'PRE') 
                              ? "bg-coral text-white hover:translate-y-[-1px]" 
                              : "bg-white/5 text-white/20 border border-white/10"
                          )}
                        >
                          {isGeneratingMaster ? "Synthesizing..." : synthesisContent.buttonText}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Task 5: Optimized Vault Mode */}
              {mode === 'VAULT' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-1 duration-500">
                  <div className="flex items-center gap-3 mb-12">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                    <h2 className="text-[11px] font-bold tracking-widest text-white/40 uppercase">
                      Partner vault <span className="text-white/10 ml-2">/ Certified assets</span>
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {project.deliverables && project.deliverables.length > 0 ? project.deliverables.map((asset: any) => {
                      const dimension = getDimensionFromTitle(asset.title)
                      const isStrategyBrief = asset.title.toLowerCase().includes('strategy brief') || asset.type?.toLowerCase().includes('brief')
                      
                      return (
                        <div 
                          key={asset.id} 
                          className="group flex items-center justify-between p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all cursor-pointer"
                          onClick={() => {
                            if (isStrategyBrief && dimension) {
                              const session = getAssessmentStatus(dimension)
                              if (session) openReview(session, false, true)
                            }
                          }}
                        >
                          <div className="flex items-center gap-8">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-teal group-hover:bg-teal/5 transition-all">
                              {asset.type?.toLowerCase().includes('image') ? <ImageIcon size={20} /> : <FileText size={20} />}
                            </div>
                            
                            <div className="space-y-1">
                              <h3 className="text-lg font-bold text-white group-hover:text-teal transition-colors">
                                {asset.title}
                              </h3>
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] text-white/20 font-bold tracking-widest uppercase">
                                  {asset.type || 'Document'}
                                </span>
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <span className="text-[10px] text-white/20 font-bold tracking-widest uppercase">
                                  {format(new Date(asset.createdAt), "MMM dd, yyyy")}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-8">
                            <span className={cn(
                              "text-[9px] font-bold tracking-widest px-3 py-1 rounded-full border uppercase",
                              getStatusColor(asset.status)
                            )}>
                              {asset.status}
                            </span>
                            
                            <Button 
                              variant="ghost" 
                              className="text-zinc-500 group-hover:text-white transition-colors p-0 h-auto"
                            >
                              <ArrowRight size={18} />
                            </Button>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="py-32 flex flex-col items-center justify-center text-white/10 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                        <ShieldCheck size={64} strokeWidth={1} className="opacity-20 mb-6" />
                        <p className="text-[11px] font-bold tracking-[0.3em] uppercase opacity-40">Vault initialization pending</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Task 4: Artifact Mode for Roadmap */}
              {mode === 'ROADMAP' && (
                <div className="animate-in fade-in slide-in-from-bottom-1 duration-500">
                  {project.masterPlan ? (
                    <div className="max-w-4xl mx-auto">
                      {/* Vertical Spine */}
                      <div className="relative space-y-0 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
                        {(project.masterPlan as any).phases?.map((phase: any, idx: number) => {
                          const isActive = idx === activePhaseIndex;
                          
                          return (
                            <div key={idx} className="relative pl-12 pb-24 last:pb-0 group border-b border-white/5 last:border-0 pt-12 first:pt-0">
                              {/* Status Dot */}
                              <div className={cn(
                                "absolute left-[3px] top-[52px] first:top-2 w-2 h-2 rounded-full z-10 border-2 border-black transition-all",
                                isActive ? "bg-teal scale-110" : "bg-zinc-800"
                              )} />
                              
                              <div className="space-y-12">
                                {/* Header Section */}
                                <div className="space-y-4">
                                  <span className="text-[10px] font-bold text-zinc-500 tracking-[0.4em] uppercase">
                                    {phase.month || `Month ${idx + 1}`}
                                  </span>
                                  
                                  <div className="space-y-2">
                                    <h3 className="text-3xl font-bold text-white font-big-shoulders tracking-widest italic leading-none">
                                      Phase {idx + 1}: {phase.title}
                                    </h3>
                                    <p className="text-xl text-zinc-400 font-serif italic leading-relaxed">
                                      {phase.objective || phase.outcome}
                                    </p>
                                  </div>
                                </div>

                                {/* Executive Synthesis & Strategic Bottleneck (The Stack) */}
                                {idx === 0 && (
                                  <div className="space-y-12 py-8">
                                    {/* Executive Synthesis */}
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-1 h-1 rounded-full bg-teal" />
                                        <h4 className="text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase">Executive synthesis</h4>
                                      </div>
                                      <div className="prose prose-invert max-w-none text-zinc-300 text-base md:text-lg leading-relaxed font-serif italic whitespace-pre-wrap prose-strong:text-white prose-strong:font-bold prose-p:mb-4 prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-2 prose-li:pl-2 prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:space-y-2 prose-li:marker:text-teal">
                                        <ReactMarkdown>
                                          {((project.masterPlan as any).executiveSynthesis || "Finalizing strategic narrative based on active configuration...")}
                                        </ReactMarkdown>
                                      </div>
                                    </div>

                                    {/* Strategic Bottleneck Card */}
                                    <div className="p-8 border-l-2 border-coral/50 bg-white/[0.01] space-y-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-1 h-1 rounded-full bg-coral" />
                                        <h4 className="text-[10px] font-bold text-coral/60 tracking-[0.2em] uppercase">Strategic bottleneck</h4>
                                      </div>
                                      <div className="prose prose-invert max-w-none text-white text-xl font-normal leading-tight font-inter max-w-2xl prose-strong:text-white prose-p:mb-0">
                                        <ReactMarkdown>
                                          {(project.masterPlan as any).criticalConstraint || "Awaiting strategic configuration"}
                                        </ReactMarkdown>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Workstream Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8">
                                  {/* Column A: Strategic Initiatives */}
                                  <div className="space-y-6">
                                    <h4 className="text-[10px] font-bold text-white/20 tracking-[0.2em] border-b border-white/5 pb-2">
                                      Strategic initiatives
                                    </h4>
                                    <ul className="space-y-5">
                                      {phase.tactics?.map((tactic: string, tIdx: number) => {
                                        // Check if tactic is tied to an artifact (heuristic: check if tactic name contains keywords or matches library)
                                        const isTemplate = tactic.toLowerCase().includes('model') || tactic.toLowerCase().includes('architecture') || tactic.toLowerCase().includes('blueprint') || tactic.toLowerCase().includes('system');
                                        
                                        return (
                                          <li key={tIdx} className="flex items-start gap-4 group/item">
                                            <div className="w-1 h-1 rounded-full bg-zinc-700 mt-2.5 shrink-0 group-hover/item:bg-teal transition-colors" />
                                            <div className="space-y-1">
                                              <span className="text-[14px] text-zinc-400 leading-relaxed font-inter first-letter:uppercase">
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
                                  <div className="space-y-6">
                                    <h4 className="text-[10px] font-bold text-white/20 tracking-[0.2em] border-b border-white/5 pb-2">
                                      Key deliverables
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                      {(phase.deliverables || []).length > 0 ? (
                                        phase.deliverables.map((deliverable: string, dIdx: number) => {
                                          // Check if deployment is complete (file exists in vault with matching title)
                                          const isDeployed = project.deliverables?.some((d: any) => 
                                            d.title.toLowerCase().includes(deliverable.toLowerCase()) && 
                                            d.status?.toUpperCase() === 'PUBLISHED'
                                          );

                                          return (
                                            <div key={dIdx} className={cn(
                                              "flex items-center justify-between p-4 rounded border transition-all group/asset",
                                              isDeployed 
                                                ? "bg-teal/5 border-teal/20" 
                                                : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                            )}>
                                              <div className="flex items-center gap-3">
                                                <div className={cn(
                                                  "p-1.5 rounded transition-colors",
                                                  isDeployed ? "bg-teal/10 text-teal" : "bg-white/5 text-white/20 group-hover/asset:text-teal"
                                                )}>
                                                  <ShieldCheck size={12} />
                                                </div>
                                                <div className="flex flex-col">
                                                  <span className={cn(
                                                    "text-[12px] font-bold tracking-tight first-letter:uppercase",
                                                    isDeployed ? "text-teal" : "text-white/60"
                                                  )}>
                                                    {deliverable}
                                                  </span>
                                                  {isDeployed && (
                                                    <span className="text-[8px] font-bold text-teal/40 tracking-widest uppercase mt-0.5">
                                                      Deployment complete
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                              <ArrowRight size={12} className={cn(
                                                "transition-all",
                                                isDeployed ? "text-teal" : "text-white/10 group-hover/asset:text-white/40 group-hover/asset:translate-x-1"
                                              )} />
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div className="text-[11px] text-white/10 font-medium italic py-2">
                                          Artifacts awaiting strategic configuration
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="py-32 flex flex-col items-center justify-center border border-white/10 border-dashed rounded-2xl text-white/10">
                      <ShieldCheck size={48} strokeWidth={1} />
                      <p className="mt-4 text-[10px] font-bold tracking-widest uppercase">
                        Awaiting strategic configuration
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Strategic Configuration Mode (Admin Only) */}
              {mode === 'CONFIG' && currentUser.role === 'ADMIN' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-1 duration-500 max-w-4xl">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-coral" />
                        <h2 className="text-[11px] font-bold tracking-widest text-white/40 uppercase">
                          Discovery wrap-up
                        </h2>
                      </div>
                      {!isConfigEditing && (
                        <Button 
                          variant="ghost" 
                          onClick={() => setIsConfigEditing(true)}
                          className="text-[10px] font-bold text-teal hover:text-teal/80 tracking-widest uppercase transition-all"
                        >
                          Edit Configuration
                        </Button>
                      )}
                    </div>
                    <h3 className="text-3xl font-bold text-white font-big-shoulders tracking-widest italic">
                      Strategic configuration
                    </h3>
                    <p className="text-zinc-500 text-sm font-inter leading-relaxed max-w-2xl">
                      {isConfigEditing 
                        ? "Operationalize the discovery intelligence by defining the primary constraints and targets. This configuration feeds the StrategyIQ™ synthesis engine."
                        : "Strategic parameters locked for synthesis. These values drive the Master Strategic Roadmap and AI-driven diagnosis."
                      }
                    </p>
                  </div>

                  {isConfigEditing ? (
                    <div className="grid grid-cols-1 gap-12">
                      {/* Primary Goals */}
                      <div className="space-y-6 p-8 rounded-2xl border border-white/10 bg-white/[0.01]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded bg-white/5 text-white/40">
                              <Flag size={20} />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-white">Primary Business Goals</h4>
                              <p className="text-[10px] text-white/20 font-bold tracking-widest uppercase">Long-term vision</p>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-zinc-600">**bold** · *italic* · - bullet · 1. list</span>
                        </div>
                        <Textarea 
                          value={primaryBusinessGoals}
                          onChange={(e) => setPrimaryBusinessGoals(e.target.value)}
                          placeholder="Define the 12-24 month objective..."
                          className="bg-black/40 border-white/10 rounded-xl min-h-[120px] text-zinc-300 font-mono text-sm leading-relaxed focus:border-white/30 transition-all whitespace-pre-wrap"
                        />
                      </div>

                      {/* OKRs */}
                      <div className="space-y-6 p-8 rounded-2xl border border-white/10 bg-white/[0.01]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded bg-white/5 text-white/40">
                              <Target size={20} />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-white">Business OKRs</h4>
                              <p className="text-[10px] text-white/20 font-bold tracking-widest uppercase">Measurable targets</p>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-zinc-600">**bold** · *italic* · - bullet · 1. list</span>
                        </div>
                        <Textarea 
                          value={businessOKRs}
                          onChange={(e) => setBusinessOKRs(e.target.value)}
                          placeholder="Key Results for the next 90 days (e.g., 20% increase in pipeline)..."
                          className="bg-black/40 border-white/10 rounded-xl min-h-[120px] text-zinc-300 font-mono text-sm leading-relaxed focus:border-white/30 transition-all whitespace-pre-wrap"
                        />
                      </div>

                      {/* Constraints */}
                      <div className="space-y-6 p-8 rounded-2xl border border-white/10 bg-white/[0.01]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded bg-white/5 text-white/40">
                              <AlertCircle size={20} />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-white">Strategic Constraints</h4>
                              <p className="text-[10px] text-white/20 font-bold tracking-widest uppercase">The bottlenecks</p>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-zinc-600">**bold** · *italic* · - bullet · 1. list</span>
                        </div>
                        <Textarea 
                          value={strategicConstraints}
                          onChange={(e) => setStrategicConstraints(e.target.value)}
                          placeholder="What is currently preventing these goals from being met?"
                          className="bg-black/40 border-white/10 rounded-xl min-h-[120px] text-zinc-300 font-mono text-sm leading-relaxed focus:border-white/30 transition-all whitespace-pre-wrap"
                        />
                      </div>

                      <div className="flex justify-between items-center pt-8 border-t border-white/5">
                        <div className="text-[9px] text-white/10 font-mono tracking-widest uppercase">
                          System Ref: {project.id.toUpperCase()}
                        </div>
                        <Button 
                          onClick={handleSaveConfig}
                          disabled={isSavingConfig}
                          className="h-14 px-12 bg-coral hover:bg-coral/90 text-white font-bold tracking-widest rounded-xl transition-all shadow-xl"
                        >
                          {isSavingConfig ? <RefreshCw className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" />}
                          Save strategic configuration
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-12">
                      {/* Editorial Document View */}
                      <div className="space-y-16 md:space-y-24">
                        <section className="space-y-6 md:space-y-8">
                          <div className="flex items-center gap-4">
                            <Flag size={16} className="text-zinc-600" />
                            <h4 className="text-[10px] font-bold text-white/20 tracking-[0.4em] uppercase">The Vision // Primary Goals</h4>
                          </div>
                          <div className="prose prose-invert max-w-none text-zinc-300 text-xl md:text-2xl leading-relaxed font-serif italic max-w-3xl whitespace-pre-wrap prose-strong:text-white prose-strong:font-bold prose-p:mb-4 prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-2 prose-li:pl-2 prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:space-y-2 prose-li:marker:text-teal">
                            <ReactMarkdown>
                              {primaryBusinessGoals || "No goals defined."}
                            </ReactMarkdown>
                          </div>
                        </section>

                        <section className="space-y-6 md:space-y-8">
                          <div className="flex items-center gap-4">
                            <Target size={16} className="text-zinc-600" />
                            <h4 className="text-[10px] font-bold text-white/20 tracking-[0.4em] uppercase">The Targets // OKRs</h4>
                          </div>
                          <div className="prose prose-invert max-w-none text-zinc-400 text-base md:text-lg leading-relaxed font-inter max-w-3xl whitespace-pre-wrap prose-strong:text-white prose-strong:font-bold prose-p:mb-4 prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-2 prose-li:pl-2 prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:space-y-2 prose-li:marker:text-teal">
                            <ReactMarkdown>
                              {businessOKRs || "No OKRs defined."}
                            </ReactMarkdown>
                          </div>
                        </section>

                        <section className="space-y-6 md:space-y-8 p-8 md:p-12 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-5">
                            <AlertCircle size={120} className="hidden md:block" />
                          </div>
                          <div className="flex items-center gap-4">
                            <AlertCircle size={16} className="text-coral/40" />
                            <h4 className="text-[10px] font-bold text-coral/40 tracking-[0.4em] uppercase">The Resistance // Constraints</h4>
                          </div>
                          <div className="prose prose-invert max-w-none text-white text-lg md:text-xl font-bold leading-tight font-inter max-w-2xl relative z-10 prose-strong:text-white prose-p:mb-0">
                            <ReactMarkdown>
                              {strategicConstraints || "No constraints identified."}
                            </ReactMarkdown>
                          </div>
                        </section>
                      </div>

                      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row gap-6 justify-between items-center">
                        <div className="text-[9px] text-white/10 font-mono tracking-widest uppercase text-center md:text-left">
                          Last Updated: {format(new Date(project.updatedAt), "MMMM dd, yyyy")}
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => setIsConfigEditing(true)}
                          className="border-white/10 text-white/40 hover:text-white text-[10px] font-bold tracking-widest uppercase h-12 md:h-10 px-8 md:px-6 w-full md:w-auto rounded-xl"
                        >
                          Modify Brief
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Technical Footer (Global to Stage) */}
              <div className="mt-32 pt-8 border-t border-white/5 flex justify-center">
                <span className="text-[9px] text-white/5 font-mono tracking-[0.3em] uppercase">
                  Project System ID: {project.id.toUpperCase()} // V5.7 Standard Active
                </span>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* --- THE SIDECAR (Cols 10-12, 25%) --- */}
        <div className="hidden lg:flex col-span-3 flex-col bg-black overflow-hidden">
          
          {/* Messaging / Comm Link */}
          <div className="flex-1 flex flex-col overflow-hidden border-b border-white/10">
            <div className="h-16 flex items-center px-6 border-b border-white/10 gap-3">
              <MessageSquare size={16} className="text-white/20" />
              <h3 className="text-[10px] font-bold tracking-widest text-white/40">Comm link</h3>
            </div>
            
            <ScrollArea ref={scrollRef} className="flex-1 px-6">
              <div className="flex flex-col gap-6 py-8">
                {messages.map((msg: any) => {
                  const isStrategist = msg.sender?.role === 'ADMIN' || msg.sender?.role === 'TEAM_MEMBER';
                  const label = isStrategist ? 'STRATEGIST' : 'PARTNER';
                  
                  return (
                    <div key={msg.id} className={cn("flex flex-col gap-2", msg.senderId === currentUser.id ? "items-end" : "items-start")}>
                      <div className="flex items-center gap-3 px-1">
                        <span className={cn(
                          "text-[8px] font-bold tracking-widest",
                          isStrategist ? "text-teal" : "text-white/20"
                        )}>
                          {label}
                        </span>
                        <span className="text-[8px] text-white/10 font-mono">{format(new Date(msg.createdAt), "HH:mm")}</span>
                      </div>
                      <div className={cn(
                        "max-w-[90%] px-4 py-3 rounded text-[13px] leading-relaxed",
                        msg.senderId === currentUser.id 
                          ? "bg-white/5 text-white border border-white/10" 
                          : "bg-white/[0.02] text-white/60 border border-white/5"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="p-6 bg-white/[0.01] border-t border-white/10">
              <div className="relative">
                <Input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Transmit..."
                  className="bg-transparent border-white/10 rounded-none h-12 pl-4 pr-12 text-[10px] font-bold tracking-widest text-white focus:border-white/30 transition-all placeholder:text-white/10"
                />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage} 
                  disabled={isSending}
                  className="absolute right-0 top-0 w-12 h-12 rounded-none bg-transparent hover:bg-white/5 text-white/20 hover:text-white"
                >
                  {isSending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                </Button>
              </div>
            </div>
          </div>

          {/* Next Up / Milestone */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock size={14} className="text-white/20" />
              <h3 className="text-[10px] font-bold tracking-widest text-white/40">Next milestone</h3>
            </div>
            {project.milestones?.[0] ? (
              <div className="p-6 border border-white/10 rounded-lg bg-white/[0.01]">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-bold text-teal tracking-widest">
                    {format(new Date(project.milestones[0].date), "MMM dd")}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-white/90 leading-tight">{project.milestones[0].title}</h4>
              </div>
            ) : (
              <div className="text-[10px] text-white/10 font-bold tracking-widest italic">No upcoming records</div>
            )}
          </div>
        </div>
      </div>

      {/* Editorial Review Modal */}
      <EditorialReviewModal 
        isOpen={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        reviewSession={reviewSession}
        currentUser={currentUser}
        project={project}
        consultantAnalysis={consultantAnalysis}
        setConsultantAnalysis={setConsultantAnalysis}
        isRevisionMode={isRevisionMode}
        setIsRevisionMode={setIsRevisionMode}
        viewOnly={viewOnly}
        setViewModeOnly={setViewModeOnly}
        isGenerating={isGenerating}
        isPublishing={isPublishing}
        handleUnlock={handleUnlock}
        handlePublish={handlePublish}
      />

      <MasterRoadmapModal 
        isOpen={showMasterRoadmap}
        onOpenChange={setShowMasterRoadmap}
        project={project}
      />
    </div>
  )
}
