import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Users, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AboutSection() {
  const [morphIndex, setMorphIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMorphIndex((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const polygonShapes = [
    'polygon(30% 40%, 70% 30%, 90% 70%, 20% 80%)',
    'polygon(20% 30%, 80% 20%, 85% 80%, 15% 90%)',
    'polygon(25% 20%, 75% 35%, 95% 75%, 10% 85%)',
    'polygon(35% 35%, 65% 25%, 85% 65%, 25% 75%)'
  ];

  const features = [
    { icon: Lightbulb, title: 'Innovation Hub', description: 'A creative space where groundbreaking ideas are born and nurtured.' },
    { icon: Users, title: 'Community Building', description: 'Connecting entrepreneurs, mentors, and industry experts.' },
    { icon: Rocket, title: 'Launch Platform', description: 'Providing resources and guidance to launch your venture successfully.' }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section className="py-16 md:py-24 px-4" data-testid="about-section">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-primary mb-4"
            style={{ textShadow: '0 0 20px rgba(216, 32, 50, 0.5)' }}
          >
            About E-Cell VJIT
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Empowering the next generation of entrepreneurs through innovation, mentorship, and collaborative growth.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            className="relative flex items-center justify-center h-96"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="relative w-full h-96 flex items-center justify-center">
              <motion.div
                className="w-80 h-80 bg-gradient-to-br from-primary/30 to-primary/10 relative"
                animate={{
                  clipPath: polygonShapes[morphIndex]
                }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent animate-pulse" />
                <div className="absolute inset-4 border border-primary/30 rounded-lg" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    className="w-16 h-16 bg-primary rounded-full flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  >
                    <Lightbulb className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <p className="text-gray-300 text-lg leading-relaxed">
                E-Cell VJIT is the entrepreneurship cell of Vidya Jyothi Institute of Technology, 
                dedicated to cultivating an ecosystem of innovation and startup culture among students.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                We provide a comprehensive platform for aspiring entrepreneurs to learn, network, and transform 
                their innovative ideas into successful ventures.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="relative rounded-2xl"
            >
              <motion.div 
                className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl"
                whileHover={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              <Card className="bg-card/80 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-colors duration-300 h-full text-center p-6 relative z-10">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-primary/20">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}