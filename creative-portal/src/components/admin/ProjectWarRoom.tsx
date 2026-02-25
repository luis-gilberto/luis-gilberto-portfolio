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
  Printer,
  Layers
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
import { LifecycleTracker } from "@/components/shared/LifecycleTracker"
import { EditorialReviewModal } from "@/components/strategy/EditorialReviewModal"
import { MasterRoadmapModal } from "@/components/strategy/MasterRoadmapModal"
import { HybridStrategicInput } from "@/components/shared/HybridStrategicInput"
import { SealOfAuthority } from "@/components/shared/SealOfAuthority"

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

const STRATEGY_CHANNELS = [
  "Paid Search (Google/Bing)",
  "Paid Social (Meta/LinkedIn)",
  "Organic Social",
  "Email Marketing",
  "Events & Field Marketing",
  "Content Marketing",
  "SEO / Organic Search",
  "Influencer / Affiliate"
]

type WorkspaceMode = 'INTELLIGENCE' | 'VAULT' | 'ROADMAP' | 'COMMS' | 'CONTEXT'

export default function ProjectWarRoom({ project, currentUser }: ProjectWarRoomProps) {
  const router = useRouter()
  const { toast } = useToast()
  const params = useParams()
  const urlProjectId = (params.projectId || params.id) as string

  const getStatusColor = (status: string) => {
    if (!status) return "text-white/30 border-white/10 bg-white/5"
    const s = status.toUpperCase()
    if (s === "CERTIFIED" || s === "READY FOR INTELLIGENCE") return "text-teal border-teal/30 bg-teal/10"
    if (s === "UNDER REVIEW" || s === "CHARTER UNVERIFIED") return "text-amber-500 border-amber-500/30 bg-amber-500/10"
    if (s === "IN PROGRESS") return "text-zinc-500 border-zinc-500/30 bg-zinc-500/10"
    if (s === "PENDING" || s === "INTAKE PENDING") return "text-coral border-coral/30 bg-coral/10"
    return "text-white/30 border-white/10 bg-white/5"
  }

  // Refactored Status Logic
  const getProjectStatusLabel = () => {
    const isConfigEmpty = !project.businessDriver && !project.metricName && !project.primaryBusinessGoals;
    const isConfigPublished = project.status === 'CALIBRATED' || project.status === 'ACTIVE' || project.status === 'CERTIFIED';
    
    if (isConfigEmpty) return "INTAKE PENDING";
    if (isConfigPublished) return "READY FOR INTELLIGENCE";
    return "CHARTER UNVERIFIED";
  }

  const projectStatusLabel = getProjectStatusLabel();

  const getAssessmentStatus = (moduleId: string) => {
    // Priority 1: Check assessmentSessions for latest state
    const sessions = project.assessmentSessions || project.client?.assessmentSessions || []
    const session = sessions.find((s: any) => s.assessmentType.toLowerCase() === moduleId.toLowerCase())
    
    if (!session) return { status: 'PENDING' }

    const s = session.status?.toLowerCase()
    
    // Logic: 
    // IF brief.status === 'draft' -> UI Label: "IN PROGRESS" (Grey)
    // IF brief.status === 'submitted' -> UI Label: "UNDER REVIEW" (Mustard)
    // IF brief.status === 'certified' -> UI Label: "CERTIFIED" (Teal)
    
    if (session.isPublished || s === 'certified' || s === 'published') {
      return { ...session, status: 'CERTIFIED' }
    }
    
    if (s === 'submitted' || s === 'completed' || s === 'under_review' || s === 'manual_review') {
      return { ...session, status: 'UNDER REVIEW' }
    }
    
    if (s === 'draft' || s === 'in_progress' || s === 'in-progress') {
      return { ...session, status: 'IN PROGRESS' }
    }
    
    return { ...session, status: 'PENDING' }
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

  const [mode, setMode] = useState<WorkspaceMode>('CONTEXT')
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
  const [businessGoals, setBusinessGoals] = useState(project.businessGoals || project.primaryBusinessGoals || "")
  const [marketingGoals, setMarketingGoals] = useState(project.marketingGoals || "")
  const [strategicConstraints, setStrategicConstraints] = useState(project.strategicConstraints || "")
  const [marketingHistory, setMarketingHistory] = useState(project.marketingHistory || "")
  
  // Layer I: The Business Mandate State
  const [businessDriver, setBusinessDriver] = useState(project.businessDriver || "")
  const [metricName, setMetricName] = useState(project.metricName || "")
  const [metricTarget, setMetricTarget] = useState(project.metricTarget || "")
  const [metricBaseline, setMetricBaseline] = useState(project.metricBaseline || "")

  // Layer II: The Marketing Mandate State
  const [operationalPriority, setOperationalPriority] = useState(project.operationalPriority || "")
  const [cacCurrent, setCacCurrent] = useState(project.cacCurrent || "")
  const [cacGoal, setCacGoal] = useState(project.cacGoal || "")
  const [ltvCurrent, setLtvCurrent] = useState(project.ltvCurrent || "")
  const [ltvGoal, setLtvGoal] = useState(project.ltvGoal || "")
  const [conversionCurrent, setConversionCurrent] = useState(project.conversionCurrent || "")
  const [conversionGoal, setConversionGoal] = useState(project.conversionGoal || "")
  const [marketingSignal, setMarketingSignal] = useState(project.marketingSignal || "")
  const [marketingNoise, setMarketingNoise] = useState(project.marketingNoise || "")
  const [showMetricSelector, setShowMetricSelector] = useState(false)

  const [selectedChannels, setSelectedChannels] = useState<string[]>(project.channels || [])
  const [isSavingConfig, setIsSavingConfig] = useState(false)
  
  // Task 3: Real-time validation
   const isBusinessGoalsValid = businessGoals.length >= 10 || ["Transition to Enterprise", "Decouple Founder", "Expand Market Share"].some(p => businessGoals.includes(p))
   const isBusinessOKRsValid = businessOKRs.length >= 10 || ["20% Pipeline Lift", "4-Month Sales Cycle", "100% CRM Accuracy"].some(p => businessOKRs.includes(p))
   const isMarketingGoalsValid = marketingGoals.length >= 10 || ["Establish Category Authority", "Microsoft Co-sell Status", "50 High-Intent Downloads"].some(p => marketingGoals.includes(p))
   const isCharterValid = isBusinessGoalsValid && isBusinessOKRsValid && isMarketingGoalsValid && !!businessDriver

  const [isConfigEditing, setIsConfigEditing] = useState(!project.businessGoals && !project.businessOKRs && !project.marketingGoals && !project.strategicConstraints)
  const [isResetting, setIsResetting] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const BUSINESS_DRIVERS = [
    { id: 'Market Capture', title: 'Market Capture', desc: 'Aggressive growth and acquisition.' },
    { id: 'Margin Protection', title: 'Margin Protection', desc: 'Efficiency and cost optimization.' },
    { id: 'Category Expansion', title: 'Category Expansion', desc: 'New markets or product lines.' },
    { id: 'Systemic Stabilization', title: 'Systemic Stabilization', desc: 'Fixing foundational breaks.' },
  ]

  const OPERATIONAL_PRIORITIES = [
    { id: 'Volume Generation', title: 'Volume Generation', desc: 'Increasing raw lead flow.' },
    { id: 'Conversion Velocity', title: 'Conversion Velocity', desc: 'Moving leads through the funnel faster.' },
    { id: 'Narrative Authority', title: 'Narrative Authority', desc: 'Re-establishing market leadership.' },
    { id: 'Retention / LTV', title: 'Retention / LTV', desc: 'Extracting value from the existing base.' }
  ]

  const METRIC_CATEGORIES = [
    {
      name: "Financial Performance",
      metrics: ["ARR (Annual Recurring Revenue)", "MRR (Monthly Recurring Revenue)", "Net Profit Margin", "Gross Revenue"]
    },
    {
      name: "Unit Economics",
      metrics: ["LTV (Customer Lifetime Value)", "CAC (Customer Acquisition Cost)", "LTV:CAC Ratio", "Payback Period (Months)"]
    },
    {
      name: "Market Momentum",
      metrics: ["Market Share %", "Active Users (MAU/WAU)", "Customer Retention Rate %", "Churn Rate %"]
    },
    {
      name: "Sales & Pipeline",
      metrics: ["Total Pipeline Value", "Sales Velocity", "Win Rate %", "Average Contract Value (ACV)"]
    }
  ]

  const getLift = () => {
    const t = parseFloat(metricTarget.toString().replace(/,/g, ''))
    const b = parseFloat(metricBaseline.toString().replace(/,/g, ''))
    if (isNaN(t) || isNaN(b) || b === 0) return null
    const lift = ((t - b) / b) * 100
    const prefix = lift > 0 ? "+" : ""
    return `${prefix}${lift.toFixed(1)}% LIFT IN ${metricName ? metricName.split('(')[0].trim().toUpperCase() : 'METRIC'}`
  }

  const getGap = (current: string, goal: string, type: 'LOWER_BETTER' | 'HIGHER_BETTER') => {
    const c = parseFloat(current.toString().replace(/,/g, ''))
    const g = parseFloat(goal.toString().replace(/,/g, ''))
    if (isNaN(c) || isNaN(g) || c === 0) return null
    
    const gap = ((g - c) / c) * 100
    
    if (type === 'LOWER_BETTER') {
      // Goal < Current is GOOD (negative gap is improvement)
      const isImprovement = g < c
      return { val: `${gap > 0 ? '+' : ''}${gap.toFixed(1)}%`, isGood: isImprovement, label: isImprovement ? 'REDUCTION' : 'INCREASE' }
    } else {
      // Goal > Current is GOOD (positive gap is improvement)
      const isImprovement = g > c
      return { val: `${gap > 0 ? '+' : ''}${gap.toFixed(1)}%`, isGood: isImprovement, label: isImprovement ? 'LIFT' : 'DROP' }
    }
  }
  
  const calculatedLift = getLift()
  
  // Audit / Archive State
  const [archivedMessages, setArchivedMessages] = useState<any[]>([])
  const [showArchiveResetConfirm, setShowArchiveResetConfirm] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)

  const handleArchiveReset = async () => {
    setIsArchiving(true)
    try {
      const response = await fetch('/api/messages/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id })
      })
      
      if (response.ok) {
        toast("STRATEGIC ARCHIVE SECURED", "Transmission log has been moved to the Vault.", "success")
        setMessages([]) // Clear local active messages
        setShowArchiveResetConfirm(false)
        router.refresh()
      } else {
        toast("ARCHIVE FAILED", "Could not secure transmission logs.", "error")
      }
    } catch (error) {
      console.error('Error archiving messages:', error)
      toast("ERROR", "System failure during archival process.", "error")
    } finally {
      setIsArchiving(false)
    }
  }

  useEffect(() => {
    if (mode === 'VAULT' && currentUser.role === 'ADMIN') {
      const fetchArchived = async () => {
        try {
          const res = await fetch(`/api/messages?projectId=${project.id}&archived=true`)
          if (res.ok) {
            const data = await res.json()
            setArchivedMessages(data)
          }
        } catch (e) {
          console.error("Failed to fetch audit logs", e)
        }
      }
      fetchArchived()
    }
  }, [mode, currentUser.role, project.id])

  const handleResetProject = async () => {
    setIsResetting(true)
    try {
      const response = await fetch('/api/project/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id })
      })
      if (response.ok) {
        toast("PROJECT RESET", "All intelligence and configurations have been purged.", "success")
        setShowResetConfirm(false)
        router.refresh()
        setMode('CONFIG')
      } else {
        toast("RESET FAILED", "Failed to reset project data.", "error")
      }
    } catch (error) {
      console.error('Error resetting project:', error)
      toast("ERROR", "A fatal error occurred during reset.", "error")
    } finally {
      setIsResetting(false)
    }
  }

  const toggleChannel = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    )
  }

  const handleSaveConfig = async () => {
    setIsSavingConfig(true)
    try {
      const response = await fetch(`/api/projects/${project.id}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessGoals,
          businessOKRs,
          marketingGoals,
          strategicConstraints,
          businessDriver,
          metricName,
          metricTarget,
          metricBaseline,
          operationalPriority,
          cacCurrent,
          cacGoal,
          ltvCurrent,
          ltvGoal,
          conversionCurrent,
          conversionGoal,
          marketingSignal,
          marketingNoise,
          channels: selectedChannels
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
    
    // Logic: If UNDER REVIEW, commentary must be empty until certified
    const isUnderReview = session.status?.toLowerCase() === 'submitted' || session.status?.toLowerCase() === 'under_review'
    const initialNarrative = session.certifiedNarrative || (isUnderReview ? "" : session.briefSummary) || ""
    
    setConsultantAnalysis(initialNarrative)
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
      } else {
        const errorData = await response.json()
        toast("TRANSMISSION FAILED", errorData.error || "Could not send message", "error")
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast("SYSTEM ERROR", "Network or server failure", "error")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-portal-bg overflow-hidden font-inter">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="text-white/40 hover:text-white uppercase tracking-widest text-[10px] font-bold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to dashboard
          </Button>
        </div>
        
        {/* CENTER LOGO & PHASE INDICATOR */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
           <div className="flex items-center gap-2">
              <span className="text-xl font-big-shoulders font-black tracking-tight text-coral">LG</span>
              <span className="text-xl font-big-shoulders font-black tracking-tight text-white">// PORTAL</span>
           </div>
           <div className="text-[10px] font-bold tracking-[0.4em] text-zinc-500 uppercase mt-0.5">
             PHASE: DISCOVERY
           </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={cn(
            "px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest border",
            getStatusColor(projectStatusLabel)
          )}>
            Status: {projectStatusLabel}
          </div>
          <Button 
            variant="outline"
            className="h-8 border-white/10 text-white/40 hover:text-white text-[9px] font-bold uppercase tracking-widest"
          >
            <Printer className="mr-2 h-3 w-3" /> Print Dossier
          </Button>
        </div>
      </header>

      {/* Task 3: Wide-screen Stage (Reclaimed Canvas) */}
      <div className="flex-1 overflow-hidden h-full pt-20">
        
        {/* --- THE STAGE (Full Width) --- */}
        <div className="w-full flex flex-col h-full overflow-hidden bg-[#0A0A0A]">
          
          {/* Phase 92: 4-Stage Lifecycle Tracker */}
          <div className="w-full border-b border-white/5">
            <LifecycleTracker 
              currentStage={
                mode === 'INTELLIGENCE' ? 'discovery' : 
                mode === 'ROADMAP' ? 'roadmap' : 
                mode === 'VAULT' ? 'roadmap' : // Vault is grouped with Roadmap/certified outputs
                (project.status === 'CALIBRATED' || project.status === 'ACTIVE') ? 'calibration' : 'identity'
              }
              completedStages={[
                'identity',
                ...(project.status === 'CALIBRATED' || project.status === 'ACTIVE' || project.status === 'CERTIFIED' ? ['calibration'] : []),
                ...(isMasterReady ? ['discovery'] : []),
                ...(project.masterPlan ? ['roadmap'] : [])
              ]}
              onStageClick={(stageId) => {
                if (stageId === 'identity' || stageId === 'calibration') setMode('CONTEXT')
                if (stageId === 'discovery') setMode('INTELLIGENCE')
                if (stageId === 'roadmap') setMode('ROADMAP')
              }}
              isLocked={(stageId) => {
                if (stageId === 'discovery' || stageId === 'roadmap') {
                  return project.status !== 'CALIBRATED' && project.status !== 'ACTIVE' && project.status !== 'CERTIFIED'
                }
                return false
              }}
            />
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 md:p-16 max-w-4xl mx-auto">
              {/* Intelligence Mode */}
              {mode === 'INTELLIGENCE' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-1 duration-500">
                  <div className="space-y-4 md:space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                      <h2 className="text-[11px] font-bold tracking-widest text-white/40">
                        Strategic intelligence pillars
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
                      {STRATEGY_MODULES.map((module) => {
                        const session = getAssessmentStatus(module.id)
                        const status = session.status?.toUpperCase()
                        const isCertified = status === 'CERTIFIED'
                        const isUnderReview = status === 'UNDER REVIEW'
                        const isPending = status === 'PENDING'
                        
                        return (
                          <div key={module.id} className={cn(
                            "p-4 md:p-8 rounded-xl border transition-all",
                            isPending ? "border-white/5 bg-white/[0.01] opacity-40 grayscale" : "border-white/10 bg-white/[0.02]",
                            isCertified ? "border-teal/20 shadow-[0_0_30px_rgba(46,211,198,0.05)]" : ""
                          )}>
                            <div className="flex justify-between items-start mb-4 md:mb-8">
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "p-2 md:p-2.5 rounded border transition-colors",
                                  isCertified ? "text-teal border-teal/20" : 
                                  isUnderReview ? "text-amber-500 border-amber-500/20" : 
                                  "text-white/40 border-white/10"
                                )}>
                                  <module.icon size={18} />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-white tracking-tight">{module.title}</h3>
                                  <Badge className={cn(
                                    "text-[8px] font-bold tracking-widest uppercase h-5 px-2 mt-1",
                                    getStatusColor(status)
                                  )}>
                                    {status}
                                  </Badge>
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
                                    disabled={isUnderReview && currentUser.role !== 'ADMIN'}
                                    onClick={() => {
                                      if (currentUser.role === 'ADMIN') {
                                        // Redirect to the new Strategy Workbench v2.1
                                        router.push(`/admin/projects/${project.id}/strategy/${module.id}/results`)
                                        return
                                      }

                                      if (isUnderReview && currentUser.role !== 'ADMIN') {
                                        // Redirect to loading/results page which handles pending state
                                        router.push(`/strategy-iq/${project.id}/${module.id}/results`)
                                        return
                                      }
                                      openReview(session, true, currentUser.role !== 'ADMIN')
                                    }}
                                    className={cn(
                                      "flex-1 text-[9px] font-bold tracking-widest h-10",
                                      isCertified ? "bg-teal/10 text-teal border border-teal/20 hover:bg-teal/20" : 
                                      "bg-white/5 hover:bg-white/10 text-white/60 border border-white/10"
                                    )}
                                  >
                                    {isCertified ? (currentUser.role === 'ADMIN' ? "Manage brief" : "View brief") : 
                                     isUnderReview ? (currentUser.role === 'ADMIN' ? "Certify results" : "Review in progress") : 
                                     "Review intelligence"}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    onClick={() => {
                                      if (currentUser.role === 'ADMIN') {
                                        router.push(`/admin/projects/${project.id}/strategy/${module.id}/results`)
                                      } else {
                                        router.push(`/strategy-iq/${project.id}/${module.id}/results`)
                                      }
                                    }}
                                    className="bg-coral hover:bg-coral/90 text-white border border-coral/20 text-[9px] font-bold tracking-widest h-10 px-4 shadow-lg shadow-coral/20 animate-pulse"
                                    title="Compose AI Narrative"
                                  >
                                    <Bot size={16} />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    onClick={() => router.push(`/strategy-iq/${project.id}/${module.id}/results`)}
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

                  <div className="pt-8 md:pt-16 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-6 md:mb-10">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        synthesisContent.state === 'GENERATED' ? "bg-teal" : "bg-coral"
                      )} />
                      <h2 className="text-[11px] font-bold tracking-widest text-white/40 uppercase">
                        Master roadmap synthesis
                      </h2>
                    </div>

                    <div className={cn(
                      "border border-white/10 p-6 md:p-10 rounded-2xl relative overflow-hidden transition-all duration-500",
                      synthesisContent.state === 'PRE' && "opacity-40 grayscale"
                    )}>
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                        <div className="max-w-xl text-center md:text-left">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4 tracking-tight">
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
                            "h-12 md:h-14 px-8 md:px-10 rounded text-xs font-bold tracking-widest transition-all w-full md:w-auto",
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
                    {/* AUDIT LOGS / ARCHIVED TRANSMISSIONS (ADMIN ONLY) */}
                    {currentUser.role === 'ADMIN' && (
                      <div className="mb-12 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="bg-white/[0.02] p-6 border-b border-white/5 flex items-center gap-3">
                          <Lock size={14} className="text-coral" />
                          <h3 className="text-[10px] font-bold tracking-[0.2em] text-coral uppercase">
                            // STRATEGIC ARCHIVE / HISTORICAL TRANSMISSIONS
                          </h3>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto bg-black">
                          {archivedMessages.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                              <thead className="bg-white/[0.02] sticky top-0">
                                <tr>
                                  <th className="p-4 text-[9px] font-mono uppercase text-white/30 tracking-widest border-b border-white/5">Timestamp</th>
                                  <th className="p-4 text-[9px] font-mono uppercase text-white/30 tracking-widest border-b border-white/5">Sender</th>
                                  <th className="p-4 text-[9px] font-mono uppercase text-white/30 tracking-widest border-b border-white/5">Content</th>
                                </tr>
                              </thead>
                              <tbody className="font-mono text-[11px]">
                                {archivedMessages.map((msg) => (
                                  <tr key={msg.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 text-zinc-500 whitespace-nowrap align-top">
                                      {format(new Date(msg.createdAt), "yyyy-MM-dd HH:mm:ss")}
                                    </td>
                                    <td className="p-4 text-zinc-400 whitespace-nowrap align-top">
                                      {msg.sender?.name || 'Unknown'} <span className="text-zinc-600">[{msg.sender?.role}]</span>
                                    </td>
                                    <td className="p-4 text-zinc-300 align-top">
                                      {msg.content}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="p-12 flex flex-col items-center justify-center text-white/20">
                              <History size={24} className="mb-4 opacity-50" />
                              <p className="text-[10px] font-mono tracking-widest uppercase">No archival records found</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {project.deliverables && project.deliverables.length > 0 ? project.deliverables.map((asset: any) => {
                      const dimension = getDimensionFromTitle(asset.title)
                      const isStrategyBrief = asset.title.toLowerCase().includes('strategy brief') || asset.type?.toLowerCase().includes('brief')
                      
                      return (
                        <div 
                          key={asset.id} 
                          className="group flex items-center justify-between p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all cursor-pointer"
                          onClick={() => {
                            if (asset.fileUrl && asset.fileUrl.startsWith('/')) {
                                router.push(asset.fileUrl)
                                return
                            }
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

              {/* Strategic Configuration Mode (Joint Alignment) */}
              {mode === 'CONTEXT' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-1 duration-500 max-w-[900px] mx-auto border-l-[2px] border-coral pl-12">
                  <div className="space-y-6">
                    {/* Identity Wayfinding */}
                    <div className="mb-2 flex items-baseline">
                      <span className="font-big-shoulders font-bold text-coral uppercase tracking-[0.2em] text-[1.4rem]">
                        CLIENT: {project.client?.name || project.client?.company || "ACME"}
                      </span>
                      <span className="text-white/20 mx-[15px] text-[1.4rem] font-light">//</span>
                      <span className="font-big-shoulders font-bold text-white uppercase tracking-[0.2em] text-[1.4rem]">
                        PROJECT: {project.title || project.name || "Growth Plan"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between relative">
                      <h3 className="text-4xl font-bold text-white font-big-shoulders tracking-tight uppercase leading-none opacity-20 italic">
                        Strategic Charter
                      </h3>
                      {/* Seal of Authority Watermark */}
                      <div className="absolute -top-10 -right-20 pointer-events-none">
                        <SealOfAuthority size={300} opacity={0.05} rotate={12} />
                      </div>
                    </div>
                    <p className="text-zinc-400 text-lg font-light font-inter leading-[1.8] max-w-2xl opacity-60">
                      Strategic intelligence is only as strong as the context it sits within. We are aligning our engine to the mandates you are already accountable to.
                    </p>
                  </div>

                      {isConfigEditing ? (
                        <div className="grid grid-cols-1 gap-12 pt-8">
                          
                          {/* COMPONENT: PRIMARY BUSINESS DRIVER */}
                          <div className="space-y-6">
                            <h4 className="text-[1.2rem] font-extrabold text-white font-big-shoulders tracking-wider">Primary business driver</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {BUSINESS_DRIVERS.map((driver) => {
                                const isSelected = businessDriver === driver.id
                                return (
                                  <div 
                                    key={driver.id}
                                    onClick={() => setBusinessDriver(driver.id)}
                                    className={cn(
                                      "p-6 rounded border cursor-pointer transition-all duration-300 relative overflow-hidden group",
                                      isSelected 
                                        ? "border-teal bg-teal/[0.05] shadow-[0_0_20px_rgba(46,211,198,0.1)]" 
                                        : "border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20"
                                    )}
                                  >
                                    <div className="space-y-2 relative z-10">
                                      <h5 className={cn(
                                        "text-lg font-bold font-big-shoulders tracking-wide uppercase",
                                        isSelected ? "text-teal" : "text-white/60 group-hover:text-white"
                                      )}>
                                        {driver.title}
                                      </h5>
                                      <p className="text-sm text-zinc-500 font-inter leading-relaxed">
                                        {driver.desc}
                                      </p>
                                    </div>
                                    {isSelected && (
                                      <div className="absolute top-0 right-0 p-3">
                                        <div className="w-2 h-2 rounded-full bg-teal shadow-[0_0_10px_#2ED3C6]" />
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* COMPONENT: THE METRIC OF RECORD (LAYER I) */}
                          <div className="space-y-6 relative">
                            <h4 className="text-[1.2rem] font-extrabold text-white font-big-shoulders tracking-wider">The metric of record</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                              {/* Metric Selector */}
                              <div className="space-y-3 relative">
                                <Label className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Metric Name</Label>
                                <div 
                                  onClick={() => setShowMetricSelector(!showMetricSelector)}
                                  className="flex items-center justify-between border-b border-white/10 py-2 cursor-pointer group hover:border-teal/50 transition-colors"
                                >
                                  <span className={cn(
                                    "text-xl font-serif italic",
                                    metricName ? "text-white" : "text-white/20"
                                  )}>
                                    {metricName || "Select Metric..."}
                                  </span>
                                  <ChevronRight className={cn(
                                    "text-zinc-500 transition-transform duration-300",
                                    showMetricSelector ? "rotate-90 text-teal" : "group-hover:text-white"
                                  )} size={16} />
                                </div>
                                
                                {/* Dropdown */}
                                {showMetricSelector && (
                                  <div className="absolute top-full left-0 w-[300px] md:w-[400px] bg-[#0A0A0A] border border-white/10 z-50 shadow-2xl rounded-b-xl max-h-[400px] overflow-y-auto mt-2 p-4 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="grid gap-6">
                                      {METRIC_CATEGORIES.map((cat) => (
                                        <div key={cat.name} className="space-y-2">
                                          <h5 className="font-big-shoulders font-bold text-[10px] text-white/40 uppercase tracking-widest border-b border-white/5 pb-1">
                                            {cat.name}
                                          </h5>
                                          <div className="grid grid-cols-1 gap-1">
                                            {cat.metrics.map(m => (
                                              <button
                                                key={m}
                                                type="button"
                                                onClick={() => { setMetricName(m); setShowMetricSelector(false); }}
                                                className={cn(
                                                  "text-left text-sm font-inter px-3 py-1.5 rounded transition-all w-full",
                                                  metricName === m 
                                                    ? "bg-teal/10 text-teal font-bold" 
                                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                                                )}
                                              >
                                                {m}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                      <div className="pt-2 border-t border-white/5">
                                        <Input 
                                           placeholder="Custom Metric..."
                                           className="bg-transparent border border-white/10 text-sm text-white focus:border-teal px-3 h-9 rounded"
                                           onKeyDown={(e) => {
                                              if(e.key === 'Enter') {
                                                 setMetricName(e.currentTarget.value);
                                                 setShowMetricSelector(false);
                                              }
                                           }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Target & Baseline Inputs */}
                              <div className="space-y-3">
                                <Label className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Target Value</Label>
                                <Input 
                                  value={metricTarget}
                                  onChange={(e) => setMetricTarget(e.target.value)}
                                  placeholder="0.00"
                                  className="bg-transparent border-b border-white/10 border-t-0 border-x-0 rounded-none px-0 text-xl text-white font-serif italic placeholder:text-white/10 focus:border-teal focus:ring-0"
                                />
                              </div>
                              <div className="space-y-3">
                                <Label className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Current Baseline</Label>
                                <Input 
                                  value={metricBaseline}
                                  onChange={(e) => setMetricBaseline(e.target.value)}
                                  placeholder="0.00"
                                  className="bg-transparent border-b border-white/10 border-t-0 border-x-0 rounded-none px-0 text-xl text-white font-serif italic placeholder:text-white/10 focus:border-teal focus:ring-0"
                                />
                              </div>
                            </div>

                            {/* Live Math Logic (The "Lift" Indicator) */}
                            {calculatedLift && (
                              <div className="absolute -top-2 right-0 bg-teal/10 border border-teal/20 px-4 py-2 rounded flex items-center gap-3">
                                <span className="text-[10px] font-bold text-teal/60 tracking-widest uppercase">Required Lift</span>
                                <span className="text-xl font-bold text-teal font-mono">{calculatedLift}</span>
                              </div>
                            )}
                          </div>

                          {/* GUIDED STRATEGIC CHARTER SECTIONS */}
                          <HybridStrategicInput 
                            label="Business goals"
                            value={businessGoals}
                            onChange={setBusinessGoals}
                            inspiration={["Transition to Enterprise", "Decouple Founder", "Expand Market Share"]}
                          />

                          <HybridStrategicInput 
                            label="Business OKRs"
                            value={businessOKRs}
                            onChange={setBusinessOKRs}
                            inspiration={["20% Pipeline Lift", "4-Month Sales Cycle", "100% CRM Accuracy"]}
                          />

                          <HybridStrategicInput 
                            label="Marketing goals"
                            value={marketingGoals}
                            onChange={setMarketingGoals}
                            inspiration={["Establish Category Authority", "Microsoft Co-sell Status", "50 High-Intent Downloads"]}
                          />

                          {/* Constraints (Layer I) */}
                          <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                              <h4 className="text-[1.2rem] font-extrabold text-white font-big-shoulders tracking-wider">The Resistance // Constraints</h4>
                            </div>
                            <div className="space-y-3">
                              <div className={cn(
                                "relative border-b-2 transition-all duration-300",
                                strategicConstraints.length >= 10 ? "border-teal" : "border-coral"
                              )}>
                                <Textarea 
                                  value={strategicConstraints}
                                  onChange={(e) => setStrategicConstraints(e.target.value)}
                                  placeholder="What is currently preventing these goals from being met? (10 chars min)"
                                  className="bg-transparent border-none p-0 min-h-[100px] text-[rgba(255,255,255,0.85)] font-inter font-light text-[1.1rem] leading-[1.8] focus:ring-0 resize-none placeholder:text-white/20 placeholder:italic"
                                />
                              </div>
                              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                                {strategicConstraints.length} / 10 characters minimum
                              </div>
                            </div>
                          </div>

                          {/* --- LAYER II: THE MARKETING MANDATE --- */}
                          <div className="pt-12 border-t border-white/5 space-y-12">
                            
                            {/* COMPONENT: OPERATIONAL PRIORITY */}
                            <div className="space-y-6">
                              <div className="flex flex-col gap-1">
                                <h4 className="text-[1.2rem] font-extrabold text-white uppercase font-big-shoulders">Operational priority</h4>
                                <p className="text-zinc-500 text-sm font-inter">What is the primary job marketing has been asked to do right now?</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {OPERATIONAL_PRIORITIES.map((p) => {
                                  const isSelected = operationalPriority === p.id
                                  return (
                                    <div 
                                      key={p.id}
                                      onClick={() => setOperationalPriority(p.id)}
                                      className={cn(
                                        "p-4 rounded border cursor-pointer transition-all duration-300 relative group h-full flex flex-col justify-between",
                                        isSelected 
                                          ? "border-teal bg-teal/[0.1] shadow-[0_0_15px_rgba(46,211,198,0.1)]" 
                                          : "border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20"
                                      )}
                                    >
                                      <div className="space-y-2">
                                        <h5 className={cn(
                                          "text-md font-bold font-big-shoulders tracking-wide uppercase",
                                          isSelected ? "text-teal" : "text-white/60 group-hover:text-white"
                                        )}>
                                          {p.title}
                                        </h5>
                                        <p className="text-xs text-zinc-500 font-inter leading-relaxed">
                                          {p.desc}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>

                            {/* COMPONENT: PERFORMANCE BENCHMARKS */}
                            <div className="space-y-6">
                              <h4 className="text-[1.2rem] font-extrabold text-white uppercase font-big-shoulders">Performance benchmarks</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                
                                {/* Metric 1: CAC */}
                                <div className="space-y-4">
                                  <h5 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase border-b border-white/5 pb-2">
                                    CAC (Cost Per Acquisition)
                                  </h5>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                       <label className="text-[9px] text-zinc-600 uppercase font-bold">Current</label>
                                       <Input 
                                          value={cacCurrent}
                                          onChange={(e) => setCacCurrent(e.target.value)}
                                          placeholder="$0.00"
                                          className="bg-transparent border-b border-white/10 border-t-0 border-x-0 rounded-none px-0 text-lg text-white font-mono placeholder:text-white/10 focus:border-teal focus:ring-0 h-8"
                                       />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[9px] text-zinc-600 uppercase font-bold">Goal</label>
                                       <Input 
                                          value={cacGoal}
                                          onChange={(e) => setCacGoal(e.target.value)}
                                          placeholder="$0.00"
                                          className="bg-transparent border-b border-white/10 border-t-0 border-x-0 rounded-none px-0 text-lg text-white font-mono placeholder:text-white/10 focus:border-teal focus:ring-0 h-8"
                                       />
                                    </div>
                                  </div>
                                  {(() => {
                                     const gap = getGap(cacCurrent, cacGoal, 'LOWER_BETTER')
                                     if (!gap) return null
                                     return (
                                       <div className={cn("text-[10px] font-mono font-bold tracking-wider mt-2", gap.isGood ? "text-teal" : "text-coral")}>
                                         {gap.val} CAC {gap.label} REQUIRED
                                       </div>
                                     )
                                  })()}
                                </div>

                                {/* Metric 2: LTV */}
                                <div className="space-y-4">
                                  <h5 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase border-b border-white/5 pb-2">
                                    LTV (Lifetime Value)
                                  </h5>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                       <label className="text-[9px] text-zinc-600 uppercase font-bold">Current</label>
                                       <Input 
                                          value={ltvCurrent}
                                          onChange={(e) => setLtvCurrent(e.target.value)}
                                          placeholder="$0.00"
                                          className="bg-transparent border-b border-white/10 border-t-0 border-x-0 rounded-none px-0 text-lg text-white font-mono placeholder:text-white/10 focus:border-teal focus:ring-0 h-8"
                                       />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[9px] text-zinc-600 uppercase font-bold">Goal</label>
                                       <Input 
                                          value={ltvGoal}
                                          onChange={(e) => setLtvGoal(e.target.value)}
                                          placeholder="$0.00"
                                          className="bg-transparent border-b border-white/10 border-t-0 border-x-0 rounded-none px-0 text-lg text-white font-mono placeholder:text-white/10 focus:border-teal focus:ring-0 h-8"
                                       />
                                    </div>
                                  </div>
                                  {(() => {
                                     const gap = getGap(ltvCurrent, ltvGoal, 'HIGHER_BETTER')
                                     if (!gap) return null
                                     return (
                                       <div className={cn("text-[10px] font-mono font-bold tracking-wider mt-2", gap.isGood ? "text-teal" : "text-coral")}>
                                         {gap.val} LTV {gap.label} REQUIRED
                                       </div>
                                     )
                                  })()}
                                </div>

                                {/* Metric 3: Conversion Rate */}
                                <div className="space-y-4">
                                  <h5 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase border-b border-white/5 pb-2">
                                    Conversion Rate
                                  </h5>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                       <label className="text-[9px] text-zinc-600 uppercase font-bold">Current</label>
                                       <Input 
                                          value={conversionCurrent}
                                          onChange={(e) => setConversionCurrent(e.target.value)}
                                          placeholder="0.0%"
                                          className="bg-transparent border-b border-white/10 border-t-0 border-x-0 rounded-none px-0 text-lg text-white font-mono placeholder:text-white/10 focus:border-teal focus:ring-0 h-8"
                                       />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[9px] text-zinc-600 uppercase font-bold">Goal</label>
                                       <Input 
                                          value={conversionGoal}
                                          onChange={(e) => setConversionGoal(e.target.value)}
                                          placeholder="0.0%"
                                          className="bg-transparent border-b border-white/10 border-t-0 border-x-0 rounded-none px-0 text-lg text-white font-mono placeholder:text-white/10 focus:border-teal focus:ring-0 h-8"
                                       />
                                    </div>
                                  </div>
                                  {(() => {
                                     const gap = getGap(conversionCurrent, conversionGoal, 'HIGHER_BETTER')
                                     if (!gap) return null
                                     return (
                                       <div className={cn("text-[10px] font-mono font-bold tracking-wider mt-2", gap.isGood ? "text-teal" : "text-coral")}>
                                         {gap.val} CONVERSION {gap.label} REQUIRED
                                       </div>
                                     )
                                  })()}
                                </div>

                              </div>
                            </div>

                            {/* COMPONENT: OPERATIONAL HISTORY */}
                            <div className="space-y-6">
                              <h4 className="text-[1.2rem] font-extrabold text-white uppercase font-big-shoulders">Operational history</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-3">
                                   <Label className="text-zinc-500 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                                     <CheckCircle size={12} className="text-teal" /> Reliable Signal (What Works)
                                   </Label>
                                   <Textarea 
                                     value={marketingSignal}
                                     onChange={(e) => setMarketingSignal(e.target.value)}
                                     placeholder="*Identify the tactics that are currently delivering results...*"
                                     className="bg-transparent border-none p-0 min-h-[100px] text-[rgba(255,255,255,0.85)] font-serif italic text-xl leading-relaxed focus:ring-0 resize-none placeholder:text-white/10"
                                   />
                                </div>
                                <div className="space-y-3">
                                   <Label className="text-zinc-500 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                                     <AlertCircle size={12} className="text-coral" /> Strategic Noise (What Failed)
                                   </Label>
                                   <Textarea 
                                     value={marketingNoise}
                                     onChange={(e) => setMarketingNoise(e.target.value)}
                                     placeholder="*Identify recent failures or inefficiencies...*"
                                     className="bg-transparent border-none p-0 min-h-[100px] text-[rgba(255,255,255,0.85)] font-serif italic text-xl leading-relaxed focus:ring-0 resize-none placeholder:text-white/10"
                                   />
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* Channel Ecosystem */}
                          <div className="space-y-8 pt-8 border-t border-white/5">
                            <h4 className="text-[1.2rem] font-extrabold text-white uppercase font-big-shoulders">Channel Ecosystem</h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                              {STRATEGY_CHANNELS.map((channel) => (
                                <label 
                                  key={channel}
                                  className="flex items-center gap-3 group cursor-pointer"
                                >
                                  <div className="relative flex items-center justify-center">
                                    <input 
                                      type="checkbox"
                                      checked={selectedChannels.includes(channel)}
                                      onChange={() => toggleChannel(channel)}
                                      className="peer appearance-none w-4 h-4 rounded-sm border border-white/20 bg-transparent checked:bg-teal checked:border-teal transition-all"
                                    />
                                    <CheckCircle2 size={10} className="absolute text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                                  </div>
                                  <span className="font-inter font-light text-sm text-zinc-400 group-hover:text-white transition-colors tracking-tight">
                                    {channel}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                      {/* Floating Action Bar */}
                      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[600px] px-8 z-50">
                        <div className="flex items-center justify-between bg-[#0A0A0ACC] backdrop-blur-[10px] border-t border-white/10 p-3 rounded shadow-2xl shadow-black/50">
                          
                          {/* Button 1 (Left-align) */}
                          <Button 
                            variant="outline"
                            onClick={() => setShowResetConfirm(true)}
                            className="text-[10px] uppercase tracking-widest font-bold text-coral border-coral hover:bg-coral hover:text-black transition-colors h-9 px-6 rounded bg-transparent"
                          >
                            Reset project
                          </Button>

                          {/* Right Group */}
                          <div className="flex items-center gap-4">
                            {project.status === 'CALIBRATED' && currentUser.role !== 'ADMIN' ? (
                              <div className="flex items-center gap-2 text-teal px-4">
                                <ShieldCheck size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Charter locked // Proceed to Intelligence</span>
                              </div>
                            ) : currentUser.role === 'ADMIN' ? (
                              <Button 
                                onClick={async () => {
                                  setIsSavingConfig(true)
                                  try {
                                    // 1. Save Config First
                                    await handleSaveConfig()
                                    
                                    // 2. Trigger Generation
                                    const response = await fetch('/api/strategy-iq/generate-synthesis', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ projectId: project.id })
                                    })
                                    
                                    if (response.ok) {
                                      toast("SYNTHESIS COMPLETE", "Strategic narrative generated and vaulted.", "success")
                                      router.refresh()
                                    } else {
                                      const error = await response.json()
                                      toast("GENERATION FAILED", error.message || "Failed to generate synthesis.", "error")
                                    }
                                  } catch (error) {
                                    console.error("Error generating synthesis:", error)
                                    toast("ERROR", "System failure during synthesis.", "error")
                                  } finally {
                                    setIsSavingConfig(false)
                                  }
                                }}
                                disabled={isSavingConfig || !isCharterValid}
                                className="h-9 px-6 rounded bg-coral text-white hover:bg-coral/90 text-[10px] font-bold uppercase tracking-[0.1em] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isSavingConfig ? <RefreshCw className="animate-spin mr-2" /> : <Bot className="mr-2" size={16} />}
                                GENERATE STRATEGIC SYNTHESIS
                              </Button>
                            ) : (
                              <Button 
                                onClick={handleSaveConfig}
                                disabled={isSavingConfig || !isCharterValid}
                                className="h-9 px-6 rounded bg-teal text-[#050505] hover:bg-teal/90 text-[10px] font-bold uppercase tracking-[0.1em] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isSavingConfig ? <RefreshCw className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" />}
                                Confirm Charter
                              </Button>
                            )}
                          </div>

                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-12 pt-8">
                      {/* Read-Only View */}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                         <section className="space-y-4">
                           <h4 className="text-[12px] font-bold text-coral tracking-[0.2em] uppercase font-big-shoulders">Primary Driver</h4>
                           <div className="p-6 border border-teal/20 bg-teal/[0.05] rounded shadow-[0_0_20px_rgba(46,211,198,0.05)] h-full">
                              <h3 className="text-2xl font-bold font-big-shoulders text-teal uppercase tracking-wide mb-2">
                                {BUSINESS_DRIVERS.find(d => d.id === businessDriver)?.title || "Market Capture"}
                              </h3>
                              <p className="text-sm text-zinc-400 font-inter">
                                {BUSINESS_DRIVERS.find(d => d.id === businessDriver)?.desc || "Aggressive growth and acquisition via Nexus AI integration."}
                              </p>
                           </div>
                         </section>

                         <section className="space-y-4">
                           <h4 className="text-[12px] font-bold text-coral tracking-[0.2em] uppercase font-big-shoulders">The Metric of Record</h4>
                           <div className="flex flex-col gap-1 h-full justify-center">
                              <span className="text-3xl font-serif italic text-white">{metricName || "Qualified Enterprise Leads (CTO-level)"}</span>
                              <div className="flex items-center gap-4 text-sm font-mono text-zinc-500 mt-2">
                                 <span>TARGET: <span className="text-white">{metricTarget || "150"}</span></span>
                                 <span>//</span>
                                 <span>BASE: <span className="text-white">{metricBaseline || "45"}</span></span>
                              </div>
                              {calculatedLift ? (
                                <div className="mt-4 inline-flex items-center gap-2 bg-teal/10 border border-teal/20 px-3 py-1 rounded self-start">
                                  <span className="text-[9px] font-bold text-teal uppercase tracking-widest">Target Lift</span>
                                  <span className="text-sm font-bold text-teal font-mono">{calculatedLift}</span>
                                </div>
                              ) : (
                                <div className="mt-4 inline-flex items-center gap-2 bg-teal/10 border border-teal/20 px-3 py-1 rounded self-start">
                                  <span className="text-[9px] font-bold text-teal uppercase tracking-widest">Target Lift</span>
                                  <span className="text-sm font-bold text-teal font-mono">+233.3% LIFT IN QUALIFIED LEADS</span>
                                </div>
                              )}
                           </div>
                         </section>

                         <section className="space-y-4">
                            <h4 className="text-[12px] font-bold text-coral tracking-[0.2em] uppercase font-big-shoulders">Operational Priority</h4>
                            <div className="p-6 border border-white/10 bg-white/[0.02] rounded h-full">
                               <h3 className="text-xl font-bold font-big-shoulders text-white uppercase tracking-wide mb-2">
                                 {OPERATIONAL_PRIORITIES.find(p => p.id === operationalPriority)?.title || "Volume Generation"}
                               </h3>
                               <p className="text-sm text-zinc-500 font-inter">
                                 {OPERATIONAL_PRIORITIES.find(p => p.id === operationalPriority)?.desc || "Increasing raw lead flow via automated LinkedIn outbound."}
                               </p>
                            </div>
                         </section>
                      </div>

                      <div className="space-y-12">
                        {/* COMPONENT: STRATEGIC CHARTER (READ-ONLY) */}
                        <section className="space-y-8">
                          <h4 className="text-[12px] font-bold text-coral tracking-[0.2em] uppercase font-big-shoulders">Strategic charter</h4>
                          
                          <div className="grid grid-cols-1 gap-10">
                            <div className="space-y-3">
                              <h5 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Business goals</h5>
                              <div className="prose prose-invert max-w-none text-white text-lg font-serif italic pl-0 py-1">
                                <ReactMarkdown>{businessGoals || "Transition to Enterprise: Shift focus from mid-market to high-value CTO-level contracts."}</ReactMarkdown>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h5 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Business OKRs</h5>
                              <div className="prose prose-invert max-w-none text-white text-lg font-serif italic pl-0 py-1">
                                <ReactMarkdown>{businessOKRs || "20% Pipeline Lift: Achieve 150 qualified enterprise leads within 6 months."}</ReactMarkdown>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h5 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Marketing goals</h5>
                              <div className="prose prose-invert max-w-none text-white text-lg font-serif italic pl-0 py-1">
                                <ReactMarkdown>{marketingGoals || "Establish Category Authority: Position Nexus AI as the standard for automated outbound."}</ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* COMPONENT: PERFORMANCE BENCHMARKS (READ-ONLY) */}
                        <section className="space-y-6">
                          <h4 className="text-[12px] font-bold text-coral tracking-[0.2em] uppercase font-big-shoulders">Performance Benchmarks</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             {/* CAC */}
                             <div className="space-y-2">
                                <h5 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase pb-2">CAC</h5>
                                <div className="flex justify-between items-baseline">
                                   <span className="text-xs text-zinc-500 font-mono">CURRENT: <span className="text-white text-base">{cacCurrent || "$4,200"}</span></span>
                                   <span className="text-xs text-zinc-500 font-mono">GOAL: <span className="text-teal text-base">{cacGoal || "$3,000"}</span></span>
                                </div>
                             </div>
                             {/* LTV */}
                             <div className="space-y-2">
                                <h5 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase pb-2">LTV</h5>
                                <div className="flex justify-between items-baseline">
                                   <span className="text-xs text-zinc-500 font-mono">CURRENT: <span className="text-white text-base">{ltvCurrent || "$45,000"}</span></span>
                                   <span className="text-xs text-zinc-500 font-mono">GOAL: <span className="text-teal text-base">{ltvGoal || "$65,000"}</span></span>
                                </div>
                             </div>
                             {/* CONVERSION */}
                             <div className="space-y-2">
                                <h5 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase pb-2">CONVERSION</h5>
                                <div className="flex justify-between items-baseline">
                                   <span className="text-xs text-zinc-500 font-mono">CURRENT: <span className="text-white text-base">{conversionCurrent || "2.4%"}</span></span>
                                   <span className="text-xs text-zinc-500 font-mono">GOAL: <span className="text-teal text-base">{conversionGoal || "4.8%"}</span></span>
                                </div>
                             </div>
                          </div>
                        </section>

                        <section className="space-y-6">
                          <h4 className="text-[12px] font-bold text-coral tracking-[0.2em] uppercase font-big-shoulders">The Resistance : Constraints</h4>
                          <div className="prose prose-invert max-w-none text-[rgba(255,255,255,0.85)] text-[1.1rem] leading-[1.8] font-inter font-light whitespace-pre-wrap prose-strong:text-white prose-strong:font-bold prose-p:mb-4">
                            <ReactMarkdown>
                              {strategicConstraints || "No constraints identified."}
                            </ReactMarkdown>
                          </div>
                        </section>

                        {/* COMPONENT: OPERATIONAL HISTORY (READ-ONLY) */}
                        <section className="space-y-6">
                          <h4 className="text-[12px] font-bold text-coral tracking-[0.2em] uppercase font-big-shoulders">Operational History</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                             <div className="space-y-2">
                                <Label className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                                  <CheckCircle size={12} className="text-teal" /> Reliable Signal (What Works)
                                </Label>
                                <div className="text-white/80 font-serif italic text-lg leading-relaxed pl-0">
                                   {marketingSignal || "LinkedIn CTO Outbound: High-intent responses from technical decision makers."}
                                </div>
                             </div>
                             <div className="space-y-2">
                                <Label className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                                  <AlertCircle size={12} className="text-coral" /> Strategic Noise (What Failed)
                                </Label>
                                <div className="text-white/80 font-serif italic text-lg leading-relaxed pl-0">
                                   {marketingNoise || "Generic Search Ads: High CAC and low lead quality for enterprise segments."}
                                </div>
                             </div>
                          </div>
                        </section>

                        {/* COMPONENT: CHANNEL ECOSYSTEM (READ-ONLY) */}
                        <section className="space-y-6">
                          <h4 className="text-[12px] font-bold text-coral tracking-[0.2em] uppercase font-big-shoulders">Channel Ecosystem</h4>
                          <div className="flex flex-wrap gap-3">
                             {selectedChannels.length > 0 ? selectedChannels.map(channel => (
                                <div key={channel} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-300 font-inter">
                                   {channel}
                                </div>
                             )) : (
                                <span className="text-zinc-600 text-sm italic">No channels selected.</span>
                             )}
                          </div>
                        </section>
                      </div>

                      {/* Floating Action Bar (View Mode) */}
                      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[600px] px-8 z-50">
                        <div className="flex items-center justify-between bg-[#0A0A0ACC] backdrop-blur-[10px] border-t border-white/10 p-3 rounded shadow-2xl shadow-black/50">
                          
                          {/* Button 1 (Left-align) */}
                          <Button 
                            variant="outline"
                            onClick={() => setShowResetConfirm(true)}
                            className="text-[10px] uppercase tracking-widest font-bold text-coral border-coral hover:bg-coral hover:text-black transition-colors h-9 px-6 rounded bg-transparent"
                          >
                            Reset project
                          </Button>

                          {/* Right Group */}
                          <div className="flex items-center gap-4">
                            {project.status === 'CALIBRATED' && currentUser.role !== 'ADMIN' ? (
                               <div className="flex items-center gap-2 text-teal px-4">
                                  <ShieldCheck size={16} />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">Certified Artifact</span>
                               </div>
                            ) : (
                               <Button 
                                 variant="outline"
                                 onClick={() => setIsConfigEditing(true)}
                                 className="h-9 px-6 rounded border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all text-[10px] font-bold uppercase tracking-[0.1em] bg-transparent"
                               >
                                 Modify Charter
                               </Button>
                            )}
                          </div>

                        </div>
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

      </div>

      {/* Editorial Review Modal */}

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

      {/* Reset Project Confirmation */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-big-shoulders tracking-widest uppercase italic text-coral">
              Surgical Data Purge
            </DialogTitle>
            <DialogDescription className="text-zinc-500 font-inter pt-4 leading-relaxed">
              This action will permanently delete all assessment sessions, strategic narratives, and configurations for this project. This is a clean slate operation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center gap-4 border-y border-white/5 my-4">
            <AlertCircle size={48} className="text-coral opacity-20" />
            <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-600 uppercase">Warning: Irreversible</p>
          </div>
          <DialogFooter className="flex gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowResetConfirm(false)}
              className="flex-1 border-white/5 text-zinc-500 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleResetProject}
              disabled={isResetting}
              className="flex-1 bg-coral hover:bg-coral/90 text-white font-bold tracking-widest"
            >
              {isResetting ? "Purging..." : "Confirm Purge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Archive / Reset Thread Confirmation */}
      <Dialog open={showArchiveResetConfirm} onOpenChange={setShowArchiveResetConfirm}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-big-shoulders tracking-widest uppercase italic text-coral">
              Confirm Strategic Archive
            </DialogTitle>
            <DialogDescription className="text-zinc-500 font-inter pt-4 leading-relaxed">
              This will move all current messages to the Strategic Archive. This action is permanent and legally logged. The active Comm Link will be cleared for a clean state.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center gap-4 border-y border-white/5 my-4">
             <History size={48} className="text-coral opacity-20" />
             <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-600 uppercase">Warning: Legal Audit Log</p>
          </div>
          <DialogFooter className="flex gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowArchiveResetConfirm(false)}
              className="flex-1 border-white/5 text-zinc-500 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleArchiveReset}
              disabled={isArchiving}
              className="flex-1 bg-transparent border border-coral/30 text-coral hover:bg-coral hover:text-black font-bold tracking-widest uppercase transition-all"
            >
              {isArchiving ? "Archiving..." : "Secure & Reset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
