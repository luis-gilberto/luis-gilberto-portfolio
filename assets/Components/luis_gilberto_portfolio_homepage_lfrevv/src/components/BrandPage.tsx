import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function BrandPage() {
  return (
    <div className="relative">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 107, 122, 0.15) 0%, transparent 70%)',
            top: '-200px',
            left: '-200px',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(45, 212, 191, 0.12) 0%, transparent 70%)',
            bottom: '-150px',
            right: '-150px',
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 158, 165, 0.1) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
          }}
          animate={{
            x: [-50, 50, -50],
            y: [50, -50, 50],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 14 }}
        />
      </div>

      {/* Floating Geometric Shapes */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-15">
        <motion.div
          className="absolute w-[300px] h-[300px] border border-border rounded-full"
          style={{ top: '20%', left: '10%' }}
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[200px] h-[200px] border border-border rotate-45"
          style={{ bottom: '30%', right: '15%' }}
          animate={{ y: [0, 30, 0], rotate: [45, 50, 45] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[150px] h-[150px] border border-primary/20 rounded-full"
          style={{ top: '60%', left: '20%' }}
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Trinity Framework */}
      <TrinitySection />

      {/* Logo & Identity System */}
      <LogoIdentitySection />

      {/* Brand Voice */}
      <BrandVoiceSection />

      {/* Typography System */}
      <TypographySection />

      {/* Color System */}
      <ColorSystemSection />

      {/* Frameworks Applied */}
      <FrameworksSection />

      {/* CTA */}
      <CTASection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-8 pt-28 pb-16 overflow-hidden border-b border-[#d4d4c8]">
      <div className="container mx-auto max-w-5xl relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-accent text-sm uppercase tracking-[0.12em] text-primary mb-4"
        >
          LUIS GILBERTO BRAND GUIDELINES
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-accent text-6xl lg:text-8xl font-bold uppercase tracking-tight leading-[0.9] mb-6"
        >
          THE <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-[gradientShift_8s_ease_infinite]">ORCHESTRATOR</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-serif text-3xl lg:text-5xl italic text-muted-foreground mb-8"
        >
          Three Perspectives. One Vision.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-body-large text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Orchestrating comprehensive marketing strategy through three distinct lenses to build brands that are
          technically sound, emotionally resonant, and impeccably executed.
        </motion.p>
      </div>
    </section>
  );
}

function TrinitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const cards = [
    {
      id: 'strategist',
      title: 'THE STRATEGIST',
      subtitle: 'Data-driven architect',
      focus: 'Market insights, competitive positioning, ROI',
      question: '"What does the data tell us?"',
      borderClass: 'before:bg-primary',
      textClass: 'text-primary',
      glowBg: 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,107,122,0.15)_0%,transparent_70%)]',
    },
    {
      id: 'storyteller',
      title: 'THE STORYTELLER',
      subtitle: 'Narrative craftsperson',
      focus: 'Brand voice, creative direction, emotional resonance',
      question: '"How do we make them feel?"',
      borderClass: 'before:bg-secondary',
      textClass: 'text-secondary',
      glowBg: 'bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.15)_0%,transparent_70%)]',
    },
    {
      id: 'orchestrator',
      title: 'THE ORCHESTRATOR',
      subtitle: 'Integration conductor',
      focus: 'Cross-functional execution, stakeholder alignment, delivery',
      question: '"How do we bring it to life?"',
      borderClass: 'before:bg-gradient-to-r before:from-primary before:to-secondary',
      textClass: 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent',
      glowBg: 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,158,165,0.15)_0%,transparent_70%)]',
    },
  ];

  return (
    <section ref={ref} className="py-32 px-8 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="font-accent text-4xl lg:text-6xl font-bold uppercase tracking-tight mb-4">
            THE TRINITY FRAMEWORK
          </h2>
          <p className="text-xl text-muted-foreground">
            Every brand decision flows through three perspectives:
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="relative bg-card/80 backdrop-blur-xl border border-[#d4d4c8] p-8 h-full group transition-all duration-500 overflow-hidden hover:border-white/30 hover:-translate-y-2 hover:shadow-2xl rounded-xl">
                {/* Top Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${card.borderClass} transition-all duration-500 group-hover:h-1.5`} />

                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={card.glowBg} />
                </div>

                <motion.h3
                  className={`font-accent text-3xl lg:text-4xl font-bold uppercase mb-2 ${card.textClass} transition-transform duration-300 group-hover:scale-105 relative z-10`}
                >
                  {card.title}
                </motion.h3>
                
                <p className="font-serif italic text-lg text-foreground mb-6 pb-4 border-b border-[#d4d4c8] relative z-10">
                  {card.subtitle}
                </p>

                <div className="mb-4 relative z-10">
                  <span className="font-accent text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                    Focus
                  </span>
                  <p className="text-sm text-foreground">{card.focus}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-[#d4d4c8] relative z-10">
                  <p className={`font-serif italic text-lg ${card.textClass}`}>
                    {card.question}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-card/50 backdrop-blur-xl border-l-4 border-primary p-8 lg:p-12 max-w-4xl mx-auto relative">
            <div className="absolute -top-4 -left-4 text-8xl text-primary/20 font-serif pointer-events-none">"</div>
            <p className="font-serif text-2xl lg:text-3xl italic text-foreground leading-relaxed relative z-10">
              "The Trinity isn't about choosing one perspective: it's about weaving all three into every decision, every campaign, every moment."
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function LogoIdentitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-32 px-8 border-t border-[#d4d4c8]">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12"
        >
          <p className="font-accent text-xs uppercase tracking-[0.15em] text-primary mb-4">
            Logo & Identity System
          </p>
          <h2 className="font-accent text-4xl lg:text-6xl font-bold uppercase tracking-tight mb-8">
            LOGO & IDENTITY SYSTEM
          </h2>
        </motion.div>

        {/* PRIMARY LOCKUP */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="font-accent text-2xl uppercase text-primary mb-6 relative inline-block after:absolute after:bottom-[-8px] after:left-0 after:w-16 after:h-1 after:bg-primary after:rounded-full"
        >
          PRIMARY LOCKUP
        </motion.h3>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {[
            { bg: 'bg-white', img: 'brand/assets/images/Logo-Lockup-CoralMark-BlackType.png', caption: 'Preferred: Light backgrounds', textColor: 'text-foreground/70' },
            { bg: 'bg-[#0A0A0A]', img: 'brand/assets/images/Logo-Lockup-CoralMark-WhiteType.png', caption: 'Preferred: Dark backgrounds', textColor: 'text-white/70' },
            { bg: 'bg-white', img: 'brand/assets/images/Logo-Lockup-BlackMark-BlackType.png', caption: 'Alternate: Monochrome light', textColor: 'text-foreground/70' },
            { bg: 'bg-[#0A0A0A]', img: 'brand/assets/images/Logo-Lockup-WhiteMark-WhiteType.png', caption: 'Alternate: Monochrome dark', textColor: 'text-white/70' },
          ].map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Card className={`${logo.bg} border border-[#d4d4c8] rounded-xl p-12 text-center overflow-hidden group transition-all duration-500 hover:border-primary/50 hover:shadow-2xl`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={logo.img}
                    alt="Logo"
                    className="max-w-[280px] w-full h-auto mx-auto"
                  />
                </motion.div>
                <p className={`mt-4 text-sm font-medium transition-colors duration-300 ${logo.textColor} group-hover:text-primary`}>
                  {logo.caption}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-body-large text-muted-foreground leading-relaxed max-w-3xl mb-16"
        >
          The primary lockup combines the logomark with the wordmark "LUIS GILBERTO / Marketing & Creative". 
          The coral arc version is preferred; use monochrome versions only when color is not available.
        </motion.p>

        {/* LOGOMARK */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="font-accent text-2xl uppercase text-secondary mb-6 mt-16 relative inline-block after:absolute after:bottom-[-8px] after:left-0 after:w-16 after:h-1 after:bg-secondary after:rounded-full"
        >
          LOGOMARK
        </motion.h3>

        <p className="text-body text-muted-foreground mb-6">
          The logomark has multiple color combinations. Format: [G color] + [Arc color]. Use CoralBlack or WhiteCoral as primary marks.
        </p>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { img: 'brand/assets/images/LG-logomark-CoralBlack.png', caption: 'CoralBlack', primary: true, bg: 'bg-white', border: 'border-2 border-primary shadow-[0_0_20px_rgba(255,107,122,0.2)]', textColor: 'text-foreground/70' },
            { img: 'brand/assets/images/LG-logomark-WhiteCoral.png', caption: 'WhiteCoral', primary: true, bg: 'bg-[#0A0A0A]', border: 'border-2 border-secondary shadow-[0_0_20px_rgba(45,212,191,0.2)]', textColor: 'text-white/70' },
            { img: 'brand/assets/images/LG-logomark-CoralCoral.png', caption: 'CoralCoral', bg: 'bg-gradient-to-br from-[#F5F5DC] to-[#0A0A0A]', border: 'border border-[#666]', textColor: 'text-foreground/70' },
            { img: 'brand/assets/images/LG-logomark-BlackBlack.png', caption: 'BlackBlack', bg: 'bg-white', border: 'border border-[#d4d4c8]', textColor: 'text-foreground/70' },
          ].map((mark, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.7 + (0.1 * index), duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.05, rotate: 5 }}
            >
              <Card className={`${mark.bg} ${mark.border} rounded-xl p-8 text-center group transition-all duration-500`}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={mark.img}
                    alt={mark.caption}
                    className="max-w-[120px] w-full h-auto mx-auto"
                  />
                </motion.div>
                <p className={`mt-4 text-xs font-semibold ${mark.textColor}`}>
                  <strong>{mark.caption}</strong>
                  {mark.primary && <span className="block text-primary mt-1">(Primary)</span>}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-body text-muted-foreground leading-relaxed mb-16"
        >
          Use logomark alone when space is constrained (social avatars, favicons, app icons). The coral arc is the signature element: it represents the Orchestrator's integrative energy.
        </motion.p>

        {/* THE ARC ELEMENT */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.1 }}
          className="font-accent text-2xl uppercase mb-6 mt-16"
        >
          THE ARC ELEMENT
        </motion.h3>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {[
            { bg: 'bg-white', img: 'brand/assets/images/arc-coral-light.png', alt: 'Arc Element - Light' },
            { bg: 'bg-[#0A0A0A]', img: 'brand/assets/images/arc-coral-dark.png', alt: 'Arc Element - Dark' },
          ].map((arc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.2 + (0.1 * index) }}
              whileHover={{ y: -4 }}
            >
              <Card className={`${arc.bg} border border-[#d4d4c8] rounded-xl p-12 text-center group transition-all duration-500 hover:shadow-xl`}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={arc.img}
                    alt={arc.alt}
                    className="max-w-[150px] w-full h-auto mx-auto"
                  />
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.4 }}
          className="text-body text-muted-foreground leading-relaxed mb-6"
        >
          The coral arc can be extracted and used as a design accent beyond the logo itself. It represents movement, orchestration, and the connection between perspectives. Use it to create visual rhythm or frame content.
        </motion.p>

        {/* Note Box */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 1.5 }}
          whileHover={{ x: 4 }}
        >
          <Card className="bg-card/80 backdrop-blur-xl border-l-4 border-primary p-6 pl-16 relative group transition-all duration-300 hover:shadow-xl">
            <motion.div
              className="absolute left-6 top-6 text-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💡
            </motion.div>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Conceptual Note:</strong> The arc mirrors the Trinity gradient: 
              it visually bridges the Strategist (logic) and Storyteller (emotion), embodying the Orchestrator role of integration.
            </p>
          </Card>
        </motion.div>

        {/* USAGE GUIDELINES */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6 }}
          className="font-accent text-2xl uppercase mb-6 mt-16"
        >
          USAGE GUIDELINES
        </motion.h3>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1.7 }}
            whileHover={{ y: -4 }}
          >
            <Card className="bg-card border-2 border-secondary p-8 relative overflow-hidden group transition-all duration-500 hover:shadow-xl">
              <div className="absolute top-6 right-6 text-4xl font-bold text-secondary/15 group-hover:text-secondary/30 group-hover:scale-110 transition-all">
                ✓
              </div>
              <h4 className="font-accent text-xl uppercase text-secondary mb-4">DO</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-secondary mt-1">•</span>
                  <span>Use the full lockup when space allows</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary mt-1">•</span>
                  <span>Maintain clear space (minimum 50% of logomark height)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary mt-1">•</span>
                  <span>Use approved color variations only</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary mt-1">•</span>
                  <span>Keep minimum size: 120px wide for digital, 1" for print</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary mt-1">•</span>
                  <span>Use the arc element as a design accent</span>
                </li>
              </ul>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1.8 }}
            whileHover={{ y: -4 }}
          >
            <Card className="bg-card border-2 border-primary p-8 relative overflow-hidden group transition-all duration-500 hover:shadow-xl">
              <div className="absolute top-6 right-6 text-4xl font-bold text-primary/15 group-hover:text-primary/30 group-hover:scale-110 transition-all">
                ✗
              </div>
              <h4 className="font-accent text-xl uppercase text-primary mb-4">DON'T</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Rotate, skew, or distort the logo</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Change the coral color to other hues</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Add effects, shadows, or outlines</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Use on busy backgrounds without contrast</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Recreate or modify the logomark</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BrandVoiceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const voices = [
    { number: '01', title: 'STRAIGHT SHOOTING', desc: 'No corporate fluff. Direct, honest, human.' },
    { number: '02', title: 'WITTY', desc: 'Gen Z energy without trying too hard. Smart humor that lands.' },
    { number: '03', title: 'FORWARD THINKING', desc: 'Always one step ahead, never stuck in "that\'s how it\'s always been."' },
    { number: '04', title: 'PREMIUM CRAFT', desc: 'Attention to detail matters. Visual cohesion is non-negotiable.' },
  ];

  return (
    <section ref={ref} className="py-32 px-8 border-t border-[#d4d4c8]">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="font-accent text-xs uppercase tracking-[0.15em] text-primary mb-4">Brand Voice</p>
          <h2 className="font-accent text-4xl lg:text-6xl font-bold uppercase tracking-tight mb-16">
            HOW WE SOUND
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {voices.map((voice, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index }}
              whileHover={{ x: 8 }}
              className="relative pl-12 group"
            >
              <motion.div
                className="absolute left-0 top-0 font-accent text-4xl font-bold text-primary/30 group-hover:text-primary group-hover:scale-110 transition-all duration-300"
              >
                {voice.number}
              </motion.div>
              <h3 className="font-accent text-xl uppercase mb-2">{voice.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{voice.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-card/80 backdrop-blur-xl border-l-4 border-foreground p-8 grid md:grid-cols-2 gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
            
            <div className="relative z-10">
              <span className="font-accent text-xs uppercase tracking-wider text-primary block mb-2">
                The Old Way
              </span>
              <p className="text-muted-foreground line-through opacity-60">
                ❌ "We leverage synergistic solutions to drive stakeholder engagement."
              </p>
            </div>
            
            <div className="relative z-10">
              <span className="font-accent text-xs uppercase tracking-wider text-secondary block mb-2">
                The Orchestrator Way
              </span>
              <p className="text-foreground font-semibold">
                ✓ "We make campaigns that actually work... and look damn good doing it."
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function TypographySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-32 px-8 bg-muted/10 border-y border-[#d4d4c8]">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="font-accent text-xs uppercase tracking-[0.15em] text-primary mb-4">Typography System</p>
          <h2 className="font-accent text-4xl lg:text-6xl font-bold uppercase tracking-tight mb-4">
            TYPOGRAPHY SYSTEM
          </h2>
          <h3 className="font-serif text-2xl lg:text-4xl italic text-muted-foreground mb-16">
            Three Voices. One Hierarchy.
          </h3>
        </motion.div>

        <div className="space-y-16">
          {/* Playfair Display */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start pb-16 border-b border-[#e0e0d0]"
          >
            <div>
              <div className="flex items-baseline gap-4 flex-wrap mb-4">
                <span className="font-sans text-xl font-bold">Playfair Display</span>
                <span className="font-accent text-sm uppercase tracking-wider text-secondary">
                  The Storyteller
                </span>
              </div>
              <Card className="bg-card/50 backdrop-blur-xl border-border p-6 space-y-3">
                <div>
                  <strong className="text-foreground block mb-1 text-sm">Role</strong>
                  <p className="text-sm text-muted-foreground">Editorial grace, narrative emotion</p>
                </div>
                <div>
                  <strong className="text-foreground block mb-1 text-sm">Usage</strong>
                  <p className="text-sm text-muted-foreground">Subheads, pull quotes, accents</p>
                </div>
                <div>
                  <strong className="text-foreground block mb-1 text-sm">Style</strong>
                  <p className="text-sm text-muted-foreground">Italic for emphasis, Title Case</p>
                </div>
              </Card>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-8"
            >
              <span className="font-accent text-xs uppercase tracking-wider text-muted-foreground block mb-4">
                EXAMPLE
              </span>
              <h4 className="font-serif text-5xl lg:text-6xl font-bold italic leading-tight mb-4">
                Where strategy meets soul
              </h4>
              <p className="font-serif italic text-muted-foreground">"The voice that makes them feel"</p>
            </motion.div>
          </motion.div>

          {/* Big Shoulders Display */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start pb-16 border-b border-[#e0e0d0]"
          >
            <div>
              <div className="flex items-baseline gap-4 flex-wrap mb-4">
                <span className="font-sans text-xl font-bold">Big Shoulders Display</span>
                <span className="font-accent text-sm uppercase tracking-wider text-primary">
                  The Strategist
                </span>
              </div>
              <Card className="bg-card/50 backdrop-blur-xl border-border p-6 space-y-3">
                <div>
                  <strong className="text-foreground block mb-1 text-sm">Role</strong>
                  <p className="text-sm text-muted-foreground">Structural command, architectural presence</p>
                </div>
                <div>
                  <strong className="text-foreground block mb-1 text-sm">Usage</strong>
                  <p className="text-sm text-muted-foreground">Hero titles, navigation, button labels</p>
                </div>
                <div>
                  <strong className="text-foreground block mb-1 text-sm">Style</strong>
                  <p className="text-sm text-muted-foreground">Uppercase, tracking 0.08-0.12em</p>
                </div>
              </Card>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-8"
            >
              <span className="font-accent text-xs uppercase tracking-wider text-muted-foreground block mb-4">
                EXAMPLE
              </span>
              <h4 className="font-accent text-5xl lg:text-7xl font-bold uppercase tracking-tight leading-none mb-4">
                COMMAND PRESENCE
              </h4>
              <p className="font-serif italic text-muted-foreground">"The voice that commands attention and sets direction"</p>
            </motion.div>
          </motion.div>

          {/* Inter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start"
          >
            <div>
              <div className="flex items-baseline gap-4 flex-wrap mb-4">
                <span className="font-sans text-xl font-bold">Inter</span>
                <span className="font-accent text-sm uppercase tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  The Orchestrator
                </span>
              </div>
              <Card className="bg-card/50 backdrop-blur-xl border-border p-6 space-y-3">
                <div>
                  <strong className="text-foreground block mb-1 text-sm">Role</strong>
                  <p className="text-sm text-muted-foreground">Functional clarity, precision</p>
                </div>
                <div>
                  <strong className="text-foreground block mb-1 text-sm">Usage</strong>
                  <p className="text-sm text-muted-foreground">Body text, UI, long-form</p>
                </div>
                <div>
                  <strong className="text-foreground block mb-1 text-sm">Style</strong>
                  <p className="text-sm text-muted-foreground">Sentence case, 1.6 line-height</p>
                </div>
              </Card>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-8"
            >
              <span className="font-accent text-xs uppercase tracking-wider text-muted-foreground block mb-4">
                EXAMPLE
              </span>
              <p className="font-sans text-lg leading-relaxed max-w-2xl mb-4">
                This is the voice of execution. It ensures that the big ideas and emotional narratives are actually 
                readable, usable, and clear. Every brand needs a translator who turns vision into reality.
              </p>
              <p className="font-serif italic text-muted-foreground">"The voice that brings it to life"</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ColorSystemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colors = [
    { name: 'CORAL', hex: '#FF6B7A', role: 'The Strategist', desc: 'Logic & Data. Use for insights and analytical content.', bg: 'bg-[#FF6B7A]' },
    { name: 'TEAL', hex: '#2DD4BF', role: 'The Storyteller', desc: 'Emotion. Use for creative narrative and brand moments.', bg: 'bg-[#2DD4BF]' },
    { name: 'FLOW', hex: 'GRADIENT', role: 'The Orchestrator', desc: 'Integration. The gradient between logic and emotion. Use for CTAs and execution moments.', bg: 'bg-gradient-to-br from-[#FF6B7A] to-[#2DD4BF]', gradient: true },
    { name: 'DEPTH', hex: '#0A0A0A', role: 'Deep Black', desc: 'Structure. The anchor. Commanding presence and clarity.', bg: 'bg-[#0A0A0A]' },
  ];

  const handleCopy = (hex: string, name: string) => {
    if (hex !== 'GRADIENT') {
      navigator.clipboard.writeText(hex);
      setCopiedColor(name);
      setTimeout(() => setCopiedColor(null), 2000);
    }
  };

  return (
    <section ref={ref} className="py-32 px-8 border-t border-[#d4d4c8]">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="font-accent text-xs uppercase tracking-[0.15em] text-primary mb-4">Color System</p>
          <h2 className="font-accent text-4xl lg:text-6xl font-bold uppercase tracking-tight mb-16">
            COLOR TRINITY
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {colors.map((color, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{ y: -8 }}
            >
              <Card className="bg-card border border-[#d4d4c8] overflow-hidden group transition-all duration-500 hover:shadow-2xl rounded-xl">
                <motion.div
                  className={`h-40 ${color.bg} flex items-center justify-center relative cursor-pointer overflow-hidden`}
                  onClick={() => handleCopy(color.hex, color.name)}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.span
                    className={`font-accent text-2xl font-bold ${color.name === 'FLOW' ? 'text-white' : color.name === 'DEPTH' ? 'text-white' : 'text-white'} drop-shadow-lg relative z-10`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {copiedColor === color.name ? 'COPIED!' : color.name}
                  </motion.span>
                  
                  {/* Ripple Effect */}
                  <motion.div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)]"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
                
                <div className="p-6">
                  <span className="font-mono text-xs text-muted-foreground block mb-2">
                    {color.hex}
                  </span>
                  <h3 className={`font-accent text-lg uppercase font-bold mb-2 ${
                    color.name === 'CORAL' ? 'text-[#FF6B7A]' :
                    color.name === 'TEAL' ? 'text-[#2DD4BF]' :
                    color.name === 'FLOW' ? 'bg-gradient-to-r from-[#FF6B7A] to-[#2DD4BF] bg-clip-text text-transparent' :
                    'text-foreground'
                  }`}>
                    {color.role}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {color.desc}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FrameworksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const frameworks = [
    { number: '01', title: 'CAMPAIGN PLANNING', desc: 'Strategist sets goals → Storyteller crafts narrative → Orchestrator executes timeline' },
    { number: '02', title: 'CONTENT CREATION', desc: 'Strategist defines audience → Storyteller writes copy → Orchestrator ensures visual cohesion' },
    { number: '03', title: 'BRAND LAUNCH', desc: 'Strategist positions in market → Storyteller builds world → Orchestrator aligns stakeholders' },
  ];

  return (
    <section ref={ref} className="py-32 px-8 border-t border-[#d4d4c8]">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="font-accent text-xs uppercase tracking-[0.15em] text-primary mb-4">Frameworks Applied</p>
          <h2 className="font-accent text-4xl lg:text-6xl font-bold uppercase tracking-tight mb-16">
            FRAMEWORKS APPLIED
          </h2>
        </motion.div>

        <div className="space-y-8">
          {frameworks.map((framework, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 * index }}
              whileHover={{ x: 8 }}
              className="relative pl-20 border-l-2 border-[#d4d4c8] hover:border-primary transition-all duration-300 group"
            >
              <motion.div
                className="absolute left-[-1.5rem] top-0 w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center font-accent text-xl font-bold text-primary group-hover:bg-primary group-hover:text-background group-hover:scale-110 group-hover:rotate-[5deg] transition-all duration-300"
              >
                {framework.number}
              </motion.div>
              <h3 className="font-accent text-2xl uppercase mb-2">{framework.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{framework.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-32 px-8 overflow-hidden bg-gradient-to-t from-card to-background">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,107,122,0.1)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl lg:text-5xl italic mb-4">
            Ready to see it in action?
          </h2>
          <p className="text-muted-foreground mb-8">View case studies and campaigns</p>
          
          <Button
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 font-accent font-bold text-lg uppercase tracking-wider px-12 py-7 rounded-lg relative overflow-hidden group"
            asChild
          >
            <a href="/#portfolio">
              <span className="relative z-10">Explore Work</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <svg className="ml-3 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
