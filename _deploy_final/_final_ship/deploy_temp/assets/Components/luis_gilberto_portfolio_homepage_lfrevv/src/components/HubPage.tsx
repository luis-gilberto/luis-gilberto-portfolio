import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Check, Telescope, Compass, Crown, Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function HubPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <div ref={containerRef} className="relative bg-background min-h-screen overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 pt-20 pb-20 overflow-hidden">
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute inset-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <img 
              src="https://c.animaapp.com/miw6zgdna5SIGT/img/strategyiq_assessments_hero_2.jpeg" 
              alt="Intelligence Score Dashboard" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Sophisticated Overlay System */}
          <div className="absolute inset-0 bg-background/80 dark:bg-[#0A0A0A]/70 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_80%)]" />
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-accent text-5xl lg:text-7xl font-bold uppercase tracking-tight leading-[0.95] mb-8 drop-shadow-2xl">
              INTELLIGENCE<br />
              <span className="bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent animate-gradient-x">
                OVER INTUITION.
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 text-balance font-medium">
              Most agencies guess. We diagnose. <span className="text-foreground font-semibold">StrategyIQ™</span> is the proprietary 
              intelligence engine that benchmarks your brand maturity before we 
              build a single asset.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Button 
                size="lg" 
                className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-accent font-bold text-lg uppercase tracking-wider rounded-full shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.6)] transition-all duration-300 hover:-translate-y-1"
              >
                REQUEST ACCESS
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-12 px-8 border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md font-accent font-bold text-lg uppercase tracking-wider rounded-full transition-all duration-300 hover:-translate-y-1"
              >
                See the Deliverable
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-foreground to-transparent" />
        </motion.div>
      </section>

      {/* Expertise Cards */}
      <section className="py-32 px-8 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            <ExpertiseCard 
              title="GO-TO-MARKET"
              description="We scan the horizon to identify white space and define the perfect entry point. No blind launches."
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
              icon={<Telescope className="w-8 h-8 text-primary drop-shadow-lg" strokeWidth={1.5} />}
            />
            <ExpertiseCard 
              title="BRAND INTELLIGENCE"
              description="True North calibration. Ensuring voice, values, and visuals point exactly at your Ideal Customer Profile."
              image="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80"
              icon={<Compass className="w-8 h-8 text-primary drop-shadow-lg" strokeWidth={1.5} />}
            />
            <ExpertiseCard 
              title="STRATEGIC CAMPAIGNS"
              description="Marketing is a game of position. We map every move to ensure maximum impact."
              image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
              icon={<Crown className="w-8 h-8 text-primary drop-shadow-lg" strokeWidth={1.5} />}
            />
            <ExpertiseCard 
              title="CREATIVE STRATEGY"
              description="The fundamental building block. Scalable design systems that release massive energy when deployed."
              image="https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80"
              icon={<Atom className="w-8 h-8 text-primary drop-shadow-lg" strokeWidth={1.5} />}
            />
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-32 px-8 bg-card/30 border-t border-border/50 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-accent text-5xl lg:text-7xl font-bold uppercase tracking-tight leading-[0.9] mb-8">
                DON'T JUST GET A<br />
                QUOTE.<br />
                <span className="text-primary">GET A ROADMAP.</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
                Whether you hire us or not, you walk away with a comprehensive 
                roadmap outlining your Market Score, Critical Gaps, and Estimated 
                Investment.
              </p>

              <ul className="space-y-6 mb-12">
                {[
                  'Detailed Competitive Analysis',
                  'Brand Maturity Scorecard',
                  'Phased Execution Plan'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-foreground font-medium text-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Check className="w-4 h-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-normal text-base px-8 py-6 rounded-full group relative overflow-hidden"
                asChild
              >
                <a href="/contact">
                  <span className="relative z-10">Start Your Assessment</span>
                  <ArrowRight className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </a>
              </Button>
            </motion.div>

            {/* Right Visual - Strategic Brief */}
            <motion.div
              initial={{ opacity: 0, x: 30, rotate: 5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
                <img 
                  src="https://c.animaapp.com/miw6zgdna5SIGT/img/strategicbrief.jpeg" 
                  alt="Strategic Brief" 
                  className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 blur-[50px] rounded-full pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}

interface ExpertiseCardProps {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

function ExpertiseCard({ title, description, image, icon }: ExpertiseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group relative h-[360px] overflow-hidden border-white/10 bg-[#0A0A0A] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-30 group-hover:opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full p-10 flex flex-col justify-between z-10">
          {/* Top Icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md p-3 group-hover:bg-white/10 group-hover:border-primary/30 transition-all duration-500">
            {icon}
          </div>

          <div>
            <h3 className="font-accent text-3xl font-bold uppercase tracking-wide mb-4 text-white group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            
            <p className="text-white/60 leading-relaxed text-base max-w-md group-hover:text-white/90 transition-colors duration-300">
              {description}
            </p>
          </div>
          
          {/* Decorative Corner */}
          <div className="absolute top-6 right-6 w-20 h-20 border-t-2 border-r-2 border-white/5 rounded-tr-3xl group-hover:border-primary/30 transition-colors duration-500" />
        </div>
      </Card>
    </motion.div>
  );
}
