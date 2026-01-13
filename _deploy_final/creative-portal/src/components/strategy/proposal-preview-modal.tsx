
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ProposalPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: {
    score: number
    tier: {
      name: string
      price: string
      duration: string
      description: string
    }
    clientName: string
  }
}

export function ProposalPreviewModal({ open, onOpenChange, data }: ProposalPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[var(--card-bg)] border-[var(--border-strong)] text-[var(--text-primary)]">
        <DialogHeader>
          <DialogTitle className="font-big-shoulders text-2xl">
            Strategic <span className="text-[var(--teal)]">Proposal Preview</span>
          </DialogTitle>
          <DialogDescription className="text-[var(--text-secondary)]">
            Review the generated strategic brief for {data.clientName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          <div className="bg-[var(--bg-alt)] p-4 rounded-xl border border-[var(--border-subtle)]">
            <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Recommendation</h3>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xl font-bold text-[var(--text-primary)]">{data.tier.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{data.tier.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[var(--coral)]">{data.score}</p>
                <p className="text-xs text-[var(--text-secondary)]">Intelligence Score</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--bg-alt)] p-4 rounded-xl border border-[var(--border-subtle)]">
              <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Investment</p>
              <p className="font-semibold">{data.tier.price}</p>
            </div>
            <div className="bg-[var(--bg-alt)] p-4 rounded-xl border border-[var(--border-subtle)]">
              <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Timeline</p>
              <p className="font-semibold">{data.tier.duration}</p>
            </div>
          </div>

          <div className="bg-[var(--bg-alt)] p-4 rounded-xl border border-[var(--border-subtle)] flex items-center gap-3">
             <i className="fas fa-file-pdf text-[var(--coral)] text-xl"></i>
             <div className="flex-1">
                <p className="text-sm font-medium">Strategic_Brief_{data.clientName.replace(/\s+/g, '_')}.pdf</p>
                <p className="text-xs text-[var(--text-secondary)]">Ready for export</p>
             </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="bg-[var(--bg-alt)] text-[var(--text-primary)] border border-[var(--border-strong)] hover:bg-[var(--border-strong)]">
            Close
          </Button>
          <Button className="bg-[var(--coral)] text-white hover:bg-[#e55a5a]">
            <i className="fas fa-download mr-2"></i> Download Proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
