'use client'

import { useSession } from "next-auth/react"

interface UserRoleBadgeProps {
  role?: string
}

export function UserRoleBadge({ role: propRole }: UserRoleBadgeProps = {}) {
  const { data: session } = useSession()
  const role = propRole || session?.user?.role

  if (!role) return null

  if (role === 'ADMIN') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-sm text-[10px] font-medium tracking-[0.2em] uppercase border border-white/10 bg-white/5 text-white/80 font-sans">
        <div className="w-1.5 h-1.5 rounded-full bg-[#2ED3C6]" />
        COMMAND
      </div>
    )
  }

  if (role === 'CONSULTANT') {
    return (
      <div className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-teal text-black">
        STRATEGIST
      </div>
    )
  }

  if (role === 'CLIENT') {
    return (
      <div className="px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] border border-white/10 bg-white/5 text-white/40 font-sans">
        Partner
      </div>
    )
  }

  return null
}
