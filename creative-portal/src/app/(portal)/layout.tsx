'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard-ui/Sidebar';
import TopNavBar from '@/components/TopNavBar';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#0A0A0A] text-white">
      <TopNavBar 
        onMenuToggle={() => setMobileOpen(!mobileOpen)}
        mobileMenuOpen={mobileOpen}
      />
      
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onMobileToggle={() => setMobileOpen(!mobileOpen)}
      />
      
      <div 
        className={`transition-all duration-300 ease-in-out pt-16 ${
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-[256px]'
        }`}
      >
        <main className="min-h-[calc(100vh-4rem)] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
