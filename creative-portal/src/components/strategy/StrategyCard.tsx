"use client"

import { 
  Rocket, 
  User, 
  FileText, 
  Code, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  Lock,
  File
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"

import { useSession } from "next-auth/react"

export type AssessmentStatus = "NOT_STARTED" | "UNDER_REVIEW" | "PUBLISHED" | "COMPLETED" | "IN_PROGRESS"

interface StrategyCardProps {
  id: string
  title: string
  description: string
  status: AssessmentStatus
  projectId?: string
  onClick?: () => void
  isDashboard?: boolean
  ctaOverride?: string
  isUnlocked?: boolean
  dataUrl?: string
}

export function StrategyCard({ 
  id, 
  title, 
  description, 
  status: propStatus, 
  projectId, 
  onClick,
  isDashboard = false,
  ctaOverride,
  isUnlocked = false,
  dataUrl
}: StrategyCardProps) {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  const [showHelp, setShowHelp] = useState(false)
  const [localCompleted, setLocalCompleted] = useState(false)

  useEffect(() => {
    const isCompleted = localStorage.getItem(`${id.toLowerCase()}_assessment_completed`) === 'true'
    setLocalCompleted(isCompleted)
  }, [id])

  const effectiveStatus = localCompleted && propStatus === "NOT_STARTED" ? "COMPLETED" : propStatus
  
  // ADMIN OVERRIDE: Unlock everything for Admin in Demo Mode
  const isActuallyUnlocked = isAdmin ? true : isUnlocked;

  // Invariant Waterfall Logic Gate (Hard Lock)
  const handleCardClick = (e: React.MouseEvent) => {
    // If locked, prevent default action and redirect to context tab if handler provided
    if (!isActuallyUnlocked) {
      e.preventDefault();
      e.stopPropagation();
      // If there's an onClick handler (like switching tabs), use it
      // Otherwise, we might want to redirect to the Context tab explicitly
      if (onClick) {
        onClick();
      }
      return;
    }

    // Admin Bypass: Allow clicking even if under review
    if (!isAdmin && effectiveStatus === 'UNDER_REVIEW') return
    
    if (onClick) {
      e.preventDefault()
      onClick()
    }
  }

  const getIdentity = (id: string) => {
    switch (id.toLowerCase()) {
      case 'gtm': return { icon: Rocket, label: 'GTM Strategy', info: 'Market entry and channel optimization' }
      case 'brand': return { icon: User, label: 'Brand Position', info: 'Identity, voice, and market perception' }
      case 'campaign': return { icon: File, label: 'Campaign Ops', info: 'Funnel efficiency and lead acquisition' }
      case 'creative': return { icon: Code, label: 'Creative Dir', info: 'Visual systems and asset production' }
      default: return { icon: FileText, label: title, info: description }
    }
  }

  const { icon: Icon, label, info } = getIdentity(id)

  const getStatusStyles = (status: AssessmentStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return { 
          label: 'PUBLISHED', 
          cta: 'View Intelligence', 
          color: 'text-teal', 
          dot: 'bg-teal',
          bg: 'bg-transparent', 
          border: 'border-white/10', 
          ctaColor: 'bg-teal text-black hover:bg-teal/90 transition-colors border-none',
          step: 4,
          icon: ShieldCheck
        }
      case 'COMPLETED':
      case 'UNDER_REVIEW':
        return { 
          label: 'IN REVIEW', 
          cta: 'Review Status', 
          color: 'text-amber-400', 
          dot: 'bg-amber-400',
          bg: 'bg-transparent', 
          border: 'border-white/10', 
          ctaColor: 'border-amber-400 text-amber-400 bg-transparent border cursor-not-allowed opacity-80',
          step: 3,
          icon: Activity
        }
      case 'IN_PROGRESS':
        return { 
          label: 'IN PROGRESS', 
          cta: 'Continue Assessment', 
          color: 'text-coral', 
          dot: 'bg-coral',
          bg: 'bg-coral/5', 
          border: 'border-coral/20', 
          ctaColor: 'bg-coral text-black hover:bg-coral/90',
          step: 2,
          icon: Zap
        }
      default:
        return { 
          label: 'INITIALIZE', 
          cta: 'Begin Assessment', 
          color: 'text-zinc-500', 
          dot: 'bg-zinc-800',
          bg: 'bg-white/[0.02]', 
          border: 'border-white/10', 
          ctaColor: 'border border-coral text-coral hover:bg-coral/10 bg-transparent',
          step: 1,
          icon: ArrowRight
        }
    }
  }

  const styles = getStatusStyles(effectiveStatus)

  const cardContent = (
    <div 
      className={cn(
        "h-full flex flex-col justify-between p-6 transition-all duration-500 relative group",
        styles.bg,
        styles.border,
        "border",
        isActuallyUnlocked ? "opacity-100" : "opacity-60 grayscale-[0.5]"
      )}
    >
      {/* Lock Overlay for Non-Admins */}
      {!isActuallyUnlocked && (
        <div className="absolute inset-0 bg-[#0A0A0A]/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <div className="w-4 h-4 text-white/40">🔒</div>
            </div>
            <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">
              Calibration Required
            </span>
          </div>
        </div>
      )}
      
      {/* Status Indicators Row - Page 5/8 Wireframe Alignment */}
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={cn(
                "h-1.5 w-6 rounded-full transition-all duration-500",
                s <= (styles.step || 1) 
                  ? styles.dot 
                  : "bg-white/5"
              )} 
            />
          ))}
          <span className={cn("text-[9px] font-bold tracking-[0.2em] ml-2 uppercase", styles.color)}>
            Status 0{styles.step}
          </span>
        </div>
        
        <Badge variant="outline" className={cn("border-white/5 text-[8px] tracking-[0.2em] uppercase px-2 h-5 font-bold", styles.color)}>
          {styles.label}
        </Badge>
      </div>

      {/* Header Row: Title + Icon */}
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 bg-white/[0.02] text-white/40 group-hover:text-white group-hover:border-white/10 transition-all", styles.color && "group-hover:text-current")}>
            <Icon size={18} />
          </div>
          <h3 className="text-xl font-black font-big-shoulders italic uppercase tracking-wider text-white">
            {title}
          </h3>
        </div>
        
        {/* Tooltip */}
        <div className="relative group/help z-50">
            <HelpCircle 
              size={14} 
              className="text-white/20 hover:text-coral transition-colors cursor-help"
            />
            <div className="absolute bottom-full right-0 mb-3 w-48 p-3 bg-zinc-900 border border-white/10 rounded-xl shadow-xl opacity-0 group-hover/help:opacity-100 transition-opacity pointer-events-none z-[60]">
              <p className="text-[10px] text-zinc-400 font-inter leading-relaxed">
                {description}
              </p>
            </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-500 font-inter leading-relaxed max-w-[90%]">
        {description}
      </p>

      {/* Action Button */}
      <div className="mt-auto pt-4">
        {!isUnlocked ? (
          <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/20 text-xs font-mono uppercase tracking-widest cursor-not-allowed w-fit">
            Locked
          </div>
        ) : (
          <div className="w-full">
            {(effectiveStatus === 'PUBLISHED' || effectiveStatus === 'COMPLETED') && !isAdmin && !onClick ? (
              <Link 
                href={effectiveStatus === 'PUBLISHED' 
                  ? `/projects/${projectId}/strategy/${id}/results`
                  : `/strategy-iq/${projectId}/${id.toLowerCase()}/start?review=true`
                }
                className={cn(
                  "flex items-center justify-between px-6 py-3 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 w-full",
                  styles.ctaColor
                )}
              >
                <span>{styles.cta}</span>
                <styles.icon size={14} />
              </Link>
            ) : (
              <div 
                onClick={handleCardClick}
                data-url={dataUrl}
                className={cn(
                  "flex items-center justify-between px-6 py-3 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 w-full",
                  styles.ctaColor,
                  // Admin Override Styles for Disabled States
                  isAdmin && (effectiveStatus === 'UNDER_REVIEW' || effectiveStatus === 'COMPLETED' || effectiveStatus === 'PUBLISHED') && 
                  "opacity-100 cursor-pointer border-coral/50 text-coral hover:bg-coral/10"
                )}
              >
                <span>{isAdmin && (effectiveStatus === 'PUBLISHED' || effectiveStatus === 'COMPLETED') ? "Begin Assessment" : (ctaOverride || styles.cta)}</span>
                <styles.icon size={14} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  if ((effectiveStatus === 'PUBLISHED' || effectiveStatus === 'COMPLETED') && !onClick) {
    return cardContent
  }

  return (
    <div className="w-full cursor-pointer" onClick={handleCardClick}>
      {cardContent}
    </div>
  )
}
