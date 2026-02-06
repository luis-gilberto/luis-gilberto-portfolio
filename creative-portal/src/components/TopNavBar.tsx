'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { UserRoleBadge } from './ui/UserRoleBadge'
import ThemeToggle from './ui/ThemeToggle'
import AuthButton from './layout/AuthButton'

interface TopNavBarProps {
  onMenuToggle?: () => void
  mobileMenuOpen?: boolean
  projectStatus?: string
}

export default function TopNavBar({ onMenuToggle, projectStatus }: TopNavBarProps) {
  const { data: session } = useSession()

  const getPhaseLabel = (status?: string) => {
    if (status === 'DISCOVERY') return 'PHASE: DISCOVERY'
    if (status === 'PLANNING' || status === 'ACTIVE') return 'PHASE: PLANNING'
    return null
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

        {/* 2. Logo & Phase (Center/Left) */}
        <div className="flex items-center gap-6">
          <Link href="/" className="brand-logo block">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 hidden lg:block">
                 <Image 
                   src="/brand/portal-icon.png" 
                   alt="LG" 
                   fill
                   className="object-contain"
                 />
              </div>
              <span className="text-xl lg:text-2xl font-black tracking-tighter uppercase font-big-shoulders italic leading-none">
                <span className="text-[#F96F6E]">LG</span> <span className="text-white">/ PORTAL</span>
              </span>
            </div>
          </Link>

          {phaseLabel && (
            <div className="hidden md:block h-4 w-px bg-white/10" />
          )}

          {phaseLabel && (
            <span className="hidden md:block text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
              {phaseLabel}
            </span>
          )}
        </div>

        {/* 3. Desktop Nav Links - Hidden on Mobile */}
        <nav className="nav-links hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <a href="https://luis-gilberto.com" className="nav-link text-sm font-medium text-gray-500 hover:text-white transition-colors">Portfolio</a>
            <a href="https://luis-gilberto.com/insights/" className="nav-link text-sm font-medium text-gray-500 hover:text-white transition-colors">Insights</a>
            <a href="https://luis-gilberto.com/TheHub/" className="nav-link text-sm font-medium text-gray-500 hover:text-white transition-colors">The Hub</a>
            <span className="nav-link active text-sm font-bold text-[#F96F6E]">The Portal</span>
        </nav>

        {/* 4. User Controls (Right) */}
        <div className="flex items-center gap-6 ml-auto lg:ml-0">
          <div className="hidden lg:flex items-center gap-6">
            <ThemeToggle />
            <UserRoleBadge role={session?.user?.role || 'CLIENT'} />
          </div>

          <AuthButton />
        </div>
      </div>
    </header>
  )
}
