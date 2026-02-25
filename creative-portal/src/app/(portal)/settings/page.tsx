"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  User, 
  Mail, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  RefreshCw,
  Save,
  Link as LinkIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/providers/toast-provider"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    company: "",
    title: "",
    role: "",
    linkedProjectId: "",
    linkedProjectTitle: ""
  })

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    } catch (err) {
      console.error(err)
      toast("FETCH FAILED", "Could not retrieve profile data.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })

      if (res.ok) {
        toast("PROFILE UPDATED", "Your settings have been synchronized.", "success")
        updateSession()
      } else {
        toast("UPDATE FAILED", "Could not save profile changes.", "error")
      }
    } catch (err) {
      console.error(err)
      toast("ERROR", "A fatal error occurred during save.", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <RefreshCw className="animate-spin text-teal" size={32} />
    </div>
  )

  return (
    <div className="p-8 md:p-16 max-w-5xl mx-auto space-y-16 animate-in fade-in duration-700">
      {/* Secondary Exit: Standard Breadcrumb */}
      <div className="mb-8">
        <Breadcrumbs 
          showBack={false}
          items={[
            { label: 'DASHBOARD', href: '/dashboard' },
            { label: 'SYSTEM SETTINGS', active: true }
          ]} 
        />
      </div>

      {/* A. Header: Strategic Identity Card */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-10 md:p-16 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity">
          <ShieldCheck size={200} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 relative z-10">
          <div className="w-40 h-40 rounded-full border border-teal/20 flex items-center justify-center bg-teal/[0.02] text-teal text-5xl font-bold font-big-shoulders italic shadow-[0_0_40px_rgba(46,211,198,0.05)]">
            {profile.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P'}
          </div>
          
          <div className="text-center md:text-left space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-coral tracking-[0.4em] uppercase">Strategic Identity</span>
              <h1 className="text-5xl md:text-7xl font-black font-big-shoulders tracking-tighter uppercase text-white leading-none italic">
                {profile.name || 'Anonymous Partner'}
              </h1>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-teal shadow-[0_0_10px_rgba(46,211,198,0.5)]" />
                <span className="text-[11px] font-bold text-white tracking-[0.3em] uppercase">
                  {profile.role === 'ADMIN' ? 'Master Architect' : (profile.title || 'Strategic Partner')}
                </span>
              </div>
              <div className="hidden md:block w-px h-4 bg-white/10" />
              <div className="flex items-center gap-3">
                <Building2 size={12} className="text-white/20" />
                <span className="text-[11px] font-bold text-white/40 tracking-[0.3em] uppercase">
                  {profile.role === 'ADMIN' ? 'Command Center' : (profile.company || 'Private Entity')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM CONNECTION STATUS - Page 13 Refinement */}
      <div className="grid grid-cols-3 gap-4 px-4">
        {[
          { label: 'API GATEWAY', status: 'ACTIVE' },
          { label: 'DATABASE', status: 'SYNCED' },
          { label: 'AUTH PROTOCOL', status: 'SECURE' }
        ].map((sys) => (
          <div key={sys.label} className="flex items-center gap-3 py-4 border-b border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-teal shadow-[0_0_8px_rgba(46,211,198,0.4)]" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-white/20 tracking-[0.2em] uppercase">{sys.label}</span>
              <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase italic font-big-shoulders">{sys.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* B. Content: System Connection Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          <form onSubmit={handleSave} className="space-y-16">
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-[1px] bg-white/10" />
                <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/30">Identity Parameters</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                <div className="space-y-3 group">
                  <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] group-focus-within:text-coral transition-colors">Legal Name</label>
                  <Input 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="bg-transparent border-0 border-b border-white/5 rounded-none px-0 h-12 text-white font-inter text-lg focus:border-coral transition-all focus:ring-0 placeholder:text-white/5"
                    placeholder="Full Name"
                  />
                </div>

                <div className="space-y-3 opacity-60">
                  <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Email Address</label>
                  <Input 
                    value={profile.email}
                    readOnly
                    className="bg-transparent border-0 border-b border-white/5 rounded-none px-0 h-12 text-zinc-500 font-inter text-lg cursor-not-allowed focus:ring-0"
                  />
                  <p className="text-[8px] text-zinc-700 tracking-widest uppercase italic">Contact technical support to update email identity.</p>
                </div>

                <div className="space-y-3 group">
                  <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] group-focus-within:text-coral transition-colors">Organization</label>
                  <Input 
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                    className="bg-transparent border-0 border-b border-white/5 rounded-none px-0 h-12 text-white font-inter text-lg focus:border-coral transition-all focus:ring-0 placeholder:text-white/5"
                    placeholder="Company Name"
                  />
                </div>

                <div className="space-y-3 group">
                  <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] group-focus-within:text-coral transition-colors">Strategic Title</label>
                  <Input 
                    value={profile.title}
                    onChange={(e) => setProfile({...profile, title: e.target.value})}
                    className="bg-transparent border-0 border-b border-white/5 rounded-none px-0 h-12 text-white font-inter text-lg focus:border-coral transition-all focus:ring-0 placeholder:text-white/5"
                    placeholder="Executive Role"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <Button 
                type="submit"
                disabled={saving}
                className="bg-coral hover:bg-coral/90 text-[#050505] font-black tracking-[0.3em] px-16 h-16 rounded-2xl shadow-[0_0_30px_rgba(249,111,110,0.15)] transition-all uppercase text-[11px] group"
              >
                {saving ? <RefreshCw className="animate-spin mr-3" size={16} /> : <Save className="mr-3 group-hover:scale-110 transition-transform" size={16} />}
                Synchronize Identity
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-white/10" />
            <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/30">System Status</h2>
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-8 relative overflow-hidden">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Connection Health</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                    <span className="text-[9px] font-bold text-teal uppercase tracking-widest">Active</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-zinc-400 font-inter leading-relaxed italic">
                    "StrategyIQ™ Engine is currently synced with your local environment. Data integrity verified."
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Protocol Version</p>
                    <p className="text-[10px] text-white font-mono">v5.7.0</p>
                  </div>
                  <ShieldCheck size={16} className="text-teal/40" />
                </div>
              </div>
            </div>

            {/* C. Footer: Legal/IP notice - Page 13 Wireframe Alignment */}
            <div className="pt-12 mt-12 border-t border-white/5 space-y-4">
              <p className="text-[10px] text-zinc-500 font-inter leading-relaxed uppercase tracking-[0.2em] max-w-2xl">
                <span className="text-coral font-bold mr-2">NOTICE:</span> 
                Confidential and Proprietary Information. Authorized use only. This portal and the StrategyIQ™ Engine contain proprietary trade secrets. Unauthorized access or disclosure is strictly prohibited under federal and international law.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-zinc-700 font-mono tracking-widest uppercase">Protocol Identity</span>
                  <span className="text-[10px] text-white/40 font-mono tracking-tighter uppercase">StrategyIQ™ v5.7.0 // SECURE</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-zinc-700 font-mono tracking-widest uppercase">Artifact Hash</span>
                  <span className="text-[10px] text-white/40 font-mono tracking-tighter">{session?.user?.id?.toUpperCase() || "UNKNOWN_ID"}</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal shadow-[0_0_8px_rgba(46,211,198,0.3)]" />
                  <span className="text-[9px] font-bold text-teal/40 uppercase tracking-[0.3em]">Access Monitored</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
