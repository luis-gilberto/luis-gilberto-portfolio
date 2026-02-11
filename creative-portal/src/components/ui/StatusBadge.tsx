import React from "react"
import { cn } from "@/lib/utils"

export type StatusVariant = "NOT_STARTED" | "UNDER_REVIEW" | "PUBLISHED" | "IN_PROGRESS"

interface StatusBadgeProps {
  status: StatusVariant
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    NOT_STARTED: "text-zinc-500 border-zinc-800 bg-zinc-900/50",
    UNDER_REVIEW: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
    PUBLISHED: "text-teal border-teal/30 bg-teal/5",
    IN_PROGRESS: "text-coral border-coral/30 bg-coral/5",
  }

  const content = {
    NOT_STARTED: "NOT STARTED",
    UNDER_REVIEW: "UNDER REVIEW",
    PUBLISHED: "PUBLISHED",
    IN_PROGRESS: "IN PROGRESS",
  }

  return (
    <span className={cn(
      "text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-none border inline-block transition-all",
      variants[status] || variants.NOT_STARTED,
      className
    )}>
      {content[status] || status}
    </span>
  )
}
