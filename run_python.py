import json

with open('combos_block.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# very dirty parse of object array
text = text.replace('const DIALOGUE_COMBO_PRESETS = [', '').replace('];', '').strip()
# split into objects roughly
blocks = text.split('},')

objects = []
for block in blocks:
    if '{' not in block: continue
    obj_str = block[block.find('{')+1:]
    
    obj = {}
    for line in obj_str.split('\n'):
        if ':' in line:
            key = line.split(':', 1)[0].strip()
            val = line.split(':', 1)[1].strip()
            if val.endswith(','): val = val[:-1]
            if val.startswith('"') and val.endswith('"'): val = val[1:-1]
            obj[key] = val
    if obj:
        objects.append(obj)

groups = [
  {"category": "⭐ Top Picks (Most Common)", "options": []},
  {"category": "👦🏫 Friends & Locations", "options": []},
  {"category": "🧒🏠 Siblings & Locations", "options": []},
  {"category": "👨‍👩‍👧 Family & Relatives", "options": []},
  {"category": "🎒 School & Learning", "options": []},
  {"category": "😂 Comedy, Drama & Trios", "options": []},
  {"category": "🇵🇰 Desi Culture & Others", "options": []},
  {"category": "🎭 Solo, Narration & Special", "options": []},
]

def assign_group(t):
    if t in ["Friends Dialogue", "Brother & Sister", "Boy & Girl Dialogue", "Two Boys Dialogue", "Two Girls Dialogue"]: return 0
    if "Friends in" in t or "Friends at" in t or "Two Friends In Dhaba" in t or "Rooftop Kite Boys" in t: return 1
    if "Siblings in" in t or "Siblings Studying" in t or "Brother & Sister Dialogue" in t: return 2
    if "Mom" in t or "Dad" in t or "Dada" in t or "Dadi" in t or "Family" in t or "Halwa Puri" in t: return 3
    if "Student" in t or "Homework" in t or "Class" in t or "Science" in t: return 4
    if "Three" in t or "Two Boys &" in t or "Two Girls &" in t or "Comedy" in t or "Prank" in t or "Birthday" in t or "Food Fight" in t or "Argument" in t: return 5
    if "Cricket" in t or "Eid Shopping" in t or "Shaddi" in t or "Calf" in t or "Kitten" in t or "Garden" in t: return 6
    return 7

for obj in objects:
    t = obj.get("title", "")
    idx = assign_group(t)
    groups[idx]["options"].append(obj)

out = "const DIALOGUE_COMBO_GROUPS = [\n"
for g in groups:
    if not g["options"]: continue
    out += '  {\n    category: "' + g["category"] + '",\n    options: [\n'
    for opt in g["options"]:
        out += '      {\n'
        for k, v in opt.items():
            out += '        ' + k + ': "' + v + '",\n'
        out += '      },\n'
    out += '    ]\n  },\n'
out += "];\n"

with open('new_combos.txt', 'w', encoding='utf-8') as f:
    f.write(out)
print('Done!')
