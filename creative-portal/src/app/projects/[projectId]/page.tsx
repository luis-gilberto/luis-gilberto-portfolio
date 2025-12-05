"use client"

import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

type Deliverable = { name: string; status: string; date?: string; endDate?: string; type: string }
type ProjectData = { id: string; title: string; status: string; risk: string; endDate: string; progress: number; deliverables: Deliverable[]; tier: string; client: string; startDate: string; totalValue: string }

const initialProjectState: ProjectData = { id: '', title: 'Loading Project...', status: 'Loading', risk: 'Loading', endDate: '--', progress: 0, deliverables: [], tier: '', client: '', startDate: '--', totalValue: '--' }

const statusPill = (status: string) => {
  const s = status.toLowerCase()
  if (s === 'completed') return 'bg-emerald-500/20 text-emerald-500'
  if (s === 'in progress') return 'bg-yellow-500/20 text-yellow-500'
  if (s === 'scheduled') return 'bg-blue-500/20 text-blue-500'
  if (s === 'not started') return 'bg-gray-500/20 text-gray-400'
  return 'bg-gray-500/20 text-gray-400'
}

export default function ProjectDetailPage() {
  const params = useParams() as { projectId?: string }
  const [project, setProject] = useState<ProjectData>(initialProjectState)

  useEffect(() => {
    const fetchProject = async (id: string) => {
      const { data: p1, error: e1 } = await supabase.from('projects').select('*').eq('id', id).single()
      let d: any = p1
      if (e1 || !p1) {
        const { data: p2 } = await supabase.from('Project').select('*').eq('id', id).single()
        d = p2
      }
      if (!d) {
        setProject(prev => ({ ...prev, title: 'Project Not Found', status: 'Error' }))
        return
      }
      setProject({
        id: d.id,
        title: d.project_name ?? d.title ?? 'Untitled Project',
        status: d.status ?? 'Active',
        risk: d.risk_level ?? d.risk ?? 'low',
        endDate: d.end_date ?? d.deadline ?? '--',
        progress: d.progress_percentage ?? d.progress ?? 0,
        deliverables: (d.deliverables ?? []) as Deliverable[],
        tier: d.project_type ?? d.tier ?? '',
        client: d.client ?? d.client_name ?? '',
        startDate: d.start_date ?? d.created_at ?? '--',
        totalValue: d.total_value ?? (d.budget ? `$${d.budget}` : '--'),
      })
    }
    if (params.projectId) fetchProject(params.projectId)
  }, [params.projectId])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      <div className="mb-12">
        <span className="text-sm font-bold tracking-widest text-[var(--teal)] uppercase mb-2 block">
          Project Status / The Plan
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] font-big-shoulders">
          {project.title}
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">
          Client: {project.client} · Tier: {project.tier} · Value: {project.totalValue}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
            <h3 className="text-2xl font-bold font-big-shoulders mb-4 border-b border-[var(--border-subtle)] pb-2 text-[var(--teal)]">
              Project Timeline View
            </h3>
            <div className="h-64 flex items-center justify-center text-[var(--text-secondary)] bg-[var(--bg-alt)] rounded-lg">
              [Project Timeline Visualization Component Goes Here]
            </div>
            <div className="mt-4 flex justify-between text-sm text-[var(--text-muted)]">
              <span>Visualization updates based on Project.deliverables data.</span>
              <a href="/docs/timeline" className="text-[var(--coral)] hover:underline">View Documentation</a>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
            <h3 className="text-2xl font-bold font-big-shoulders mb-4 border-b border-[var(--border-subtle)] pb-2">
              The Plan: Milestones & Deliverables
            </h3>
            {project.deliverables.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-4 border-b border-[var(--border-subtle)] last:border-b-0">
                <div className="flex items-center gap-4">
                  <div className={`text-xs font-bold px-3 py-1 rounded-full border ${statusPill(item.status)}`}>
                    {item.status.toUpperCase()}
                  </div>
                  <h4 className="text-lg font-medium text-[var(--text-primary)]">{item.name}</h4>
                </div>
                <div className="text-sm text-[var(--text-muted)]">{(item as any).date || (item as any).endDate}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
            <h3 className="text-xl font-bold font-big-shoulders mb-4">Project Health</h3>
            <div className="text-5xl font-bold text-[var(--coral)]">{project.progress}%</div>
            <p className="text-sm text-[var(--text-secondary)] mt-2">Progress Complete</p>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
            <h3 className="text-xl font-bold font-big-shoulders mb-4">Quick Actions</h3>
            <Button className="w-full bg-[var(--teal)] text-white hover:bg-[#20A29C] transition-colors mb-2">Send Client Review Link</Button>
            <Button variant="outline" className="w-full border-[var(--border-strong)] hover:border-[var(--coral)] hover:text-[var(--coral)]">View Proposal</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
