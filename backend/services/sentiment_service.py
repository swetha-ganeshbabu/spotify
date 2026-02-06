"""Lightweight keyword-based sentiment scorer (no external dependencies).

Uses an AFINN-style word list to score text from -1 (dark/negative) to +1 (bright/positive).
Demonstrates understanding of how sentiment analysis works at a fundamental level.
"""

import re

# AFINN-inspired word scores: word -> score (-5 to +5)
# Curated for music/lyrics context
WORD_SCORES: dict[str, int] = {
    # Strong positive (+4 to +5)
    "love": 3, "loved": 3, "loving": 3, "lover": 2,
    "joy": 4, "joyful": 4, "joyous": 4,
    "happy": 3, "happiness": 4, "happily": 3,
    "beautiful": 3, "beauty": 3,
    "wonderful": 4, "amazing": 4, "brilliant": 4,
    "hope": 3, "hopeful": 3, "hoping": 2,
    "dream": 2, "dreams": 2, "dreaming": 2,
    "paradise": 4, "heaven": 3, "heavenly": 4,
    "peace": 3, "peaceful": 3,
    "free": 2, "freedom": 3, "liberate": 3,
    "celebrate": 4, "celebration": 4,
    "smile": 2, "smiling": 2, "laugh": 2, "laughter": 3,
    "shine": 2, "shining": 2, "bright": 2, "light": 1,
    "alive": 3, "life": 1,
    "triumph": 4, "victory": 4, "win": 2,
    "dance": 2, "dancing": 2,
    "warm": 2, "warmth": 2, "gentle": 2,
    "together": 2, "unity": 3, "united": 3,
    "faith": 2, "believe": 2, "trust": 2,
    "hero": 3, "heroic": 3, "brave": 3, "courage": 3,
    "inspire": 3, "inspired": 3, "inspiring": 3,
    "magic": 2, "magical": 3,
    "sunrise": 2, "dawn": 1, "morning": 1,
    "glory": 3, "glorious": 3,
    "heal": 2, "healing": 2,
    "thank": 2, "grateful": 3, "gratitude": 3,
    "comfort": 2, "safe": 2, "protect": 2,
    "angel": 2, "blessing": 3, "blessed": 3,
    "sweet": 2, "sweetness": 2,
    "paradise": 4, "bliss": 4,
    "empower": 3, "empowerment": 3,
    "fly": 1, "flying": 1, "soar": 2,

    # Mild positive (+1 to +2)
    "good": 2, "great": 2, "nice": 1,
    "okay": 1, "fine": 1,
    "strong": 1, "strength": 2,
    "real": 1, "true": 1, "truth": 1,
    "rise": 1, "rising": 1,
    "new": 1, "fresh": 1,
    "heart": 1, "soul": 1,

    # Mild negative (-1 to -2)
    "sad": -2, "sadness": -3, "sadly": -2,
    "lonely": -2, "loneliness": -3, "alone": -1,
    "miss": -1, "missing": -1, "missed": -1,
    "lost": -2, "lose": -2, "losing": -2,
    "cry": -2, "crying": -2, "cried": -2, "tears": -2,
    "pain": -2, "painful": -3, "hurt": -2, "hurting": -2,
    "sorry": -1, "regret": -2, "regretful": -2,
    "wrong": -1, "mistake": -2,
    "cold": -1, "dark": -1, "darkness": -2, "shadow": -1,
    "tired": -1, "weary": -2, "exhausted": -2,
    "fear": -2, "afraid": -2, "scared": -2, "frightened": -3,
    "doubt": -1, "uncertain": -1,
    "broken": -2, "break": -1, "breaking": -1,
    "empty": -2, "hollow": -2, "void": -2,
    "fall": -1, "falling": -1, "fallen": -2,
    "end": -1, "ending": -1,
    "fading": -1, "fade": -1,
    "gone": -1, "goodbye": -1,
    "rain": -1, "storm": -1,
    "wait": -1, "waiting": -1,
    "silent": -1, "silence": -1,
    "ghost": -1, "haunt": -2, "haunted": -2,
    "scar": -2, "wound": -2, "wounded": -2,
    "trapped": -2, "cage": -2, "prison": -2,
    "struggle": -1, "struggling": -2,
    "burden": -2, "heavy": -1,

    # Strong negative (-3 to -5)
    "die": -3, "dying": -3, "death": -3, "dead": -3,
    "kill": -3, "killed": -3, "murder": -4,
    "hate": -3, "hatred": -4, "hated": -3,
    "war": -3, "fight": -2, "fighting": -2,
    "destroy": -3, "destruction": -4, "destroyed": -3,
    "suffer": -3, "suffering": -4,
    "agony": -4, "torment": -4, "torture": -4,
    "evil": -3, "wicked": -3, "cruel": -3, "cruelty": -4,
    "rage": -3, "fury": -3, "furious": -3, "anger": -2, "angry": -2,
    "despair": -4, "hopeless": -4, "helpless": -3,
    "doom": -3, "dread": -3,
    "misery": -4, "miserable": -4,
    "nightmare": -3, "terror": -4, "horror": -3,
    "betrayal": -3, "betray": -3, "betrayed": -3,
    "abandon": -3, "abandoned": -3,
    "drown": -3, "drowning": -3,
    "blood": -2, "bleed": -2, "bleeding": -2,
    "scream": -2, "screaming": -2,
    "curse": -2, "cursed": -3,
    "poison": -3, "toxic": -2,
    "burn": -2, "burning": -1,
    "crash": -2, "shatter": -2, "shattered": -3,
    "nothing": -1, "never": -1, "nobody": -1,

    # Nuanced / context words
    "remember": 0, "memory": 0, "memories": 0,
    "time": 0, "world": 0, "night": 0, "day": 0,
    "fire": 0, "water": 0, "earth": 0, "sky": 0,
    "run": 0, "running": 0, "walk": 0, "walking": 0,
}


def _tokenize(text: str) -> list[str]:
    """Simple word tokenizer: lowercase, split on non-alpha, filter short tokens."""
    return [w for w in re.findall(r"[a-z]+", text.lower()) if len(w) > 1]


def score_text(text: str) -> float:
    """Score a text string from -1.0 (very negative) to +1.0 (very positive).

    Returns 0.0 for neutral or empty text.
    """
    words = _tokenize(text)
    if not words:
        return 0.0

    total_score = 0
    scored_count = 0

    for word in words:
        if word in WORD_SCORES and WORD_SCORES[word] != 0:
            total_score += WORD_SCORES[word]
            scored_count += 1

    if scored_count == 0:
        return 0.0

    # Normalize: average score divided by max possible (5) to get -1 to +1 range
    raw_avg = total_score / scored_count
    normalized = max(-1.0, min(1.0, raw_avg / 5.0))
    return round(normalized, 3)


class SentimentService:
    def compute_emotional_arc(self, lyrics_sections: list[dict]) -> dict:
        """Compute the emotional arc across all lyrics sections.

        Returns dict with:
            - scores: list of {section, score, label} for each section
            - overall: float, average sentiment across all sections
            - arc_shape: str, description of the emotional trajectory
        """
        scores = []
        for section in lyrics_sections:
            # Combine lyrics and analysis text for richer scoring
            text = f"{section.get('lyrics', '')} {section.get('analysis', '')}"
            sentiment = score_text(text)
            scores.append({
                "section": section.get("section", "Unknown"),
                "score": sentiment,
                "label": _score_to_label(sentiment),
            })

        if not scores:
            return {
                "scores": [],
                "overall": 0.0,
                "arc_shape": "unknown",
            }

        overall = round(sum(s["score"] for s in scores) / len(scores), 3)
        arc_shape = _detect_arc_shape(scores)

        return {
            "scores": scores,
            "overall": overall,
            "arc_shape": arc_shape,
        }


def _score_to_label(score: float) -> str:
    """Convert a numeric score to a human-readable label."""
    if score >= 0.3:
        return "bright"
    elif score >= 0.1:
        return "warm"
    elif score > -0.1:
        return "neutral"
    elif score > -0.3:
        return "somber"
    else:
        return "dark"


def _detect_arc_shape(scores: list[dict]) -> str:
    """Detect the overall shape of the emotional arc."""
    if len(scores) < 2:
        return "steady"

    values = [s["score"] for s in scores]
    first_half = values[: len(values) // 2]
    second_half = values[len(values) // 2 :]

    avg_first = sum(first_half) / len(first_half) if first_half else 0
    avg_second = sum(second_half) / len(second_half) if second_half else 0
    diff = avg_second - avg_first

    # Check if there's a peak in the middle
    if len(values) >= 3:
        mid_idx = len(values) // 2
        mid_val = values[mid_idx]
        edge_avg = (values[0] + values[-1]) / 2
        if mid_val > edge_avg + 0.15:
            return "peak"
        if mid_val < edge_avg - 0.15:
            return "valley"

    if diff > 0.15:
        return "ascending"
    elif diff < -0.15:
        return "descending"
    else:
        return "steady"
