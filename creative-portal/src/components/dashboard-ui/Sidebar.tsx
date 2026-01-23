import { LayoutDashboard, FolderKanban, Users, BarChart3, Settings, ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Rocket, label: 'Strategy Engine', path: '/strategyiq' },
  { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
  { icon: Users, label: 'Clients', path: '/admin/clients' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed left-0 top-16 bottom-0 bg-secondary/50 backdrop-blur-sm border-r border-border/30 z-40 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[72px]' : 'w-[256px]'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="flex flex-col h-full p-6">
          <ul className="space-y-3 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/admin' && pathname?.startsWith(item.path));
              return (
                <li key={item.label}>
                  <Link
                    href={item.path}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/5 text-[#F96F6E]'
                        : 'text-text-tertiary hover:text-text-primary hover:bg-transparent'
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
        </nav>
      </aside>
    </>
  );
}
