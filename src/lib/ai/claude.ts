import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  GenerateProjectInput,
  GeneratedProjectOutput,
  ProjectStoryOutputSchema,
  SingleSceneRegenInput,
  SuggestIdeasInput,
  GenerateVariationsInput,
  SceneSchema,
  generateStoryContext,
  generateFullStoryboardFromPipeline,
  validateStoryboard,
  ValidationError,
} from "./gemini";
import { getCategoryConfig } from "../categories/index";

const CLAUDE_MODELS = [
  "claude-sonnet-4-6",
  "claude-sonnet-4-5-20250929",
  "claude-haiku-4-5-20251001",
  "claude-opus-4-6",
];

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

function repairJsonString(rawText: string): string {
  let str = cleanJsonResponse(rawText);

  // Fix trailing commas and unescaped control characters
  str = str.replace(/,\s*([\]}])/g, "$1");
  str = str.replace(/[\u0000-\u001F]+/g, " ");

  try {
    JSON.parse(str);
    return str;
  } catch (e) {
    // Continue to repair logic
  }

  let inString = false;
  let isEscaped = false;
  const stack: string[] = [];

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === "\\") {
      isEscaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === "{" || char === "[") {
        stack.push(char);
      } else if (char === "}") {
        if (stack.length > 0 && stack[stack.length - 1] === "{") stack.pop();
      } else if (char === "]") {
        if (stack.length > 0 && stack[stack.length - 1] === "[") stack.pop();
      }
    }
  }

  // If string was left unterminated, close it
  if (inString) {
    str += '"';
  }

  // Close unclosed objects or arrays in reverse order
  while (stack.length > 0) {
    const openChar = stack.pop();
    if (openChar === "{") str += "}";
    else if (openChar === "[") str += "]";
  }

  // Final cleanup of trailing commas
  str = str.replace(/,\s*([\]}])/g, "$1");
  return str;
}

function safeJsonParse<T>(rawText: string, schema: z.ZodSchema<T>, stageName: string = "AI Generation"): T {
  const cleaned = cleanJsonResponse(rawText);
  let parsedJson: any;
  try {
    parsedJson = JSON.parse(cleaned);
  } catch (err: any) {
    try {
      const repaired = repairJsonString(cleaned);
      parsedJson = JSON.parse(repaired);
    } catch (repairErr: any) {
      throw new ValidationError({
        success: false,
        stage: stageName,
        reason: `AI output could not be parsed as valid JSON: ${err.message || err}`,
      });
    }
  }

  const result = schema.safeParse(parsedJson);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const fieldPath = firstIssue.path.join(".");

    let sceneNumber: number | undefined;
    if (firstIssue.path[0] === "scenes" && typeof firstIssue.path[1] === "number") {
      sceneNumber = parsedJson?.scenes?.[firstIssue.path[1]]?.sceneNumber || (firstIssue.path[1] + 1);
    }

    const fieldName = firstIssue.path[firstIssue.path.length - 1]?.toString() || fieldPath;

    throw new ValidationError({
      success: false,
      stage: stageName,
      scene: sceneNumber,
      field: fieldName,
      reason: `AI did not generate valid '${fieldName}' field: ${firstIssue.message}`,
    });
  }

  return result.data;
}

export async function generateProjectContentWithClaude(
  input: GenerateProjectInput
): Promise<GeneratedProjectOutput & { aiUsed: boolean; provider: string; model: string; generationMode: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ValidationError({
      success: false,
      stage: "API Configuration",
      reason: "ANTHROPIC_API_KEY environment variable is not configured. AI storyboards cannot be generated without active model credentials.",
    });
  }

  const ctx = generateStoryContext(input);

  console.log("[CLAUDE INPUT]", input.idea);

  const prompt = `You are a master short-form video director for Google Flow.
Your task is to generate a 100% LOGICALLY CONSISTENT short video storyboard based STRICTLY on this CURRENT STORY CONTEXT:

STORY CONTEXT (SOURCE OF TRUTH):
Concept: "${ctx.concept}"
Title: "${ctx.title}"
Category: ${ctx.category}
Main Character: ${ctx.mainCharacterName} (${ctx.mainCharacterAppearance})
Location: ${ctx.location}
Clip Count: ${ctx.clipCount} scenes (8 seconds per clip)
Language: ${ctx.language}
Visual Style: ${ctx.visualStyle}

CRITICAL RULES & VIRAL COMEDY MANDATES:
0. SAFETY RULE: DO NOT use copyrighted brand names like "Pixar", "Disney", or specific copyrighted characters anywhere. Use generic terms like "High-quality 3D animation" or "Cartoon style" instead.
1. STORY-SPECIFIC DIALOGUE MANDATE (CRITICAL RULE):
   - The dialogue used in every scene MUST come directly from the specific story context or concept.
   - Do NOT invent generic placeholder dialogue or filler phrases like "Aap ye kya kar rahe hain?", "Arey wah!", "Ye toh kamaal ho gaya!", "Watch closely!", "Sammy", "Hero".
   - Every spoken line MUST either: (1) be taken directly from the story, OR (2) add meaningful specific context that advances the joke.
   - TEST: If a dialogue line could fit multiple unrelated stories, it is TOO GENERIC and is FORBIDDEN. It must belong strictly to this specific story!
2. NO VAGUE ENVIRONMENTS:
   - FORBIDDEN ENVIRONMENT PHRASES: Never output "Dynamic environment", "Cartoon environment", "Beautiful background". Always specify concrete places (e.g., "Bright supermarket cheese sampling booth", "Busy Pakistani wedding hall", "Crowded vegetable market", "Small village clinic", "School classroom", "Modern kitchen").
3. STORY & COMEDY STRUCTURE (8 SECONDS PER SCENE, ${ctx.clipCount} SCENES TOTAL):
   - Scene 1 (Hook - 8s): Strong surprising visual hook within first 2 seconds. No long intro. End with mini cliffhanger.
   - Escalation Scene(s) (8s): Each scene MUST change the situation, increase confusion, and add escalating visual slapstick (double-takes, slips, awkward silences, flying props).
   - Final Scene (Punchline - 8s): Deliver an unexpected twist ending that makes previous scenes hilarious. End with a freeze-frame reaction pose.
4. VISUAL COMEDY & CAMERA MANDATE:
   - Every camera movement MUST elevate the joke (e.g., rapid whip-pan, low-angle push-in, comedic Dutch tilt).
   - Physical visual comedy must tell half the joke!
5. DIALOGUE RULES (MAX 8 WORDS PER DIALOGUE LINE):
   - Natural conversational Desi style without textbook or cringe language.
   - If Language is "Punjabi" OR Category is "PUNJABI_JOKE": 
     * You are an expert Punjabi comedy writer and dialogue coach.
     * Dialogue & narration MUST be in authentic Roman Punjabi (no Shahmukhi/Gurmukhi).
     * Use natural, everyday Punjabi spoken in Punjab, Pakistan.
     * Avoid Hindi vocabulary unless commonly used in spoken Punjabi.
     * Make dialogue sound like a viral Punjabi YouTube Short or TikTok.
     * Keep humor simple, punchy, and easy to understand.
     * Ensure dialogue matches character's age and personality (e.g., Papaji sounds like an older Punjabi man).
     * Make reactions authentic and conversational with strong emotional intensity.
   - If Language is "Urdu" OR "Roman Urdu": Dialogue & narration MUST be in authentic Pakistani Urdu / Roman Urdu.
   - If Language is "Hindi" OR Category is "HINDI_JOKE": Dialogue & narration MUST be in authentic Desi Hindi / Roman Hindi.
   - NEVER output English dialogue or English narration when Punjabi, Urdu, or Hindi is requested!
6. CHARACTER PERSONALITIES:
   - Use distinct archetypes: Funny Sardar, Strict Amma, Overconfident Uncle, Lazy Husband, Smart Wife, Confused Grandpa, Innocent Child, Greedy Shopkeeper, Forgetful Doctor.
7. Image prompt MUST start with: "CHARACTER CONSISTENCY LOCK: Maintain exact features of ${ctx.mainCharacterName}. (NO TEXT, NO TITLES, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN VISUAL RENDER)." (UNLESS Category is "CARBOX")
9. CARBOX SPECIFIC RULES (If Category is "CARBOX"):
   - ALL scenes MUST feel like a $100K luxury automotive commercial and ASMR reveal.
   - ALL scenes MUST be completely SILENT of human voices, spoken dialogue, and voiceover narration. Set BOTH dialogue AND narration fields to empty strings ("").
   - STRICTLY NO dogs, cats, pets, animals, or secondary human characters (only manicured hands performing unboxing actions).
   - The vehicle selected MUST be the ONLY focus/character across ALL scenes. NEVER drive the vehicle away, and NEVER add secondary vehicles or background clutter.
   - CAMERA DIRECTING: Use slow, smooth, minimal, and highly controlled camera motion for maximum AI rendering stability and visual elegance. Prefer subtle dolly tracking, gentle micro push-ins, slow orbital sweeps, or steady static hero framing. STRICTLY AVOID rapid camera movements, fast pans, aggressive zoom-in/out, handheld camera shake, or whip pan transitions. Keep the vehicle clearly visible and stably framed throughout.
   - LIGHTING & MATERIALS: Emphasize multi-layer metallic paint, ray-traced reflections, volumetric softbox studio lights, edge rim highlights, carbon fiber textures, and shallow depth of field (f/1.4 lens).
   - PACKAGING & REVEAL: Vary packaging (aluminum case, carbon fiber box, luxury wooden crate, acrylic case, magnetic gift box) and reveal mechanics (magnetic snap, sliding drawer, butterfly opening, hydraulic lift, motorized pedestal).
   - VEHICLE MICRO-MOTION: Include subtle realistic movements (wheels slowly rotating to show brake calipers, LED DRLs illuminating, side mirrors unfolding, suspension settling).
   - ASMR SFX: Use rich tactile sounds (crisp tissue crinkle, cardboard friction, magnetic click, metallic clink, foam compression, film peel, carbon fiber touch).
   - Do NOT use the "CHARACTER CONSISTENCY LOCK" prefix in imagePrompt when Category is "CARBOX". Start imagePrompt directly with "Ultra-realistic ASMR unboxing scene:".
   - MANDATORY NEGATIVE SUFFIX: Every imagePrompt and videoPrompt MUST end with "(NO TEXT, NO CAPTIONS, NO TITLES, NO LOGOS, NO WATERMARKS, NO SUBTITLES, NO UI ELEMENTS, NO EXTRA VEHICLES, NO PEOPLE EXCEPT MANICURED HANDS, NO ANIMALS, NO PETS, NO DUPLICATE OBJECTS, NO LOW RESOLUTION, NO ARTIFACTS, NO DEFORMATIONS, NO CROPPED SUBJECT, NO CLUTTER, NO DISTRACTING BACKGROUND, NO RAPID CAMERA MOVEMENT, NO EXCESSIVE ZOOMING, NO FAST PANS, NO HANDHELD SHAKE, NO AGGRESSIVE WHIP PANS)".

Return ONLY valid JSON matching this exact structure:
{
  "title": "${ctx.title}",
  "hook": "Opening hook line",
  "summary": "Full story summary",
  "ending": "${ctx.ending}",
  "characters": [
    {
      "name": "${ctx.mainCharacterName}",
      "role": "Main Character",
      "age": "Animated Character",
      "gender": "Male or Female",
      "appearance": "${ctx.mainCharacterAppearance}",
      "clothing": "${ctx.mainCharacterClothing}",
      "face": "Facial description",
      "hair": "Hair description",
      "eyes": "Eye description",
      "skinTone": "Skin tone",
      "bodyType": "Body type",
      "accessories": "Accessories",
      "personality": "${ctx.mainCharacterPersonality}",
      "expressions": "Expressions",
      "typicalPoses": "Poses",
      "referencePrompt": "Master character reference image prompt"
    }
  ],
  "visualBible": {
    "style": "${ctx.visualStyle}",
    "lighting": "Lighting setup",
    "colorPalette": "Color palette",
    "cameraStyle": "Camera style",
    "lens": "35mm cinematic lens",
    "environment": "${ctx.location}",
    "atmosphere": "Engaging",
    "texture": "Clean renders",
    "renderingStyle": "3D Rendered",
    "aspectRatio": "9:16"
  },
  "scenes": [
    {
      "sceneNumber": 1,
      "duration": 8,
      "narration": "Narration text matching concept",
      "dialogue": "Short dialogue under 12 words",
      "imagePrompt": "If CARBOX: [Vehicle details]. Otherwise: CHARACTER CONSISTENCY LOCK: [Details]. (NO TEXT, NO TITLES, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN VISUAL RENDER)",
      "videoPrompt": "During this 8-second clip: 0-2s: [Entry]. 2-4s: [Action]. 4-6s: [Dialogue]. 6-8s: [Ending state]. (NO TEXT OVERLAYS, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN FULL FRAME VIDEO)",
      "camera": "Camera shot",
      "motion": "Time-sliced motion",
      "lighting": "Lighting setup",
      "sfx": "Action-matched SFX",
      "music": "Background music",
      "continuityNotes": "Continuity notes",
      "previousSceneState": "Prev state",
      "nextSceneState": "Next state"
    }
  ]
}`;

  let lastError: any = null;

  for (const modelName of CLAUDE_MODELS) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const response = await anthropic.messages.create({
        model: modelName,
        max_tokens: 8192,
        system: "You are a master short-form video director for Google Flow. You generate 100% logically consistent short video storyboards. Respond with ONLY valid JSON, no markdown, no explanation.",
        messages: [{ role: "user", content: prompt }],
      });

      const responseText = response.content[0].type === "text" ? response.content[0].text : "";
      const parsed = safeJsonParse(responseText, ProjectStoryOutputSchema, "Project Story Generator");
      const val = validateStoryboard(ctx, parsed);
      if (val.valid) {
        return {
          ...parsed,
          aiUsed: true,
          provider: "Claude (Anthropic)",
          model: modelName,
          generationMode: "FULL_AI",
        };
      }
      console.warn(`Claude (${modelName}) output failed validation:`, val.reason);
      lastError = new ValidationError({
        success: false,
        stage: "Storyboard Validator",
        reason: val.reason || "Generated storyboard failed story quality validation checks.",
      });
    } catch (error: any) {
      console.warn(`Claude (${modelName}) API call / parse error:`, error?.message || error);
      lastError = error;
    }
  }

  // Resilient fallback to deterministic blueprint engine if AI API error occurs
  console.warn("Claude generation error/timeout, using resilient blueprint pipeline:", lastError?.message);
  const fallback = generateFullStoryboardFromPipeline(input);
  return {
    ...fallback,
    aiUsed: false,
    provider: "Fallback Pipeline Engine",
    model: "built-in-pipeline",
    generationMode: "FALLBACK_PIPELINE",
  };
}

export async function generateIdeaSuggestionsWithClaude(
  input: SuggestIdeasInput
): Promise<string[]> {
  const categoryConfig = getCategoryConfig(input.category);

  // CLAUDE MODEL ROUTING
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ValidationError({
      success: false,
      stage: "API Configuration",
      reason: "ANTHROPIC_API_KEY environment variable is missing. Cannot generate idea suggestions without model credentials.",
    });
  }

  let lastError: any = null;

  const modelsToTry = Array.from(new Set([
    ...(input.aiModel && CLAUDE_MODELS.includes(input.aiModel) ? [input.aiModel] : []),
    "claude-sonnet-4-6",
    "claude-sonnet-4-5-20250929",
    "claude-haiku-4-5-20251001",
    "claude-opus-4-6",
  ]));

  for (const modelName of modelsToTry) {
    try {
      const anthropic = new Anthropic({ apiKey, timeout: 60000, maxRetries: 3 });
      const response = await anthropic.messages.create({
        model: modelName,
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `You are an expert cinematic AI video prompt writer specializing in viral short-form video prompts (Google Flow, VEO, Sora, Runway Gen-3).
Generate EXACTLY 1 highly creative, production-ready video concept idea strictly formatted as a complete detailed video prompt.

Category: ${categoryConfig.name} (${input.category})
Badge: ${categoryConfig.badge}
Description: ${categoryConfig.description}
Tone: ${categoryConfig.tone}
Language: ${input.language}
Visual Style: ${input.visualStyle}
${input.videoDuration ? `Video Duration: ${input.videoDuration} Seconds` : ""}
${
  input.charPerformance && /silent|reaction|dance|surprise|funny action|emotional/i.test(input.charPerformance) && !input.customDialogue
    ? `CRITICAL SILENT MANDATE (NO SPOKEN DIALOGUE):
The user selected Character Performance Mode: "${input.charPerformance}".
STRICT RULE: Do NOT include ANY spoken words, speech, or Urdu/English dialogue lines in the prompt!
The character must NOT speak. Focus 100% on facial expressions, physical acting, dancing, body movement, and sound effects.`
    : input.customDialogue
    ? `User Custom Spoken Dialogue: "${input.customDialogue}"`
    : "Dialogue Mandate: Include authentic, hilarious dialogue with funny Desi timing and comic punchlines."
}
${input.customSceneDescription ? `Situation/Scene Description: "${input.customSceneDescription}"` : ""}
${input.kidsAge ? `Characters Age: ${input.kidsAge}` : ""}
${input.kidsLocation ? `Scene Location: ${input.kidsLocation}` : ""}
${input.kidsHealth ? `Kids Health: ${input.kidsHealth}` : ""}
${input.kidsClothing ? `Kids Clothing/Outfit Style: ${input.kidsClothing}` : ""}
${input.kidsVibe ? `Kids Vibe/Mood: ${input.kidsVibe}` : ""}
${input.characterSetup ? `Character Setup: ${input.characterSetup}` : ""}
${input.charactersPerScene ? `Characters Per Scene: ${input.charactersPerScene}` : ""}
${input.kidsNationality && input.kidsNationality !== "Global / Any" ? `Nationality/Culture: ${input.kidsNationality}` : ""}
${input.musicType && input.musicType !== "None" ? `Background Music Type: ${input.musicType} (BACKGROUND MUSIC MANDATE: The scene is driven by ${input.musicType} soundtrack. Characters must groove, sway, dance, or move rhythmically in perfect beat sync with this music style).` : ""}
${input.seriousDialogueStyle && input.seriousDialogueStyle !== "None" ? `Serious Dialogue Style: ${input.seriousDialogueStyle} (DO NOT use slapstick or comedic jokes. Craft a focused ${input.seriousDialogueStyle} tone)` : ""}
${input.outroEffects && input.outroEffects !== "None" ? `Ending/Outro Visual Effects: ${input.outroEffects}` : ""}
${input.kidsExpression && input.kidsExpression !== "Any / AI Decides" ? `Kids Expression/Reaction Style: ${input.kidsExpression}` : ""}
${input.kidsFood && input.kidsFood !== "Any / AI Decides" ? `Food/Snack in Scene: ${input.kidsFood}` : ""}
${input.kidsProp && input.kidsProp !== "Any / AI Decides" ? `Prop/Object in Hand: ${input.kidsProp}` : ""}
${input.timeOfDay && input.timeOfDay !== "Any / AI Decides" ? `Time of Day/Lighting: ${input.timeOfDay}` : ""}
${input.storyBeat && input.storyBeat !== "Any / AI Decides" ? `Story Beat/Narrative Moment: ${input.storyBeat}` : ""}
${input.cameraShot && input.cameraShot !== "Any / AI Decides" ? `Camera Shot Style: ${input.cameraShot}` : ""}
${input.cameraShot && /fixed|static|lock/i.test(input.cameraShot) ? `STRICT CAMERA LOCK MANDATE: The camera MUST stay 100% stationary and locked on the speaking character throughout the entire 10-second clip. NO camera panning, NO wild zooms, NO background cuts, NO camera rotation. The speaking character remains centered in frame from start to finish.` : ""}
${input.charPerformance && input.charPerformance !== "Any / AI Decides" ? `Character Performance Mode: ${input.charPerformance}` : ""}
${input.category === "CARBOX" && input.carboxBrand ? `Vehicle Type / Brand / Model: ${input.carboxBrand}` : ""}
${input.category === "CARBOX" && input.carboxColor ? `Vehicle Color: ${input.carboxColor}` : ""}
${input.category === "CARBOX" && input.carboxPackaging ? `Packaging Style: ${input.carboxPackaging}` : ""}
${input.category === "CARBOX" && input.carboxBackground ? `Tabletop Background: ${input.carboxBackground}` : ""}
${
  (input.characterSetup && /shayar|mushaira|poet/i.test(input.characterSetup)) ||
  (input.customDialogue && /shayar|mushaira|wa\s*wah|irshad/i.test(input.customDialogue)) ||
  (input.seriousDialogueStyle === "Poetic/Shayari")
    ? `
SHAYAR & MUSHAIRA AUDIO & VISUAL MANDATE:
1. Setting: Traditional Mushaira Mehfil stage setting with Gao Takiya bolster cushions, brass microphone, and warm ambient lighting.
2. Audio Soundscape: Live background audience reaction with people saying "Wah Wah! Wah Wah!" and "Irshad!" during pauses in the Shayari poetry recitation.
3. Audio Balance: Audience "Wah Wah!" reactions must be mixed at a natural, warm background volume so they blend in smoothly without overpowering the main spoken voice.`
    : ""
}
${
  (input.characterSetup && /(boy|girl)\s*singer\s*\+\s*/i.test(input.characterSetup))
    ? `
LEAD SINGER & ANIMAL COMPANION MANDATE:
1. Main Lead Singer: The specified child (Boy or Girl) MUST be designated as the main lead singer holding the microphone or singing enthusiastically in the scene.
2. Companion Animal: The specified animal appears as a friendly companion character standing, sitting, listening, or reacting alongside the child singer.`
    : ""
}
${
  (input.characterSetup && /dulhan|dulha|bride|groom|married|nikkah|walima|barat|miya\s*biwi|couple/i.test(input.characterSetup))
    ? `
WEDDING & MARRIED COUPLE (DULHA & DULHAN) MANDATE:
1. Characters: Depict the specified married couple / bride & groom (Dulha & Dulhan) with authentic wedding or couple aesthetics.
2. Visuals & Attire: Traditional Pakistani/Desi wedding attire (heavy embroidered red/gold lehenga, royal sherwani, turban, sehra, henna, bridal jewelry, or cozy married couple home attire).
3. Tone & Chemistry: Heartwarming, respectful, loving, and authentic Desi romantic or family chemistry.`
    : ""
}

STRICT 9:16 PROMPT FORMAT MANDATE:
The generated prompt string MUST follow this EXACT structure:

[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]

10-second ${input.visualStyle || "high-quality 3D cartoon animation"} (Pixar & Illumination 3D render quality, soft PBR fabric & skin shaders, subsurface scattering, warm volumetric rim lighting, shallow depth of field with creamy background bokeh), [Detailed setting, lighting, environment, character setup, age, outfit, and props]. HOOK (0-3s): [Opening action ${input.charPerformance && /silent|reaction|dance|surprise|funny action|emotional/i.test(input.charPerformance) && !input.customDialogue ? "(NO SPOKEN DIALOGUE)" : "& dialogue"}]. ESCALATION (3-7s): [Camera movement & action escalation]. PUNCHLINE (7-10s): [Visual reaction/gag ending, freeze frame, sound effects, music]. No text, no logos, no overlays.

Return ONLY a valid JSON array of 1 string containing the full prompt:
[
  "[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]\\n\\n10-second high-quality 3D cartoon animation..."
]`,
          },
        ],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const cleaned = cleanJsonResponse(text);
      
      let resultArr: string[] = [];
      try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0) {
          resultArr = parsed.map(String);
        } else if (typeof parsed === "string") {
          resultArr = [parsed];
        }
      } catch (e1) {
        try {
          const repaired = repairJsonString(cleaned);
          const parsedRepaired = JSON.parse(repaired);
          if (Array.isArray(parsedRepaired) && parsedRepaired.length > 0) {
            resultArr = parsedRepaired.map(String);
          }
        } catch (e2) {
          if (cleaned.trim().length > 0) {
            const rawIdea = cleaned
              .replace(/^\[\s*"/, "")
              .replace(/"\s*\]$/, "")
              .replace(/\\"/g, '"')
              .trim();
            if (rawIdea) {
              resultArr = [rawIdea];
            }
          }
        }
      }

      if (resultArr.length > 0) {
        return resultArr;
      }
    } catch (err: any) {
      console.warn(`Claude (${modelName}) idea suggestion error:`, err?.message || err);
      lastError = err;
    }
  }

  throw new ValidationError({
    success: false,
    stage: "Idea Suggestion Generator",
    reason: lastError?.message || "API is not working. Please check your API key or model permissions.",
  });
}

export async function regenerateSingleSceneWithClaude(
  input: SingleSceneRegenInput
): Promise<z.infer<typeof SceneSchema>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ValidationError({
      success: false,
      stage: "API Configuration",
      reason: "ANTHROPIC_API_KEY environment variable is missing. Cannot regenerate scene without active model credentials.",
    });
  }

  const ctx = generateStoryContext({
    category: input.category,
    duration: input.totalScenes * 8,
    language: input.language,
    visualStyle: input.visualStyle,
    idea: input.idea,
  });

  const mainChar = input.characters[0] || { name: ctx.mainCharacterName, appearance: ctx.mainCharacterAppearance };
  let lastError: any = null;

  const isCarbox = input.category === "CARBOX";

  for (const modelName of CLAUDE_MODELS) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const prompt = `You are a short video director. Regenerate scene #${input.sceneNumber} of ${input.totalScenes} for:
Idea: "${input.idea}"
Language: ${input.language}
Category: ${input.category}
Character: ${mainChar.name} (${mainChar.appearance})
Visual Style: ${input.visualStyle}
${input.userPromptToRegen ? `User Directive: "${input.userPromptToRegen}"` : ""}

CRITICAL RULES:
${isCarbox ? `CARBOX MANDATE: STRICTLY NO ANIMALS, NO DOGS, NO CATS, NO PETS. Car selected is the ONLY character/focus. BOTH narration AND dialogue MUST be empty strings (""). Luxury commercial product photography aesthetic with zero handheld camera movement. Timeline: 0-2s entry/packaging, 2-4s unwrap/ASMR, 4-6s mechanism release, 6-8s vehicle reveal with subtle micro-motion (LED DRL glow, wheel rotation).` : ""}
If Language is "Punjabi" or Category is "PUNJABI_JOKE", dialogue and narration MUST be strictly in Punjabi / Roman Punjabi.
If Language is "Urdu", "Roman Urdu", "Hindi", or Category is "HINDI_JOKE", dialogue and narration MUST be strictly in Urdu / Roman Urdu / Hindi.

Return ONLY valid JSON matching:
{
  "sceneNumber": ${input.sceneNumber},
  "duration": 8,
  "narration": ${isCarbox ? `""` : `"Narration text"`},
  "dialogue": ${isCarbox ? `""` : `"Short dialogue under 12 words"`},
  "imagePrompt": ${isCarbox ? `"Ultra-realistic ASMR unboxing scene: [Vehicle details]. 35mm anamorphic lens, ray-traced reflections, volumetric softbox lighting, shallow depth of field. (NO TEXT, NO CAPTIONS, NO TITLES, NO LOGOS, NO WATERMARKS, NO SUBTITLES, NO UI ELEMENTS, NO EXTRA VEHICLES, NO PEOPLE EXCEPT MANICURED HANDS, NO ANIMALS, NO PETS, NO DUPLICATE OBJECTS, NO LOW RESOLUTION, NO ARTIFACTS, NO DEFORMATIONS, NO CROPPED SUBJECT, NO CLUTTER, NO DISTRACTING BACKGROUND)"` : `"CHARACTER CONSISTENCY LOCK: Maintain exact features of ${mainChar.name}. (NO TEXT, NO TITLES, CLEAN VISUAL RENDER)."`},
  "videoPrompt": ${isCarbox ? `"During this 8-second clip: 0-2s: Packaging glides into frame on tabletop. 2-4s: Manicured fingers peel wrap with ASMR sound cues. 4-6s: Unboxing mechanism opens revealing vehicle. 6-8s: Cinematic orbital camera tracking reveal with LED illumination. (NO TEXT, NO CAPTIONS, NO TITLES, NO LOGOS, NO WATERMARKS, NO SUBTITLES, NO UI ELEMENTS, NO EXTRA VEHICLES, NO PEOPLE EXCEPT MANICURED HANDS, NO ANIMALS, NO PETS, NO DUPLICATE OBJECTS, NO LOW RESOLUTION, NO ARTIFACTS, NO DEFORMATIONS, NO CROPPED SUBJECT, NO CLUTTER, NO DISTRACTING BACKGROUND)."` : `"During this 8-second clip: 0-2s: Entry. 2-4s: Action. 4-6s: Action. 6-8s: End pose. (NO TEXT OVERLAYS, CLEAN VIDEO)."`},
  "camera": "Camera angle",
  "motion": "Character motion",
  "lighting": "Lighting",
  "sfx": "SFX cue",
  "music": "Music track",
  "continuityNotes": "Continuity notes",
  "previousSceneState": "${input.previousSceneState || ""}",
  "nextSceneState": "${input.nextSceneState || ""}"
}`;

      const response = await anthropic.messages.create({
        model: modelName,
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      });

      const responseText = response.content[0].type === "text" ? response.content[0].text : "";
      const parsed = safeJsonParse(responseText, SceneSchema, "Single Scene Generator");
      return parsed;
    } catch (err: any) {
      console.warn(`Claude (${modelName}) scene regeneration error:`, err?.message || err);
      lastError = err;
    }
  }

  if (lastError instanceof ValidationError) {
    throw lastError;
  }

  throw new ValidationError({
    success: false,
    stage: "Single Scene Generator",
    scene: input.sceneNumber,
    reason: lastError?.message || `AI model failed to regenerate scene #${input.sceneNumber}.`,
  });
}

export async function generateVariationsWithClaude(
  input: GenerateVariationsInput
): Promise<string[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ValidationError({
      success: false,
      stage: "API Configuration",
      reason: "ANTHROPIC_API_KEY environment variable is missing. Cannot generate variations without model credentials.",
    });
  }

  let lastError: any = null;

  for (const modelName of CLAUDE_MODELS) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const prompt = `Generate 3 distinct creative variations for the '${input.type}' of a short video concept.

Category: ${input.category}
Idea: "${input.idea}"
Language: ${input.language}

Return ONLY a valid JSON array of 3 strings:
[
  "Variation 1 option...",
  "Variation 2 option...",
  "Variation 3 option..."
]`;

      const response = await anthropic.messages.create({
        model: modelName,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const cleaned = cleanJsonResponse(text);
      const array = JSON.parse(cleaned);
      if (Array.isArray(array) && array.length > 0) {
        return array.map(String);
      }
    } catch (e: any) {
      console.warn(`Claude (${modelName}) variation generation error:`, e?.message || e);
      lastError = e;
    }
  }

  if (lastError instanceof ValidationError) {
    throw lastError;
  }

  throw new ValidationError({
    success: false,
    stage: "Variations Generator",
    reason: lastError?.message || `AI model failed to generate variations for type '${input.type}'.`,
  });
}

export async function optimizeIdeaWithClaude(rawIdea: string, aiModel?: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Anthropic API key is not configured.");
  
  const anthropic = new Anthropic({ apiKey });

  const prompt = `You are an expert AI video scriptwriter for short-form clips.
Take the following raw story idea and rewrite it into a highly engaging, viral video-friendly script.
Based on the amount of dialogue and action, break it down into an appropriate number of 8-second scenes. Keep the dialogue punchy.

Raw Idea:
"""
${rawIdea}
"""

Return ONLY a valid JSON object matching this exact structure:
{
  "title": "A catchy title for the optimized script",
  "scenes": [
    {
      "sceneNumber": 1,
      "content": "The specific dialogue and action for this 8-second scene..."
    }
  ]
}`;

  const modelsToTry = Array.from(new Set([
    ...(aiModel && CLAUDE_MODELS.includes(aiModel) ? [aiModel] : []),
    "claude-sonnet-4-6",
    "claude-sonnet-4-5-20250929",
    "claude-haiku-4-5-20251001",
    "claude-opus-4-6",
  ]));

  for (const modelName of modelsToTry) {
    try {
      const response = await anthropic.messages.create({
        model: modelName,
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const cleaned = cleanJsonResponse(text);
      const data = JSON.parse(cleaned);
      if (data && data.title && Array.isArray(data.scenes)) {
        return data;
      }
    } catch (e: any) {
      console.warn(`Claude (${modelName}) optimization error:`, e?.message || e);
    }
  }

  throw new Error("Failed to optimize idea. AI returned invalid format or failed.");
}
export async function generateDialogueSuggestionWithClaude(input: {
  category: string;
  language: string;
  customIdea?: string;
  existingDialogue?: string;
  kidsAge?: string;
  kidsLocation?: string;
  kidsHealth?: string;
  kidsClothing?: string;
  kidsExpression?: string;
  kidsFood?: string;
  kidsProp?: string;
  timeOfDay?: string;
  storyBeat?: string;
  cameraShot?: string;
  charPerformance?: string;
  kidsVibe?: string;
  characterSetup?: string;
  charactersPerScene?: string;
  aiModel?: string;
  seriousDialogueStyle?: string;
  customSceneDescription?: string;
  outroEffects?: string;
}): Promise<string> {
  const isEnglish = input.language === "English";
  const isPunjabi = input.language === "Punjabi" || input.category === "PUNJABI_JOKE";
  const isUrdu = input.language === "Urdu" || input.language === "Roman Urdu" || input.category === "HINDI_JOKE";

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ValidationError({
      success: false,
      stage: "API Configuration",
      reason: "ANTHROPIC_API_KEY environment variable is missing.",
    });
  }

  const modelsToTry = Array.from(new Set([
    ...(input.aiModel && CLAUDE_MODELS.includes(input.aiModel) ? [input.aiModel] : []),
    "claude-sonnet-4-6",
    "claude-sonnet-4-5-20250929",
    "claude-haiku-4-5-20251001",
    "claude-opus-4-6",
  ]));

  for (const modelName of modelsToTry) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const response = await anthropic.messages.create({
        model: modelName,
        max_tokens: 256,
        messages: [
          {
            role: "user",
            content: `You are an expert Urdu and Punjabi script corrector and editor specializing in viral short video scripts (Google Flow).
Your SOLE TASK is to automatically correct and refine Urdu and Punjabi scripts.

Text to fix: "${input.existingDialogue || input.customIdea || ""}"

STRICT SCRIPT CORRECTION & DIALOGUE RULES:
1. SPELLING & GRAMMAR: Fix all spelling errors, grammatical mistakes, and awkward phrasing in Urdu (Urdu script / Nastaliq or Roman Urdu) or Punjabi (Shahmukhi or Roman Punjabi).
2. DIACRITICS (Zair, Zabar, Pesh): Add proper Urdu/Arabic diacritics (Zair ِ, Zabar َ, Pesh ُ, Shaddah ّ, Tanween ً) where helpful to ensure accurate pronunciation and reading clarity.
3. PRESERVE MEANING: Keep the original meaning, joke timing, and intent 100% intact. Do NOT change the story or punchline, only refine and elevate the script quality.
4. IF TEXT IS BLANK: If no text was provided in the input, generate a fresh, high-quality, perfectly punctuated Urdu/Punjabi dialogue matching the category "${input.category}".
5. Output Format: Return ONLY the corrected, clean dialogue text with NO extra intro, outro explanations, or markdown quotes.`,
          },
        ],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const cleaned = text.trim().replace(/^["']|["']$/g, "").trim();
      if (cleaned) {
        return cleaned;
      }
    } catch (err: any) {
      console.warn(`Claude dialogue suggestion error (${modelName}):`, err?.message || err);
    }
  }

  throw new ValidationError({
    success: false,
    stage: "Dialogue Suggestion Generator",
    reason: "API is not working. Please check your API key or model permissions.",
  });
}

export const SocialContentSchema = z.object({
  title: z.string().min(1),
  shortsTitle: z.string().optional().default(""),
  reelsTitle: z.string().optional().default(""),
  tiktokTitle: z.string().optional().default(""),
  description: z.string().optional().default(""),
  hashtags: z.string().min(1),
  trendingTags: z.string().optional().default(""),
});

export type SocialContentOutput = z.infer<typeof SocialContentSchema>;

export function cleanSocialTitle(title: string): string {
  if (!title) return "";
  return title
    .replace(/Like\s*کریں\s*اور\s*دوستوں\s*کے\s*ساتھ\s*Share\s*ضرور\s*کریں!?\s*❤️?/gi, "")
    .replace(/Like\s*کریں\s*اور\s*Share\s*کریں!?\s*❤️?/gi, "")
    .replace(/Like\s*کریں\s*اور\s*شیئر\s*کریں!?\s*❤️?/gi, "")
    .replace(/Like\s*&\s*Share\s*with\s*friends!?\s*❤️?/gi, "")
    .replace(/-\s*Like\s*&\s*Share!?/gi, "")
    .replace(/\|?\s*Like\s*&\s*Share!?/gi, "")
    .replace(/\(?Like\s*&\s*Share\)?/gi, "")
    .replace(/Like\s*کریں/gi, "")
    .replace(/Share\s*ضرور\s*کریں/gi, "")
    .replace(/Share\s*کریں/gi, "")
    .replace(/👍\s*Like\s*&\s*Share/gi, "")
    .trim();
}

export async function generateSocialContentWithClaude(input: {
  ideaText: string;
  category: string;
  language: string;
  visualStyle?: string;
  aiModel?: string;
}): Promise<SocialContentOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ValidationError({
      success: false,
      stage: "API Configuration",
      reason: "ANTHROPIC_API_KEY environment variable is missing.",
    });
  }

  const modelsToTry = Array.from(new Set([
    ...(input.aiModel && CLAUDE_MODELS.includes(input.aiModel) ? [input.aiModel] : []),
    "claude-sonnet-4-6",
    "claude-sonnet-4-5-20250929",
    "claude-haiku-4-5-20251001",
    "claude-opus-4-6",
  ]));

  const prompt = `You are a world-class viral social media strategist for YouTube Shorts, Facebook Reels, TikTok, and Instagram Reels.
Generate platform-optimized, professional ENGLISH social media content (titles, description, and hashtags) for the following video concept.

Video Concept:
"${input.ideaText}"

Category: ${input.category}
Original Dialogue/Script Language: ${input.language}
Visual Style: ${input.visualStyle || "Standard 3D"}

CRITICAL ENGLISH-ONLY SOCIAL MEDIA MANDATE:
1. ALL TITLES, DESCRIPTIONS, AND HASHTAGS MUST BE 100% IN HIGHLY ENGAGING, PROFESSIONAL ENGLISH regardless of the video's spoken language (Urdu, Punjabi, Hindi, etc.).
2. DO NOT translate the video's original dialogue word-for-word into English; instead, analyze the core story/humor/action and write engaging, viral English copy.
3. "title": Highly engaging, universal main English title (clean, short, catchy, no call-to-actions).
4. "shortsTitle": Catchy, emoji-rich YouTube Shorts English title with high-curiosity hook (e.g. "Wait for the ending! 😱🔥 #Shorts").
5. "reelsTitle": Engaging, viral English Facebook Reels title (e.g. "Toddler's sneaky plan caught on camera! 🤣👇").
6. "tiktokTitle": Energetic, relatable TikTok & Instagram Reels English title (e.g. "When your toddler takes over the house... 😭💀").
7. "description": SEO-friendly, short 2-line English video caption/description explaining the fun scenario.
8. "hashtags": EXACTLY 4 to 5 core English hashtags (e.g. "#FunnyKids #3DAnimation #Shorts #Viral #DesiComedy").
9. "trendingTags": 6 to 8 trending viral hashtags in English (e.g. "#TrendingReels #ForyouPage #ShortsViral #ComedyShorts #Relatable #ViralVideo").
10. DO NOT include any "Like & Share" or "Subscribe" CTAs in any title.

OUTPUT MUST BE VALID JSON ONLY with this exact structure:
{
  "title": "Universal Main Video Title",
  "shortsTitle": "🔴 YouTube Shorts: Title Here 😱🔥",
  "reelsTitle": "📘 FB Reels: Title Here 🤣😭",
  "tiktokTitle": "🎵 TikTok / IG: Title Here 💀✨",
  "description": "Short engaging video description...",
  "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5",
  "trendingTags": "#TrendingReels #ForyouPage #Shorts #ViralVideo #DesiHumor #ComedyReels"
}`;

  for (const modelName of modelsToTry) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const response = await anthropic.messages.create({
        model: modelName,
        max_tokens: 900,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      if (text) {
        const parsed = safeJsonParse(text, SocialContentSchema, "Social Content Generator");
        parsed.title = cleanSocialTitle(parsed.title);
        if (parsed.shortsTitle) parsed.shortsTitle = cleanSocialTitle(parsed.shortsTitle);
        if (parsed.reelsTitle) parsed.reelsTitle = cleanSocialTitle(parsed.reelsTitle);
        if (parsed.tiktokTitle) parsed.tiktokTitle = cleanSocialTitle(parsed.tiktokTitle);
        return parsed;
      }
    } catch (err: any) {
      console.warn(`Claude social content error (${modelName}):`, err?.message || err);
    }
  }

  throw new ValidationError({
    success: false,
    stage: "Social Content Generator",
    reason: "API is not working. Please check your API key or model permissions.",
  });
}
