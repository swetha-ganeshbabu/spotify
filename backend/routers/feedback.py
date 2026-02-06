import logging
from fastapi import APIRouter
from models.schemas import FeedbackRequest, FeedbackResponse

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(request: FeedbackRequest):
    logger.info(
        f"Feedback received: song={request.song_id}, section={request.section}, "
        f"helpful={request.helpful}, comment={request.comment}"
    )
    return FeedbackResponse(success=True, message="Thank you for your feedback!")
