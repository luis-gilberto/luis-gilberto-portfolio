import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center py-20 relative z-10 bg-[#0A0A0A]">
      
      {/* 1. Brand Watermark */}
      <div className="flex flex-col items-center mb-8"> 
        {/* The Logomark */}
        <a 
          href="https://luis-gilberto.com" 
          title="Back to Portfolio"
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(249,111,110,0.3)] mb-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(249,111,110,0.5)] hover:border-coral/30"
        > 
          <img src="/assets/images/Coral_LG-3D.png" alt="Logomark" className="w-10 h-auto md:w-12 opacity-90" /> 
        </a>

        {/* The Text Stack */}
        <div className="text-center tracking-[0.3em] leading-tight font-inter opacity-60"> 
          <div className="text-[10px] md:text-xs font-medium text-white/40 mb-1">LUIS GILBERTO</div> 
          <div className="text-[10px] md:text-xs font-medium text-white/20">ECOSYSTEM</div> 
        </div> 
      </div>

      {/* 2. Main Headline Lockup */}
      <h1 className="flex flex-col md:flex-row items-center justify-center font-big-shoulders font-black italic uppercase text-6xl md:text-8xl tracking-tighter leading-none mt-8 mb-4">
        <span className="text-coral mr-0 md:mr-4">LG</span>
        <span className="text-white">/ PORTAL</span>
      </h1>

      {/* 3. Subheadline */}
      <p className="font-inter font-light text-sm md:text-base text-zinc-500 uppercase tracking-[0.4em] max-w-lg mx-auto mb-12 mt-2">
        Strategic Intelligence
      </p>

      {/* 4. Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md mx-auto">
        <Button 
          asChild 
          className="h-12 px-8 text-[11px] uppercase tracking-[0.2em] bg-coral hover:bg-coral/90 text-black rounded-full font-bold shadow-[0_0_30px_rgba(249,111,110,0.3)] transition-all hover:scale-105"
        >
          <Link href="/dashboard">Enter System</Link>
        </Button>
      </div>

      {/* 5. Footer Security Badge */}
      <div className="fixed bottom-12 flex items-center gap-3 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em] opacity-60">
        <div className="w-1.5 h-1.5 rounded-full bg-teal shadow-[0_0_10px_rgba(46,211,198,0.5)] animate-pulse"></div>
        Secured Environment
      </div>
    </div>
  )
}
