'use client'

import React from 'react'
import { Menu, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { UserRoleBadge } from './ui/UserRoleBadge'
import { Badge } from "@/components/ui/badge"
import AuthButton from './layout/AuthButton'

interface TopNavBarProps {
  onMenuToggle?: () => void
  mobileMenuOpen?: boolean
  projectStatus?: string
}

export default function TopNavBar({ onMenuToggle, projectStatus }: TopNavBarProps) {
  const { data: session } = useSession()
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark'
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  })

  React.useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  const getPhaseLabel = (status?: string) => {
    const s = status?.toUpperCase()
    if (s === 'DISCOVERY') return 'Phase 1: Discovery'
    if (s === 'PLANNING' || s === 'ACTIVE') return 'Phase 2: Strategic planning'
    if (s === 'EXECUTION') return 'Phase 3: Execution'
    return 'Phase: Discovery' // Default
  }

  const phaseLabel = getPhaseLabel(projectStatus)

  return (
    <header id="primaryNav" className="portal-header fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-[#0A0A0A]">
      <div className="flex items-center justify-between h-full px-6">
        {/* 1. Left: LG // PORTAL Wordmark */}
        <div className="flex items-center gap-4">
          <button 
            className="mobile-menu-toggle lg:hidden text-white p-2 -ml-2 hover:bg-white/10 rounded-md transition-colors"
            id="portalMobileToggle"
            onClick={onMenuToggle}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-black font-big-shoulders italic text-coral tracking-tighter">LG</span>
            <span className="text-xl font-black font-big-shoulders italic text-white/20 tracking-tighter mx-1">/</span>
            <span className="text-xl font-black font-big-shoulders italic text-white tracking-tighter">PORTAL</span>
            
            {/* ADMIN INDICATOR */}
            {session?.user?.role === 'ADMIN' && (
              <span className="ml-2 px-2 py-0.5 rounded border border-white/15 text-[10px] font-mono tracking-widest uppercase text-teal">
                ADMIN
              </span>
            )}
          </Link>
        </div>

        {/* 2. Right: Theme Toggle, Phase Badge & Auth */}
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-[32px] h-[32px] rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white/70"
            title="Toggle light/dark"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {phaseLabel && (
            <div className="flex items-center justify-center px-4 h-[32px] rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-white/80 whitespace-nowrap uppercase tracking-widest">
                {phaseLabel}
              </span>
            </div>
          )}
          
          {/* Sign Out Button (Custom Minimalist) */}
          <button 
            onClick={() => {
              // Ensure we use the current origin to avoid port mismatches
              const origin = typeof window !== 'undefined' ? window.location.origin : '';
              signOut({ callbackUrl: origin + '/' })
            }}
            className="flex items-center justify-center px-4 h-[32px] rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-[11px] font-medium text-white/60 hover:text-white tracking-widest"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
