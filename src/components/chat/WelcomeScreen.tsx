import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { useEcosystemStore } from '@/stores/ecosystemStore';
interface WelcomeScreenProps {
  onCriticalPathSelect: (pathId: string) => void;
}
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onCriticalPathSelect }) => {
  const { criticalPaths } = useEcosystemStore();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
      >
        <h1 className="text-6xl font-display text-primary">CYNQ</h1>
      </motion.div>
      <h2 className="mt-6 text-4xl md:text-5xl font-display text-foreground">
        Welcome to CYNQ
      </h2>
      <p className="mt-2 text-lg text-muted-foreground max-w-md">
        Select a Critical Path to set your context, or start a new consultation.
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {criticalPaths.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <Button
              variant="outline"
              className="w-full h-full text-left justify-start p-4 rounded-xl border-2 border-dashed hover:border-solid hover:bg-primary/5 hover:border-primary transition-all duration-200"
              onClick={() => onCriticalPathSelect(path.id)}
            >
              <Flag className="w-5 h-5 mr-3 text-accent flex-shrink-0" />
              <span className="text-sm font-medium text-foreground whitespace-normal">{path.title}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};