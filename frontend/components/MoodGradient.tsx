"use client";

import { motion } from "framer-motion";
import { getMoodGradientStyle } from "@/lib/colors";

interface MoodGradientProps {
  colors: string[];
}

export default function MoodGradient({ colors }: MoodGradientProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 -z-10"
    >
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          ...getMoodGradientStyle(colors),
          backgroundSize: "200% 200%",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-spotify-black/70 to-spotify-black" />
    </motion.div>
  );
}
