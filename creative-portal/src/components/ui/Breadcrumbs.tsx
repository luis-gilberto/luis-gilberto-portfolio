import React from 'react'
import Link from 'next/link'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  showBack?: boolean
}

export function Breadcrumbs({ items, className, showBack = true }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex flex-col gap-4 mb-8", className)}>
      {showBack && items.length > 1 && (
        <Link 
          href={items[items.length - 2].href || '#'} 
          className="group flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-coral tracking-[0.2em] uppercase transition-all"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to {items[items.length - 2].label}
        </Link>
      )}
      
      <div className="flex items-center gap-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight size={10} className="text-white/10" />}
            {item.href && !item.active ? (
              <Link 
                href={item.href}
                className="text-[10px] font-bold text-white/20 hover:text-white/40 tracking-widest uppercase transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(
                "text-[10px] font-bold tracking-widest uppercase",
                item.active ? "text-teal" : "text-white/40"
              )}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  )
}
