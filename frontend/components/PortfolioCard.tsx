"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "./ui/Badge";

interface PortfolioCardProps {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  technique: string;
  gradientFrom: string;
  gradientTo: string;
  previewContent?: ReactNode;
  onClick: () => void;
  delay?: number;
}

export default function PortfolioCard({
  icon,
  title,
  subtitle,
  description,
  technique,
  gradientFrom,
  gradientTo,
  previewContent,
  onClick,
  delay = 0,
}: PortfolioCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="relative glass-card p-6 cursor-pointer overflow-hidden group transition-all duration-300 hover:border-white/20"
    >
      {/* Gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <span className="text-2xl">{icon}</span>
          <Badge className="text-[10px]">{technique}</Badge>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-spotify-light mb-2">{subtitle}</p>
        <p className="text-xs text-spotify-light/60 leading-relaxed">
          {description}
        </p>

        {/* Hover preview */}
        <AnimatePresence>
          {hovered && previewContent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              {previewContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
