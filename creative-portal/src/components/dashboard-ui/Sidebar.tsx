import { LayoutDashboard, FolderKanban, Users, BarChart3, Settings, ChevronLeft, ChevronRight, Rocket, Menu, LogOut, BookOpen, Briefcase, ShieldCheck, User, Radio, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onMobileToggle?: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', role: 'CLIENT' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', role: 'ADMIN' },
  { icon: Radio, label: 'Mission control', path: '/admin/mission-control', role: 'ADMIN_ONLY' }, 
  { icon: Rocket, label: 'Strategy engine', path: '/strategy-iq' },
  { icon: Briefcase, label: 'The war room', path: '/war-room' }, 
  { icon: ShieldCheck, label: 'The vault', path: '/vault' },
  { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
  { icon: Users, label: 'Clients', path: '/admin/clients' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: BookOpen, label: 'Knowledge base', path: '/knowledge/pricing' },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, onMobileToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const role = session?.user?.role;

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentScope');
    signOut({ callbackUrl: '/login' });
  };

  useEffect(() => {
    async function fetchActiveProject() {
      // Logic: If user is CLIENT, we MUST fetch their project ID to build valid links.
      if (role === 'CLIENT' && session?.user?.email) {
        try {
          // Use the dashboard data endpoint which is more robust
          const response = await fetch('/api/dashboard/data');
          if (response.ok) {
            const data = await response.json();
            // Fallback Logic:
            // 1. Check for 'activeProject' directly
            // 2. Check for the first project in the 'projects' array
            const projectId = data.activeProject?.id || data.projects?.[0]?.id;
            
            if (projectId) {
              setActiveProjectId(projectId);
            } else {
               console.warn("Sidebar: No active project found for client.");
            }
          }
        } catch (error) {
          console.error("Sidebar: Failed to fetch active project context.", error);
        }
      }
    }
    fetchActiveProject();
  }, [role, session]);

  const filteredNavItems = navItems.map(item => {
    // Dynamic War Room Link for Clients
    if (item.label === 'The war room' && role === 'CLIENT') {
       // If we have an ID, link to it. If not, link to dashboard where they can select/init one.
       return { ...item, path: activeProjectId ? `/projects/${activeProjectId}` : '/dashboard' };
    }
    // Dynamic Vault Link for Clients
    if (item.label === 'The vault' && role === 'CLIENT') {
       return { ...item, path: activeProjectId ? `/projects/${activeProjectId}/vault` : '/dashboard' };
    }
    return item;
  }).filter(item => {
    const userRole = role?.toUpperCase();

    // Role-specific filtering for Dashboard
    if (item.label === 'Dashboard') {
      if (userRole === 'CLIENT') return item.path === '/dashboard';
      return item.path === '/admin';
    }

    // NEW: Mission Control Logic
    if (item.role === 'ADMIN_ONLY') {
      return userRole === 'ADMIN' || userRole === 'CONSULTANT';
    }

    // Client-specific filtering
    if (item.label === 'The war room' || item.label === 'The vault') {
      return userRole === 'CLIENT';
    }

    // Pricing KB is strictly internal
    if (item.path === '/knowledge/pricing') {
      return userRole === 'ADMIN' || userRole === 'TEAM_MEMBER';
    }
    
    // Admin routes are strictly internal
    if (item.path.startsWith('/admin')) {
      return userRole === 'ADMIN' || userRole === 'TEAM_MEMBER';
    }

    return true;
  });

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`portal-sidebar fixed top-16 bottom-0 bg-[#0A0A0A] z-40 transition-all duration-300 ease-in-out border-white/5 
        right-0 border-l w-[256px]
        lg:left-0 lg:right-auto lg:border-r lg:border-l-0 
        ${collapsed ? 'lg:w-[72px]' : 'lg:w-[256px]'} 
        ${mobileOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`}
      >
        <nav className="flex flex-col h-full pt-4 px-6 pb-6">
          <ul className="space-y-3 flex-1">
            {filteredNavItems.map((item) => {
              // Task 1: Strict Active State Logic
              const isActive = pathname === item.path;
              
              return (
                <li key={item.label}>
                  <Link
                    href={item.path}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-[#1A1A1A] text-white' // Active: Shaded background + White text
                        : 'bg-transparent text-white/40 hover:bg-[#141414] hover:text-white' // Inactive: Transparent + Muted text | Hover: Subtle lift + White text
                    } ${collapsed ? 'justify-center' : ''}`}
                    onClick={mobileOpen ? onMobileClose : undefined}
                  >
                    <item.icon 
                      className={`w-5 h-5 flex-shrink-0 transition-colors ${
                        isActive 
                          ? 'text-[#F96F6E]' // Active Icon: Coral (#F96F6E) for ALL active items per Task 2
                          : 'text-current' // Inactive Icon: Inherits text color
                      }`} 
                      strokeWidth={1.5} 
                    />
                    {!collapsed && (
                      <span className="text-[14px] font-normal font-inter">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Partner Specific Links - REMOVED because they are now in main nav */}
            {role === 'CLIENT' && activeProjectId && (
              <></>
            )}
          </ul>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden lg:flex mt-auto bg-transparent text-text-secondary hover:text-text-primary hover:bg-muted"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            )}
          </Button>

          {/* Mobile Utility Section */}
          <div className="lg:hidden flex flex-col gap-4 px-4 py-6 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                  <User size={16} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{session?.user?.name || 'Partner'}</span>
                    {role === 'ADMIN' && (
                      <div className="w-2 h-2 rounded-full bg-[#2ED3C6] animate-pulse" title="COMMAND ACTIVE" />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">{role || 'CLIENT'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Sign Out (Mobile Only) */}
          <button 
            onClick={handleSignOut} 
            className="lg:hidden flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors w-full"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>

          {/* NEW PROTECTION LABEL */}
          <div className="px-6 pb-6 mt-auto text-center">
            <div className="mt-6 pt-4 border-t border-white/5 text-[9px] text-gray-700 font-mono tracking-wider opacity-50">
              CONFIDENTIAL / PROPRIETARY
              <br />
              SYSTEM ID: LG-V4.3
            </div>
          </div>

        </nav>
      </aside>
    </>
  );
}
