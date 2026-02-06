from fastapi import APIRouter, HTTPException
from models.schemas import SimilarSongsResponse
from services.song_service import SongService
from services.similarity_service import SimilarityService

router = APIRouter()
song_service = SongService()
similarity_service = SimilarityService(song_service)


@router.get("/similar/{song_id}", response_model=SimilarSongsResponse)
async def get_similar_songs(song_id: str):
    """Get similar songs with full audio features for comparison."""
    result = similarity_service.find_similar_with_features(song_id)
    if not result:
        raise HTTPException(status_code=404, detail="Song not found")
    return SimilarSongsResponse(**result)
