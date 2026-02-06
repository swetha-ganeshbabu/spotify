"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import { GeneratedArtwork as GeneratedArtworkType, Mood } from "@/lib/types";

interface GeneratedArtworkProps {
  artwork: GeneratedArtworkType;
  mood: Mood;
  songTitle: string;
  artist: string;
}

export default function GeneratedArtwork({
  artwork,
  mood,
  songTitle,
  artist,
}: GeneratedArtworkProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const colors = mood.gradient_colors;

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Mood Artwork</h2>

      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-sm aspect-square rounded-lg overflow-hidden">
          {/* Layered generative artwork using mood colors */}
          <div
            className="absolute inset-0 animate-gradient"
            style={{
              background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
              backgroundSize: "200% 200%",
            }}
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 30% 40%, ${colors[0]}cc, transparent 50%), radial-gradient(circle at 70% 60%, ${colors[2]}cc, transparent 50%)`,
            }}
          />
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          {/* Song info overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl">
                {mood.primary === "Euphoric" && "\u2728"}
                {mood.primary === "Intense" && "\uD83D\uDD25"}
                {mood.primary === "Peaceful" && "\uD83C\uDF3F"}
                {mood.primary === "Melancholic" && "\uD83C\uDF19"}
              </div>
              <p className="text-white/90 font-bold text-lg drop-shadow-lg">
                {songTitle}
              </p>
              <p className="text-white/60 text-sm drop-shadow-lg">{artist}</p>
              <div className="flex gap-2 justify-center">
                <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white/80 text-xs">
                  {mood.primary}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white/80 text-xs">
                  {mood.secondary}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        <p className="text-spotify-light text-sm">
          Style: <span className="text-white capitalize">{artwork.style}</span>
        </p>

        <button
          onClick={() => setShowPrompt(!showPrompt)}
          className="text-spotify-green text-xs hover:underline"
        >
          {showPrompt ? "Hide prompt" : "Show generation prompt"}
        </button>

        {showPrompt && (
          <p className="text-spotify-light/60 text-xs italic bg-white/5 rounded-lg p-3 w-full">
            {artwork.prompt_used}
          </p>
        )}
      </div>
    </Card>
  );
}
