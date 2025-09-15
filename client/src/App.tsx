import { useState, useEffect, lazy, Suspense } from 'react';
import { Switch, Route } from "wouter";
import { motion } from 'framer-motion';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VisionSection from "@/components/VisionSection";
import TeamSection from "@/components/TeamSection";
import EventsSection from "@/components/EventsSection";
import ContactForm from "@/components/ContactForm";
import { Logo } from './components/Logo';
// Import the new InteractiveBackground component
import { InteractiveBackground } from './components/InteractiveBackground';

const Admin = lazy(() => import("@/pages/Admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

function HomePage() {
  const [currentSection, setCurrentSection] = useState('home');

  const handleSectionChange = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentSection(section);
    }
  };

  useEffect(() => {
    const sections = ['home', 'about', 'vision', 'team', 'events', 'contact'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (sections.includes(id)) {
              setCurrentSection(id);
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-100px 0px -80px 0px' 
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="min-h-screen text-white relative z-10 pt-24">
      <Navigation 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange} 
      />
      <section id="home"><HeroSection /></section>
      <section id="about"><AboutSection /></section>
      <section id="vision"><VisionSection /></section>
      <section id="team"><TeamSection /></section>
      <section id="events"><EventsSection /></section>
      <section id="contact"><ContactForm /></section>
      
      {/* Restored Footer Section */}
      <footer className="relative border-t border-primary/20 overflow-hidden bg-black">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <Logo className="w-20 h-20" />
                <div>
                  <h3 className="text-2xl font-bold text-white">E-Cell VJIT</h3>
                  <p className="text-primary text-sm">Innovation • Entrepreneurship • Future</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Fostering the next generation of entrepreneurs through innovation, mentorship, and collaborative growth at Vignan's Institute of Information Technology.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['About', 'Vision', 'Team', 'Contact'].map((link) => (
                  <motion.li key={link}>
                    <motion.button
                      onClick={() => handleSectionChange(link.toLowerCase())}
                      className="text-gray-400 hover:text-primary transition-colors duration-300 text-left"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link}
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <div className="space-y-3">
                <motion.div
                  className="flex items-center gap-3 text-gray-400"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">ecell@vjit.ac.in</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3 text-gray-400"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">VJIT Campus, Hyderabad</span>
                </motion.div>
                <div className="flex gap-3 mt-4">
                  {['Instagram', 'LinkedIn', 'Twitter'].map((platform, index) => (
                    <motion.button
                      key={platform}
                      className="w-10 h-10 bg-card border border-card-border rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all duration-300"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        boxShadow: [
                          '0 0 0px rgba(216, 32, 50, 0)',
                          '0 0 10px rgba(216, 32, 50, 0.2)',
                          '0 0 0px rgba(216, 32, 50, 0)'
                        ]
                      }}
                      transition={{
                        boxShadow: {
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5
                        }
                      }}
                    >
                      <span className="text-xs font-bold">{platform[0]}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div
            className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>© 2024 E-Cell VJIT.</span>
              <span>All rights reserved.</span>
            </div>
            
            <motion.div
              className="flex items-center gap-2 text-xs text-gray-500"
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
              <span>Inspiring Innovation</span>
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <InteractiveBackground />
          <Toaster />
          <Suspense fallback={<Loading />}>
            <Router />
          </Suspense>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
