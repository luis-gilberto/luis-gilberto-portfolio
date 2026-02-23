"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface SealOfAuthorityProps {
  className?: string
  size?: number
}

export function SealOfAuthority({ className, size = 200 }: SealOfAuthorityProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <filter id="coralGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComponentTransfer in="blur" result="lowOpacityBlur">
              <feFuncA type="linear" slope="0.6"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="lowOpacityBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <path id="outerTextPath" d="M 100,100 m -91,0 a 91,91 0 1,1 182,0 a 91,91 0 1,1 -182,0"/>
          <path id="middleTextPath" d="M 100,100 m -71,0 a 71,71 0 1,1 142,0 a 71,71 0 1,1 -142,0"/>
        </defs>
         
        {/* LAYER 1: Outer Ring (The Engine) */}
        <circle cx="100" cy="100" r="98" stroke="#2ED3C6" strokeWidth="2" fill="none"/>
        <text fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#2ED3C6" letterSpacing="2">
          <textPath href="#outerTextPath" startOffset="50%" textAnchor="middle">
            STRATEGIC SYNTHESIS // ADVISORY GRADE
          </textPath>
        </text>
         
        {/* LAYER 2: Middle Ring (The Process) */}
        <circle cx="100" cy="100" r="78" stroke="#2ED3C6" strokeWidth="1" fill="none"/>
        <text fontFamily="'Inter', sans-serif" fontSize="7" fontWeight="500" fill="#2ED3C6" letterSpacing="1.5">
          <textPath href="#middleTextPath" startOffset="50%" textAnchor="middle">
            HUMAN-LED · AI-POWERED · PARTNER-ALIGNED
          </textPath>
        </text>
         
        {/* LAYER 3: Inner Core (The Human Heart) */}
        <circle cx="100" cy="100" r="55" stroke="rgba(249, 111, 110, 0.3)" strokeWidth="1" fill="none" filter="url(#coralGlow)"/>
         
        {/* LG Logomark */}
        <g transform="translate(100, 80) scale(0.07) translate(-258, -246)" fill="#2ED3C6">
          <path d="M200.18 265.618C197.62 267.456 194.995 269.197 192.445 271.057V290.66C192.445 297.179 197.619 302.477 204.01 302.477H305.873C311.068 302.477 315.057 307.246 314.179 312.49C305.185 366.606 259.084 407.812 203.566 407.812H195.101C133.129 407.812 82.8908 356.475 82.8908 293.146V11.5152C82.8908 5.15752 77.8438 0 71.6223 0H11.2688C5.04724 0 0 5.15752 0 11.5152V287.091C0 400.438 89.9165 492.333 200.847 492.333C306.708 492.333 393.429 408.645 401.132 302.477C401.503 297.396 401.693 292.271 401.693 287.091V221.179C390.425 218.638 378.849 217.914 367.03 216.897C305.83 211.621 248.662 230.867 200.17 265.64L200.18 265.618Z" />
          <path d="M510.55 218.562C486.298 205.414 460.004 195.196 431.997 188.514C394.435 179.551 356.883 177.648 320.654 181.94C319.681 182.059 318.697 182.189 317.723 182.319C289.335 185.963 261.793 193.402 235.742 204.268C231.69 205.955 227.69 207.761 223.712 209.609C183.092 228.52 146.461 255.811 116.422 289.935C112.2 294.725 112.962 302.196 118.051 305.991C122.474 309.278 128.59 308.576 132.24 304.424C157.19 276.084 187.017 252.794 219.998 235.548C223.215 233.873 226.442 232.229 229.711 230.661C289.239 202.214 358.206 193.207 427.161 209.674C440.483 212.853 453.381 216.886 465.824 221.709C470.056 223.341 474.225 225.071 478.352 226.877C485.928 230.207 493.324 233.84 500.529 237.743C505.227 240.284 511.025 238.976 514.157 234.586C517.977 229.223 516.253 221.665 510.528 218.562H510.55Z" />
        </g>
         
        {/* Separator Line */}
        <line x1="75" y1="102" x2="125" y2="102" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
         
        {/* CERTIFIED Text */}
        <text x="100" y="122" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="11" fontWeight="600" letterSpacing="3" fill="#F4F1ED" filter="url(#coralGlow)">
          CERTIFIED
        </text>
      </svg>
    </div>
  )
}
