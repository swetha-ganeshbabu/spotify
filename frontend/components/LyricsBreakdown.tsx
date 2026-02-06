"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import FeedbackWidget from "./FeedbackWidget";
import { LyricsSection } from "@/lib/types";

interface LyricsBreakdownProps {
  sections: LyricsSection[];
  songId: string;
}

export default function LyricsBreakdown({
  sections,
  songId,
}: LyricsBreakdownProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">Lyrics Breakdown</h2>
      <div className="space-y-2">
        {sections.map((section, index) => (
          <div key={index} className="border border-white/5 rounded-lg overflow-hidden">
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? -1 : index)
              }
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-spotify-green text-xs font-mono">
                  {section.timestamp}
                </span>
                <span className="text-white font-medium text-sm">
                  {section.section}
                </span>
              </div>
              <motion.span
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                className="text-spotify-light text-lg"
              >
                &#x25BE;
              </motion.span>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3">
                    <p className="text-white/60 italic text-sm leading-relaxed">
                      &ldquo;{section.lyrics}&rdquo;
                    </p>
                    <p className="text-spotify-light text-sm leading-relaxed">
                      {section.analysis}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {section.themes.map((theme) => (
                        <Badge key={theme}>{theme}</Badge>
                      ))}
                    </div>
                    <FeedbackWidget
                      songId={songId}
                      section={section.section}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Card>
  );
}
