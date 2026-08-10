import re

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_click = '''                            onClick={() => {
                              setCharacterSetup(combo.setup);
                              setCharactersPerScene(combo.perScene);
                              setSeriousDialogueStyle(combo.dialogueStyle);
                              setKidsVibe(combo.vibe);
                              showToast(💬 "" dialogue set!, "success");
                            }}'''

new_click = '''                            onClick={() => {
                              setCharacterSetup(combo.setup);
                              setCharactersPerScene(combo.perScene);
                              setSeriousDialogueStyle(combo.dialogueStyle);
                              setKidsVibe(combo.vibe);
                              if ('location' in combo && combo.location) {
                                setKidsLocation(combo.location);
                                showToast(💬 "" dialogue & location set!, "success");
                              } else {
                                showToast(💬 "" dialogue set!, "success");
                              }
                            }}'''

content = content.replace(old_click, new_click)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done updating onClick!')
