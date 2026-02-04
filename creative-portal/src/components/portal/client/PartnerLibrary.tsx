'use client'

import { useEffect, useRef, useState } from 'react'
import { BookOpen, Zap, Users, Map } from 'lucide-react'
import gsap from 'gsap'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { partnerResources, PartnerResource } from '@/lib/partnerResources'
import { ResourceDrawer } from './ResourceDrawer'

const iconMap = {
  "deciphering-strategy-iq": BookOpen,
  "the-24-hour-review": Zap,
  "communication-protocol": Users,
  "next-steps-roadmap": Map
}

const colorMap = {
  "deciphering-strategy-iq": "text-teal-400",
  "the-24-hour-review": "text-coral",
  "communication-protocol": "text-blue-400",
  "next-steps-roadmap": "text-purple-400"
}

export function PartnerLibrary() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedResource, setSelectedResource] = useState<PartnerResource | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.library-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: "power3.out",
          delay: 0.2
        }
      )
    }
  }, [])

  const handleCardClick = (resource: PartnerResource) => {
    setSelectedResource(resource)
    setIsDrawerOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-coral animate-pulse" />
        <h2 className="text-sm font-bold tracking-widest text-white/60 uppercase font-big-shoulders italic">
          PARTNER LIBRARY <span className="text-white/20 ml-2">/ KNOWLEDGE ASSETS</span>
        </h2>
      </div>

      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {partnerResources.map((resource) => {
          const Icon = iconMap[resource.id as keyof typeof iconMap]
          const color = colorMap[resource.id as keyof typeof colorMap]
          
          return (
            <Card 
              key={resource.id} 
              onClick={() => handleCardClick(resource)}
              className="library-card bg-[#0A0A0A]/80 backdrop-blur-2xl border-white/20 p-6 rounded-2xl hover:bg-[#0A0A0A]/90 transition-all group cursor-pointer border-l-2 border-l-transparent hover:border-l-coral hover:border-coral/50 shadow-xl"
            >
              <CardHeader className="p-0 mb-4">
                <div className={`p-3 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform ${color}`}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardTitle className="text-lg font-bold text-white mb-2 group-hover:text-coral transition-colors">
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-sm text-white/40 leading-relaxed font-inter">
                  {resource.subtext}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <ResourceDrawer 
        resource={selectedResource}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}
