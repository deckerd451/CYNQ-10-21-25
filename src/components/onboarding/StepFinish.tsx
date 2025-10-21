import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MessageSquare } from 'lucide-react';
interface StepFinishProps {
  onFinish: () => void;
  onBack: () => void;
}
export const StepFinish: React.FC<StepFinishProps> = ({ onFinish, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="text-center flex flex-col items-center"
    >
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-foreground">You're all set!</h2>
      <p className="text-muted-foreground mt-2 max-w-xs">
        Congratulations on setting up your profile. CYNQ is now ready to provide you with personalized insights.
      </p>
      <div className="flex items-center gap-4 mt-8">
        <Button type="button" variant="ghost" onClick={onBack}>Back</Button>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Button size="lg" className="font-bold" onClick={onFinish}>
            <MessageSquare className="w-5 h-5 mr-2" />
            Start Your First Consultation
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};