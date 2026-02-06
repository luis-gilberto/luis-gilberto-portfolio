import { LayoutDashboard, FolderKanban, Users, BarChart3, Settings, ChevronLeft, ChevronRight, Rocket, Menu, LogOut, BookOpen, Briefcase, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import { UserRoleBadge } from '../ui/UserRoleBadge';

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
  { icon: Rocket, label: 'Strategy Engine', path: '/strategy-iq' },
  { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
  { icon: Users, label: 'Clients', path: '/admin/clients' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
  { icon: BookOpen, label: 'Pricing KB', path: '/knowledge/pricing' },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, onMobileToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const role = session?.user?.role;

  useEffect(() => {
    async function fetchActiveProject() {
      if (role === 'CLIENT' && session?.user?.email) {
        try {
          const response = await fetch('/api/strategy-iq/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email })
          });
          if (response.ok) {
            const project = await response.json();
            setActiveProjectId(project.id);
          }
        } catch (error) {
          console.error('Failed to fetch active project for sidebar:', error);
        }
      }
    }
    fetchActiveProject();
  }, [role, session]);

  const filteredNavItems = navItems.filter(item => {
    // Role-specific filtering for Dashboard
    if (item.label === 'Dashboard') {
      if (role === 'CLIENT') return item.path === '/dashboard';
      return item.path === '/admin';
    }

    // Pricing KB is strictly internal
    if (item.path === '/knowledge/pricing') {
      return role === 'ADMIN' || role === 'TEAM_MEMBER';
    }
    
    // Admin routes are strictly internal
    if (item.path.startsWith('/admin')) {
      return role === 'ADMIN' || role === 'TEAM_MEMBER';
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
              const isActive = pathname === item.path || (item.path !== '/admin' && pathname?.startsWith(item.path));
              return (
                <li key={item.label}>
                  <Link
                    href={item.path}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/5 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-transparent'
                    } ${collapsed ? 'justify-center' : ''}`}
                    onClick={mobileOpen ? onMobileClose : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                    {!collapsed && (
                      <span className="text-[14px] font-normal">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Partner Specific Links: The War Room & The Vault */}
            {role === 'CLIENT' && activeProjectId && (
              <>
                <li key="The War Room">
                  <Link
                    href={`/projects/${activeProjectId}`}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname === `/projects/${activeProjectId}`
                        ? 'bg-white/5 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-transparent'
                    } ${collapsed ? 'justify-center' : ''}`}
                    onClick={mobileOpen ? onMobileClose : undefined}
                  >
                    <Briefcase className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                    {!collapsed && (
                      <span className="text-[14px] font-normal">The War Room</span>
                    )}
                  </Link>
                </li>
                <li key="The Vault">
                  <Link
                    href={`/dashboard#vault`}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-transparent ${collapsed ? 'justify-center' : ''}`}
                    onClick={mobileOpen ? onMobileClose : undefined}
                  >
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                    {!collapsed && (
                      <span className="text-[14px] font-normal">The Vault</span>
                    )}
                  </Link>
                </li>
              </>
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
          <div className="lg:hidden flex flex-col gap-4 px-4 py-6 border-t border-white/5 mt-auto">
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
              <ThemeToggle />
            </div>
          </div>

          {/* Bottom: Sign Out (Mobile Only) */}
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })} 
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
