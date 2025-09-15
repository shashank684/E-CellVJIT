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
// Step 3.1: Import the new InteractiveBackground component
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
      <footer className="relative border-t border-primary/20 overflow-hidden bg-black">
        {/* ... Footer content remains unchanged ... */}
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
          {/* Step 3.2: Render the new InteractiveBackground */}
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
