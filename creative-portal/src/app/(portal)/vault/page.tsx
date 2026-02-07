import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ShieldCheck, ArrowRight, FileText, Lock } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default async function VaultPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const role = session.user.role
  
  // For CLIENTs, we fetch based on their associated client record
  // For ADMINs, we might show everything or redirect? User said "Partner View: Add 'The Vault' to the Sidebar. It should link to a dedicated /vault page that aggregates all PUBLISHED strategic briefs for that client."
  
  if (role === 'ADMIN') {
    // Admin can see all published briefs
    const publishedBriefs = await prisma.assessmentSession.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        project: {
          include: {
            client: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return (
      <div className="p-8 max-w-7xl mx-auto text-white">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <ShieldCheck className="text-teal" size={32} />
            <h1 className="text-4xl font-display font-bold italic uppercase tracking-widest">Global Vault</h1>
          </div>
          <p className="text-gray-400">Master repository of all published strategic intelligence across all clients.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedBriefs.map((brief) => (
            <Link 
              key={brief.id} 
              href={`/strategy-iq/${brief.projectId}/${brief.assessmentType}/results`}
              className="group bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl hover:border-teal/50 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-lg bg-teal/10 text-teal">
                  <FileText size={20} />
                </div>
                <Badge className="bg-teal text-black text-[9px] font-bold uppercase tracking-widest border-none">
                  PUBLISHED
                </Badge>
              </div>
              <h3 className="text-xl font-bold mb-1 uppercase tracking-wider">{brief.project?.client?.name}</h3>
              <p className="text-xs text-white/40 mb-4 uppercase tracking-widest font-mono">
                {brief.assessmentType} / {brief.project?.title}
              </p>
              <div className="flex justify-between items-center text-xs text-white/20 border-t border-white/5 pt-4">
                <span>Certified {new Date(brief.updatedAt).toLocaleDateString()}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // Partner view
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      projects: {
        where: {
          clientId: { not: null }
        },
        select: {
          clientId: true
        }
      }
    }
  })

  const clientIds = [...new Set(user?.projects.map(p => p.clientId).filter(Boolean) as string[])]

  const publishedBriefs = await prisma.assessmentSession.findMany({
    where: {
      clientId: { in: clientIds },
      status: 'PUBLISHED'
    },
    include: {
      project: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <ShieldCheck className="text-teal" size={32} />
          <h1 className="text-4xl font-display font-bold italic uppercase tracking-widest">The Vault</h1>
        </div>
        <p className="text-gray-400">Secure access to your certified strategic intelligence and roadmaps.</p>
      </header>

      {publishedBriefs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
          <Lock size={48} className="text-white/10 mb-4" />
          <p className="text-gray-500 font-inter">No published briefs found in your vault yet.</p>
          <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] mt-2">Intelligence Certification Pending</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedBriefs.map((brief) => (
            <Link 
              key={brief.id} 
              href={`/strategy-iq/${brief.projectId}/${brief.assessmentType}/results`}
              className="group bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl hover:border-teal/50 transition-all shadow-2xl"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 rounded-xl bg-teal/10 text-teal">
                  <FileText size={24} />
                </div>
                <div className="flex items-center gap-2 text-teal">
                  <ShieldCheck size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">LG-Certified</span>
                </div>
              </div>
              <h3 className="text-2xl font-big-shoulders font-bold mb-1 uppercase tracking-widest italic">{brief.assessmentType} STRATEGY</h3>
              <p className="text-xs text-white/40 mb-6 uppercase tracking-widest font-mono">
                {brief.project?.title}
              </p>
              <div className="flex justify-between items-center text-[10px] text-white/30 border-t border-white/5 pt-6 font-bold uppercase tracking-widest">
                <span>Released {new Date(brief.updatedAt).toLocaleDateString()}</span>
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform text-teal" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
