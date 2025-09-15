import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  status: 'upcoming' | 'past';
  image?: string;
}

// Mock data for development
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Nirman Hackathon 2025',
    date: '2025-02-15',
    description: '48-hour hackathon focusing on building innovative solutions for real-world problems with prizes worth ₹1 lakh.',
    status: 'upcoming'
  },
  {
    id: '2', 
    title: 'PitchQuest',
    date: '2025-01-20',
    description: 'Startup pitch competition where entrepreneurs present their ideas to industry experts and investors.',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Startup Workshop Series',
    date: '2024-12-10',
    description: 'Monthly workshop series covering ideation, market research, funding, and scaling strategies for entrepreneurs.',
    status: 'past'
  },
  {
    id: '4',
    title: 'Innovation Summit 2024',
    date: '2024-11-25',
    description: 'Two-day summit featuring keynote speakers, panel discussions, and networking opportunities with industry leaders.',
    status: 'past'
  }
];

export default function EventsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextEvent = () => {
    setCurrentIndex((prev) => (prev + 1) % mockEvents.length);
  };

  const prevEvent = () => {
    setCurrentIndex((prev) => (prev - 1 + mockEvents.length) % mockEvents.length);
  };

  const handleViewDetails = (eventId: string) => {
    console.log(`View details clicked for event: ${eventId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section className="py-16 md:py-24 px-4" data-testid="events-section">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" data-testid="events-title">
            Events & Activities
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto" data-testid="events-description">
            Join our workshops, competitions, and networking events to accelerate your entrepreneurial journey
          </p>
        </motion.div>

        {/* Featured Event Carousel */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden rounded-xl" data-testid="event-carousel">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <Card className="bg-card border-card-border p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Badge 
                          variant={mockEvents[currentIndex].status === 'upcoming' ? 'default' : 'secondary'}
                          className={mockEvents[currentIndex].status === 'upcoming' ? 'bg-primary text-white' : ''}
                          data-testid="event-status-badge"
                        >
                          {mockEvents[currentIndex].status === 'upcoming' ? 'Upcoming' : 'Past Event'}
                        </Badge>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(mockEvents[currentIndex].date)}
                        </div>
                      </div>
                      
                      <h3 className="text-3xl font-bold text-white mb-4" data-testid="featured-event-title">
                        {mockEvents[currentIndex].title}
                      </h3>
                      
                      <p className="text-gray-300 text-lg mb-6" data-testid="featured-event-description">
                        {mockEvents[currentIndex].description}
                      </p>
                      
                      <Button
                        onClick={() => handleViewDetails(mockEvents[currentIndex].id)}
                        className={`${
                          mockEvents[currentIndex].status === 'upcoming' 
                            ? 'bg-primary hover:bg-primary/90 shadow-[0_0_20px_theme(colors.primary/30%)]' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        } text-white font-medium`}
                        data-testid="button-view-details"
                      >
                        {mockEvents[currentIndex].status === 'upcoming' ? 'Register Now' : 'View Details'}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Calendar className="w-16 h-16 text-primary mb-4 mx-auto" />
                          <p className="text-gray-400">Event Image Placeholder</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
              <Button
                variant="outline"
                size="icon"
                onClick={prevEvent}
                className="pointer-events-auto bg-black/50 border-white/20 text-white hover:bg-black/70 hover:border-primary"
                data-testid="button-prev-event"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextEvent}
                className="pointer-events-auto bg-black/50 border-white/20 text-white hover:bg-black/70 hover:border-primary"
                data-testid="button-next-event"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {mockEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentIndex ? 'bg-primary' : 'bg-white/30'
                  }`}
                  data-testid={`carousel-indicator-${index}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
