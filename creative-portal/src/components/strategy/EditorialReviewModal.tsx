"use client"

import React from "react"
import { 
  RefreshCw, 
  Lock, 
  Unlock, 
  CheckCircle,
  Eye
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
      <DialogContent className="max-w-4xl h-[100vh] md:h-auto bg-[#0F0F0F] border-white/10 text-white p-0 overflow-hidden font-inter">
        <DialogHeader className="p-6 md:p-8 border-b border-white/5">
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

        <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] md:h-[550px] overflow-y-auto md:overflow-hidden pb-[120px] md:pb-0">
          {/* Certified Narrative Side */}
          <div className="order-1 md:order-2 w-full md:w-1/2 p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-l border-white/5">
            <div className="flex items-center justify-between mb-4">
              <Label className={cn(
                "text-[10px] font-bold tracking-[0.2em]",
                isRevisionMode ? "text-coral" : "text-teal"
              )}>
                {isRevisionMode ? 'Revising narrative' : (viewOnly ? 'Certified strategy' : 'Certified narrative')}
              </Label>
              {(viewOnly && !isRevisionMode) && (
                <Badge className="bg-teal/10 text-teal border-teal/20 text-[8px] tracking-widest px-2 h-5">
                  Final asset
                </Badge>
              )}
            </div>
            <div className={cn(
              "flex-1 rounded-2xl p-6 transition-all min-h-[300px] md:min-h-0 overflow-y-auto",
              isRevisionMode ? "bg-coral/[0.02] border border-coral/30 shadow-[0_0_20px_rgba(249,111,110,0.05)]" : (
                viewOnly ? "bg-teal/[0.02] border border-teal/10" : "bg-white/[0.03] border-white/10 focus-within:border-teal/50"
              )
            )}>
              {viewOnly && !isRevisionMode ? (
                <div className="prose prose-invert max-w-none whitespace-pre-wrap text-zinc-300 text-lg leading-relaxed prose-strong:text-white prose-strong:font-bold prose-p:mb-4 prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-2 prose-li:pl-2 prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:space-y-2 prose-li:marker:text-teal">
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
                    "w-full h-full bg-transparent border-none focus-visible:ring-0 p-0 text-sm md:text-base leading-[1.75] font-sans resize-none whitespace-pre-wrap",
                    (viewOnly && !isRevisionMode) ? "text-white/90" : "text-white/70"
                  )}
                  placeholder="Finalize the narrative for the Partner Vault..."
                />
              )}
            </div>
          </div>

          {/* AI Draft / Reference Side */}
          <div className="order-2 md:order-1 w-full md:w-1/2 border-r border-white/5 p-6 md:p-8 overflow-y-auto bg-black/20 opacity-60 md:opacity-100">
            <div className="space-y-6">
              <div>
                <h4 className="text-[9px] md:text-[10px] font-bold text-white/20 tracking-[0.2em] mb-4">AI draft intelligence (Reference)</h4>
                <div className="space-y-4">
                  {isGenerating ? (
                    <div className="space-y-3 animate-pulse">
                      {[1,2,3,4].map(i => <div key={i} className="h-4 bg-white/5 rounded w-full" />)}
                    </div>
                  ) : (
                    <div className="text-xs md:text-sm text-white/50 md:text-white/70 leading-relaxed font-inter italic space-y-4 prose prose-invert max-w-none text-zinc-300 prose-p:mb-4 prose-strong:text-white prose-strong:font-bold prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-2 prose-li:pl-2 prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:space-y-2 prose-li:marker:text-teal">
                      {reviewSession?.briefSummary ? (
                        <ReactMarkdown>
                          {(() => {
                            const parsed = safeJsonParse(reviewSession.briefSummary)
                            if (Array.isArray(parsed)) return parsed.join('\n\n')
                            if (typeof parsed === 'object' && parsed !== null) return Object.values(parsed).join('\n\n')
                            return parsed || ""
                          })()}
                        </ReactMarkdown>
                      ) : "Initializing intelligence..."}
                    </div>
                  )}
                </div>
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
