"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Bot, 
  Zap, 
  Send,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface ProjectWarRoomProps {
  project: any
  currentUser: any
}

export default function ProjectWarRoom({ project, currentUser }: ProjectWarRoomProps) {
  // Staging Mode: Static Execution Data for State 4 Capture
  const milestones = [
    { id: 'm1', title: 'System Architecture', status: 'Completed', date: 'Oct 15' },
    { id: 'm2', title: 'Stress Testing', status: 'In Progress', date: 'Oct 30' },
    { id: 'm3', title: 'Global Rollout', status: 'Planned', date: 'Nov 15' },
  ]

  const copilotFeed = [
    { id: 'c1', message: 'System architecture aligned with Pillar 2. Proceeding to stress-test.', timestamp: 'Just now', type: 'system' },
    { id: 'c2', message: 'API Integration workstream initiated.', timestamp: '2h ago', type: 'system' },
  ]

  const [showResetConfirm, setShowResetConfirm] = useState(false)

  return (
    <div className="w-full h-full min-h-[600px] bg-[#0E0C0A] border border-white/10 rounded-xl overflow-hidden flex flex-col font-inter">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#050505]">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-teal text-teal bg-teal/10 font-mono text-[10px] tracking-widest">ACTIVE</Badge>
          <h3 className="text-white font-medium text-sm tracking-tight">Project: <span className="text-white/90">Reduce Customer Friction</span></h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">System ID: PROJ-8821</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Faint Background Track for Timeline */}
        <div className="absolute left-[47px] top-0 bottom-0 w-[1px] bg-white/[0.03] z-0"></div>

        {/* Left Column: Roadmap */}
        <div className="flex-1 border-r border-white/10 p-8 overflow-y-auto relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-mono text-[10px] uppercase text-white/40 tracking-[0.3em]">Execution Roadmap</h4>
            <div className="h-[1px] flex-1 mx-6 bg-white/5"></div>
          </div>
          
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={m.id} className="flex items-start gap-6 group">
                {/* Timeline Connector */}
                <div className="relative flex flex-col items-center pt-1 w-4">
                  <div className={`w-3.5 h-3.5 rounded-full border-[2.5px] transition-all duration-500 z-20 ${
                    m.status === 'Completed' ? 'bg-teal border-teal' : 
                    m.status === 'In Progress' ? 'bg-[#0E0C0A] border-teal' : 
                    'bg-[#0E0C0A] border-white/20'
                  }`} style={
                    m.status === 'Completed' ? { filter: 'drop-shadow(0 0 10px rgba(46, 211, 198, 0.6))' } :
                    m.status === 'In Progress' ? { filter: 'drop-shadow(0 0 10px rgba(244, 116, 113, 0.6))', borderColor: '#F47471' } : {}
                  }>
                    {m.status === 'In Progress' && (
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-[-4px] rounded-full border border-coral/50"
                      />
                    )}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className={`w-[2px] h-20 mt-2 z-10 ${
                      m.status === 'Completed' ? 'bg-teal/40' : 'bg-white/10'
                    }`}></div>
                  )}
                </div>
                
                <div className="flex-1 p-5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all duration-300">
                  <div className="space-y-1">
                    <h5 className={`text-sm font-medium tracking-tight font-inter ${m.status === 'Planned' ? 'text-white/30' : 'text-white/90'}`}>
                      {m.title}
                    </h5>
                    <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest">Target: {m.date}</p>
                  </div>
                  <Badge variant="outline" className={`font-mono text-[9px] tracking-[0.15em] px-3 py-1 ${
                    m.status === 'Completed' ? 'text-teal border-teal/30 bg-teal/5' : 
                    m.status === 'In Progress' ? 'text-coral border-coral/30 bg-coral/5' : 
                    'text-white/20 border-white/10'
                  }`} style={
                    m.status === 'Completed' ? { filter: 'drop-shadow(0 0 8px rgba(46, 211, 198, 0.4))' } :
                    m.status === 'In Progress' ? { filter: 'drop-shadow(0 0 8px rgba(244, 116, 113, 0.4))' } : {}
                  }>
                    {m.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Copilot Feed - Widened to 40% */}
        <div className="w-[40%] bg-[#080808] flex flex-col border-l border-white/5">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#050505]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal/10 flex items-center justify-center border border-teal/20 shadow-[0_0_15px_rgba(46,211,198,0.3)] group-hover:shadow-[0_0_20px_rgba(46,211,198,0.4)] transition-all">
                <Bot className="w-3.5 h-3.5 text-teal" style={{ filter: 'drop-shadow(0 0 5px rgba(46, 211, 198, 0.6))' }} />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Consultant Assistant</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 opacity-40">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-1 h-1 rounded-full bg-teal" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-1 h-1 rounded-full bg-teal" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-1 h-1 rounded-full bg-teal" />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse shadow-[0_0_8px_rgba(46,211,198,0.6)]"></div>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {copilotFeed.map((item) => (
                <div key={item.id} className="flex gap-4 animate-in fade-in slide-in-from-right-2 duration-500">
                  <div className="w-7 h-7 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_8px_rgba(46,211,198,0.15)]">
                    <Bot className="w-3.5 h-3.5 text-teal" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl rounded-tl-none shadow-sm relative group/msg">
                      <p className="text-xs text-white/70 leading-relaxed font-mono">
                        {item.message}
                      </p>
                    </div>
                    <span className="text-[9px] text-white/20 font-mono uppercase tracking-widest ml-1">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-white/10 bg-[#050505]">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                <motion.div 
                  animate={{ opacity: [1, 0, 1] }} 
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-[2px] h-4 bg-teal/50"
                />
              </div>
              <input 
                type="text" 
                placeholder="Request strategic adjustment from Assistant..." 
                className="w-full bg-[#0E0C0A] border border-white/10 rounded-xl py-3 pl-8 pr-12 text-[11px] text-white placeholder:text-white/10 focus:outline-none focus:border-teal/40 transition-all font-inter"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/5 group-focus-within:bg-teal group-focus-within:text-black transition-all cursor-pointer">
                <Send className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Dialog (Simple version for staging) */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="bg-[#0E0C0A] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-coral">
              Surgical Data Purge
            </DialogTitle>
            <DialogDescription className="text-white/40 text-sm pt-2">
              This action will permanently delete all strategic artifacts for this project.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-6">
            <Button variant="ghost" onClick={() => setShowResetConfirm(false)} className="text-white/40 hover:text-white">Cancel</Button>
            <Button className="bg-coral text-white hover:bg-coral/90">Confirm Purge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
