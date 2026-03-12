"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PortfolioItem {
  text: string
  title: string
  image: string
}

interface CircularRevealHeadingProps {
  items: PortfolioItem[]
  centerText: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CircularRevealHeading({
  items,
  centerText,
  size = 'md',
  className
}: CircularRevealHeadingProps) {
  // State management as specified in requirements
  const [activeProject, setActiveProject] = useState<PortfolioItem | null>(null)
  const [centerContent, setCenterContent] = useState<'logo' | 'project'>('logo')
  const [rotationAngle, setRotationAngle] = useState(0)
  const [isRotating, setIsRotating] = useState(false)

  // Interaction handlers as specified
  const handleProjectHover = (project: PortfolioItem) => {
    setActiveProject(project)
    setCenterContent('project')
    setIsRotating(false)
  }

  const handleProjectLeave = () => {
    setActiveProject(null)
    setCenterContent('logo')
    setIsRotating(true)
  }

  const handleCenterClick = () => {
    if (centerContent === 'project') {
      setActiveProject(null)
      setCenterContent('logo')
      setIsRotating(true)
    } else {
      setIsRotating(!isRotating)
    }
  }

  // Continuous rotation effect (30-second cycle)
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRotating) {
      interval = setInterval(() => {
        setRotationAngle(prev => prev + 0.2) // 360 degrees in 30 seconds
      }, 16) // ~60fps
    }
    return () => clearInterval(interval)
  }, [isRotating])

  // Start rotation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRotating(true)
    }, 1000) // Start rotation after 1 second
    return () => clearTimeout(timer)
  }, [])

  const sizeClasses = {
    sm: { container: 'w-80 h-80', center: 'w-32 h-32', text: 'text-xs' },
    md: { container: 'w-96 h-96', center: 'w-40 h-40', text: 'text-sm' },
    lg: { container: 'w-[500px] h-[500px]', center: 'w-48 h-48', text: 'text-base' }
  }

  const { container, center, text } = sizeClasses[size]
  const radius = size === 'lg' ? 180 : size === 'md' ? 140 : 120

  return (
    <div className={cn('relative flex items-center justify-center', container, className)}>
      {/* Main neumorphic circular container */}
      <div 
        className="relative w-full h-full rounded-full transition-all duration-700"
        style={{
          background: `
            linear-gradient(145deg, #f0f0f0 0%, #ffffff 50%, #e8e8e8 100%)
          `,
          boxShadow: `
            20px 20px 60px #d1d1d1,
            -20px -20px 60px #ffffff,
            inset 5px 5px 15px rgba(0,0,0,0.1),
            inset -5px -5px 15px rgba(255,255,255,0.9)
          `
        }}
      >
        {/* Rotating project names - Stage 2 */}
        <AnimatePresence>
          {isRotating && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {items.map((item, index) => {
                const angle = (360 / items.length) * index + rotationAngle
                const radian = (angle * Math.PI) / 180
                const x = Math.cos(radian) * radius
                const y = Math.sin(radian) * radius

                return (
                  <motion.div
                    key={index}
                    className="absolute flex items-center justify-center cursor-pointer group"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle + 90}deg)`,
                      transformOrigin: 'center'
                    }}
                    onMouseEnter={() => handleProjectHover(item)}
                    onMouseLeave={handleProjectLeave}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className={cn(
                      'px-3 py-1 rounded-full text-gray-700 font-medium tracking-wide transition-all duration-300',
                      'bg-white/80 backdrop-blur-sm shadow-lg',
                      'group-hover:bg-white group-hover:shadow-xl group-hover:text-gray-900',
                      text
                    )}>
                      {item.text}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center content - Stage 1 & 3 */}
        <div 
          className={cn(
            "absolute rounded-full cursor-pointer transition-all duration-500 overflow-hidden",
            centerContent === 'project' ? 'inset-0' : 'inset-16'
          )}
          style={{
            background: centerContent === 'logo' 
              ? `linear-gradient(145deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)`
              : 'transparent',
            boxShadow: centerContent === 'logo'
              ? `
                  inset 8px 8px 16px #d1d1d1,
                  inset -8px -8px 16px #ffffff,
                  0 4px 20px rgba(0,0,0,0.1)
                `
              : 'none'
          }}
          onClick={handleCenterClick}
        >
          {/* Stage 1: Default State - Logo/Branding */}
          <AnimatePresence mode="wait">
            {centerContent === 'logo' && (
              <motion.div
                key="logo"
                className="w-full h-full flex items-center justify-center"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center space-y-4">
                  {/* LG Logo */}
                  <div className="w-20 h-20 flex items-center justify-center mx-auto">
                    <img 
                      src="/images/projects/AUg_logo_White.png" 
                      alt="Luis Gilberto Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* LUIS GILBERTO text */}
                  <h1 className="text-2xl font-light text-gray-800 tracking-wide">
                    LUIS GILBERTO
                  </h1>
                  
                  {/* Interactive Showcase text */}
                  <p className="text-lg font-medium text-gray-700">
                    Interactive Showcase
                  </p>
                  
                  {/* Hover to explore instruction */}
                  <p className="text-sm text-gray-500 uppercase tracking-wider">
                    {isRotating ? 'Hover to explore' : 'Click to start'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Stage 3: Project Active State - FULL CIRCLE TAKEOVER */}
            {centerContent === 'project' && activeProject && (
              <motion.div
                key="project"
                className="relative w-full h-full rounded-full overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                {/* FULL CIRCLE BACKGROUND IMAGE */}
                <img 
                  src={activeProject.image}
                  alt={activeProject.text}
                  className="w-full h-full object-cover"
                />
                
                {/* GRADIENT OVERLAY FOR TEXT READABILITY */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 rounded-full"/>
                
                {/* TOP LABEL - Project Name */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-2">
                    <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                      {activeProject.text}
                    </span>
                  </div>
                </div>
                
                {/* CENTER LOGO OVERLAY (Semi-transparent) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-full p-6 border border-white/20">
                    <div className="w-12 h-12 flex items-center justify-center opacity-80">
                      <img 
                        src="/images/projects/AUg_logo_Black.png" 
                        alt="Luis Gilberto Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
                
                {/* BOTTOM DESCRIPTION */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="bg-black/30 backdrop-blur-sm rounded-full px-6 py-2">
                    <p className="text-white text-sm font-medium">
                      Explore this project
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}