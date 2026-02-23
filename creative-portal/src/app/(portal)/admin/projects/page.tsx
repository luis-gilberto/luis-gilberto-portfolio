import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight, ArrowUpRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ProjectDeleteAction } from '@/components/admin/ProjectDeleteAction';
import { CopyId } from '@/components/shared/CopyId';

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  
  let authorityLevel = 0;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { authorityLevel: true }
    });
    authorityLevel = user?.authorityLevel || 0;
  }

  const projects = await prisma.project.findMany({
    include: { client: true },
    orderBy: { startDate: 'desc' }
  });

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-display font-bold font-big-shoulders">Active projects</h1>
          </div>
          <p className="text-gray-400 text-sm font-inter">Manage ongoing strategic initiatives</p>
        </div>
        
        {/* Desktop Primary Action Button */}
        <Button className="hidden md:flex bg-[#F96F6E] hover:bg-[#ff8584] text-white gap-2">
          <Plus size={16} /> New Project
        </Button>
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <Link href="/admin/projects/new" className="md:hidden fixed bottom-6 right-6 z-50">
        <div className="w-14 h-14 rounded-full bg-[#F96F6E] hover:bg-[#ff8584] shadow-lg shadow-coral/30 flex items-center justify-center text-[#050505] transition-transform active:scale-95">
          <Plus size={28} strokeWidth={2.5} />
        </div>
      </Link>

      {/* MOBILE CARD VIEW (Visible only on Mobile) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {projects.map((project) => (
          <div key={project.id} className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 relative group active:bg-white/[0.02] transition-colors">
            <Link href={`/admin/projects/${project.id}`} className="absolute inset-0 z-0" />
            
            <div className="flex justify-between items-start mb-2 relative z-10 pointer-events-none">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold font-inter text-white mb-0.5">
                  {project.client?.company || project.client?.name || 'No Client'}
                </h3>
                <span className="text-sm text-muted-foreground font-inter">
                  {project.title}
                </span>
              </div>
              
              <Badge variant="outline" className={`
                pointer-events-auto rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase
                ${project.status === 'DISCOVERY' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : ''}
                ${project.status === 'Completed' ? 'border-teal-500/50 text-teal-400 bg-teal-500/10' : ''}
                ${project.status === 'Active' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : ''}
                ${project.status === 'Planning' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' : ''}
              `}>
                {project.status}
              </Badge>
            </div>

            <div className="flex items-end justify-between mt-6 relative z-10 pointer-events-none">
                <div className="flex flex-col gap-1">
                   <span className="text-xs text-muted-foreground/60 font-inter">Client: {project.client?.name || 'N/A'}</span>
                   <div className="flex items-center gap-2 pointer-events-auto">
                      <CopyId id={project.id} truncate />
                      {!project.clientId && (
                        <span className="text-[#F96F6E] text-[10px] font-bold uppercase tracking-wider bg-[#F96F6E]/10 px-2 py-1 rounded">
                          [ORPHANED]
                        </span>
                      )}
                   </div>
                </div>
                
                <div className="flex items-center gap-4">
                 <ChevronRight className="text-white/20" size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW (Hidden on Mobile) */}
      <div className="hidden md:block bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-4">Project identity</th>
              <th className="px-6 py-4">Project Name</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Start Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <CopyId id={project.id} truncate />
                    {!project.clientId && (
                      <span className="text-[#F96F6E] text-[10px] font-bold uppercase tracking-wider bg-[#F96F6E]/10 px-2 py-1 rounded">
                        [ORPHANED_NODE] // RE-LINK REQUIRED
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/projects/${project.id}`} className="font-medium text-white hover:text-[#F96F6E] transition-colors">
                    {project.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-400">{project.client?.name || 'No Client'}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className={`
                    ${project.status === 'Completed' ? 'border-teal-500/50 text-teal-400 bg-teal-500/10' : ''}
                    ${project.status === 'Active' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : ''}
                    ${project.status === 'Planning' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' : ''}
                  `}>
                    {project.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                  {new Date(project.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <Link href={`/admin/projects/${project.id}`}>
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight size={16} className="text-gray-400" />
                    </Button>
                  </Link>
                  <ProjectDeleteAction 
                    projectId={project.id} 
                    projectTitle={project.title} 
                    authorityLevel={authorityLevel} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
