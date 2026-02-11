"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export function DiagnosticsPanel() {
  const { data: session } = useSession()
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [activeClientId, setActiveClientId] = useState<string | null>(null)
  const [completionCount, setCompletionCount] = useState(0)

  // Only show for admins and when diagnostics is enabled
  const isDiagnosticsEnabled = process.env.NEXT_PUBLIC_DIAGNOSTICS === 'true'
  const isAdmin = session?.user?.role === 'ADMIN'

  useEffect(() => {
    if (!isAdmin || !isDiagnosticsEnabled) return

    // Heuristic to find IDs from URL or state
    const pathParts = window.location.pathname.split('/')
    const projectIdFromUrl = pathParts.find(p => p.length === 25 || p.startsWith('cl')) // cuid length
    if (projectIdFromUrl) setActiveProjectId(projectIdFromUrl)

    // In a real app, we might fetch this from a global state or context
  }, [isAdmin, isDiagnosticsEnabled])

  if (!isAdmin || !isDiagnosticsEnabled) return null

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/90 border border-teal/30 p-4 rounded-lg shadow-2xl backdrop-blur-md max-w-xs font-mono text-[10px] space-y-2 pointer-events-none">
      <div className="flex items-center gap-2 border-b border-teal/20 pb-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
        <span className="text-teal font-bold uppercase tracking-widest">Diagnostics Mode</span>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="text-white/40 uppercase">Role:</span>
        <span className="text-white font-bold">{session?.user?.role}</span>
        
        <span className="text-white/40 uppercase">User ID:</span>
        <span className="text-white truncate">{(session?.user as any)?.id}</span>

        <span className="text-white/40 uppercase">Project ID:</span>
        <span className="text-teal truncate">{activeProjectId || "Not Detected"}</span>

        <span className="text-white/40 uppercase">Client ID:</span>
        <span className="text-coral truncate">{activeClientId || "Not Detected"}</span>
      </div>
    </div>
  )
}
