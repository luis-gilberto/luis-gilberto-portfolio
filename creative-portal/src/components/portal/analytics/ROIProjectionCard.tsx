"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, AlertCircle } from 'lucide-react'

interface ROIProjectionCardProps {
  budget: number
  improvement: number
  roiMultiplier: number
}

export function ROIProjectionCard({ budget, improvement, roiMultiplier }: ROIProjectionCardProps) {
  const netProfitDelta = (budget * (improvement / 100)) * roiMultiplier
  const costOfInaction = netProfitDelta * -1
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val)
  }

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-10 space-y-12 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
        <TrendingUp size={160} />
      </div>

      <div className="space-y-2 relative z-10">
        <span className="text-[10px] font-bold text-teal tracking-[0.4em] uppercase italic">Strategic Maturity Ledger</span>
        <h2 className="text-4xl font-black font-big-shoulders tracking-tight uppercase text-white italic">Multiplier Effect</h2>
      </div>

      <div className="space-y-10 relative z-10">
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Projected Net Profit Delta</label>
          <div className="flex items-baseline gap-4">
            <span className="text-6xl font-inter font-light tracking-tighter text-teal">
              +{formatCurrency(netProfitDelta)}
            </span>
            <span className="text-teal/40 font-big-shoulders italic text-xl">ANNUALIZED</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
          <div className="space-y-1">
            <label className="text-[8px] font-bold text-zinc-700 uppercase tracking-[0.2em]">Improvement Target</label>
            <p className="text-2xl font-big-shoulders font-bold text-white tracking-widest">{improvement}%</p>
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-bold text-zinc-700 uppercase tracking-[0.2em]">ROI Multiplier</label>
            <p className="text-2xl font-big-shoulders font-bold text-white tracking-widest">{roiMultiplier}x</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-coral/5 border border-coral/20 flex items-start gap-4 transition-all hover:bg-coral/[0.08]">
          <AlertCircle size={20} className="text-coral shrink-0 mt-1" />
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-coral uppercase tracking-[0.2em]">Cost of Inaction (COI)</label>
            <p className="text-lg font-inter font-medium text-coral tracking-tight">
              {formatCurrency(costOfInaction)}
            </p>
            <p className="text-[10px] text-coral/60 font-inter italic leading-relaxed">
              Potential capital leakage due to strategic fragmentation and operational drag.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
