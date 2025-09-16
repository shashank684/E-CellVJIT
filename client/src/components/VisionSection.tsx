import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Target, Globe, Zap } from 'lucide-react';

export default function VisionSection() {
  const [scanLinePosition, setScanLinePosition] = useState(0);

  const visionText = 'To create a thriving ecosystem where innovative ideas transform into impactful solutions that shape the future of technology and entrepreneurship.';
  const words = visionText.split(' ');

  // Scanning light effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLinePosition((prev) => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const visionPoints = [
    {
      icon: Target,
      title: 'Strategic Innovation',
      description: 'Developing cutting-edge solutions that address real-world challenges through strategic thinking and innovative approaches.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Creating startups and initiatives that transcend borders and make a positive difference on a global scale.'
    },
    {
      icon: Zap,
      title: 'Technology Leadership',
      description: 'Leading the way in emerging technologies and digital transformation across various industries.'
    }
  ];
  
  // Animation variants for the text container and individual words
  const sentenceVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.08, // Time between each word animating in
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden" data-testid="vision-section">
      {/* Background Scanning Light */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(90deg, transparent ${scanLinePosition}%, #d82032 ${scanLinePosition + 1}%, transparent ${scanLinePosition + 2}%)`
        }}
        data-testid="scanning-light"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-full flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px #d82032',
                  '0 0 40px #d82032',
                  '0 0 20px #d82032'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Eye className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-primary mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            style={{
              textShadow: '0 0 30px #d82032, 0 0 60px #d82032, 0 0 90px #d82032'
            }}
            data-testid="vision-title"
          >
            Our Vision
          </motion.h2>
        </motion.div>

        {/* Vision Statement with Word Animation */}
        <motion.div
          className="max-w-4xl mx-auto mb-16 text-center"
          initial="hidden"
          whileInView="visible"
          variants={sentenceVariants}
          viewport={{ once: true }}
          data-testid="vision-statement"
        >
          <div className="text-2xl md:text-3xl leading-relaxed text-white font-light">
            {words.map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-2"
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Vision Points */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          data-testid="vision-points"
        >
          {visionPoints.map((point, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              data-testid={`vision-point-${index}`}
            >
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30"
                whileHover={{
                  borderColor: '#d82032',
                  boxShadow: '0 0 30px rgba(216, 32, 50, 0.5)'
                }}
                transition={{ duration: 0.3 }}
              >
                <point.icon className="w-10 h-10 text-primary" />
              </motion.div>
              
              <h3 className="text-xl font-semibold text-white mb-4">{point.title}</h3>
              <p className="text-gray-300 leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated Quote */}
        <motion.div
          className="text-center mt-16 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          viewport={{ once: true }}
          data-testid="vision-quote"
        >
          <blockquote className="text-xl md:text-2xl font-light text-gray-300 italic relative">
            <motion.span
              className="absolute -top-4 -left-4 text-4xl text-primary"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              "
            </motion.span>
            The future belongs to those who dare to dream, innovate, and transform their vision into reality.
            <motion.span
              className="absolute -bottom-4 -right-4 text-4xl text-primary"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 2 }}
            >
              "
            </motion.span>
          </blockquote>
          <p className="text-primary font-medium mt-4">— E-Cell VJIT Team</p>
        </motion.div>
      </div>
    </section>
  );
}