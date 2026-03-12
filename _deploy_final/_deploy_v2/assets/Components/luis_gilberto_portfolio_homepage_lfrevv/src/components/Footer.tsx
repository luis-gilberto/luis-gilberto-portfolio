import { MapPin, Mail, ArrowRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] text-white py-16 border-t border-white/10">
      <div className="container mx-auto px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">LG</span>
              </div>
              <span className="font-serif text-2xl font-bold">Luis Gilberto</span>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              Where <span className="font-serif italic text-primary">creativity</span> meets ROI; 
              transforming artistic vision into measurable business impact.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/in/luisgilberto00"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary rounded-lg flex items-center justify-center transition-all"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="mailto:hello@luisgilberto.com"
                className="w-10 h-10 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary rounded-lg flex items-center justify-center transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Portfolio Column */}
          <div>
            <h4 className="font-accent text-xs uppercase tracking-widest text-white/50 mb-6">
              Portfolio
            </h4>
            <nav className="flex flex-col gap-3">
              <a href="/" className="text-white/70 hover:text-white transition-colors text-sm">
                Home
              </a>
              <a href="/timeline" className="text-white/70 hover:text-white transition-colors text-sm">
                Timeline
              </a>
              <a href="#experience" className="text-white/70 hover:text-white transition-colors text-sm">
                Experience
              </a>
              <a href="#about" className="text-white/70 hover:text-white transition-colors text-sm">
                About
              </a>
              <a href="/brand" className="text-white/70 hover:text-white transition-colors text-sm">
                Brand Guidelines
              </a>
              <a href="/system" className="text-white/70 hover:text-white transition-colors text-sm">
                System
              </a>
            </nav>
          </div>

          {/* Ecosystem Column */}
          <div>
            <h4 className="font-accent text-xs uppercase tracking-widest text-white/50 mb-6">
              Ecosystem
            </h4>
            <nav className="flex flex-col gap-3">
              <a href="/" className="text-white/70 hover:text-white transition-colors text-sm">
                Portfolio
              </a>
              <a href="#hub" className="text-white/70 hover:text-white transition-colors text-sm">
                The Hub
              </a>
              <a href="#insights" className="text-white/70 hover:text-white transition-colors text-sm">
                Insights
              </a>
              <a href="#portal" className="text-white/70 hover:text-white transition-colors text-sm">
                The Portal
              </a>
            </nav>
          </div>

          {/* Connect Column */}
          <div>
            <h4 className="font-accent text-xs uppercase tracking-widest text-white/50 mb-6">
              Connect
            </h4>
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">Seattle, Washington</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="mailto:hello@luis-gilberto.com" className="text-white/70 hover:text-white transition-colors text-sm">
                  hello@luis-gilberto.com
                </a>
              </div>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-semibold transition-all group"
            >
              Let's Talk
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-sm">
            {/* Copyright */}
            <div className="text-white/50 text-center md:text-left">
              © {currentYear} Luis Gilberto. All rights reserved.
            </div>

            {/* Legal Links */}
            <nav className="flex items-center justify-center gap-4 text-white/50">
              <a href="#privacy" className="hover:text-white transition-colors text-xs">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-white transition-colors text-xs">
                Terms of Use
              </a>
              <a href="#accessibility" className="hover:text-white transition-colors text-xs">
                Accessibility
              </a>
              <span className="text-white/30">·</span>
              <a href="/system" className="hover:text-white transition-colors text-xs italic">
                How it all connects
              </a>
            </nav>

            {/* Tagline */}
            <div className="text-white/40 text-xs text-center md:text-right">
              Where <span className="font-serif italic text-primary">emotion</span> and{' '}
              <span className="font-accent uppercase tracking-wide text-secondary">structure</span> converge
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
