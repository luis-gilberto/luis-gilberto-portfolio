"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
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
  History
} from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useRouter, useParams } from "next/navigation"
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
import { EditorialReviewModal } from "@/components/strategy/EditorialReviewModal"

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

type WorkspaceMode = 'INTELLIGENCE' | 'VAULT' | 'ROADMAP' | 'COMMS'

export default function ProjectWarRoom({ project, currentUser }: ProjectWarRoomProps) {
  const router = useRouter()
  const { toast } = useToast()
  const params = useParams()
  const urlProjectId = params.id as string
  const [mode, setMode] = useState<WorkspaceMode>('INTELLIGENCE')
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
    
    // Task 4: Data Sanitization (Noise Filter)
    const sanitizedNotes = rawNotes.trim().replace(/\s+/g, ' ');
    
    // Logic: Strip non-meaningful character strings and check length
    const isRandomNoise = (str: string) => {
      // Simple heuristic: if a string has very few vowels or too many consecutive consonants, it might be noise
      const words = str.split(' ');
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

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return
    setIsSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, content: message })
      })
      if (response.ok) {
        const newMessage = await response.json()
        setMessages([...messages, newMessage])
        setMessage("")
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-portal-bg overflow-hidden font-inter">
      {/* Task 1: Grid Layout (Stage 9/12, Sidecar 3/12) */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden h-full">
        
        {/* --- THE STAGE (Cols 1-9) --- */}
        <div className="col-span-12 lg:col-span-9 flex flex-col overflow-hidden border-r border-white/5">
          
          {/* Task 2: Mode Switcher Bar */}
          <div className="sticky top-0 z-20 h-16 border-b border-white/5 flex items-center px-4 md:px-8 justify-between bg-black/80 backdrop-blur-md">
            <div className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide no-scrollbar">
              {(['INTELLIGENCE', 'VAULT', 'ROADMAP', 'COMMS'] as WorkspaceMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "relative h-16 flex items-center text-[11px] font-black tracking-[0.2em] transition-all font-big-shoulders italic whitespace-nowrap",
                    mode === m ? "text-teal" : "text-white/30 hover:text-white/60",
                    m === 'COMMS' && "lg:hidden" // COMMS is mobile-only tab
                  )}
                >
                  {m}
                  {mode === m && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal shadow-[0_0_10px_rgba(46,211,198,0.5)]" />
                  )}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-4">
               <Badge variant="outline" className="border-white/10 text-white/40 text-[9px] tracking-widest uppercase">
                 Project ID: {project.id.slice(-8).toUpperCase()}
               </Badge>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-8">
              {/* Intelligence Mode */}
              {mode === 'INTELLIGENCE' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {/* ACTIVE / PUBLISHED MODULES */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                      <h2 className="text-xs font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
                        Active Intelligence <span className="text-white/20 ml-2">/ Primary Pillars</span>
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6">
                      {STRATEGY_MODULES.filter(m => {
                        const s = getAssessmentStatus(m.id)
                        return s && s.status && ['PUBLISHED', 'COMPLETED', 'UNDER_REVIEW', 'MANUAL_REVIEW'].includes(s.status.toUpperCase())
                      }).map((module) => {
                        const session = getAssessmentStatus(module.id)
                        const isPublished = session?.status?.toUpperCase() === 'PUBLISHED'
                        
                        return (
                          <Card key={module.id} className="bg-white/5 border-white/10 p-6 rounded-xl group hover:bg-white/10 transition-all">
                            <div className="flex justify-between items-start mb-6">
                              <div className={`p-3 rounded-lg ${module.bg} ${module.color}`}>
                                <module.icon size={20} />
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge variant="outline" className={cn(
                                  "text-[9px] tracking-widest uppercase transition-all duration-500",
                                  getStatusColor(session?.status),
                                  (showPulse && isPublished) && "ring-2 ring-teal shadow-[0_0_15px_rgba(46,211,198,0.5)] scale-110",
                                  "hidden md:inline-flex" // Hide secondary status badge on mobile
                                )}>
                                  {session.status}
                                </Badge>
                                {/* Mobile-only muted status label */}
                                <span className="md:hidden text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                  {session?.status?.toUpperCase() || 'PENDING'}
                                </span>
                              </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 font-big-shoulders tracking-widest uppercase italic">{module.title}</h3>
                            <p className="hidden md:block text-xs text-white/40 mb-6 leading-relaxed">
                              {isPublished ? "Narrative live in Partner Vault." : "Diagnostic complete. Awaiting review."}
                            </p>
                            
                            <div className="flex gap-3">
                              <Button 
                                size="sm" 
                                onClick={() => openReview(session, true, false)}
                                className="flex-1 bg-coral/10 hover:bg-coral/20 text-coral border border-coral/20 text-[10px] font-bold tracking-widest uppercase h-10"
                              >
                                {isPublished ? (
                                  <><History className="mr-2 h-3.5 w-3.5" /> MANAGE BRIEF</>
                                ) : (
                                  <><Zap className="mr-2 h-3.5 w-3.5" /> REVIEW</>
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => openReview(session, false, true)}
                                className="hidden md:flex bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[10px] font-bold tracking-widest uppercase h-10 px-4"
                              >
                                <Eye size={16} />
                              </Button>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>

                  {/* REMAINING / PENDING MODULES */}
                  <div className="space-y-8 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <h2 className="text-xs font-bold tracking-widest text-white/40 uppercase font-big-shoulders italic">
                        Remaining Intelligence <span className="text-white/10 ml-2">/ Inactive Vectors</span>
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6">
                      {STRATEGY_MODULES.filter(m => !getAssessmentStatus(m.id)).map((module) => (
                        <Card key={module.id} className="bg-white/[0.02] border-white/5 p-6 rounded-xl group opacity-60 hover:opacity-100 transition-all">
                          <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-lg bg-white/5 text-white/20 group-hover:bg-white/10 group-hover:text-white/40 transition-colors`}>
                              <module.icon size={20} />
                            </div>
                            <Badge variant="outline" className="text-[9px] tracking-widest uppercase border-white/10 text-white/20 hidden md:inline-flex">
                              Pending
                            </Badge>
                            <span className="md:hidden text-[10px] font-bold text-white/10 uppercase tracking-widest">
                              PENDING
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white/40 group-hover:text-white/60 transition-colors mb-2 font-big-shoulders tracking-widest uppercase italic">{module.title}</h3>
                          <p className="hidden md:block text-xs text-white/20 mb-6 leading-relaxed">
                            No intelligence data found for this vector.
                          </p>
                          <Button 
                            size="sm" 
                            onClick={() => handleForceGenerate(module.id)}
                            className="w-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white border border-white/10 text-[10px] font-bold tracking-widest uppercase h-10"
                          >
                            <Bot className="mr-2 h-3.5 w-3.5" /> INITIALIZE
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Task 3: Expanded Vault Mode */}
              {mode === 'VAULT' && (
                <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-coral/50 md:bg-coral" />
                    <h2 className="text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-widest text-white/40 md:text-white/60 uppercase font-big-shoulders italic">
                      The Vault <span className="text-white/10 md:text-white/20 ml-2">/ Asset List</span>
                    </h2>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    {project.deliverables && project.deliverables.length > 0 ? project.deliverables.map((asset: any) => {
                      const dimension = getDimensionFromTitle(asset.title)
                      const isStrategyBrief = asset.title.toLowerCase().includes('strategy brief') || asset.type?.toLowerCase().includes('brief')
                      
                      return (
                        <div key={asset.id} className="flex items-center justify-between p-3 md:p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all group">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="p-2 md:p-2.5 bg-white/5 rounded-lg text-white/30 md:text-white/40 group-hover:text-coral transition-colors">
                              {asset.type?.toLowerCase().includes('image') ? <ImageIcon size={18} className="md:w-5 md:h-5" /> : <FileText size={18} className="md:w-5 md:h-5" />}
                            </div>
                            <div className="flex flex-col">
                              <h4 className="text-sm font-bold text-white/90 group-hover:text-white leading-tight">{asset.title}</h4>
                              <p className="hidden md:block text-[10px] text-white/20 uppercase tracking-widest mt-0.5">
                                Uploaded {format(new Date(asset.createdAt), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 md:gap-6">
                            <Badge variant="outline" className={cn(
                              "text-[8px] md:text-[9px] tracking-widest uppercase h-5 md:h-6 px-2 md:px-3", 
                              getStatusColor(asset.status)
                            )}>
                              {asset.status}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              onClick={() => {
                                if (isStrategyBrief && dimension) {
                                  const session = getAssessmentStatus(dimension)
                                  if (session) openReview(session, false, true)
                                }
                              }}
                              className="text-white/40 hover:text-white text-[9px] md:text-[10px] font-bold tracking-widest uppercase group/btn border border-white/5 md:border-transparent hover:border-white/10 transition-all px-3 md:px-4 h-7 md:h-8 rounded-lg bg-white/5 md:bg-transparent"
                            >
                              <span className="hidden md:inline">View Details</span>
                              <span className="md:hidden">View</span>
                              <ChevronRight size={12} className="ml-1 group-hover/btn:translate-x-1 transition-transform md:w-3.5 md:h-3.5" />
                            </Button>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-white/10">
                        <ShieldCheck size={48} strokeWidth={1} />
                        <p className="mt-4 text-xs font-bold tracking-widest uppercase">The vault is empty</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Roadmap Mode */}
              {mode === 'ROADMAP' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <h2 className="text-xs font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
                      Strategic Roadmap <span className="text-white/20 ml-2">/ Timeline</span>
                    </h2>
                  </div>
                  <div className="relative pl-8 border-l border-white/5 space-y-12 ml-4">
                    {project.timelineEvents && project.timelineEvents.map((event: any) => (
                      <div key={event.id} className="relative">
                        <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-portal-bg border-2 border-teal shadow-[0_0_10px_rgba(46,211,198,0.3)]" />
                        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black text-teal tracking-[0.2em] uppercase font-mono">
                              {format(new Date(event.date), "dd MMM yyyy")}
                            </span>
                            <Badge className="bg-white/5 text-white/40 border-none text-[8px] tracking-widest uppercase">
                              {event.type}
                            </Badge>
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2">{event.description}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COMMS Mode (Mobile Only) */}
              {mode === 'COMMS' && (
                <div className="lg:hidden flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-coral" />
                    <h2 className="text-xs font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
                      Comm Link <span className="text-white/20 ml-2">/ Direct Transmission</span>
                    </h2>
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden bg-white/[0.02] rounded-2xl border border-white/5">
                    <ScrollArea className="flex-1 px-4">
                      <div className="flex flex-col gap-4 py-6">
                        {messages.map((msg: any) => (
                          <div key={msg.id} className={cn("flex flex-col gap-1.5", msg.senderId === currentUser.id ? "items-end" : "items-start")}>
                            <div className="flex items-center gap-2 px-1">
                              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{msg.sender?.name?.split(' ')[0] || "User"}</span>
                              <span className="text-[8px] text-white/10 font-mono">{format(new Date(msg.createdAt), "HH:mm")}</span>
                            </div>
                            <div className={cn(
                              "max-w-[90%] px-4 py-3 rounded-xl text-[13px] leading-relaxed",
                              msg.senderId === currentUser.id 
                                ? "bg-coral text-white rounded-tr-none shadow-lg shadow-coral/10" 
                                : "bg-white/5 text-white/70 rounded-tl-none border border-white/5"
                            )}>
                              {msg.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-4 bg-black/40 border-t border-white/5">
                      <div className="relative">
                        <Input 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="TRANSMIT..."
                          className="bg-white/5 border-white/10 rounded-full h-11 pl-5 pr-12 text-[11px] font-bold tracking-widest text-white focus:border-coral/50 transition-all placeholder:text-white/10"
                        />
                        <Button 
                          size="icon" 
                          onClick={handleSendMessage} 
                          disabled={isSending}
                          className="absolute right-1 top-1 w-9 h-9 rounded-full bg-coral hover:bg-coral/90 text-white"
                        >
                          {isSending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* --- THE SIDECAR (Cols 10-12) --- */}
        <div className="hidden lg:flex col-span-3 flex-col bg-white/[0.01] overflow-hidden">
          
          {/* Messaging / Comm Link */}
          <div className="flex-1 flex flex-col overflow-hidden border-b border-white/5">
            <div className="h-16 flex items-center px-6 border-b border-white/5 gap-3">
              <MessageSquare size={18} className="text-white/40" />
              <h3 className="text-[11px] font-black tracking-[0.2em] text-white/60 uppercase font-big-shoulders italic">Comm Link</h3>
            </div>
            
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-4 py-6">
                {messages.map((msg: any) => (
                  <div key={msg.id} className={cn("flex flex-col gap-1.5", msg.senderId === currentUser.id ? "items-end" : "items-start")}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{msg.sender?.name?.split(' ')[0] || "User"}</span>
                      <span className="text-[8px] text-white/10 font-mono">{format(new Date(msg.createdAt), "HH:mm")}</span>
                    </div>
                    <div className={cn(
                      "max-w-[90%] px-4 py-3 rounded-xl text-[13px] leading-relaxed",
                      msg.senderId === currentUser.id 
                        ? "bg-coral text-white rounded-tr-none shadow-lg shadow-coral/10" 
                        : "bg-white/5 text-white/70 rounded-tl-none border border-white/5"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 bg-black/20">
              <div className="relative">
                <Input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="TRANSMIT..."
                  className="bg-white/5 border-white/10 rounded-full h-11 pl-5 pr-12 text-[11px] font-bold tracking-widest text-white focus:border-coral/50 transition-all placeholder:text-white/10"
                />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage} 
                  disabled={isSending}
                  className="absolute right-1 top-1 w-9 h-9 rounded-full bg-coral hover:bg-coral/90 text-white"
                >
                  {isSending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                </Button>
              </div>
            </div>
          </div>

          {/* Next Up / Milestone */}
          <div className="p-6 bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={14} className="text-teal" />
              <h3 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase font-big-shoulders italic">Next Milestone</h3>
            </div>
            {project.milestones?.[0] ? (
              <Card className="bg-white/5 border-white/10 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold text-teal tracking-widest uppercase">
                    {format(new Date(project.milestones[0].date), "MMM dd")}
                  </span>
                  <Badge variant="outline" className="border-teal/20 text-teal text-[8px] uppercase tracking-widest px-2">
                    ACTIVE
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-white/90 line-clamp-2 leading-tight">{project.milestones[0].title}</h4>
              </Card>
            ) : (
              <div className="text-[10px] text-white/20 italic">No upcoming milestones.</div>
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
    </div>
  )
}
