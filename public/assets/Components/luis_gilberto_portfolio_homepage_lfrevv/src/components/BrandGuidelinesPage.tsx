import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function BrandGuidelinesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const [selectedPerspective, setSelectedPerspective] = useState<string | null>(null);

  return (
    <>
      <div ref={containerRef} className="relative">
        {/* Animated Background Pattern */}
        <div className="fixed inset-0 opacity-[0.03] dark:opacity-[0.08] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(hsl(var(--secondary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
            backgroundPosition: '0 0, 0 0, 0 0, 0 0'
          }} />
        </div>

        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center px-8 pt-28 pb-16 relative">
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-12"
              >
                <h1 className="font-accent text-6xl lg:text-8xl font-bold uppercase tracking-tight mb-6 text-foreground">
                  The Orchestrator
                </h1>
                <p className="text-h3 font-serif italic mb-8">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Three Perspectives. One Vision.
                  </span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="max-w-3xl mx-auto"
              >
                <Card className="bg-card/50 backdrop-blur-xl border-border p-8 lg:p-12">
                  <p className="text-body-large text-muted-foreground leading-loose">
                    A single source of truth that orchestrates strategy, craft, and clarity: 
                    the three lenses that transform complexity into coherent, compelling experiences.
                  </p>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Trinity Framework */}
        <section className="py-32 px-8 relative">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16 border-l-4 border-primary pl-8"
            >
              <h2 className="font-accent text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-4 text-foreground">
                The Trinity Framework
              </h2>
              <p className="text-xl font-serif italic text-muted-foreground">
                Three Perspectives Working in Concert
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <PerspectiveCard
                perspective="storyteller"
                eyebrow="The Storyteller = The Systems Thinker"
                title="Strategic vision, emotional intelligence"
                color="Coral"
                colorClass="primary"
                question="Where are we going and why does it matter?"
                onClick={() => setSelectedPerspective('storyteller')}
              />
              <PerspectiveCard
                perspective="architect"
                eyebrow="The Architect = The Curator"
                title="Detail-oriented, structural precision"
                color="Teal"
                colorClass="secondary"
                question="How do we craft this with excellence?"
                onClick={() => setSelectedPerspective('architect')}
              />
              <PerspectiveCard
                perspective="translator"
                eyebrow="The Translator = The Bridge Builder"
                title="Connects opposites, makes complexity simple"
                color="Cloud Dancer"
                colorClass="foreground"
                question="How do I make this work for everyone?"
                onClick={() => setSelectedPerspective('translator')}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-card/50 backdrop-blur-xl border-l-4 border-primary p-8">
                <p className="text-body-large font-serif italic text-muted-foreground leading-loose">
                  "This trinity isn't theoretical; it's how I actually work. Strategy without craft is vaporware. 
                  Craft without translation is inaccessible. Translation without strategy is shallow. You need all three."
                </p>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Typography System */}
        <section className="py-32 px-8 relative bg-muted/20">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="font-accent text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-4 text-foreground">
                Typography
              </h2>
              <p className="text-xl font-serif italic text-muted-foreground max-w-3xl">
                Each typeface embodies one of the three perspectives. Together, they create a complete 
                visual language that can shift between strategy, craft, and clarity.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <TypeCard
                label="The Storyteller"
                name="Playfair Display"
                role="Embodies the Systems Thinker"
                demoType="playfair"
              />
              <TypeCard
                label="The Architect"
                name="Big Shoulders Display"
                role="Embodies the Curator"
                demoType="shoulders"
              />
              <TypeCard
                label="The Translator"
                name="Inter"
                role="Embodies the Bridge Builder"
                demoType="inter"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card/50 backdrop-blur-xl border-l-4 border-primary p-8">
                <p className="text-body-large font-serif italic text-muted-foreground leading-loose">
                  "This isn't indecision. This is orchestration. Every typeface has a purpose. 
                  Every moment has a perspective."
                </p>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Color System */}
        <section className="py-32 px-8 relative">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="font-accent text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-4 text-foreground">
                Color System
              </h2>
              <p className="text-xl font-serif italic text-muted-foreground">
                Each primary color maps to a perspective
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ColorCard
                hex="#F96F6E"
                name="Coral"
                perspective="The Storyteller"
                description="Strategic resonance and editorial warmth"
                color="coral"
              />
              <ColorCard
                hex="#2ED3C6"
                name="Teal"
                perspective="The Architect"
                description="Structural clarity and design precision"
                color="teal"
              />
              <ColorCard
                hex="#F7F5F2"
                name="Cloud Dancer"
                perspective="The Translator"
                description="Accessible neutrality and compositional balance"
                color="cloud"
              />
              <ColorCard
                hex="GRADIENT"
                name="Convergence"
                perspective="Where perspectives converge"
                description="The intersection of all three lenses"
                color="gradient"
              />
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-32 px-8 relative bg-muted/20">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="bg-card/50 backdrop-blur-xl p-10 h-full">
                  <h3 className="font-accent text-3xl font-bold uppercase tracking-tight mb-4 text-foreground">
                    Philosophy
                  </h3>
                  <p className="text-sm font-serif italic text-muted-foreground mb-6">
                    Mission
                  </p>
                  <p className="text-body text-muted-foreground leading-loose">
                    To bridge the gap between creative vision and business impact through three integrated 
                    perspectives: strategic thinking that sees the whole, precise craft that builds excellence, 
                    and human translation that makes complexity accessible.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="bg-card/50 backdrop-blur-xl p-10 h-full">
                  <p className="text-sm font-serif italic text-muted-foreground mb-6">
                    Core Values
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-2 rounded-full border border-primary text-primary text-sm font-medium">
                      Integration
                    </span>
                    <span className="px-4 py-2 rounded-full border border-secondary text-secondary text-sm font-medium">
                      Excellence
                    </span>
                    <span className="px-4 py-2 rounded-full border border-border text-foreground text-sm font-medium">
                      Clarity
                    </span>
                    <span className="px-4 py-2 rounded-full border border-border text-foreground text-sm font-medium">
                      Impact
                    </span>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">→</span>
                      <span>Three perspectives working as one</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-secondary mt-1">→</span>
                      <span>Commitment to quality in every detail</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">→</span>
                      <span>Making complexity accessible</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-secondary mt-1">→</span>
                      <span>Delivering measurable results</span>
                    </li>
                  </ul>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-32 px-8 relative">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-h2 font-serif font-bold mb-6">
                Ready to see it in action?
              </h2>
              <p className="text-body-large text-muted-foreground leading-loose mb-8">
                These aren't just guidelines—they're the DNA of every project I touch.
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-normal text-base px-8 py-6 rounded-lg"
                asChild
              >
                <a href="/">
                  Explore Portfolio
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Perspective Detail Modal */}
      <AnimatePresence>
        {selectedPerspective && (
          <PerspectiveModal
            perspective={selectedPerspective}
            onClose={() => setSelectedPerspective(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface PerspectiveCardProps {
  perspective: string;
  eyebrow: string;
  title: string;
  color: string;
  colorClass: string;
  question: string;
  onClick: () => void;
}

function PerspectiveCard({ eyebrow, title, color, colorClass, question, onClick }: PerspectiveCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="bg-card/50 backdrop-blur-xl p-8 h-full cursor-pointer group hover:border-primary transition-all"
        onClick={onClick}
      >
        <div className="text-xs font-accent uppercase tracking-wider text-muted-foreground mb-4">
          {eyebrow}
        </div>
        <h3 className={`text-2xl font-serif font-semibold mb-2 text-${colorClass}`}>
          {title}
        </h3>
        <div className="text-sm text-muted-foreground mb-6">{color}</div>
        <div className="text-body text-foreground">
          <strong>Guiding Question:</strong> "{question}"
        </div>
        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm text-primary font-medium">
            Learn more →
          </span>
        </div>
      </Card>
    </motion.div>
  );
}

interface TypeCardProps {
  label: string;
  name: string;
  role: string;
  demoType: 'playfair' | 'shoulders' | 'inter';
}

function TypeCard({ label, name, role, demoType }: TypeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      <Card className="bg-card backdrop-blur-xl p-8 h-full">
        <div className="border-b border-border pb-6 mb-6">
          <div className="text-xs font-accent uppercase tracking-wider text-primary mb-2">
            {label}
          </div>
          <h3 className="text-xl font-serif font-semibold mb-1 text-foreground">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>

        <div className="min-h-[200px] flex flex-col justify-center gap-4">
          {demoType === 'playfair' && (
            <>
              <h4 className="font-serif text-4xl font-bold leading-tight text-foreground">
                Editorial voice with strategic resonance
              </h4>
              <p className="font-serif italic text-lg text-muted-foreground leading-relaxed">
                Narrative depth meets business clarity
              </p>
            </>
          )}
          {demoType === 'shoulders' && (
            <>
              <h4 className="font-accent text-4xl font-bold uppercase tracking-tight leading-none text-foreground">
                Architectural Clarity
              </h4>
              <p className="font-accent text-base font-bold uppercase tracking-wide text-primary">
                Structural Emphasis
              </p>
            </>
          )}
          {demoType === 'inter' && (
            <>
              <h4 className="font-sans text-2xl font-semibold leading-tight text-foreground">
                Readable, inclusive, and precise
              </h4>
              <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-[40ch]">
                The universal translator that makes complex ideas accessible to everyone, 
                everywhere.
              </p>
            </>
          )}
        </div>

        <div className="border-t border-border pt-6 mt-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Usage:</strong>{' '}
            {demoType === 'playfair' && 'Headlines, quotes, editorial moments'}
            {demoType === 'shoulders' && 'Section headers, emphasis, architectural statements'}
            {demoType === 'inter' && 'Body copy, UI elements, data presentation'}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

interface ColorCardProps {
  hex: string;
  name: string;
  perspective: string;
  description: string;
  color: 'coral' | 'teal' | 'cloud' | 'gradient';
}

function ColorCard({ hex, name, perspective, description, color }: ColorCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (hex !== 'GRADIENT') {
      navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const bgClass = 
    color === 'coral' ? 'bg-primary' :
    color === 'teal' ? 'bg-secondary' :
    color === 'cloud' ? 'bg-cloud-dancer' :
    'bg-gradient-to-br from-primary to-secondary';

  const textClass = color === 'cloud' ? 'text-foreground' : 'text-white';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      <Card className="bg-card backdrop-blur-xl overflow-hidden group">
        <div
          className={`h-32 ${bgClass} flex items-center justify-center relative cursor-pointer`}
          onClick={handleCopy}
        >
          <span className={`text-2xl font-bold tracking-wider ${textClass} ${
            color === 'cloud' ? '' : 'drop-shadow-lg'
          }`}>
            {hex}
          </span>
          {hex !== 'GRADIENT' && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              {copied ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                <Copy className="w-6 h-6 text-white" />
              )}
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className={`text-xl font-serif font-semibold mb-1 ${
            color === 'coral' ? 'text-primary' :
            color === 'teal' ? 'text-secondary' :
            'text-foreground'
          }`}>
            {name} → {perspective}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

interface PerspectiveModalProps {
  perspective: string;
  onClose: () => void;
}

const perspectiveDetails = {
  storyteller: {
    title: 'The Storyteller',
    subtitle: 'The Systems Thinker',
    color: 'primary',
    description: 'This is the strategic lens—the one that asks why does this matter and where are we going. It\'s about seeing the whole system, understanding emotional resonance, and crafting narratives that move people. This perspective uses Playfair Display and Coral to signal depth, warmth, and strategic intent.',
    characteristics: [
      'Sees the big picture and long-term vision',
      'Understands emotional drivers and human motivation',
      'Crafts compelling narratives that resonate',
      'Connects strategy to measurable outcomes'
    ]
  },
  architect: {
    title: 'The Architect',
    subtitle: 'The Curator',
    color: 'secondary',
    description: 'This is the craft lens—the one that obsesses over details, structure, and execution. It\'s about building with precision, curating with intention, and ensuring every element serves a purpose. This perspective uses Big Shoulders Display and Teal to signal strength, clarity, and structural integrity.',
    characteristics: [
      'Obsesses over details and execution quality',
      'Builds systems with structural integrity',
      'Curates experiences with intentional design',
      'Ensures consistency across all touchpoints'
    ]
  },
  translator: {
    title: 'The Translator',
    subtitle: 'The Bridge Builder',
    color: 'foreground',
    description: 'This is the clarity lens—the one that makes complexity accessible. It\'s about connecting opposites, bridging gaps, and ensuring everyone can understand and engage. This perspective uses Inter and Cloud Dancer to signal inclusivity, readability, and universal accessibility.',
    characteristics: [
      'Makes complex ideas simple and accessible',
      'Bridges technical and non-technical audiences',
      'Ensures inclusive and clear communication',
      'Connects strategy and craft to real-world impact'
    ]
  }
};

function PerspectiveModal({ perspective, onClose }: PerspectiveModalProps) {
  const details = perspectiveDetails[perspective as keyof typeof perspectiveDetails];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative z-10 bg-background border border-border rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 lg:p-12"
      >
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${
          details.color === 'primary' ? 'bg-primary/10 text-primary' :
          details.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
          'bg-muted text-foreground'
        }`}>
          {details.subtitle}
        </div>

        <h2 className="text-5xl font-accent font-bold uppercase tracking-tight mb-8 text-foreground">
          {details.title}
        </h2>

        <p className="text-body-large text-muted-foreground leading-loose mb-10">
          {details.description}
        </p>

        <div>
          <h4 className="text-xl font-serif font-semibold mb-6 flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${
              details.color === 'primary' ? 'bg-primary' :
              details.color === 'secondary' ? 'bg-secondary' :
              'bg-foreground'
            }`} />
            Key Characteristics
          </h4>
          <ul className="space-y-4">
            {details.characteristics.map((char, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 text-muted-foreground"
              >
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  details.color === 'primary' ? 'bg-primary' :
                  details.color === 'secondary' ? 'bg-secondary' :
                  'bg-foreground'
                }`} />
                <span className="leading-relaxed">{char}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}
