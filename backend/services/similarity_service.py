import math
from services.song_service import SongService


def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Compute cosine similarity between two feature vectors."""
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(x * x for x in b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)


def _extract_feature_vector(audio_features: dict) -> list[float]:
    """Extract a normalized feature vector from audio features.

    Uses [energy, valence, tempo_normalized, danceability, acousticness, instrumentalness]
    Tempo is normalized to 0-1 range (assumes 40-220 BPM range).
    """
    tempo_norm = max(0.0, min(1.0, (audio_features.get("tempo", 120) - 40) / 180))
    return [
        audio_features.get("energy", 0),
        audio_features.get("valence", 0),
        tempo_norm,
        audio_features.get("danceability", 0),
        audio_features.get("acousticness", 0),
        audio_features.get("instrumentalness", 0),
    ]


class SimilarityService:
    def __init__(self, song_service: SongService):
        self._song_service = song_service

    def find_similar(self, song_id: str, top_k: int = 3) -> list[dict]:
        """Find the top_k most similar songs by cosine similarity on audio features.

        Returns list of dicts with keys: title, artist, reason, similarity_score
        """
        target_song = self._song_service.get_song_by_id(song_id)
        if not target_song or "audio_features" not in target_song:
            return []

        target_vec = _extract_feature_vector(target_song["audio_features"])

        scores = []
        for sid, song in self._song_service._songs.items():
            if sid == song_id:
                continue
            if "audio_features" not in song:
                continue
            candidate_vec = _extract_feature_vector(song["audio_features"])
            sim = cosine_similarity(target_vec, candidate_vec)
            scores.append((sim, song))

        scores.sort(key=lambda x: x[0], reverse=True)

        results = []
        for sim_score, song in scores[:top_k]:
            # Build a human-readable reason based on the closest features
            reason = _build_similarity_reason(target_song, song, sim_score)
            results.append({
                "title": song["title"],
                "artist": song["artist"],
                "reason": reason,
                "similarity_score": round(sim_score, 4),
            })

        return results

    def find_similar_with_features(self, song_id: str, top_k: int = 3) -> dict:
        """Find similar songs and include audio features for each.

        Returns dict with keys: target, target_features, similar_songs
        """
        target_song = self._song_service.get_song_by_id(song_id)
        if not target_song or "audio_features" not in target_song:
            return {}

        target_vec = _extract_feature_vector(target_song["audio_features"])

        scores = []
        for sid, song in self._song_service._songs.items():
            if sid == song_id:
                continue
            if "audio_features" not in song:
                continue
            candidate_vec = _extract_feature_vector(song["audio_features"])
            sim = cosine_similarity(target_vec, candidate_vec)
            scores.append((sim, song))

        scores.sort(key=lambda x: x[0], reverse=True)

        similar = []
        for sim_score, song in scores[:top_k]:
            reason = _build_similarity_reason(target_song, song, sim_score)
            similar.append({
                "title": song["title"],
                "artist": song["artist"],
                "reason": reason,
                "similarity_score": round(sim_score, 4),
                "audio_features": song["audio_features"],
            })

        return {
            "target": {
                "id": target_song["id"],
                "title": target_song["title"],
                "artist": target_song["artist"],
                "album": target_song["album"],
                "album_art": target_song["album_art"],
                "duration_ms": target_song["duration_ms"],
                "preview_url": target_song.get("preview_url"),
                "release_date": target_song["release_date"],
            },
            "target_features": target_song["audio_features"],
            "similar_songs": similar,
        }


def _build_similarity_reason(target: dict, candidate: dict, score: float) -> str:
    """Generate a human-readable explanation of why two songs are similar."""
    t_feat = target["audio_features"]
    c_feat = candidate["audio_features"]

    shared_traits = []

    # Check which features are closest
    if abs(t_feat["energy"] - c_feat["energy"]) < 0.15:
        level = "high" if t_feat["energy"] > 0.6 else "low" if t_feat["energy"] < 0.4 else "moderate"
        shared_traits.append(f"{level} energy")

    if abs(t_feat["valence"] - c_feat["valence"]) < 0.15:
        level = "positive" if t_feat["valence"] > 0.6 else "dark" if t_feat["valence"] < 0.4 else "balanced"
        shared_traits.append(f"{level} mood")

    if abs(t_feat["danceability"] - c_feat["danceability"]) < 0.15:
        shared_traits.append("similar groove")

    if abs(t_feat["acousticness"] - c_feat["acousticness"]) < 0.15:
        quality = "acoustic" if t_feat["acousticness"] > 0.5 else "electronic"
        shared_traits.append(f"{quality} texture")

    pct = round(score * 100)

    if shared_traits:
        traits_str = ", ".join(shared_traits[:3])
        return f"Shares {traits_str} ({pct}% audio similarity)"
    return f"Similar sonic profile across audio features ({pct}% audio similarity)"
