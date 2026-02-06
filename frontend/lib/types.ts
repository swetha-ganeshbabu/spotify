export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  album_art: string;
  duration_ms: number;
  preview_url: string | null;
  release_date: string;
}

export interface AudioFeatures {
  energy: number;
  valence: number;
  tempo: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  loudness: number;
}

export interface Mood {
  primary: string;
  secondary: string;
  gradient_colors: string[];
  mood_description: string;
}

export interface LyricsSection {
  section: string;
  timestamp: string;
  lyrics: string;
  analysis: string;
  themes: string[];
}

export interface Reference {
  term: string;
  explanation: string;
}

export interface CulturalContext {
  historical_background: string;
  references: Reference[];
  cultural_impact: string;
}

export interface ProductionAnalysis {
  overview: string;
  techniques: string[];
  instruments: string[];
  notable_elements: string;
}

export interface Analysis {
  lyrics_breakdown: LyricsSection[];
  cultural_context: CulturalContext;
  production_analysis: ProductionAnalysis;
  why_it_matters: string;
}

export interface GeneratedArtwork {
  url: string;
  prompt_used: string;
  style: string;
}

export interface SimilarSong {
  title: string;
  artist: string;
  reason: string;
  similarity_score?: number;
}

export interface EmotionalArcSection {
  section: string;
  score: number;
  label: string;
}

export interface EmotionalArc {
  scores: EmotionalArcSection[];
  overall: number;
  arc_shape: string;
}

export interface SimilarSongWithFeatures {
  title: string;
  artist: string;
  reason: string;
  similarity_score?: number;
  audio_features: AudioFeatures;
}

export interface SimilarSongsResponse {
  target: Song;
  target_features: AudioFeatures;
  similar_songs: SimilarSongWithFeatures[];
}

export interface SongAnalysisResponse {
  song: Song;
  audio_features: AudioFeatures;
  mood: Mood;
  analysis: Analysis;
  generated_artwork: GeneratedArtwork;
  similar_songs: SimilarSong[];
  emotional_arc?: EmotionalArc;
  prompt_variant: string;
  is_live: boolean;
}

export interface SearchResult {
  id: string;
  title: string;
  artist: string;
  album_art_small: string;
}

export interface SearchResponse {
  results: SearchResult[];
}

export interface MetricDetail {
  score: number;
  detail: string;
  description: string;
}

export interface EvalMetrics {
  metrics: Record<string, MetricDetail>;
  overall_score: number;
  grade: string;
}
