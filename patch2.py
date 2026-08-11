import re

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Remove the previously added block
block_start = '// --- NEW POETRY AND SONG SPLIT GROUPS ---'
block_end = 'const SONG_PRESETS = ['

if block_start in text:
    before = text.split(block_start)[0]
    after = text.split(block_end)[1]
    
    # We will insert the block after SONG_STYLE_GROUPS which is around line 2502.
    # Let's find 'const SONG_STYLE_GROUPS'
    
    new_vars = '''
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
    
    clean_text = before + 'const SONG_PRESETS = [' + after
    
    # Now find where SONG_STYLE_GROUPS ends to insert it properly, maybe just before CHARACTERS_PER_SCENE_GROUPS
    target = 'const CHARACTERS_PER_SCENE_GROUPS: OptionGroupWithDesc[] = ['
    clean_text = clean_text.replace(target, new_vars + '\\n' + target)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(clean_text)
