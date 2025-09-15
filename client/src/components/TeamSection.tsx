import { motion } from 'framer-motion';
import { Instagram, Linkedin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

// Corrected import paths using the @assets alias, which points to client/src/assets
import profileImage1 from '@assets/generated_images/Professional_team_member_headshot_eec4fecb.png';
import profileImage2 from '@assets/generated_images/Female_team_member_headshot_d7adc089.png';
import profileImage3 from '@assets/generated_images/Developer_team_member_headshot_ce4e0792.png';
import profileImage4 from '@assets/generated_images/Business_team_member_headshot_748e667b.png';

interface TeamMember {
  name: string;
  role: string;
  img: string;
  instagram?: string;
  linkedin?: string;
}

interface TeamSectionProps {
  members?: TeamMember[];
}

const mockTeamMembers: TeamMember[] = [
  {
    name: "Shashank Shilapally",
    role: "President",
    img: profileImage1,
    instagram: "https://instagram.com/shashank_ecell",
    linkedin: "https://linkedin.com/in/shashank-ecell"
  },
  {
    name: "Anushka Sahoo",
    role: "Vice President",
    img: profileImage2,
    instagram: "https://instagram.com/priya_ecell",
    linkedin: "https://linkedin.com/in/priya-sharma-ecell"
  },
  {
    name: "Pavan kumar",
    role: "Creative and Design Lead",
    img: profileImage3,
    instagram: "https://instagram.com/arjun_ecell",
    linkedin: "https://linkedin.com/in/arjun-kumar-ecell"
  },
  {
    name: "M. Sairam",
    role: "Marketing and PR Lead",
    img: profileImage4,
    instagram: "https://instagram.com/sneha_ecell",
    linkedin: "https://linkedin.com/in/sneha-reddy-ecell"
  },
  {
    name: "Sujith",
    role: "Social Media Lead",
    img: profileImage1,
    instagram: "https://instagram.com/rahul_ecell",
    linkedin: "https://linkedin.com/in/rahul-gupta-ecell"
  },
  {
    name: "Rithika",
    role: "Documentation Lead",
    img: profileImage2,
    instagram: "https://instagram.com/kavya_ecell",
    linkedin: "https://linkedin.com/in/kavya-nair-ecell"
  },
  {
    name: "Sankeerth",
    role: "Event Management Lead",
    img: profileImage3,
    instagram: "https://instagram.com/vikram_ecell",
    linkedin: "https://linkedin.com/in/vikram-singh-ecell"
  }
];

export default function TeamSection({ members = mockTeamMembers }: TeamSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 80,
      scale: 0.8,
      rotateY: 25,
      rotateX: 10
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const handleSocialClick = (url: string, platform: string, memberName: string) => {
    console.log(`Opening ${platform} profile for ${memberName}: ${url}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 md:py-24 px-4" data-testid="team-section">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" data-testid="team-title">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto" data-testid="team-description">
            Passionate innovators driving entrepreneurship and fostering the next generation of startups
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          data-testid="team-grid"
        >
          {members.map((member, index) => (
            <motion.div
              key={`${member.name}-${index}`}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.08,
                y: -12,
                rotateX: 8,
                rotateY: 5,
                z: 50,
                transition: { 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 150
                }
              }}
              style={{
                transformStyle: "preserve-3d"
              }}
              data-testid={`team-card-${index}`}
            >
              <Card className="bg-card border-card-border hover:border-primary/70 transition-all duration-500 overflow-hidden group hover-elevate relative">
                {/* Floating Particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-primary rounded-full"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      animate={{
                        y: [-10, -20, -10],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>

                {/* Animated Border Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100"
                  animate={{
                    background: [
                      'linear-gradient(0deg, rgba(216, 32, 50, 0.2) 0%, transparent 50%, rgba(216, 32, 50, 0.2) 100%)',
                      'linear-gradient(90deg, rgba(216, 32, 50, 0.2) 0%, transparent 50%, rgba(216, 32, 50, 0.2) 100%)',
                      'linear-gradient(180deg, rgba(216, 32, 50, 0.2) 0%, transparent 50%, rgba(216, 32, 50, 0.2) 100%)',
                      'linear-gradient(270deg, rgba(216, 32, 50, 0.2) 0%, transparent 50%, rgba(216, 32, 50, 0.2) 100%)',
                      'linear-gradient(0deg, rgba(216, 32, 50, 0.2) 0%, transparent 50%, rgba(216, 32, 50, 0.2) 100%)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                <div className="p-6 text-center relative z-10">
                  {/* Profile Image with Enhanced Animation */}
                  <div className="relative mb-6 mx-auto w-32 h-32">
                    {/* Rotating Rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/30"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute inset-2 rounded-full border border-primary/20"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Pulsing Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 blur-sm"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      style={{
                        animationDelay: `${index * 0.5}s`,
                        animationDuration: '2s',
                        animationIterationCount: 'infinite'
                      }}
                    />
                    
                    <motion.div
                      whileHover={{
                        scale: 1.1,
                        rotateY: 15,
                        rotateX: 5,
                        boxShadow: "0 20px 40px rgba(216, 32, 50, 0.3)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Avatar className="w-32 h-32 border-2 border-primary/20 group-hover:border-primary transition-all duration-300 relative z-10">
                        <AvatarImage 
                          src={member.img} 
                          alt={`${member.name} profile picture`}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  </div>

                  {/* Member Info */}
                  <h3 className="text-xl font-semibold text-white mb-2" data-testid={`member-name-${index}`}>
                    {member.name}
                  </h3>
                  <p className="text-gray-400 mb-4" data-testid={`member-role-${index}`}>
                    {member.role}
                  </p>

                  {/* Social Icons */}
                  <motion.div 
                    className="flex justify-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                  >
                    {member.instagram && (
                      <motion.button
                        onClick={() => handleSocialClick(member.instagram!, 'Instagram', member.name)}
                        className="p-2 text-white hover:text-[#E4405F] transition-colors duration-300 hover:shadow-[0_0_15px_#E4405F40] rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                        whileHover={{ y: -2, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`${member.name}'s Instagram profile`}
                        data-testid={`instagram-link-${index}`}
                      >
                        <Instagram size={20} />
                      </motion.button>
                    )}
                    {member.linkedin && (
                      <motion.button
                        onClick={() => handleSocialClick(member.linkedin!, 'LinkedIn', member.name)}
                        className="p-2 text-white hover:text-[#0A66C2] transition-colors duration-300 hover:shadow-[0_0_15px_#0A66C240] rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                        whileHover={{ y: -2, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`${member.name}'s LinkedIn profile`}
                        data-testid={`linkedin-link-${index}`}
                      >
                        <Linkedin size={20} />
                      </motion.button>
                    )}
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
