'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, ArrowUpRight } from 'lucide-react';

const PROJECTS = [
  { id: 1, client: 'Acme Corp', name: 'Brand Repositioning', status: 'In Progress', due: 'Feb 15, 2026', progress: 65, value: '$45,000' },
  { id: 2, client: 'TechStart Inc', name: 'GTM Strategy Launch', status: 'Planning', due: 'Mar 01, 2026', progress: 15, value: '$28,000' },
  { id: 3, client: 'Global Finance', name: 'Executive Training', status: 'Completed', due: 'Jan 10, 2026', progress: 100, value: '$12,500' },
  { id: 4, client: 'Creative Studio', name: 'Operational Audit', status: 'Review', due: 'Jan 28, 2026', progress: 88, value: '$8,000' },
];

export default function ProjectsPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto text-white">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Active Projects</h1>
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
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {PROJECTS.map((project) => (
              <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 font-medium text-white">{project.name}</td>
                <td className="px-6 py-4 text-gray-400">{project.client}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className={`
                    ${project.status === 'Completed' ? 'border-teal-500/50 text-teal-400 bg-teal-500/10' : ''}
                    ${project.status === 'In Progress' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : ''}
                    ${project.status === 'Planning' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' : ''}
                    ${project.status === 'Review' ? 'border-purple-500/50 text-purple-400 bg-purple-500/10' : ''}
                  `}>
                    {project.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#F96F6E]" style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{project.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300 font-mono text-sm">{project.value}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={16} className="text-gray-400" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
