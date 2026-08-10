import re
import json

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

print('Initial size:', len(content))

# 1. Add categoryStates to IdeasPageSettings
content = content.replace(
    'interface IdeasPageSettings {',
    'interface IdeasPageSettings {\n  categoryStates?: Record<string, Partial<IdeasPageSettings>>;'
)

# 2. Update getInitialSettings usage
content = content.replace(
    '  const initialSettings = getInitialSettings();',
    '  const initialSettings = getInitialSettings();\n  const initialCatState = initialSettings.categoryStates?.[initialSettings.category || \"FUNNY\"] || initialSettings;'
)

# 3. Replace initialSettings. with initialCatState. for the specific fields
fields_to_change = [
    'visualStyle', 'videoDuration', 'customDialogue', 'kidsAge', 'kidsLocation', 'kidsHealth',
    'kidsVibe', 'kidsClothing', 'characterSetup', 'charactersPerScene', 'customCharactersPerScene',
    'kidsNationality', 'musicType', 'seriousDialogueStyle', 'customSceneDescription', 'outroEffects',
    'kidsExpression', 'kidsFood', 'kidsProp', 'timeOfDay', 'storyBeat', 'cameraShot', 'charPerformance',
    'includeMic', 'songCrowdFx', 'characterFaceType', 'performerAge', 'stageLocation', 'audiencePerspective',
    'stageEnvironment', 'initialPerformer', 'triggerAction', 'targetEntity', 'lightingFx', 'carboxBrand',
    'carboxColor', 'carboxPackaging', 'carboxBackground', 'customIdea'
]
for field in fields_to_change:
    content = re.sub(rf'initialSettings\.{field}', f'initialCatState.{field}', content)

# 4. Save logic update (useEffect)
old_save_start = content.find('  // Save all settings to localStorage whenever any setting changes\n  useEffect(() => {\n    if (typeof window !== "undefined") {\n      const settings: IdeasPageSettings = {')
old_save_end = content.find('localStorage.setItem("flow-ideas-page-settings", JSON.stringify(settings));\n    }\n  }, [')
old_save_end = content.find(']);', old_save_end) + 3
old_save = content[old_save_start:old_save_end]

new_save = '''  // Save all settings to localStorage whenever any setting changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const globalStored = localStorage.getItem("flow-ideas-page-settings");
      let categoryStates: Record<string, Partial<IdeasPageSettings>> = {};
      try {
         if (globalStored) {
            const parsed = JSON.parse(globalStored);
            categoryStates = parsed.categoryStates || {};
         }
      } catch (e) {}

      categoryStates[category] = {
        visualStyle,
        videoDuration,
        customDialogue,
        kidsAge,
        kidsLocation,
        kidsHealth,
        kidsVibe,
        kidsClothing,
        characterSetup,
        charactersPerScene,
        customCharactersPerScene,
        kidsNationality,
        carboxBrand,
        carboxColor,
        carboxPackaging,
        carboxBackground,
        customIdea,
        musicType,
        seriousDialogueStyle,
        customSceneDescription,
        outroEffects,
        kidsExpression,
        kidsFood,
        kidsProp,
        timeOfDay,
        storyBeat,
        cameraShot,
        charPerformance,
        includeMic,
        songCrowdFx,
        characterFaceType,
        performerAge,
        stageLocation,
        audiencePerspective,
        stageEnvironment,
        initialPerformer,
        triggerAction,
        targetEntity,
        lightingFx,
        language
      };

      const settings: IdeasPageSettings = {
        category,
        filterCategory,
        searchQuery,
        sortBy,
        currentPage,
        aiModel,
        categoryStates
      };
      
      localStorage.setItem("flow-ideas-page-settings", JSON.stringify(settings));
    }
  }, [
    category,
    language,
    visualStyle,
    videoDuration,
    customDialogue,
    kidsAge,
    kidsLocation,
    kidsHealth,
    kidsVibe,
    kidsClothing,
    characterSetup,
    charactersPerScene,
    customCharactersPerScene,
    kidsNationality,
    carboxBrand,
    carboxColor,
    carboxPackaging,
    carboxBackground,
    customIdea,
    filterCategory,
    searchQuery,
    sortBy,
    currentPage,
    aiModel,
    musicType,
    seriousDialogueStyle,
    customSceneDescription,
    outroEffects,
    kidsExpression,
    kidsFood,
    kidsProp,
    timeOfDay,
    storyBeat,
    cameraShot,
    charPerformance,
    includeMic,
    songCrowdFx,
    characterFaceType,
    performerAge,
    stageLocation,
    audiencePerspective,
    stageEnvironment,
    initialPerformer,
    triggerAction,
    targetEntity,
    lightingFx,
  ]);'''
content = content.replace(old_save, new_save)

# 5. onChange handler for category
old_onchange_start = content.find('                  // ── STRICT CATEGORY ISOLATION ──────────────────────────────')
old_onchange_end = content.find('                  if (cat === "PUNJABI_JOKE") setLanguage("Punjabi");')
old_onchange = content[old_onchange_start:old_onchange_end]

new_onchange = '''                  if (cat !== prevCat) {
                    let savedState: any = null;
                    try {
                      const stored = localStorage.getItem("flow-ideas-page-settings");
                      if (stored) {
                        const parsed = JSON.parse(stored);
                        if (parsed.categoryStates && parsed.categoryStates[cat]) {
                          savedState = parsed.categoryStates[cat];
                        }
                      }
                    } catch(e) {}
                    
                    if (savedState) {
                      if (savedState.visualStyle) setVisualStyle(savedState.visualStyle);
                      if (savedState.videoDuration) setVideoDuration(savedState.videoDuration);
                      if (savedState.customDialogue !== undefined) setCustomDialogue(savedState.customDialogue);
                      if (savedState.kidsAge) setKidsAge(savedState.kidsAge);
                      if (savedState.kidsLocation) setKidsLocation(savedState.kidsLocation);
                      if (savedState.kidsHealth) setKidsHealth(savedState.kidsHealth);
                      if (savedState.kidsVibe) setKidsVibe(savedState.kidsVibe);
                      if (savedState.kidsClothing) setKidsClothing(savedState.kidsClothing);
                      if (savedState.characterSetup) setCharacterSetup(savedState.characterSetup);
                      if (savedState.charactersPerScene) setCharactersPerScene(savedState.charactersPerScene);
                      if (savedState.customCharactersPerScene !== undefined) setCustomCharactersPerScene(savedState.customCharactersPerScene);
                      if (savedState.kidsNationality) setKidsNationality(savedState.kidsNationality);
                      if (savedState.musicType) setMusicType(savedState.musicType);
                      if (savedState.seriousDialogueStyle) setSeriousDialogueStyle(savedState.seriousDialogueStyle);
                      if (savedState.customSceneDescription !== undefined) setCustomSceneDescription(savedState.customSceneDescription);
                      if (savedState.outroEffects) setOutroEffects(savedState.outroEffects);
                      if (savedState.kidsExpression) setKidsExpression(savedState.kidsExpression);
                      if (savedState.kidsFood) setKidsFood(savedState.kidsFood);
                      if (savedState.kidsProp) setKidsProp(savedState.kidsProp);
                      if (savedState.timeOfDay) setTimeOfDay(savedState.timeOfDay);
                      if (savedState.storyBeat) setStoryBeat(savedState.storyBeat);
                      if (savedState.cameraShot) setCameraShot(savedState.cameraShot);
                      if (savedState.charPerformance) setCharPerformance(savedState.charPerformance);
                      if (savedState.includeMic !== undefined) setIncludeMic(savedState.includeMic);
                      if (savedState.songCrowdFx) setSongCrowdFx(savedState.songCrowdFx);
                      if (savedState.characterFaceType) setCharacterFaceType(savedState.characterFaceType);
                      if (savedState.performerAge) setPerformerAge(savedState.performerAge);
                      if (savedState.stageLocation) setStageLocation(savedState.stageLocation);
                      if (savedState.audiencePerspective) setAudiencePerspective(savedState.audiencePerspective);
                      if (savedState.stageEnvironment) setStageEnvironment(savedState.stageEnvironment);
                      if (savedState.initialPerformer) setInitialPerformer(savedState.initialPerformer);
                      if (savedState.triggerAction) setTriggerAction(savedState.triggerAction);
                      if (savedState.targetEntity) setTargetEntity(savedState.targetEntity);
                      if (savedState.lightingFx) setLightingFx(savedState.lightingFx);
                      if (savedState.carboxBrand) setCarboxBrand(savedState.carboxBrand);
                      if (savedState.carboxColor) setCarboxColor(savedState.carboxColor);
                      if (savedState.carboxPackaging) setCarboxPackaging(savedState.carboxPackaging);
                      if (savedState.carboxBackground) setCarboxBackground(savedState.carboxBackground);
                      if (savedState.customIdea !== undefined) setCustomIdea(savedState.customIdea);
                    } else {
                      // Fallback to defaults
                      if (cat === "CUTE_KIDS") {
                        setKidsAge("Toddler (2-4 yrs)");
                        setKidsLocation("Cozy Home Living Room");
                        setKidsHealth("Healthy");
                        setKidsVibe("Cheerful & Energetic");
                        setKidsClothing("Any / AI Decides");
                        setCharacterSetup("One Cute Little Girl");
                        setCharactersPerScene("1 Character");
                        setCustomCharactersPerScene("");
                        setKidsNationality("Global / Any");
                        setKidsExpression("Any / AI Decides");
                        setKidsFood("Any / AI Decides");
                        setKidsProp("Any / AI Decides");
                        setTimeOfDay("Any / AI Decides");
                        setStoryBeat("Any / AI Decides");
                        setCameraShot("Any / AI Decides");
                        setCharPerformance("Any / AI Decides");
                        setCharacterFaceType("Any / AI Decides");
                        setSeriousDialogueStyle("Funny / Comedy");
                        setMusicType("None");
                        setSongCrowdFx("AI Decides");
                        setVisualStyle("3D Cartoon Style");
                      } else if (cat === "SONG") {
                        setKidsAge("Adult (25-35 yrs)");
                        setKidsLocation("Sunset Rooftop & City Skyline 🌇");
                        setKidsVibe("Romantic & Soulful");
                        setKidsClothing("Performers Outfit & Attire");
                        setCharacterSetup("Solo Adult Female Singer 👩‍🎤");
                        setCharactersPerScene("1 Character");
                        setCustomCharactersPerScene("");
                        setKidsNationality("Pakistani (General / Desi)");
                        setSeriousDialogueStyle("None");
                        setMusicType("None");
                        setSongCrowdFx("DISABLED (Quiet Studio - Default)");
                        setCharacterFaceType("Any / AI Decides");
                        setVisualStyle("Hyper-Realistic CGI");
                        setTimeOfDay("Any / AI Decides");
                        setCameraShot("Any / AI Decides");
                        setCharPerformance("Any / AI Decides");
                        setKidsExpression("Any / AI Decides");
                        setKidsHealth("Healthy");
                      } else if (cat === "POETRY") {
                        setKidsAge("Adult (25-35 yrs)");
                        setKidsLocation("Traditional Heritage Haveli");
                        setKidsVibe("Poetic Shayari Mehfil");
                        setKidsClothing("Performers Outfit & Attire");
                        setCharacterSetup("Solo Adult Male Shayar 👨‍🎤");
                        setCharactersPerScene("1 Character");
                        setCustomCharactersPerScene("");
                        setKidsNationality("Pakistani Muhajir / Urdu Speaking");
                        setSeriousDialogueStyle("Poetic/Shayari");
                        setMusicType("Desi Classical Sitar & Tabla");
                        setSongCrowdFx("Live Mushaira Crowd (Wah Wah & Irshad)");
                        setCharacterFaceType("Any / AI Decides");
                        setVisualStyle("Hyper-Realistic CGI");
                        setTimeOfDay("Any / AI Decides");
                        setCameraShot("Any / AI Decides");
                        setCharPerformance("Any / AI Decides");
                        setKidsExpression("Any / AI Decides");
                        setKidsHealth("Healthy");
                      } else if (cat === "LIVE_STAGE_METAMORPHOSIS") {
                        setPerformerAge("Adult Illusionist (26-40 yrs)");
                        setStageLocation("Circus Arena Ring");
                        setAudiencePerspective("Front row smartphone POV");
                        setStageEnvironment("Circus arena ring");
                        setInitialPerformer("Ringmaster in red coat");
                        setTriggerAction("Tossing a red cape upward");
                        setTargetEntity("Majestic male lion");
                        setLightingFx("Bright overhead spotlights");
                        setSeriousDialogueStyle("Live crowd cheers & dramatic creature roar (Audience POV)");
                      } else if (cat === "CARBOX") {
                        setLanguage("ASMR Unboxing Effects");
                        setVisualStyle("Realistic");
                      }
                    }
                  }
                  '''
content = content.replace(old_onchange, new_onchange)

# 6. Add METAMORPHOSIS groups
content = content.replace(
    'const LIGHTING_FX_GROUPS: OptionGroupWithDesc[] = [',
    'const METAMORPHOSIS_DIALOGUE_GROUPS: OptionGroupWithDesc[] = [\n  {\n    category: "Metamorphosis Audio & Dialogue",\n    options: [\n      { value: "Live crowd cheers & dramatic creature roar (Audience POV)", label: "🔊 Crowd Cheers & Roar", desc: "Standard live stage audio." },\n      { value: "None", label: "🔇 Disabled (No Dialogue)", desc: "No dialogue or voice, just visual and ambient." }\n    ]\n  }\n];\n\nconst LIGHTING_FX_GROUPS: OptionGroupWithDesc[] = ['
)

# 7. Add CustomSelect for metamorphosis
old_meta_ui = '''                {/* 6. Lighting & FX */}
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
new_meta_ui = '''                {/* 6. Lighting & FX */}
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
content = content.replace(old_meta_ui, new_meta_ui)

# 8. Add combos to DIALOGUE_COMBO_PRESETS and group them
# Wait, let's just do the replace properly here.
start_idx = content.find("const DIALOGUE_COMBO_PRESETS = [")
next_const = content.find("];\\n\\n// ── SONG & SHAYARI OPTION GROUPS", start_idx)
if next_const == -1: next_const = content.find("];\n\n// ── SONG & SHAYARI OPTION GROUPS", start_idx)
# Ensure we don't accidentally grab too much if it's missing
# Actually, the best way to replace the array is to find ]; that follows the array.
if next_const == -1: next_const = content.find("\n];\n\n// 2. KIDS HEALTH OPTIONS", start_idx)

# Safest way:
end_idx = content.find('];\n\n// ── SONG & SHAYARI', start_idx)
old_presets = content[start_idx:end_idx+3]

with open('new_combos.txt', 'r', encoding='utf-8') as f:
    new_combos = f.read()

content = content.replace(old_presets, new_combos)

# 9. Finally, replace the JSX map code
old_jsx_start = content.find('                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">\n                      {DIALOGUE_COMBO_PRESETS.map((combo) => {')
old_jsx_end = content.find('                      })}\n                    </div>', old_jsx_start)
old_jsx = content[old_jsx_start:old_jsx_end + 38]

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

print('Final size:', len(content))
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
