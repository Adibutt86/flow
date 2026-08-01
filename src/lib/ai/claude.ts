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
  "claude-haiku-4-5"
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

function safeJsonParse<T>(rawText: string, schema: z.ZodSchema<T>, stageName: string = "AI Generation"): T {
  const cleaned = cleanJsonResponse(rawText);
  let parsedJson: any;
  try {
    parsedJson = JSON.parse(cleaned);
  } catch (err: any) {
    try {
      const repaired = cleaned
        .replace(/,\s*([\]}])/g, "$1")
        .replace(/[\u0000-\u001F]+/g, " ");
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
7. Image prompt MUST start with: "CHARACTER CONSISTENCY LOCK: Maintain exact features of ${ctx.mainCharacterName}. (NO TEXT, NO TITLES, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN VISUAL RENDER)."
8. VISUAL STYLE MANDATE:
   - The requested Visual Style (${ctx.visualStyle}) MUST be explicitly written into EVERY single imagePrompt, videoPrompt, and the visualBible description. Do not ignore the chosen style!
9. CARBOX SPECIFIC RULES (If Category is "CARBOX"):
   - ALL scenes MUST be completely SILENT of human voices. Do NOT include ANY dialogue. Set the dialogue field to an empty string or "(No dialogue)".
   - The sfx field MUST ONLY include realistic car unpacking and reveal sound effects (e.g., crisp plastic peeling, satisfying box sliding, sharp clicks, subtle metallic clinks). No goofy or cartoonish sounds.

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
      "imagePrompt": "CHARACTER CONSISTENCY LOCK: [Details]. (NO TEXT, NO TITLES, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN VISUAL RENDER)",
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
        max_tokens: 3000,
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

  if (lastError instanceof ValidationError) {
    throw lastError;
  }

  throw new ValidationError({
    success: false,
    stage: "Project Story Generator",
    reason: lastError?.message || "AI model failed to generate a valid storyboard after model retries.",
  });
}

export async function generateIdeaSuggestionsWithClaude(
  input: SuggestIdeasInput
): Promise<string[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ValidationError({
      success: false,
      stage: "API Configuration",
      reason: "ANTHROPIC_API_KEY environment variable is missing. Cannot generate idea suggestions without model credentials.",
    });
  }

  const categoryConfig = getCategoryConfig(input.category);
  let lastError: any = null;

  for (const modelName of ["claude-sonnet-4-6"]) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const response = await anthropic.messages.create({
        model: modelName,
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `You are an expert AI video scriptwriter for short 8-second video clips (Google Flow / VEO format).
Generate EXACTLY 2 distinct, highly creative, family-friendly viral video concept ideas strictly tailored to the chosen Category, Language, and Visual Style below.

Category: ${categoryConfig.name} (${input.category})
Badge: ${categoryConfig.badge}
Description: ${categoryConfig.description}
Tone: ${categoryConfig.tone}
Pacing: ${categoryConfig.pacing}
Hook Style: ${categoryConfig.hookStyle}
Language: ${input.language}
Visual Style: ${input.visualStyle}
${input.category === "CUTE_KIDS" && input.kidsAge ? `Characters Age: ${input.kidsAge}` : ""}
${input.category === "CUTE_KIDS" && input.kidsHealth ? `Kids Health/Vibe: ${input.kidsHealth}` : ""}
${input.category === "CUTE_KIDS" && input.characterSetup ? `Character Setup: ${input.characterSetup}` : ""}
${input.category === "CUTE_KIDS" && input.kidsNationality && input.kidsNationality !== "Global / Any" ? `Nationality/Culture: ${input.kidsNationality}` : ""}
${input.category === "CARBOX" && input.carboxBrand ? `Car Brand / Model: ${input.carboxBrand}` : ""}
${input.category === "CARBOX" && input.carboxColor ? `Car Color: ${input.carboxColor}` : ""}
${input.category === "CARBOX" && input.carboxPackaging ? `Packaging Style: ${input.carboxPackaging}` : ""}
${input.category === "CARBOX" && input.carboxBackground ? `Tabletop Background: ${input.carboxBackground}` : ""}

STRICT CATEGORY & LANGUAGE GUIDELINES:
0. SAFETY RULE: DO NOT use copyrighted brand names like "Pixar", "Disney", or specific copyrighted characters anywhere. Use generic terms like "High-quality 3D animation" or "Cartoon style" instead.

1. If Category is "PUNJABI_JOKE" or Language is "Punjabi":
   - ALL 2 ideas MUST be funny Punjabi jokes/chutkule written in Roman Punjabi.
   - Include authentic Punjabi characters (Santa, Banta, Papaji, Bebe, Jatt, Inspector).

2. If Category is "HINDI_JOKE" or Language is "Hindi" or "Urdu" or "Roman Urdu":
   - ALL 2 ideas MUST be funny Desi jokes written in Roman Hindi/Urdu.

3. If Category is "HORROR":
   - ALL 2 ideas MUST be terrifying eerie horror tales with creepy visual hooks and dark twists.

4. If Category is "FUNNY_ANIMALS":
   - ALL 2 ideas MUST feature hilarious pets/animals in absurd human situations.

5. If Category is "KIDS_FUNNY":
   - ALL 2 ideas MUST be cute, whimsical 3D animated style child & pet physical comedy.

6. If Category is "CARBOX":
   - ALL 2 ideas MUST be ultra-realistic, ASMR-style top-down unboxing videos of premium die-cast cars.
   - You MUST incorporate the EXACT requested Car Brand, Color, Packaging, and Background into the description.
   - Describe satisfying peeling, clicking, and unwrapping sounds and textures.

Return ONLY a valid JSON array of 2 distinct strings:
[
  "Idea 1...",
  "Idea 2..."
]`,
          },
        ],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const cleaned = cleanJsonResponse(text);
      const array = JSON.parse(cleaned);
      if (Array.isArray(array) && array.length > 0) {
        return array.map(String);
      }
    } catch (err: any) {
      console.warn(`Claude (${modelName}) idea suggestion error:`, err?.message || err);
      lastError = err;
    }
  }

  throw new ValidationError({
    success: false,
    stage: "Idea Suggestion Generator",
    reason: lastError?.message || "AI model failed to generate idea suggestions.",
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

CRITICAL LANGUAGE RULE:
If Language is "Punjabi" or Category is "PUNJABI_JOKE", dialogue and narration MUST be strictly in Punjabi / Roman Punjabi.
If Language is "Urdu", "Roman Urdu", "Hindi", or Category is "HINDI_JOKE", dialogue and narration MUST be strictly in Urdu / Roman Urdu / Hindi.

Return ONLY valid JSON matching:
{
  "sceneNumber": ${input.sceneNumber},
  "duration": 8,
  "narration": "Narration text in specified language",
  "dialogue": "Short dialogue under 12 words in specified language",
  "imagePrompt": "CHARACTER CONSISTENCY LOCK: Maintain exact features of ${mainChar.name}. (NO TEXT, NO TITLES, CLEAN VISUAL RENDER).",
  "videoPrompt": "During this 8-second clip: 0-2s: Entry. 2-4s: Action. 4-6s: Dialogue. 6-8s: End pose. (NO TEXT OVERLAYS, CLEAN VIDEO).",
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

export async function optimizeIdeaWithClaude(rawIdea: string) {
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

  for (const modelName of ["claude-sonnet-4-6"]) {
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
