import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Era {
  id: string;
  title: string;
  years: string;
  tagline: string;
  quote: string;
  description: string;
  achievements: string[];
  color: 'coral' | 'teal' | 'deep-blue';
  image: string;
}

const erasData: Era[] = [
  {
    id: 'genesis',
    title: 'Genesis',
    years: '2000–2003',
    tagline: 'Where it all began',
    quote: 'Every journey begins with a single step into the unknown.',
    description: 'Arrived in the U.S. on a scholarship. Earned my degree. Learned to navigate a new culture while building the foundation for everything that followed. This was the moment that set everything in motion—the decision to leave home, embrace uncertainty, and build something meaningful.',
    achievements: [
      'Completed undergraduate degree on full scholarship',
      'Adapted to new cultural and professional environment',
      'Built foundational skills in communication and strategy',
      'Established work ethic and resilience that defined my career'
    ],
    color: 'coral',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80'
  },
  {
    id: 'emergence',
    title: 'Emergence',
    years: '2003–2007',
    tagline: 'Finding my rhythm in chaos',
    quote: 'In chaos, I found my rhythm.',
    description: 'Joined startups in mobile entertainment. Wore every hat imaginable—from content creation to business development. Learned to move fast, think strategically, and thrive in ambiguity. This was where I discovered my ability to bridge creative vision with business execution.',
    achievements: [
      'Pioneered mobile entertainment content strategies',
      'Managed cross-functional projects in fast-paced startup environments',
      'Developed versatility across creative and business functions',
      'Built network in emerging tech industry'
    ],
    color: 'teal',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80'
  },
  {
    id: 'convergence',
    title: 'Convergence',
    years: '2007–2012',
    tagline: 'When opportunity met preparation',
    quote: 'When opportunity knocked, I answered with everything I had.',
    description: 'Microsoft came calling. Scaled from startup scrappiness to corporate precision. Learned to create campaigns that moved millions while maintaining creative integrity. This was the era of proving that creativity and scale aren\'t mutually exclusive.',
    achievements: [
      'Joined Microsoft as Marketing Manager',
      'Led global campaigns reaching millions of users',
      'Bridged creative vision with corporate strategy',
      'Established reputation for high-impact marketing execution'
    ],
    color: 'deep-blue',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80'
  },
  {
    id: 'foundations',
    title: 'Foundations',
    years: '2012–2014',
    tagline: 'Building my voice',
    quote: 'I found my voice by writing through the noise.',
    description: 'Built editorial muscle through relentless content creation. Established early brand partnerships. Learned that consistency compounds. This was about finding my authentic voice in a crowded digital landscape.',
    achievements: [
      'Developed strong editorial voice and content strategy',
      'Secured early brand partnerships and collaborations',
      'Built consistent publishing rhythm and audience',
      'Refined storytelling craft through daily practice'
    ],
    color: 'coral',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80'
  },
  {
    id: 'ascent',
    title: 'Ascent',
    years: '2014–2016',
    tagline: 'Mastery through practice',
    quote: 'Mastery is earned through deliberate practice.',
    description: 'Refined my craft. Scaled my impact. Deepened my expertise in integrated marketing and creative strategy. This was the era of becoming truly excellent at what I do—not just good, but exceptional.',
    achievements: [
      'Led major integrated marketing campaigns',
      'Expanded skill set across digital and traditional channels',
      'Mentored junior team members',
      'Achieved measurable business results through creative excellence'
    ],
    color: 'teal',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80'
  },
  {
    id: 'expansion',
    title: 'Expansion',
    years: '2016–2018',
    tagline: 'Pushing every boundary',
    quote: 'Growth happens at the edge of comfort.',
    description: 'Pushed creative and technical boundaries. Explored new mediums. Grew as both strategist and maker. This was about refusing to be limited by conventional definitions of what a marketer should be.',
    achievements: [
      'Expanded into new creative mediums and technologies',
      'Led innovation initiatives within marketing organization',
      'Built cross-disciplinary expertise',
      'Delivered award-worthy campaign work'
    ],
    color: 'deep-blue',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80'
  },
  {
    id: 'disruption',
    title: 'Disruption',
    years: '2019–2020',
    tagline: 'Breaking to rebuild',
    quote: 'Sometimes you have to break to rebuild stronger.',
    description: 'Faced professional setbacks. Questioned everything. Used the pause to regenerate my approach and clarify my values. This was the hardest chapter—but also the most transformative.',
    achievements: [
      'Navigated career transition with resilience',
      'Reassessed professional priorities and values',
      'Developed new strategic frameworks',
      'Emerged with clearer sense of purpose'
    ],
    color: 'coral',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80'
  },
  {
    id: 'reinvention',
    title: 'Reinvention',
    years: '2020–2022',
    tagline: 'Forging new identity',
    quote: 'Identity is not found—it is forged.',
    description: 'Integrated new identity. Clarified my values. Built systems that reflected who I had become, not who I was. This was about intentional transformation—choosing who I wanted to be.',
    achievements: [
      'Launched independent consulting practice',
      'Developed proprietary frameworks and methodologies',
      'Built personal brand ecosystem',
      'Established thought leadership in strategic design'
    ],
    color: 'teal',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80'
  },
  {
    id: 'integration',
    title: 'Integration',
    years: '2022–Present',
    tagline: 'Building with intention',
    quote: 'The future is built by those who show up with intention.',
    description: 'Merged 25 years of experience with clear intention. Building AI-powered tools. Consulting with purpose. Creating with impact. This is where everything converges—past experience, present capability, future vision.',
    achievements: [
      'Integrated AI into consulting practice',
      'Launched The Hub (productized consulting tools)',
      'Established Insights (editorial platform)',
      'Built comprehensive portfolio ecosystem'
    ],
    color: 'deep-blue',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80'
  }
];

export function TimelinePage() {
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <>
      <div ref={containerRef} className="relative">
        {/* Fixed Progress Line */}
        <motion.div 
          className="fixed left-8 top-28 bottom-8 w-0.5 bg-border z-40 hidden lg:block"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]) }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary to-secondary origin-top"
            style={{ scaleY: scrollYProgress }}
          />
        </motion.div>

        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center px-8 pt-28 pb-16 relative overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                               linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} />
          </div>

          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="inline-block mb-8"
              >
                <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                  2000 — Present
                </div>
                <h1 className="text-h1 font-serif font-bold leading-none mb-6">
                  My Journey<span className="text-primary">.</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-h4 font-serif italic text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                From Venezuela to Seattle. From scholarship student to strategic marketing leader. 
                From mobile entertainment pioneer to AI-powered consultant.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  onClick={() => {
                    document.getElementById('timeline-start')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-normal text-base px-8 py-6 rounded-lg group"
                >
                  Explore the timeline
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Timeline Eras */}
        <div id="timeline-start" className="relative">
          {erasData.map((era, index) => (
            <EraSection
              key={era.id}
              era={era}
              index={index}
              onSelect={() => setSelectedEra(era)}
            />
          ))}
        </div>

        {/* Closing Section */}
        <section className="min-h-[60vh] flex items-center justify-center px-8 py-32 relative">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-h2 font-serif font-bold mb-6">
                What's next?
              </h2>
              <p className="text-body-large text-muted-foreground leading-loose mb-8">
                This journey continues. Every project, every challenge, every collaboration 
                adds another chapter to this story.
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-normal text-base px-8 py-6 rounded-lg"
                asChild
              >
                <a href="/">
                  Back to Portfolio
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Era Detail Modal */}
      <AnimatePresence>
        {selectedEra && (
          <EraModal era={selectedEra} onClose={() => setSelectedEra(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

interface EraSectionProps {
  era: Era;
  index: number;
  onSelect: () => void;
}

function EraSection({ era, index, onSelect }: EraSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  const isEven = index % 2 === 0;

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity }}
      className="min-h-screen flex items-center py-32 px-8 relative"
    >
      <div className="container mx-auto max-w-7xl">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}>
          {/* Image Side */}
          <motion.div
            style={{ scale }}
            className={`relative ${isEven ? '' : 'lg:col-start-2'}`}
          >
            <motion.div
              className="relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              onClick={onSelect}
            >
              <motion.img
                src={era.image}
                alt={era.title}
                className="w-full h-full object-cover"
                style={{ y: imageY }}
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${
                era.color === 'coral' ? 'from-primary/80' :
                era.color === 'teal' ? 'from-secondary/80' :
                'from-deep-blue/80'
              } via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Hover CTA */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="bg-white dark:bg-card px-6 py-3 rounded-full font-semibold text-foreground shadow-2xl transform group-hover:scale-110 transition-transform">
                  Explore Era →
                </div>
              </div>

              {/* Year Badge */}
              <div className="absolute top-6 left-6 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-sm font-bold text-foreground">{era.years}</span>
              </div>
            </motion.div>

            {/* Decorative Element */}
            <motion.div
              className={`absolute -z-10 w-full h-full rounded-3xl ${
                era.color === 'coral' ? 'bg-primary/10' :
                era.color === 'teal' ? 'bg-secondary/10' :
                'bg-deep-blue/10'
              }`}
              style={{
                top: '2rem',
                left: isEven ? '2rem' : '-2rem',
              }}
            />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className={isEven ? '' : 'lg:col-start-1 lg:row-start-1'}
          >
            {/* Era Number */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-accent text-2xl font-bold ${
                era.color === 'coral' ? 'bg-primary text-primary-foreground' :
                era.color === 'teal' ? 'bg-secondary text-secondary-foreground' :
                'bg-deep-blue text-white'
              }`}>
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>

            <h2 className="text-h2 font-serif font-bold mb-4 leading-tight">
              {era.title}
            </h2>
            
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {era.tagline}
            </p>

            <blockquote className="border-l-4 border-primary pl-6 mb-8">
              <p className="text-body-large font-serif italic text-muted-foreground leading-loose">
                "{era.quote}"
              </p>
            </blockquote>

            <p className="text-body text-muted-foreground leading-loose mb-8">
              {era.description}
            </p>

            <Button
              onClick={onSelect}
              variant="outline"
              className="group"
            >
              View Full Story
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Section Divider */}
      {index < erasData.length - 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      )}
    </motion.section>
  );
}

interface EraModalProps {
  era: Era;
  onClose: () => void;
}

function EraModal({ era, onClose }: EraModalProps) {
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative z-10 bg-background border border-border rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Image Side */}
        <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
          <img
            src={era.image}
            alt={era.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r ${
            era.color === 'coral' ? 'from-primary/60' :
            era.color === 'teal' ? 'from-secondary/60' :
            'from-deep-blue/60'
          } to-transparent`} />
          
          {/* Year Badge */}
          <div className="absolute top-6 left-6 bg-background/90 backdrop-blur-sm px-6 py-3 rounded-full">
            <span className="text-lg font-bold text-foreground">{era.years}</span>
          </div>
        </div>

        {/* Content Side */}
        <div className="lg:w-1/2 overflow-y-auto p-8 lg:p-12">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${
            era.color === 'coral' ? 'bg-primary/10 text-primary' :
            era.color === 'teal' ? 'bg-secondary/10 text-secondary' :
            'bg-deep-blue/10 text-deep-blue'
          }`}>
            {era.tagline}
          </div>

          <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight">
            {era.title}
          </h2>

          <blockquote className="border-l-4 border-primary pl-6 mb-8">
            <p className="text-xl font-serif italic text-muted-foreground leading-relaxed">
              "{era.quote}"
            </p>
          </blockquote>

          <p className="text-body-large text-muted-foreground leading-loose mb-10">
            {era.description}
          </p>

          <div>
            <h4 className="text-xl font-serif font-semibold mb-6 flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${
                era.color === 'coral' ? 'bg-primary' :
                era.color === 'teal' ? 'bg-secondary' :
                'bg-deep-blue'
              }`} />
              Key Achievements
            </h4>
            <ul className="space-y-4">
              {era.achievements.map((achievement, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 text-muted-foreground group"
                >
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    era.color === 'coral' ? 'bg-primary' :
                    era.color === 'teal' ? 'bg-secondary' :
                    'bg-deep-blue'
                  } group-hover:scale-150 transition-transform`} />
                  <span className="leading-relaxed">{achievement}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
