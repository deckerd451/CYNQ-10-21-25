import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Globe, Users, QrCode, Upload, Settings } from 'lucide-react';
interface StepNavigationTourProps {
  onNext: () => void;
  onBack: () => void;
}
const tourItems = [
  { icon: <Globe className="w-5 h-5 text-primary" />, title: "My Ecosystem", description: "Visualize and manage your personal data map." },
  { icon: <Users className="w-5 h-5 text-primary" />, title: "Community", description: "Leverage shared knowledge and insights." },
  { icon: <QrCode className="w-5 h-5 text-primary" />, title: "CYNQ Snapshot", description: "Generate a QR code to share your ecosystem." },
  { icon: <Upload className="w-5 h-5 text-primary" />, title: "Import Snapshot", description: "Scan or paste a snapshot to grow your map." },
  { icon: <Settings className="w-5 h-5 text-primary" />, title: "My Profile", description: "Update your goals, interests, and background." },
];
export const StepNavigationTour: React.FC<StepNavigationTourProps> = ({ onNext, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <ul className="space-y-3">
        {tourItems.map((item, index) => (
          <motion.li
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
          >
            <div className="flex-shrink-0">{item.icon}</div>
            <div>
              <h4 className="font-semibold text-sm">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </motion.li>
        ))}
      </ul>
      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onBack}>Back</Button>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Button type="button" size="lg" onClick={onNext}>Next</Button>
        </motion.div>
      </div>
    </motion.div>
  );
};