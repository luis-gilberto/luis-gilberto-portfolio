"use client"

import { useState, useEffect } from "react"
import { X, Save, Settings, CheckSquare, Square, List, Target, History } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StrategicConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveSuccess?: () => void
}

const CHANNELS = [
  "Paid Search (Google/Bing)",
  "Paid Social (Meta/LinkedIn)",
  "Organic Social",
  "Email Marketing",
  "Events & Field Marketing",
  "Content Marketing",
  "SEO / Organic Search",
  "Influencer / Affiliate"
]

export function StrategicConfigurationModal({ isOpen, onClose, onSaveSuccess }: StrategicConfigurationModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    objective: "",
    okrs: "",
    channels: [] as string[],
    ledger: ""
  })

  useEffect(() => {
    const saved = localStorage.getItem("lg_strategic_config") || localStorage.getItem("strategic_context")
    if (saved) {
      try {
        setFormData(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse strategic_context", e)
      }
    }
  }, [isOpen])

  const handleSave = () => {
    if (!formData.objective.trim()) {
      alert("Please define the Primary Business Objective.")
      return
    }

    setIsSaving(true)

    const configData = {
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'calibrated'
    }

    localStorage.setItem("lg_strategic_config", JSON.stringify(configData))
    localStorage.setItem("strategic_context", JSON.stringify(formData))

    setTimeout(() => {
      setIsSaving(false)
      if (onSaveSuccess) {
        onSaveSuccess()
      }
      onClose()
    }, 1000)
  }

  const toggleChannel = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            id="calibration-modal"
            className="relative w-full max-w-xl h-full bg-[#0A0A0A] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center text-coral">
                  <Settings size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-big-shoulders font-bold tracking-widest italic text-white uppercase">
                    Strategic Calibration
                  </h2>
                  <p className="text-[10px] text-white/40 tracking-[0.2em] font-black uppercase">
                    Configure System Architecture
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              
              {/* Primary Objective */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-coral">
                  <Target size={16} />
                  <label className="text-[11px] font-black tracking-[0.3em] uppercase">Primary Business Objective</label>
                </div>
                <textarea
                  id="config-objective"
                  value={formData.objective}
                  onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                  placeholder="Define the north star for this engagement..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-coral/50 focus:outline-none transition-all placeholder:text-white/10 italic font-inter"
                />
              </div>

              {/* Current OKRs */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-teal">
                  <List size={16} />
                  <label className="text-[11px] font-black tracking-[0.3em] uppercase">Current OKRs (Bullet Points)</label>
                </div>
                <textarea
                  id="config-okrs"
                  value={formData.okrs}
                  onChange={(e) => setFormData(prev => ({ ...prev, okrs: e.target.value }))}
                  placeholder="• Objective 1: Key Result...
• Objective 2: Key Result..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-teal/50 focus:outline-none transition-all placeholder:text-white/10 font-inter"
                />
              </div>

              {/* Channel Ecosystem */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-yellow-400">
                  <CheckSquare size={16} />
                  <label className="text-[11px] font-black tracking-[0.3em] uppercase">Channel Ecosystem</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 channel-ecosystem">
                  {CHANNELS.map(channel => (
                    <button
                      key={channel}
                      onClick={() => toggleChannel(channel)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                        formData.channels.includes(channel)
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-transparent border-white/5 text-white/40 hover:border-white/10"
                      )}
                    >
                      {formData.channels.includes(channel) ? <CheckSquare size={14} className="text-yellow-400" /> : <Square size={14} />}
                      <span className="text-[11px] font-bold tracking-wider">{channel}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* The Ledger */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-purple-400">
                  <History size={16} />
                  <label className="text-[11px] font-black tracking-[0.3em] uppercase">The Ledger (Past Wins/Failures)</label>
                </div>
                <textarea
                  value={formData.ledger}
                  onChange={(e) => setFormData(prev => ({ ...prev, ledger: e.target.value }))}
                  placeholder="What has worked before? What are the non-negotiables?"
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-purple-400/50 focus:outline-none transition-all placeholder:text-white/10 font-inter"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/10 bg-white/[0.01]">
              <Button
                id="btn-save-config"
                onClick={handleSave}
                disabled={isSaving}
                className={cn(
                  "w-full font-black tracking-[0.2em] py-6 rounded-xl transition-all shadow-lg group",
                  isSaving 
                    ? "bg-[#1BA6A6] text-white shadow-teal-900/20" 
                    : "bg-coral hover:bg-coral/90 text-black shadow-coral/20"
                )}
              >
                {isSaving ? (
                  <>CONFIGURATION SAVED ✓</>
                ) : (
                  <>
                    <Save size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                    SAVE CONFIGURATION
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
