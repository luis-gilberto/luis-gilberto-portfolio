import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow px-6 text-center py-20 relative z-10">
      
      {/* 1. Brand Seal */}
      <div className="flex flex-col items-center mb-8"> 
        {/* 1. The Circle Container */} 
        <div className="w-20 h-20 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(249,111,110,0.2)] mb-4 backdrop-blur-md"> 
          {/* 2. The Logomark ONLY */} 
          <img src="/assets/images/Coral_LG-3D.png" alt="Logomark" className="w-16 h-auto opacity-90" /> 
        </div> 
        {/* 3. The Text Stack */} 
        <div className="text-center tracking-[0.2em] leading-tight"> 
          <div className="text-xs font-bold text-white mb-1">LUIS GILBERTO</div> 
          <div className="text-sm font-bold text-[#F96F6E]">ECOSYSTEM</div> 
        </div> 
      </div>

      {/* 2. Main Headline */}
      <h1 className="font-serif font-bold text-6xl md:text-8xl text-white drop-shadow-lg mb-4">
        Command Center
      </h1>

      {/* 3. Subheadline */}
      <p className="font-sans text-xl md:text-2xl text-gray-300 max-w-lg mx-auto mb-10">
        Strategic Intelligence
      </p>

      {/* 4. Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md mx-auto">
        <Button 
          asChild 
          className="h-12 px-8 text-base bg-[var(--coral)] hover:bg-[#e55a5a] text-white rounded-full font-bold shadow-lg transition-all"
        >
          <Link href="/admin">Enter System</Link>
        </Button>
        
        <Button 
          asChild 
          variant="ghost"
          className="h-12 px-8 text-base text-gray-300 hover:text-white hover:bg-white/10 rounded-full font-medium transition-all"
        >
          <Link href="/auth/signup">Request Access</Link>
        </Button>
      </div>

      <div className="mt-24 flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest opacity-60">
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        Secured Environment
      </div>
    </div>
  )
}
