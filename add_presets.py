import re

file_path = 'C:/flow/src/app/ideas/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add to CUTE_KIDS_PRESET_GROUPS
new_group = '''  {
    groupName: "Dialogue Presets",
    presets: [
      {
        icon: "🗣️",
        title: "Two Boys Dialogue",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Two Little Boys",
        perScene: "2 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Two Girls Dialogue",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Two Little Girls",
        perScene: "2 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Boy & Girl Dialogue",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "One Girl & One Boy",
        perScene: "2 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Three Boys Dialogue",
        age: "Child (5-8 yrs)",
        location: "Desi Dhaba & Roadside Chai Stall",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Three Boy Friends (Trio Squad)",
        perScene: "3 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Three Girls Dialogue",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Three Girl Friends (Trio Squad)",
        perScene: "3 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Two Boys & One Girl",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Two Boys & One Girl",
        perScene: "3 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Two Girls & One Boy",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Two Girls & One Boy",
        perScene: "3 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Brother & Sister Dialogue",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Brother & Sister",
        perScene: "2 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Friends Dialogue",
        age: "Child (5-8 yrs)",
        location: "Desi Primary School Classroom",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Two Kids (Friends)",
        perScene: "2 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Classmates Dialogue",
        age: "Child (5-8 yrs)",
        location: "Desi Primary School Classroom",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Classmates",
        perScene: "2 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
    ]
  }
];'''

content = content.replace('];\n\n// ── SONG & SHAYARI OPTION GROUPS (FULL AGE RANGE 6-9 YRS TO OLD MAN) ──', ',\n' + new_group + '\n\n// ── SONG & SHAYARI OPTION GROUPS (FULL AGE RANGE 6-9 YRS TO OLD MAN) ──')

# 2. Add missing setups to CHARACTER_SETUP_GROUPS
# Find the "Multiple & Duo Characters" category
setup_addition = '''      { value: "Two Kids (Friends)", label: "Two Kids (Friends)", desc: "Two best friend kids having fun." },
      { value: "Two Boys & One Girl", label: "Two Boys & One Girl", desc: "A trio consisting of two boys and one girl." },
      { value: "Two Girls & One Boy", label: "Two Girls & One Boy", desc: "A trio consisting of two girls and one boy." },
      { value: "Classmates", label: "Classmates", desc: "Two or more classmates talking." },'''

content = content.replace('{ value: "Two Kids (Friends)", label: "Two Kids (Friends)", desc: "Two best friend kids having fun." },', setup_addition)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Update complete')
