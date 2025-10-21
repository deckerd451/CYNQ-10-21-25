import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AnimatePresence } from 'framer-motion';
import { StepProfile } from './StepProfile';
import { StepEcosystem } from './StepEcosystem';
import { StepNavigationTour } from './StepNavigationTour';
import { StepFinish } from './StepFinish';
import { Progress } from '@/components/ui/progress';
interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const steps = [
  { id: 1, title: "Welcome to CYNQ!", description: "First, let's set up your profile. This helps CYNQ understand your context to provide personalized insights." },
  { id: 2, title: "Seed Your Ecosystem", description: "Add a few key people, events, or communities. This gives CYNQ a starting point to work with." },
  { id: 3, title: "Navigate Your Hub", description: "Get a quick tour of the main features you'll be using to build your ecosystem." },
  { id: 4, title: "You're All Set!", description: "Your personalized AI consultant is ready to help you navigate your ecosystem." },
];
export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const activeStep = steps[currentStep - 1];
  const progressValue = (currentStep / steps.length) * 100;
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-8" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-2xl font-display">{activeStep.title}</DialogTitle>
          <DialogDescription>{activeStep.description}</DialogDescription>
        </DialogHeader>
        <Progress value={progressValue} className="w-full mb-8" />
        <div className="min-h-[320px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <StepProfile key="step1" onNext={handleNext} />}
            {currentStep === 2 && <StepEcosystem key="step2" onNext={handleNext} onBack={handleBack} />}
            {currentStep === 3 && <StepNavigationTour key="step3" onNext={handleNext} onBack={handleBack} />}
            {currentStep === 4 && <StepFinish key="step4" onFinish={onClose} onBack={handleBack} />}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};