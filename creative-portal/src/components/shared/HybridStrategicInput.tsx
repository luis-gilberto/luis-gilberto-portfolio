"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface HybridStrategicInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  inspiration: string[]
  placeholder?: string
  minChars?: number
}

export function HybridStrategicInput({
  label,
  value,
  onChange,
  inspiration,
  placeholder = "Select from examples or enter your own goal...",
  minChars = 10
}: HybridStrategicInputProps) {
  const isValid = value.length >= minChars || inspiration.some(pill => value.includes(pill))
  const charCount = value.length

  const togglePill = (pill: string) => {
    if (value.includes(pill)) {
      // Remove pill if it exists (with optional trailing space/newline)
      const newValue = value.replace(new RegExp(`${pill}\\s*\\n?`, 'g'), '').trim()
      onChange(newValue)
    } else {
      // Add pill
      const newValue = value ? `${value}\n${pill}` : pill
      onChange(newValue)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h4 className="text-[1.2rem] font-extrabold text-white font-big-shoulders tracking-wider">
          {label}
        </h4>
      </div>

      {/* Inspiration Pills */}
      <div className="flex flex-wrap gap-2">
        {inspiration.map((pill) => {
          const isSelected = value.includes(pill)
          return (
            <button
              key={pill}
              type="button"
              onClick={() => togglePill(pill)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border",
                isSelected
                  ? "bg-teal/20 border-teal text-teal shadow-[0_0_10px_rgba(46,211,198,0.2)]"
                  : "bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white"
              )}
            >
              {pill}
            </button>
          )
        })}
      </div>

      {/* Custom Textarea */}
      <div className="space-y-2">
        <div className={cn(
          "relative transition-all duration-300",
          isValid ? "text-teal" : "text-coral"
        )}>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="bg-transparent border-none p-4 min-h-[120px] text-[rgba(255,255,255,0.85)] font-inter font-light text-[1.1rem] leading-[1.8] focus:ring-0 resize-none placeholder:text-white/20 placeholder:italic"
          />
        </div>
        
        {/* Footer: Count & Validation */}
        <div className="flex justify-between items-center px-1">
          <span className={cn(
            "text-[10px] font-mono tracking-widest uppercase",
            isValid ? "text-teal/60" : "text-coral/60"
          )}>
            {charCount} / {minChars} characters minimum
          </span>
          {isValid && (
            <span className="text-[10px] font-bold text-teal uppercase tracking-widest">
              Strategic Ready
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
