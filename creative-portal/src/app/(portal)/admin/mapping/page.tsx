"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { 
  Users, 
  FolderKanban, 
  Link as LinkIcon, 
  Unlink, 
  ShieldAlert, 
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/providers/toast-provider"

export default function MappingPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [syncingId, setSyncingId] = useState<string | null>(null)
  const [forceSyncing, setForceSyncing] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') redirect('/login')
    if (session?.user?.role !== 'ADMIN') redirect('/dashboard')
    
    fetchMappingData()
  }, [session, status])

  const fetchMappingData = async () => {
    try {
      const res = await fetch('/api/admin/mapping')
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
      console.error(err)
      toast("FETCH FAILED", "Could not retrieve mapping data.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleHardLink = async (clientId: string, userId: string, projectId: string) => {
    setSyncingId(clientId)
    try {
      const res = await fetch('/api/admin/hard-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, userId, projectId })
      })

      if (res.ok) {
        toast("LINKAGE SECURED", "Acme User has been hard-linked to Project ID.", "success")
        fetchMappingData()
      } else {
        toast("LINKAGE FAILED", "Could not synchronize mapping.", "error")
      }
    } catch (err) {
      console.error(err)
      toast("ERROR", "A fatal error occurred during sync.", "error")
    } finally {
      setSyncingId(null)
    }
  }

  const handleForceSync = async (email: string, projectId: string) => {
    setForceSyncing(true)
    try {
      const res = await fetch('/api/admin/force-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, projectId })
      })

      if (res.ok) {
        toast("ACME FIXED", "User anchored to VHV32LIT.", "success")
        fetchMappingData()
      } else {
        toast("SYNC FAILED", "Could not force sync.", "error")
      }
    } catch (err) {
      console.error(err)
      toast("ERROR", "A fatal error occurred.", "error")
    } finally {
      setForceSyncing(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <RefreshCw className="animate-spin text-teal" size={32} />
    </div>
  )

  return (
    <div className="p-8 md:p-16 max-w-7xl mx-auto space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-coral" size={24} />
          <h1 className="text-3xl font-bold font-big-shoulders tracking-widest italic uppercase text-white">
            Data Integrity & Mapping Utility
          </h1>
        </div>
        <p className="text-zinc-500 max-w-2xl font-inter leading-relaxed italic">
          Synchronize the single source of truth by hard-linking users to business entities and projects. 
          Use this to resolve discrepancies between Admin and Partner views.
        </p>
        
        <div className="pt-4">
          <Button 
            onClick={() => handleForceSync('client@acme.com', 'cml73ju300003vkikvhv32lit')}
            disabled={forceSyncing}
            className="bg-coral hover:bg-coral/90 text-black font-bold tracking-widest px-8 h-12 rounded-xl"
          >
            {forceSyncing ? <RefreshCw className="animate-spin mr-2" size={16} /> : <ShieldAlert className="mr-2" size={16} />}
            FORCE SYNC ACME (VHV32LIT)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {data.map((client) => (
          <div key={client.id} className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white tracking-tight">{client.name}</h2>
                <p className="text-[10px] text-white/20 font-bold tracking-[0.3em] uppercase">Client Entity // {client.id}</p>
              </div>
              <Badge variant="outline" className="bg-teal/5 text-teal border-teal/20 px-3 py-1">
                {client.projects.length} Active Projects
              </Badge>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Linked Users */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-white/40 mb-4">
                  <Users size={16} />
                  <span className="text-[11px] font-bold tracking-widest uppercase">Associated Users</span>
                </div>
                
                <div className="space-y-4">
                  {client.users.length > 0 ? client.users.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-white">{user.name || user.email}</p>
                        <p className="text-[10px] text-white/20 font-mono">{user.id}</p>
                      </div>
                      <Badge className="bg-white/5 text-white/40 text-[9px] font-bold">
                        {user.role}
                      </Badge>
                    </div>
                  )) : (
                    <div className="p-4 border border-dashed border-white/10 rounded-xl text-center">
                      <p className="text-[10px] text-white/20 font-bold uppercase italic">No users linked</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Projects */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-white/40 mb-4">
                  <FolderKanban size={16} />
                  <span className="text-[11px] font-bold tracking-widest uppercase">Active Projects</span>
                </div>

                <div className="space-y-4">
                  {client.projects.map((project: any) => {
                    const isLinked = client.users.some((u: any) => u.clientId === client.id);
                    
                    return (
                      <div key={project.id} className="p-6 bg-black/40 border border-white/5 rounded-xl space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-white">{project.title}</p>
                            <p className="text-[10px] text-teal font-mono tracking-widest uppercase">{project.id}</p>
                          </div>
                          <Badge className={project.status === 'ACTIVE' ? "bg-teal/20 text-teal" : "bg-white/5 text-white/40"}>
                            {project.status}
                          </Badge>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {isLinked ? (
                              <CheckCircle2 className="text-teal" size={14} />
                            ) : (
                              <AlertCircle className="text-coral" size={14} />
                            )}
                            <span className="text-[9px] font-bold tracking-widest uppercase text-white/40">
                              {isLinked ? "Linkage Verified" : "Orphaned Project"}
                            </span>
                          </div>

                          <Button 
                            variant="outline"
                            size="sm"
                            disabled={syncingId === client.id}
                            onClick={() => handleHardLink(client.id, client.users[0]?.id, project.id)}
                            className="h-8 border-teal/30 text-teal hover:bg-teal/5 text-[10px] font-bold tracking-widest uppercase rounded-lg"
                          >
                            {syncingId === client.id ? <RefreshCw className="animate-spin mr-2" size={12} /> : <LinkIcon className="mr-2" size={12} />}
                            Hard-Link
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
