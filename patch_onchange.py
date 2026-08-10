import re

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = '''                  // ── STRICT CATEGORY ISOLATION ──────────────────────────────
                  // Reset ALL character/scene settings to that category's own
                  // defaults whenever the user switches categories. This prevents
                  // adult Poetry/Song details (beards, adult age, etc.) from
                  // bleeding into Cute Kids prompts and vice versa.
                  if (cat !== prevCat) {
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
                      setSeriousDialogueStyle("None");
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
                    } else if (cat === "CARBOX") {
                      setLanguage("ASMR Unboxing Effects");
                      setVisualStyle("Realistic");
                    }
                  }'''

new_logic = '''                  if (cat !== prevCat) {
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
                  }'''

content = content.replace(old_logic, new_logic)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done updating onChange!')
