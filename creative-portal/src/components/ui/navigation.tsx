'use client'

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* 1. GLOBAL TOP NAV (Dark) */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#1a1a1a]/95 backdrop-blur-md border-b border-white/10 border-t border-warm-gold/30 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Logo Area */}
          <div className="flex items-center gap-4">
            <a href="https://luis-gilberto.com" className="flex items-center">
              <img src="/assets/images/The_Portal_Logo.png" alt="LG Portal" className="h-8 w-auto" decoding="async" loading="eager" />
            </a>
          </div>

          {/* Desktop Links (Global Ecosystem) */}
          <div className="hidden md:flex items-center gap-6">
            <a href="https://luis-gilberto.com" className="text-sm font-medium text-gray-300 hover:text-white uppercase tracking-wider transition-colors">Portfolio</a>
            <a href="https://luis-gilberto.com/insights/" className="text-sm font-medium text-gray-300 hover:text-white uppercase tracking-wider transition-colors">Insights</a>
            <a href="https://luis-gilberto.com/TheHub/" className="text-sm font-medium text-gray-300 hover:text-white uppercase tracking-wider transition-colors">The Hub</a>
            {/* Active Portal Link (Internal) */}
            <Link href="/" className="text-sm font-bold text-[var(--coral)] uppercase tracking-wider">The Portal</Link>
          </div>

          {/* User / Auth Controls */}
          <div className="flex items-center gap-4">
            {session ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-xs text-gray-400 hidden sm:inline">
                  {session.user?.name}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="border-white/20 text-gray-200 hover:bg-white/10 hover:text-white h-8 text-xs"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              pathname !== '/auth/signin' && (
                <div className="hidden md:block">
                  <Button asChild size="sm" className="bg-[var(--coral)] hover:bg-[#e55a5a] text-white h-8 text-xs font-bold uppercase">
                    <Link href="/auth/signin">Portal Login</Link>
                  </Button>
                </div>
              )
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
          <div className="fixed inset-0 bg-[#1a1a1a] z-40 pt-20 px-6 md:hidden overflow-y-auto h-screen">
            <div className="flex flex-col">
              <div className="flex flex-col space-y-3">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Global</div>
                <a href="https://luis-gilberto.com" className="text-2xl font-bold text-white font-big-shoulders">Portfolio</a>
                <a href="https://luis-gilberto.com/insights/" className="text-2xl font-bold text-white font-big-shoulders">Insights</a>
                <a href="https://luis-gilberto.com/TheHub/" className="text-2xl font-bold text-white font-big-shoulders">The Hub</a>
                <Link href="/" className="text-2xl font-bold text-[var(--coral)] font-serif">The Portal</Link>
              </div>
              <div className="h-px bg-white/10 w-full my-6"></div>
              <div className="flex flex-col space-y-3">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Portal</div>
                {session ? (
                  <>
                    <Link href="/dashboard" className="text-lg font-medium text-gray-300" onClick={() => setIsMobileOpen(false)}>Dashboard</Link>
                    <Link href="/projects" className="text-lg font-medium text-gray-300" onClick={() => setIsMobileOpen(false)}>Projects</Link>
                    <Link href="/documents" className="text-lg font-medium text-gray-300" onClick={() => setIsMobileOpen(false)}>Documents</Link>
                    <button onClick={() => { handleSignOut(); setIsMobileOpen(false); }} className="text-left text-lg font-medium text-[var(--coral)]">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" className="text-lg font-bold text-[var(--coral)]" onClick={() => setIsMobileOpen(false)}>Log In</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 2. CONTEXT SUB-NAV (Only when logged in) */}
      {session && (
        <div className="fixed top-16 left-0 right-0 h-12 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] z-40 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-8">
            <Link 
              href="/dashboard" 
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                isActive("/dashboard") ? "text-[var(--coral)] font-bold" : "text-[var(--text-secondary)] hover:text-[var(--coral)]"
              }`}
            >
              Overview
            </Link>
            <Link 
              href="/strategyiq/" 
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                pathname.startsWith("/strategyiq/") ? "text-[var(--coral)] font-bold" : "text-[var(--text-secondary)] hover:text-[var(--coral)]"
              }`}
            >
              Assessments
            </Link>
            <Link 
              href="/projects" 
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                pathname.startsWith("/projects") ? "text-[var(--coral)] font-bold" : "text-[var(--text-secondary)] hover:text-[var(--coral)]"
              }`}
            >
              Active Projects
            </Link>
            <Link 
              href="/documents" 
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                isActive("/documents") ? "text-[var(--coral)] font-bold" : "text-[var(--text-secondary)] hover:text-[var(--coral)]"
              }`}
            >
              Client Assets
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
