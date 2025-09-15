import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
// Correctly import the logo from the @assets alias
import ecellLogo from '@assets/ecell-logo.svg';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <motion.div
      className={cn("w-10 h-10", className)}
      whileHover={{ scale: 1.1, rotate: 10 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Use an img tag to display your SVG logo */}
      <img 
        src={ecellLogo} 
        alt="E-Cell VJIT Logo" 
        className="w-full h-full" 
      />
    </motion.div>
  );
};

