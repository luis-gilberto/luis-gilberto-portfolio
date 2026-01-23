import { StarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  icon: StarIcon;
  label: string;
  value: number;
  change: string;
  trend: 'up' | 'down';
  prefix?: string;
}

export default function StatsCard({ icon: Icon, label, value, change, trend, prefix = '' }: StatsCardProps) {
  return (
    <Card className="stat-card p-5 lg:p-6 bg-card border-border hover:bg-surface-elevated transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-muted rounded-lg">
          <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
        </div>
        <span className={`text-xs font-medium ${trend === 'up' ? 'text-semantic-success' : 'text-semantic-error'}`}>
          {change}
        </span>
      </div>
      <div className="stat-value text-2xl lg:text-3xl font-semibold text-text-primary mb-1" data-value={value} data-prefix={prefix}>
        {prefix}0
      </div>
      <div className="text-xs lg:text-sm text-text-secondary">{label}</div>
    </Card>
  );
}
