import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Fingerprint, Layers, Video, Zap, Anchor, ExternalLink, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function StudioPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <div ref={containerRef} className="relative bg-background min-h-screen overflow-hidden">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30 dark:opacity-40">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, transparent 70%)', // Teal-ish
            top: '-200px',
            right: '-200px',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(249, 111, 110, 0.12) 0%, transparent 70%)', // Coral-ish
            bottom: '-100px',
            left: '-100px',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Capabilities Grid */}
      <CapabilitiesSection />

      {/* Dual Track Methodology */}
      <DualTrackSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

type CubePhase = 'wireframe' | 'coral' | 'teal' | 'metal' | 'glass';

function StudioHeroCube() {
  const [phase, setPhase] = useState<CubePhase>('wireframe');

  useEffect(() => {
    const cycle = async () => {
      while (true) {
        // 1. Wireframe Formation
        setPhase('wireframe');
        await new Promise(r => setTimeout(r, 2000));
        
        // 2. Solid Colors (Coral)
        setPhase('coral');
        await new Promise(r => setTimeout(r, 2000));
        
        // 3. Solid Colors (Teal)
        setPhase('teal');
        await new Promise(r => setTimeout(r, 2000));
        
        // 4. Metal
        setPhase('metal');
        await new Promise(r => setTimeout(r, 2000));
        
        // 5. Glass with Logo
        setPhase('glass');
        await new Promise(r => setTimeout(r, 5000));
      }
    };
    cycle();
  }, []);

  // Cube size: 160px (w-40). Half is 80px.
  const size = 80; 

  return (
    <div className="mx-auto mb-24 relative flex justify-center items-center">
      {/* Circular Plate - Enhanced Contrast & Visibility */}
      <motion.div 
        className="w-[500px] h-[500px] rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/20 flex items-center justify-center relative backdrop-blur-md shadow-[0_0_120px_-30px_rgba(45,212,191,0.2)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Rotating Rings */}
        <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_40s_linear_infinite]" />
        <div className="absolute inset-16 rounded-full border border-primary/30 border-dashed animate-[spin_25s_linear_infinite_reverse]" />
        
        {/* 3D Cube Container */}
        <div className="w-40 h-40 relative perspective-[1200px]">
          <motion.div
            className="w-full h-full relative preserve-3d"
            initial={{ rotateX: -25, rotateY: -45 }}
            animate={{ 
              rotateX: [-25, 335], 
              rotateY: [-45, 315] 
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear",
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Inner Floating Logo - Only visible in Glass phase */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: 'translateZ(0)' }}
              animate={{ 
                opacity: phase === 'glass' ? 1 : 0,
                scale: phase === 'glass' ? 1 : 0.5,
                rotateY: [0, -360] // Counter-rotate to face front or add interesting spin
              }}
              transition={{ duration: 1.5 }}
            >
              <img 
                src="https://c.animaapp.com/miw6zgdna5SIGT/img/gradient_lg-3d.png" 
                alt="LG Logo" 
                className="w-24 h-24 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              />
            </motion.div>

            {/* Faces */}
            <CubeFace translateZ={size} phase={phase} />
            <CubeFace translateZ={-size} rotateY={180} phase={phase} />
            <CubeFace rotateY={90} translateZ={size} phase={phase} />
            <CubeFace rotateY={-90} translateZ={size} phase={phase} />
            <CubeFace rotateX={90} translateZ={size} phase={phase} />
            <CubeFace rotateX={-90} translateZ={size} phase={phase} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

interface CubeFaceProps {
  translateZ: number;
  rotateX?: number;
  rotateY?: number;
  phase: CubePhase;
}

function CubeFace({ translateZ, rotateX = 0, rotateY = 0, phase }: CubeFaceProps) {
  
  const getMaterialClass = (p: CubePhase) => {
    switch(p) {
      case 'wireframe': return 'bg-transparent border-2 border-primary/50';
      case 'coral': return 'bg-[#FF6B7A] shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] border-0';
      case 'teal': return 'bg-[#2DD4BF] shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] border-0';
      case 'metal': return 'bg-gradient-to-br from-[#e0e0e0] via-[#999999] to-[#e0e0e0] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border-0';
      case 'glass': return 'bg-white/5 backdrop-blur-[2px] border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]';
      default: return 'bg-transparent';
    }
  };

  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center backface-visible transition-all duration-1000`}
      style={{
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
        backfaceVisibility: 'visible',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className={`absolute inset-0 ${getMaterialClass(phase)}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-8 pt-20 pb-20 overflow-hidden">
      <div className="container mx-auto max-w-5xl text-center relative z-10">
        
        {/* 3D Cube Animation */}
        <StudioHeroCube />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-accent text-5xl lg:text-8xl font-bold uppercase tracking-tight leading-[0.9] mb-8">
            Execution meets<br />
            <span className="bg-gradient-to-r from-teal via-white to-coral bg-clip-text text-transparent animate-gradient-x">
              Excellence.
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 text-balance font-medium">
            The production arm of the ecosystem. We translate strategic roadmaps into pixel-perfect reality. 
            From brand identity systems to full-stack web development.
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-foreground to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const capabilities = [
    {
      title: "Brand Identity",
      description: "Visual Systems, Logo Design, Voice & Tone. We craft the visual language that speaks before you do.",
      icon: Fingerprint,
      color: "text-coral"
    },
    {
      title: "Digital Experience",
      description: "Web Design, UI/UX, Framer/Webflow Development. Immersive digital environments built for conversion and awe.",
      icon: Layers,
      color: "text-teal"
    },
    {
      title: "Content Engines",
      description: "Campaign Assets, Social Toolkits, Video Production. High-volume, high-quality content production.",
      icon: Video,
      color: "text-primary"
    }
  ];

  return (
    <section ref={ref} className="py-32 px-8 relative z-10">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-8">
          {capabilities.map((cap, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group relative h-full p-10 bg-card/50 backdrop-blur-xl border-border hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className={`w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 ${cap.color}`}>
                  <cap.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>

                <h3 className="font-accent text-2xl font-bold uppercase tracking-wide mb-4 text-foreground group-hover:text-primary transition-colors">
                  {cap.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {cap.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DualTrackSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-32 px-8 bg-muted/10 border-y border-border relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="font-accent text-4xl lg:text-6xl font-bold uppercase tracking-tight mb-6"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-coral">Dual-Track</span> Method
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            How we balance immediate needs with long-term vision. Connected directly to the Portal's workflow.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Track A */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-teal/5 rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-500" />
            <div className="relative p-10 rounded-3xl border border-border bg-card/80 backdrop-blur-sm h-full border-l-4 border-l-teal">
              <div className="flex items-center justify-between mb-6">
                <span className="font-accent text-sm font-bold uppercase tracking-widest text-teal">Track A: Rapid Response</span>
                <Zap className="w-6 h-6 text-teal" />
              </div>
              <h3 className="font-display text-3xl font-bold mb-4">Immediate Fixes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Quick wins and urgent patches. Addressing functional blockers, broken paths, and content updates without delaying the roadmap.
              </p>
            </div>
          </motion.div>

          {/* Track B */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-coral/5 rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-500" />
            <div className="relative p-10 rounded-3xl border border-border bg-card/80 backdrop-blur-sm h-full border-l-4 border-l-coral">
              <div className="flex items-center justify-between mb-6">
                <span className="font-accent text-sm font-bold uppercase tracking-widest text-coral">Track B: Deep Work</span>
                <Anchor className="w-6 h-6 text-coral" />
              </div>
              <h3 className="font-display text-3xl font-bold mb-4">Deep Branding</h3>
              <p className="text-muted-foreground leading-relaxed">
                Strategic overhauls and new feature development. Building the foundation for the next evolution of the brand ecosystem.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section ref={ref} className="py-40 px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-card border border-border rounded-3xl p-12 lg:p-20 relative overflow-hidden"
        >
          {/* Decorative Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-coral to-transparent" />
          
          <h2 className="font-accent text-4xl lg:text-6xl font-bold uppercase tracking-tight mb-6">
            Ready to <span className="text-coral">Build?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Launch a new project or request a task directly in the ecosystem command center.
          </p>

          <Button
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 font-accent font-bold text-lg uppercase tracking-wider px-10 py-7 rounded-full group"
            asChild
          >
            <a href="https://portal.luis-gilberto.com" target="_blank" rel="noopener noreferrer">
              Open Project in Portal
              <ExternalLink className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
