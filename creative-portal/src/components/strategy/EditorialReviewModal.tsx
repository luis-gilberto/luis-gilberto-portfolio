"use client"

import React from "react"
import { 
  RefreshCw, 
  Lock, 
  Unlock, 
  CheckCircle,
  Eye,
  Bold,
  Italic,
  Underline,
  List,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { safeJsonParse } from "@/lib/json-utils"

interface EditorialReviewModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  reviewSession: any
  currentUser: any
  project: any
  consultantAnalysis: string
  setConsultantAnalysis: (val: string) => void
  isRevisionMode: boolean
  setIsRevisionMode: (val: boolean) => void
  viewOnly: boolean
  setViewModeOnly: (val: boolean) => void
  isGenerating: boolean
  isPublishing: boolean
  handleUnlock: () => void
  handlePublish: () => void
}

export function EditorialReviewModal({
  isOpen,
  onOpenChange,
  reviewSession,
  currentUser,
  project,
  consultantAnalysis,
  setConsultantAnalysis,
  isRevisionMode,
  setIsRevisionMode,
  viewOnly,
  setViewModeOnly,
  isGenerating,
  isPublishing,
  handleUnlock,
  handlePublish
}: EditorialReviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] w-[95vw] h-[90vh] bg-[#0A0A0A] border-white/10 text-white p-0 overflow-hidden font-inter flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        <DialogHeader className="p-6 md:p-8 border-b border-white/5 bg-black/40">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
              <span className="md:hidden text-[10px] font-bold text-white/20 tracking-[0.2em]">Editorial review</span>
              <Badge className={cn(
                "border-none text-[9px] md:text-[10px] tracking-widest px-2 md:px-3 py-0.5 md:py-1 w-fit",
                isRevisionMode ? "bg-coral/20 text-coral" : "bg-teal/20 text-teal"
              )}>
                {isRevisionMode ? 'Revision mode' : 'Editorial review'}
              </Badge>
              <DialogTitle className="text-2xl md:text-3xl font-big-shoulders font-bold tracking-widest italic">
                {reviewSession?.assessmentType?.toUpperCase() || 'Strategic'} narrative
              </DialogTitle>
            </div>
            
            {currentUser.role === 'ADMIN' && reviewSession?.status?.toUpperCase() === 'PUBLISHED' && !isRevisionMode && (
              <Button 
                variant="outline" 
                onClick={handleUnlock}
                className="border-white/10 text-white/40 hover:text-white hover:border-coral/50 hover:bg-coral/5 transition-all text-[10px] font-bold tracking-widest md:px-4"
                size={viewOnly ? "icon" : "default"}
              >
                <Lock size={14} className={cn(viewOnly ? "" : "mr-2")} />
                <span className="hidden md:inline">Unlock for revision</span>
              </Button>
            )}
            {isRevisionMode && (
              <Badge variant="outline" className="border-coral/50 text-coral animate-pulse text-[10px] font-bold tracking-widest px-4 py-1">
                <Unlock size={14} className="mr-2" /> Live editing
              </Badge>
            )}
          </div>
          <DialogDescription className="text-white/40 italic text-xs md:text-sm hidden md:block">
            {isRevisionMode 
              ? "You are currently editing a published asset. Changes will not be live until you Re-Publish." 
              : `Refine the strategic synthesis for ${project.client?.name || 'Partner'}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT COLUMN (65%): AI GENERATED STRATEGY NARRATIVE */}
          <div className="w-full md:w-[65%] h-full flex flex-col p-6 md:p-10 overflow-y-auto border-r border-white/5 bg-black/20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-teal tracking-[0.3em] uppercase">Document Container</span>
                <h4 className="text-sm font-bold text-white/60 tracking-widest uppercase italic font-big-shoulders">AI Generated Strategy Narrative</h4>
              </div>
              <Badge variant="outline" className="border-white/10 text-white/20 text-[8px] tracking-widest uppercase px-2">
                Artifact Mode
              </Badge>
            </div>

            <div className={cn(
              "flex-1 rounded-xl p-8 transition-all min-h-[400px] border border-white/5",
              isRevisionMode ? "bg-coral/[0.02] border-coral/20 shadow-[0_0_40px_rgba(249,111,110,0.03)]" : "bg-white/[0.01]"
            )}>
              {viewOnly && !isRevisionMode ? (
                <div className="prose prose-invert max-w-none whitespace-pre-wrap text-zinc-300 text-lg leading-relaxed prose-strong:text-white prose-strong:font-bold prose-p:mb-6 prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6 prose-ul:space-y-3 prose-li:pl-2 prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-6 prose-ol:space-y-3 prose-li:marker:text-teal font-inter">
                  <ReactMarkdown>
                    {consultantAnalysis}
                  </ReactMarkdown>
                </div>
              ) : (
                <Textarea 
                  name="certifiedNarrative"
                  value={consultantAnalysis}
                  onChange={(e) => setConsultantAnalysis(e.target.value)}
                  readOnly={viewOnly && !isRevisionMode}
                  className={cn(
                    "w-full h-full bg-transparent border-none focus-visible:ring-0 p-0 text-base md:text-lg leading-[1.8] font-inter resize-none whitespace-pre-wrap",
                    (viewOnly && !isRevisionMode) ? "text-white/90" : "text-white/70"
                  )}
                  placeholder="Synthesizing strategic intelligence..."
                />
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (35%): EDIT PANEL */}
          <div className="w-full md:w-[35%] h-full flex flex-col bg-[#0A0A0A] overflow-y-auto border-l border-white/5">
            <div className="p-6 md:p-8 space-y-10">
              {/* Formatting Tools Section — NOW AT THE TOP */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-teal" />
                    <h4 className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">Edit Panel // Tools</h4>
                  </div>
                  <Badge variant="outline" className="border-white/5 text-[8px] text-zinc-600 uppercase tracking-widest">v1.0</Badge>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: Bold, label: 'Bold' },
                    { icon: Italic, label: 'Italic' },
                    { icon: Underline, label: 'Under' },
                    { icon: List, label: 'List' },
                    { icon: Type, label: 'H1' },
                    { icon: AlignLeft, label: 'Left' },
                    { icon: AlignCenter, label: 'Center' },
                    { icon: AlignRight, label: 'Right' }
                  ].map((tool) => (
                    <Button 
                      key={tool.label}
                      variant="outline" 
                      size="sm"
                      className="h-12 border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-teal/30 text-white/40 hover:text-teal flex flex-col items-center justify-center gap-1 transition-all group"
                    >
                      <tool.icon size={14} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[7px] font-bold tracking-widest uppercase">{tool.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Strategy Context Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-coral" />
                  <h4 className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">Strategic Context</h4>
                </div>
                
                <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] space-y-4">
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Active Client</span>
                    <p className="text-xs text-white/80 font-medium uppercase tracking-wider">{project.client?.name || project.client?.company || 'Partner'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Dimension</span>
                    <p className="text-xs text-white/80 font-medium uppercase tracking-wider">{reviewSession?.assessmentType} Strategy</p>
                  </div>
                </div>
              </div>

              {/* Protocol Section */}
              <div className="space-y-4 pt-10 mt-10 border-t border-white/5">
                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-700 tracking-widest uppercase">
                  <span>Protocol</span>
                  <span className="text-white/20">StrategyIQ v1.0 Standard</span>
                </div>
                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-700 tracking-widest uppercase">
                  <span>Status</span>
                  <span className="text-teal/40">Editorial Review</span>
                </div>
              </div>
              
              {/* Note about Floating Comm Link */}
              <div className="pt-20 opacity-20 border-t border-white/5">
                <p className="text-[9px] text-zinc-600 font-inter italic leading-relaxed text-center uppercase tracking-widest">
                  Canvas De-obstruction Protocol Active.<br/>
                  Floating Comm Link localized to bottom-right.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="fixed md:static bottom-0 left-0 right-0 p-6 md:p-8 border-t border-white/5 bg-black/60 md:bg-black/40 backdrop-blur-xl md:backdrop-blur-none z-50">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/30 hover:text-white tracking-widest text-[10px] font-bold">Cancel</Button>
          {(!viewOnly || isRevisionMode) && (
            <Button 
              onClick={handlePublish}
              disabled={isPublishing || isGenerating}
              className={cn(
                "tracking-[0.2em] text-[10px] font-black h-12 px-6 md:px-10 rounded-full ml-4 flex-1 md:flex-none",
                isRevisionMode ? "bg-coral hover:bg-coral/90 text-white" : "bg-teal hover:bg-teal/90 text-black"
              )}
            >
              {isPublishing ? <RefreshCw className="animate-spin mr-2" /> : <CheckCircle className="mr-2" size={16} />}
              <span className="hidden md:inline">{isRevisionMode ? 'Update & re-publish' : 'Finalize & publish'}</span>
              <span className="md:hidden">Finalize</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
