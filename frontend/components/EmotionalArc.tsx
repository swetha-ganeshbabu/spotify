"use client";

import { EmotionalArc as EmotionalArcType } from "@/lib/types";
import Card from "@/components/ui/Card";

interface EmotionalArcProps {
  arc: EmotionalArcType;
}

const LABEL_COLORS: Record<string, string> = {
  bright: "#22c55e",
  warm: "#eab308",
  neutral: "#94a3b8",
  somber: "#f97316",
  dark: "#ef4444",
};

const ARC_SHAPE_DESCRIPTIONS: Record<string, string> = {
  ascending: "Builds from darker to brighter tones",
  descending: "Moves from brightness into shadow",
  peak: "Rises to an emotional peak mid-song",
  valley: "Dips into darkness before recovering",
  steady: "Maintains a consistent emotional tone",
  unknown: "Emotional trajectory unclear",
};

export default function EmotionalArc({ arc }: EmotionalArcProps) {
  if (!arc.scores.length) return null;

  const maxAbsScore = Math.max(
    0.5,
    ...arc.scores.map((s) => Math.abs(s.score))
  );

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Emotional Arc</h2>
        <span className="text-xs text-spotify-light bg-white/5 px-2 py-1 rounded">
          NLP Sentiment Analysis
        </span>
      </div>

      <p className="text-spotify-light text-xs mb-4">
        {ARC_SHAPE_DESCRIPTIONS[arc.arc_shape] || ARC_SHAPE_DESCRIPTIONS.unknown}
        {" "}— overall sentiment:{" "}
        <span
          className="font-medium"
          style={{
            color:
              arc.overall > 0.1
                ? "#22c55e"
                : arc.overall < -0.1
                  ? "#ef4444"
                  : "#94a3b8",
          }}
        >
          {arc.overall > 0 ? "+" : ""}
          {arc.overall.toFixed(2)}
        </span>
      </p>

      {/* Line chart visualization */}
      <div className="relative h-40 mb-4">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="border-b border-white/5 text-[10px] text-spotify-light/40 pl-1">
            +{maxAbsScore.toFixed(1)}
          </div>
          <div className="border-b border-white/10 text-[10px] text-spotify-light/40 pl-1">
            0
          </div>
          <div className="text-[10px] text-spotify-light/40 pl-1">
            -{maxAbsScore.toFixed(1)}
          </div>
        </div>

        {/* Chart area */}
        <svg
          viewBox={`0 0 ${arc.scores.length * 100} 200`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Zero line */}
          <line
            x1="0"
            y1="100"
            x2={arc.scores.length * 100}
            y2="100"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {/* Area fill */}
          <path
            d={`M ${arc.scores
              .map((s, i) => {
                const x = i * 100 + 50;
                const y = 100 - (s.score / maxAbsScore) * 90;
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ")} L ${(arc.scores.length - 1) * 100 + 50} 100 L 50 100 Z`}
            fill="url(#arcGradient)"
            opacity="0.2"
          />

          {/* Line */}
          <polyline
            points={arc.scores
              .map((s, i) => {
                const x = i * 100 + 50;
                const y = 100 - (s.score / maxAbsScore) * 90;
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {arc.scores.map((s, i) => {
            const x = i * 100 + 50;
            const y = 100 - (s.score / maxAbsScore) * 90;
            const color = LABEL_COLORS[s.label] || "#94a3b8";
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="6"
                fill={color}
                stroke="#121212"
                strokeWidth="2"
              />
            );
          })}

          <defs>
            <linearGradient id="arcGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              {arc.scores.map((s, i) => (
                <stop
                  key={i}
                  offset={`${(i / Math.max(1, arc.scores.length - 1)) * 100}%`}
                  stopColor={LABEL_COLORS[s.label] || "#94a3b8"}
                />
              ))}
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Section labels */}
      <div className="flex justify-between gap-1">
        {arc.scores.map((s, i) => (
          <div key={i} className="text-center flex-1 min-w-0">
            <p className="text-[10px] text-spotify-light truncate">
              {s.section}
            </p>
            <p
              className="text-xs font-medium"
              style={{ color: LABEL_COLORS[s.label] || "#94a3b8" }}
            >
              {s.label}
            </p>
            <p className="text-[10px] text-spotify-light/60">
              {s.score > 0 ? "+" : ""}
              {s.score.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
