"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface NavigationProps {
  variant?: "default" | "dashboard"
}

export function Navigation({ variant = "default" }: NavigationProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const isActive = (path: string) => pathname === path

  if (variant === "dashboard" && session) {
    return (
      <nav className="bg-white border-b border-cool-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-coral-red to-coral-red/80 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm font-big-shoulders">CP</span>
                </div>
                <h1 className="text-xl font-bold text-deep-black font-big-shoulders">Creative Portal</h1>
              </Link>
              
              {/* Dashboard Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  href="/dashboard" 
                  className={`text-sm font-medium transition-colors font-general-sans ${
                    isActive("/dashboard") 
                      ? "text-coral-red border-b-2 border-coral-red pb-1" 
                      : "text-cool-gray-600 hover:text-coral-red"
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/projects" 
                  className={`text-sm font-medium transition-colors font-general-sans ${
                    pathname.startsWith("/projects") 
                      ? "text-coral-red border-b-2 border-coral-red pb-1" 
                      : "text-cool-gray-600 hover:text-coral-red"
                  }`}
                >
                  Projects
                </Link>
                <Link 
                  href="/messages" 
                  className={`text-sm font-medium transition-colors font-general-sans ${
                    isActive("/messages") 
                      ? "text-coral-red border-b-2 border-coral-red pb-1" 
                      : "text-cool-gray-600 hover:text-coral-red"
                  }`}
                >
                  Messages
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-sm text-cool-gray-600 font-general-sans">
                  Welcome, {session.user.name}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="border-cool-gray-300 text-cool-gray-700 hover:bg-coral-red hover:text-white hover:border-coral-red"
                >
                  Sign Out
                </Button>
              </div>
              
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-cool-gray-600 hover:text-coral-red transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-cool-gray-200 py-4">
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/dashboard" 
                  className={`text-sm font-medium transition-colors font-general-sans ${
                    isActive("/dashboard") ? "text-coral-red" : "text-cool-gray-600 hover:text-coral-red"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/projects" 
                  className={`text-sm font-medium transition-colors font-general-sans ${
                    pathname.startsWith("/projects") ? "text-coral-red" : "text-cool-gray-600 hover:text-coral-red"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Projects
                </Link>
                <Link 
                  href="/messages" 
                  className={`text-sm font-medium transition-colors font-general-sans ${
                    isActive("/messages") ? "text-coral-red" : "text-cool-gray-600 hover:text-coral-red"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <div className="pt-3 border-t border-cool-gray-200">
                  <p className="text-sm text-cool-gray-600 font-general-sans mb-2">
                    Welcome, {session.user.name}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="border-cool-gray-300 text-cool-gray-700 hover:bg-coral-red hover:text-white hover:border-coral-red"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    )
  }

  // Default navigation for landing page
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-cool-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-coral-red to-coral-red/80 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg font-big-shoulders tracking-tight">CP</span>
            </div>
            <h1 className="text-2xl font-bold text-deep-black font-big-shoulders tracking-tight">
              Creative Portal
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="w-20 h-9 bg-cool-gray-200 animate-pulse rounded-md"></div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link href="/dashboard" className="font-general-sans">
                    Dashboard
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="border-cool-gray-300 text-cool-gray-700 hover:bg-coral-red hover:text-white hover:border-coral-red font-general-sans"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin" className="font-general-sans">
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="bg-coral-red hover:bg-coral-red/90 text-white font-general-sans">
                  <Link href="/auth/signup">
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}