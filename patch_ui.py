import re

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_ui = '''                {/* 6. Lighting & FX */}
                <CustomSelect
                  label="Lighting & Stage FX"
                  icon="💡"
                  value={lightingFx}
                  onChange={setLightingFx}
                  groups={LIGHTING_FX_GROUPS}
                />
              </div>
            </div>
          )}'''

new_ui = '''                {/* 6. Lighting & FX */}
                <CustomSelect
                  label="Lighting & Stage FX"
                  icon="💡"
                  value={lightingFx}
                  onChange={setLightingFx}
                  groups={LIGHTING_FX_GROUPS}
                />

                {/* 7. Dialogue / Audio */}
                <CustomSelect
                  label="Dialogue / Audio"
                  icon="🔊"
                  value={seriousDialogueStyle}
                  onChange={setSeriousDialogueStyle}
                  groups={METAMORPHOSIS_DIALOGUE_GROUPS}
                />
              </div>
            </div>
          )}'''

content = content.replace(old_ui, new_ui)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done adding UI!')
