import { CheckCircle2, AlertCircle, UserPlus } from 'lucide-react';

export default function SystemFeed() {
  const feed = [
    { icon: UserPlus, color: 'text-emerald-400', text: 'New user registration: consultant@example.com', time: '2h ago' },
    { icon: AlertCircle, color: 'text-primary', text: 'Project "Alpha" status updated to Review', time: '4h ago' },
    { icon: CheckCircle2, color: 'text-blue-400', text: 'System backup completed successfully', time: '6h ago' },
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
