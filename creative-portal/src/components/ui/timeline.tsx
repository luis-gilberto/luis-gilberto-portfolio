"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

type Initiative = { id: string; name: string; color: string }
type Task = { id: string; title: string; description: string; status: string; priority: string; assignee: string; due_date: string; initiativeId?: string }
type Milestone = { id: string; title: string; date: string; phase: string; initiativeId?: string; progress: number }

type Props = {
  initiatives: Initiative[]
  tasks: Task[]
  milestones: Milestone[]
}

export default function Timeline({ initiatives, tasks, milestones }: Props) {
  const [view, setView] = useState<'internal' | 'executive'>('internal')
  const [filter, setFilter] = useState<string>('all')

  const palette = useMemo(() => Object.fromEntries(initiatives.map(i => [i.id, i.color])), [initiatives])

  const filteredTasks = useMemo(() => filter === 'all' ? tasks : tasks.filter(t => t.initiativeId === filter), [tasks, filter])
  const filteredMilestones = useMemo(() => filter === 'all' ? milestones : milestones.filter(m => m.initiativeId === filter), [milestones, filter])

  const completionPct = useMemo(() => {
    const total = filteredTasks.length
    const done = filteredTasks.filter(t => t.status === 'completed').length
    return total ? Math.round((done / total) * 100) : 0
  }, [filteredTasks])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[var(--text-secondary)]">Initiative</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-9 rounded-md bg-[var(--bg-alt)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
            <option value="all">All</option>
            {initiatives.map(i => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[var(--text-secondary)]">View</label>
          <div className="flex rounded-md overflow-hidden border border-[var(--border-subtle)]">
            <button onClick={() => setView('internal')} className={`px-3 py-1 text-sm ${view === 'internal' ? 'bg-[var(--coral)] text-white' : 'bg-[var(--bg-alt)] text-[var(--text-primary)]'}`}>Internal</button>
            <button onClick={() => setView('executive')} className={`px-3 py-1 text-sm ${view === 'executive' ? 'bg-[var(--coral)] text-white' : 'bg-[var(--bg-alt)] text-[var(--text-primary)]'}`}>Executive</button>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="w-40">
            <div className="flex justify-between text-xs mb-1 text-[var(--text-secondary)]"><span>Progress</span><span>{completionPct}%</span></div>
            <Progress value={completionPct} className="h-2" />
          </div>
          <Button onClick={() => window.print()} className="print:hidden">Export</Button>
        </div>
      </div>

      {view === 'internal' ? (
        <div className="space-y-4">
          {filteredTasks.map(t => (
            <div key={t.id} className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: palette[t.initiativeId || initiatives[0]?.id] }} />
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">{t.title}</h4>
                </div>
                <Badge variant="outline" className="text-xs">{t.status.replace('_', ' ')}</Badge>
              </div>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">{t.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)]">
                <span>Assignee: <span className="font-medium text-[var(--text-primary)]">{t.assignee}</span></span>
                <span>Due: <span className="font-medium text-[var(--text-primary)]">{new Date(t.due_date).toLocaleDateString()}</span></span>
                <span>Priority: <span className="font-medium text-[var(--text-primary)]">{t.priority}</span></span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">Milestones</h4>
              <Badge variant="outline" className="text-xs">Forecast</Badge>
            </div>
            <div className="space-y-3">
              {filteredMilestones.map(m => (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: palette[m.initiativeId || initiatives[0]?.id] }} />
                    <div>
                      <div className="text-sm text-[var(--text-primary)]">{m.title}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{m.phase}</div>
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="flex justify-between text-[var(--text-secondary)] text-xs mb-1"><span>{new Date(m.date).toLocaleDateString()}</span><span>{m.progress}%</span></div>
                    <Progress value={m.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)]">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Phases</h4>
            <div className="space-y-4">
              {['Discovery','Design','Build','Launch'].map((phase, idx) => {
                const phaseTasks = filteredTasks.filter(t => {
                  if (idx === 0) return t.status === 'todo'
                  if (idx === 1) return t.status === 'in_progress'
                  if (idx === 2) return t.status === 'review'
                  return t.status === 'completed'
                })
                const total = phaseTasks.length
                const pct = total ? Math.round((phaseTasks.filter(t => t.status === 'completed').length / total) * 100) : 0
                return (
                  <div key={phase}>
                    <div className="flex justify-between text-xs mb-1 text-[var(--text-secondary)]"><span>{phase}</span><span>{pct}%</span></div>
                    <Progress value={pct} className="h-2" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

