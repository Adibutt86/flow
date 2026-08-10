import json
import re

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the presets array
start_idx = content.find("const DIALOGUE_COMBO_PRESETS = [")
next_const = content.find("\n// 2. KIDS HEALTH OPTIONS", start_idx)
if next_const == -1: next_const = content.find("\n// ── SONG & SHAYARI OPTION GROUPS", start_idx)

old_presets = content[start_idx:next_const]

with open('new_combos.txt', 'r', encoding='utf-8') as f:
    new_combos = f.read()

content = content.replace(old_presets, new_combos)

# 2. Update the JSX rendering
old_jsx = '''                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {DIALOGUE_COMBO_PRESETS.map((combo) => {
                        const isActive =
                          characterSetup === combo.setup &&
                          charactersPerScene === combo.perScene &&
                          seriousDialogueStyle === combo.dialogueStyle &&
                          (!('location' in combo) || kidsLocation === (combo as any).location);
                        return (
                          <button
                            key={combo.title}
                            type="button"
                            title={combo.desc}
                            onClick={() => {
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
                            }}
                            className={lex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-sm touch-manipulation w-full text-left }
                          >
                            <span className="text-base shrink-0">{combo.icon}</span>
                            <span className="truncate">{combo.title}</span>
                          </button>
                        );
                      })}
                    </div>'''

new_jsx = '''                    <div className="space-y-5">
                      {DIALOGUE_COMBO_GROUPS.map((group, gIndex) => (
                        <div key={gIndex} className="space-y-2">
                          <h4 className="text-[11px] font-bold text-violet-300/80 uppercase tracking-wider">{group.category}</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {group.options.map((combo) => {
                              const isActive =
                                characterSetup === combo.setup &&
                                charactersPerScene === combo.perScene &&
                                seriousDialogueStyle === combo.dialogueStyle &&
                                (!('location' in combo) || kidsLocation === (combo as any).location);
                              return (
                                <button
                                  key={combo.title}
                                  type="button"
                                  title={combo.desc}
                                  onClick={() => {
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
                                  }}
                                  className={lex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-sm touch-manipulation w-full text-left }
                                >
                                  <span className="text-base shrink-0">{combo.icon}</span>
                                  <span className="truncate">{combo.title}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>'''

content = content.replace(old_jsx, new_jsx)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
