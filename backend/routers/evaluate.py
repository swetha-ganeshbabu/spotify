from fastapi import APIRouter, HTTPException
from models.schemas import EvalMetrics
from services.song_service import SongService
from services.llm_service import LLMService
from services.similarity_service import SimilarityService
from services.eval_service import EvalService

router = APIRouter()
song_service = SongService()
llm_service = LLMService()
similarity_service = SimilarityService(song_service)
eval_service = EvalService()


@router.get("/evaluate/{song_id}", response_model=EvalMetrics)
async def evaluate_analysis(song_id: str):
    """Evaluate the quality of AI analysis for a given song."""
    song_dict = song_service.get_song_by_id(song_id)
    if not song_dict:
        raise HTTPException(status_code=404, detail="Song not found")

    # Get the analysis (same as analyze endpoint)
    analysis_data = llm_service.analyze_song(song_dict)

    # Get similarity-based recommendations
    similar_songs = similarity_service.find_similar(song_id)

    # Compute evaluation metrics
    result = eval_service.evaluate(analysis_data, similar_songs)

    return EvalMetrics(**result)
