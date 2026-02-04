"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { PartnerResource } from "@/lib/partnerResources"
import { CheckCircle2, Zap, Quote } from "lucide-react"

interface ResourceDrawerProps {
  resource: PartnerResource | null
  isOpen: boolean
  onClose: () => void
}

export function ResourceDrawer({ resource, isOpen, onClose }: ResourceDrawerProps) {
  if (!resource) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-portal-bg/95 backdrop-blur-2xl border-white/10 text-white p-0 overflow-hidden">
        <DialogHeader className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-coral/20 text-coral border-none text-[10px] uppercase tracking-widest px-3 py-1">
              Knowledge Asset
            </Badge>
          </div>
          <DialogTitle className="text-4xl font-big-shoulders font-bold tracking-widest uppercase italic">
            {resource.title}
          </DialogTitle>
          <DialogDescription className="text-white/40 font-inter italic text-lg">
            {resource.subtext}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] p-8">
          <div className="space-y-12 pb-8">
            {/* Overview Section */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Strategic Overview</h4>
              <p className="text-lg leading-relaxed text-white/80 font-inter">
                {resource.content.overview}
              </p>
            </div>

            {/* Pull Quote */}
            {resource.content.quote && (
              <div className="relative py-8 border-y border-white/5">
                <Quote className="absolute -top-4 left-0 text-coral opacity-20 w-12 h-12" />
                <p className="text-3xl font-serif italic text-white/90 text-center px-12">
                  "{resource.content.quote}"
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Key Takeaways */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-teal uppercase tracking-[0.2em]">Key Takeaways</h4>
                <div className="space-y-4">
                  {resource.content.keyTakeaways.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start group">
                      <CheckCircle2 className="text-teal shrink-0 mt-1 w-4 h-4 group-hover:scale-110 transition-transform" />
                      <p className="text-sm text-white/60 leading-relaxed font-inter group-hover:text-white/90 transition-colors">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-coral uppercase tracking-[0.2em]">Action Items</h4>
                <div className="space-y-4">
                  {resource.content.actionItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start group">
                      <Zap className="text-coral shrink-0 mt-1 w-4 h-4 group-hover:animate-pulse" />
                      <p className="text-sm text-white/60 leading-relaxed font-inter group-hover:text-white/90 transition-colors">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
