'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  UserPlus, 
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface QueueItem {
  id: string
  client: {
    name: string
    company: string | null
  }
  project: {
    title: string
  } | null
  projectId: string | null
  assessmentType: string
  status: string
  updatedAt: string
  consultantId: string | null
}

interface Consultant {
  id: string
  name: string
  email: string
}

export function MissionControl() {
  const { data: session } = useSession()
  const router = useRouter()
  // Staging Mode: Use static 4 Pillars
  const pillars = [
    { 
      id: 'p1', 
      title: 'Operational Scalability', 
      status: 'Active', 
      momentum: [10, 15, 13, 18, 20, 25, 24, 28, 30, 32], 
      delta: '+12%',
      owner: 'LG' 
    },
    { 
      id: 'p2', 
      title: 'Market Penetration', 
      status: 'Active', 
      momentum: [5, 8, 12, 10, 15, 18, 22, 25, 28, 35], 
      delta: '+8%',
      owner: 'LG' 
    },
    { 
      id: 'p3', 
      title: 'Talent Density', 
      status: 'Active', 
      momentum: [40, 38, 35, 36, 42, 45, 48, 50, 52, 55], 
      delta: '+24%',
      owner: 'HR' 
    },
    { 
      id: 'p4', 
      title: 'Ecosystem Integration', 
      status: 'Active', 
      momentum: [20, 22, 25, 28, 26, 30, 32, 35, 38, 40], 
      delta: '+15%',
      owner: 'IT' 
    },
  ]

  return (
    <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#080808]">
        <h3 className="font-mono text-xs uppercase tracking-widest text-white/90 font-bold">Strategic Pillars</h3>
        <Badge variant="outline" className="border-teal text-teal bg-teal/15 font-mono text-[10px] tracking-widest px-3 py-1" style={{ filter: 'drop-shadow(0 0 8px rgba(46, 211, 198, 0.4))' }}>SYSTEM ONLINE</Badge>
      </div>
      
      <div className="divide-y divide-white/5">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="px-6 py-5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-teal shadow-[0_0_8px_rgba(46,211,198,0.6)] animate-pulse"></div>
              <div>
                <h4 className="text-white font-semibold text-sm tracking-wide font-inter">{pillar.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Owner: {pillar.owner}</span>
                  <span className="text-[10px] font-mono text-teal font-bold tracking-widest">{pillar.delta}</span>
                </div>
              </div>
            </div>

            {/* Sparkline Visualization */}
            <div className="flex items-end gap-[3px] h-8 w-32 opacity-100">
              {pillar.momentum.map((val, i) => (
                <div 
                  key={i} 
                  className="w-full bg-teal group-hover:bg-teal/80 transition-all duration-300 rounded-[1px]"
                  style={{ 
                    height: `${(val / 60) * 100}%`,
                    filter: 'drop-shadow(0 0 8px rgba(46, 211, 198, 0.4))'
                  }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

