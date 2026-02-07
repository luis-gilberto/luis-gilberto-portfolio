import React from 'react';
import { UserRoleBadge } from '../ui/UserRoleBadge';

interface PageHeaderProps { className?: string; }

export default function PageHeader({ className = '' }: PageHeaderProps) {
  return (
    <div className={`mb-12 ${className}`}>
      <div className="flex items-center gap-4 mb-8">
        <div className="flex flex-col w-full">
          <div className="hidden md:flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <UserRoleBadge />
              <span className="text-[10px] font-bold tracking-[0.5em] text-[#F96F6E] uppercase">Luis Gilberto / Portal</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-teal/10 border border-teal/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              <span className="text-[9px] font-black text-teal tracking-widest uppercase font-big-shoulders italic">Command Center</span>
            </div>
          </div>
          <h1 className="text-[42px] lg:text-[64px] font-bold text-white tracking-widest uppercase italic leading-[0.9] font-big-shoulders mt-10 md:mt-0">
            Command <span className="text-white/10">Center</span>
          </h1>
        </div>
        <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-white/10 to-transparent self-end mb-4" />
      </div>
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">
          Strategic Operations
        </span>
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
          LG-V4.3
        </span>
      </div>
    </div>
  );
}
