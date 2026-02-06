"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchSimilarSongs } from "@/lib/api";
import { SimilarSongsResponse } from "@/lib/types";
import AudioFeatures from "@/components/AudioFeatures";
import BackToPortfolio from "@/components/BackToPortfolio";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { normalizeValue } from "@/lib/utils";

const FEATURE_KEYS = [
  { key: "energy" as const, label: "Energy", min: 0, max: 1 },
  { key: "valence" as const, label: "Happiness", min: 0, max: 1 },
  { key: "danceability" as const, label: "Danceability", min: 0, max: 1 },
  { key: "acousticness" as const, label: "Acousticness", min: 0, max: 1 },
  { key: "tempo" as const, label: "Tempo", min: 60, max: 200 },
  { key: "instrumentalness" as const, label: "Instrumentalness", min: 0, max: 1 },
];

export default function DiscoverPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<SimilarSongsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchSimilarSongs(id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-spotify-light text-sm">
            Computing audio similarities...
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
    <div className="pb-20">
      <div className="flex items-center justify-between pt-6 mb-8">
        <BackToPortfolio />
        <Badge className="bg-cyan-500/10 text-cyan-400">
          Cosine Similarity on Audio Feature Vectors
        </Badge>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 mb-8"
      >
        <Image
          src={data.target.album_art}
          alt={data.target.title}
          width={120}
          height={120}
          className="rounded-lg shadow-2xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/120x120/282828/B3B3B3?text=No+Art";
          }}
        />
        <div>
          <p className="text-sm uppercase tracking-wider text-spotify-light mb-1">
            Similar Vibes
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">{data.target.title}</h1>
          <p className="text-lg text-spotify-light">{data.target.artist}</p>
        </div>
      </motion.div>

      {/* Target audio features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <AudioFeatures features={data.target_features} />
      </motion.div>

      {/* Similar songs with feature comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-4">Similar Songs</h2>
        <div className="space-y-4">
          {data.similar_songs.map((song, songIdx) => (
            <Card key={songIdx}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{song.title}</h3>
                  <p className="text-sm text-spotify-light">{song.artist}</p>
                </div>
                {song.similarity_score != null && (
                  <span className="text-sm text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded font-medium">
                    {(song.similarity_score * 100).toFixed(0)}% match
                  </span>
                )}
              </div>
              <p className="text-xs text-spotify-light/60 mb-4">{song.reason}</p>

              {/* Side-by-side feature comparison */}
              <div className="space-y-3">
                {FEATURE_KEYS.map((config) => {
                  const targetVal = normalizeValue(
                    data.target_features[config.key],
                    config.min,
                    config.max
                  );
                  const similarVal = normalizeValue(
                    song.audio_features[config.key],
                    config.min,
                    config.max
                  );
                  return (
                    <div key={config.key}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-spotify-light">{config.label}</span>
                        <span className="text-spotify-light/50">
                          {Math.round(targetVal * 100)}% vs{" "}
                          {Math.round(similarVal * 100)}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-spotify-green"
                            style={{ width: `${targetVal * 100}%` }}
                          />
                        </div>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-cyan-400"
                            style={{ width: `${similarVal * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-[9px] mt-0.5">
                        <span className="text-spotify-green/60">
                          {data.target.title}
                        </span>
                        <span className="text-cyan-400/60">{song.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
