"use client"

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null

interface ProjectDB {
  id: string
  title: string
  status: string
  risk_level: string
  end_date: string
  progress_percentage: number
  project_type: string
  total_value: number
  userId: string
  client?: { name: string }
}

const statusStyles: Record<string, string> = {
  'in progress': 'bg-yellow-600/20 text-yellow-500 border-yellow-600',
  'planning': 'bg-blue-600/20 text-blue-500 border-blue-600',
  'review': 'bg-purple-600/20 text-purple-500 border-purple-600',
  'completed': 'bg-emerald-600/20 text-emerald-500 border-emerald-600',
  'high': 'text-[var(--coral)]',
  'medium': 'text-yellow-500'
}

export default function ProjectsPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<ProjectDB[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      const userEmail = session?.user?.email
      if (!userEmail) return
      if (!supabase) { setProjects([]); return }

      const { data: clientRecord, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', userEmail)
        .limit(1)
        .single()

      if (clientError || !clientRecord) {
        console.warn('RLS Warning: No client record found for user. Assuming empty project list.')
        setProjects([])
        return
      }

      const clientUserId = (clientRecord as any).id

      const { data, error } = await supabase
        .from('Project')
        .select(`
          id, title, status, risk_level, end_date, progress_percentage, project_type, total_value
        `)
        .eq('userId', clientUserId)
        .order('end_date', { ascending: true })

      if (error) {
        console.error('Error fetching projects:', error)
        return
      }

      setProjects((data as unknown as ProjectDB[]) || [])
    }

    if (session?.user?.id) fetchProjects()
  }, [session])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] font-big-shoulders">
          Active Projects
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">
          View timelines, deliverables, and status updates for ongoing work.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl-grid-cols-4 gap-6">
        {projects.length === 0 ? (
          <div className="lg:col-span-4 p-8 text-center text-gray-500 border border-dashed border-gray-600 rounded-lg">No active projects found.</div>
        ) : (
        projects.map((project) => {
          const status = (project.status || '').toLowerCase()
          const statusStyle = statusStyles[status] || 'bg-gray-600/20 text-gray-400 border-gray-600'
          const riskStyle = statusStyles[(project.risk_level || '').toLowerCase()] || 'text-gray-400'

          return (
            <Link key={project.id} href={`/projects/${project.id}`} className="group block">
              <div className="p-6 h-full rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)] hover:border-[var(--coral)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all duration-300">
                <div className={`text-xs font-bold px-3 py-1 rounded-full border mb-4 w-fit uppercase ${statusStyle}`}>
                  {project.status}
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] font-big-shoulders mb-2">{project.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm mb-4">Progress: {project.progress_percentage}%</p>
                <div className="flex justify-between items-center pt-4 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center text-xs">
                    <i className={`fas fa-exclamation-triangle ${riskStyle} mr-1`}></i>
                    <span className={riskStyle}>Risk: {project.risk_level}</span>
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    Due: {project.end_date}
                  </div>
                </div>
              </div>
            </Link>
          )
        }))}
      </div>
    </div>
  )
}
