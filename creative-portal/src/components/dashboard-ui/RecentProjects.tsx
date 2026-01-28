import { MoreVertical, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RecentProjectsProps { data: any[] }

export default function RecentProjects({ data }: RecentProjectsProps) {
  return (
    <div className="bg-surface/20 backdrop-blur-sm border border-border/20 rounded-xl p-10">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-[22px] font-semibold text-text-primary tracking-tight">Active Threads</h2>
        <Button variant="ghost" size="sm" className="bg-transparent text-text-tertiary hover:text-text-primary hover:bg-transparent -mr-2"><span className="text-[13px]">View All</span><ExternalLink className="w-3.5 h-3.5 ml-2" strokeWidth={1.5} /></Button>
      </div>
      <ScrollArea className="h-[600px] -mr-4 pr-4">
        <div className="space-y-2">
          {(data && data.length > 0 ? data : []).map((project: any, index: number) => (
            <div key={index} className="group py-6 px-5 -mx-5 rounded-lg hover:bg-surface-elevated/40 transition-all duration-200">
              <div className="flex items-start gap-5">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity"><img src={project.image || '/assets/images/placeholder.png'} alt={project.title || project.name} className="w-full h-full object-cover" loading="lazy" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1"><div className="flex items-center gap-3 mb-2"><h3 className="text-[15px] font-medium text-text-primary tracking-[-0.01em]">{project.title || project.name}</h3>{project.isPriority && <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] bg-primary/10 text-primary rounded">Priority</span>}</div><p className="text-[13px] text-text-tertiary">{project.client?.name || project.client || 'Unknown'}</p></div>
                  </div>
                  <div className="flex items-center gap-4 mb-5"><span className="px-2.5 py-1 text-[11px] font-medium bg-neutral-muted/30 text-neutral rounded-md">{project.status || 'Active'}</span></div>
                  {typeof project.progress === 'number' && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-[11px]"><span className="text-text-muted uppercase tracking-[0.08em]">Progress</span><span className="text-text-secondary font-medium">{project.progress}%</span></div>
                      <div className="relative h-1 bg-neutral-muted/20 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${project.isPriority ? 'bg-gradient-to-r from-primary to-primary/80' : 'bg-neutral-muted/60'}`} style={{ width: `${project.progress}%` }} /></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {(!data || data.length === 0) && (
            <div className="text-center text-text-tertiary text-sm py-8">No active projects found.</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
