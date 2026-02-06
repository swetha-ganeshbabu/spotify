"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  "Finding song data...",
  "Analyzing audio features...",
  "Breaking down lyrics...",
  "Exploring cultural context...",
  "Generating artwork...",
];

export default function LoadingExperience() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-full border-4 border-spotify-card border-t-spotify-green"
      />

      <div className="w-64">
        <div className="h-1 bg-spotify-card rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-spotify-green rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-spotify-light text-sm"
        >
          {STEPS[currentStep]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
