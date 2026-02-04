'use client'

import { useSession } from "next-auth/react"

export function UserRoleBadge() {
  const { data: session } = useSession()
  const role = session?.user?.role

  if (!role) return null

  if (role === 'ADMIN') {
    return (
      <div className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-coral to-teal text-white shadow-[0_0_10px_rgba(249,111,110,0.3)]">
        COMMANDER
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
      <div className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-coral/50 bg-coral/10 text-white shadow-[0_0_15px_rgba(249,111,110,0.1)]">
        PARTNER
      </div>
    )
  }

  return null
}
