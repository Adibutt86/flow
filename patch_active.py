import re

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_active = '''                        const isActive =
                          characterSetup === combo.setup &&
                          charactersPerScene === combo.perScene &&
                          seriousDialogueStyle === combo.dialogueStyle;'''

new_active = '''                        const isActive =
                          characterSetup === combo.setup &&
                          charactersPerScene === combo.perScene &&
                          seriousDialogueStyle === combo.dialogueStyle &&
                          (!('location' in combo) || kidsLocation === (combo as any).location);'''

content = content.replace(old_active, new_active)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done updating isActive!')
