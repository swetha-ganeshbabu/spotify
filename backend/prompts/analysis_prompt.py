# Variant A: "World-class analyst" — detailed, academic, comprehensive
SYSTEM_PROMPT = """You are a world-class music analyst, historian, and critic. You provide deep, insightful analysis of songs — their lyrics, cultural significance, production techniques, and emotional impact.

You MUST respond with valid JSON only. No markdown, no explanation, no code fences. Just raw JSON matching the exact schema requested."""

# Variant B: "Concise music critic" — punchy, opinionated, accessible
SYSTEM_PROMPT_B = """You are a sharp, opinionated music critic writing for a modern audience. Your style is concise, punchy, and accessible — like a great tweet thread or Pitchfork review. Focus on what makes songs hit emotionally rather than academic analysis. Use vivid language and bold takes.

You MUST respond with valid JSON only. No markdown, no explanation, no code fences. Just raw JSON matching the exact schema requested."""


def build_user_prompt(
    title: str,
    artist: str,
    album: str,
    release_date: str,
    audio_features: dict,
) -> str:
    return f"""Analyze the song "{title}" by {artist} from the album "{album}" (released {release_date}).

Audio features: energy={audio_features['energy']}, valence={audio_features['valence']}, tempo={audio_features['tempo']}, danceability={audio_features['danceability']}, acousticness={audio_features['acousticness']}, instrumentalness={audio_features['instrumentalness']}, loudness={audio_features['loudness']}.

Return a JSON object with this exact structure:
{{
  "lyrics_breakdown": [
    {{
      "section": "Verse 1",
      "timestamp": "0:00",
      "lyrics": "The opening lyrics of the section...",
      "analysis": "What these lyrics mean and why they matter...",
      "themes": ["theme1", "theme2"]
    }}
  ],
  "cultural_context": {{
    "historical_background": "The historical and cultural context when this song was created...",
    "references": [
      {{
        "term": "A cultural reference in the song",
        "explanation": "What it means and why it's significant"
      }}
    ],
    "cultural_impact": "How this song influenced culture, other artists, and society..."
  }},
  "production_analysis": {{
    "overview": "Overall production approach and sound...",
    "techniques": ["technique1", "technique2"],
    "instruments": ["instrument1", "instrument2"],
    "notable_elements": "What makes the production special or innovative..."
  }},
  "why_it_matters": "A compelling paragraph about why this song is significant in music history...",
  "similar_songs": [
    {{
      "title": "Song Title",
      "artist": "Artist Name",
      "reason": "Why this song is similar..."
    }}
  ]
}}

Include 3-5 sections in lyrics_breakdown, 2-4 cultural references, 3-5 production techniques, 3-5 instruments, and exactly 3 similar songs. Make the analysis insightful and engaging."""


def build_user_prompt_b(
    title: str,
    artist: str,
    album: str,
    release_date: str,
    audio_features: dict,
) -> str:
    return f"""Break down "{title}" by {artist} (album: "{album}", {release_date}).

Vibe check — energy={audio_features['energy']}, valence={audio_features['valence']}, tempo={audio_features['tempo']}, danceability={audio_features['danceability']}, acousticness={audio_features['acousticness']}.

Return JSON with this exact structure:
{{
  "lyrics_breakdown": [
    {{
      "section": "Verse 1",
      "timestamp": "0:00",
      "lyrics": "Key lyrics...",
      "analysis": "Your take — sharp, concise, opinionated. 1-2 sentences max.",
      "themes": ["theme1", "theme2"]
    }}
  ],
  "cultural_context": {{
    "historical_background": "Why this song matters in context — keep it real, not academic.",
    "references": [
      {{
        "term": "A reference in the song",
        "explanation": "What it means — explain like you're talking to a friend"
      }}
    ],
    "cultural_impact": "The real impact — skip the Wikipedia tone, give the take."
  }},
  "production_analysis": {{
    "overview": "What the production sounds like and why it works.",
    "techniques": ["technique1", "technique2"],
    "instruments": ["instrument1", "instrument2"],
    "notable_elements": "The sonic detail that makes this track stand out."
  }},
  "why_it_matters": "Your bold take on why this song still hits. Be specific, be opinionated.",
  "similar_songs": [
    {{
      "title": "Song Title",
      "artist": "Artist Name",
      "reason": "Why — be specific about the connection."
    }}
  ]
}}

Include 3-5 sections, 2-3 references, 3-5 techniques, 3-5 instruments, 3 similar songs. Be punchy and memorable."""
