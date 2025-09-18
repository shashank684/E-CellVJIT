import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Linkedin, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import type { TeamMember } from '@shared/schema';

// Fetches featured team members
const fetchFeaturedTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await fetch('/api/team/featured');
  if (!response.ok) {
    throw new Error('Failed to fetch team members');
  }
  return response.json();
};


const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.8,
  }),
};

export default function TeamSection() {
    const { data: teamMembers, isLoading, error } = useQuery<TeamMember[]>({
      queryKey: ['featuredTeamMembers'],
      queryFn: fetchFeaturedTeamMembers,
    });

    const [[page, direction], setPage] = useState([0, 0]);

    if (isLoading) {
        return (
          <section className="py-16 md:py-24 h-[600px] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </section>
        );
    }

    if (error || !teamMembers || teamMembers.length === 0) {
        return (
          <section className="py-16 md:py-24 text-center">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4" style={{ textShadow: '0 0 20px rgba(216, 32, 50, 0.5)' }}>Meet Our Team</h2>
                <p className="text-xl text-gray-400">Team members are not available at the moment. Please check back soon!</p>
            </div>
          </section>
        );
    }

    const paginate = (newDirection: number) => {
        setPage([(page + newDirection + teamMembers.length) % teamMembers.length, newDirection]);
    };
    
    const memberIndex = page;
    const member = teamMembers[memberIndex];
    
    const prevMemberIndex = (memberIndex - 1 + teamMembers.length) % teamMembers.length;
    const nextMemberIndex = (memberIndex + 1) % teamMembers.length;
    const prevMember = teamMembers[prevMemberIndex];
    const nextMember = teamMembers[nextMemberIndex];

    return (
        <section className="py-16 md:py-24 flex flex-col justify-center items-center min-h-screen relative overflow-hidden" data-testid="team-section" style={{ perspective: '1200px' }}>
            <div className="max-w-7xl mx-auto px-4 text-center mb-8">
                <h2 
                    className="text-4xl md:text-5xl font-bold text-primary mb-4"
                    style={{ textShadow: '0 0 20px rgba(216, 32, 50, 0.5)' }}
                >
                    Meet Our Team
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    The driving force behind our mission
                </p>
            </div>
            
            <div className="relative w-full h-[65vh] md:h-[70vh] flex items-center justify-center">
                <motion.div
                    key={prevMemberIndex}
                    initial={{ scale: 0, x: '-50%', opacity: 0 }}
                    animate={{ scale: 0.7, x: '-80%', opacity: 0.2, rotateY: 30 }}
                    transition={{ duration: 0.4 }}
                    className="w-[70vw] md:w-[380px] h-[90vw] md:h-[520px] absolute"
                    style={{ transformOrigin: 'center right', zIndex: 0 }}
                >
                     <div className="w-full h-full glass-card rounded-3xl overflow-hidden relative shadow-lg">
                        <img src={prevMember.imageUrl} alt={prevMember.name} className="w-full h-full object-cover" />
                     </div>
                </motion.div>

                <motion.div
                    key={nextMemberIndex}
                    initial={{ scale: 0, x: '50%', opacity: 0 }}
                    animate={{ scale: 0.7, x: '80%', opacity: 0.2, rotateY: -30 }}
                    transition={{ duration: 0.4 }}
                    className="w-[70vw] md:w-[380px] h-[90vw] md:h-[520px] absolute"
                    style={{ transformOrigin: 'center left', zIndex: 0 }}
                >
                     <div className="w-full h-full glass-card rounded-3xl overflow-hidden relative shadow-lg">
                        <img src={nextMember.imageUrl} alt={nextMember.name} className="w-full h-full object-cover" />
                     </div>
                </motion.div>

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
                        onDragEnd={(_, { offset, velocity }) => {
                            const swipeThreshold = 50;
                            const swipePower = Math.abs(offset.x) * velocity.x;
                            if (swipePower < -swipeThreshold) paginate(1);
                            else if (swipePower > swipeThreshold) paginate(-1);
                        }}
                        className="w-[70vw] md:w-[380px] h-[90vw] md:h-[520px] absolute cursor-grab active:cursor-grabbing"
                    >
                        <div className="w-full h-full glass-card rounded-3xl overflow-hidden relative shadow-2xl shadow-primary/20">
                            <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end">
                                <h3 className="text-3xl font-bold text-white">{member.name}</h3>
                                <p className="text-xl text-primary">{member.role}</p>
                                <div className="flex gap-4 mt-4">
                                    {member.instagram && (
                                        <motion.a href={member.instagram} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, color: '#E4405F' }} className="text-white">
                                            <Instagram size={24} />
                                        </motion.a>
                                    )}
                                    {member.linkedin && (
                                        <motion.a href={member.linkedin} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, color: '#0A66C2' }} className="text-white">
                                            <Linkedin size={24} />
                                        </motion.a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
             <div className="mt-8 text-gray-500 font-mono text-sm">
                ‹ drag or swipe ›
             </div>
             {/* NEW: Button to navigate to the full team page */}
             <div className="mt-8">
                 <Link href="/team">
                    <Button variant="outline" className="border-2 border-primary/50 text-white rounded-full bg-black/20 backdrop-blur-sm hover:bg-primary/20 hover:border-primary transition-all duration-300 px-8 py-3 text-lg font-semibold">
                        <Users className="w-5 h-5 mr-2" />
                        View Full Team
                    </Button>
                 </Link>
             </div>
        </section>
    );
}
