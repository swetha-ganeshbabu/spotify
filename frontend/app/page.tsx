"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { analyzeSong } from "@/lib/api";
import { SongAnalysisResponse } from "@/lib/types";
import SongSearch from "@/components/SongSearch";
import PortfolioCard from "@/components/PortfolioCard";

function SongStoryPreview({ data }: { data: SongAnalysisResponse }) {
  const section = data.analysis.lyrics_breakdown[0];
  if (!section) return null;
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-spotify-light/40 uppercase tracking-wider">
        Preview: {section.section}
      </p>
      <p className="text-xs text-spotify-light line-clamp-3">
        {section.analysis}
      </p>
    </div>
  );
}

function SimilarVibesPreview({ data }: { data: SongAnalysisResponse }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] text-spotify-light/40 uppercase tracking-wider">
        Similar songs
      </p>
      {data.similar_songs.slice(0, 3).map((song, i) => (
        <div key={i} className="flex items-center justify-between">
          <span className="text-xs text-spotify-light truncate">
            {song.title} — {song.artist}
          </span>
          {song.similarity_score != null && (
            <span className="text-[10px] text-spotify-green ml-2 shrink-0">
              {(song.similarity_score * 100).toFixed(0)}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function MoodJourneyPreview({ data }: { data: SongAnalysisResponse }) {
  if (!data.emotional_arc) return null;
  const maxAbs = Math.max(
    0.5,
    ...data.emotional_arc.scores.map((s) => Math.abs(s.score))
  );
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] text-spotify-light/40 uppercase tracking-wider">
        Emotional arc
      </p>
      <div className="flex items-end gap-1 h-10">
        {data.emotional_arc.scores.map((s, i) => {
          const height = Math.abs(s.score / maxAbs) * 100;
          const color =
            s.score > 0.1
              ? "#22c55e"
              : s.score < -0.1
                ? "#ef4444"
                : "#94a3b8";
          return (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${Math.max(10, height)}%`,
                backgroundColor: color,
                opacity: 0.7,
              }}
            />
          );
        })}
      </div>
      <p className="text-[10px] text-spotify-light/50">
        {data.emotional_arc.arc_shape} arc — overall{" "}
        {data.emotional_arc.overall > 0 ? "+" : ""}
        {data.emotional_arc.overall.toFixed(2)}
      </p>
    </div>
  );
}

function AILabPreview({ data }: { data: SongAnalysisResponse }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] text-spotify-light/40 uppercase tracking-wider">
        Analysis stats
      </p>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-lg font-bold text-white">
            {data.analysis.lyrics_breakdown.length}
          </p>
          <p className="text-[10px] text-spotify-light/50">Sections</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">
            {data.similar_songs.length}
          </p>
          <p className="text-[10px] text-spotify-light/50">Similar</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">
            {data.emotional_arc?.scores.length ?? 0}
          </p>
          <p className="text-[10px] text-spotify-light/50">Arc pts</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [previewData, setPreviewData] =
    useState<SongAnalysisResponse | null>(null);

  useEffect(() => {
    analyzeSong("bohemian-rhapsody")
      .then(setPreviewData)
      .catch(() => {});
  }, []);

  const cards = [
    {
      icon: "\uD83C\uDFB5",
      title: "Song Story",
      subtitle: "AI-Powered Lyrics Analysis",
      description:
        "Deep dive into lyrics meaning, cultural context, and production techniques using prompt-engineered AI.",
      technique: "Prompt Engineering",
      gradientFrom: "#1DB954",
      gradientTo: "#1ed760",
      path: "/song/bohemian-rhapsody",
      preview: previewData ? <SongStoryPreview data={previewData} /> : null,
    },
    {
      icon: "\uD83C\uDF10",
      title: "Similar Vibes",
      subtitle: "Audio Feature Comparison",
      description:
        "Discover songs with similar sonic DNA through cosine similarity on audio feature vectors.",
      technique: "Cosine Similarity",
      gradientFrom: "#06b6d4",
      gradientTo: "#0891b2",
      path: "/discover/bohemian-rhapsody",
      preview: previewData ? <SimilarVibesPreview data={previewData} /> : null,
    },
    {
      icon: "\uD83C\uDF08",
      title: "Mood Journey",
      subtitle: "Emotional Sentiment Tracking",
      description:
        "Track how emotions evolve across a song using NLP sentiment analysis on lyrics.",
      technique: "NLP Sentiment",
      gradientFrom: "#f97316",
      gradientTo: "#eab308",
      path: "/mood/bohemian-rhapsody",
      preview: previewData ? <MoodJourneyPreview data={previewData} /> : null,
    },
    {
      icon: "\uD83E\uDDEA",
      title: "AI Lab",
      subtitle: "Quality Evaluation Metrics",
      description:
        "Measure AI analysis quality with coverage, diversity, depth, and confidence metrics.",
      technique: "ML Evaluation",
      gradientFrom: "#a855f7",
      gradientTo: "#7c3aed",
      path: "/evaluate/bohemian-rhapsody",
      preview: previewData ? <AILabPreview data={previewData} /> : null,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 gap-10">
      {/* Brand header */}
      <div className="text-center space-y-3">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold"
        >
          <span className="gradient-text">Song Story</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-spotify-light text-sm max-w-md mx-auto"
        >
          ML-powered music analysis portfolio
        </motion.p>
      </div>

      {/* 2x2 grid */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <PortfolioCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            subtitle={card.subtitle}
            description={card.description}
            technique={card.technique}
            gradientFrom={card.gradientFrom}
            gradientTo={card.gradientTo}
            previewContent={card.preview}
            onClick={() => router.push(card.path)}
            delay={0.2 + i * 0.1}
          />
        ))}
      </div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-xl"
      >
        <p className="text-sm text-spotify-light/50 text-center mb-3">
          Or search any song
        </p>
        <SongSearch />
      </motion.div>
    </div>
  );
}
