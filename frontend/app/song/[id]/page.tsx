"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { analyzeSong } from "@/lib/api";
import { SongAnalysisResponse } from "@/lib/types";
import LoadingExperience from "@/components/LoadingExperience";
import MoodGradient from "@/components/MoodGradient";
import SongHeader from "@/components/SongHeader";
import AudioFeatures from "@/components/AudioFeatures";
import LyricsBreakdown from "@/components/LyricsBreakdown";
import CulturalContext from "@/components/CulturalContext";
import ProductionAnalysis from "@/components/ProductionAnalysis";
import GeneratedArtwork from "@/components/GeneratedArtwork";
import ShareModal from "@/components/ShareModal";
import EmotionalArc from "@/components/EmotionalArc";
import BackToPortfolio from "@/components/BackToPortfolio";
import Card from "@/components/ui/Card";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

export default function SongPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<SongAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [variant, setVariant] = useState<"A" | "B">("A");
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    analyzeSong(id, variant)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => {
        setLoading(false);
        setSwitching(false);
      });
  }, [id, variant]);

  const handleVariantToggle = () => {
    setSwitching(true);
    setVariant((v) => (v === "A" ? "B" : "A"));
  };

  if (loading) return <LoadingExperience />;

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">
          {error || "Something went wrong"}
        </p>
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
        <div className="flex items-center justify-between pt-6">
          <BackToPortfolio />
          <ShareModal songTitle={data.song.title} artist={data.song.artist} />
        </div>

        <SongHeader song={data.song} mood={data.mood} />

        {/* Prompt A/B Toggle — only functional with live Claude API */}
        <div className="mt-6 flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-spotify-light">Prompt Style:</span>
            <span className="text-xs font-medium text-white">
              {data.prompt_variant === "A"
                ? "A — Detailed Analyst"
                : "B — Concise Critic"}
            </span>
          </div>
          {data.is_live ? (
            <button
              onClick={handleVariantToggle}
              disabled={switching}
              className="text-xs px-3 py-1 rounded bg-spotify-green/10 text-spotify-green hover:bg-spotify-green/20 transition-colors disabled:opacity-50"
            >
              {switching ? "Switching..." : "Try other style"}
            </button>
          ) : (
            <span className="text-[10px] text-spotify-light/60 italic">
              Live comparison available with Claude API key
            </span>
          )}
        </div>

        <div className="space-y-6 mt-8">
          <motion.div
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <AudioFeatures features={data.audio_features} />
          </motion.div>

          <motion.div
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <LyricsBreakdown
              sections={data.analysis.lyrics_breakdown}
              songId={data.song.id}
            />
          </motion.div>

          {data.emotional_arc && (
            <motion.div
              custom={2}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <EmotionalArc arc={data.emotional_arc} />
            </motion.div>
          )}

          <motion.div
            custom={3}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <CulturalContext context={data.analysis.cultural_context} />
          </motion.div>

          <motion.div
            custom={4}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <ProductionAnalysis production={data.analysis.production_analysis} />
          </motion.div>

          <motion.div
            custom={5}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <h2 className="text-xl font-bold mb-4">Why It Matters</h2>
              <p className="text-spotify-light text-sm leading-relaxed">
                {data.analysis.why_it_matters}
              </p>
            </Card>
          </motion.div>

          <motion.div
            custom={6}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <GeneratedArtwork
              artwork={data.generated_artwork}
              mood={data.mood}
              songTitle={data.song.title}
              artist={data.song.artist}
            />
          </motion.div>

          <motion.div
            custom={7}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Similar Songs</h2>
                <span className="text-xs text-spotify-light bg-white/5 px-2 py-1 rounded">
                  Cosine Similarity
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {data.similar_songs.map((song, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-medium text-sm">
                          {song.title}
                        </p>
                        <p className="text-spotify-light text-xs">{song.artist}</p>
                      </div>
                      {song.similarity_score != null && (
                        <span className="text-[10px] text-spotify-green bg-spotify-green/10 px-1.5 py-0.5 rounded font-medium">
                          {(song.similarity_score * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <p className="text-spotify-light/60 text-xs mt-2">
                      {song.reason}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            custom={8}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              href={`/evaluate/${data.song.id}`}
              className="block text-center py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-spotify-light hover:text-white transition-all"
            >
              View AI Evaluation Metrics &rarr;
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
