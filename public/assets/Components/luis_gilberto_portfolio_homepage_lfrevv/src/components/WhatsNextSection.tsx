import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConstellationCanvas } from './ConstellationCanvas';

export function WhatsNextSection() {
  return (
    <section id="contact" className="relative py-32 bg-background overflow-hidden">
      <ConstellationCanvas />
      
      <div className="container relative z-10 mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-h2 font-serif font-bold text-foreground mb-6">
            What's Next?
          </h2>
          <p className="text-body-large text-muted-foreground leading-relaxed mb-12">
            Ready to transform your vision into reality? Let's collaborate on something extraordinary.
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-normal text-base px-8 py-6 rounded-lg"
            asChild
          >
            <a href="mailto:hello@luisgilberto.com">
              Let's talk about what's next
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
