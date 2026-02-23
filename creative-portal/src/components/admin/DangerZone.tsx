
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/providers/toast-provider'
import { useRouter } from 'next/navigation'

interface DangerZoneProps {
  clientId: string
  clientName: string
}

export function DangerZone({ clientId, clientName }: DangerZoneProps) {
  const [showModal, setShowModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const isConfirmEnabled = confirmText.trim().toUpperCase() === 'DELETE' || confirmText.trim() === clientName

  const handlePurge = async () => {
    // Case-Sensitive Verification (Task 2) + Logic Fix (Task 1)
    if (!isConfirmEnabled) return

    setIsDeleting(true)
    try {
      // Use the actual clientId from props, not search params
      const response = await fetch(`/api/admin/purge-client?id=${clientId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Purge failed')
      }

      toast("SYSTEM ALERT", "Client record and all associated artifacts successfully purged.", "success")
      setShowModal(false)
      
      // Redirect after a brief delay to allow toast to be seen
      setTimeout(() => {
        router.push('/admin/clients')
        router.refresh() // Task 4: Ensure refresh
      }, 1500)

    } catch (error) {
      console.error(error)
      toast("CRITICAL ERROR", "Failed to purge client record. Check server logs.", "error")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="mt-12 border border-[#F96F6E] rounded-xl p-8 bg-transparent relative overflow-hidden group">
      {/* Background Pulse Effect */}
      <div className="absolute inset-0 bg-[#F96F6E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-[#F96F6E] mb-2">
            <AlertTriangle size={24} />
            <h2 className="text-2xl font-display font-bold italic uppercase tracking-wider">
              Danger Zone
            </h2>
          </div>
          <p className="text-[#F96F6E]/80 font-inter text-sm max-w-md">
            Irreversible Action: Purging this client will delete all projects, assessment data, and user accounts associated with this organization.
          </p>
          {/* Task 2: Display ID explicitly */}
          <p className="text-white/30 font-mono text-xs mt-2">
             TARGET ID: {clientId}
          </p>
        </div>

        <Button 
          onClick={() => setShowModal(true)}
          variant="outline"
          className="border-[#F96F6E] text-[#F96F6E] hover:bg-[#F96F6E] hover:text-black font-bold uppercase tracking-widest transition-all"
        >
          Purge Client Record
        </Button>
      </div>

      {/* Double-Lock Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#0A0A0A] border border-[#F96F6E] rounded-2xl p-8 shadow-[0_0_50px_rgba(249,111,110,0.2)]"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#F96F6E]/10 flex items-center justify-center mx-auto mb-4 text-[#F96F6E]">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-2xl font-display font-bold italic text-white uppercase mb-2">
                  Confirm Purge Protocol
                </h3>
                <p className="text-white/60 font-inter text-sm mb-4">
                  To confirm deletion of <span className="text-white font-bold">{clientName}</span>, please type <span className="text-[#F96F6E] font-mono">DELETE</span> or the client name below.
                </p>
                {/* Task 2: Explicit ID Verification in Modal */}
                <div className="bg-black/40 border border-white/10 rounded p-2 inline-block">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Target ID Verification</p>
                    <p className="text-xs text-[#F96F6E] font-mono">{clientId}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="bg-white/5 border-white/10 text-white text-center font-mono uppercase tracking-widest focus:border-[#F96F6E] focus:ring-[#F96F6E]"
                />

                <Button
                  onClick={handlePurge}
                  disabled={!isConfirmEnabled || isDeleting}
                  className="w-full bg-[#F96F6E] text-black hover:bg-[#F96F6E]/90 font-bold uppercase tracking-widest h-12"
                >
                  {isDeleting ? 'Purging System...' : 'Confirm Purge'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
