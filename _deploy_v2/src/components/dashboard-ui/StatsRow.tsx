import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatsRowProps {
  className?: string;
}

const stats = [
  { 
    label: 'Active Threads', 
    value: 24, 
    change: '+12%', 
    trend: 'up',
    isHero: true,
    subtitle: 'In progress'
  },
  { 
    label: 'Completion Rate', 
    value: 87, 
    change: '+5%', 
    trend: 'up',
    suffix: '%',
    subtitle: 'This month'
  },
  { 
    label: 'Response Time', 
    value: 2.4, 
    change: '-18%', 
    trend: 'down',
    suffix: 'h',
    subtitle: 'Average'
  },
];

export default function StatsRow({ className = '' }: StatsRowProps) {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (statsRef.current) {
      const cards = statsRef.current.querySelectorAll('.stat-card');
      cards.forEach((card) => {
        const valueElement = card.querySelector('.stat-value');
        if (valueElement) {
          const targetValue = parseFloat(valueElement.getAttribute('data-value') || '0');
          const suffix = valueElement.getAttribute('data-suffix') || '';
          
          gsap.to(
            { value: 0 },
            {
              value: targetValue,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: function () {
                const currentValue = this.targets()[0].value;
                const formattedValue = suffix === '%' || suffix === 'h' 
                  ? currentValue.toFixed(1) 
                  : Math.floor(currentValue).toLocaleString();
                valueElement.textContent = formattedValue + suffix;
              },
            }
          );
        }
      });
    }
  }, []);

  return (
    <div ref={statsRef} className={`grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 ${className}`}>
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`stat-card group ${stat.isHero ? 'lg:col-span-1' : ''}`}
        >
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-[0.12em] text-text-muted font-medium mb-4">
                {stat.label}
              </div>
              <div 
                className={`stat-value font-semibold text-text-primary leading-none tracking-[-0.03em] mb-3 ${
                  stat.isHero ? 'text-[72px] lg:text-[80px]' : 'text-[48px] lg:text-[56px]'
                }`}
                data-value={stat.value} 
                data-suffix={stat.suffix || ''}
              >
                0{stat.suffix || ''}
              </div>
              <div className="text-[13px] text-text-tertiary mb-3">{stat.subtitle}</div>
              <div className="flex items-center gap-2 text-[12px] font-medium text-neutral">
                {stat.trend === 'up' ? (
                  <ArrowUp className="w-3 h-3" strokeWidth={2.5} />
                ) : (
                  <ArrowDown className="w-3 h-3" strokeWidth={2.5} />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
