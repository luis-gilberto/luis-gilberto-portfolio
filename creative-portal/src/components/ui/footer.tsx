import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] pt-16 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 mb-12">
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex">
              <img 
                src="/assets/images/coral_white.png" 
                alt="Luis Gilberto Logo" 
                className="h-8 md:h-10 w-auto opacity-90" 
              />
            </Link>
            <h3 className="font-big-shoulders text-2xl font-bold text-[var(--text-primary)]">
              Luis Gilberto
            </h3>
            <p className="text-sm leading-relaxed text-[var(--text-muted)] max-w-xs">
              Making technology feel human through clarity, beautiful execution, and systems that scale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="font-big-shoulders text-base font-bold text-[var(--coral)] uppercase tracking-wide">Work</h4>
              <a href="https://luis-gilberto.com/myexperience.html" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Experience</a>
              <a href="https://luis-gilberto.com/timeline.html" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Timeline</a>
              <a href="https://luis-gilberto.com/myexperience.html#stories" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Stories</a>
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="font-big-shoulders text-base font-bold text-[var(--coral)] uppercase tracking-wide">About</h4>
              <a href="https://luis-gilberto.com/about.html" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">About Me</a>
              <a href="https://luis-gilberto.com/cv.html" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Resume</a>
              <a href="https://luis-gilberto.com/insights" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Insights</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-big-shoulders text-base font-bold text-[var(--coral)] uppercase tracking-wide">Connect</h4>
              <a href="https://luis-gilberto.com/contact.html" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Contact</a>
              <a href="https://linkedin.com/in/luisgilberto00" target="_blank" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">LinkedIn</a>
              <a href="mailto:hello@luis-gilberto.com" className="text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors">Email</a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <a href="https://linkedin.com/in/luisgilberto00" target="_blank" aria-label="LinkedIn" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--bg-alt)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--coral)] hover:text-white hover:border-[var(--coral)] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 4a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"></path>
              </svg>
            </a>
            <a href="mailto:hello@luis-gilberto.com" aria-label="Email" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--bg-alt)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--coral)] hover:text-white hover:border-[var(--coral)] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
              </svg>
            </a>
          </div>
          
          <div className="text-sm text-[var(--text-muted)]">
            &copy; {currentYear} Luis Gilberto · Built with intention.
          </div>
        </div>
      </div>
    </footer>
  )
}
