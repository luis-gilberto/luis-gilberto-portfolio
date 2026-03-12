import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function BannerRotator() {
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const statements = [
    { text: 'Make it clear', font: 'font-sans' },
    { text: 'Ship beautifully', font: 'font-serif italic' },
    { text: 'Scale smart', font: 'font-accent' },
    { text: 'Design with purpose', font: 'font-serif' },
    { text: 'Build for impact', font: 'font-sans' },
  ];

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % statements.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, statements.length]);

  return (
    <section 
      className="py-16 bg-foreground/95 dark:bg-foreground border-y border-border overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-8">
        <div className="relative h-24 flex items-center justify-center">
          {statements.map((statement, index) => (
            <motion.span
              key={index}
              className={`absolute text-h3 font-bold text-background/15 dark:text-background/10 ${statement.font}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: currentIndex === index ? 1 : 0,
                y: currentIndex === index ? 0 : 20,
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              {statement.text}
              <span className="text-primary/20">.</span>
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
