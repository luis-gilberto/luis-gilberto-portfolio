import { MissionControl } from '@/components/admin/MissionControl'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export default function MissionControlPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Breadcrumbs 
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Mission Control', active: true }
          ]} 
        />
        
        <div className="space-y-2">
          <h1 className="text-4xl font-big-shoulders font-black text-white uppercase tracking-wide">
            Mission Control
          </h1>
          <p className="text-white/40 font-inter text-lg max-w-2xl">
            Centralized queue for strategic review. Monitor SLAs, assign consultants, and intervene on critical delays.
          </p>
        </div>

        <MissionControl />
      </div>
    </div>
  )
}
