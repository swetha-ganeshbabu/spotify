from models.schemas import Mood, AudioFeatures


class MoodService:
    QUADRANTS = {
        ("high", "high"): {
            "primary": "Euphoric",
            "secondary": "Energetic",
            "colors": ["#FF6B35", "#FFD700", "#FF1493"],
            "description": "This track radiates pure joy and infectious energy, lifting spirits with every beat.",
        },
        ("high", "low"): {
            "primary": "Intense",
            "secondary": "Aggressive",
            "colors": ["#DC143C", "#8B0000", "#FF4500"],
            "description": "A powerful, driving force that channels raw emotion into an intense sonic experience.",
        },
        ("low", "high"): {
            "primary": "Peaceful",
            "secondary": "Warm",
            "colors": ["#87CEEB", "#98FB98", "#DDA0DD"],
            "description": "A gentle, soothing atmosphere that wraps the listener in warmth and tranquility.",
        },
        ("low", "low"): {
            "primary": "Melancholic",
            "secondary": "Reflective",
            "colors": ["#191970", "#4B0082", "#2F4F4F"],
            "description": "Deep, introspective tones that invite contemplation and stir the soul with bittersweet beauty.",
        },
    }

    def analyze_mood(self, audio_features: AudioFeatures) -> Mood:
        energy_level = "high" if audio_features.energy >= 0.5 else "low"
        valence_level = "high" if audio_features.valence >= 0.5 else "low"

        quadrant = self.QUADRANTS[(energy_level, valence_level)]

        return Mood(
            primary=quadrant["primary"],
            secondary=quadrant["secondary"],
            gradient_colors=quadrant["colors"],
            mood_description=quadrant["description"],
        )
