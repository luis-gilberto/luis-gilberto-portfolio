'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { UserRoleBadge } from './ui/UserRoleBadge'

interface TopNavBarProps {
  onMenuToggle?: () => void
  mobileMenuOpen?: boolean
}

export default function TopNavBar({ onMenuToggle }: TopNavBarProps) {
  return (
    <header className="portal-header hidden lg:block fixed top-0 left-0 right-0 z-50 h-16 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10">
      <div className="portal-header-inner flex items-center justify-between h-full px-6">
        {/* 1. Hamburger (Left) - Visible only on Mobile */}
        <button 
          className="mobile-menu-toggle lg:hidden text-white p-2 -ml-2 hover:bg-white/10 rounded-md transition-colors"
          id="portalMobileToggle"
          onClick={onMenuToggle}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* 2. Logo (Center/Left) - Visible only on Mobile */}
        <Link href="/" className="brand-logo block lg:hidden">
          <div className="relative w-8 h-8">
             <Image 
               src="/brand/portal-icon.png" 
               alt="LG" 
               fill
               className="object-contain"
             />
          </div>
        </Link>

        {/* 3. Desktop Nav Links - Hidden on Mobile */}
        <nav className="nav-links hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <a href="https://luis-gilberto.com" className="nav-link text-sm font-medium text-gray-500 hover:text-white transition-colors">Portfolio</a>
            <a href="https://luis-gilberto.com/insights/" className="nav-link text-sm font-medium text-gray-500 hover:text-white transition-colors">Insights</a>
            <a href="https://luis-gilberto.com/TheHub/" className="nav-link text-sm font-medium text-gray-500 hover:text-white transition-colors">The Hub</a>
            <span className="nav-link active text-sm font-bold text-[#F96F6E]">The Portal</span>
        </nav>

        {/* 4. User Controls (Right) */}
        <div className="flex items-center gap-6 ml-auto lg:ml-0">
          <UserRoleBadge />
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="sign-out-btn text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
