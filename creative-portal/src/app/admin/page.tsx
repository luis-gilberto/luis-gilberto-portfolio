'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
// Verify these import paths match your file tree
import TopNavBar from '../../components/TopNavBar';
import Sidebar from '../../components/dashboard-ui/Sidebar';
// Import your UI components (StatsRow, QuickActions, etc.)
import PageHeader from '../../components/dashboard-ui/PageHeader';
import StatsRow from '../../components/dashboard-ui/StatsRow';
import QuickActions from '../../components/dashboard-ui/QuickActions';
import RecentProjects from '../../components/dashboard-ui/RecentProjects';
import SystemFeed from '../../components/dashboard-ui/SystemFeed';

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    // 1. GLOBAL WRAPPER (Deep Black Background)
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F1ED] font-sans overflow-x-hidden">
      
      {/* 2. TOP NAVIGATION (Fixed at Top, High Z-Index) */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopNavBar 
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
          mobileMenuOpen={mobileMenuOpen} 
        />
      </div>
      
      <div className="flex pt-16"> {/* pt-16 accounts for the fixed header height */}
        
        {/* 3. SIDEBAR (Fixed Left) */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          mobileOpen={mobileMenuOpen} 
          onMobileClose={() => setMobileMenuOpen(false)} 
        />
        
        {/* 4. MAIN CONTENT AREA (Pushed by Sidebar) */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[256px]'
          }`}
        >
          <div 
            ref={contentRef} 
            className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12"
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
        </main>
      </div>
    </div>
  );
}
