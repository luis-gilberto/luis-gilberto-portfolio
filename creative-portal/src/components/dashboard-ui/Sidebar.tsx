import { LayoutDashboard, FolderKanban, Users, BarChart3, Settings, ChevronLeft, ChevronRight, Rocket, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onMobileToggle?: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Rocket, label: 'Strategy Engine', path: '/strategyiq' },
  { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
  { icon: Users, label: 'Clients', path: '/admin/clients' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, onMobileToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#0A0A0A] border-b border-white/5 fixed top-0 left-0 right-0 z-50">
        {/* Left: Brand */}
        <div className="relative w-32 h-8">
          <Image
            src="/brand/portal-full.png"
            alt="The Portal"
            fill
            className="object-contain object-left"
          />
        </div>

        {/* Right: Hamburger Toggle */}
        <Button variant="ghost" size="icon" onClick={onMobileToggle}>
          <Menu className="w-6 h-6 text-white" />
        </Button>
      </div>

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
        <nav className="flex flex-col h-full p-6">
          {/* BRAND LOCKUP - Desktop Only */}
          <div className={`hidden lg:flex items-center ${collapsed ? 'justify-center' : 'px-4'} mb-8 mt-2 transition-all duration-300`}>
            {collapsed ? (
              /* COLLAPSED STATE: Square Icon */
              <div className="relative w-8 h-8">
                <Image
                  src="/brand/portal-icon.png"
                  alt="Portal Icon"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              /* EXPANDED STATE: Full Wide Logo */
              <div className="relative w-40 h-12">
                <Image
                  src="/brand/portal-full.png"
                  alt="The Portal"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            )}
          </div>

          <ul className="space-y-3 flex-1">
            {navItems.map((item) => {
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

          {/* Bottom: Sign Out (Mobile Only) */}
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })} 
            className="lg:hidden flex items-center gap-3 px-4 py-3 mt-auto text-gray-400 hover:text-white transition-colors w-full"
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
