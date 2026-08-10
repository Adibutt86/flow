import json
import re

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the DIALOGUE_COMBO_PRESETS array block
start_idx = content.find("const DIALOGUE_COMBO_PRESETS = [")
end_idx = content.find("];\n\n// 2. KIDS HEALTH OPTIONS", start_idx)
if end_idx == -1:
    end_idx = content.find("];\n\nconst KIDS_LOCATION_GROUPS", start_idx) # look for next logical block
    if end_idx == -1:
        end_idx = content.find("];\n", start_idx + 1000)

block = content[start_idx:end_idx+2]

print("Found block of length:", len(block))
# Let's save it to a file so I can inspect it easily
with open('combos_block.txt', 'w', encoding='utf-8') as f:
    f.write(block)
