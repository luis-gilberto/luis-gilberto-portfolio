"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ui/ThemeToggle"
import Link from "next/link"

export default function AdminProjectsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM_MEMBER")) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  if (status === "loading") return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <Button variant="ghost" onClick={() => router.push('/admin')} className="text-gray-400 hover:text-white">
               ← Back
             </Button>
             <h1 className="text-2xl font-bold font-big-shoulders tracking-wide">Active Projects</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <span className="text-4xl">🚧</span>
          </div>
          <h2 className="text-3xl font-bold font-big-shoulders tracking-wide mb-4 text-white">
            Module Under Construction
          </h2>
          <p className="text-gray-400 mb-8">
            The Project Command Center is coming in the next release. This module will allow comprehensive project tracking, milestone management, and client collaboration.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" className="border-white/20 hover:bg-white hover:text-black transition-colors">
              <Link href="/admin">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
