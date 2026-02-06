import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_search_returns_results():
    res = client.get("/api/search", params={"q": "bohemian"})
    assert res.status_code == 200
    data = res.json()
    assert "results" in data
    assert len(data["results"]) > 0
    assert data["results"][0]["title"] == "Bohemian Rhapsody"


def test_search_no_match():
    res = client.get("/api/search", params={"q": "xyznonexistent"})
    assert res.status_code == 200
    assert res.json()["results"] == []


def test_analyze_by_id():
    res = client.post("/api/analyze", json={"song_query": "bohemian-rhapsody"})
    assert res.status_code == 200
    data = res.json()
    assert data["song"]["title"] == "Bohemian Rhapsody"
    assert data["song"]["artist"] == "Queen"
    assert "mood" in data
    assert "analysis" in data
    assert len(data["mood"]["gradient_colors"]) == 3
    assert len(data["analysis"]["lyrics_breakdown"]) > 0


def test_analyze_not_found():
    res = client.post("/api/analyze", json={"song_query": "nonexistent-song-id-xyz"})
    assert res.status_code == 404


def test_mood_classification():
    """Bohemian Rhapsody has low energy (0.402) and low valence (0.228) = Melancholic"""
    res = client.post("/api/analyze", json={"song_query": "bohemian-rhapsody"})
    data = res.json()
    assert data["mood"]["primary"] == "Melancholic"
    assert data["mood"]["secondary"] == "Reflective"


def test_feedback():
    res = client.post(
        "/api/feedback",
        json={
            "song_id": "bohemian-rhapsody",
            "section": "Verse 1",
            "helpful": True,
        },
    )
    assert res.status_code == 200
    assert res.json()["success"] is True


def test_analysis_has_all_sections():
    res = client.post("/api/analyze", json={"song_query": "bohemian-rhapsody"})
    data = res.json()
    analysis = data["analysis"]
    assert "lyrics_breakdown" in analysis
    assert "cultural_context" in analysis
    assert "production_analysis" in analysis
    assert "why_it_matters" in analysis
    assert "similar_songs" in data
    assert len(data["similar_songs"]) > 0


# --- New tests for ML features ---


def test_similar_songs_have_similarity_scores():
    """Similar songs should be computed via cosine similarity and include scores."""
    res = client.post("/api/analyze", json={"song_query": "bohemian-rhapsody"})
    data = res.json()
    assert len(data["similar_songs"]) == 3
    for song in data["similar_songs"]:
        assert "similarity_score" in song
        assert song["similarity_score"] is not None
        assert 0 <= song["similarity_score"] <= 1
        assert "title" in song
        assert "artist" in song
        assert "reason" in song


def test_similar_songs_are_sorted_by_similarity():
    """Similar songs should be ordered by descending similarity score."""
    res = client.post("/api/analyze", json={"song_query": "bohemian-rhapsody"})
    data = res.json()
    scores = [s["similarity_score"] for s in data["similar_songs"]]
    assert scores == sorted(scores, reverse=True)


def test_emotional_arc_present():
    """Analysis response should include emotional arc from sentiment analysis."""
    res = client.post("/api/analyze", json={"song_query": "bohemian-rhapsody"})
    data = res.json()
    assert "emotional_arc" in data
    arc = data["emotional_arc"]
    assert "scores" in arc
    assert "overall" in arc
    assert "arc_shape" in arc
    assert len(arc["scores"]) > 0
    for section in arc["scores"]:
        assert "section" in section
        assert "score" in section
        assert "label" in section
        assert -1 <= section["score"] <= 1
        assert section["label"] in ["bright", "warm", "neutral", "somber", "dark"]


def test_emotional_arc_shape():
    """Arc shape should be one of the expected values."""
    res = client.post("/api/analyze", json={"song_query": "bohemian-rhapsody"})
    data = res.json()
    arc = data["emotional_arc"]
    assert arc["arc_shape"] in ["ascending", "descending", "peak", "valley", "steady"]


def test_evaluate_endpoint():
    """Evaluate endpoint should return quality metrics."""
    res = client.get("/api/evaluate/bohemian-rhapsody")
    assert res.status_code == 200
    data = res.json()
    assert "metrics" in data
    assert "overall_score" in data
    assert "grade" in data
    assert 0 <= data["overall_score"] <= 1
    assert data["grade"] in ["A+", "A", "B+", "B", "C", "D"]


def test_evaluate_metrics_detail():
    """Each evaluation metric should have score, detail, and description."""
    res = client.get("/api/evaluate/bohemian-rhapsody")
    data = res.json()
    expected_metrics = [
        "coverage", "theme_diversity", "reference_depth",
        "analysis_depth", "production_detail", "similarity_confidence",
    ]
    for metric_key in expected_metrics:
        assert metric_key in data["metrics"], f"Missing metric: {metric_key}"
        metric = data["metrics"][metric_key]
        assert "score" in metric
        assert "detail" in metric
        assert "description" in metric
        assert 0 <= metric["score"] <= 1


def test_evaluate_not_found():
    """Evaluate should 404 for unknown songs."""
    res = client.get("/api/evaluate/nonexistent-song-xyz")
    assert res.status_code == 404


def test_prompt_variant_field():
    """Response should include prompt_variant and is_live fields."""
    res = client.post("/api/analyze", json={"song_query": "bohemian-rhapsody"})
    data = res.json()
    assert "prompt_variant" in data
    assert data["prompt_variant"] in ["A", "B"]
    assert "is_live" in data
    assert isinstance(data["is_live"], bool)


def test_variant_b_request():
    """Sending variant=B should be accepted and reflected in response."""
    res = client.post(
        "/api/analyze",
        json={"song_query": "bohemian-rhapsody", "variant": "B"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["prompt_variant"] == "B"


def test_analyze_different_songs():
    """Different songs should return different similar songs."""
    res_a = client.post("/api/analyze", json={"song_query": "bohemian-rhapsody"})
    res_b = client.post("/api/analyze", json={"song_query": "billie-jean"})
    songs_a = {s["title"] for s in res_a.json()["similar_songs"]}
    songs_b = {s["title"] for s in res_b.json()["similar_songs"]}
    # The similar songs should differ since audio profiles are very different
    assert songs_a != songs_b
