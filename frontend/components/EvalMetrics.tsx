"use client";

import { EvalMetrics as EvalMetricsType } from "@/lib/types";

interface EvalMetricsProps {
  metrics: EvalMetricsType;
}

const METRIC_LABELS: Record<string, string> = {
  coverage: "Coverage",
  theme_diversity: "Theme Diversity",
  reference_depth: "Reference Depth",
  analysis_depth: "Analysis Depth",
  production_detail: "Production Detail",
  similarity_confidence: "Similarity Confidence",
};

function scoreColor(score: number): string {
  if (score >= 0.8) return "#22c55e";
  if (score >= 0.6) return "#eab308";
  if (score >= 0.4) return "#f97316";
  return "#ef4444";
}

function gradeColor(grade: string): string {
  if (grade.startsWith("A")) return "#22c55e";
  if (grade.startsWith("B")) return "#eab308";
  if (grade.startsWith("C")) return "#f97316";
  return "#ef4444";
}

export default function EvalMetrics({ metrics }: EvalMetricsProps) {
  const metricEntries = Object.entries(metrics.metrics);

  return (
    <div className="space-y-8">
      {/* Overall grade */}
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 mb-3"
          style={{ borderColor: gradeColor(metrics.grade) }}
        >
          <span
            className="text-4xl font-bold"
            style={{ color: gradeColor(metrics.grade) }}
          >
            {metrics.grade}
          </span>
        </div>
        <p className="text-spotify-light text-sm">
          Overall Quality Score:{" "}
          <span className="text-white font-medium">
            {(metrics.overall_score * 100).toFixed(0)}%
          </span>
        </p>
      </div>

      {/* Individual metrics */}
      <div className="space-y-4">
        {metricEntries.map(([key, metric]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-white">
                {METRIC_LABELS[key] || key}
              </span>
              <span className="text-xs text-spotify-light">
                {metric.detail}
              </span>
            </div>

            {/* Bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${metric.score * 100}%`,
                  backgroundColor: scoreColor(metric.score),
                }}
              />
            </div>

            <p className="text-[11px] text-spotify-light/60">
              {metric.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
