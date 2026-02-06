"use client";

import { useState } from "react";
import { submitFeedback } from "@/lib/api";

interface FeedbackWidgetProps {
  songId: string;
  section: string;
}

export default function FeedbackWidget({
  songId,
  section,
}: FeedbackWidgetProps) {
  const [status, setStatus] = useState<"idle" | "up" | "down">("idle");

  async function handleFeedback(helpful: boolean) {
    const newStatus = helpful ? "up" : "down";
    setStatus(newStatus);
    try {
      await submitFeedback(songId, section, helpful);
    } catch {
      // Silently fail - feedback is non-critical
    }
  }

  return (
    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
      <span className="text-xs text-spotify-light/50">Was this helpful?</span>
      <button
        onClick={() => handleFeedback(true)}
        className={`text-sm transition-colors ${
          status === "up"
            ? "text-spotify-green"
            : "text-spotify-light/50 hover:text-white"
        }`}
      >
        &#x1F44D;
      </button>
      <button
        onClick={() => handleFeedback(false)}
        className={`text-sm transition-colors ${
          status === "down"
            ? "text-red-400"
            : "text-spotify-light/50 hover:text-white"
        }`}
      >
        &#x1F44E;
      </button>
    </div>
  );
}
