import { Plus, FileText, BarChart3 } from 'lucide-react';

interface QuickActionsProps {
  className?: string;
}

const actions = [
  {
    icon: Plus,
    title: 'New Thread',
    description: 'Start a new project',
    isPrimary: true,
  },
  {
    icon: FileText,
    title: 'Generate Report',
    description: 'Export analytics',
    isPrimary: false,
  },
  {
    icon: BarChart3,
    title: 'View Insights',
    description: 'Performance metrics',
    isPrimary: false,
  },
];

export default function QuickActions({ className = '' }: QuickActionsProps) {
  return (
    <div className={`mt-24 ${className}`}>
      <h2 className="text-[28px] font-semibold text-text-primary mb-10 tracking-tight">
        Next Moves
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`group relative text-left p-9 rounded-xl transition-all duration-300 ${
              action.isPrimary
                ? 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1'
                : 'bg-surface/40 border border-border/30 hover:border-border/50 hover:bg-surface/60 hover:-translate-y-0.5'
            }`}
          >
            <div className={`p-3 rounded-lg inline-flex mb-7 ${
              action.isPrimary 
                ? 'bg-white/10' 
                : 'bg-muted/50'
            }`}>
              <action.icon className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className={`text-[17px] font-medium mb-2 ${
              action.isPrimary ? 'text-primary-foreground' : 'text-text-primary'
            }`}>
              {action.title}
            </h3>
            <p className={`text-[13px] ${
              action.isPrimary ? 'text-primary-foreground/70' : 'text-text-tertiary'
            }`}>
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
