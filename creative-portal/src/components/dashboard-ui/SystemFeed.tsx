import { CheckCircle2, AlertCircle, UserPlus, Zap, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SystemFeedProps {
  data?: any[];
}

export default function SystemFeed({ data = [] }: SystemFeedProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ASSESSMENT_COMPLETE': return { icon: Zap, color: 'text-teal' };
      case 'PROJECT_CREATED': return { icon: FileText, color: 'text-blue-400' };
      case 'USER_REGISTERED': return { icon: UserPlus, color: 'text-emerald-400' };
      default: return { icon: AlertCircle, color: 'text-primary' };
    }
  };

  const feed = data.length > 0 ? data.map(event => ({
    ...getEventIcon(event.type),
    text: event.message,
    time: formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })
  })) : [
    { icon: UserPlus, color: 'text-emerald-400', text: 'No recent activity recorded.', time: 'System Ready' }
  ];

  return (
    <div className="bg-surface/5 border border-border/10 rounded-xl p-8 h-full">
      <h2 className="text-[18px] font-semibold text-text-primary mb-2">System Feed</h2>
      <p className="text-[13px] text-text-tertiary mb-8">Live operational status</p>
      
      <div className="space-y-6">
        {feed.map((item, i) => (
          <div key={i} className="flex gap-4 items-start">
            <div className={`mt-1 ${item.color}`}><item.icon size={16} /></div>
            <div>
              <p className="text-[14px] text-text-secondary mb-1">{item.text}</p>
              <p className="text-[11px] text-text-muted uppercase tracking-wider">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
