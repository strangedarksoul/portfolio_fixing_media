'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Compass, X } from 'lucide-react';

interface FloatingNavLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function FloatingNavLauncher({ isOpen, onToggle }: FloatingNavLauncherProps) {
  return (
    <motion.div
      className="fixed bottom-6 left-6 z-[60]"
      
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, type: "spring", bounce: 0.3 }}
    >
      <Button
        onClick={onToggle}
        size="lg"
        className={`relative w-16 h-16 rounded-full shadow-2xl transition-all duration-500 ${
          isOpen 
            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
        }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Compass className="w-6 h-6" />
          )}
        </motion.div>
        
        {/* Pulse animation when closed */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </Button>
    </motion.div>
  );
}