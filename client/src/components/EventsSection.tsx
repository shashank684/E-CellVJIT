import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// --- DATA ---
interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  status: 'upcoming' | 'past';
}

const mockEvents: Event[] = [
  { id: '1', title: 'Nirman Hackathon 2025', date: '2025-02-15', description: 'A 48-hour hackathon to build innovative solutions for real-world problems. Prizes worth ₹1 lakh.', status: 'upcoming' },
  { id: '2', title: 'PitchQuest: The Ultimate Showdown', date: '2025-01-20', description: 'Present your startup ideas to a panel of industry experts and investors in this high-stakes pitch competition.', status: 'upcoming' },
  { id: '3', title: 'Startup Workshop Series', date: '2024-12-10', description: 'A series of workshops covering ideation, market research, funding, and scaling strategies.', status: 'past' },
  { id: '4', title: 'Innovation Summit 2024', date: '2024-11-25', description: 'A two-day summit with keynote speakers, panel discussions, and networking opportunities.', status: 'past' },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.8
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.8
  }),
};

// --- Main Section Component ---
export default function EventsSection() {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([(page + newDirection + mockEvents.length) % mockEvents.length, newDirection]);
  };

  const event = mockEvents[page];
  const isUpcoming = event.status === 'upcoming';

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" data-testid="events-section">
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Our Events
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          A timeline of our flagship events and workshops.
        </motion.p>
      </div>

      <div className="relative h-[500px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -10000) {
                    paginate(1);
                } else if (swipe > 10000) {
                    paginate(-1);
                }
            }}
            className="w-[360px] md:w-[480px] h-[450px] absolute"
          >
            <div className={cn( "h-full w-full rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300", "glass-card border-t-4", isUpcoming ? 'border-primary' : 'border-gray-600' )}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <Badge variant={isUpcoming ? 'default' : 'secondary'} className={`border-none ${isUpcoming ? 'bg-primary/20 text-primary' : 'bg-gray-700/50 text-gray-300'}`}>
                    {isUpcoming ? 'Upcoming' : 'Completed'}
                  </Badge>
                  <div className="flex items-center text-gray-400 text-sm font-mono">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.date}
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{event.title}</h3>
                <p className="text-gray-300 leading-relaxed">{event.description}</p>
              </div>
              <div className="flex justify-end">
                <Button className={`group ${isUpcoming ? 'bg-primary hover:bg-primary/90' : 'bg-gray-600/50 hover:bg-gray-600'}`}>
                  {isUpcoming ? 'Register Now' : 'Know More'}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="text-center mt-8 text-gray-500 font-mono text-sm">
        ‹ drag or swipe to explore ›
      </div>
    </section>
  );
}