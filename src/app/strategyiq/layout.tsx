import type { Metadata } from 'next'
import { Navigation } from '@/components/ui/navigation'

export const metadata: Metadata = {
  title: 'StrategyIQ | Client Assessment',
}

export default function StrategyIQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <div className="flex flex-col flex-grow relative z-10 min-h-screen">
        {children}
      </div>
    </>
  )
}
