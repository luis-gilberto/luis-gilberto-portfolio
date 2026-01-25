'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
// Import your UI components (StatsRow, QuickActions, etc.)
import PageHeader from '@/components/dashboard-ui/PageHeader';
import StatsRow from '@/components/dashboard-ui/StatsRow';
import QuickActions from '@/components/dashboard-ui/QuickActions';
import RecentProjects from '@/components/dashboard-ui/RecentProjects';
import SystemFeed from '@/components/dashboard-ui/SystemFeed';

export default function AdminDashboard() {
  const contentRef = useRef<HTMLDivElement>(null);

  // Animation on Load
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div 
      ref={contentRef} 
      className="max-w-[1600px] mx-auto py-6"
    >
      <PageHeader />
      <StatsRow className="mt-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
        <div className="lg:col-span-8">
          <RecentProjects />
        </div>
        <div className="lg:col-span-4">
          <SystemFeed />
        </div>
      </div>
      
      <QuickActions className="mt-12" />
    </div>
  );
}
