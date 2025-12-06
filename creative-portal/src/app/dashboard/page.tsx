"use client"

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const mockScopeIQData = {
  projectType: 'Brand Repositioning',
  budgetRange: '$25K - $50K',
  timeline: '3-6 months',
  companySize: '50-200 employees'
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [clientContext, setClientContext] = useState(mockScopeIQData)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/user-data?email=${encodeURIComponent(session.user.email)}`)
          if (res.ok) {
            const data = await res.json()
            const scope = data?.scopeiq_data || mockScopeIQData
            setClientContext(scope)
            setIsDataLoaded(true)
            return
          }
        } catch {}
        setClientContext(mockScopeIQData)
        setIsDataLoaded(true)
      }
    }
    load()
  }, [session])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 text-center md:text-left">
        <span className="text-xs font-bold tracking-widest text-[var(--coral)] uppercase mb-2 block">The Portal</span>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] font-big-shoulders">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Partner'}.
        </h1>
        <p className="text-[var(--text-secondary)] mt-2 max-w-2xl">Manage your projects, review assets, and track milestones in one place.</p>
      </div>

      <div className="mb-12 p-6 rounded-2xl bg-[var(--bg-alt)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
        <h2 className="text-xl font-bold font-big-shoulders mb-4 text-[var(--coral)]">Your Plan Summary</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)]">
            <div className="text-xs text-[var(--text-muted)] mb-1 uppercase opacity-80">Primary Focus</div>
            <div className="font-semibold text-[var(--text-primary)] text-sm">{clientContext.projectType}</div>
          </div>
          <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)]">
            <div className="text-xs text-[var(--text-muted)] mb-1 uppercase opacity-80">Investment</div>
            <div className="font-semibold text-[var(--text-primary)] text-sm">{clientContext.budgetRange}</div>
          </div>
          <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)]">
            <div className="text-xs text-[var(--text-muted)] mb-1 uppercase opacity-80">Timeline</div>
            <div className="font-semibold text-[var(--text-primary)] text-sm">{clientContext.timeline}</div>
          </div>
          <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)]">
            <div className="text-xs text-[var(--text-muted)] mb-1 uppercase opacity-80">Organization Size</div>
            <div className="font-semibold text-[var(--text-primary)] text-sm">{clientContext.companySize}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/projects" className="group">
          <div className="h-full p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-[var(--coral)]">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-alt)] border border-[var(--border-strong)] flex items-center justify-center mb-6 group-hover:bg-[var(--bg-primary)] transition-colors">
              <span className="text-2xl text-[var(--coral)]">📂</span>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] font-big-shoulders mb-2">Projects</h3>
            <p className="text-[var(--text-secondary)] text-sm">View timelines, deliverables, and status updates.</p>
          </div>
        </Link>

        <Link href="/messages" className="group">
          <div className="h-full p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-[var(--teal)]">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-alt)] border border-[var(--border-strong)] flex items-center justify-center mb-6 group-hover:bg-[var(--bg-primary)] transition-colors">
              <span className="text-2xl text-[var(--teal)]">💬</span>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] font-big-shoulders mb-2">Messages</h3>
            <p className="text-[var(--text-secondary)] text-sm">Direct line for quick feedback and strategic alignment.</p>
          </div>
        </Link>

        <Link href="/documents" className="group">
          <div className="h-full p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-[var(--text-primary)]">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-alt)] border border-[var(--border-strong)] flex items-center justify-center mb-6 group-hover:bg-[var(--bg-primary)] transition-colors">
              <span className="text-2xl text-[var(--text-primary)]">📄</span>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] font-big-shoulders mb-2">Assets & Docs</h3>
            <p className="text-[var(--text-secondary)] text-sm">Access contracts, invoices, and final creative assets.</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
