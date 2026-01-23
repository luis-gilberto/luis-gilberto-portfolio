import { LayoutDashboard, FolderKanban, Users, BarChart3, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: FolderKanban, label: 'Projects', active: false },
  { icon: Users, label: 'Clients', active: false },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
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
          <TooltipProvider delayDuration={0}>
            <ul className="space-y-3 flex-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                          item.active
                            ? 'bg-transparent text-text-primary relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-5 before:bg-primary before:rounded-full'
                            : 'text-text-tertiary hover:text-text-primary hover:bg-transparent'
                        } ${collapsed ? 'justify-center' : ''}`}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                        {!collapsed && (
                          <span className="text-[14px] font-normal">{item.label}</span>
                        )}
                      </button>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="bg-surface-elevated text-text-primary border-border">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              ))}
            </ul>
          </TooltipProvider>

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
