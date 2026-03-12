import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = (e.clientX - centerX) / rect.width;
      const y = (e.clientY - centerY) / rect.height;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  const tiles = [
    { 
      id: 1, 
      images: [
        'https://c.animaapp.com/miw6zgdna5SIGT/img/artistic-01-waves.webp',
        'https://c.animaapp.com/miw6zgdna5SIGT/img/tech-03-icons-human.jpg',
      ]
    },
    { 
      id: 2, 
      images: [
        'https://c.animaapp.com/miw6zgdna5SIGT/img/artistic-02-installation.webp',
        'https://c.animaapp.com/miw6zgdna5SIGT/img/tech-01-human-emoji.jpg',
      ]
    },
    { 
      id: 3, 
      images: [
        'https://c.animaapp.com/miw6zgdna5SIGT/img/artistic-04-architecture.webp',
        'https://c.animaapp.com/miw6zgdna5SIGT/img/tech-02-interface-humans-emojis.webp',
      ]
    },
    { 
      id: 4, 
      images: [
        'https://c.animaapp.com/miw6zgdna5SIGT/img/artistic-04-drawing.webp',
        'https://c.animaapp.com/miw6zgdna5SIGT/img/tech-04-indoor-enrironment.jpg',
      ]
    },
  ];

  return (
    <section id="portfolio" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Subtle Particle Background */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-40">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container relative z-10 px-8 py-32">
        <div className="max-w-5xl mx-auto">
          {/* Interactive 3D Tiles */}
          <motion.div
            ref={containerRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 perspective-1000"
            style={{
              transformStyle: 'preserve-3d',
              rotateX,
              rotateY,
            }}
          >
            {tiles.map((tile, index) => (
              <InteractiveTile
                key={tile.id}
                images={tile.images}
                delay={index * 0.1}
                rotation={[-2, 3, -1, 2][index]}
              />
            ))}
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center"
          >
            <h1 className="text-h1 font-serif font-bold text-foreground leading-tight mb-6">
              I make tech<br />feel{' '}
              <motion.em
                className="text-primary font-serif italic"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                human
              </motion.em>
              <motion.span
                className="text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                .
              </motion.span>
            </h1>
            <div className="flex flex-wrap justify-center gap-2 text-body-large text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              <span>Clarity first</span>
              <span className="text-primary">.</span>
              <span>Beautiful execution</span>
              <span className="text-primary">.</span>
              <span>Systems that scale</span>
              <span className="text-primary">.</span>
            </div>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-normal text-base px-8 py-6 rounded-lg"
              asChild
            >
              <a href="#quick-tour">
                Explore my work
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

interface InteractiveTileProps {
  images: string[];
  delay: number;
  rotation: number;
}

function InteractiveTile({ images, delay, rotation }: InteractiveTileProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Spring for smooth drag
  const springConfig = { damping: 20, stiffness: 200 };
  const x = useSpring(dragX, springConfig);
  const y = useSpring(dragY, springConfig);

  // Rotate based on drag
  const rotateXDrag = useTransform(y, [-100, 100], [10, -10]);
  const rotateYDrag = useTransform(x, [-100, 100], [-10, 10]);

  const handleDragEnd = () => {
    dragX.set(0);
    dragY.set(0);
    
    // Cycle through images on drag
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotate: rotation,
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="aspect-square bg-card border border-border rounded-lg overflow-hidden cursor-grab active:cursor-grabbing relative"
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        drag
        dragElastic={0.1}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDrag={(_, info) => {
          dragX.set(info.offset.x);
          dragY.set(info.offset.y);
        }}
        onDragEnd={handleDragEnd}
        style={{
          x,
          y,
          rotateX: rotateXDrag,
          rotateY: rotateYDrag,
        }}
        className="w-full h-full relative"
      >
        {images.map((image, index) => (
          <motion.img
            key={index}
            src={image}
            alt="creative workspace"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            initial={{ opacity: index === 0 ? 1 : 0 }}
            animate={{ 
              opacity: currentImageIndex === index ? 1 : 0,
              scale: currentImageIndex === index ? 1 : 0.95,
            }}
            transition={{ duration: 0.5 }}
          />
        ))}
        
        {/* Hover overlay with hint */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent flex items-end justify-center pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-xs text-foreground/70 font-medium">
            Drag to explore
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
