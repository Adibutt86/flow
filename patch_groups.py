import re

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_groups = '''const METAMORPHOSIS_DIALOGUE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Metamorphosis Audio & Dialogue",
    options: [
      { value: "Live crowd cheers & dramatic creature roar (Audience POV)", label: "🔊 Crowd Cheers & Roar", desc: "Standard live stage audio." },
      { value: "None", label: "🔇 Disabled (No Dialogue)", desc: "No dialogue or voice, just visual and ambient." }
    ]
  }
];

const LIGHTING_FX_GROUPS: OptionGroupWithDesc[] = ['''

content = content.replace("const LIGHTING_FX_GROUPS: OptionGroupWithDesc[] = [", new_groups)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done adding groups!')
