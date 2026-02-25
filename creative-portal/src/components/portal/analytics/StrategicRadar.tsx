"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface StrategicRadarProps {
  scores: {
    gtm: number
    brand: number
    campaign: number
    creative: number
  }
}

export function StrategicRadar({ scores }: StrategicRadarProps) {
  const size = 400
  const center = size / 2
  const radius = size * 0.4
  
  // Normalized points (0-100 to 0-radius)
  const getPoint = (score: number, angle: number) => {
    const r = (score / 100) * radius
    const x = center + r * Math.cos((angle * Math.PI) / 180)
    const y = center + r * Math.sin((angle * Math.PI) / 180)
    return { x, y }
  }

  // Angles for the 4 pillars
  const angles = {
    gtm: -90,      // Top
    brand: 0,      // Right
    campaign: 90,  // Bottom
    creative: 180  // Left
  }

  const points = [
    getPoint(scores.gtm, angles.gtm),
    getPoint(scores.brand, angles.brand),
    getPoint(scores.campaign, angles.campaign),
    getPoint(scores.creative, angles.creative)
  ]

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div className="relative w-full aspect-square flex items-center justify-center bg-[#050505] rounded-3xl border border-white/5 overflow-hidden">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10">
        {/* Grid Lines */}
        {[0.25, 0.5, 0.75, 1].map((tick) => (
          <path
            key={tick}
            d={`M ${center + radius * tick * Math.cos((angles.gtm * Math.PI) / 180)} ${center + radius * tick * Math.sin((angles.gtm * Math.PI) / 180)} 
               L ${center + radius * tick * Math.cos((angles.brand * Math.PI) / 180)} ${center + radius * tick * Math.sin((angles.brand * Math.PI) / 180)}
               L ${center + radius * tick * Math.cos((angles.campaign * Math.PI) / 180)} ${center + radius * tick * Math.sin((angles.campaign * Math.PI) / 180)}
               L ${center + radius * tick * Math.cos((angles.creative * Math.PI) / 180)} ${center + radius * tick * Math.sin((angles.creative * Math.PI) / 180)} Z`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/5"
          />
        ))}

        {/* Axis Lines */}
        {Object.values(angles).map((angle) => (
          <line
            key={angle}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos((angle * Math.PI) / 180)}
            y2={center + radius * Math.sin((angle * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/5"
          />
        ))}

        {/* Strategic Fingerprint (The Data) */}
        <polygon
          points={polygonPath}
          fill="#2ED3C6"
          fillOpacity="0.1"
          stroke="#2ED3C6"
          strokeWidth="2"
          className="transition-all duration-1000"
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#2ED3C6"
            className="transition-all duration-1000"
          />
        ))}

        {/* Labels */}
        <text x={center} y={center - radius - 25} textAnchor="middle" className="fill-white/40 font-big-shoulders text-[12px] uppercase tracking-[0.2em] font-bold">GTM</text>
        <text x={center + radius + 15} y={center + 5} textAnchor="start" className="fill-white/40 font-big-shoulders text-[12px] uppercase tracking-[0.2em] font-bold">BRAND</text>
        <text x={center} y={center + radius + 35} textAnchor="middle" className="fill-white/40 font-big-shoulders text-[12px] uppercase tracking-[0.2em] font-bold">CAMPAIGN</text>
        <text x={center - radius - 15} y={center + 5} textAnchor="end" className="fill-white/40 font-big-shoulders text-[12px] uppercase tracking-[0.2em] font-bold">CREATIVE</text>
      </svg>
      
      {/* Background Decal */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
        <span className="font-big-shoulders font-black text-[200px] uppercase italic tracking-tighter">IQ</span>
      </div>
    </div>
  )
}
