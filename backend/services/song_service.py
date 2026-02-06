import json
import os
from models.schemas import SearchResult, AudioFeatures


class SongService:
    def __init__(self):
        data_path = os.path.join(os.path.dirname(__file__), "..", "data", "mock_songs.json")
        with open(data_path) as f:
            data = json.load(f)
        self._songs = {song["id"]: song for song in data["songs"]}

    def search(self, query: str, limit: int = 5) -> list[SearchResult]:
        query_lower = query.lower()
        results = []
        for song in self._songs.values():
            if (
                query_lower in song["title"].lower()
                or query_lower in song["artist"].lower()
                or query_lower in song["album"].lower()
            ):
                results.append(
                    SearchResult(
                        id=song["id"],
                        title=song["title"],
                        artist=song["artist"],
                        album_art_small=song.get("album_art_small", song["album_art"]),
                    )
                )
            if len(results) >= limit:
                break
        return results

    def get_song_by_id(self, song_id: str) -> dict | None:
        return self._songs.get(song_id)

    def get_audio_features(self, song_id: str) -> AudioFeatures | None:
        song = self._songs.get(song_id)
        if not song or "audio_features" not in song:
            return None
        return AudioFeatures(**song["audio_features"])
