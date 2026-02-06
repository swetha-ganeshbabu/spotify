"""Evaluation service for computing quality metrics on AI analysis outputs.

Demonstrates understanding of how AI systems are evaluated by measuring:
- Coverage: how many sections the analysis covers
- Theme diversity: unique themes across sections
- Reference depth: number of cultural references
- Analysis depth: average word count per section analysis
- Similarity confidence: cosine similarity score for recommendations
"""


class EvalService:
    def evaluate(self, analysis_data: dict, similar_songs: list[dict]) -> dict:
        """Compute evaluation metrics on a completed analysis.

        Args:
            analysis_data: dict with lyrics_breakdown, cultural_context, etc.
            similar_songs: list of similar song dicts with similarity_score

        Returns:
            dict with scored metrics
        """
        lyrics = analysis_data.get("lyrics_breakdown", [])
        cultural = analysis_data.get("cultural_context", {})
        production = analysis_data.get("production_analysis", {})

        coverage = self._coverage_score(lyrics)
        theme_diversity = self._theme_diversity(lyrics)
        reference_depth = self._reference_depth(cultural)
        analysis_depth = self._analysis_depth(lyrics)
        production_detail = self._production_detail(production)
        similarity_confidence = self._similarity_confidence(similar_songs)

        # Overall quality score (weighted average)
        overall = round(
            coverage * 0.2
            + theme_diversity * 0.15
            + reference_depth * 0.15
            + analysis_depth * 0.2
            + production_detail * 0.15
            + similarity_confidence * 0.15,
            3,
        )

        return {
            "metrics": {
                "coverage": {
                    "score": coverage,
                    "detail": f"{len(lyrics)} sections analyzed",
                    "description": "How many song sections the analysis covers (target: 3-5)",
                },
                "theme_diversity": {
                    "score": theme_diversity,
                    "detail": f"{self._count_unique_themes(lyrics)} unique themes",
                    "description": "Variety of themes identified across lyrics sections",
                },
                "reference_depth": {
                    "score": reference_depth,
                    "detail": f"{len(cultural.get('references', []))} references",
                    "description": "Number of cultural references identified and explained",
                },
                "analysis_depth": {
                    "score": analysis_depth,
                    "detail": f"{self._avg_words(lyrics)} avg words/section",
                    "description": "Average depth of analysis per section (word count proxy)",
                },
                "production_detail": {
                    "score": production_detail,
                    "detail": f"{len(production.get('techniques', []))} techniques, {len(production.get('instruments', []))} instruments",
                    "description": "Detail level in production analysis",
                },
                "similarity_confidence": {
                    "score": similarity_confidence,
                    "detail": f"avg {self._avg_sim_score(similar_songs):.0%} cosine similarity",
                    "description": "Confidence of ML-based similar song recommendations",
                },
            },
            "overall_score": overall,
            "grade": self._score_to_grade(overall),
        }

    def _coverage_score(self, lyrics: list) -> float:
        """Score 0-1 based on number of sections (3-5 is ideal)."""
        n = len(lyrics)
        if n >= 5:
            return 1.0
        if n >= 3:
            return 0.8
        if n >= 2:
            return 0.5
        if n >= 1:
            return 0.3
        return 0.0

    def _theme_diversity(self, lyrics: list) -> float:
        """Score 0-1 based on unique themes count."""
        unique = self._count_unique_themes(lyrics)
        if unique >= 10:
            return 1.0
        return round(min(1.0, unique / 10), 3)

    def _count_unique_themes(self, lyrics: list) -> int:
        themes = set()
        for section in lyrics:
            for theme in section.get("themes", []):
                themes.add(theme.lower().strip())
        return len(themes)

    def _reference_depth(self, cultural: dict) -> float:
        """Score 0-1 based on number of references (2-4 ideal)."""
        n = len(cultural.get("references", []))
        if n >= 4:
            return 1.0
        if n >= 2:
            return 0.7
        if n >= 1:
            return 0.4
        return 0.0

    def _analysis_depth(self, lyrics: list) -> float:
        """Score 0-1 based on average word count per analysis."""
        avg = self._avg_words(lyrics)
        if avg >= 30:
            return 1.0
        if avg >= 20:
            return 0.8
        if avg >= 10:
            return 0.5
        return 0.2

    def _avg_words(self, lyrics: list) -> int:
        if not lyrics:
            return 0
        total = sum(len(s.get("analysis", "").split()) for s in lyrics)
        return total // len(lyrics)

    def _production_detail(self, production: dict) -> float:
        """Score 0-1 based on techniques + instruments count."""
        n = len(production.get("techniques", [])) + len(production.get("instruments", []))
        if n >= 8:
            return 1.0
        return round(min(1.0, n / 8), 3)

    def _similarity_confidence(self, similar_songs: list) -> float:
        """Score 0-1 based on average cosine similarity of recommendations."""
        avg = self._avg_sim_score(similar_songs)
        # A cosine similarity of 0.9+ is excellent for audio features
        return round(min(1.0, avg / 0.95), 3)

    def _avg_sim_score(self, similar_songs: list) -> float:
        scores = [s.get("similarity_score", 0) for s in similar_songs if s.get("similarity_score") is not None]
        if not scores:
            return 0.0
        return sum(scores) / len(scores)

    def _score_to_grade(self, score: float) -> str:
        if score >= 0.9:
            return "A+"
        if score >= 0.8:
            return "A"
        if score >= 0.7:
            return "B+"
        if score >= 0.6:
            return "B"
        if score >= 0.5:
            return "C"
        return "D"
