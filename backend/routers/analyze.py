from fastapi import APIRouter, HTTPException
from models.schemas import (
    AnalyzeRequest,
    Song,
    AudioFeatures,
    SongAnalysisResponse,
    Analysis,
    LyricsSection,
    CulturalContext,
    Reference,
    ProductionAnalysis,
    SimilarSong,
    EmotionalArc,
    EmotionalArcSection,
)
from services.song_service import SongService
from services.mood_service import MoodService
from services.image_service import ImageService
from services.llm_service import LLMService
from services.similarity_service import SimilarityService
from services.sentiment_service import SentimentService

router = APIRouter()
song_service = SongService()
mood_service = MoodService()
image_service = ImageService()
llm_service = LLMService()
similarity_service = SimilarityService(song_service)
sentiment_service = SentimentService()


@router.post("/analyze", response_model=SongAnalysisResponse)
async def analyze_song(request: AnalyzeRequest):
    # Try finding by ID first
    song_dict = song_service.get_song_by_id(request.song_query)

    # If not found by ID, search and take first result
    if not song_dict:
        results = song_service.search(request.song_query, limit=1)
        if results:
            song_dict = song_service.get_song_by_id(results[0].id)

    if not song_dict:
        raise HTTPException(status_code=404, detail="Song not found")

    # Build Song model
    song = Song(
        id=song_dict["id"],
        title=song_dict["title"],
        artist=song_dict["artist"],
        album=song_dict["album"],
        album_art=song_dict["album_art"],
        duration_ms=song_dict["duration_ms"],
        preview_url=song_dict.get("preview_url"),
        release_date=song_dict["release_date"],
    )

    # Audio features
    audio_features = AudioFeatures(**song_dict["audio_features"])

    # Mood
    mood = mood_service.analyze_mood(audio_features)

    # LLM analysis (supports variant A/B for prompt comparison)
    variant = request.variant if request.variant in ("A", "B") else "A"
    analysis_data = llm_service.analyze_song(song_dict, variant=variant)

    # Parse analysis into models
    analysis = Analysis(
        lyrics_breakdown=[
            LyricsSection(**s) for s in analysis_data["lyrics_breakdown"]
        ],
        cultural_context=CulturalContext(
            historical_background=analysis_data["cultural_context"][
                "historical_background"
            ],
            references=[
                Reference(**r)
                for r in analysis_data["cultural_context"]["references"]
            ],
            cultural_impact=analysis_data["cultural_context"]["cultural_impact"],
        ),
        production_analysis=ProductionAnalysis(
            **analysis_data["production_analysis"]
        ),
        why_it_matters=analysis_data["why_it_matters"],
    )

    # Use ML-based cosine similarity on audio features for similar songs
    similar_songs_data = similarity_service.find_similar(song_dict["id"])
    if similar_songs_data:
        similar_songs = [SimilarSong(**s) for s in similar_songs_data]
    else:
        # Fallback to LLM-suggested songs if similarity service returns nothing
        similar_songs = [SimilarSong(**s) for s in analysis_data["similar_songs"]]

    # Collect themes from lyrics breakdown
    all_themes = []
    for section in analysis_data["lyrics_breakdown"]:
        all_themes.extend(section.get("themes", []))

    # Artwork
    artwork = image_service.generate_artwork(
        mood=mood,
        themes=all_themes,
        title=song.title,
        artist=song.artist,
    )

    # Compute emotional arc using sentiment analysis on lyrics sections
    arc_data = sentiment_service.compute_emotional_arc(analysis_data["lyrics_breakdown"])
    emotional_arc = EmotionalArc(
        scores=[EmotionalArcSection(**s) for s in arc_data["scores"]],
        overall=arc_data["overall"],
        arc_shape=arc_data["arc_shape"],
    )

    return SongAnalysisResponse(
        song=song,
        audio_features=audio_features,
        mood=mood,
        analysis=analysis,
        generated_artwork=artwork,
        similar_songs=similar_songs,
        emotional_arc=emotional_arc,
        prompt_variant=variant,
        is_live=llm_service.has_live_client,
    )
