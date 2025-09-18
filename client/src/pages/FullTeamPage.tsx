import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Instagram, Linkedin, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { TeamMember } from '@shared/schema';
import { InteractiveBackground } from '@/components/InteractiveBackground';
import { Button } from '@/components/ui/button';

const fetchAllTeamMembers = async (): Promise<TeamMember[]> => {
    const response = await fetch('/api/team');
    if (!response.ok) {
        throw new Error('Failed to fetch team members');
    }
    return response.json();
};

const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.05,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        },
    }),
};

export default function FullTeamPage() {
    const { data: teamMembers, isLoading, error } = useQuery<TeamMember[]>({
        queryKey: ['allTeamMembers'],
        queryFn: fetchAllTeamMembers,
    });

    return (
        <div className="min-h-screen bg-transparent text-white relative">
            <InteractiveBackground />
            
            <motion.div 
              className="absolute top-6 left-6 z-20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link href="/">
                <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-primary/20 hover:border-primary/50 hover:text-white rounded-full">
                    <a>
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Home
                    </a>
                </Button>
              </Link>
            </motion.div>

            <main className="relative z-10 pt-24 pb-16 px-4">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <h1 
                        className="text-5xl md:text-7xl font-bold text-primary mb-4"
                        style={{ textShadow: '0 0 25px rgba(216, 32, 50, 0.6)' }}
                    >
                        Our Entire Team
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                        Meet the dedicated individuals who form the backbone of E-Cell VJIT, driving our vision forward.
                    </p>
                </motion.div>

                {isLoading && (
                     <div className="flex justify-center">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-400">
                        <p>Failed to load team members. Please try again later.</p>
                    </div>
                )}

                {teamMembers && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                custom={index}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className="w-full h-96"
                            >
                                <div className="w-full h-full glass-card rounded-2xl overflow-hidden relative shadow-lg shadow-primary/10">
                                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end">
                                        {/* Flex container to separate text from icons */}
                                        <div className="flex justify-between items-end">
                                            {/* Text content wrapper */}
                                            <div className="flex-grow">
                                                <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                                                <p className="text-lg text-primary">{member.role}</p>
                                            </div>
                                            {/* Social icons wrapper */}
                                            <div className="flex gap-4 flex-shrink-0">
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
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}