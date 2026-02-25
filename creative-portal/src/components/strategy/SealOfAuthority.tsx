'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SealOfAuthorityProps {
  className?: string
  size?: number
}

export function SealOfAuthority({ className, size = 200 }: SealOfAuthorityProps) {
  return (
    <div className={cn(
      "pointer-events-none select-none flex items-center justify-center",
      className
    )}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="animate-in fade-in zoom-in duration-1000"
      >
        {/* Outer Ring */}
        <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="2" />
        
        {/* Curved Text Path */}
        <path 
          id="sealTextPath" 
          d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" 
          fill="none" 
        />
        
        <text className="text-[8px] font-bold tracking-[0.2em] uppercase fill-current">
          <textPath href="#sealTextPath" startOffset="0%">
            SEAL OF AUTHORITY · OFFICIAL · LUIS GILBERTO · STRATEGYIQ · SEAL OF AUTHORITY · OFFICIAL · LUIS GILBERTO · STRATEGYIQ
          </textPath>
        </text>

        {/* Center Emblem */}
        <g transform="translate(75, 75) scale(0.5)">
           <path 
            d="M50 0L61.2257 35.3553L96.5926 25L86.2372 60.3553L121.604 50L111.249 85.3553L146.616 75L136.261 110.355L171.628 100L161.272 135.355L196.639 125L186.284 160.355L221.651 150L211.296 185.355L246.663 175L236.307 210.355L271.674 200L261.319 235.355L296.686 225L286.331 260.355L321.698 250L311.343 285.355L346.71 275L336.354 310.355L371.721 300" 
            stroke="currentColor" 
            strokeWidth="4"
            strokeLinecap="round"
            className="opacity-20"
          />
          <rect x="20" y="20" width="60" height="60" stroke="currentColor" strokeWidth="2" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="10" fill="currentColor" />
        </g>

        {/* Inner Label */}
        <text x="100" y="130" textAnchor="middle" className="text-[10px] font-black font-big-shoulders italic uppercase tracking-widest fill-current">
          Certified
        </text>
        <text x="100" y="145" textAnchor="middle" className="text-[6px] font-mono uppercase tracking-[0.4em] fill-current opacity-40">
          LG-V5.7-PROT
        </text>
      </svg>
    </div>
  )
}
