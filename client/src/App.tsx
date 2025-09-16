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
import { InteractiveBackground } from './components/InteractiveBackground';
import { Instagram, Linkedin, Youtube } from 'lucide-react';

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
  
  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/ecell_vjit?utm_source=ig_web_button_share_sheet&igsh=ZGFzamRrMnZoejRm' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/e-cell-vjit/' },
    { icon: Youtube, href: 'https://youtube.com/@e-cellvjit?si=Hq10nBKwFHNVylZ0' }
  ];

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
      
      <footer className="relative border-t border-primary/20 overflow-hidden bg-black/50 backdrop-blur-lg">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <motion.div
              className="flex flex-col items-center md:items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-4">
                <Logo className="w-16 h-16" />
                <div>
                  <h3 className="text-2xl font-bold text-white">E-Cell VJIT</h3>
                  <p className="text-primary text-sm">Where Ideas Take Off</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-xs text-sm">
                Fostering the next generation of entrepreneurs through innovation, mentorship, and collaborative growth.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['About', 'Vision', 'Team', 'Events', 'Contact'].map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => handleSectionChange(link.toLowerCase())}
                      className="text-gray-400 hover:text-primary transition-colors duration-300"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-end"
            >
                <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
                <div className="flex gap-4">
                 {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-card/50 border border-card-border rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-colors duration-300"
                    whileHover={{ scale: 1.15, y: -4, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
          <motion.div
            className="pt-8 mt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4"
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