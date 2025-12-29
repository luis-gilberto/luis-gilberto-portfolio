import React from "react"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  variant?: "dev" | "beta"
  className?: string
}

export default function StatusBadge({ variant = "dev", className }: StatusBadgeProps) {
  const variants = {
    dev: "text-gray-500 border-gray-700 bg-black/50",
    beta: "text-coral-400 border-coral-500/30 bg-coral-500/10",
  }

  const content = {
    dev: "IN DEVELOPMENT",
    beta: "BETA",
  }

  return (
    <span className={cn(
      "text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border inline-block",
      variants[variant],
      className
    )}>
      {content[variant]}
    </span>
  )
}
