import re

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace tears and weeping globally first, just in case
text = text.replace('tears in her eyes', 'looking deeply')
text = text.replace('tearful eyes', 'deeply emotional eyes')
text = text.replace('tearful gaze', 'emotional gaze')
text = text.replace('weeping', 'looking intently')

# Create POETRY vs SONG variables
new_variables = '''
// --- NEW POETRY AND SONG SPLIT GROUPS ---
const POETRY_AGE_GROUPS = SONG_AGE_GROUPS; // Inheriting age groups
const POETRY_LOCATION_GROUPS = SONG_LOCATION_GROUPS;
const POETRY_VIBE_GROUPS = SONG_VIBE_GROUPS;
const POETRY_CHARACTER_SETUP_GROUPS = SONG_CHARACTER_SETUP_GROUPS;
const POETRY_CLOTHING_GROUPS = SONG_CLOTHING_GROUPS;
const POETRY_STYLE_GROUPS = [
  {
    category: "Poetry & Satire Style",
    options: [
      { value: "Sufi Kalam", label: "Sufi Kalam", desc: "Deep spiritual and mystical Sufi poetry." },
      { value: "Classic Ghazal", label: "Classic Ghazal", desc: "Traditional Ghazal format with deep romantic meaning." },
      { value: "Nazm (Storytelling Poetry)", label: "Nazm (Storytelling Poetry)", desc: "Poetry that tells a continuous story or theme." },
      { value: "Qataa (4-line short poetry)", label: "Qat'aa (4-line short)", desc: "Short, impactful four-line poetry." },
      { value: "Urdu/Punjabi Tappe", label: "Urdu/Punjabi Tappe", desc: "Folk traditional Punjabi or Urdu poetic verses." },
      { value: "Funny & Humorous Shayari (Tanzo Mazah)", label: "Funny & Humorous Shayari", desc: "Comedic and satirical poetry." },
      { value: "Takhallus Reveal (Ending)", label: "Takhallus Reveal (Ending)", desc: "The final signature verse of a Ghazal." }
    ]
  }
];
const POETRY_CROWD_FX_GROUPS = SONG_CROWD_FX_GROUPS; // Wah Wah, etc.
const POETRY_MUSIC_TYPE_GROUPS = [
  {
    category: "Background Music Instrument",
    options: [
      { value: "Tabla & Harmonium", label: "Tabla & Harmonium", desc: "Classic Mushaira instruments." },
      { value: "Solo Flute", label: "Solo Flute", desc: "Soft, emotional background flute." },
      { value: "Sad Sitar", label: "Sad Sitar", desc: "Melancholic sitar playing softly." },
      { value: "No Music (Voice Only)", label: "No Music (Voice Only)", desc: "Pure voice recitation." }
    ]
  }
];

const NEW_SONG_LOCATION_GROUPS = [
  {
    category: "🎸 Music Video & Stage Settings",
    options: [
      { value: "Live Concert Arena 🎤", label: "Live Concert Arena 🎤", desc: "Massive indoor arena with lasers, stage lights, and cheering fans." },
      { value: "Coke Studio Fusion Stage 🎸", label: "Coke Studio Stage 🎸", desc: "Modern lighting rig, oriental rugs, acoustic instruments, and electric vibe." },
      { value: "Underground Indie Club 🪩", label: "Underground Indie Club 🪩", desc: "Intimate dark club with neon signs and a small stage for local bands." },
      { value: "Modern Recording Studio Booth 🎧", label: "Recording Studio Booth 🎧", desc: "Professional studio booth with a condenser mic, soundproofing, and headphones." },
      { value: "Acoustic Beach Bonfire 🔥🌊", label: "Acoustic Beach Bonfire 🔥🌊", desc: "Nighttime beach setting with a crackling bonfire and friends playing guitar." },
      { value: "Neon Cyberpunk Street 🌃", label: "Neon Cyberpunk Street 🌃", desc: "Vibrant neon-lit rainy city street perfect for a modern pop music video." },
    ],
  },
  {
    category: "💕 Romantic & Aesthetic Locations",
    options: [
      { value: "Sunset Rooftop & City Skyline 🌇", label: "Sunset Rooftop & Skyline 🌇", desc: "Golden hour rooftop view of twinkling city lights under twilight sky." },
      { value: "Vintage European Cobblestone Street 🇫🇷🌙", label: "Vintage European Alley 🌙", desc: "Romantic narrow cobblestone alley with gas lanterns, ivy walls, and rain puddles." },
      { value: "Acoustic Music Studio 🎤", label: "Acoustic Music Studio 🎤", desc: "Studio stage with vintage ribbon microphones and warm spotlight bokeh." },
    ],
  }
];

const SONG_STYLE_GROUPS_NEW = [
  {
    category: "Song Genre / Style",
    options: [
      { value: "Pop / Acoustic", label: "Pop / Acoustic", desc: "Mainstream pop or acoustic guitar." },
      { value: "Rock / Indie", label: "Rock / Indie", desc: "Energetic rock or indie style." },
      { value: "Hip-Hop / Rap", label: "Hip-Hop / Rap", desc: "Rhythmic hip-hop and rap vocal style." },
      { value: "Sufi / Folk", label: "Sufi / Folk", desc: "Traditional Sufi and folk fusion." },
      { value: "Lofi / Chillhop", label: "Lofi / Chillhop", desc: "Relaxed lofi beat style." }
    ]
  }
];

const SONG_CROWD_FX_GROUPS_NEW = [
  {
    category: "Concert / Audience FX",
    options: [
      { value: "Concert Crowd Cheers", label: "Concert Crowd Cheers", desc: "Loud stadium cheers." },
      { value: "Fans Singing Along", label: "Fans Singing Along", desc: "Crowd singing the chorus." },
      { value: "Studio Silence", label: "Studio Silence", desc: "Pure studio environment with no crowd." }
    ]
  }
];

const SONG_MUSIC_TYPE_GROUPS = [
  {
    category: "Background Music Instrument",
    options: [
      { value: "Electric Guitar & Drums", label: "Electric Guitar & Drums", desc: "Full rock band setup." },
      { value: "Synth Pop Beat", label: "Synth Pop Beat", desc: "Modern electronic synth beat." },
      { value: "Acoustic Guitar", label: "Acoustic Guitar", desc: "Simple acoustic strumming." },
      { value: "Piano Ballad", label: "Piano Ballad", desc: "Emotional piano accompaniment." }
    ]
  }
];

'''

if '// --- NEW POETRY AND SONG SPLIT GROUPS ---' not in text:
    text = text.replace('const SONG_PRESETS = [', new_variables + '\\nconst SONG_PRESETS = [')

# 1. Labels dynamically switching based on category
text = text.replace('label={category === "ANIMAL_DANCING" ? "Pet Age / Stage" : category === "FRUIT_DANCING" ? "Baby / Toddler Age" : "Shayar / Poet Age Range"}', 'label={category === "ANIMAL_DANCING" ? "Pet Age / Stage" : category === "FRUIT_DANCING" ? "Baby / Toddler Age" : category === "SONG" ? "Singer / Artist Age Range" : "Shayar / Poet Age Range"}')
text = text.replace('label={category === "ANIMAL_DANCING" || category === "FRUIT_DANCING" ? "Dance Location / Setting" : "Mehfil & Poetry Location"}', 'label={category === "ANIMAL_DANCING" || category === "FRUIT_DANCING" ? "Dance Location / Setting" : category === "SONG" ? "Music Video Location" : "Mehfil & Poetry Location"}')
text = text.replace('label={category === "ANIMAL_DANCING" || category === "FRUIT_DANCING" ? "Dance Style & Vibe" : "Poetry Vibe & Mood"}', 'label={category === "ANIMAL_DANCING" || category === "FRUIT_DANCING" ? "Dance Style & Vibe" : category === "SONG" ? "Musical Vibe & Mood" : "Poetry Vibe & Mood"}')
text = text.replace('label={category === "ANIMAL_DANCING" ? "Cosplay Costume & Outfit" : category === "FRUIT_DANCING" ? "Fruit Costume Type" : "Shayar Attire & Outfit"}', 'label={category === "ANIMAL_DANCING" ? "Cosplay Costume & Outfit" : category === "FRUIT_DANCING" ? "Fruit Costume Type" : category === "SONG" ? "Singer Attire & Outfit" : "Shayar Attire & Outfit"}')
text = text.replace('label={category === "ANIMAL_DANCING" ? "Animal & Species Setup" : category === "FRUIT_DANCING" ? "Baby Character Setup" : "Shayar & Poet Setup"}', 'label={category === "ANIMAL_DANCING" ? "Animal & Species Setup" : category === "FRUIT_DANCING" ? "Baby Character Setup" : category === "SONG" ? "Band & Vocal Setup" : "Shayar & Poet Setup"}')
text = text.replace('label="Poetry & Satire Style"', 'label={category === "SONG" ? "Song Genre / Style" : "Poetry & Satire Style"}')
text = text.replace('label="Background Audience FX (Wah Wah)"', 'label={category === "SONG" ? "Concert / Audience FX" : "Background Audience FX (Wah Wah)"}')

# 2. Fix groups depending on SONG vs POETRY
text = text.replace('groups={category === "ANIMAL_DANCING" ? ANIMAL_DANCING_AGE_GROUPS : category === "FRUIT_DANCING" ? FRUIT_DANCING_AGE_GROUPS : SONG_AGE_GROUPS}', 'groups={category === "ANIMAL_DANCING" ? ANIMAL_DANCING_AGE_GROUPS : category === "FRUIT_DANCING" ? FRUIT_DANCING_AGE_GROUPS : category === "SONG" ? SONG_AGE_GROUPS : POETRY_AGE_GROUPS}')
text = text.replace('groups={category === "ANIMAL_DANCING" ? ANIMAL_DANCING_LOCATION_GROUPS : category === "FRUIT_DANCING" ? FRUIT_DANCING_LOCATION_GROUPS : SONG_LOCATION_GROUPS}', 'groups={category === "ANIMAL_DANCING" ? ANIMAL_DANCING_LOCATION_GROUPS : category === "FRUIT_DANCING" ? FRUIT_DANCING_LOCATION_GROUPS : category === "SONG" ? NEW_SONG_LOCATION_GROUPS : POETRY_LOCATION_GROUPS}')
text = text.replace('groups={category === "ANIMAL_DANCING" || category === "FRUIT_DANCING" ? FRUIT_DANCING_VIBE_GROUPS : SONG_VIBE_GROUPS}', 'groups={category === "ANIMAL_DANCING" || category === "FRUIT_DANCING" ? FRUIT_DANCING_VIBE_GROUPS : category === "SONG" ? SONG_VIBE_GROUPS : POETRY_VIBE_GROUPS}')
text = text.replace('groups={category === "ANIMAL_DANCING" ? ANIMAL_DANCING_COSTUME_GROUPS : category === "FRUIT_DANCING" ? FRUIT_DANCING_COSTUME_GROUPS : SONG_CLOTHING_GROUPS}', 'groups={category === "ANIMAL_DANCING" ? ANIMAL_DANCING_COSTUME_GROUPS : category === "FRUIT_DANCING" ? FRUIT_DANCING_COSTUME_GROUPS : category === "SONG" ? SONG_CLOTHING_GROUPS : POETRY_CLOTHING_GROUPS}')
text = text.replace('groups={category === "ANIMAL_DANCING" ? ANIMAL_DANCING_SPECIES_GROUPS : category === "FRUIT_DANCING" ? FRUIT_DANCING_CHARACTER_SETUP_GROUPS : SONG_CHARACTER_SETUP_GROUPS}', 'groups={category === "ANIMAL_DANCING" ? ANIMAL_DANCING_SPECIES_GROUPS : category === "FRUIT_DANCING" ? FRUIT_DANCING_CHARACTER_SETUP_GROUPS : category === "SONG" ? SONG_CHARACTER_SETUP_GROUPS : POETRY_CHARACTER_SETUP_GROUPS}')
text = text.replace('groups={SONG_STYLE_GROUPS}', 'groups={category === "SONG" ? SONG_STYLE_GROUPS_NEW : POETRY_STYLE_GROUPS}')
text = text.replace('groups={SONG_CROWD_FX_GROUPS}', 'groups={category === "SONG" ? SONG_CROWD_FX_GROUPS_NEW : POETRY_CROWD_FX_GROUPS}')
text = text.replace('groups={MUSIC_TYPE_GROUPS}', 'groups={category === "SONG" ? SONG_MUSIC_TYPE_GROUPS : POETRY_MUSIC_TYPE_GROUPS}')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Patch applied!")
