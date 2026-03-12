"use client"
import { CircularRevealHeading } from "@/components/ui/circular-reveal-heading"

const portfolioItems = [
  {
    text: "FAMILY SAFETY",
    title: "Family Safety Campaign",
    image: "/images/projects/family-safety-campaign_hero_400x400.jpg"
  },
  {
    text: "FREE TO BE FREE",
    title: "Free to Be Free Campaign",
    image: "/images/projects/free-to-be-free-original_hero_400x400.jpg"
  },
  {
    text: "TEAMS TOGETHER",
    title: "Teams Get Together",
    image: "/images/projects/teams-get-together-hero_hero_400x400.jpg"
  },
  {
    text: "M365 REBRAND",
    title: "Microsoft 365 Rebrand",
    image: "/images/projects/free-to-be-free-copilot-era_hero_400x400.jpg"
  },
  {
    text: "3D EMOJIS",
    title: "Teams 3D Emojis",
    image: "/images/projects/teams-3d-emojis_hero_400x400.jpg"
  }
];

const centerContent = (
  <div className="text-center space-y-2">
    <h1 className="text-3xl font-light tracking-wide text-gray-900 leading-tight">
      INTERACTIVE<br/>
      <span className="text-[#F96F6E] font-semibold bg-gradient-to-r from-[#F96F6E] to-[#E55A59] bg-clip-text text-transparent">SHOWCASE</span>
    </h1>
    <div className="w-8 h-[2px] bg-gradient-to-r from-[#F96F6E] to-[#E55A59] mx-auto my-3 rounded-full"></div>
    <p className="text-sm text-gray-700 uppercase tracking-[0.15em] font-semibold">
      Creative Exploration
    </p>
    <p className="text-xs text-gray-600 uppercase tracking-[0.1em] font-medium">
      Design • Innovation • Experience
    </p>
    <p className="text-xs text-gray-500 mt-4 uppercase tracking-[0.1em] font-medium opacity-80">
      Hover to Explore
    </p>
  </div>
);

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F96F6E] to-[#E55A59] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg tracking-tight">LG</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-800 tracking-tight">Luis Gilberto</span>
            </div>
            <div className="hidden sm:flex space-x-6 lg:space-x-10">
              <a href="#timeline" className="text-gray-600 hover:text-[#F96F6E] transition-all duration-300 font-medium tracking-wide text-sm lg:text-base">Timeline</a>
              <a href="#about" className="text-gray-600 hover:text-[#F96F6E] transition-all duration-300 font-medium tracking-wide text-sm lg:text-base">About</a>
              <a href="#cv" className="text-gray-600 hover:text-[#F96F6E] transition-all duration-300 font-medium tracking-wide text-sm lg:text-base">Resume</a>
              <a href="#contact" className="text-gray-600 hover:text-[#F96F6E] transition-all duration-300 font-medium tracking-wide text-sm lg:text-base">Contact</a>
            </div>
            {/* Mobile menu button */}
            <button className="sm:hidden p-2 text-gray-600 hover:text-[#F96F6E] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
        <div className="text-center max-w-6xl mx-auto w-full">
          <CircularRevealHeading 
            items={portfolioItems}
            centerText={centerContent}
            size="lg"
            className="mx-auto mb-8 sm:mb-12 scale-75 sm:scale-90 lg:scale-100"
          />
           
          {/* Call to Action */}
           <div className="space-y-6 sm:space-y-8">
             <p className="text-gray-700 text-base sm:text-lg lg:text-xl max-w-xl sm:max-w-2xl mx-auto leading-relaxed font-light px-4">
               Explore 13 years of creative leadership through AI-powered innovation, 
               brand storytelling, and strategic campaigns that shaped the digital landscape.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
               <a 
                 href="#timeline"
                 className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#F96F6E] to-[#E55A59] text-white rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold tracking-wide min-w-[160px] sm:min-w-[180px] text-center"
               >
                 View Timeline
               </a>
               <a 
                 href="#about"
                 className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#F96F6E] text-[#F96F6E] rounded-2xl hover:bg-[#F96F6E] hover:text-white hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold tracking-wide min-w-[160px] sm:min-w-[180px] text-center"
               >
                 Learn More
               </a>
             </div>
           </div>
        </div>
      </main>
    </div>
  )
}
