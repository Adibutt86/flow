import re

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_presets = '''  // ── Friends & Locations ──
  {
    icon: "👦🏫",
    title: "Friends in Class",
    setup: "Two Boy Friends (Best Friends)",
    perScene: "2 Characters",
    dialogueStyle: "Funny / Comedy",
    vibe: "Silly Kid",
    location: "School Classroom",
    desc: "Two friends talking and joking around in the classroom.",
  },
  {
    icon: "👦🛝",
    title: "Friends at Playground",
    setup: "Two Boy Friends (Best Friends)",
    perScene: "2 Characters",
    dialogueStyle: "Funny / Comedy",
    vibe: "Silly Kid",
    location: "Sunny Playground",
    desc: "Two friends having fun and talking at the playground.",
  },
  {
    icon: "👦🛣️",
    title: "Friends in Street",
    setup: "Two Boy Friends (Best Friends)",
    perScene: "2 Characters",
    dialogueStyle: "Funny / Comedy",
    vibe: "Silly Kid",
    location: "Neighborhood Street",
    desc: "Two friends chatting while walking down the street.",
  },
  {
    icon: "👦🛏️",
    title: "Friends in Bedroom",
    setup: "Two Boy Friends (Best Friends)",
    perScene: "2 Characters",
    dialogueStyle: "Funny / Comedy",
    vibe: "Silly Kid",
    location: "Colorful Kids Bedroom",
    desc: "Two friends playing and chatting in a kid's bedroom.",
  },
  // ── Siblings & Locations ──
  {
    icon: "🧒🛋️",
    title: "Siblings in Lounge",
    setup: "Brother & Sister",
    perScene: "2 Characters",
    dialogueStyle: "Funny / Comedy",
    vibe: "Cheerful & Energetic",
    location: "Cozy Home Living Room",
    desc: "Brother and sister arguing or playing in the living room.",
  },
  {
    icon: "🧒🍳",
    title: "Siblings in Kitchen",
    setup: "Brother & Sister",
    perScene: "2 Characters",
    dialogueStyle: "Funny / Comedy",
    vibe: "Silly Kid",
    location: "Modern Kitchen",
    desc: "Brother and sister fighting over snacks in the kitchen.",
  },
  {
    icon: "🧒🌳",
    title: "Siblings in Park",
    setup: "Brother & Sister",
    perScene: "2 Characters",
    dialogueStyle: "Funny / Comedy",
    vibe: "Cheerful & Energetic",
    location: "Lush Green Park",
    desc: "Brother and sister having fun in a lush green park.",
  },
  {
    icon: "🧒📚",
    title: "Siblings Studying",
    setup: "Brother & Sister",
    perScene: "2 Characters",
    dialogueStyle: "Funny / Comedy",
    vibe: "Silly Kid",
    location: "Cozy Library & Book Nook",
    desc: "Brother and sister trying to study together in a cozy library.",
  },
  {
    icon: "🧒🧸",
    title: "Siblings in Toy Store",
    setup: "Brother & Sister",
    perScene: "2 Characters",
    dialogueStyle: "Funny / Comedy",
    vibe: "Cheerful & Energetic",
    location: "Indoor Toy Store & Arcade",
    desc: "Brother and sister begging for toys in a toy store.",
  },
  // ── Core Duo / Trio Combos ──'''

content = content.replace("  // ── Core Duo / Trio Combos ──", new_presets)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done adding presets!')
