interface PageHeaderProps {
  className?: string;
}

export default function PageHeader({ className = '' }: PageHeaderProps) {
  return (
    <div className={`mb-20 ${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-px bg-gradient-to-r from-primary/40 to-transparent" />
        <div className="flex-1 h-px bg-gradient-to-r from-border/20 via-border/10 to-transparent" />
      </div>
      <h1 className="text-[42px] lg:text-[56px] font-semibold text-text-primary mb-4 tracking-tight leading-[1.1]">
        System Status
      </h1>
      <p className="text-[15px] text-text-tertiary font-normal tracking-[-0.01em]">
        Real-time overview of active operations and key metrics
      </p>
    </div>
  );
}
