'use client'

import { Menu } from 'lucide-react'
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

  const getPhaseLabel = (status?: string) => {
    const s = status?.toUpperCase()
    if (s === 'DISCOVERY') return 'PHASE 1: DISCOVERY'
    if (s === 'PLANNING' || s === 'ACTIVE') return 'PHASE 2: STRATEGIC PLANNING'
    if (s === 'EXECUTION') return 'PHASE 3: EXECUTION'
    return 'PHASE: DISCOVERY' // Default
  }

  const phaseLabel = getPhaseLabel(projectStatus)

  return (
    <header className="portal-header fixed top-0 left-0 right-0 z-50 h-16 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10">
      <div className="portal-header-inner flex items-center justify-between h-full px-6">
        {/* 1. Hamburger (Left) - Visible only on Mobile */}
        <button 
          className="mobile-menu-toggle lg:hidden text-white p-2 -ml-2 hover:bg-white/10 rounded-md transition-colors"
          id="portalMobileToggle"
          onClick={onMenuToggle}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* 2. Logo (Centered on Mobile, Left on Desktop) */}
        <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:flex items-center gap-6">
          <Link href="/" className="brand-logo block">
            <div className="flex items-center gap-3">
              <span className="text-xl lg:text-2xl font-black tracking-tighter uppercase font-big-shoulders italic leading-none">
                <span className="text-[#F96F6E]">LG</span> <span className="text-white">/ PORTAL</span>
              </span>
            </div>
          </Link>
        </div>

        {/* 3. Phase Badge (Right) - Hidden on Mobile to prevent overlap */}
        <div className="flex items-center gap-6 ml-auto">
          {phaseLabel && (
            <Badge variant="outline" className="hidden md:flex bg-white/[0.03] text-white/40 border-white/10 text-[9px] tracking-[0.2em] uppercase py-1 px-3 font-bold rounded-none border">
              {phaseLabel}
            </Badge>
          )}
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
