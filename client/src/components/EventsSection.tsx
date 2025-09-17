import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Event } from '@shared/schema';

// Fetches event data from your new API endpoint
const fetchEvents = async (): Promise<Event[]> => {
  const response = await fetch('/api/events');
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  return response.json();
};

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

export default function EventsSection() {
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  const [[page, direction], setPage] = useState([0, 0]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 h-[600px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (error || !events || events.length === 0) {
    return (
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4" style={{ textShadow: '0 0 20px rgba(216, 32, 50, 0.5)' }}>Our Events</h2>
            <p className="text-xl text-gray-400">No events scheduled at the moment. Please check back soon!</p>
        </div>
      </section>
    );
  }

  const paginate = (newDirection: number) => {
    setPage([(page + newDirection + events.length) % events.length, newDirection]);
  };

  const event = events[page];
  const isUpcoming = event.status === 'upcoming';

  const handleButtonClick = () => {
    if (isUpcoming && event.registrationLink) {
      window.open(event.registrationLink, '_blank', 'noopener,noreferrer');
    } else if (!isUpcoming) {
      setSelectedEvent(event);
    }
  };
  
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <section className="py-16 md:py-24 relative overflow-hidden" data-testid="events-section">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-primary mb-4" // MODIFIED: text-white -> text-primary
            style={{ textShadow: '0 0 20px rgba(216, 32, 50, 0.5)' }} // MODIFIED: Added glow
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
                      {formatDate(event.date)}
                    </div>
                  </div>
                  {/* --- MODIFIED: Changed text color --- */}
                  <h3 className="text-2xl md:text-3xl font-bold text-primary mb-3">{event.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{event.description}</p>
                </div>
                <div className="flex justify-end">
                  <Button 
                    className={`group ${isUpcoming ? 'bg-primary hover:bg-primary/90' : 'bg-gray-600/50 hover:bg-gray-600'}`}
                    onClick={handleButtonClick}
                  >
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

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="bg-card border-card-border text-white w-[90vw] max-w-2xl rounded-lg">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-primary mb-2">{selectedEvent?.title}</DialogTitle>
            <div className="flex items-center text-gray-400 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Event Date: {selectedEvent ? formatDate(selectedEvent.date) : ''}</span>
            </div>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-4 mt-4">
            <DialogDescription className="text-gray-300 text-base leading-relaxed">
              {selectedEvent?.summary}
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}