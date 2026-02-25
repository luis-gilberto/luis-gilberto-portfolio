'use client'

import React from 'react'
import { Check, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export type LifecycleStage = 1 | 2 | 3 | 4

interface Stage {
  id: LifecycleStage
  label: string
  title: string
}

const STAGES: Stage[] = [
  { id: 1, label: 'Stage 1', title: 'Identity' },
  { id: 2, label: 'Stage 2', title: 'Calibration' },
  { id: 3, label: 'Stage 3', title: 'Discovery' },
  { id: 4, label: 'Stage 4', title: 'Roadmap' }
]

interface LifecycleTrackerProps {
  currentStage: LifecycleStage
  completedStages: LifecycleStage[]
  onStageClick: (stage: LifecycleStage) => void
  isLocked?: (stage: LifecycleStage) => boolean
}

export function LifecycleTracker({ 
  currentStage, 
  completedStages, 
  onStageClick,
  isLocked = () => false
}: LifecycleTrackerProps) {
  return (
    <div className="w-full flex items-center justify-between gap-4 py-8 px-4 border-b border-white/5 bg-black/20">
      {STAGES.map((stage, idx) => {
        const isCompleted = completedStages.includes(stage.id)
        const isActive = currentStage === stage.id
        const locked = isLocked(stage.id)
        
        return (
          <React.Fragment key={stage.id}>
            <button
              onClick={() => !locked && onStageClick(stage.id)}
              disabled={locked}
              className={cn(
                "flex-1 flex flex-col items-start gap-2 group transition-all duration-300 relative",
                locked ? "opacity-30 cursor-not-allowed" : "opacity-100 cursor-pointer"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-500",
                  isCompleted 
                    ? "bg-teal border-teal text-black shadow-[0_0_15px_rgba(46,211,198,0.4)]" 
                    : (isActive 
                        ? "bg-transparent border-teal text-teal shadow-[0_0_10px_rgba(46,211,198,0.2)]" 
                        : "bg-transparent border-white/10 text-white/20")
                )}>
                  {isCompleted ? <Check size={12} strokeWidth={3} /> : stage.id}
                </div>
                
                <div className="flex flex-col items-start">
                  <span className={cn(
                    "text-[8px] font-bold tracking-[0.2em] uppercase transition-colors",
                    isActive ? "text-teal" : "text-white/20 group-hover:text-white/40"
                  )}>
                    {stage.label}
                  </span>
                  <h4 className={cn(
                    "text-[11px] font-bold tracking-[0.1em] uppercase transition-colors",
                    isActive ? "text-white" : "text-white/40 group-hover:text-white/60"
                  )}>
                    {stage.title}
                    {locked && <Lock size={10} className="inline ml-2 text-coral/60" />}
                  </h4>
                </div>
              </div>

              {isActive && (
                <motion.div 
                  layoutId="active-stage-bar"
                  className="absolute -bottom-[33px] left-0 right-0 h-[2px] bg-teal shadow-[0_0_10px_rgba(46,211,198,0.5)]" 
                />
              )}
            </button>
            
            {idx < STAGES.length - 1 && (
              <div className="w-12 h-px bg-white/5 hidden md:block" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
