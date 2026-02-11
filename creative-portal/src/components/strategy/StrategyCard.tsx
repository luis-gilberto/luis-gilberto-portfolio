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
  const [showHelp, setShowHelp] = useState(false)
  const [localCompleted, setLocalCompleted] = useState(false)

  useEffect(() => {
    const isCompleted = localStorage.getItem(`${id.toLowerCase()}_assessment_completed`) === 'true'
    setLocalCompleted(isCompleted)
  }, [id])

  const effectiveStatus = localCompleted && propStatus === "NOT_STARTED" ? "COMPLETED" : propStatus
  
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
          cta: 'VIEW STRATEGY', 
          color: 'text-[#2ED3C6]', 
          bg: 'bg-transparent', 
          border: 'border-[#2ED3C6]', 
          ctaColor: 'border-[#2ED3C6] text-[#2ED3C6] bg-transparent border hover:bg-[#2ED3C6]/10 transition-colors',
          isOutlined: true
        }
      case 'COMPLETED':
      case 'UNDER_REVIEW':
        return { 
          label: status === 'PUBLISHED' ? 'PUBLISHED' : 'UNDER REVIEW', 
          cta: 'REVIEW BRIEF', 
          color: 'text-amber-400', 
          bg: 'bg-transparent', 
          border: 'border-amber-400', 
          ctaColor: 'border-amber-400 text-amber-400 bg-transparent border hover:bg-amber-400/10 transition-colors',
          isOutlined: true
        }
      case 'IN_PROGRESS':
        return { 
          label: 'IN PROGRESS', 
          cta: 'RESUME', 
          color: 'text-coral', 
          bg: 'bg-coral/10', 
          border: 'border-coral/20', 
          ctaColor: 'bg-coral text-black',
          isOutlined: false
        }
      default:
        return { 
          label: 'NOT STARTED', 
          cta: 'INITIALIZE', 
          color: 'text-zinc-500', 
          bg: 'bg-white/5', 
          border: 'border-white/10', 
          ctaColor: 'bg-coral text-white',
          isOutlined: false
        }
    }
  }

  const styles = getStatusStyles(effectiveStatus)

  const cardContent = (
    <div className={cn(
      "group relative p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6",
      isDashboard ? "w-full" : "h-full",
      styles.isOutlined && "border-[#1BA6A6]/30",
      isUnlocked && "unlocked opacity-100",
      !isUnlocked && effectiveStatus === "NOT_STARTED" && "opacity-70"
    )}>
      <div className="flex items-center gap-6">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", styles.bg, styles.color)}>
          <Icon size={28} strokeWidth={1.5} />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-3 relative">
            <h3 className="text-xl font-bold text-white font-big-shoulders tracking-widest uppercase italic leading-none">
              {label}
            </h3>
            {effectiveStatus === 'COMPLETED' || effectiveStatus === 'PUBLISHED' ? (
              <CheckCircle2 size={14} className="text-teal" />
            ) : effectiveStatus === 'UNDER_REVIEW' ? (
              <Lock size={14} className="text-yellow-400" />
            ) : null}
            <button 
              onMouseEnter={() => setShowHelp(true)}
              onMouseLeave={() => setShowHelp(false)}
              onClick={(e) => { e.stopPropagation(); setShowHelp(!showHelp); }}
              className="text-white/10 hover:text-white/40 transition-colors"
            >
              <HelpCircle size={14} />
            </button>
            {showHelp && (
              <div className="absolute bottom-full left-0 mb-3 w-64 p-4 bg-[#0A0A0A] border border-white/10 rounded-2xl text-[11px] text-white/60 z-50 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("w-1 h-1 rounded-full", styles.color.startsWith('text-[#') ? `bg-[${styles.color.slice(5, -1)}]` : styles.color.replace('text-', 'bg-'))} />
                  <p className={cn("font-bold uppercase tracking-widest", styles.color)}>{label}</p>
                </div>
                <p className="font-inter leading-relaxed italic">
                  {info}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <span className={cn("text-[9px] font-black tracking-[0.2em] uppercase", styles.color)}>
              {styles.label}
            </span>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <p className="text-[11px] text-white/40 font-medium line-clamp-1 max-w-[200px]">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-0 border-white/5">
        {effectiveStatus === 'PUBLISHED' || effectiveStatus === 'COMPLETED' ? (
          <Link 
            href={effectiveStatus === 'PUBLISHED' 
              ? `/projects/${projectId}/strategy/${id}/results`
              : `/strategy-iq/${projectId}/${id.toLowerCase()}/start?review=true`
            }
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all hover:gap-3",
              styles.ctaColor
            )}
          >
            {styles.cta} <ArrowRight size={14} />
          </Link>
        ) : (
          <div 
            onClick={(e) => {
              if (onClick) {
                e.preventDefault()
                onClick()
              }
            }}
            data-url={dataUrl}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase cursor-pointer transition-all hover:gap-3",
              styles.ctaColor
            )}
          >
            {ctaOverride || styles.cta} <ArrowRight size={14} />
          </div>
        )}
      </div>

      {/* Background Texture */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
        <Icon size={120} />
      </div>
    </div>
  )

  if ((effectiveStatus === 'PUBLISHED' || effectiveStatus === 'COMPLETED') && !onClick) {
    return cardContent
  }

  return (
    <div className="w-full cursor-pointer" onClick={onClick}>
      {cardContent}
    </div>
  )
}
