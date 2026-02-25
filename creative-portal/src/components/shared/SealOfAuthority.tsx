"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SealOfAuthorityProps {
  className?: string
  size?: number
  opacity?: number
  rotate?: number
}

export function SealOfAuthority({ 
  className, 
  size = 200, 
  opacity = 0.05, 
  rotate = 12 
}: SealOfAuthorityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity, scale: 1 }}
      className={cn(
        "pointer-events-none select-none flex items-center justify-center",
        className
      )}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer Ring */}
        <circle
          cx="100"
          cy="100"
          r="95"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="text-zinc-500"
        />
        
        {/* Main Circle */}
        <circle
          cx="100"
          cy="100"
          r="85"
          stroke="currentColor"
          strokeWidth="2"
          className="text-teal"
        />

        {/* Inner Text Ring (Circular Path) */}
        <path
          id="sealTextPath"
          d="M 100, 100 m -65, 0 a 65,65 0 1,1 130,0 a 65,65 0 1,1 -130,0"
          fill="none"
        />
        <text className="text-[10px] font-bold tracking-[0.2em] uppercase fill-teal/60">
          <textPath href="#sealTextPath" startOffset="0%">
            STRATEGIC AUTHORITY • CERTIFIED ARTIFACT • LG // PORTAL • 
          </textPath>
        </text>

        {/* Center Logo/Icon */}
        <g transform="translate(65, 75)">
          <path
            d="M0 0L15 0L15 45L0 45Z"
            fill="currentColor"
            className="text-coral"
          />
          <path
            d="M25 0L70 0L70 10L25 10Z"
            fill="currentColor"
            className="text-white"
          />
          <path
            d="M25 20L70 20L70 30L25 30Z"
            fill="currentColor"
            className="text-white opacity-50"
          />
          <path
            d="M25 40L50 40L50 45L25 45Z"
            fill="currentColor"
            className="text-teal"
          />
        </g>

        {/* Decorative Inner Circles */}
        <circle
          cx="100"
          cy="100"
          r="50"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-white/20"
        />
        
        {/* Stamp "Certified" Text */}
        <text
          x="100"
          y="155"
          textAnchor="middle"
          className="text-[8px] font-black tracking-[0.5em] uppercase fill-white/30"
        >
          OFFICIAL
        </text>
      </svg>
    </motion.div>
  )
}
