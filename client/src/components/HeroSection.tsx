import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export default function HeroSection() {
  const handleJoinMovement = () => {
    // This can be updated later to link to a registration or community page
    console.log('Join the Community clicked');
  };

  const handleExploreEvents = () => {
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const title = "E-CELL VJIT";
  const subtitle = "Where Ideas Take Off";

  return (
    // Uses items-center for reliable centering and translate-y to shift content up
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl -translate-y-16">
        {/* Main Title with Aurora Glyphs Effect */}
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tighter aurora-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}
        </motion.h1>

        {/* Subtitle with Stardust Reveal Effect */}
        <motion.p
          className="text-2xl md:text-4xl text-gray-300 font-light mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05, delayChildren: 1.5 } }
          }}
        >
          {subtitle.split("").map((char, index) => (
            <motion.span 
              key={index} 
              className="stardust-char" 
              style={{ animationDelay: `${1.5 + index * 0.05}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
           ))}
        </motion.p>
        
        {/* Call to Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 text-lg font-semibold shadow-[0_0_20px_rgba(216,32,50,0.5)] transition-all duration-300 group"
              onClick={handleJoinMovement}
            >
              Join the Community
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary/50 text-white rounded-full bg-black/20 backdrop-blur-sm hover:bg-primary/20 hover:border-primary transition-all duration-300 px-8 py-3 text-lg font-semibold"
              onClick={handleExploreEvents}
            >
              Explore Events
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ opacity: [0.6, 1, 0.6], y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-px h-16 bg-gradient-to-t from-red-500/50 to-transparent"></div>
      </motion.div>
    </section>
  );
}
