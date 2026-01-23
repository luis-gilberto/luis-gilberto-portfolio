import { Plus, Users, BarChart3, Settings } from 'lucide-react';

interface QuickActionsProps { className?: string; }

const actions = [
  { icon: Plus, title: 'New Project', description: 'Initialize workflow' },
  { icon: Users, title: 'Manage Leads', description: 'CRM Database' },
  { icon: BarChart3, title: 'Analytics', description: 'Performance data' },
  { icon: Settings, title: 'System', description: 'Configuration' },
];

export default function QuickActions({ className = '' }: QuickActionsProps) {
  return (
    <div className={`mt-12 ${className}`}>
      <h2 className="text-[18px] font-semibold text-text-primary mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary"></span> Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button key={index} className="group text-left p-6 rounded-xl bg-surface/5 border border-border/10 hover:bg-surface/10 hover:border-primary/30 transition-all duration-300">
            <div className="mb-4 text-text-secondary group-hover:text-primary transition-colors">
              <action.icon className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h3 className="text-[15px] font-medium text-text-primary mb-1">{action.title}</h3>
            <p className="text-[12px] text-text-tertiary">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
