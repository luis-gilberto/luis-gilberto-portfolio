'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  HelpCircle, 
  AlertTriangle, 
  Lightbulb, 
  ChevronUp, 
  ChevronDown,
  Maximize2,
  Minimize2,
  Mic
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssessmentQuestion } from '@/lib/strategyData';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConsultantCopilotProps {
  question: AssessmentQuestion;
  selectedOptionValue: string | null;
  insight: string;
}

type ViewMode = 'track' | 'context';

export default function ConsultantCopilot({ 
  question, 
  selectedOptionValue,
  insight 
}: ConsultantCopilotProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('track');
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('ask');

  // Lock body scroll when mobile sheet is expanded
  useEffect(() => {
    if (isMobileExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileExpanded]);

  const toggleMobileExpand = () => setIsMobileExpanded(!isMobileExpanded);

  const guide = question.consultantGuide;

  if (!guide) return null;

  // Shared Content Components
  const AskSection = () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-teal-400">
        <MessageSquare className="w-4 h-4" />
        <h4 className="font-big-shoulders font-bold text-sm tracking-wider">Ask this</h4>
      </div>
      <p className="font-inter text-sm text-gray-200 leading-relaxed italic">
        "{guide.script}"
      </p>
    </div>
  );

  const WhySection = () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-indigo-400">
        <HelpCircle className="w-4 h-4" />
        <h4 className="font-big-shoulders font-bold text-sm tracking-wider">Why this matters</h4>
      </div>
      <p className="font-inter text-xs text-gray-400 leading-relaxed">
        {guide.context}
      </p>
    </div>
  );

  const RedFlagsSection = () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-coral">
        <AlertTriangle className="w-4 h-4" />
        <h4 className="font-big-shoulders font-bold text-sm tracking-wider">Red flags</h4>
      </div>
      <ul className="list-disc list-inside space-y-1">
        {guide.redFlags?.map((flag, i) => (
          <li key={i} className="font-inter text-xs text-coral/80 leading-snug">
            {flag}
          </li>
        ))}
      </ul>
    </div>
  );

  const InsightSection = () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-amber-400">
        <Lightbulb className="w-4 h-4" />
        <h4 className="font-big-shoulders font-bold text-sm tracking-wider">
          {selectedOptionValue ? "Option insight" : "Strategic insight"}
        </h4>
      </div>
      <div className={cn(
        "p-3 rounded border transition-all duration-300",
        selectedOptionValue 
          ? "bg-teal-500/10 border-teal-500/30" 
          : "bg-white/5 border-teal-500/20"
      )}>
        <p className="font-inter text-xs text-gray-300 leading-relaxed">
          {insight || guide.insight}
        </p>
      </div>
    </div>
  );

  // Desktop Rail Content
  const DesktopContent = () => (
    <div className="h-full flex flex-col">
      {/* Header / Toggle */}
      <div className="p-4 border-b border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-400">
            <div className="p-1.5 rounded bg-teal-500/10">
              <Mic className="w-4 h-4" />
            </div>
            <span className="font-big-shoulders font-bold tracking-widest text-sm">Copilot live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 p-1 bg-white/5 rounded-lg border border-white/5">
          <button
            onClick={() => setViewMode('track')}
            className={cn(
              "py-1.5 px-3 rounded text-[10px] font-medium tracking-wider transition-all",
              viewMode === 'track' 
                ? "bg-teal-500 text-black shadow-lg" 
                : "text-gray-500 hover:text-gray-300"
            )}
          >
            Talk track
          </button>
          <button
            onClick={() => setViewMode('context')}
            className={cn(
              "py-1.5 px-3 rounded text-[10px] font-medium tracking-wider transition-all",
              viewMode === 'context' 
                ? "bg-teal-500 text-black shadow-lg" 
                : "text-gray-500 hover:text-gray-300"
            )}
          >
            Full context
          </button>
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <AskSection />
          
          <AnimatePresence>
            {viewMode === 'context' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden"
              >
                <div className="h-px bg-white/10 w-full" />
                <WhySection />
                <div className="h-px bg-white/10 w-full" />
                <RedFlagsSection />
                <div className="h-px bg-white/10 w-full" />
                <InsightSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );

  // Mobile Bottom Sheet Content
  const MobileContent = () => (
    <div className="flex flex-col h-full">
      {/* Handle */}
      <div 
        className="h-6 flex items-center justify-center cursor-pointer"
        onClick={toggleMobileExpand}
      >
        <div className="w-12 h-1 rounded-full bg-white/20" />
      </div>

      {/* Header */}
      <div className="px-4 pb-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-teal-500/10 text-teal-400">
            <Mic className="w-4 h-4" />
          </div>
          <span className="font-big-shoulders font-bold tracking-widest text-sm text-white">Consultant copilot</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-400 hover:text-white"
          onClick={toggleMobileExpand}
        >
          {isMobileExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </Button>
      </div>

      {/* Peek Content (Visible when collapsed) */}
      {!isMobileExpanded && (
        <div className="px-4 py-3" onClick={toggleMobileExpand}>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <MessageSquare className="w-3 h-3 text-teal-400" />
            <span className="truncate italic">"{guide.script}"</span>
          </div>
        </div>
      )}

      {/* Expanded Content */}
      <AnimatePresence>
        {isMobileExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-6"
          >
            <AskSection />
            <div className="h-px bg-white/10 w-full" />
            <WhySection />
            <div className="h-px bg-white/10 w-full" />
            <RedFlagsSection />
            <div className="h-px bg-white/10 w-full" />
            <InsightSection />
            
            {/* Extra padding for safe area */}
            <div className="h-8" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Rail */}
      <aside className="hidden lg:block w-full sticky top-[80px] h-[calc(100vh-100px)] border-l border-white/10 bg-[#050505]/70 backdrop-blur-[10px] rounded-xl overflow-hidden z-30">
        <DesktopContent />
      </aside>

      {/* Mobile Bottom Sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Scrim */}
        <AnimatePresence>
          {isMobileExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileExpanded(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
            />
          )}
        </AnimatePresence>

        {/* Sheet */}
        <motion.div
          animate={{ 
            height: isMobileExpanded ? '60vh' : '80px',
            backgroundColor: isMobileExpanded ? 'rgba(5,5,5,0.95)' : 'rgba(5,5,5,0.9)'
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative z-50 w-full border-t border-white/10 backdrop-blur-[10px]"
        >
          <MobileContent />
        </motion.div>
      </div>
    </>
  );
}
