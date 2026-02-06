from models.schemas import Mood, GeneratedArtwork


MOOD_STYLES = {
    "Euphoric": "pop art",
    "Intense": "expressionism",
    "Peaceful": "watercolor",
    "Melancholic": "oil painting",
}


class ImageService:
    def generate_artwork(
        self,
        mood: Mood,
        themes: list[str],
        title: str,
        artist: str,
    ) -> GeneratedArtwork:
        style = MOOD_STYLES.get(mood.primary, "abstract")
        themes_str = ", ".join(themes[:3]) if themes else "music"

        prompt = (
            f"A {style} artwork inspired by '{title}' by {artist}. "
            f"Mood: {mood.primary} and {mood.secondary}. "
            f"Themes: {themes_str}. "
            f"Color palette: {', '.join(mood.gradient_colors)}."
        )

        bg_color = mood.gradient_colors[0].lstrip("#")
        text_color = "ffffff"

        url = (
            f"https://placehold.co/600x600/{bg_color}/{text_color}"
            f"?text={title.replace(' ', '+')}"
        )

        return GeneratedArtwork(
            url=url,
            prompt_used=prompt,
            style=style,
        )
