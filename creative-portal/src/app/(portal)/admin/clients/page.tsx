'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Globe, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CLIENTS = [
  { id: 'c1', name: 'Acme Corp', industry: 'Manufacturing', contact: 'Alice CEO', email: 'alice@acme.com', projects: 2, status: 'Active' },
  { id: 'c2', name: 'TechStart Inc', industry: 'SaaS / AI', contact: 'Bob CTO', email: 'bob@techstart.io', projects: 1, status: 'Onboarding' },
  { id: 'c3', name: 'Global Finance', industry: 'FinTech', contact: 'Charlie CFO', email: 'c@global.com', projects: 0, status: 'Lead' },
  { id: 'c4', name: 'Creative Studio', industry: 'Design', contact: 'Dana Dir', email: 'd@studio.com', projects: 1, status: 'Active' },
];

export default function ClientsPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto text-white">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Client Directory</h1>
          <p className="text-gray-400">Access client intelligence, contact details, and project history.</p>
        </div>
        <Button className="bg-white text-black hover:bg-gray-200 gap-2">
          <Plus size={16} /> Add Client
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLIENTS.map((client) => (
          <div key={client.id} className="group bg-[#0A0A0A] border border-white/5 p-6 rounded-xl hover:border-[#F96F6E]/50 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-[#F96F6E]">
                <Building2 size={24} strokeWidth={1.5} />
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                client.status === 'Active' ? 'border-teal-500/20 text-teal-400' : 'border-white/10 text-gray-500'
              }`}>
                {client.status}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold mb-1">{client.name}</h3>
            <p className="text-sm text-gray-500 mb-6">{client.industry}</p>
            
            <div className="space-y-3 border-t border-white/5 pt-4">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={14} /> {client.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Globe size={14} /> {client.projects} Active Project{client.projects !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="ghost" size="sm" className="text-[#F96F6E] hover:bg-[#F96F6E]/10 p-0 h-auto group-hover:gap-2 transition-all">
                View Intelligence <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
