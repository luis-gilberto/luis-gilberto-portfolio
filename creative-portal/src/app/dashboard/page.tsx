'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// --- SUPABASE CLIENT ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

export default function Dashboard() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [hasProjects, setHasProjects] = useState(false)
  const [hasAssessment, setHasAssessment] = useState(false)

  useEffect(() => {
    async function checkClientStatus() {
      if (session?.user?.email) {
        if (!supabase) {
          setIsLoading(false)
          return
        }
        const { data: user } = await supabase.from('User').select('id').eq('email', session.user.email).single();
        
        if (user) {
            // 2. Check for Projects (Is this an active client?)
            const { count: projectCount } = await supabase
                .from('Project')
                .select('*', { count: 'exact', head: true })
                .eq('userId', user.id);
            
            // 3. Check for Assessments (Have they started strategy?)
            const { count: assessmentCount } = await supabase
                .from('assessment_sessions')
                .select('*', { count: 'exact', head: true })
                .eq('consultant_id', user.id); // Note: using consultant_id as user link based on schema

            if (projectCount && projectCount > 0) setHasProjects(true);
            if (assessmentCount && assessmentCount > 0) setHasAssessment(true);
        }
      }
      setIsLoading(false);
    }
    checkClientStatus();
  }, [session]);

  // Helper for Locked Cards
  const LockedOverlay = ({ label }: { label: string }) => (
    <div className="absolute inset-0 bg-[#0E0E0F]/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-2xl border border-white/5">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <i className="fas fa-lock text-[var(--text-muted)]"></i>
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <span className="text-xs font-bold tracking-widest text-[var(--coral)] uppercase mb-2 block">
          The Portal
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] font-big-shoulders">
          Welcome, {session?.user?.name?.split(' ')[0] || 'Partner'}.
        </h1>
        <p className="text-[var(--text-secondary)] mt-2 max-w-2xl">
          {hasProjects
            ? "Manage your active projects, review assets, and track milestones in one place."
            : "Let's get started. Your strategic journey begins with the assessment below."}
        </p>
      </div>

      {/* --- ONBOARDING HERO (Only for New Clients) --- */}
      {!hasProjects && !isLoading && (
          <div className="mb-12 p-8 rounded-3xl bg-gradient-to-r from-[var(--bg-alt)] to-[var(--card-bg)] border border-[var(--coral)] shadow-[var(--shadow-hover)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                  <i className="fas fa-rocket text-9xl text-[var(--coral)]"></i>
              </div>
              <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl font-bold text-[var(--text-primary)] font-big-shoulders mb-4">
                      Step 1: Define Your Strategy
                  </h2>
                  <p className="text-[var(--text-secondary)] mb-8 text-lg">
                      We need to map your goals before we build. Use the StrategyIQ Engine to create your custom roadmap.
                  </p>
                  <Link href="/strategyiq" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[var(--coral)] text-white font-bold uppercase tracking-wide hover:bg-[#E55A5A] transition-all shadow-lg hover:-translate-y-1">
                      Launch StrategyIQ
                  </Link>
              </div>
          </div>
      )}

      {/* --- ACTIVE PLAN SUMMARY (Only for Active Clients) --- */}
      {hasProjects && (
        <div className="mb-12 p-6 rounded-2xl bg-[var(--bg-alt)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold font-big-shoulders text-[var(--coral)]">Your Plan Summary</h2>
            <span className="text-xs font-mono text-[var(--teal)] bg-[var(--teal)]/10 px-3 py-1 rounded-full">ACTIVE ENGAGEMENT</span>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Primary Focus</div>
                  <div className="font-bold text-[var(--text-primary)]">Brand Repositioning</div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Status</div>
                  <div className="font-bold text-yellow-500">In Progress</div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Timeline</div>
                  <div className="font-bold text-[var(--text-primary)]">3-6 Months</div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Team Access</div>
                  <div className="font-bold text-[var(--text-primary)]">Full Suite</div>
              </div>
          </div>
        </div>
      )}

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        
        {/* Card 1: Active Projects */}
        <div className="relative h-full">
            {!hasProjects && <LockedOverlay label="Active after StrategyIQ" />}
            <Link href="/projects" className={`group block h-full ${!hasProjects ? 'pointer-events-none grayscale opacity-50' : ''}`}>
              <div className="h-full p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-[var(--coral)]">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-alt)] border border-[var(--border-strong)] flex items-center justify-center mb-6 group-hover:bg-[var(--bg-primary)] transition-colors">
                  <span className="text-2xl text-[var(--coral)]">📂</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] font-big-shoulders mb-2">Projects</h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  View timelines, deliverables, and status updates.
                </p>
              </div>
            </Link>
        </div>

        {/* Card 2: Messages (Always Active) */}
        <Link href="/messages" className="group block">
          <div className="h-full p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-[var(--teal)]">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-alt)] border border-[var(--border-strong)] flex items-center justify-center mb-6 group-hover:bg-[var(--bg-primary)] transition-colors">
              <span className="text-2xl text-[var(--teal)]">💬</span>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] font-big-shoulders mb-2">Messages</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Direct line for quick feedback and strategic alignment.
            </p>
          </div>
        </Link>

        {/* Card 3: Documents */}
        <div className="relative h-full">
            {!hasProjects && <LockedOverlay label="Unlocked with Project" />}
            <Link href="/documents" className={`group block h-full ${!hasProjects ? 'pointer-events-none grayscale opacity-50' : ''}`}>
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
    </div>
  )
}
