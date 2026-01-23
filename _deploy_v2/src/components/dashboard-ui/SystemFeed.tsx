import { ScrollArea } from '@/components/ui/scroll-area';

const feedItems = [
  {
    type: 'default',
    title: 'Thread Completed',
    description: 'Website Redesign for Acme Corp',
    time: '2h ago',
  },
  {
    type: 'default',
    title: 'New Client Added',
    description: 'TechStart Inc joined the platform',
    time: '4h ago',
  },
  {
    type: 'priority',
    title: 'Deadline Approaching',
    description: 'Brand Identity project due in 3 days',
    time: '5h ago',
  },
  {
    type: 'default',
    title: 'Task Completed',
    description: 'Design mockups approved',
    time: '6h ago',
  },
  {
    type: 'default',
    title: 'Meeting Scheduled',
    description: 'Client review call tomorrow at 2 PM',
    time: '8h ago',
  },
  {
    type: 'default',
    title: 'Payment Received',
    description: '$5,000 from Creative Studio',
    time: '1d ago',
  },
  {
    type: 'default',
    title: 'New Message',
    description: 'Client feedback on latest iteration',
    time: '1d ago',
  },
  {
    type: 'priority',
    title: 'Resource Alert',
    description: 'Team capacity at 85%',
    time: '2d ago',
  },
];

export default function SystemFeed() {
  return (
    <div className="bg-surface/20 backdrop-blur-sm border border-border/20 rounded-xl p-10 h-full">
      <h2 className="text-[22px] font-semibold text-text-primary mb-10 tracking-tight">Signal Feed</h2>

      <ScrollArea className="h-[600px] -mr-4 pr-4">
        <div className="space-y-1">
          {feedItems.map((item, index) => (
            <div key={index} className="group py-5 px-4 -mx-4 rounded-lg hover:bg-surface-elevated/40 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-[15px] font-semibold text-text-primary tracking-[-0.01em] leading-snug">
                      {item.title}
                    </h3>
                    {item.type === 'priority' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-[13px] text-text-tertiary mb-3 leading-relaxed font-normal">
                    {item.description}
                  </p>
                  <span className="text-[10px] text-text-muted uppercase tracking-[0.08em]">
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
