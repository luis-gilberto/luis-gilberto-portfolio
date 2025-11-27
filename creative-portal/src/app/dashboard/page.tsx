"use client"

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <span className="text-xs font-bold tracking-widest text-[var(--coral)] uppercase mb-2 block"> 
          The Portal 
        </span> 
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] font-big-shoulders"> 
          Welcome back, {session?.user?.name || 'Partner'}. 
        </h1> 
        <p className="text-[var(--text-secondary)] mt-2 max-w-2xl"> 
          Manage your active projects, review assets, and track milestones in one place. 
        </p> 
      </div> 

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
        
        {/* Card 1: Active Projects */}
        <Link href="/projects" className="group"> 
          <div className="h-full p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-[var(--coral)]"> 
            <div className="w-12 h-12 rounded-full bg-[var(--bg-alt)] border border-[var(--border-strong)] flex items-center justify-center mb-6 group-hover:bg-[var(--bg-primary)] transition-colors"> 
              <span className="text-2xl text-[var(--coral)]">📂</span> 
            </div> 
            <h3 className="text-2xl font-bold text-[var(--text-primary)] font-big-shoulders mb-2">Active Projects</h3> 
            <p className="text-[var(--text-secondary)] text-sm"> 
              View timelines, deliverables, and status updates for ongoing work. 
            </p> 
          </div> 
        </Link> 

        {/* Card 2: Messages */}
        <Link href="/messages" className="group"> 
          <div className="h-full p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-[var(--teal)]"> 
            <div className="w-12 h-12 rounded-full bg-[var(--bg-alt)] border border-[var(--border-strong)] flex items-center justify-center mb-6 group-hover:bg-[var(--bg-primary)] transition-colors"> 
              <span className="text-2xl text-[var(--teal)]">💬</span> 
            </div> 
            <h3 className="text-2xl font-bold text-[var(--text-primary)] font-big-shoulders mb-2">Messages</h3> 
            <p className="text-[var(--text-secondary)] text-sm"> 
              Direct line for quick feedback, questions, and strategic alignment. 
            </p> 
          </div> 
        </Link> 

        {/* Card 3: Documents */}
        <Link href="/documents" className="group"> 
          <div className="h-full p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-[var(--text-primary)]"> 
            <div className="w-12 h-12 rounded-full bg-[var(--bg-alt)] border border-[var(--border-strong)] flex items-center justify-center mb-6 group-hover:bg-[var(--bg-primary)] transition-colors"> 
              <span className="text-2xl text-[var(--text-primary)]">📄</span> 
            </div> 
            <h3 className="text-2xl font-bold text-[var(--text-primary)] font-big-shoulders mb-2">Assets & Docs</h3> 
            <p className="text-[var(--text-secondary)] text-sm"> 
              Access contracts, invoices, and final creative assets. 
            </p> 
          </div> 
        </Link> 

      </div> 
    </div> 
  ) 
} 
