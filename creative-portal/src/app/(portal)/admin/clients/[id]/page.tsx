
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DangerZone } from '@/components/admin/DangerZone'
import { ArrowLeft, Building2, Calendar, Mail, User, Shield } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CopyId } from '@/components/shared/CopyId'

interface ClientPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClientDetailPage({ params }: ClientPageProps) {
  const { id } = await params
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      projects: true,
      users: true,
      assessmentSessions: true
    }
  })

  if (!client) {
    notFound()
  }

  return (
    <div className="p-8 max-w-[1200px] mx-auto text-white min-h-screen">
      {/* Navigation */}
      <Link 
        href="/admin/clients" 
        className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-mono uppercase text-xs tracking-widest">Back to Directory</span>
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start mb-12 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#F96F6E] border border-white/10">
              <Building2 size={32} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold italic uppercase tracking-wider mb-2">
                {client.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-big-shoulders font-black tracking-[0.2em] text-white/60 uppercase">
                  Identity node
                </span>
                <CopyId id={client.id} className="text-[#9CA3AF] font-mono" />
              </div>
            </div>
          </div>
        </div>
        
        <Badge 
          variant="outline" 
          className={`px-4 py-2 uppercase tracking-widest ${
            client.status === 'Active' 
              ? 'border-teal-500/20 text-teal-400 bg-teal-500/5' 
              : 'border-white/10 text-gray-500'
          }`}
        >
          {client.status}
        </Badge>
      </div>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Contact Intel */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">
            Contact Intelligence
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail size={16} className="text-[#F96F6E] mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">Email</p>
                <p className="text-white font-inter">{client.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User size={16} className="text-[#F96F6E] mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">Primary Contact</p>
                <p className="text-white font-inter">{client.contact || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-[#F96F6E] mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">Onboarded</p>
                <p className="text-white font-inter">
                  {new Date(client.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Intel */}
        <div className="col-span-2 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">
            Active Projects & Users
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {/* Projects Card */}
             <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                   <h4 className="font-display font-bold uppercase tracking-wider text-lg">Projects</h4>
                   <span className="text-2xl font-mono text-[#F96F6E]">{client.projects.length}</span>
                </div>
                <ul className="space-y-2">
                  {client.projects.length > 0 ? (
                    client.projects.map(p => (
                      <li key={p.id} className="text-sm text-white/60 truncate flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        {p.title}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-white/20 italic">No active projects</li>
                  )}
                </ul>
             </div>

             {/* Users Card */}
             <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                   <h4 className="font-display font-bold uppercase tracking-wider text-lg">Authorized Users</h4>
                   <span className="text-2xl font-mono text-teal-400">{client.users.length}</span>
                </div>
                <ul className="space-y-2">
                  {client.users.length > 0 ? (
                    client.users.map(u => (
                      <li key={u.id} className="text-sm text-white/60 truncate flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F96F6E]" />
                        {u.email}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-white/20 italic">No authorized users</li>
                  )}
                </ul>
             </div>
          </div>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="pt-12 border-t border-white/5">
        <DangerZone clientId={client.id} clientName={client.name} />
      </div>
    </div>
  )
}
