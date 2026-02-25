"use client"

import React from 'react'
import { Target, Shield, Zap, LayoutDashboard } from 'lucide-react'

interface PortfolioPulseProps {
  averageScores: {
    gtm: number
    brand: number
    campaign: number
    creative: number
  }
}

export function PortfolioPulse({ averageScores }: PortfolioPulseProps) {
  const pillars = [
    { label: 'GTM', score: averageScores.gtm, icon: Target },
    { label: 'BRAND', score: averageScores.brand, icon: Shield },
    { label: 'OPS', score: averageScores.campaign, icon: Zap },
    { label: 'CREATIVE', score: averageScores.creative, icon: LayoutDashboard }
  ]

  const weakestPillar = [...pillars].sort((a, b) => a.score - b.score)[0]

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[8px] font-bold text-teal tracking-[0.3em] uppercase">Global Portfolio</span>
          <h3 className="text-xl font-bold font-big-shoulders tracking-widest text-white uppercase italic">Strategic Pulse</h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-coral/10 border border-coral/20">
          <span className="text-[8px] font-bold text-coral uppercase tracking-widest">Weakest Link: {weakestPillar.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {pillars.map((p) => (
          <div key={p.label} className="flex flex-col items-center gap-2">
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal transition-all duration-1000" 
                style={{ width: `${p.score}%` }} 
              />
            </div>
            <span className="text-[8px] font-bold text-white/40 tracking-widest">{p.label}</span>
            <span className="text-xs font-bold text-white font-big-shoulders italic">{p.score}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
