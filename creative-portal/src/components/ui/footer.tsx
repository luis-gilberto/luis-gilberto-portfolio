import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] pt-16 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 mb-12">
          
          {/* Brand */}
          <div className="flex flex-col gap-4">
            {/* Using the standard LG logo for a clean look */}
            <img 
              src="/assets/images/coral_white.png" 
              alt="Luis Gilberto" 
              className="h-12 w-12 object-contain opacity-90" 
            />
            <h3 className="font-big-shoulders text-2xl font-bold text-[var(--text-primary)]">
              Luis Gilberto
            </h3>
            <p className="text-sm leading-relaxed text-[var(--text-muted)] max-w-xs">
              Making technology feel human through clarity, beautiful execution, and systems that scale.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Column 1: Work */}
            <div className="flex flex-col gap-3">
              <h4 className="font-big-shoulders text-base font-bold text-[var(--coral)] uppercase tracking-wide">Work</h4>
              <a href="https://luis-gilberto.com/myexperience.html" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Experience</a>
              <a href="https://luis-gilberto.com/timeline.html" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Timeline</a>
              <a href="https://luis-gilberto.com/myexperience.html#stories" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Stories</a>
            </div>
            
            {/* Column 2: About */}
            <div className="flex flex-col gap-3">
              <h4 className="font-big-shoulders text-base font-bold text-[var(--coral)] uppercase tracking-wide">About</h4>
              <a href="https://luis-gilberto.com/about.html" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">About Me</a>
              <a href="https://luis-gilberto.com/cv.html" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Resume</a>
              <a href="https://luis-gilberto.com/insights" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Insights</a>
            </div>

            {/* Column 3: Connect */}
            <div className="flex flex-col gap-3">
              <h4 className="font-big-shoulders text-base font-bold text-[var(--coral)] uppercase tracking-wide">Connect</h4>
              <a href="https://luis-gilberto.com/contact.html" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Contact</a>
              <a href="https://linkedin.com/in/luisgilberto00" target="_blank" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">LinkedIn</a>
              <a href="mailto:hello@luis-gilberto.com" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Email</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Social Icons (SVGs) - Replaced empty plates */}
          <div className="flex gap-4">
            <a href="https://linkedin.com/in/luisgilberto00" target="_blank" aria-label="LinkedIn" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--bg-alt)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--coral)] hover:text-white hover:border-[var(--coral)] transition-all">
              <span className="text-base font-semibold leading-none">in</span>
            </a>
            <a href="mailto:hello@luis-gilberto.com" aria-label="Email" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--bg-alt)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--coral)] hover:text-white hover:border-[var(--coral)] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
              </svg>
            </a>
          </div>
          
          {/* Copyright */}
          <div className="text-sm text-[var(--text-muted)]">
            &copy; {currentYear} Luis Gilberto · Built with intention.
          </div>
        </div>
      </div>
    </footer>
  )
}
