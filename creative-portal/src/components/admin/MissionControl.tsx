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
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [now, setNow] = useState(new Date())

  const isAdmin = session?.user?.role === 'ADMIN'

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/mission-control')
      if (res.ok) {
        const data = await res.json()
        setQueue(data.queue)
        if (data.consultants) setConsultants(data.consultants)
      }
    } catch (error) {
      console.error('Failed to fetch mission control data', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Poll every minute
    const interval = setInterval(fetchData, 60000)
    
    // Timer tick every second
    const timer = setInterval(() => setNow(new Date()), 1000)

    return () => {
      clearInterval(interval)
      clearInterval(timer)
    }
  }, [])

  const handleAssign = async (sessionId: string, consultantId: string) => {
    try {
      const res = await fetch('/api/admin/assign-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, consultantId })
      })
      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Assignment failed', error)
    }
  }

  const handleTakeOver = async (sessionId: string) => {
    try {
      const res = await fetch('/api/admin/take-over', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Takeover failed', error)
    }
  }

  const getSLAStatus = (submittedAt: string) => {
    const submission = new Date(submittedAt)
    const deadline = new Date(submission.getTime() + 24 * 60 * 60 * 1000) // 24 hours
    const timeLeft = deadline.getTime() - now.getTime()
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    const isExpired = timeLeft < 0
    const isWarning = timeLeft < 12 * 60 * 60 * 1000 // 12 hours
    const isCritical = timeLeft < 1 * 60 * 60 * 1000 // 1 hour

    return {
      timeLeft,
      formatted: isExpired ? "SLA BREACHED" : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      isExpired,
      isWarning,
      isCritical
    }
  }

  if (isLoading) {
    return <div className="p-12 text-center text-white/40 animate-pulse">Initializing Mission Control...</div>
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-coral animate-pulse" />
            <h2 className="text-sm font-bold tracking-widest text-white/60 font-big-shoulders italic uppercase">
              Mission Control <span className="text-white/20 ml-2">/ Active Queue</span>
            </h2>
          </div>
          <p className="text-xs text-white/40 font-mono">
            {queue.length} Active Tickets // {isAdmin ? 'ADMIN OVERRIDE ENABLED' : 'CONSULTANT VIEW'}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchData} className="text-white/40 hover:text-white">
          <RefreshCw size={16} />
        </Button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {queue.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="p-12 rounded-2xl border border-white/5 bg-white/5 text-center"
            >
              <CheckCircle className="mx-auto text-teal mb-4" size={32} />
              <h3 className="text-lg font-medium text-white mb-2">All Clear</h3>
              <p className="text-white/40 text-sm">No pending assessments in the queue.</p>
            </motion.div>
          ) : (
            queue.map((item) => {
              const sla = getSLAStatus(item.updatedAt)
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "group relative grid grid-cols-12 gap-4 items-center p-6 rounded-xl border transition-all duration-300",
                    sla.isCritical ? "bg-coral/5 border-coral/50 shadow-[0_0_20px_rgba(249,111,110,0.1)]" :
                    sla.isWarning ? "bg-amber-500/5 border-amber-500/30" :
                    "bg-[#141414] border-white/10 hover:border-white/20"
                  )}
                >
                  {/* Status Indicator */}
                  <div className="col-span-1 flex justify-center">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      sla.isCritical ? "bg-coral animate-ping" :
                      sla.isWarning ? "bg-amber-500" :
                      "bg-teal"
                    )} />
                  </div>

                  {/* Client Info */}
                  <div className="col-span-3">
                    <h4 className="text-white font-bold text-sm tracking-wide">{item.client.name}</h4>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">{item.client.company || 'Unknown Corp'}</p>
                  </div>

                  {/* Project/Pillar */}
                  <div className="col-span-3">
                    <Badge variant="outline" className="mb-1 border-white/10 text-white/60 text-[9px]">
                      {item.assessmentType.toUpperCase()}
                    </Badge>
                    <p className="text-white/80 text-xs truncate">{item.project?.title || 'Strategic Discovery'}</p>
                  </div>

                  {/* SLA Timer */}
                  <div className="col-span-2 text-center">
                    <div className={cn(
                      "font-mono text-xl font-bold tracking-tight",
                      sla.isCritical ? "text-coral" :
                      sla.isWarning ? "text-amber-500" :
                      "text-teal"
                    )}>
                      {sla.formatted}
                    </div>
                    <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">SLA Remaining</p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex items-center justify-end gap-2">
                    {isAdmin && !item.consultantId && (
                      <div className="relative group/assign">
                        <select 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => handleAssign(item.id, e.target.value)}
                          value=""
                        >
                          <option value="" disabled>Assign...</option>
                          {consultants.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <Button variant="outline" size="sm" className="bg-transparent border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/40">
                          <UserPlus size={14} className="mr-2" /> Assign
                        </Button>
                      </div>
                    )}

                    {isAdmin && item.consultantId && sla.isWarning && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleTakeOver(item.id)}
                        className="bg-coral/10 text-coral border border-coral/20 hover:bg-coral hover:text-white"
                      >
                        <ShieldAlert size={14} className="mr-2" /> Take Over
                      </Button>
                    )}

                    <Button 
                      size="sm"
                      onClick={() => router.push(`/admin/projects/${item.projectId || 'active'}/strategy/${item.assessmentType}/results`)}
                      className={cn(
                        "transition-all",
                        sla.isCritical ? "bg-coral text-white hover:bg-coral/90" : "bg-white/10 text-white hover:bg-white/20"
                      )}
                    >
                      Review <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
