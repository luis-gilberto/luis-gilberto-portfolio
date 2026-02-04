import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { client: true },
    orderBy: { startDate: 'desc' }
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto text-white">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-[#F96F6E]/20 text-[#F96F6E] border-none text-[10px] uppercase tracking-widest px-3 py-1">
              Commander
            </Badge>
            <h1 className="text-4xl font-display font-bold">Active Projects</h1>
          </div>
          <p className="text-gray-400">Manage ongoing strategic initiatives and track deliverables.</p>
        </div>
        <Button className="bg-[#F96F6E] hover:bg-[#ff8584] text-white gap-2">
          <Plus size={16} /> New Project
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400 font-medium">
            <tr>
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
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/projects/${project.id}`}>
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight size={16} className="text-gray-400" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
