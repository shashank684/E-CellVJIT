import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';

interface NavigationProps {
  currentSection?: string;
  onSectionChange?: (section: string) => void;
}

const navItems = [
  { label: 'About', id: 'about' },
  { label: 'Vision', id: 'vision' },
  { label: 'Team', id: 'team' },
  { label: 'Events', id: 'events' },
  { label: 'Contact', id: 'contact' }
];

const PaperPlaneIcon = (props: { className?: string; animate: 'open' | 'closed' }) => (
    <motion.svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <motion.path
            d="M22 2L11 13"
            variants={{ open: { d: "M22 2 L 11 13" }, closed: { d: "M3 12 L 21 12" } }}
        />
        <motion.path
            d="M22 2L15 22L11 13L2 9L22 2Z"
            variants={{ open: { d: "M22 2 L 15 22 L 11 13 L 2 9 L 22 2Z" }, closed: { d: "M3 6 L 21 6" } }}
        />
        <motion.path
            d="M3 18 L 21 18"
            variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}
            transition={{ duration: 0.1 }}
        />
    </motion.svg>
);

export default function Navigation({ currentSection, onSectionChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    onSectionChange?.(sectionId);
  };

  const activeItemId = hoveredItemId || currentSection;
  const activeItemIndex = navItems.findIndex(item => item.id === activeItemId);
  const activeItemRef = itemRefs.current[activeItemIndex];

  return (
    <>
      <motion.header
        // Changed to be a full-width container for stable positioning
        className="fixed top-0 left-0 right-0 z-50 pt-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
      >
        <nav 
          className="w-[95vw] max-w-4xl mx-auto px-4 py-2 flex items-center justify-between bg-black/30 backdrop-blur-lg border border-white/10 rounded-full shadow-lg"
          role="navigation"
          onMouseLeave={() => setHoveredItemId(null)}
        >
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            whileTap={{ scale: 0.9, rotate: -10 }}
            onClick={() => onSectionChange?.('home')}
          >
            <Logo className="w-10 h-10" />
            <span className="text-white font-semibold text-lg hidden sm:block">E-Cell VJIT</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-2 relative">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                ref={el => itemRefs.current[index] = el}
                onClick={() => handleNavClick(item.id)}
                onHoverStart={() => setHoveredItemId(item.id)}
                className="relative text-white px-4 py-2 text-sm font-medium transition-colors duration-300 z-10"
                aria-current={currentSection === item.id ? "page" : undefined}
                whileHover={{ y: -2 }}
              >
                <span className="relative z-10">{item.label}</span>

                {activeItemId === item.id && (
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        layoutId="neon-trail"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ filter: 'blur(3px)' }}
                    />
                )}
              </motion.button>
            ))}
            
            {activeItemId && activeItemRef && (
                <motion.div
                    className="absolute bg-primary/20 border border-primary/50 rounded-full -z-1"
                    layoutId="orbital-indicator"
                    initial={false}
                    animate={{
                        left: activeItemRef.offsetLeft,
                        width: activeItemRef.offsetWidth,
                        height: activeItemRef.offsetHeight,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                    }}
                />
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-primary rounded-full w-10 h-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <PaperPlaneIcon 
                className="w-6 h-6" 
                animate={isMobileMenuOpen ? "open" : "closed"}
              />
            </Button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-white text-3xl font-medium hover:text-primary transition-colors"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
            <motion.div 
              className="absolute bottom-10 left-0 text-primary"
              initial={{ x: "-100%" }}
              animate={{ x: "100vw" }}
              transition={{ duration: 1, ease: 'easeInOut', delay: 0.3 }}
            >
              <PaperPlaneIcon className="w-8 h-8" animate="open" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
