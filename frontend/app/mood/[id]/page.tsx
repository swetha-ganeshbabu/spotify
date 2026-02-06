"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { analyzeSong } from "@/lib/api";
import { SongAnalysisResponse } from "@/lib/types";
import MoodGradient from "@/components/MoodGradient";
import EmotionalArc from "@/components/EmotionalArc";
import AudioFeatures from "@/components/AudioFeatures";
import BackToPortfolio from "@/components/BackToPortfolio";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

const SENTIMENT_COLORS: Record<string, string> = {
  bright: "#22c55e",
  warm: "#eab308",
  neutral: "#94a3b8",
  somber: "#f97316",
  dark: "#ef4444",
};

export default function MoodPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<SongAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    analyzeSong(id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-spotify-light text-sm">
            Analyzing emotional landscape...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error || "Something went wrong"}</p>
        <button
          onClick={() => router.push("/")}
          className="text-spotify-green hover:underline"
        >
          Go back home
        </button>
      </div>
    );
  }

  return (
    <>
      <MoodGradient colors={data.mood.gradient_colors} />

      <div className="pb-20">
        <div className="flex items-center justify-between pt-6 mb-8">
          <BackToPortfolio />
          <Badge className="bg-orange-500/10 text-orange-400">
            AFINN-style NLP Sentiment Analysis
          </Badge>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-sm uppercase tracking-wider text-spotify-light mb-2">
            Mood Journey
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">{data.song.title}</h1>
          <p className="text-lg text-spotify-light">{data.song.artist}</p>
        </motion.div>

        {/* Mood classification card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <h2 className="text-xl font-bold mb-4">Mood Classification</h2>
            <div className="flex flex-wrap gap-3 mb-3">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: data.mood.gradient_colors[0] + "20",
                  color: data.mood.gradient_colors[0],
                }}
              >
                {data.mood.primary}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-white/10 text-spotify-light">
                {data.mood.secondary}
              </span>
            </div>
            <p className="text-sm text-spotify-light leading-relaxed">
              {data.mood.mood_description}
            </p>
            <div className="mt-3 flex gap-2">
              {data.mood.gradient_colors.map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border border-white/10"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Emotional Arc */}
        {data.emotional_arc && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <EmotionalArc arc={data.emotional_arc} />
          </motion.div>
        )}

        {/* Section sentiment table */}
        {data.emotional_arc && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <Card>
              <h2 className="text-xl font-bold mb-4">Section Sentiments</h2>
              <div className="space-y-2">
                {data.emotional_arc.scores.map((s, i) => {
                  const color = SENTIMENT_COLORS[s.label] || "#94a3b8";
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3"
                    >
                      <span className="text-sm text-white font-medium">
                        {s.section}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-spotify-light">
                          {s.score > 0 ? "+" : ""}
                          {s.score.toFixed(2)}
                        </span>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: color + "20",
                            color: color,
                          }}
                        >
                          {s.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Audio features highlighting energy + valence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Mood Drivers</h2>
              <span className="text-xs text-spotify-light bg-white/5 px-2 py-1 rounded">
                Energy + Valence = Mood
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-spotify-green">
                  {Math.round(data.audio_features.energy * 100)}%
                </p>
                <p className="text-xs text-spotify-light mt-1">Energy</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {Math.round(data.audio_features.valence * 100)}%
                </p>
                <p className="text-xs text-spotify-light mt-1">Valence (Happiness)</p>
              </div>
            </div>
          </Card>
          <div className="mt-6">
            <AudioFeatures features={data.audio_features} />
          </div>
        </motion.div>
      </div>
    </>
  );
}
