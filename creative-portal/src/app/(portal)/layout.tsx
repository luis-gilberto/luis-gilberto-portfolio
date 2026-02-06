'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard-ui/Sidebar';
import TopNavBar from '@/components/TopNavBar';
import { useSession } from 'next-auth/react';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectStatus, setProjectStatus] = useState<string | undefined>();

  useEffect(() => {
    async function fetchProjectStatus() {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/strategy-iq/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email })
          });
          if (response.ok) {
            const project = await response.json();
            setProjectStatus(project.status);
          }
        } catch (error) {
          console.error('Failed to fetch project status for layout:', error);
        }
      }
    }
    fetchProjectStatus();
  }, [session]);

  return (
    <div className="min-h-full bg-[#0A0A0A] text-white">
      <TopNavBar 
        onMenuToggle={() => setMobileOpen(!mobileOpen)}
        mobileMenuOpen={mobileOpen}
        projectStatus={projectStatus}
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
