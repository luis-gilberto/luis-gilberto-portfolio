import { Plus, Users, BarChart3, Settings } from 'lucide-react';

interface QuickActionsProps { 
  className?: string; 
  onNewProject?: () => void;
}

const actions = [
  { icon: Plus, title: 'New Project', description: 'Initialize workflow', id: 'new-project' },
  { icon: Users, title: 'Manage Leads', description: 'CRM Database', id: 'leads' },
  { icon: BarChart3, title: 'Analytics', description: 'Performance data', id: 'analytics' },
  { icon: Settings, title: 'System', description: 'Configuration', id: 'system' },
];

export default function QuickActions({ className = '', onNewProject }: QuickActionsProps) {
  return (
    <div className={`mt-12 ${className}`}>
      <h2 className="text-[18px] font-semibold text-text-primary mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary"></span> Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const isComingSoon = action.id !== 'new-project' && action.id !== 'leads';
          const isLeads = action.id === 'leads';
          
          return (
            <button 
              key={index} 
              onClick={() => {
                if (action.id === 'new-project') onNewProject?.();
                if (action.id === 'leads') window.location.href = '/admin/clients';
              }}
              disabled={isComingSoon}
              className={`group text-left p-6 rounded-xl bg-surface/5 border border-border/10 transition-all duration-300 ${
                isComingSoon 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-surface/10 hover:border-primary/30'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`text-text-secondary ${!isComingSoon && 'group-hover:text-primary'} transition-colors`}>
                  <action.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                {isComingSoon && (
                  <span className="text-[8px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                    Soon
                  </span>
                )}
              </div>
              <h3 className="text-[15px] font-medium text-text-primary mb-1">{action.title}</h3>
              <p className="text-[12px] text-text-tertiary">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
