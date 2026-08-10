import re

file_path = 'C:/flow/src/app/ideas/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_presets = '''const CUTE_KIDS_PRESET_GROUPS = [
  {
    groupName: "Popular Combinations",
    presets: [
      {
        icon: "👬",
        title: "Friends",
        age: "Child (5-8 yrs)",
        location: "Desi Dhaba & Roadside Chai Stall",
        health: "Healthy & Active",
        vibe: "Silly Kid",
        setup: "Two Boy Friends (Best Friends)",
        perScene: "2 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "Funny Comedy Sound Effects",
        dialogueStyle: "None",
      },
      {
        icon: "🪁",
        title: "Brother & Sister",
        age: "Child (5-8 yrs)",
        location: "House Rooftop Kite Flying (Kotha)",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Brother & Sister",
        perScene: "2 Characters",
        nationality: "Pakistani Punjabi",
        musicType: "Punjabi Beats & Bhangra",
        dialogueStyle: "None",
      },
      {
        icon: "👫",
        title: "Boy & Girl",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy",
        vibe: "Cheerful & Energetic",
        setup: "One Girl & One Boy",
        perScene: "2 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "None",
        dialogueStyle: "None",
      },
    ]
  },
  {
    groupName: "Solo Characters",
    presets: [
      {
        icon: "👧",
        title: "Single Girl Solo",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy",
        vibe: "Cheerful & Energetic",
        setup: "One Cute Little Girl",
        perScene: "1 Character",
        nationality: "Pakistani (General / Desi)",
        musicType: "None",
        dialogueStyle: "Monologue",
      },
      {
        icon: "👦",
        title: "Single Boy Solo",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy",
        vibe: "Cheerful & Energetic",
        setup: "One Cute Little Boy",
        perScene: "1 Character",
        nationality: "Pakistani (General / Desi)",
        musicType: "None",
        dialogueStyle: "Monologue",
      },
      {
        icon: "👤",
        title: "1 Character Solo",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy",
        vibe: "Cheerful & Energetic",
        setup: "One Cute Little Girl",
        perScene: "1 Character",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "⚡",
        title: "Desi Pind Toddler",
        age: "Toddler (2-4 yrs)",
        location: "Desi Village & Punjabi Pind",
        health: "Healthy",
        vibe: "Cheerful & Energetic",
        setup: "One Cute Little Girl",
        perScene: "2 Characters",
        nationality: "Pakistani Punjabi",
        musicType: "Punjabi Beats & Bhangra",
        dialogueStyle: "None",
      },
      {
        icon: "✨",
        title: "Fairy Tale Girl",
        age: "Toddler (2-4 yrs)",
        location: "Magical Cloud Kingdom",
        health: "Healthy",
        vibe: "Rainbow Adventure",
        setup: "Little Girl with Fairy Wings",
        perScene: "1 Character",
        nationality: "Global / Any",
        musicType: "Orchestral & Grand Symphony",
        dialogueStyle: "None",
      },
      {
        icon: "🚀",
        title: "Space Explorer",
        age: "Child (5-8 yrs)",
        location: "Futuristic Space Station & Moon Base",
        health: "Healthy & Active",
        vibe: "Happy Explorer",
        setup: "Little Boy Astronaut",
        perScene: "1 Character",
        nationality: "Global / Any",
        musicType: "Cinematic Epic & Dramatic",
        dialogueStyle: "Narration Style",
      },
      {
        icon: "🎧",
        title: "Lo-Fi Story Time",
        age: "Child (5-8 yrs)",
        location: "Cozy Library & Book Nook",
        health: "Healthy",
        vibe: "Soft Pastel Style",
        setup: "Reading Little Girl",
        perScene: "1 Character",
        nationality: "Global / Any",
        musicType: "Lo-Fi Chill & Chillhop",
        dialogueStyle: "Narration Style",
      },
      {
        icon: "🪕",
        title: "Punjabi Folk Singer",
        age: "Child (5-8 yrs)",
        location: "Green Wheat & Mustard Fields",
        health: "Healthy",
        vibe: "Cheerful & Energetic",
        setup: "Punjabi Folk Singer (Jugni & Tappa)",
        perScene: "1 Character",
        nationality: "Pakistani Punjabi",
        musicType: "Punjabi Jugni Folk Beats",
        dialogueStyle: "Poetic/Shayari",
      },
    ]
  },
  {
    groupName: "Duos & Groups",
    presets: [
      {
        icon: "🏫",
        title: "School Friends",
        age: "Child (5-8 yrs)",
        location: "Desi Primary School Classroom",
        health: "Healthy & Active",
        vibe: "Happy Explorer",
        setup: "Two Kids (Friends)",
        perScene: "2 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "💖",
        title: "Cozy Baby & Mom",
        age: "Baby (1-2 yrs)",
        location: "Cozy Home Living Room",
        health: "Happy & Healthy",
        vibe: "Cute & Playful",
        setup: "Girl + Mother",
        perScene: "2 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🍦",
        title: "Toddler Duo Ice Cream",
        age: "Toddler (2-4 yrs)",
        location: "Ice Cream Shop",
        health: "Healthy",
        vibe: "Silly Kid",
        setup: "One Girl & One Boy",
        perScene: "2 Characters",
        nationality: "Global / Any",
        musicType: "Kids Nursery Rhymes",
        dialogueStyle: "None",
      },
      {
        icon: "🐱",
        title: "Toddler & Kitten",
        age: "Toddler (2-4 yrs)",
        location: "Cozy Home Living Room",
        health: "Happy & Healthy",
        vibe: "Cute & Playful",
        setup: "Little Girl with a Kitten",
        perScene: "2 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "Acoustic Guitar & Whistling",
        dialogueStyle: "None",
      },
      {
        icon: "🐮",
        title: "Boy Singer & Calf",
        age: "Toddler (2-4 yrs)",
        location: "Desi Village & Punjabi Pind",
        health: "Healthy",
        vibe: "Cheerful & Energetic",
        setup: "Boy Singer + Calf",
        perScene: "2 Characters",
        nationality: "Pakistani Punjabi",
        musicType: "Punjabi Beats & Bhangra",
        dialogueStyle: "None",
      },
      {
        icon: "🕌",
        title: "Eid Celebration",
        age: "Child (5-8 yrs)",
        location: "Festive Eid & Chand Raat Market",
        health: "Healthy",
        vibe: "Cheerful & Energetic",
        setup: "Two Girl Friends (Best Friends)",
        perScene: "2 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "Nasheed / Vocal Only",
        dialogueStyle: "Emotional",
      },
    ]
  },
  {
    groupName: "Performances & Couples",
    presets: [
      {
        icon: "🎤",
        title: "Cute Qawwal Duo",
        age: "Child (5-8 yrs)",
        location: "Traditional Desi Courtyard & Vehra",
        health: "Healthy",
        vibe: "Cheerful & Energetic",
        setup: "Boy & Girl Qawwal Duo",
        perScene: "2 Characters",
        nationality: "Pakistani Punjabi",
        musicType: "Sufi Qawwali & Harmonium",
        dialogueStyle: "None",
      },
      {
        icon: "🎵",
        title: "Qawali Night",
        age: "Child (5-8 yrs)",
        location: "Traditional Desi Courtyard & Vehra",
        health: "Healthy",
        vibe: "Romantic",
        setup: "Boy Qawwali Group (Qawwal Party)",
        perScene: "3 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "Sufi Qawwali & Harmonium",
        dialogueStyle: "Poetic/Shayari",
      },
      {
        icon: "🎤",
        title: "Shayari Mehfil",
        age: "Child (5-8 yrs)",
        location: "Traditional Desi Courtyard & Vehra",
        health: "Healthy",
        vibe: "Romantic",
        setup: "Boy & Girl Shayar Duo",
        perScene: "2 Characters",
        nationality: "Pakistani Muhajir / Urdu Speaking",
        musicType: "Desi Classical Sitar & Tabla",
        dialogueStyle: "Poetic/Shayari",
      },
      {
        icon: "🎸",
        title: "Coke Studio Jam",
        age: "Child (5-8 yrs)",
        location: "Traditional Heritage Haveli",
        health: "Healthy & Active",
        vibe: "Positive Energy",
        setup: "Boy & Girl Singer Duet",
        perScene: "2 Characters",
        nationality: "Pakistani Punjabi",
        musicType: "Coke Studio Style Fusion",
        dialogueStyle: "Poetic/Shayari",
      },
      {
        icon: "❤️",
        title: "Miya Biwi",
        age: "Young Adult (18-24 yrs)",
        location: "Cozy Home Living Room",
        health: "Happy & Healthy",
        vibe: "Romantic",
        setup: "Husband & Wife (Miya Biwi)",
        perScene: "2 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "Lo-Fi Chill & Chillhop",
        dialogueStyle: "None",
      },
      {
        icon: "👰‍♀️",
        title: "Dulha & Dulhan",
        age: "Young Adult (18-24 yrs)",
        location: "Traditional Heritage Haveli",
        health: "Happy & Healthy",
        vibe: "Romantic",
        setup: "Dulha & Dulhan (Bride & Groom Couple)",
        perScene: "2 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "Sufi Qawwali & Harmonium",
        dialogueStyle: "Poetic/Shayari",
      },
    ]
  }
];'''

# Replace the old array
pattern_array = re.compile(r'const CUTE_KIDS_PRESETS = \[.*?\];', re.DOTALL)
content = pattern_array.sub(new_presets, content, count=1)

# Replace apply function signature
content = content.replace(
    'const applyCuteKidsPreset = (preset: typeof CUTE_KIDS_PRESETS[0] & { clothing?: string }) => {',
    'const applyCuteKidsPreset = (preset: typeof CUTE_KIDS_PRESET_GROUPS[0]["presets"][0] & { clothing?: string }) => {'
)

# Replace the UI rendering part
ui_old = '''                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {CUTE_KIDS_PRESETS.map((preset) => {
                        const isActive = 
                          kidsAge === preset.age &&
                          kidsLocation === preset.location &&
                          kidsHealth === preset.health &&
                          kidsVibe === preset.vibe &&
                          characterSetup === preset.setup &&
                          charactersPerScene === preset.perScene &&
                          kidsNationality === preset.nationality &&
                          (!preset.musicType || musicType === preset.musicType) &&
                          (!preset.dialogueStyle || seriousDialogueStyle === preset.dialogueStyle);
                        
                        return (
                          <button
                            key={preset.title}
                            type="button"
                            onClick={() => applyCuteKidsPreset(preset)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-sm touch-manipulation w-full text-left ${
                              isActive 
                                ? "bg-indigo-600 border-indigo-400 shadow-md shadow-indigo-500/40 ring-1 ring-indigo-400" 
                                : "bg-indigo-900/60 hover:bg-indigo-800 border-indigo-500/40"
                            }`}
                          >
                            <span className="text-base shrink-0">{preset.icon}</span>
                            <span className="truncate">{preset.title}</span>
                          </button>
                        );
                      })}
                    </div>'''

ui_new = '''                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 pb-2 custom-scrollbar">
                      {CUTE_KIDS_PRESET_GROUPS.map((group) => (
                        <div key={group.groupName} className="space-y-2">
                          <h4 className="text-[11px] font-bold text-indigo-300/80 uppercase tracking-wider px-1">
                            {group.groupName}
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {group.presets.map((preset) => {
                              const isActive = 
                                kidsAge === preset.age &&
                                kidsLocation === preset.location &&
                                kidsHealth === preset.health &&
                                kidsVibe === preset.vibe &&
                                characterSetup === preset.setup &&
                                charactersPerScene === preset.perScene &&
                                kidsNationality === preset.nationality &&
                                (!preset.musicType || musicType === preset.musicType) &&
                                (!preset.dialogueStyle || seriousDialogueStyle === preset.dialogueStyle);
                              
                              return (
                                <button
                                  key={preset.title}
                                  type="button"
                                  onClick={() => applyCuteKidsPreset(preset)}
                                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-sm touch-manipulation w-full text-left ${
                                    isActive 
                                      ? "bg-indigo-600 border-indigo-400 shadow-md shadow-indigo-500/40 ring-1 ring-indigo-400" 
                                      : "bg-indigo-900/60 hover:bg-indigo-800 border-indigo-500/40"
                                  }`}
                                >
                                  <span className="text-base shrink-0">{preset.icon}</span>
                                  <span className="truncate">{preset.title}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>'''

if ui_old in content:
    content = content.replace(ui_old, ui_new)
else:
    print("UI string not found.")
    
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Update complete')
