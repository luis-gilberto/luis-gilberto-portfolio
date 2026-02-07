'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import PageHeader from '@/components/dashboard-ui/PageHeader'
import StatsRow from '@/components/dashboard-ui/StatsRow'
import QuickActions from '@/components/dashboard-ui/QuickActions'
import RecentProjects from '@/components/dashboard-ui/RecentProjects'
import SystemFeed from '@/components/dashboard-ui/SystemFeed'
import { AddClientModal } from '@/components/admin/add-client-modal'
import { useState } from 'react'

interface AdminDashboardProps {
  stats: {
    totalClients: number
    totalProjects: number
    activeProjects: number
    pendingTasks: number
  }
  projects: any[]
  systemEvents: any[]
}

export default function AdminDashboardClient({ stats, projects, systemEvents }: AdminDashboardProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      )
    }
  }, [])

  return (
    <div ref={contentRef} className="max-w-[1600px] mx-auto py-6">
      <PageHeader />
      <StatsRow className="mt-8" stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
        <div className="lg:col-span-8">
          <RecentProjects data={projects} />
        </div>
        <div className="lg:col-span-4">
          <SystemFeed data={systemEvents} />
        </div>
      </div>

      <QuickActions 
        className="mt-12" 
        onNewProject={() => setIsNewProjectModalOpen(true)}
      />

      <AddClientModal 
        isOpen={isNewProjectModalOpen} 
        onOpenChange={setIsNewProjectModalOpen} 
        onClientAdded={() => window.location.reload()} 
      />
    </div>
  )
}
