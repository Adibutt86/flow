import re

file_path_ideas = r'C:\flow\src\app\ideas\page.tsx'
file_path_nano = r'C:\flow\src\app\nano-pro\page.tsx'

with open(file_path_ideas, 'r', encoding='utf-8') as f:
    ideas_text = f.read()

# Extract VISUAL_STYLES
match = re.search(r'const VISUAL_STYLES.*?;', ideas_text, re.DOTALL)
if match:
    visual_styles_code = match.group(0)
else:
    print('Not found')
    exit(1)

with open(file_path_nano, 'r', encoding='utf-8') as f:
    nano_text = f.read()

# Add to top if not already there
if 'const VISUAL_STYLES' not in nano_text:
    # insert after imports
    import_end = nano_text.find('export default function')
    if import_end != -1:
        nano_text = nano_text[:import_end] + visual_styles_code + '\n\n' + nano_text[import_end:]

# Replace the select options
select_pattern = r'<select\s+value=\{visualStyle\}.*?</select>'
match_select = re.search(select_pattern, nano_text, re.DOTALL)
if match_select:
    old_select = match_select.group(0)
    new_select = '''<select
                          value={visualStyle}
                          onChange={(e) => setVisualStyle(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          {VISUAL_STYLES.map(style => (
                            <option key={style.value} value={style.value}>{style.label}</option>
                          ))}
                          <option value="Custom">Custom...</option>
                        </select>'''
    nano_text = nano_text.replace(old_select, new_select)
    
with open(file_path_nano, 'w', encoding='utf-8') as f:
    f.write(nano_text)
print('Updated nano-pro/page.tsx')
