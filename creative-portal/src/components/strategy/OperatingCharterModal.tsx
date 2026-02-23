'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, ScrollText, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OperatingCharterModalProps {
  isOpen: boolean
  onClose: () => void
}

const ARTICLES = [
  {
    id: 'Article I',
    title: 'Constraint Supremacy',
    content: 'All strategic recommendations must prioritize identified constraints over expansionist ideals. We do not ignore bottlenecks; we solve for them.'
  },
  {
    id: 'Article II',
    title: 'Human Authority',
    content: 'The Seal of Authority signifies a human strategist has validated every data point. AI is the engine, but the Partner is the Pilot.'
  },
  {
    id: 'Article III',
    title: 'Refusal as a Feature',
    content: 'We reserve the right to advise against specific actions, even if requested. Strategic refusal is the highest form of advisory value.'
  },
  {
    id: 'Article IV',
    title: 'The Hybrid Equation',
    content: 'Strategic DNA = (Human Context + Client Data) × AI Synthesis. Bypassing any variable in this equation invalidates the advisory grade.'
  },
  {
    id: 'Article V',
    title: 'Data Sovereignty',
    content: 'Client intel is treated with sovereign sanctity. We do not train external models on your proprietary strategic advantages.'
  },
  {
    id: 'Article VI',
    title: 'Economic Precision',
    content: 'Every recommendation must have a clear path to economic impact. If it doesn\'t move the needle, it doesn\'t make the brief.'
  },
  {
    id: 'Article VII',
    title: 'The Gold Standard',
    content: 'The Portal ecosystem operates on the Gold Standard of high-tier advisory. Every artifact must meet the Architect\'s Verdict of quality.'
  }
]

export function OperatingCharterModal({ isOpen, onClose }: OperatingCharterModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 md:p-12 pb-6 border-b border-white/5 flex items-start justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center text-teal shadow-[0_0_20px_rgba(46,211,198,0.1)]">
                    <Shield size={24} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white font-big-shoulders tracking-[0.2em] uppercase italic">
                    StrategyIQ™ Charter
                  </h2>
                </div>
                <p className="text-zinc-500 font-inter text-sm md:text-base italic max-w-xl">
                  The foundational governance of our Strategic Partnership. Articles of intelligence, authority, and trust.
                </p>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar">
              {ARTICLES.map((article, idx) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="space-y-4 group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-teal tracking-[0.3em] uppercase opacity-50">
                      {article.id}
                    </span>
                    <div className="h-px flex-1 bg-white/5 group-hover:bg-teal/20 transition-colors" />
                  </div>
                  <div className="pl-0 md:pl-4 space-y-2">
                    <h3 className="text-xl md:text-2xl font-bold text-white font-big-shoulders tracking-widest uppercase italic">
                      {article.title}
                    </h3>
                    <p className="text-zinc-400 font-inter text-sm md:text-base leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {/* Seal Footer */}
              <div className="pt-12 mt-12 border-t border-white/5 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full border border-teal/20 flex items-center justify-center text-teal/40">
                  <ScrollText size={32} />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-zinc-600 tracking-[0.5em] uppercase">
                    Formalized // Strategic Discovery
                  </p>
                  <div className="flex items-center gap-2 text-teal font-inter text-xs font-bold uppercase tracking-widest">
                    <CheckCircle2 size={14} />
                    Active Protocol v5.7
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer Action */}
            <div className="p-8 border-t border-white/5 bg-black/50">
              <Button
                onClick={onClose}
                variant="strategy-primary"
                className="w-full h-14 text-[10px] font-bold tracking-[0.2em] uppercase"
              >
                Accept Operating Terms
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
