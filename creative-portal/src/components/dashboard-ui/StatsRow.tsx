import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface StatsRowProps { className?: string; stats: { totalClients: number; totalProjects: number; activeProjects: number; pendingTasks: number; } }

const mapStats = (s: { totalClients: number; totalProjects: number; activeProjects: number; pendingTasks: number; }) => ([
  { label: 'Total Projects', value: s.totalProjects, suffix: '', subtitle: 'All time' },
  { label: 'Active Projects', value: s.activeProjects, suffix: '', subtitle: 'In progress', isHighlight: true },
  { label: 'Total Clients', value: s.totalClients, suffix: '', subtitle: 'Active accounts' },
  { label: 'Pending Tasks', value: s.pendingTasks, suffix: '', subtitle: 'Requires attention' },
])

export default function StatsRow({ className = '', stats }: StatsRowProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (statsRef.current) {
      // @ts-ignore
      gsap.fromTo(statsRef.current.children, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  const list = mapStats(stats)
  return (
    <div ref={statsRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {list.map((stat, index) => (
        <div key={index} className="bg-surface/10 border border-border/20 p-6 rounded-xl backdrop-blur-sm hover:bg-surface/20 transition-all">
          <div className="text-[11px] tracking-tight text-text-muted font-semibold mb-4">{stat.label}</div>
          <div className={`text-[48px] font-bold leading-none mb-2 ${stat.isHighlight ? 'text-primary' : 'text-text-primary'}`}>
            {stat.value}{stat.suffix}
          </div>
          <div className="text-[13px] text-text-tertiary">{stat.subtitle}</div>
        </div>
      ))}
    </div>
  );
}
