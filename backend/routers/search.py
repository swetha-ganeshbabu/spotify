from fastapi import APIRouter, Query
from models.schemas import SearchResponse
from services.song_service import SongService

router = APIRouter()
song_service = SongService()


@router.get("/search", response_model=SearchResponse)
async def search_songs(q: str = Query("", min_length=1)):
    results = song_service.search(q)
    return SearchResponse(results=results)
