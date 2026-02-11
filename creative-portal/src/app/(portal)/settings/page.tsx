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
    <div className="p-8 md:p-16 max-w-4xl mx-auto space-y-12">
      {/* Task 1: Strategic Identity Card */}
      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
          <ShieldCheck size={160} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
          <div className="w-32 h-32 rounded-full border-2 border-teal/30 flex items-center justify-center bg-teal/5 text-teal text-4xl font-bold font-big-shoulders italic">
            {profile.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P'}
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold font-big-shoulders tracking-widest italic uppercase text-white leading-none">
              {profile.name || 'Partner Name'}
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <span className="text-[11px] font-bold text-teal tracking-[0.3em] uppercase">
                {profile.title || 'Strategic Partner'}
              </span>
              <div className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
              <span className="text-[11px] font-bold text-white/40 tracking-[0.3em] uppercase">
                {profile.company || 'Organization'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-16">
        {/* Task 2: System Connection Transparency */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-teal" />
            <h2 className="text-[11px] font-bold tracking-[0.4em] uppercase text-white/40">System Connection</h2>
          </div>
          
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase">Active strategic ecosystem</p>
                <p className="text-xl font-medium text-white tracking-tight">{profile.linkedProjectTitle || "No active project detected"}</p>
              </div>
              <div className="space-y-1 md:text-right">
                <p className="text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase">Project identifier</p>
                <p className="text-sm font-mono text-zinc-500 tracking-widest">{profile.linkedProjectId || "DISCONNECTED"}</p>
              </div>
            </div>
            
            {profile.linkedProjectId ? (
              <div className="flex items-center gap-2 text-teal/60">
                <ShieldCheck size={14} />
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase">Linkage Verified // Strategic Node Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-coral animate-pulse">
                <LinkIcon size={14} />
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase">Action Required // Reconnect to Ecosystem</span>
              </div>
            )}
          </div>
        </div>

        {/* Task 3: Editorial Form Styling */}
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <h2 className="text-[11px] font-bold tracking-[0.4em] uppercase text-white/40">Identity Parameters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Legal Name</label>
              <Input 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 h-10 text-white font-inter focus:border-white transition-all focus:ring-0 placeholder:text-white/5"
                placeholder="Partner Identity"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email (Read-only)</label>
              <Input 
                value={profile.email}
                readOnly
                className="bg-transparent border-0 border-b border-white/5 rounded-none px-0 h-10 text-zinc-600 font-inter cursor-not-allowed focus:ring-0"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Organization</label>
              <Input 
                value={profile.company}
                onChange={(e) => setProfile({...profile, company: e.target.value})}
                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 h-10 text-white font-inter focus:border-white transition-all focus:ring-0 placeholder:text-white/5"
                placeholder="Enterprise Entity"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Strategic Title</label>
              <Input 
                value={profile.title}
                onChange={(e) => setProfile({...profile, title: e.target.value})}
                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 h-10 text-white font-inter focus:border-white transition-all focus:ring-0 placeholder:text-white/5"
                placeholder="Executive Role"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-start pt-8">
          <Button 
            type="submit"
            disabled={saving}
            className="bg-coral hover:bg-coral/90 text-black font-black tracking-[0.3em] px-12 h-14 rounded-full shadow-2xl transition-all uppercase text-[10px]"
          >
            {saving ? <RefreshCw className="animate-spin mr-2" size={16} /> : null}
            Update Identity
          </Button>
        </div>
      </form>
    </div>
  )
}
