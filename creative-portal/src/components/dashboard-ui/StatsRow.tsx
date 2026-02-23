import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';

interface StatsRowProps { className?: string; stats: { totalClients: number; totalProjects: number; activeProjects: number; pendingTasks: number; } }

const mapStats = (s: { totalClients: number; totalProjects: number; activeProjects: number; pendingTasks: number; }) => ([
  { label: 'Total Projects', value: s.totalProjects, suffix: '', subtitle: 'All time', link: '/admin/projects' },
  { label: 'Active Projects', value: s.activeProjects, suffix: '', subtitle: 'In progress', isHighlight: true, link: '/admin/projects' },
  { label: 'Total Clients', value: s.totalClients, suffix: '', subtitle: 'Active accounts', link: '/admin/clients' },
  { label: 'Pending Tasks', value: s.pendingTasks, suffix: '', subtitle: 'Requires attention', link: '/admin/mission-control' },
])

export default function StatsRow({ className = '', stats }: StatsRowProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
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
    <div ref={statsRef} className={`grid grid-cols-1 gap-y-10 md:grid-cols-2 lg:grid-cols-4 md:gap-6 ${className}`}>
      {list.map((stat, index) => (
        <div 
          key={index} 
          onClick={() => stat.link && router.push(stat.link)}
          className="bg-surface/10 border border-border/20 p-8 rounded-2xl backdrop-blur-sm hover:bg-surface/20 transition-all cursor-pointer group"
        >
          <div className="text-[11px] tracking-[0.2em] text-text-muted font-bold uppercase mb-6 group-hover:text-white transition-colors">{stat.label}</div>
          <div className={`text-[56px] lg:text-[64px] font-bold leading-none mb-4 font-big-shoulders tracking-tight ${stat.isHighlight ? 'text-primary' : 'text-text-primary'}`}>
            {stat.value}{stat.suffix}
          </div>
          <div className="text-[14px] text-text-tertiary font-medium">{stat.subtitle}</div>
        </div>
      ))}
    </div>
  );
}
