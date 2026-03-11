"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StrategicRadarProps {
  scores: {
    gtm?: number
    brand?: number
    campaign?: number
    creative?: number
    governance?: number
    talent?: number
    process?: number
    tech?: number
    data?: number
  }
}

export function StrategicRadar({ scores }: StrategicRadarProps) {
  const size = 560 // Increased from 500 to provide more breathing room for labels
  const center = size / 2
  const radius = size * 0.3
  
  // Normalized points (0-100 to 0-radius)
  const getPoint = (score: number, angle: number) => {
    const r = (score / 100) * radius
    const x = center + r * Math.cos((angle * Math.PI) / 180)
    const y = center + r * Math.sin((angle * Math.PI) / 180)
    return { x, y }
  }

  // Angles for the 5 pillars (Staging Mode)
  const angles = {
    p1: -90,      // Governance
    p2: -18,      // Talent
    p3: 54,       // Process
    p4: 126,      // Tech Stack
    p5: 198       // Data
  }

  // Calculate coordinates
  const p1 = getPoint(scores.governance || 85, angles.p1)
  const p2 = getPoint(scores.talent || 40, angles.p2)
  const p3 = getPoint(scores.process || 65, angles.p3)
  const p4 = getPoint(scores.tech || 55, angles.p4)
  const p5 = getPoint(scores.data || 70, angles.p5)

  const polygonPath = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y} ${p5.x},${p5.y}`

  return (
    <div className="relative w-full aspect-square flex items-center justify-center bg-[#0E0C0A] rounded-3xl border border-white/5 overflow-visible group">
      {/* 1. Scanning Grid Background (Full Canvas) */}
      <div className="absolute inset-[-100px] bg-[radial-gradient(circle_at_center,rgba(46,211,198,0.03)_0%,transparent_70%)] opacity-50 pointer-events-none" />
      <div className="absolute inset-[-100px] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(circle_at_center,white,transparent_80%)] pointer-events-none" />

      {/* 2. System Analysis Scanning Rings (Full Canvas) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0.4, 0.7, 1, 1.3].map((scale, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [scale * 0.9, scale * 1.1, scale * 0.9],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{ 
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute border border-teal/10 rounded-full"
            style={{ width: radius * 2.5 * scale, height: radius * 2.5 * scale }}
          />
        ))}
      </div>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10 overflow-visible">
        {/* 3. Organizational Dimension Nodes (Background Web) */}
        <g className="opacity-20">
          {Object.values(angles).map((angle, i) => (
            <React.Fragment key={i}>
              <line
                x1={center}
                y1={center}
                x2={center + radius * 1.4 * Math.cos((angle * Math.PI) / 180)}
                y2={center + radius * 1.4 * Math.sin((angle * Math.PI) / 180)}
                stroke="#2ED3C6"
                strokeWidth="0.5"
                strokeDasharray="4 4"
              />
              <circle
                cx={center + radius * 1.4 * Math.cos((angle * Math.PI) / 180)}
                cy={center + radius * 1.4 * Math.sin((angle * Math.PI) / 180)}
                r="2"
                fill="#2ED3C6"
              />
            </React.Fragment>
          ))}
        </g>

        {/* 4. The Maturity Profile (Emerging Polygon) */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          points={polygonPath}
          fill="rgba(46, 211, 198, 0.08)"
          stroke="#2ED3C6"
          strokeWidth="1.5"
          style={{ filter: 'drop-shadow(0 0 12px rgba(46, 211, 198, 0.3))' }}
        />

        {/* 5. Analysis Vectors & Friction Markers */}
        {[p1, p2, p3, p4, p5].map((p, i) => {
          const isRisk = i === 1; // Talent Density is the flagged risk
          return (
            <g key={i}>
              {/* Friction Indicator (Coral) for Talent Density */}
              {isRisk && (
                <motion.g
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <circle cx={p.x} cy={p.y} r="12" fill="none" stroke="#F47471" strokeWidth="0.5" className="opacity-30" />
                  <line x1={p.x} y1={p.y} x2={p.x + 40} y2={p.y - 30} stroke="#F47471" strokeWidth="1" className="opacity-50" />
                </motion.g>
              )}
              
              <circle
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill={isRisk ? "#F47471" : "#0E0C0A"}
                stroke={isRisk ? "#F47471" : "#2ED3C6"}
                strokeWidth="1.5"
                style={{ filter: isRisk ? 'drop-shadow(0 0 8px rgba(244, 116, 113, 0.6))' : 'drop-shadow(0 0 4px rgba(46, 211, 198, 0.4))' }}
              />
            </g>
          );
        })}

        {/* 6. Telemetry Labels (JetBrains Mono) - Positioned with more air */}
        <g className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium">
          <text x={center} y={center - radius * 1.5} textAnchor="middle" className="fill-white/40">Governance</text>
          <text x={center + radius * 1.5} y={center - radius * 0.5} textAnchor="start" className="fill-coral font-bold" style={{ filter: 'drop-shadow(0 0 8px rgba(244, 116, 113, 0.3))' }}>Talent Density</text>
          <text x={center + radius * 1.3} y={center + radius * 1.3} textAnchor="start" className="fill-white/40">Process</text>
          <text x={center - radius * 1.3} y={center + radius * 1.3} textAnchor="end" className="fill-white/40">Tech Stack</text>
          <text x={center - radius * 1.5} y={center - radius * 0.5} textAnchor="end" className="fill-white/40">Data Integrity</text>
        </g>

        {/* 7. System Status Markers - Shifted to corners of SVG canvas */}
        <g className="font-mono text-[8px] opacity-30 tracking-[0.3em]">
          <text x="10" y="20" className="fill-teal uppercase">Calibration_Mode: ON</text>
          <text x="10" y="35" className="fill-teal uppercase">Scan_Freq: 440Hz</text>
          <text x={size - 180} y={size - 20} className="fill-coral uppercase font-bold">Critical_Friction: Detected</text>
        </g>
      </svg>

      {/* 8. Pulse Effect on the Risk Node */}
      <motion.div 
        animate={{ 
          boxShadow: ["0 0 0px 0px rgba(244, 116, 113, 0)", "0 0 20px 2px rgba(244, 116, 113, 0.2)", "0 0 0px 0px rgba(244, 116, 113, 0)"]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute rounded-full pointer-events-none"
        style={{ 
          left: p2.x, 
          top: p2.y, 
          width: 1, 
          height: 1 
        }}
      />
    </div>
  )
}
