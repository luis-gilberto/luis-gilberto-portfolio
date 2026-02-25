"use client"

import React, { useState } from 'react'
import { StrategicRadar } from '@/components/portal/analytics/StrategicRadar'
import { ROIProjectionCard } from '@/components/portal/analytics/ROIProjectionCard'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Target, Zap, Shield } from 'lucide-react'

interface AnalyticsClientProps {
  isAdmin: boolean
  projects: any[]
  aggregatedScores: {
    gtm: number
    brand: number
    campaign: number
    creative: number
  }
}

export default function AnalyticsClient({ isAdmin, projects, aggregatedScores }: AnalyticsClientProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'all')
  
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0]
  const clientName = selectedProject?.client?.name || selectedProject?.client?.company || 'PARTNER'
  
  // Calculate specific scores for selected project or use aggregated
  const currentScores = selectedProjectId === 'all' && isAdmin 
    ? aggregatedScores 
    : {
        gtm: selectedProject?.assessmentSessions?.find((s: any) => s.assessmentType?.toLowerCase() === 'gtm')?.overallScore || 45,
        brand: selectedProject?.assessmentSessions?.find((s: any) => s.assessmentType?.toLowerCase() === 'brand')?.overallScore || 30,
        campaign: selectedProject?.assessmentSessions?.find((s: any) => s.assessmentType?.toLowerCase() === 'campaign')?.overallScore || 55,
        creative: selectedProject?.assessmentSessions?.find((s: any) => s.assessmentType?.toLowerCase() === 'creative')?.overallScore || 60,
      }

  const gapAnalysis = [
    { label: 'GTM Strategy', score: currentScores.gtm, icon: Target },
    { label: 'Brand Positioning', score: currentScores.brand, icon: Shield },
    { label: 'Campaign Ops', score: currentScores.campaign, icon: Zap },
    { label: 'Creative Direction', score: currentScores.creative, icon: LayoutDashboard }
  ].sort((a, b) => a.score - b.score)

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Task 5: Enforce Artifact Mode */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <Breadcrumbs 
            showBack={false}
            items={[
              { label: 'DASHBOARD', href: '/dashboard' },
              { label: 'STRATEGIC ANALYTICS', active: true }
            ]} 
          />
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-black font-big-shoulders tracking-tighter uppercase text-white italic">
              STRATEGIC MATURITY // {clientName.toUpperCase()}
            </h1>
            <Badge variant="outline" className="border-teal/20 text-teal bg-teal/5 text-[10px] tracking-[0.2em] font-bold uppercase py-1 px-3">
              Phase 8.1 // Ledger
            </Badge>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
            <button 
              onClick={() => setSelectedProjectId('all')}
              className={cn(
                "px-6 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all",
                selectedProjectId === 'all' ? "bg-teal text-black shadow-lg shadow-teal/20" : "text-white/40 hover:text-white"
              )}
            >
              Global Average
            </button>
            <select 
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent border-0 text-[10px] font-bold tracking-widest uppercase text-white/60 focus:ring-0 cursor-pointer px-4"
            >
              <option value="all" disabled>Select Project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id} className="bg-[#050505]">{p.title || p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Task 3: Layout Architecture (The Analytics Stage) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left (60%): The Strategic Radar */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-teal tracking-[0.4em] uppercase italic">Strategic Fingerprint</span>
            <h3 className="text-2xl font-bold font-big-shoulders tracking-widest text-white uppercase italic">Maturity Focus</h3>
          </div>
          <StrategicRadar scores={currentScores} />
        </div>

        {/* Right (40%): Gap Analysis & ROI */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-coral tracking-[0.4em] uppercase italic">Priority Identification</span>
              <h3 className="text-2xl font-bold font-big-shoulders tracking-widest text-white uppercase italic">Gap Analysis</h3>
            </div>
            
            <div className="space-y-4">
              {gapAnalysis.map((item, i) => (
                <div key={item.label} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group transition-all hover:bg-white/[0.04]">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-xl transition-colors",
                      i === 0 ? "bg-coral/10 text-coral" : "bg-white/5 text-white/20 group-hover:text-teal"
                    )}>
                      <item.icon size={18} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">{item.label}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                        {i === 0 ? 'CRITICAL DEFICIT' : 'ACTIVE THREAD'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-2xl font-bold font-big-shoulders tracking-widest italic leading-none",
                      i === 0 ? "text-coral" : "text-white"
                    )}>
                      {item.score}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ROIProjectionCard 
            budget={selectedProject?.marketingBudget || 250000}
            improvement={25}
            roiMultiplier={selectedProject?.roiMultiplier || 3.5}
          />
        </div>
      </div>

      {/* Secondary Row: Operational Velocity */}
      <div className="pt-12 border-t border-white/5 space-y-8">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-white/20 tracking-[0.4em] uppercase italic">Project Momentum</span>
          <h3 className="text-2xl font-bold font-big-shoulders tracking-widest text-white uppercase italic">Operational Velocity</h3>
        </div>

        <div className="relative h-24 bg-[#050505] rounded-2xl border border-white/5 p-8 flex items-center">
          {/* Progress Line */}
          <div className="absolute left-8 right-8 h-px bg-white/5 top-1/2 -translate-y-1/2" />
          <div 
            className="absolute left-8 h-px bg-teal top-1/2 -translate-y-1/2 transition-all duration-1000 shadow-[0_0_15px_rgba(46,211,198,0.3)]" 
            style={{ width: '65%' }} 
          />
          
          <div className="relative w-full flex justify-between">
            {['INTAKE', 'DISCOVERY', 'SYNTHESIS', 'STRATEGY', 'EXECUTION'].map((phase, i) => {
              const isActive = i <= 2
              const isCurrent = i === 2
              return (
                <div key={phase} className="flex flex-col items-center gap-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full border-2 border-[#050505] z-10 transition-all",
                    isCurrent ? "bg-teal scale-125 ring-4 ring-teal/20" : 
                    isActive ? "bg-teal/40" : "bg-zinc-800"
                  )} />
                  <span className={cn(
                    "text-[9px] font-bold tracking-[0.2em] uppercase",
                    isCurrent ? "text-teal" : isActive ? "text-white/40" : "text-zinc-700"
                  )}>
                    {phase}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
