import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Clock, User, FileText, Palette, Lightbulb, Grid3x3, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TourCard {
  id: number;
  title: string;
  description: string;
  image: string;
  color: string;
  icon: any;
  link: string;
  category: 'past-present' | 'present-future';
}

export function QuickTourSection() {
  const initialCards: TourCard[] = [
    {
      id: 1,
      title: 'Timeline',
      description: 'A chronological journey through my career from 2008 to today—strategic decisions, campaigns, and creative evolution.',
      image: 'https://c.animaapp.com/miw6zgdna5SIGT/img/timeline.jpg',
      color: 'bg-primary',
      icon: Clock,
      link: '/timeline',
      category: 'past-present',
    },
    {
      id: 2,
      title: 'About Me',
      description: 'The human behind the work—my story, values, and what drives me to bridge creative vision with measurable impact.',
      image: 'https://c.animaapp.com/miw6zgdna5SIGT/img/image-12.webp',
      color: 'bg-secondary',
      icon: User,
      link: '/about.html',
      category: 'past-present',
    },
    {
      id: 3,
      title: 'Resume',
      description: 'A comprehensive view of my professional experience, skills, and the brands I have partnered with to create impact.',
      image: 'https://c.animaapp.com/miw6zgdna5SIGT/img/image-11.webp',
      color: 'bg-deep-blue',
      icon: FileText,
      link: '/cv.html',
      category: 'past-present',
    },
    {
      id: 4,
      title: 'Brand Guidelines',
      description: 'The visual and strategic DNA of my ecosystem—typography, color systems, and design principles that define my work.',
      image: 'https://c.animaapp.com/miw6zgdna5SIGT/img/image-10_2.webp',
      color: 'bg-primary',
      icon: Palette,
      link: '/brand-guidelines/',
      category: 'past-present',
    },
    {
      id: 5,
      title: 'Insights',
      description: 'Strategic thinking on AI, narrative, and leadership—my editorial lab exploring the future of design and innovation.',
      image: 'https://c.animaapp.com/miw6zgdna5SIGT/img/thehub.webp',
      color: 'bg-primary',
      icon: Lightbulb,
      link: '/insights/',
      category: 'present-future',
    },
    {
      id: 6,
      title: 'The Hub',
      description: 'Productized consulting tools and frameworks—structured systems that reduce guesswork and drive systematic intelligence.',
      image: 'https://c.animaapp.com/miw6zgdna5SIGT/img/insights.webp',
      color: 'bg-secondary',
      icon: Grid3x3,
      link: '/TheHub/',
      category: 'present-future',
    },
    {
      id: 7,
      title: 'The Portal',
      description: 'Exclusive access to advanced resources, methodologies, and collaborative opportunities for strategic partners.',
      image: 'https://c.animaapp.com/miw6zgdna5SIGT/img/theportal.webp',
      color: 'bg-deep-blue',
      icon: ({ className, ...props }: any) => (
        <svg className={className} {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: 'https://portal.luis-gilberto.com',
      category: 'present-future',
    },
  ];

  const [cards, setCards] = useState(initialCards);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards(new Set());
  };

  const handleCardClick = (id: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(id);
    }
  };

  const pastPresentCards = cards.filter(c => c.category === 'past-present');
  const presentFutureCards = cards.filter(c => c.category === 'present-future');

  return (
    <section id="quick-tour" className="py-32 bg-background">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-h2 font-serif font-bold text-foreground mb-6">
            Got a challenge?<br />Let's tackle it
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            The hard stuff is where I thrive. If something's in your way, we'll figure it out together.
          </p>
        </motion.div>

        {/* Past & Present Section */}
        <div className="mb-20">
          <h3 className="text-h4 font-serif font-bold text-foreground mb-8 text-center">
            Know the Human & Professional
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
            <AnimatePresence mode="popLayout">
              {pastPresentCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="perspective-1000"
                >
                  <Card
                    className="relative h-96 cursor-pointer bg-card border border-border rounded-2xl overflow-hidden group"
                    onClick={() => handleCardClick(card.id)}
                    onKeyDown={(e) => handleKeyDown(e, card.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={flippedCards.has(card.id)}
                  >
                    <motion.div
                      className="w-full h-full"
                      animate={{ rotateY: flippedCards.has(card.id) ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Front */}
                      <div
                        className="absolute inset-0 backface-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <img
                          src={card.image}
                          alt={card.title}
                          className={`w-full h-full object-cover ${
                            card.id === 1 ? 'timeline-alive' : 
                            card.id === 2 ? 'portrait-alive' : 
                            card.id === 3 ? 'resume-alive' : 
                            card.id === 4 ? 'brand-alive' : ''
                          }`}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                        <div className="absolute top-4 right-4">
                          <card.icon 
                            className={`w-8 h-8 ${card.id === 1 || card.id === 4 ? 'text-white' : 'text-primary'}`} 
                            strokeWidth={1.5} 
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-h5 font-serif font-bold text-foreground mb-2" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
                            {card.title}
                          </h3>
                        </div>
                      </div>

                      {/* Back */}
                      <div
                        className={`absolute inset-0 ${card.color} p-6 flex flex-col justify-between backface-hidden`}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div>
                          <card.icon className="w-10 h-10 text-white mb-4" strokeWidth={1.5} />
                          <p className="text-body text-white leading-loose">
                            {card.description}
                          </p>
                        </div>
                        <a
                          href={card.link}
                          className="inline-block bg-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors shadow-md"
                          style={{ color: card.color === 'bg-primary' ? 'hsl(1, 95%, 70%)' : card.color === 'bg-secondary' ? 'hsl(174, 71%, 51%)' : 'hsl(210, 29%, 24%)' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Explore →
                        </a>
                      </div>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Present & Future Section */}
        <div>
          <h3 className="text-h4 font-serif font-bold text-foreground mb-8 text-center">
            Explore Present & Future
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
            <AnimatePresence mode="popLayout">
              {presentFutureCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="perspective-1000"
                >
                  <Card
                    className="relative h-96 cursor-pointer bg-card border border-border rounded-2xl overflow-hidden group"
                    onClick={() => handleCardClick(card.id)}
                    onKeyDown={(e) => handleKeyDown(e, card.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={flippedCards.has(card.id)}
                  >
                    <motion.div
                      className="w-full h-full"
                      animate={{ rotateY: flippedCards.has(card.id) ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Front */}
                      <div
                        className="absolute inset-0 backface-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                        <div className="absolute top-4 right-4">
                          <card.icon className="w-8 h-8 text-secondary" strokeWidth={1.5} />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-h5 font-serif font-bold text-foreground mb-2">
                            {card.title}
                          </h3>
                        </div>
                      </div>

                      {/* Back */}
                      <div
                        className={`absolute inset-0 ${card.color} p-6 flex flex-col justify-between backface-hidden`}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div>
                          <card.icon className="w-10 h-10 text-white mb-4" strokeWidth={1.5} />
                          <p className="text-body text-white leading-loose">
                            {card.description}
                          </p>
                        </div>
                        <a
                          href={card.link}
                          className="inline-block bg-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors shadow-md"
                          style={{ color: card.color === 'bg-primary' ? 'hsl(1, 95%, 70%)' : card.color === 'bg-secondary' ? 'hsl(174, 71%, 51%)' : 'hsl(210, 29%, 24%)' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Explore →
                        </a>
                      </div>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-body text-muted-foreground mb-4">
            Tap on the cards to learn more about each section
          </p>
          <Button
            onClick={handleShuffle}
            variant="outline"
            className="bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-normal text-base"
          >
            <Shuffle className="mr-2 w-5 h-5" />
            Shuffle Cards
          </Button>
        </div>
      </div>
    </section>
  );
}
