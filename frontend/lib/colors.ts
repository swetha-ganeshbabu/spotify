export const MOOD_COLORS: Record<string, string[]> = {
  Euphoric: ["#FF6B35", "#FFD700", "#FF1493"],
  Intense: ["#DC143C", "#8B0000", "#FF4500"],
  Peaceful: ["#87CEEB", "#98FB98", "#DDA0DD"],
  Melancholic: ["#191970", "#4B0082", "#2F4F4F"],
};

export function getMoodGradientStyle(colors: string[]): React.CSSProperties {
  if (!colors || colors.length === 0) {
    return { background: "#121212" };
  }
  return {
    background: `linear-gradient(135deg, ${colors.join(", ")}, #121212)`,
    backgroundSize: "200% 200%",
  };
}
