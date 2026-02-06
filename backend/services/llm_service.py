import json
import logging
import os
import re

from models.schemas import (
    Analysis,
    LyricsSection,
    CulturalContext,
    Reference,
    ProductionAnalysis,
    SimilarSong,
)
from prompts.analysis_prompt import (
    SYSTEM_PROMPT,
    SYSTEM_PROMPT_B,
    build_user_prompt,
    build_user_prompt_b,
)

logger = logging.getLogger(__name__)


class LLMService:
    def __init__(self):
        self._client = None
        api_key = os.getenv("ANTHROPIC_API_KEY", "")
        if api_key and api_key != "your-api-key-here":
            try:
                from anthropic import Anthropic

                self._client = Anthropic(api_key=api_key)
                logger.info("Claude API client initialized")
            except Exception as e:
                logger.warning(f"Failed to initialize Anthropic client: {e}")

        mock_path = os.path.join(
            os.path.dirname(__file__), "..", "data", "mock_analysis.json"
        )
        with open(mock_path) as f:
            self._mock_data = json.load(f)

    @property
    def has_live_client(self) -> bool:
        """Whether a live Claude API client is available."""
        return self._client is not None

    def analyze_song(self, song_dict: dict, variant: str = "A") -> dict:
        """Returns dict with keys: lyrics_breakdown, cultural_context, production_analysis, why_it_matters, similar_songs"""
        song_id = song_dict.get("id", "")

        if self._client:
            try:
                return self._call_claude(song_dict, variant=variant)
            except Exception as e:
                logger.warning(f"Claude API call failed: {e}, falling back to mock data")

        if song_id in self._mock_data:
            return self._mock_data[song_id]

        return self._build_generic_analysis(song_dict)

    def _call_claude(self, song_dict: dict, variant: str = "A") -> dict:
        features = song_dict.get("audio_features", {})

        if variant == "B":
            system_prompt = SYSTEM_PROMPT_B
            user_prompt = build_user_prompt_b(
                title=song_dict["title"],
                artist=song_dict["artist"],
                album=song_dict["album"],
                release_date=song_dict.get("release_date", "Unknown"),
                audio_features=features,
            )
        else:
            system_prompt = SYSTEM_PROMPT
            user_prompt = build_user_prompt(
                title=song_dict["title"],
                artist=song_dict["artist"],
                album=song_dict["album"],
                release_date=song_dict.get("release_date", "Unknown"),
                audio_features=features,
            )

        response = self._client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )

        raw_text = response.content[0].text
        # Strip code fences if present
        raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text.strip())
        raw_text = re.sub(r"\s*```$", "", raw_text.strip())

        data = json.loads(raw_text)

        # Validate with Pydantic models
        Analysis(
            lyrics_breakdown=[LyricsSection(**s) for s in data["lyrics_breakdown"]],
            cultural_context=CulturalContext(
                historical_background=data["cultural_context"]["historical_background"],
                references=[Reference(**r) for r in data["cultural_context"]["references"]],
                cultural_impact=data["cultural_context"]["cultural_impact"],
            ),
            production_analysis=ProductionAnalysis(**data["production_analysis"]),
            why_it_matters=data["why_it_matters"],
        )
        [SimilarSong(**s) for s in data["similar_songs"]]

        return data

    def _build_generic_analysis(self, song_dict: dict) -> dict:
        title = song_dict.get("title", "Unknown")
        artist = song_dict.get("artist", "Unknown")
        album = song_dict.get("album", "Unknown")

        return {
            "lyrics_breakdown": [
                {
                    "section": "Verse 1",
                    "timestamp": "0:00",
                    "lyrics": f"Opening section of {title}...",
                    "analysis": f"The opening of '{title}' by {artist} sets the tone for the entire track, establishing the core themes and emotional landscape that define this song.",
                    "themes": ["emotion", "storytelling"],
                },
                {
                    "section": "Chorus",
                    "timestamp": "1:00",
                    "lyrics": f"Main hook of {title}...",
                    "analysis": f"The chorus of '{title}' delivers the song's central message with memorable melodic hooks that showcase {artist}'s artistic vision.",
                    "themes": ["hook", "melody"],
                },
                {
                    "section": "Bridge",
                    "timestamp": "2:30",
                    "lyrics": f"Bridge section of {title}...",
                    "analysis": f"The bridge provides a contrasting perspective, adding emotional depth and complexity to the narrative arc of '{title}'.",
                    "themes": ["contrast", "depth"],
                },
            ],
            "cultural_context": {
                "historical_background": f"'{title}' by {artist} from the album '{album}' represents a significant entry in the artist's catalog, reflecting the musical landscape of its era.",
                "references": [
                    {
                        "term": "Musical era",
                        "explanation": f"This song reflects the musical trends and cultural movements that shaped {artist}'s creative output.",
                    },
                    {
                        "term": "Artist's evolution",
                        "explanation": f"'{title}' represents an important chapter in {artist}'s artistic development and creative journey.",
                    },
                ],
                "cultural_impact": f"'{title}' has contributed to {artist}'s lasting influence on popular music and continues to resonate with listeners.",
            },
            "production_analysis": {
                "overview": f"The production of '{title}' showcases a carefully crafted sonic palette that serves the song's emotional core.",
                "techniques": [
                    "layered arrangement",
                    "dynamic mixing",
                    "vocal production",
                ],
                "instruments": ["vocals", "guitar", "bass", "drums", "keyboards"],
                "notable_elements": f"The production choices on '{title}' create a distinctive sound that helps define {artist}'s signature style.",
            },
            "why_it_matters": f"'{title}' by {artist} stands as a testament to the power of songwriting and musical artistry. It captures a moment in time while remaining timeless in its appeal, demonstrating why {artist} remains an enduring figure in music.",
            "similar_songs": [
                {
                    "title": "Similar Track 1",
                    "artist": "Various Artists",
                    "reason": "Shares thematic and sonic elements with this track.",
                },
                {
                    "title": "Similar Track 2",
                    "artist": "Various Artists",
                    "reason": "Features comparable production techniques and emotional tone.",
                },
                {
                    "title": "Similar Track 3",
                    "artist": "Various Artists",
                    "reason": "Explores related musical territory with a kindred artistic spirit.",
                },
            ],
        }
