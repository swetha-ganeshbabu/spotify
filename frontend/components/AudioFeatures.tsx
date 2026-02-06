"use client";

import { motion } from "framer-motion";
import Card from "./ui/Card";
import { AudioFeatures as AudioFeaturesType } from "@/lib/types";
import { normalizeValue } from "@/lib/utils";

interface AudioFeaturesProps {
  features: AudioFeaturesType;
}

const FEATURE_CONFIG = [
  { key: "energy" as const, label: "Energy", min: 0, max: 1 },
  { key: "valence" as const, label: "Happiness", min: 0, max: 1 },
  { key: "danceability" as const, label: "Danceability", min: 0, max: 1 },
  { key: "acousticness" as const, label: "Acousticness", min: 0, max: 1 },
  { key: "tempo" as const, label: "Tempo", min: 60, max: 200 },
  {
    key: "instrumentalness" as const,
    label: "Instrumentalness",
    min: 0,
    max: 1,
  },
];

export default function AudioFeatures({ features }: AudioFeaturesProps) {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">Audio Features</h2>
      <div className="space-y-4">
        {FEATURE_CONFIG.map((config, index) => {
          const raw = features[config.key];
          const normalized = normalizeValue(raw, config.min, config.max);
          const percentage = Math.round(normalized * 100);

          return (
            <div key={config.key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-spotify-light">{config.label}</span>
                <span className="text-white font-medium">
                  {config.key === "tempo"
                    ? `${Math.round(raw)} BPM`
                    : `${percentage}%`}
                </span>
              </div>
              <div className="h-2 bg-spotify-card rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #1DB954, ${
                      percentage > 70 ? "#FFD700" : "#1DB954"
                    })`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
