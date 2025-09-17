import React from 'react';
import { motion } from 'framer-motion';
import { Target, Globe, Zap } from 'lucide-react';

const visionPoints = [
  {
    icon: Target,
    title: 'Strategic Innovation',
    description: 'Fostering an environment where groundbreaking ideas are not just born, but strategically developed into viable, market-ready solutions.'
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'Empowering student entrepreneurs to create ventures that transcend local boundaries and address global challenges with lasting impact.'
  },
  {
    icon: Zap,
    title: 'Technology Leadership',
    description: 'Championing the adoption of emerging technologies and cultivating the next generation of leaders in the digital frontier.'
  }
];

export default function VisionSection() {
  return (
    <section 
      className="relative w-full flex flex-col justify-center items-center py-24 px-4 bg-transparent overflow-hidden" 
      data-testid="vision-section"
    >
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl">
        <motion.div 
          className="w-full lg:w-1/3 text-center lg:text-left mb-12 lg:mb-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-4xl md:text-6xl font-bold text-primary mb-6" // Changed text-white to text-primary
            style={{ textShadow: '0 0 20px rgba(216, 32, 50, 0.7)' }} // Enhanced red glow
          >
            Our Vision
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            To create a thriving ecosystem where innovative ideas transform into impactful solutions, shaping the future of technology and entrepreneurship.
          </p>
        </motion.div>

        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          {visionPoints.map((point, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-6 p-6 rounded-2xl vision-item-container"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * index, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="flex-shrink-0 text-primary">
                <point.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{point.title}</h3>
                <p className="text-gray-400 leading-relaxed">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}