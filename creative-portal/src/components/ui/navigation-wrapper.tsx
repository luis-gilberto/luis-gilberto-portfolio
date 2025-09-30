"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "./navigation"

export function NavigationWrapper() {
  const pathname = usePathname()
  
  // Determine if we're on a dashboard page
  const isDashboardPage = pathname.startsWith("/dashboard") || 
                         pathname.startsWith("/projects") || 
                         pathname.startsWith("/messages") ||
                         pathname.startsWith("/admin")
  
  return (
    <Navigation variant={isDashboardPage ? "dashboard" : "default"} />
  )
}