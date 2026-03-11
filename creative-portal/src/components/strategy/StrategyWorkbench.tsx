'use client'

import React from 'react'
import { 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface StrategyWorkbenchProps {
  session: any
  projectId: string
  dimension: string
  clientName: string
}

export function StrategyWorkbench({ 
  session, 
  projectId, 
  dimension, 
  clientName 
}: StrategyWorkbenchProps) {
  // Staging Mode: Use static Node Map
  const nodeMap = {
    directive: { id: 'root', title: 'Reduce Customer Friction', type: 'directive' },
    workstreams: [
      { id: 'w1', title: 'UX Audit', status: 'In Progress' },
      { id: 'w2', title: 'API Integration', status: 'Pending' },
      { id: 'w3', title: 'Support Automation', status: 'Planned' },
    ]
  }

  return (
    <div className="w-full h-[600px] bg-[#0A0A0A] border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 flex gap-24 items-center h-full">
        {/* SVG Overlay for the Hardwired Fork (Surgically Corrected Origin) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
          {/* 1. Vertical Stem: Card Bottom Center to Junction Center (10px Distance) */}
          <line 
            x1="128" y1="348" 
            x2="128" y2="358" 
            stroke="#2ED3C6" 
            strokeWidth="1.5" 
            style={{ filter: 'drop-shadow(0 0 10px rgba(46, 211, 198, 0.6))' }} 
          />
          
          {/* 2. Junction Node: The Power Source & Branch Origin (Centered) */}
          <circle 
            cx="128" cy="358" r="3" 
            fill="#2ED3C6" 
            style={{ filter: 'drop-shadow(0 0 10px rgba(46, 211, 198, 0.6))' }} 
          />
          
          {/* 3. Three Branches: All Originating Precisely from the Junction Center */}
          <path 
            d="M 128 358 L 360 164" 
            stroke="#2ED3C6" 
            strokeWidth="1.5" 
            strokeOpacity="0.7" 
            fill="none" 
            style={{ filter: 'drop-shadow(0 0 10px rgba(46, 211, 198, 0.6))' }} 
          />
          <path 
            d="M 128 358 L 360 300" 
            stroke="#2ED3C6" 
            strokeWidth="1.5" 
            strokeOpacity="0.7" 
            fill="none" 
            style={{ filter: 'drop-shadow(0 0 10px rgba(46, 211, 198, 0.6))' }} 
          />
          <path 
            d="M 128 358 L 360 436" 
            stroke="#2ED3C6" 
            strokeWidth="1.5" 
            strokeOpacity="0.7" 
            fill="none" 
            style={{ filter: 'drop-shadow(0 0 10px rgba(46, 211, 198, 0.6))' }} 
          />
        </svg>

        {/* Column 1: Strategic Directive Card */}
        <div className="flex flex-col items-center w-64 h-full justify-center relative">
          <div className="w-full p-6 bg-[#050505] border-[1.5px] border-teal rounded-lg shadow-[0_0_30px_rgba(46,211,198,0.25)] z-20" style={{ borderColor: '#3FFFEF' }}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-teal" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-teal font-bold">Strategic Directive</span>
            </div>
            <h3 className="text-xl font-semibold text-white font-inter">{nodeMap.directive.title}</h3>
          </div>
        </div>

        {/* Column 2: Workstreams */}
        <div className="flex flex-col gap-12 h-full justify-center">
          {nodeMap.workstreams.map((ws, i) => (
            <div key={ws.id} className="flex items-center gap-4 group h-[88px]">
              {/* Connector Dot (Termination Point) */}
              <div 
                className="w-2 h-2 rounded-full bg-teal shadow-[0_0_8px_rgba(46,211,198,0.8)] z-20" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(46, 211, 198, 0.4))' }}
              ></div>
              
              <div className="w-56 p-4 bg-white/[0.03] border border-white/10 rounded-md hover:bg-white/[0.06] transition-colors cursor-pointer">
                <h4 className="font-mono text-sm text-white mb-2 tracking-tight">{ws.title}</h4>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono border-white/20 text-white/60 tracking-widest uppercase">{ws.status}</Badge>
                  <ArrowRight className="w-3 h-3 text-white/40 group-hover:text-teal transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Workbench Controls - Standalone */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        <Button variant="outline" className="border-teal/50 text-teal bg-teal/5 hover:bg-teal/10 font-mono text-xs">
          <Zap className="w-3 h-3 mr-2" />
          Generate Action Plan
        </Button>
        <Button variant="ghost" className="text-white/40 hover:text-white font-mono text-xs">
          <RefreshCw className="w-3 h-3 mr-2" />
          Reset View
        </Button>
      </div>
    </div>
  )
}
