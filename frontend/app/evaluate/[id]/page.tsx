"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchEvalMetrics } from "@/lib/api";
import { EvalMetrics as EvalMetricsType } from "@/lib/types";
import EvalMetricsComponent from "@/components/EvalMetrics";
import BackToPortfolio from "@/components/BackToPortfolio";
import Card from "@/components/ui/Card";

export default function EvaluatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [metrics, setMetrics] = useState<EvalMetricsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchEvalMetrics(id)
      .then(setMetrics)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-spotify-light text-sm">Computing evaluation metrics...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
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
      <div className="flex items-center gap-4 pt-6 mb-8">
        <BackToPortfolio />
        <span className="text-spotify-light/30">|</span>
        <button
          onClick={() => router.push(`/song/${id}`)}
          className="text-spotify-light hover:text-white text-sm transition-colors"
        >
          &larr; Back to analysis
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <span className="text-xs text-spotify-light bg-white/5 px-2 py-1 rounded">
            AI Evaluation Dashboard
          </span>
          <h1 className="text-3xl font-bold mt-3">Analysis Quality Metrics</h1>
          <p className="text-spotify-light text-sm mt-2 max-w-lg mx-auto">
            Evaluating the AI-generated analysis using coverage, diversity,
            depth, and confidence metrics — demonstrating how AI systems are
            assessed for quality.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card>
          <EvalMetricsComponent metrics={metrics} />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6"
      >
        <Card>
          <h2 className="text-lg font-bold mb-3">How This Evaluation Works</h2>
          <div className="space-y-3 text-sm text-spotify-light">
            <p>
              This dashboard measures the quality of our AI analysis across six
              dimensions. Each metric is scored from 0 to 1 and contributes to a
              weighted overall score.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white font-medium text-xs mb-1">
                  ML Metrics (Automated)
                </p>
                <p className="text-xs text-spotify-light/80">
                  Coverage, theme diversity, and reference depth are computed
                  algorithmically from the structured output.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white font-medium text-xs mb-1">
                  Similarity Confidence
                </p>
                <p className="text-xs text-spotify-light/80">
                  Measures cosine similarity scores from our audio feature
                  vectors, showing how confident the ML model is in its
                  recommendations.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
