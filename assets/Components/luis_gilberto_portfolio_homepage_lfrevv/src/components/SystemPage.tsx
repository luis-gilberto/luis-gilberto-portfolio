import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Layers, Lightbulb, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function SystemPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <div ref={containerRef} className="relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-50">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, hsl(var(--secondary) / 0.05) 0%, transparent 50%)
            `,
          }}
          animate={{
            transform: ['translate(0, 0) rotate(0deg)', 'translate(2%, -2%) rotate(1deg)', 'translate(-2%, 2%) rotate(-1deg)', 'translate(0, 0) rotate(0deg)'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating Geometric Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-30">
        <motion.div
          className="absolute w-[300px] h-[300px] border border-border rounded-full top-[15%] left-[5%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        />
        <motion.div
          className="absolute w-[200px] h-[200px] border border-border rotate-45 bottom-[20%] right-[10%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1.5 }}
        />
        <motion.div
          className="absolute w-[150px] h-[150px] border border-primary/20 rounded-full top-[60%] left-[15%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1.5 }}
        />
        <motion.div
          className="absolute w-[100px] h-[100px] border border-secondary/15 rotate-[15deg] top-[25%] right-[20%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1.5 }}
        />
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Manifesto Section */}
      <ManifestoSection />

      {/* Four Pillars Section */}
      <PillarsSection />

      {/* Journey Section */}
      <JourneySection />

      {/* Value Proposition Section */}
      <ValueSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8 pt-28 pb-16 overflow-hidden">
      <div className="container mx-auto max-w-5xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-8"
        >
          <div className="w-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          The Owner's Manual
          <div className="w-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-h1 font-serif font-normal leading-[0.95] tracking-tight mb-6"
        >
          The <span className="text-primary italic">System</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-body-large text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Intelligence over intuition. A strategic framework built on 15 years of transforming 
          complexity into clarity; one decision at a time.
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Explore
          </span>
          <div className="relative w-px h-16 bg-gradient-to-b from-primary to-transparent overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-[30%] bg-primary"
              animate={{ y: ['0%', '300%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-32 px-8 relative">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <blockquote className="relative pl-8 mb-8">
            <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
            <p className="text-h3 font-serif font-normal leading-tight tracking-tight text-foreground">
              Traditional consulting sells you opinions dressed as strategy. This system is different—it&apos;s 
              built on <span className="text-primary">repeatable frameworks</span>, validated by data, 
              and refined through thousands of real decisions.
            </p>
          </blockquote>
          <p className="text-body-large text-muted-foreground leading-loose max-w-3xl">
            Every component serves a purpose. Every touchpoint tells a story. This isn&apos;t a portfolio 
            of services: it&apos;s an integrated ecosystem designed to meet you exactly where you are and 
            guide you precisely where you need to go.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function PillarsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const pillars = [
    {
      number: '01',
      name: 'The Portfolio',
      tagline: 'The Archive of Proof',
      description: "What I've built. Case studies, timelines, and the lived experience that formed this methodology. From early startup ventures to Microsoft's biggest launches; every project shaped the system you see today.",
      icon: Layers,
      link: '/',
    },
    {
      number: '02',
      name: 'The Hub',
      tagline: 'The Service Engine',
      description: "How we work. Structured, productized frameworks designed for clarity and results. Advisory for leadership, Integrated Marketing Communications (IMC) for full-service execution, and proprietary tools like ScopeIQ and StrategyIQ that turn ambiguity into action.",
      icon: Sparkles,
      link: '/TheHub/',
    },
    {
      number: '03',
      name: 'Insights',
      tagline: 'The Real-Time Lab',
      description: "How I think. An editorial platform where strategy, AI, and culture intersect. Not thought leadership for its own sake: but a living record of perspectives that shape how we approach every engagement.",
      icon: Lightbulb,
      link: '/insights/',
    },
    {
      number: '04',
      name: 'The Portal',
      tagline: 'The Command Center',
      description: 'The secure workspace. Where strategy becomes execution through real-time collaboration, asset libraries, and project tracking. Your single source of truth from kickoff to completion.',
      icon: Lock,
      link: 'https://portal.luis-gilberto.com',
    },
  ];

  return (
    <section ref={ref} className="py-32 px-8 relative">
      {/* Decorative Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-border" />

      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-6"
          >
            The Architecture
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-h2 font-serif font-normal leading-tight tracking-tight mb-6"
          >
            Four Pillars,<br />One System
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body-large text-muted-foreground leading-relaxed"
          >
            Each component serves a distinct function while reinforcing the whole. Together, 
            they create a complete infrastructure for strategic growth.
          </motion.p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.number} pillar={pillar} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface PillarCardProps {
  pillar: {
    number: string;
    name: string;
    tagline: string;
    description: string;
    icon: any;
    link: string;
  };
  index: number;
  isInView: boolean;
}

function PillarCard({ pillar, index, isInView }: PillarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="relative bg-card/50 backdrop-blur-xl border-border p-12 h-full group hover:border-primary/30 transition-all duration-500 overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Number */}
        <div className="text-6xl font-serif font-normal text-border mb-6 group-hover:text-primary transition-colors duration-500">
          {pillar.number}
        </div>

        {/* Content */}
        <h3 className="text-2xl font-serif font-medium mb-2 tracking-tight">
          {pillar.name}
        </h3>
        <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-6">
          {pillar.tagline}
        </div>
        <p className="text-body text-muted-foreground leading-relaxed mb-8">
          {pillar.description}
        </p>

        {/* Icon */}
        <div className="absolute bottom-8 right-8 opacity-15 group-hover:opacity-40 transition-opacity duration-500">
          <pillar.icon className="w-12 h-12" strokeWidth={1.5} />
        </div>

        {/* Hover Link */}
        <a
          href={pillar.link}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        >
          Explore
          <ArrowRight className="w-4 h-4" />
        </a>
      </Card>
    </motion.div>
  );
}

function JourneySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const steps = [
    {
      number: '1',
      title: 'Diagnostic',
      tag: 'ScopeIQ',
      description: 'Find your gap. Take the self-assessment to reveal where you stand. Discover where the opportunities hide.',
      link: '/TheHub/scopeiq.html',
      linkText: 'Start Assessment',
    },
    {
      number: '2',
      title: 'Calibration',
      tag: 'StrategyIQ',
      description: 'Build the plan. A strategic consultation that transforms diagnosis into a concrete roadmap.',
      link: 'https://portal.luis-gilberto.com',
      linkText: 'Access Portal',
    },
    {
      number: '3',
      title: 'Implementation & Build',
      tag: 'IMC / Advisory',
      description: 'The core build phase. We finalize assets, optimize systems, and establish governance, moving from roadmap to fully defined assets.',
      link: '/TheHub/',
      linkText: 'Explore Services',
    },
    {
      number: '4',
      title: 'Delivery & Scale',
      tag: 'Launch & Optimization',
      description: 'The final phase: deployment, performance tracking, live optimization, and establishing a continuous improvement loop for long-term growth.',
      link: '/myexperience.html#featured-work-anchor',
      linkText: 'View Results',
    },
  ];

  return (
    <section ref={ref} className="py-32 px-8 relative bg-muted/10">
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-6"
          >
            The Path Forward
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-h2 font-serif font-normal leading-tight tracking-tight mb-6"
          >
            Where Do I Start?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body-large text-muted-foreground"
          >
            Four steps. One clear path.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-7 top-14 bottom-14 w-px bg-gradient-to-b from-primary to-secondary opacity-30 hidden md:block" />

          <div className="space-y-0">
            {steps.map((step, index) => (
              <StepCard key={step.number} step={step} index={index} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface StepCardProps {
  step: {
    number: string;
    title: string;
    tag: string;
    description: string;
    link: string;
    linkText: string;
  };
  index: number;
  isInView: boolean;
}

function StepCard({ step, index, isInView }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-8 py-8 group"
    >
      {/* Number Circle */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-14 h-14 rounded-full border-2 border-border bg-background flex items-center justify-center font-serif text-xl font-medium text-muted-foreground group-hover:border-primary group-hover:text-primary transition-all duration-500">
          {step.number}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <div className="flex items-baseline gap-4 flex-wrap mb-2">
          <h3 className="text-xl font-serif font-medium">
            {step.title}
          </h3>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            {step.tag}
          </span>
        </div>
        <p className="text-body text-muted-foreground leading-relaxed mb-4">
          {step.description}
        </p>
        <a
          href={step.link}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all"
        >
          {step.linkText}
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}

function ValueSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-32 px-8 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,hsl(var(--primary)/0.15)_0%,transparent_50%),radial-gradient(ellipse_at_80%_50%,hsl(var(--secondary)/0.1)_0%,transparent_50%)]" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 bg-card/50 backdrop-blur-xl border border-border rounded-full px-6 py-3 mb-8"
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            The Philosophy
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-h2 font-serif font-normal leading-tight tracking-tight mb-8"
        >
          Intelligence Over<br />
          <span className="text-primary italic">Intuition</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-body-large text-muted-foreground leading-loose max-w-2xl mx-auto mb-12"
        >
          Most consultants sell you their opinions. This system is built on data, validated by results, 
          and refined through 15 years of decisions at the highest level. No guesswork. No gut feelings. 
          Just frameworks that work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-normal text-base px-8 py-6 rounded-full group relative overflow-hidden"
            asChild
          >
            <a href="/TheHub/scopeiq.html">
              <span className="relative z-10">Start Your Assessment</span>
              <ArrowRight className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
