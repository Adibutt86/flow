import re

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find("const DIALOGUE_COMBO_PRESETS = [")
next_const = content.find("\nconst ", start + 1)
block = content[start:next_const]

print("Block length:", len(block))
with open('combos_block.txt', 'w', encoding='utf-8') as f:
    f.write(block)
