import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow px-6 text-center py-20">
      <div className="w-24 h-24 bg-[var(--bg-alt)] rounded-full flex items-center justify-center mb-8 border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="space-y-6 max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold tracking-[0.2em] text-[var(--coral)] uppercase block">
          Luis Gilberto Ecosystem
        </span>
        <h1 className="text-6xl md:text-8xl font-bold text-[var(--text-primary)] font-big-shoulders tracking-tight leading-[0.9]">
          The Portal
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed font-light">
          The command center for our active projects. Track milestones, review assets, and manage deliverables in real-time.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[380px] mx-auto">
        <Button 
          asChild 
          className="h-14 text-lg bg-[var(--coral)] hover:bg-[#e55a5a] text-white rounded-full font-bold w-full shadow-lg hover:-translate-y-1 transition-all border-0"
        >
          <Link href="/auth/signin">Log In to Project</Link>
        </Button>
        
        <Button 
          asChild 
          variant="outline"
          className="h-14 text-lg border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--coral)] hover:text-[var(--coral)] bg-transparent rounded-full font-medium w-full transition-all"
        >
          <a href="https://luis-gilberto.com">Back to Portfolio</a>
        </Button>
      </div>

      <div className="mt-16 flex items-center gap-2 text-xs text-[var(--text-muted)] uppercase tracking-widest opacity-60">
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        Secured Environment
      </div>
    </div>
  )
}
