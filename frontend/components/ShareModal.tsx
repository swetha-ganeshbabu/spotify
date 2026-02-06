"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";

interface ShareModalProps {
  songTitle: string;
  artist: string;
}

export default function ShareModal({ songTitle, artist }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyUrl() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareTwitter() {
    const text = encodeURIComponent(
      `Check out this analysis of "${songTitle}" by ${artist} on Song Story!`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Share
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Share this analysis</h3>

              <div className="space-y-3">
                <button
                  onClick={copyUrl}
                  className="w-full bg-spotify-card hover:bg-white/10 text-white rounded-lg px-4 py-3 text-sm text-left transition-colors"
                >
                  {copied ? "Copied!" : "Copy link"}
                </button>

                <button
                  onClick={shareTwitter}
                  className="w-full bg-spotify-card hover:bg-white/10 text-white rounded-lg px-4 py-3 text-sm text-left transition-colors"
                >
                  Share on Twitter / X
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 text-spotify-light text-sm hover:text-white transition-colors w-full text-center"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
