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
  Zap
} from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useRouter, useParams } from "next/navigation"
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

export default function ProjectWarRoom({ project, currentUser }: ProjectWarRoomProps) {
  const router = useRouter()
  const params = useParams()
  const urlProjectId = params.id as string
  const timelineRef = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(project.messages)
  const [isSending, setIsSending] = useState(false)
  
  // Editorial Review State
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [reviewSession, setReviewSession] = useState<any>(null)
  const [consultantAnalysis, setConsultantAnalysis] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewOnly, setViewModeOnly] = useState(false)

  const openReview = async (session: any, forceGenerate: boolean = false, readOnly: boolean = false) => {
    setReviewSession(session)
    setConsultantAnalysis(session.consultantAnalysis || "")
    setViewModeOnly(readOnly)
    setIsReviewOpen(true)
    
    // Auto-trigger generation if briefSummary is missing and it's not viewOnly
    if ((forceGenerate || !session.briefSummary) && !readOnly) {
      handleGenerateNarrative(session.id)
    }

    // Transition to UNDER_REVIEW if it's currently COMPLETED or MANUAL_REVIEW
    if (['COMPLETED', 'MANUAL_REVIEW'].includes(session.status.toUpperCase()) && !readOnly) {
      try {
        await fetch('/api/assessment/session/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: session.id, status: 'UNDER_REVIEW' })
        })
        // No need to refresh immediately, let the user edit
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
      } else {
        const errorData = await response.json()
        console.error('Generation failed:', errorData)
        // Show fallback in UI even if API failed but we have local data?
        // For now, just stop the spinner
      }
    } catch (error) {
      console.error('Error generating narrative:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = async (sessionToPublish?: any, notes?: string) => {
    const session = sessionToPublish || reviewSession
    const finalNotes = notes !== undefined ? notes : consultantAnalysis
    const dimension = session?.assessmentType
    const projectId = urlProjectId || project.id
    
    if (!session || !dimension || isPublishing) return

    // X-Ray Debug (Requested)
    console.log("DEBUG PAYLOAD:", { projectId, dimension, certifiedNarrative: finalNotes });
    alert("CHECK CONSOLE: " + JSON.stringify({ projectId, dimension }));

    // Verification Alert requested by user
    alert("Sending: " + projectId + " " + dimension);

    // Payload Verification
    console.log("Publishing Payload:", { 
      sessionId: session.id,
      projectId: projectId,
      dimension: dimension,
      consultantAnalysis: finalNotes,
      certifiedNarrative: finalNotes
    })

    setIsPublishing(true)
    try {
      const response = await fetch('/api/strategy-iq/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: session.id, 
          projectId: projectId,
          dimension: dimension,
          consultantAnalysis: finalNotes,
          certifiedNarrative: finalNotes, // The Admin's edit becomes the certified narrative
          isPublished: true
        })
      })
      if (response.ok) {
        setIsReviewOpen(false)
        alert("Success: Brief Published to Vault")
        router.refresh()
      } else {
        const errorData = await response.json()
        alert(`Publishing failed. Please ensure the database connection is active. (${errorData.error || 'Unknown error'})`)
      }
    } catch (error) {
      console.error('Error publishing:', error)
      alert("Publishing failed. Please ensure the database connection is active.")
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
  useEffect(() => {
    if (timelineRef.current) {
      const events = timelineRef.current.querySelectorAll(".timeline-event")
      gsap.fromTo(
        events,
        { opacity: 0, x: -50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8, 
          stagger: 0.2, 
          ease: "power3.out" 
        }
      )
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETE":
      case "APPROVED":
      case "COMPLETED":
        return "text-teal-400 border-teal-400/30 bg-teal-400/10"
      case "PENDING":
      case "IN_PROGRESS":
      case "ACTIVE":
        return "text-coral border-coral/30 bg-coral/10"
      case "IN_REVIEW":
        return "text-white/50 border-white/20 bg-white/5"
      default:
        return "text-white/30 border-white/10 bg-white/5"
    }
  }

  // Helper to find assessment status
  const getAssessmentStatus = (moduleId: string) => {
    // Priority 1: Check the new Project status fields
    const statusField = `${moduleId}Status`
    const projectStatus = project[statusField]
    
    // Priority 2: Check the actual session data (Check both direct project relation and client relation)
    const session = (project.assessmentSessions || project.client?.assessmentSessions)?.find(
      (s: any) => s.assessmentType === moduleId && 
      ['COMPLETED', 'PUBLISHED', 'MANUAL_REVIEW', 'UNDER_REVIEW'].includes(s.status.toUpperCase())
    )
    
    // If project status is COMPLETED, we treat it as active even if session isn't found in current payload
    if (projectStatus === 'COMPLETED') {
      return session || { status: 'COMPLETED', assessmentType: moduleId }
    }
    
    return session
  }

  const [isRegenerating, setIsRegenerating] = useState<string | null>(null)

  const handleRegenerate = async (sessionId: string, moduleId: string) => {
    setIsRegenerating(moduleId)
    try {
      const response = await fetch(`/api/strategy-iq/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      
      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error regenerating narrative:', error)
    } finally {
      setIsRegenerating(null)
    }
  }

  const handleForceGenerate = async (moduleId: string) => {
    router.push(`/strategy-iq/${project.id}/${moduleId}/start`)
  }

  return (
    <div className="flex flex-col h-screen bg-portal-bg overflow-hidden font-inter">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-portal-bg/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="rounded-full w-10 h-10 p-0 text-white/40 hover:text-coral hover:bg-coral/5 transition-all"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-big-shoulders font-bold tracking-widest text-white uppercase italic">
                {project.title}
              </h1>
              <Badge className={`rounded-full px-3 py-0.5 text-[10px] font-bold tracking-tighter uppercase ${getStatusColor(project.status)}`}>
                {project.status}
              </Badge>
            </div>
            <p className="text-xs text-white/40 tracking-wider">
              CLIENT: <span className="text-white/80 font-medium uppercase tracking-widest">{project.client?.name || "N/A"}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-portal-bg bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/60 ring-1 ring-white/10">
                U{i}
              </div>
            ))}
          </div>
          <Button className="rounded-full bg-coral hover:bg-coral/90 text-white font-bold px-6 py-2 transition-all">
            MANAGE SCOPE
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden p-8 gap-8">
        {/* Column 0: Strategy Intelligence */}
        <section className="w-1/4 flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal" />
            <h2 className="text-sm font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
              STRATEGIC INTELLIGENCE <span className="text-white/20 ml-2">/ MODULES</span>
            </h2>
          </div>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {STRATEGY_MODULES.map((module) => {
                const session = getAssessmentStatus(module.id)
                const isCompleted = !!session

                return (
                  <Card key={module.id} className="bg-white/5 border-white/10 p-5 rounded-xl group hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg ${module.bg} ${module.color}`}>
                        <module.icon size={18} />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className={`text-[9px] tracking-widest uppercase ${
                          isCompleted 
                            ? (['MANUAL_REVIEW', 'UNDER_REVIEW'].includes(session.status.toUpperCase()) ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-teal-500/30 text-teal-400 bg-teal-500/10')
                            : 'border-white/10 text-white/30'
                        }`}>
                          {isCompleted ? (['MANUAL_REVIEW', 'UNDER_REVIEW'].includes(session.status.toUpperCase()) ? (session.status === 'UNDER_REVIEW' ? 'Reviewing' : 'Review Needed') : 'Active') : 'Pending'}
                        </Badge>
                        {isCompleted && session.isPublished && (
                          <Badge variant="outline" className="text-[7px] tracking-tighter uppercase border-teal-500/50 text-teal-400">
                            Published
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-bold text-white mb-1">{module.title}</h3>
                    <p className="text-[10px] text-white/40 mb-4 leading-relaxed">
                      {isCompleted 
                        ? (session.isPublished ? "Narrative live in Partner Vault." : "Diagnostic complete. Awaiting review.") 
                        : "No intelligence data found for this vector."}
                    </p>

                    {isCompleted ? (
                      <div className="space-y-2">
                        {session.status === 'PUBLISHED' ? (
                          <div className="flex items-center gap-2 text-teal bg-teal/5 border border-teal/20 p-2 rounded-lg justify-center">
                            <CheckCircle size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Live in Vault</span>
                          </div>
                        ) : (
                          <>
                            <Button 
                              size="sm"
                              onClick={() => openReview(session, true, false)}
                              className="w-full bg-coral/10 hover:bg-coral/20 text-coral border border-coral/20 text-[10px] font-bold tracking-widest uppercase h-8"
                            >
                              <Zap className="mr-2 h-3 w-3" /> {session.status === 'UNDER_REVIEW' ? 'Continue Mini-Brief' : 'Generate Mini-Brief'}
                            </Button>
                            
                            <Button 
                              size="sm"
                              onClick={() => openReview(session, false, true)}
                              className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[10px] font-bold tracking-widest uppercase h-8"
                            >
                              <Eye className="mr-2 h-3 w-3" /> View Data
                            </Button>
                          </>
                        )}
                      </div>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => handleForceGenerate(module.id)}
                        className="w-full bg-coral/10 hover:bg-coral/20 text-coral border border-coral/20 text-[10px] font-bold tracking-widest uppercase h-8"
                      >
                        <Bot className="mr-2 h-3 w-3" /> Initialize Assessment
                      </Button>
                    )}
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </section>

        {/* Column 1: The Pulse (Timeline) */}
        <section className="w-1/4 flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal" />
            <h2 className="text-sm font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
              THE PULSE <span className="text-white/20 ml-2">/ TIMELINE</span>
            </h2>
          </div>
          
          <ScrollArea className="flex-1 pr-4">
            <div ref={timelineRef} className="relative pl-6 border-l border-teal/20 space-y-10 py-4">
              {project.timelineEvents.map((event: any, idx: number) => (
                <div key={event.id} className="timeline-event relative">
                  <div className="absolute -left-[31px] top-1.5 w-2 h-2 rounded-full bg-teal ring-4 ring-portal-bg" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-teal tracking-widest uppercase">
                      {format(new Date(event.date), "MMM dd, yyyy")}
                    </span>
                    <h3 className="text-sm font-medium text-white/90 leading-tight">
                      {event.description}
                    </h3>
                    <span className="text-[10px] text-white/30 uppercase tracking-tighter">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
              {project.timelineEvents.length === 0 && (
                <div className="text-white/20 italic text-sm py-4">No events recorded yet.</div>
              )}
            </div>
          </ScrollArea>
        </section>

        {/* Column 2: The Vault (Deliverables) */}
        <section className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-coral" />
              <h2 className="text-sm font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
                THE VAULT <span className="text-white/20 ml-2">/ ASSETS</span>
              </h2>
            </div>
            <Button variant="ghost" className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest p-0">
              VIEW ALL
            </Button>
          </div>

          <ScrollArea className="flex-1 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.deliverables.map((deliverable: any) => (
                <Card 
                  key={deliverable.id} 
                  className="bg-white/5 backdrop-blur-md border-white/10 p-5 rounded-xl hover:bg-white/10 transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-white/5 group-hover:bg-coral/10 transition-colors">
                      <FileCode className="text-white/40 group-hover:text-coral transition-colors" size={24} />
                    </div>
                    <Badge className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-tighter uppercase ${getStatusColor(deliverable.status)}`}>
                      {deliverable.status}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-coral transition-colors line-clamp-1">
                    {deliverable.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-medium">
                    <Calendar size={12} className="text-white/20" />
                    DUE: {deliverable.dueDate ? format(new Date(deliverable.dueDate), "MMM dd") : "TBD"}
                  </div>
                </Card>
              ))}
              {project.deliverables.length === 0 && (
                <div className="col-span-full border-2 border-dashed border-white/5 rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-white/20">
                  <FileText size={48} strokeWidth={1} />
                  <p className="text-sm italic uppercase tracking-widest">The vault is currently empty.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </section>

        {/* Column 3: The Comm Link (Messaging) */}
        <section className="w-1/3 flex flex-col gap-6 overflow-hidden bg-white/2 border-l border-white/5 -mr-8 px-8">
          <div className="flex items-center gap-2 mb-2 pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <h2 className="text-sm font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
              COMM LINK <span className="text-white/20 ml-2">/ CHAT</span>
            </h2>
          </div>

          <ScrollArea className="flex-1 pr-4">
            <div className="flex flex-col gap-6 py-4">
              {messages.map((msg: any) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col gap-2 ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      {msg.sender?.name || "Unknown"}
                    </span>
                    <span className="text-[9px] text-white/20 font-mono">
                      {format(new Date(msg.createdAt), "HH:mm")}
                    </span>
                  </div>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.senderId === currentUser.id 
                      ? 'bg-coral text-white rounded-tr-none font-medium' 
                      : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {project.messages.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 py-20 text-white/10">
                  <Send size={32} strokeWidth={1} />
                  <p className="text-xs italic uppercase tracking-widest">Initialize transmission...</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="pb-4 pt-2">
            <div className="relative group">
              <Input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="TRANSMIT MESSAGE..." 
                className="bg-white/5 border-white/10 rounded-full py-6 pl-6 pr-14 text-xs font-bold tracking-widest text-white focus:border-coral/50 transition-all placeholder:text-white/20"
                disabled={isSending}
              />
              <Button 
                size="sm"
                onClick={handleSendMessage}
                disabled={isSending}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 bg-coral hover:bg-coral/90 text-white p-0"
              >
                {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send size={16} />}
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Editorial Review Room Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-4xl bg-[#0F0F0F] border-white/10 text-white p-0 overflow-hidden">
          <DialogHeader className="p-8 border-b border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-teal/20 text-teal border-none text-[10px] uppercase tracking-widest px-3 py-1">
                Editorial Review
              </Badge>
              <DialogTitle className="text-3xl font-big-shoulders font-bold tracking-widest uppercase italic">
                {reviewSession?.assessmentType.toUpperCase()} Narrative
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/40 font-inter italic">
              Review and finalize the strategic brief for {project.client?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex h-[600px]">
            {/* Left: AI Summary & Scoring (Read Only) */}
            <div className="w-1/2 border-r border-white/5 p-8 overflow-y-auto bg-black/20">
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Draft Intelligence</h4>
                    {isGenerating && (
                      <div className="flex items-center gap-2 text-teal animate-pulse">
                        <RefreshCw size={10} className="animate-spin" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Brain Working...</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {isGenerating ? (
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="h-4 bg-white/5 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }} />
                        ))}
                      </div>
                    ) : (
                      reviewSession?.briefSummary ? (
                        (() => {
                          try {
                            const insights = JSON.parse(reviewSession.briefSummary);
                            if (Array.isArray(insights)) {
                              return insights.map((insight: string, idx: number) => (
                                <p key={idx} className="text-sm text-white/80 leading-relaxed font-serif italic">
                                  "{insight}"
                                </p>
                              ));
                            }
                            return <p className="text-sm text-white/80 leading-relaxed font-serif italic">"{reviewSession.briefSummary}"</p>;
                          } catch (e) {
                            return <p className="text-sm text-white/80 leading-relaxed font-serif italic">"{reviewSession.briefSummary}"</p>;
                          }
                        })()
                      ) : (
                        <p className="text-xs text-white/20 italic">No intelligence data generated yet.</p>
                      )
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Internal Scoring</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-[9px] text-white/20 uppercase tracking-widest mb-1">Intelligence Score</div>
                      <div className="text-2xl font-bold text-teal">{reviewSession?.intelligenceScore}/100</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-[9px] text-white/20 uppercase tracking-widest mb-1">Status</div>
                      <div className="text-xs font-bold text-white uppercase tracking-widest">{reviewSession?.status}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Consultant Analysis (Editable) */}
            <div className="w-1/2 p-8 flex flex-col gap-6">
              <div className="flex-1 flex flex-col gap-4">
                <Label htmlFor="consultant-analysis" className="text-[10px] font-bold text-teal uppercase tracking-[0.2em]">
                  {viewOnly ? 'Published Narrative' : 'Consultant Analysis (Editorial)'}
                </Label>
                {viewOnly ? (
                  <div className="flex-1 bg-white/2 border border-white/5 rounded-xl p-4 text-sm leading-relaxed text-white/80 overflow-y-auto font-serif italic">
                    {reviewSession?.certifiedNarrative || reviewSession?.consultantAnalysis || "No editorial narrative available."}
                  </div>
                ) : (
                  <Textarea 
                    id="consultant-analysis"
                    value={consultantAnalysis}
                    onChange={(e) => setConsultantAnalysis(e.target.value)}
                    placeholder="Refine the AI synthesis into a client-ready narrative... This will be saved as the 'Certified Narrative' in the Vault."
                    className="flex-1 resize-none bg-white/2 border-white/5 focus:border-teal/50 transition-colors p-4 text-sm leading-relaxed"
                  />
                )}
              </div>

              {!viewOnly && (
                <div className="p-6 bg-teal/5 border border-teal/20 rounded-2xl">
                  <div className="flex gap-3 items-start">
                    <ShieldCheck className="text-teal shrink-0" size={20} />
                    <div>
                      <h5 className="text-[11px] font-bold text-white uppercase tracking-wider mb-1">Ready for the Vault?</h5>
                      <p className="text-[10px] text-white/40 leading-relaxed">
                        Publishing will move this into the Partner's Vault as a certified Mini-Brief.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="p-8 border-t border-white/5 bg-black/40">
            <div className="flex-1 flex flex-col items-start gap-1">
              {(!project?.id || !reviewSession?.assessmentType) && !viewOnly && (
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest animate-pulse">
                  Internal Error: Project context missing
                </span>
              )}
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setIsReviewOpen(false)}
              className="text-white/40 hover:text-white uppercase tracking-widest text-[10px] font-bold"
            >
              {viewOnly ? 'Close' : 'Cancel'}
            </Button>
            {!viewOnly && (
              <Button 
                onClick={handlePublish}
                disabled={isPublishing || isGenerating || !project?.id || !reviewSession?.assessmentType}
                className="bg-teal hover:bg-teal/90 text-black uppercase tracking-[0.2em] text-[10px] font-black h-12 px-10 rounded-full ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Finalize & Publish to Partner
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
