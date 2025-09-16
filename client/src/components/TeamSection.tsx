import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Linkedin } from 'lucide-react';

// Using the correct asset paths for the images you have
import profileImage1 from '@assets/generated_images/shashank.svg';
import profileImage2 from '@assets/generated_images/Female_team_member_headshot_d7adc089.png';
import profileImage3 from '@assets/generated_images/Developer_team_member_headshot_ce4e0792.png';
import profileImage4 from '@assets/generated_images/sairam.svg';
import profileImage5 from '@assets/generated_images/sujith.svg';
import profileImage6 from '@assets/generated_images/rithika.svg';
import profileImage7 from '@assets/generated_images/sankeerth.svg';

interface TeamMember {
  name: string;
  role: string;
  img: string;
  instagram?: string;
  linkedin?: string;
}

// Using the team member data you provided
const teamMembers: TeamMember[] = [
    { name: "Shashank Shilapally", role: "President", img: profileImage1, instagram: "https://www.instagram.com/shashank_6804/?utm_source=ig_web_button_share_sheet", linkedin: "https://www.linkedin.com/in/shashank-shilapally-" },
    { name: "Anushka Sahoo", role: "Associate President", img: profileImage2, instagram: "https://www.instagram.com/_galaxygroove/?utm_source=ig_web_button_share_sheet", linkedin: "https://linkedin.com/in/priya-sharma-ecell" },
    { name: "Pavan kumar", role: "Creative and Design Lead", img: profileImage3, instagram: "https://www.instagram.com/pavan_k.t/?utm_source=ig_web_button_share_sheet", linkedin: "https://linkedin.com/in/arjun-kumar-ecell" },
    { name: "M. Sairam", role: "Marketing and PR Lead", img: profileImage4, instagram: "https://www.instagram.com/__sai_0818?utm_source=ig_web_button_share_sheet&igsh=cHc1am82bXliaDFn", linkedin: "https://linkedin.com/in/sneha-reddy-ecell" },
    { name: "Sujith", role: "Social Media Lead", img: profileImage5, instagram: "https://www.instagram.com/sujzzzt?utm_source=ig_web_button_share_sheet&igsh=MWpvdmIyaWc3OTlkdg==", linkedin: "https://linkedin.com/in/rahul-gupta-ecell" },
    { name: "Rithika", role: "Documentation Lead", img: profileImage6, instagram: "https://www.instagram.com/rithikasunkari?utm_source=ig_web_button_share_sheet&igsh=MXZicnFlZDZ3NmlzNw==", linkedin: "https://linkedin.com/in/kavya-nair-ecell" },
    { name: "Sankeerth", role: "Event Management Lead", img: profileImage7, instagram: "https://www.instagram.com/sankeerth__chowdary/?utm_source=ig_web_button_share_sheet", linkedin: "https://linkedin.com/in/vikram-singh-ecell" }
];

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
    const [[page, direction], setPage] = useState([0, 0]);

    const paginate = (newDirection: number) => {
        setPage([(page + newDirection + teamMembers.length) % teamMembers.length, newDirection]);
    };
    
    const memberIndex = page;
    const member = teamMembers[memberIndex];
    
    // Get previous and next members for the side cards
    const prevMemberIndex = (memberIndex - 1 + teamMembers.length) % teamMembers.length;
    const nextMemberIndex = (memberIndex + 1) % teamMembers.length;
    const prevMember = teamMembers[prevMemberIndex];
    const nextMember = teamMembers[nextMemberIndex];

    return (
        <section className="py-16 md:py-24 flex flex-col justify-center items-center min-h-screen relative overflow-hidden" data-testid="team-section" style={{ perspective: '1200px' }}>
            <div className="max-w-7xl mx-auto px-4 text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Meet Our Team</h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    The driving force behind our mission
                </p>
            </div>
            
            <div className="relative w-full h-[65vh] md:h-[70vh] flex items-center justify-center">
                {/* Previous Card */}
                <motion.div
                    key={prevMemberIndex}
                    initial={{ scale: 0, x: '-50%', opacity: 0 }}
                    animate={{ scale: 0.7, x: '-80%', opacity: 0.2, rotateY: 30 }}
                    transition={{ duration: 0.4 }}
                    className="w-[70vw] md:w-[380px] h-[90vw] md:h-[520px] absolute"
                    style={{ transformOrigin: 'center right', zIndex: 0 }}
                >
                     <div className="w-full h-full glass-card rounded-3xl overflow-hidden relative shadow-lg">
                        <img src={prevMember.img} alt={prevMember.name} className="w-full h-full object-cover" />
                     </div>
                </motion.div>

                {/* Next Card */}
                <motion.div
                    key={nextMemberIndex}
                    initial={{ scale: 0, x: '50%', opacity: 0 }}
                    animate={{ scale: 0.7, x: '80%', opacity: 0.2, rotateY: -30 }}
                    transition={{ duration: 0.4 }}
                    className="w-[70vw] md:w-[380px] h-[90vw] md:h-[520px] absolute"
                    style={{ transformOrigin: 'center left', zIndex: 0 }}
                >
                     <div className="w-full h-full glass-card rounded-3xl overflow-hidden relative shadow-lg">
                        <img src={nextMember.img} alt={nextMember.name} className="w-full h-full object-cover" />
                     </div>
                </motion.div>

                {/* Center Card */}
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
                            const swipeThreshold = 50;
                            const swipePower = Math.abs(offset.x) * velocity.x;
                            if (swipePower < -swipeThreshold) paginate(1);
                            else if (swipePower > swipeThreshold) paginate(-1);
                        }}
                        className="w-[70vw] md:w-[380px] h-[90vw] md:h-[520px] absolute cursor-grab active:cursor-grabbing"
                    >
                        <div className="w-full h-full glass-card rounded-3xl overflow-hidden relative shadow-2xl shadow-primary/20">
                            <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
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
        </section>
    );
}