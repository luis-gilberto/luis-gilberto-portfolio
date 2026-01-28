'use client'

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import AuthButton from "@/components/layout/AuthButton"
import ThemeToggle from "@/components/ui/ThemeToggle"

export function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const portalMobileLinks = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Strategy Engine', href: '/strategyiq' },
    { label: 'Projects', href: '/admin/projects' },
    { label: 'Clients', href: '/admin/clients' },
    { label: 'Analytics', href: '/admin/analytics' },
    { label: 'Settings', href: '/admin/settings' },
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  const isActive = (path: string) => pathname === path
  const isLandingPage = pathname === '/' || pathname === '/portal'

  // Portal Check: Hide Global Nav on Portal Routes to prevent duplication
  const isPortal = pathname?.startsWith('/admin') || pathname?.startsWith('/strategyiq')
  if (isPortal) return null

  return (
    <>
      {/* 1. GLOBAL TOP NAV (Dark) */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 border-t border-warm-gold/30 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Logo Area */}
          <div className="flex items-center gap-4">
            <Link href="/" className="relative w-32 h-8">
              <Image 
                src="/brand/portal-full.png" 
                alt="The Portal" 
                fill 
                className="object-contain object-left" 
                priority 
              />
            </Link>
          </div>

          {/* Desktop Links (Global Ecosystem) */}
          <div className="hidden md:flex items-center gap-6">
            <a href="https://luis-gilberto.com" className="text-sm font-medium text-gray-500 hover:text-white tracking-tight transition-colors">Portfolio</a>
            <a href="https://luis-gilberto.com/insights/" className="text-sm font-medium text-gray-500 hover:text-white tracking-tight transition-colors">Insights</a>
            <a href="https://luis-gilberto.com/TheHub/" className="text-sm font-medium text-gray-500 hover:text-white tracking-tight transition-colors">The Hub</a>
            {/* Active Portal Link (Internal) */}
            <Link href="/" className="text-sm font-bold text-[#F96F6E] tracking-tight">The Portal</Link>
          </div>

          {/* User / Auth Controls */}
          <div className="flex items-center gap-4">
            {!isLandingPage && (
              <>
                <ThemeToggle />
                <AuthButton />
              </>
            )}

            {/* Mobile Toggle */}
            <button 
              className="md:hidden flex flex-col gap-1.5 p-2 z-50 relative"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileOpen && (
          <div className="fixed inset-0 bg-[#0A0A0A] z-40 pt-20 px-6 md:hidden overflow-y-auto h-screen">
            <div className="flex flex-col">
              <div className="flex flex-col space-y-3">
                <div className="text-xs font-bold text-gray-500 tracking-tight mb-3">Global</div>
                <a href="https://luis-gilberto.com" className="text-2xl font-bold text-white tracking-tight">Portfolio</a>
                <a href="https://luis-gilberto.com/insights/" className="text-2xl font-bold text-white tracking-tight">Insights</a>
                <a href="https://luis-gilberto.com/TheHub/" className="text-2xl font-bold text-white tracking-tight">The Hub</a>
                <Link href="/" className="text-2xl font-bold text-[var(--coral)] tracking-tight">The Portal</Link>
              </div>
              <div className="h-px bg-white/10 w-full my-6"></div>
              <div className="flex flex-col space-y-3">
              <div className="text-xs font-bold text-gray-500 tracking-tight mb-3">Portal</div>
                {session ? (
                  <>
                    {portalMobileLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        className="text-lg font-medium text-gray-300" 
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <button onClick={() => { handleSignOut(); setIsMobileOpen(false); }} className="text-left text-lg font-medium text-[var(--coral)]">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-lg font-bold text-[var(--coral)]" onClick={() => setIsMobileOpen(false)}>Log In</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
