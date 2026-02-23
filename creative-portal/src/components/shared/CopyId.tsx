"use client"

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyIdProps {
  id: string
  label?: string
  className?: string
  truncate?: boolean
}

export function CopyId({ id, label, className, truncate = false }: CopyIdProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("flex items-center gap-2 group", className)}>
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-inter">
          {label}
        </span>
      )}
      <div 
        onClick={handleCopy}
        className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-1.5 py-0.5 rounded transition-colors"
        title="Click to copy ID"
      >
        <span className={cn(
          "font-mono text-xs text-[#9CA3AF]", 
          truncate ? "truncate max-w-[100px]" : ""
        )}>
          {id}
        </span>
        {copied ? (
          <Check size={12} className="text-[#2ED3C6]" />
        ) : (
          <Copy size={12} className="text-[#2ED3C6] opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  )
}
