from pydantic import BaseModel
from typing import Optional


class Song(BaseModel):
    id: str
    title: str
    artist: str
    album: str
    album_art: str
    duration_ms: int
    preview_url: Optional[str] = None
    release_date: str


class AudioFeatures(BaseModel):
    energy: float
    valence: float
    tempo: float
    danceability: float
    acousticness: float
    instrumentalness: float
    loudness: float


class Mood(BaseModel):
    primary: str
    secondary: str
    gradient_colors: list[str]
    mood_description: str


class LyricsSection(BaseModel):
    section: str
    timestamp: str
    lyrics: str
    analysis: str
    themes: list[str]


class Reference(BaseModel):
    term: str
    explanation: str


class CulturalContext(BaseModel):
    historical_background: str
    references: list[Reference]
    cultural_impact: str


class ProductionAnalysis(BaseModel):
    overview: str
    techniques: list[str]
    instruments: list[str]
    notable_elements: str


class Analysis(BaseModel):
    lyrics_breakdown: list[LyricsSection]
    cultural_context: CulturalContext
    production_analysis: ProductionAnalysis
    why_it_matters: str


class GeneratedArtwork(BaseModel):
    url: str
    prompt_used: str
    style: str


class SimilarSong(BaseModel):
    title: str
    artist: str
    reason: str
    similarity_score: Optional[float] = None


class SimilarSongWithFeatures(BaseModel):
    title: str
    artist: str
    reason: str
    similarity_score: Optional[float] = None
    audio_features: AudioFeatures


class EmotionalArcSection(BaseModel):
    section: str
    score: float
    label: str


class EmotionalArc(BaseModel):
    scores: list[EmotionalArcSection]
    overall: float
    arc_shape: str


class SongAnalysisResponse(BaseModel):
    song: Song
    audio_features: AudioFeatures
    mood: Mood
    analysis: Analysis
    generated_artwork: GeneratedArtwork
    similar_songs: list[SimilarSong]
    emotional_arc: Optional[EmotionalArc] = None
    prompt_variant: str = "A"
    is_live: bool = False


class MetricDetail(BaseModel):
    score: float
    detail: str
    description: str


class EvalMetrics(BaseModel):
    metrics: dict[str, MetricDetail]
    overall_score: float
    grade: str


class AnalyzeRequest(BaseModel):
    song_query: str
    variant: Optional[str] = "A"


class SearchResult(BaseModel):
    id: str
    title: str
    artist: str
    album_art_small: str


class SearchResponse(BaseModel):
    results: list[SearchResult]


class SimilarSongsResponse(BaseModel):
    target: Song
    target_features: AudioFeatures
    similar_songs: list[SimilarSongWithFeatures]


class FeedbackRequest(BaseModel):
    song_id: str
    section: str
    helpful: bool
    comment: Optional[str] = None


class FeedbackResponse(BaseModel):
    success: bool
    message: str
