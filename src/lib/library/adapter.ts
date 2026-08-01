import { LibraryScript } from "./scripts";
import { GeneratedProjectOutput } from "../ai/gemini";

/**
 * CONVERTS A LOCAL LIBRARY SCRIPT INTO A 100% COMPLETE STORYBOARD
 * ZERO API Calls, ZERO Gemini Calls!
 */
export function convertLibraryScriptToOutput(
  script: LibraryScript,
  duration: number
): GeneratedProjectOutput & {
  aiUsed: false;
  provider: "Local Engine";
  model: "CLI Story Library Engine";
  generationMode: "LIBRARY_PRESET";
} {
  const clipCount = Math.max(1, Math.floor(duration / 8));
  const mainChar = script.characters[0];

  const characters = script.characters.map((c) => ({
    name: c.name,
    role: c.role || "Main Character",
    age: "Animated Character",
    gender: "Male",
    appearance: c.appearance,
    face: "Highly expressive facial features and clear eyes",
    hair: "Detailed hair/fur",
    eyes: "Expressive eyes",
    skinTone: "Natural tone",
    bodyType: "Proportional build",
    clothing: c.clothing,
    accessories: "None",
    personality: c.personality,
    expressions: "Dynamic expressions matching story beats",
    typicalPoses: "Action-matched story poses",
    referencePrompt: `Master character reference sheet of ${c.name} (${c.appearance}, ${c.clothing}): front view, 3/4 view, side view, full body turnaround, neutral studio background, 9:16 vertical. (NO TEXT, NO TITLES, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN STUDIO BACKGROUND).`,
  }));

  const scenes = [];
  for (let i = 1; i <= clipCount; i++) {
    const isFirst = i === 1;
    const isFinal = i === clipCount;

    let narration = "";
    let dialogue = script.dialogue[i - 1]?.text || script.dialogue[0]?.text || "Let's see what happens!";
    let motion0to2 = "";
    let motion2to4 = "";
    let motion4to6 = "";
    let motion6to8 = "";

    if (clipCount === 1) {
      // 1 SCENE (8s TOTAL): HOOK -> SETUP -> ESCALATION -> PAYOFF -> END
      narration = `${script.storyBeats.hook} ${script.storyBeats.setup} ${script.storyBeats.climax} ${script.storyBeats.punchline}`;
      motion0to2 = `0-2s: ${script.storyBeats.hook} in ${script.setting}.`;
      motion2to4 = `2-4s: ${script.storyBeats.setup} ${script.storyBeats.escalation}.`;
      motion4to6 = `4-6s: ${mainChar.name} speaks lip-sync dialogue: "${dialogue}".`;
      motion6to8 = `6-8s: ${script.storyBeats.punchline} Story 100% complete and fully resolved at ${script.setting}!`;
    } else if (clipCount === 2) {
      // 2 SCENES (16s TOTAL)
      if (isFirst) {
        narration = `${script.storyBeats.hook} ${script.storyBeats.setup} ${script.storyBeats.escalation}`;
        motion0to2 = `0-2s: ${script.storyBeats.hook} in ${script.setting}.`;
        motion2to4 = `2-4s: ${script.storyBeats.setup}.`;
        motion4to6 = `4-6s: ${mainChar.name} speaks lip-sync line: "${dialogue}".`;
        motion6to8 = `6-8s: ${script.storyBeats.escalation}, holding position for Scene 2.`;
      } else {
        narration = `${script.storyBeats.complication} ${script.storyBeats.climax} ${script.storyBeats.punchline}`;
        motion0to2 = `0-2s: ${script.storyBeats.complication} in ${script.setting}.`;
        motion2to4 = `2-4s: ${script.storyBeats.climax}.`;
        motion4to6 = `4-6s: ${mainChar.name} speaks lip-sync reaction: "${dialogue}".`;
        motion6to8 = `6-8s: ${script.storyBeats.punchline} Story reaches 100% COMPLETE CONCLUSION and final visual punchline!`;
      }
    } else {
      // 3 SCENES (24s TOTAL)
      if (isFirst) {
        narration = `${script.storyBeats.hook} ${script.storyBeats.setup}`;
        motion0to2 = `0-2s: ${script.storyBeats.hook} in ${script.setting}.`;
        motion2to4 = `2-4s: ${script.storyBeats.setup}.`;
        motion4to6 = `4-6s: ${mainChar.name} speaks lip-sync line: "${dialogue}".`;
        motion6to8 = `6-8s: Establishes initial setup, holding position for Scene 2.`;
      } else if (isFinal) {
        narration = `${script.storyBeats.climax} ${script.storyBeats.punchline}`;
        motion0to2 = `0-2s: ${script.storyBeats.climax} in ${script.setting}.`;
        motion2to4 = `2-4s: ${script.storyBeats.punchline}.`;
        motion4to6 = `4-6s: ${mainChar.name} speaks lip-sync reaction: "${dialogue}".`;
        motion6to8 = `6-8s: ${script.storyBeats.resolution} Full story 100% complete and resolved!`;
      } else {
        narration = `${script.storyBeats.escalation} ${script.storyBeats.complication}`;
        motion0to2 = `0-2s: ${script.storyBeats.escalation} across ${script.setting}.`;
        motion2to4 = `2-4s: ${script.storyBeats.complication}.`;
        motion4to6 = `4-6s: ${mainChar.name} speaks lip-sync line: "${dialogue}".`;
        motion6to8 = `6-8s: Escalates situation, setting up final Scene ${i + 1}.`;
      }
    }

    const charLock = `CHARACTER CONSISTENCY LOCK: Maintain exact features of ${mainChar.name} (${mainChar.appearance}).`;

    scenes.push({
      sceneNumber: i,
      duration: 8,
      narration,
      dialogue,
      imagePrompt: `${charLock} Character mouth is open speaking line: "${dialogue}". Vertical 9:16 composition, 35mm cinematic lens. Scene ${i}: ${mainChar.name} in high detail within ${script.setting}. Warm key lighting, rich textures. (NO TEXT, NO TITLES, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN VISUAL RENDER).`,
      videoPrompt: `During this 8-second clip: ${motion0to2} ${motion2to4} ${motion4to6} ${motion6to8} (NO TEXT OVERLAYS, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN FULL FRAME VIDEO).`,
      camera: "35mm dynamic tracking camera lens",
      motion: `${mainChar.name} performing time-sliced motion with lip-sync movements saying "${dialogue}"`,
      lighting: "Warm key light with soft fill",
      sfx: script.visualHighlights[0] ? `${script.visualHighlights[0]} sound effect` : "Action-matched SFX cue",
      music: script.category === "HORROR" ? "Ominous suspense soundtrack" : "Playful bouncy background score",
      continuityNotes: `Scene ${i} of ${clipCount}`,
      previousSceneState: isFirst ? `Opens in ${script.setting}` : `Completed Scene ${i - 1}`,
      nextSceneState: isFinal ? "Story reaches 100% COMPLETE CONCLUSION and final visual punchline" : `Transitions toward Scene ${i + 1}`,
    });
  }

  return {
    title: script.title,
    hook: script.storyBeats.hook,
    summary: script.completeStory,
    ending: script.storyBeats.resolution,
    characters,
    visualBible: {
      style: "3D Cartoon",
      lighting: "Warm key lighting with soft fill",
      colorPalette: "Vibrant saturated tones",
      cameraStyle: "Dynamic tracking 35mm lens",
      lens: "35mm cinematic lens",
      environment: script.setting,
      atmosphere: "Engaging short-form tone",
      texture: "Clean rendered details",
      renderingStyle: "3D Rendered",
      aspectRatio: "9:16",
    },
    scenes,
    aiUsed: false,
    provider: "Local Engine",
    model: "CLI Story Library Engine",
    generationMode: "LIBRARY_PRESET",
  };
}
