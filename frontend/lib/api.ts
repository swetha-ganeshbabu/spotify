import { SearchResponse, SongAnalysisResponse, EvalMetrics, SimilarSongsResponse } from "./types";

export async function searchSongs(query: string): Promise<SearchResponse> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function analyzeSong(
  songQuery: string,
  variant: string = "A"
): Promise<SongAnalysisResponse> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ song_query: songQuery, variant }),
  });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}

export async function fetchEvalMetrics(
  songId: string
): Promise<EvalMetrics> {
  const res = await fetch(`/api/evaluate/${encodeURIComponent(songId)}`);
  if (!res.ok) throw new Error("Evaluation fetch failed");
  return res.json();
}

export async function fetchSimilarSongs(
  songId: string
): Promise<SimilarSongsResponse> {
  const res = await fetch(`/api/similar/${encodeURIComponent(songId)}`);
  if (!res.ok) throw new Error("Similar songs fetch failed");
  return res.json();
}

export async function submitFeedback(
  songId: string,
  section: string,
  helpful: boolean,
  comment?: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ song_id: songId, section, helpful, comment }),
  });
  if (!res.ok) throw new Error("Feedback submission failed");
  return res.json();
}
