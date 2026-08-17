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
  "claude-3-5-sonnet-20241022",
  "claude-3-7-sonnet-20250219",
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
    ...CLAUDE_MODELS,
  ]));

  for (const modelName of modelsToTry) {
    try {
      const anthropic = new Anthropic({ apiKey, timeout: 60000, maxRetries: 3 });
      const maxTokens = 4096;
      const response = await anthropic.messages.create({
        model: modelName,
        max_tokens: maxTokens,
        messages: [
          {
            role: "user",
            content: `You are an expert cinematic AI video prompt writer specializing in viral short-form video prompts (Google Flow, VEO, Sora, Runway Gen-3).
Generate EXACTLY 1 highly creative, production-ready video concept idea strictly formatted as a clean 9:16 vertical video prompt.

Category: ${categoryConfig.name} (${input.category})
Tone: ${categoryConfig.tone}
Language: ${input.language || "Urdu"} (DEFAULT: Urdu)
Visual Style: ${input.visualStyle}

🔴 SPOKEN DIALOGUE LANGUAGE MANDATE:
All spoken dialogue, character script lines, and voiceover text MUST be written strictly in "${input.language || 'Urdu'}".
- If Language is "Urdu" (Default): Output authentic Urdu script in native Urdu script (e.g. "ابو! آپ کہاں جا رہے ہیں؟").
- If Language is "Roman Urdu": Output spoken script in Roman Urdu (e.g. "Abu! Aap kahan ja rahe hain?").
- If Language is "Hindi": Output spoken script in Hindi (Devanagari script).
- If Language is "Punjabi": Output spoken script in authentic Punjabi.
- If Language is "English": Output spoken script in English.
${input.compactMode !== false ? "\n─── COMPACT 9:16 MOBILE PROMPT MANDATE: Output ONLY the 9:16 vertical video prompt and spoken script line. STRICTLY SKIP ALL social titles, video descriptions, core hashtags, trending tags, and extra metadata fluff to save credits. ───\n" : ""}
─── STRICT AI VIDEO GENERATOR PROMPT MANDATE (GOOGLE FLOW / GEMINI / VEO 2 / SORA / RUNWAY): ───
1. 100% ENGLISH VISUAL PROMPT: The visual scene prompt block MUST be 100% clean English describing ONLY 9:16 framing, lighting, setting, character specs, camera motion, and action beat.
2. DEDICATED DIALOGUE LINES: NEVER embed Urdu script lines inside the visual video prompt block! All spoken dialogue MUST be placed on a separate dedicated line starting with "💬 Spoken Dialogue:".
3. POSITIVE STATEMENTS: Do NOT write negative words like "NO cartoons" or "NO kids" inside positive visual prompts. State visual style positively (e.g. "Live-action photorealistic 8K cinema").
4. CLEAN TIME FORMATTING: Always use hyphenated time formats like "(0-3s)" or "(3-7s)", never unhyphenated digits like "03s" or "37s".
5. SAFE CLOTHING DESCRIPTIONS: Describe outfits safely (e.g. "open linen shirt over an inner shirt") to pass AI model safety policies 100%.
6. 100% VERBATIM CUSTOM DIALOGUE PRESERVATION (ALL CATEGORIES): If custom spoken dialogue or script is provided in Urdu, Roman Urdu, Hindi, Punjabi, or English, you MUST output that text EXACTLY VERBATIM as provided by the user on the "💬 Spoken Dialogue:" line across ALL categories. NEVER translate user custom dialogue to English! NEVER rewrite, translate, or alter native Urdu text in any category!
7. ZERO WORD REPETITION & NATURAL LIP-SYNC: Ensure video generation prompts mandate smooth natural lip-sync, zero word repetition, zero word stutter, and fluid mouth motion so characters never repeat words or loop mouth movements.
8. 8-SECOND DIALOGUE TIMING & NATURAL PAUSES: All spoken Shayari/dialogue lines MUST be paced with natural pauses (using '...') and finish completely within 8 seconds (0-8s), leaving 8-10s for lingering silent reaction.
───────────────────────────────────────────────────────────────────────────────────────────
${
  input.withoutDialogue
    ? `CRITICAL WITHOUT DIALOGUE MANDATE (STRICTLY NO SPOKEN DIALOGUE OR SCRIPT):
STRICT RULE: Do NOT include ANY spoken dialogue, speech, spoken words, spoken conversation lines, or spoken script text in the generated concept!
STRICT RULE: Do NOT output any "Spoken Dialogue:" label, script text blocks, or spoken poetry lines in the prompt text.
The concept MUST be structured as a clean, concise visual story (small idea format) communicated strictly through:
- Character physical actions & body posture
- Facial expressions & emotional reactions
- Environment, room lighting & set design
- Camera movement & slow framing
- Scene progression & visual storytelling
Do NOT write any spoken speech or dialogue lines anywhere in the prompt.`
    : input.charPerformance && /silent|reaction|dance|surprise|funny action|emotional/i.test(input.charPerformance) && !input.customDialogue
    ? `CRITICAL SILENT MANDATE (NO SPOKEN DIALOGUE):
The user selected Character Performance Mode: "${input.charPerformance}".
STRICT RULE: Do NOT include ANY spoken words, speech, or Urdu/English dialogue lines in the prompt!
The character must NOT speak. Focus 100% on facial expressions, physical acting, dancing, body movement, and sound effects.`
    : input.customDialogue
    ? (() => {
        const isMultiChar = /Boy:|Girl:|Abu:|Baita:|Amma:|Uncle:|لڑکا|لڑکی|ابو|بیٹا|امی|انکل/.test(input.customDialogue);
        if (isMultiChar) {
          return `🔴 CRITICAL MANDATE FOR USER MULTI-CHARACTER DIALOGUE SCRIPT:
The user has provided a MULTI-CHARACTER BACK-AND-FORTH DIALOGUE SCRIPT with labelled speakers:
"""
${input.customDialogue}
"""

THIS IS A CONVERSATION BETWEEN MULTIPLE CHARACTERS. STRICT VIDEO GENERATOR RULES:

━━━ CHARACTER SPATIAL LOCK (PREVENT MIXING) ━━━
To prevent the video generator from mixing up characters, you MUST lock each character to a fixed screen position throughout the ENTIRE video:
- CHARACTER 1 (Boy / لڑکا / Abu / ابو / Uncle / انکل): PERMANENTLY anchored to the LEFT SIDE of the 9:16 frame. Camera ALWAYS frames this character from the LEFT when they speak.
- CHARACTER 2 (Girl / لڑکی / Baita / بیٹا / Amma / امی): PERMANENTLY anchored to the RIGHT SIDE of the 9:16 frame. Camera ALWAYS frames this character from the RIGHT when they speak.
- Both characters are VISUALLY DISTINCT with clearly different appearance, clothing color, and hairstyle so the video generator never confuses them.

━━━ PER-LINE VISUAL CUE FORMAT ━━━
For EACH dialogue line in the script, the generated video prompt MUST include an explicit visual camera instruction immediately before the 💬 dialogue line:
  [Camera shifts LEFT — Boy speaks] 💬 Boy: [verbatim text]
  [Camera shifts RIGHT — Girl reacts with a subtle smile] 💬 Girl: [verbatim text]
  [Camera shifts LEFT — Boy raises an eyebrow] 💬 Boy: [verbatim text]
  [Camera shifts RIGHT — Girl laughs softly] 💬 Girl: [verbatim text]
  (Apply this pattern for EVERY line in the user's script, in order)

━━━ STRICT RULES ━━━
1. Label mapping (NEVER swap these):
   - "Boy:" or "لڑکا" = LEFT-side male character ONLY
   - "Girl:" or "لڑکی" = RIGHT-side female character ONLY
   - "Abu:" or "ابو" = LEFT-side father character ONLY
   - "Baita:" or "بیٹا" = RIGHT-side son/child character ONLY
   - "Amma:" or "امی" = RIGHT-side mother character ONLY
   - "Uncle:" or "انکل" = LEFT-side uncle character ONLY
2. Output ALL lines in EXACT user order — do NOT reorder, skip, or merge any lines.
3. NEVER put two different characters' dialogue on the same 💬 line.
4. NEVER translate, rephrase, or modify any Urdu/native script text.
5. The visual scene paragraph must explicitly mention that characters are spatially locked left/right throughout the entire clip to prevent character confusion.`;
        } else {
          return `🔴 CRITICAL MANDATE FOR USER CUSTOM DIALOGUE:
The user typed/pasted EXACT custom spoken dialogue in Urdu/native script:
"${input.customDialogue}"

YOU MUST INCLUDE THIS EXACT LINE VERBATIM IN YOUR FINAL OUTPUT:
💬 Spoken Dialogue: "${input.customDialogue}"

STRICT RULES:
1. Do NOT translate "${input.customDialogue}" to English!
2. Do NOT summarize, modify, or rephrase the Urdu/native script text!
3. Output "${input.customDialogue}" 100% UNCHANGED on the "💬 Spoken Dialogue:" line!
4. The visual 9:16 video prompt paragraph above it must be in clean English, but the "💬 Spoken Dialogue:" line MUST contain "${input.customDialogue}" verbatim!
5. EMOJI TO ACTION & EXPRESSION TRANSLATION: If the dialogue text contains emojis (e.g. 😡, 😂, 😭, 🤫, 🏃‍♂️, 🍦, 📱, 😤, 😠, 🧸, 🏆), you MUST interpret each emoji as a direct visual instruction for the character's facial expression, emotional reaction, gesture, or physical action/prop in the visual 9:16 video prompt description (e.g. 😡 = angry pouting face & foot stomp, 😂 = uncontrollable giggling & belly laugh, 😭 = dramatic crying expression, 🤫 = finger on lips whisper, 🏃‍♂️ = dashing/running away, 🍦 = holding/eating ice cream, 🏆 = proudly holding a shiny gold trophy & cheering victory).`;
        }
      })()
    : "Dialogue Mandate: Include authentic, hilarious dialogue in the selected language with funny Desi timing and comic punchlines."
}
${
  input.category === "CUTE_KIDS"
    ? "\n─── CUTE KIDS CATEGORY: Main protagonist MUST be a cute innocent child/toddler (3-6yo). If a Father & Son setup is selected, Abu is the adult father (28-35yo) and Baita is the cute toddler. Keep spoken dialogue on dedicated separate lines starting with 💬 Spoken Dialogue. ───"
    : input.category === "SONG"
    ? "\n─── SONG CATEGORY: Characters MUST be adult vocalists/singers ONLY. NO children, NO toddlers, NO cute kids. ───"
    : input.category === "POETRY"
    ? "\n─── POETRY CATEGORY: Characters MUST be adult Shayars/poets ONLY. NO children, NO toddlers, NO cute kids. ───"
    : input.category === "SHORT_CLIP"
    ? "\n─── SHORT CLIP CATEGORY: 10s Connected Video Clips with 100% Locked Character Consistency Across Clips. ───"
    : input.category === "CHARACTER_BIBLE"
    ? "\n─── CHARACTER BIBLE CATEGORY: Generate a comprehensive locked Character & World Bible specifying exact facial features, age, body build, locked outfit, personality, voice guidelines, and prompt consistency rules. ───"
    : ""
}
${["CUTE_KIDS", "SONG", "POETRY", "SHORT_CLIP", "ANIMAL_DANCING", "FRUIT_DANCING"].includes(input.category) && input.kidsAge ? `${input.category === "CUTE_KIDS" ? "Kids Age" : input.category === "SONG" ? "Vocalist/Performer Age" : "Character Age"}: ${input.kidsAge}` : ""}
${["CUTE_KIDS", "SONG", "POETRY", "SHORT_CLIP", "ANIMAL_DANCING", "FRUIT_DANCING"].includes(input.category) && input.kidsLocation ? `Scene Location: ${input.kidsLocation}` : ""}
${input.category === "CUTE_KIDS" && input.kidsHealth ? `Kids Health: ${input.kidsHealth}` : ""}
${["CUTE_KIDS", "SONG", "POETRY", "SHORT_CLIP", "ANIMAL_DANCING", "FRUIT_DANCING"].includes(input.category) && input.kidsClothing ? `Clothing/Outfit Style: ${input.kidsClothing}` : ""}
${input.fatherClothing && input.fatherClothing !== "AI Decides" ? `Locked Father Clothing: ${input.fatherClothing} (FATHER OUTFIT MANDATE: Father MUST be rendered wearing ${input.fatherClothing} throughout all scenes).` : ""}
${input.motherClothing && input.motherClothing !== "AI Decides" ? `Locked Mother Clothing: ${input.motherClothing} (MOTHER OUTFIT MANDATE: Mother MUST be rendered wearing ${input.motherClothing} throughout all scenes).` : ""}
${["CUTE_KIDS", "SONG", "POETRY", "SHORT_CLIP", "ANIMAL_DANCING", "FRUIT_DANCING"].includes(input.category) && input.kidsVibe ? `Vibe/Mood: ${input.kidsVibe}` : ""}
${["CUTE_KIDS", "SONG", "POETRY", "SHORT_CLIP", "ANIMAL_DANCING", "FRUIT_DANCING"].includes(input.category) && input.characterSetup ? `Character Setup: ${input.characterSetup}` : ""}
${["CUTE_KIDS", "SONG", "POETRY", "SHORT_CLIP", "ANIMAL_DANCING", "FRUIT_DANCING"].includes(input.category) && input.charactersPerScene ? `Characters Per Scene: ${input.charactersPerScene}` : ""}
${["CUTE_KIDS", "SONG", "POETRY", "SHORT_CLIP", "ANIMAL_DANCING", "FRUIT_DANCING"].includes(input.category) && input.kidsNationality && input.kidsNationality !== "Global / Any" ? `Nationality/Culture: ${input.kidsNationality}` : ""}
${input.characterFaceType && input.characterFaceType !== "Any / AI Decides" ? `Facial Features & Face Archetype: ${input.characterFaceType} (FACIAL DIVERSITY MANDATE: Render the character with explicit ${input.characterFaceType} features, custom facial structure, distinct hair/beard styling, and unique facial identity).` : ""}
${input.includeCharacterBible === false ? "CHARACTER BIBLE MANDATE: Do NOT include the '📋 LOCKED CHARACTER & ENVIRONMENT CONTINUITY BIBLE' section in the output. Omit the Bible header block and output ONLY the clean scene video prompt clips directly." : ""}
${
  input.withoutMusic
    ? `CRITICAL WITHOUT MUSIC MANDATE (NO BACKGROUND MUSIC):
STRICT RULE: Do NOT include, suggest, or mention ANY background music, soundtrack, background score, or background songs in the generated concept!
The video CAN still use:
- Natural / environmental sounds (wind, rain, ambient atmosphere)
- Sound effects / Foley (footsteps, object sounds, door sounds, animal sounds, physical impacts)
- Diegetic audio elements`
    : input.musicType && input.musicType !== "None" && input.musicType !== "AI Decides" && input.musicType !== "Any / AI Decides"
    ? `Background Music Type: ${input.musicType} (BACKGROUND MUSIC MANDATE: The scene is driven by ${input.musicType} soundtrack. Characters must groove, sway, dance, or move rhythmically in perfect beat sync with this music style).`
    : ""
}
${input.seriousDialogueStyle && input.seriousDialogueStyle !== "None" ? `Serious Dialogue Style: ${input.seriousDialogueStyle} (DO NOT use slapstick or comedic jokes. Craft a focused ${input.seriousDialogueStyle} tone)` : ""}
${input.outroEffects && input.outroEffects !== "None" ? `Ending/Outro Visual Effects: ${input.outroEffects}` : ""}
${input.customSceneDescription && input.customSceneDescription.trim() ? `
🎬 SITUATION / SCENE DESCRIPTION MANDATE (HIGH PRIORITY — USER-PROVIDED SCENE INSTRUCTIONS):
The user has provided the following specific scene/situation description. You MUST use this as the PRIMARY narrative foundation and visual scenario for the generated idea:
"${input.customSceneDescription.trim()}"
STRICT RULES:
1. The generated video prompt MUST be directly based on and revolve around this exact scene description.
2. Incorporate the described situation, actions, environment, and emotional context into the visual storytelling.
3. Do NOT ignore, override, or replace this scene with a random unrelated scenario.
4. All other settings (character setup, clothing, vibe, location) should enhance and complement this scene description, not contradict it.` : ""}
${input.category === "CUTE_KIDS" && input.kidsExpression && input.kidsExpression !== "Any / AI Decides" ? `Kids Expression/Reaction Style: ${input.kidsExpression}` : ""}
${input.category === "CUTE_KIDS" && input.kidsAudioStyle && input.kidsAudioStyle !== "Any / AI Decides" ? `Voice & Audio Style: ${input.kidsAudioStyle}` : ""}
${input.category === "CUTE_KIDS" && input.kidsTalkingSpeed && input.kidsTalkingSpeed !== "Any / AI Decides" ? `Script Talking / Delivery Speed: ${input.kidsTalkingSpeed}` : ""}
${input.category === "CUTE_KIDS" && input.kidsTalkingSpeed && /super fast|rapid rant|10s burst/i.test(input.kidsTalkingSpeed) ? `CRITICAL RAPID TALKING & DIALOGUE BURST MANDATE:
- Spoken Dialogue Rule: ${input.customDialogue ? `ABSOLUTE MANDATE: The user has provided an EXACT custom dialogue: "${input.customDialogue}". You MUST output this EXACT user dialogue 100% VERBATIM on the "💬 Spoken Dialogue:" line. Do NOT alter, translate, replace, or summarize the user's text!` : `Generate a high word-density, rapid-fire spoken dialogue script (35-45 words per 10-second scene) continuous without long pauses.`}
- Rapid Lip-Sync & Animation: The child speaks continuous rapid-fire words with zero pauses, fast energetic mouth movements, dynamic cute hand gestures, and expressive toddler reactions throughout the entire 10-second clip.` : ""}
${input.category === "CUTE_KIDS" && input.kidsTalkingSpeed && /fast & energetic|1.25x/i.test(input.kidsTalkingSpeed) ? `RAPID SCRIPT SPEED MANDATE: High-energy, quick speaking pace with brisk lip-sync movement (~25-30 words per 10s scene).` : ""}
${input.category === "CUTE_KIDS" && input.kidsTalkingSpeed && /slow & dramatic|0.75x/i.test(input.kidsTalkingSpeed) ? `SLOW SCRIPT SPEED MANDATE: Cute slow baby/toddler speaking style with dramatic pauses between phrases (~8-12 words per 10s scene).` : ""}
${input.category === "CUTE_KIDS" && input.kidsFood && input.kidsFood !== "Any / AI Decides" ? `Food/Snack in Scene: ${input.kidsFood}` : ""}
${input.category === "CUTE_KIDS" && input.kidsProp && input.kidsProp !== "Any / AI Decides" ? `Prop/Object in Hand: ${input.kidsProp}` : ""}
${(input.category === "CUTE_KIDS" || input.category === "SONG" || input.category === "POETRY" || input.category === "SHORT_CLIP") && input.referenceCharacterInfo ? `\nCRITICAL CHARACTER REFERENCE: The character must perfectly match this exact description: ${input.referenceCharacterInfo}\n` : ""}
${input.timeOfDay && input.timeOfDay !== "Any / AI Decides" ? `Time of Day/Lighting: ${input.timeOfDay}` : ""}
${input.storyBeat && input.storyBeat !== "Any / AI Decides" ? `Story Beat/Narrative Moment: ${input.storyBeat}` : ""}
${input.cameraShot && input.cameraShot !== "Any / AI Decides" ? `Camera Shot Style: ${input.cameraShot}` : ""}
${input.cameraShot && /fixed|static|lock/i.test(input.cameraShot) ? `STRICT CAMERA LOCK MANDATE: The camera MUST stay 100% stationary and locked on the speaking character throughout the entire 10-second clip. NO camera panning, NO wild zooms, NO background cuts, NO camera rotation. The speaking character remains centered in frame from start to finish.` : ""}
${input.charPerformance && input.charPerformance !== "Any / AI Decides" ? `Character Performance Mode: ${input.charPerformance}` : ""}
${input.charPerformance && /off-screen|no lip-sync|narration|voiceover/i.test(input.charPerformance) ? `STRICT NO LIP-SYNC MANDATE: The voiceover / narration / poem / song audio is played OFF-SCREEN. The character on camera MUST NOT move their lips or speak on camera. Render silent, expressive facial acting (smiles, gaze, deep emotional reactions, or dancing) while the background voiceover plays.` : ""}
${input.category === "CARBOX" && input.carboxBrand ? `Vehicle Type / Brand / Model: ${input.carboxBrand}` : ""}
${input.category === "CARBOX" && input.carboxColor ? `Vehicle Color: ${input.carboxColor}` : ""}
${input.category === "CARBOX" && input.carboxPackaging ? `Packaging Style: ${input.carboxPackaging}` : ""}
${input.category === "CARBOX" && input.carboxBackground ? `Tabletop Background: ${input.carboxBackground}` : ""}
${input.audiencePerspective ? `Audience Perspective: ${input.audiencePerspective}` : ""}
${input.stageEnvironment ? `Stage Environment: ${input.stageEnvironment}` : ""}
${input.initialPerformer ? `Initial Performer: ${input.initialPerformer}` : ""}
${input.triggerAction ? `Trigger Action: ${input.triggerAction}` : ""}
${input.targetEntity ? `Target Entity: ${input.targetEntity}` : ""}
${input.lightingFx ? `Lighting & FX: ${input.lightingFx}` : ""}
${input.performerAge ? `Performer Age Range: ${input.performerAge}` : ""}
${input.stageLocation ? `Stage Venue / Location: ${input.stageLocation}` : ""}
${
  input.category === "LIVE_STAGE_METAMORPHOSIS"
    ? `
LIVE STAGE METAMORPHOSIS MANDATE:
Generate a detailed 10-second video creation prompt for a live stage transformation effect following this EXACT Master Prompt Generator Template:
"[Audience Perspective] view of a [Stage Environment]. A [Initial Performer] stands under [Lighting & FX]. Suddenly, the performer [Trigger Action]. In a single seamless motion, the performer transforms into a massive, realistic [Target Entity]. The creature stands on stage and lets out a dramatic roar toward the audience, while foreground crowd members hold up glowing smartphone screens recording the moment. Ultra-realistic, seamless VFX metamorphosis, photorealistic stage physics, 8k resolution."
Replace the bracketed placeholders with the chosen or generated values for audience perspective, stage environment, initial performer, lighting & FX, trigger action, and target entity.`
    : ""
}
${
  input.includeMic
    ? `MICROPHONE IN SCENE: Include a microphone (handheld mic or vintage stand mic) for the character to perform/sing into.`
    : `MICROPHONE MANDATE: Do NOT include any microphones, handheld mics, or stage mic stands in the scene visuals. The character performs naturally with open hands, gesturing, or sitting comfortably without holding a microphone.`
}
${
  input.songCrowdFx && /AI\s*Decides/i.test(input.songCrowdFx)
    ? `BACKGROUND AUDIENCE SOUND MANDATE:
AI FREELY DECIDES: Choose the most contextually fitting background audience ambience, crowd noise, or sound effect that best matches the scene, character setup, vibe, and location. Options include Wah Wah Mushaira crowd, concert cheering, Dholak clapping, quiet studio, rain ambience, or any other fitting audio layer.`
    : input.songCrowdFx && !/disabled|quiet|none/i.test(input.songCrowdFx)
    ? `BACKGROUND CROWD NOISE & SOUND EFFECT MANDATE:
Audio Soundscape: Include background sound effect - "${input.songCrowdFx}". ${/wah\s*wah/i.test(input.songCrowdFx) ? 'Include authentic crowd reactions saying "Wah Wah! Wah Wah!" and "Irshad!" during vocal pauses.' : ""} Mix this background ambience smoothly at a natural volume behind the main vocal melody.`
    : input.songCrowdFx && /disabled|quiet|none/i.test(input.songCrowdFx)
    ? `STRICT NO-BACKGROUND-NOISE MANDATE:
Do NOT include any audience "Wah Wah", crowd cheering, background chatter, or ambient noise effects. Keep the audio track 100% clean and quiet for a pure studio recording.`
    : (input.category !== "CUTE_KIDS") &&
      ((input.characterSetup && /shayar|mushaira|poet/i.test(input.characterSetup)) ||
       (input.customDialogue && /shayar|mushaira|wa\s*wah|irshad/i.test(input.customDialogue)) ||
       (input.seriousDialogueStyle === "Poetic/Shayari"))
    ? `
SHAYAR & MUSHAIRA AUDIO & VISUAL MANDATE:
1. Setting: Traditional Mushaira Mehfil stage setting with Gao Takiya bolster cushions and warm ambient lighting${input.includeMic ? " with a vintage brass microphone" : " (no microphone in hand)"}.
2. Audio Soundscape: Live background audience reaction with people saying "Wah Wah! Wah Wah!" and "Irshad!" during pauses in the Shayari poetry recitation.
3. Audio Balance: Audience "Wah Wah!" reactions must be mixed at a natural, warm background volume so they blend in smoothly without overpowering the main spoken voice.`
    : ""
}
${
  (input.category !== "CUTE_KIDS") &&
  ((input.characterSetup && /funny|comedic|tanzo|mazah/i.test(input.characterSetup)) ||
   (input.kidsVibe && /funny|tanzo|mazah/i.test(input.kidsVibe)) ||
   (input.seriousDialogueStyle && /funny|tanzo|mazah|satirical/i.test(input.seriousDialogueStyle)))
    ? `
FUNNY SHAYAR & COMEDIC POETRY MANDATE:
1. Character & Tone: Depict a witty, hilarious Shayar (comedy poet) delivering satirical comedic Shayari (Tanzo Mazah) with expressive Desi facial reactions, animated hand gestures, and funny comic timing.
2. Audio & Reactions: Include authentic audience chuckles, laughter, and enthusiastic applause during pauses as the funny Shayar drops the comedic poetry punchlines.`
    : ""
}
${
  (input.category === "POETRY" || input.category === "SONG")
    ? `
POETRY & SONG — STRICT 10-SECOND SCRIPT & CHARACTER CONSISTENCY MANDATE:
1. LOCKED CHARACTER FACIAL IDENTITY: You MUST explicitly define a LOCKED CHARACTER IDENTITY & VISUAL BIBLE (locked facial structure, age, hair style, beard/facial hair, skin tone, eye shape, clothing colors, and environment). When generating scripts for POETRY and SONG, preserve 100% character face and visual appearance consistency across generations using the same settings.
2. NO LINE REPETITION: The Shayar / Singer MUST NEVER repeat the same Shayari couplet, lyric line, or phrase more than once within the 10-second clip. Every spoken line must be a new, unique, forward-moving part of the script.
3. COMPLETE THOUGHT IN 10 SECONDS: The full Shayari couplet or song lyric passage must start, build, and conclude entirely within the 10-second clip. Do NOT carry over unfinished lines.
4. TIGHT SCRIPT PACING: Max 2-3 lyric lines or 1 full Shayari sher (couplet) delivered at a natural, expressive, unhurried pace that fits cleanly within 10 seconds.
5. HOOK (0-3s): Shayar / singer opens with the first verse line with emotion.
6. ESCALATION (3-7s): Delivers the second unique verse/line with rising vocal emotion or poetic depth.
7. PUNCHLINE (7-10s): Closes with the poetic climax or emotional final word — NO repeated refrain.
8. ZERO WORD REPETITION & FLUID LIP-SYNC MANDATE: The Shayar / Poet / Singer MUST speak with smooth, fluid lip-sync articulation. The visual video prompt MUST explicitly mandate: "smooth natural lip-sync, zero word repetition, zero word stutter, natural fluid mouth movements without mouth looping".
9. CINEMATIC POETIC ACTING: Emphasize serene micro-expressions (gentle eye movement, subtle head turn, hand resting over heart or opening in a graceful gesture) so AI video engines generate fluid, photorealistic human acting without mouth glitches.
10. STRICT 8-SECOND DIALOGUE COMPLETION: The spoken Shayari couplet MUST finish recitation completely within 8 seconds (0-8s mark). The final 2 seconds (8-10s) MUST be reserved for quiet emotional resonance, lingering gaze, and a cinematic freeze frame without any spoken words.
11. NATURAL POETIC PAUSES: Format the spoken dialogue line with natural poetic pauses using ellipses (e.g. "تیرے واسطے ہیں میری حیات کے سبھی رنگ... تو جس رنگ بھی نکھرے... میں اس رنگ کے صدقے") so the AI voice & lip-sync model recites with artistic, unhurried emotional pacing.`
    : ""
}
${
  (input.characterSetup && /(boy|girl)\s*singer\s*\+\s*/i.test(input.characterSetup))
    ? `
LEAD SINGER & ANIMAL COMPANION MANDATE:
1. Main Lead Singer: The specified child (Boy or Girl) MUST be designated as the main lead singer${input.includeMic ? " holding a microphone" : " singing with expressive hand gestures (no mic)"}.
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

${
  (input.characterSetup && /man\s*&\s*girl|girl\s*&\s*man|man\s*shayar\s*&\s*girl|man\s*singer\s*&\s*girl|man\s*guitarist\s*&\s*girl/i.test(input.characterSetup)) ||
  (input.charactersPerScene && /1\s*man\s*\+\s*1\s*girl/i.test(input.charactersPerScene)) ||
  (input.kidsClothing && /man\s*&\s*girl\s*combo/i.test(input.kidsClothing))
    ? `
MAN & GIRL DUET COMBO MANDATE:
1. Visual Composition: Feature both the adult male (man) and adult female (girl/woman) prominently together in the scene.
2. Interaction & Chemistry: Depict dynamic duet performance chemistry with warm eye contact, expressive singing gestures, or poetic recitation exchange between the man and girl.
3. Outfits & Styling: Ensure both the man and girl are wearing the specified matching combo outfits.`
    : ""
}

${
  input.category === "FRUIT_DANCING"
    ? `
VIRAL INSTAGRAM FRUIT DANCING BABY MANDATE (CRITICAL):
1. CHARACTER IDENTITY & AGE: Feature an ultra-cute, adorable 3D cartoon baby or toddler (1-3 years old) with naturally proportioned expressive eyes, soft flushed rosy cheeks, locked cute facial identity, and innocent cheerful expression.
2. FRUIT COSTUME DETAIL: The baby MUST wear a plush, fuzzy 3D fruit onesie costume hood suit (e.g. Kiwi fruit with fuzzy textured brown skin and a vibrant green sliced kiwi belly showing black seeds; or Watermelon with green striped rind and red sliced belly with seeds; or Strawberry with plush red dotted fruit suit; or Mango / Pineapple / Banana). The fruit onesie has a cute hood framed around the baby's adorable face.
3. CUTE DANCING ANIMATION: The baby performs an energetic, rhythmic, cute dance choreography (hip-hop bounce, wobbly toddler wiggle, hand waving, foot tapping, spinning around, ending with a cheerful arm-up pose).
4. VIBRANT FRUIT ORCHARD ENVIRONMENT: Set the dance in a lush, magical fruit garden or sun-dappled orchard filled with giant sliced fruits scattered on soft green grass, warm golden bokeh sunlight, floating light particles, and vibrant pastel colors.
5. AUDIO & SOUND: Sync the dance with upbeat viral Instagram audio, energetic rhythm beats, and adorable baby giggles.
6. 🔇 ABSOLUTE NO-DIALOGUE RULE: This is a PURE DANCE VIDEO. Do NOT generate ANY "Spoken Dialogue:" section, spoken script lines, character speech, monologue, or any text the baby speaks. The ONLY output is the visual dance prompt. NO dialogue line. NO script paragraph. If you output any "💬 Spoken Dialogue:" label or spoken text, you have FAILED this mandate.`
    : ""
}

${
  input.category === "ANIMAL_DANCING"
    ? `
VIRAL INSTAGRAM ANIMAL DANCING PETS MANDATE (CRITICAL):
1. CHARACTER IDENTITY & SPECIES: Feature ultra-cute, adorable 3D cartoon or CGI kittens, puppies, baby pandas, or bunnies standing upright on two hind legs with naturally proportioned glossy eyes, fluffy fur, and charming facial expressions.
2. COSPLAY COSTUME DETAIL: The animals MUST wear detailed plush cosplay costumes (e.g. Strawberry hood hat with diaper shorts & tiny pink crocs; Yellow & black bumblebee suit with wings; Brown cowboy hat & leather vest; Green dinosaur onesie with back spikes; Pirate captain hat with skull & crossbones; Baby Shark onesie; Chef hat & apron).
3. ON-BEAT DANCE ANIMATION: The animals perform synchronized on-beat dance choreography standing upright on two legs (side-to-side leg kicks, beat-drop butt wiggle, freeze-on-beat statue pose, arm pumps, head bobs, spinning twirls).
4. ENVIRONMENT: Set the performance on a clean polished living room hardwood floor with plush stuffed teddy bears sitting in the background, or sun-dappled outdoor patio with warm indoor lighting.
5. AUDIO & SOUND: Sync the dance with upbeat viral rhythm beats, background music, cute meows, barks, or baby animal giggles.
6. 🔇 ABSOLUTE NO-DIALOGUE RULE: This is a PURE DANCE VIDEO. Do NOT generate ANY "Spoken Dialogue:" section, spoken script lines, character speech, monologue, or any text the animals speak. The ONLY output is the visual dance prompt. NO dialogue line. NO script paragraph.`
    : ""
}

${
  input.characterSetup && /Male Poet Recites.*Girl Listens/i.test(input.characterSetup)
    ? `
MALE POET + FEMALE LISTENER MANDATE (CRITICAL — STRICT ROLE ENFORCEMENT):
1. SPEAKING ROLE — THE MAN ONLY: The adult male character is the SOLE speaker/reciter. He recites the Shayari/poetry with passion, deep emotion, expressive eyes, and graceful hand gestures. His lips move. He is the performer.
2. SILENT LISTENER — THE GIRL ONLY: The adult female character sits or stands beside him in the SAME location. She does NOT speak, does NOT recite, and does NOT move her lips. She listens quietly with a soft, admiring, deeply impressed expression — eyes slightly wide, a gentle touched smile, perhaps a hand near her heart.
3. SAME LOCATION: Both characters share the exact same scene/location/environment. No cuts. No location change.
4. CAMERA COMPOSITION: Frame both characters in the shot — the man on one side reciting, the girl on the other side reacting with admiration. Use warm intimate lighting.
5. AUDIO: Only the man's voice is heard reciting the Shayari. No dialogue from the girl.`
    : ""
}

${
  input.characterSetup && /Female Poet Recites.*Man Listens/i.test(input.characterSetup)
    ? `
FEMALE POET + MALE LISTENER MANDATE (CRITICAL — STRICT ROLE ENFORCEMENT):
1. SPEAKING ROLE — THE GIRL ONLY: The adult female character is the SOLE speaker/reciter. She recites the Shayari/poetry with elegance, emotional depth, and graceful expressive gestures. Her lips move. She is the performer.
2. SILENT LISTENER — THE MAN ONLY: The adult male character sits or stands beside her in the SAME location. He does NOT speak, does NOT recite, and does NOT move his lips. He listens quietly with a captivated, deeply moved, admiring expression — leaning slightly forward, eyes soft and attentive, perhaps a slow approving nod.
3. SAME LOCATION: Both characters share the exact same scene/location/environment. No cuts. No location change.
4. CAMERA COMPOSITION: Frame both characters in the shot — the girl on one side reciting, the man on the other side reacting with admiration. Use warm intimate lighting.
5. AUDIO: Only the girl's voice is heard reciting the Shayari. No dialogue from the man.`
    : ""
}

${
  (Number(input.videoDuration) === 20 || Number(input.videoDuration) === 30)
    ? input.kids20sStep === "SCENE_1_ONLY"
      ? `STEP 1 OF 2: GENERATE FIRST 10-SECOND SCENE (CLIP 1 PROMPT) & LOCKED CHARACTER BIBLE ONLY (TO SAVE AI CREDITS):
Generate ONLY the first 10-second scene (Clip 1 Prompt) and the Locked Character & Environment Continuity Bible.
Do NOT generate Clip 2 Prompt yet (the user will review/approve Scene 1 first before generating Scene 2).

${input.customDialogueSeq1 ? `User Sequence 1 Spoken Dialogue (First 10s Clip): "${input.customDialogueSeq1}"` : ""}

REQUIRED OUTPUT FORMAT STRUCTURE:
[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]

🎬 20-SECOND CONNECTED STORY (STEP 1: FIRST 10s SCENE & CHARACTER BIBLE)

📋 LOCKED CHARACTER & ENVIRONMENT CONTINUITY BIBLE:
• Character 1: [Name/Role, exact age, hair style/color, facial structure, skin tone, locked outfit & exact clothing colors, body build]
• Character 2 (if present): [Name/Role, exact age, hair style/color, skin tone, locked outfit & exact clothing colors]
• Visual & Environment Bible: [Location, lighting, rendering style, color palette, background props]

🎥 CLIP 1 PROMPT (First 10-Second Scene — Google Flow / Gemini Prompt):
10-second video animation [Visual Style]. Setting: [Location & Lighting]. Characters: [Character 1 details wearing locked outfit] and [Character 2 details]. Action (0-10s): [Opening setup beat, initial visual action or question]. Camera: [Dynamic camera move].
💬 First Sequence Spoken Dialogue: "${input.customDialogueSeq1 ? input.customDialogueSeq1 : '[Dialogue for 0-10s]'}"

⏳ STEP 2 STATUS: [Scene 1 Ready for Review. Click "✨ Generate Second Scene (10-20s)" once you approve Scene 1].`
      : input.kids20sStep === "SCENE_2_ONLY"
      ? `STEP 2 OF ${Number(input.videoDuration) === 30 ? "3" : "2"}: GENERATE SECOND 10-SECOND CONTINUATION SCENE (CLIP 2 PROMPT):
You are given the APPROVED FIRST SCENE & LOCKED CHARACTER BIBLE:
--- APPROVED SCENE 1 BIBLE ---
${input.scene1Text || ""}
------------------------------

${input.customDialogueSeq2 ? `User Sequence 2 Spoken Dialogue (Second 10s Clip): "${input.customDialogueSeq2}"` : ""}

CRITICAL CONTINUITY MANDATE:
Generate the continuation Scene 2 (Clip 2 Prompt: 10-20s) that continues IMMEDIATELY from Scene 1.
🔴 STRICT LOCKED CLOTHING MANDATE: You MUST maintain 100% identical clothing/outfit colors, shirts, pants, and visual style for BOTH characters in Scene 2.
${input.scene1Clothing ? `LOCKED SCENE 1 CLOTHING SPECIFICATION: "${input.scene1Clothing}"` : ""}
In Clip 2 Prompt (10-20s), you MUST repeat the EXACT SAME clothing/outfit description verbatim from Scene 1 for both Character 1 and Character 2! Do NOT change, modify, or invent different clothes or outfit colors for any character in Scene 2.

REQUIRED OUTPUT FORMAT STRUCTURE:
[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]

${(input.scene1Text || "").replace(/⏳\s*STEP 2 STATUS:[\s\S]*$/i, "").trim()}

🎥 CLIP 2 PROMPT (Second 10-Second Scene — Google Flow / Gemini Continuation Prompt):
10-second video continuation [Visual Style]. Setting: [Same Location & Lighting from Scene 1]. Characters: [Same locked Character 1 in identical outfit] and [Same locked Character 2]. Action (10-20s): [Direct continuation beat following immediately from Clip 1, resolving the situation with a clear climax or warm conclusion]. Camera: [Matching smooth camera move].
💬 Second Sequence Spoken Dialogue: "${input.customDialogueSeq2 ? input.customDialogueSeq2 : '[Dialogue for 10-20s]'}"

${Number(input.videoDuration) === 30 ? `⏳ STEP 3 STATUS: [Scene 2 Ready for Review. Click "✨ Generate Third Scene (20-30s)" once you approve Scene 2].` : `✂️ CAPCUT CONTINUITY & EDITING NOTES:
• Stitch Clip 1 (0-10s) and Clip 2 (10-20s) end-to-end in CapCut for a seamless continuous 20-second video with 100% character appearance, outfit, environment, and story continuity.`}`
      : input.kids20sStep === "SCENE_3_ONLY"
      ? `STEP 3 OF 3: GENERATE THIRD 10-SECOND CONTINUATION SCENE (CLIP 3 PROMPT):
You are given the APPROVED FIRST & SECOND SCENES & LOCKED CHARACTER BIBLE:
--- APPROVED SCENE 1 & 2 BIBLE ---
${input.scene2Text || ""}
------------------------------

${input.customDialogueSeq3 ? `User Sequence 3 Spoken Dialogue (Third 10s Clip): "${input.customDialogueSeq3}"` : ""}

CRITICAL CONTINUITY MANDATE:
Generate the continuation Scene 3 (Clip 3 Prompt: 20-30s) that continues IMMEDIATELY from Scene 2.
🔴 STRICT LOCKED CLOTHING MANDATE: You MUST maintain 100% identical clothing/outfit colors, shirts, pants, and visual style for BOTH characters in Scene 3.
${input.scene1Clothing ? `LOCKED SCENE 1&2 CLOTHING SPECIFICATION: "${input.scene1Clothing}"` : ""}
In Clip 3 Prompt (20-30s), you MUST repeat the EXACT SAME clothing/outfit description verbatim from Scene 1 and Scene 2 for both Character 1 and Character 2! Do NOT change, modify, or invent different clothes or outfit colors for any character in Scene 3.

REQUIRED OUTPUT FORMAT STRUCTURE:
[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]

${(input.scene2Text || "").replace(/⏳\s*STEP 3 STATUS:[\s\S]*$/i, "").trim()}

🎥 CLIP 3 PROMPT (Third 10-Second Scene — Google Flow / Gemini Continuation Prompt):
10-second video continuation [Visual Style]. Setting: [Same Location & Lighting from Scene 1 & 2]. Characters: [Same locked Character 1 in identical outfit] and [Same locked Character 2]. Action (20-30s): [Direct continuation beat following immediately from Clip 2, resolving the situation with a clear climax or warm conclusion]. Camera: [Matching smooth camera move].
💬 Third Sequence Spoken Dialogue: "${input.customDialogueSeq3 ? input.customDialogueSeq3 : '[Dialogue for 20-30s]'}"

✂️ CAPCUT CONTINUITY & EDITING NOTES:
• Stitch Clip 1 (0-10s), Clip 2 (10-20s), and Clip 3 (20-30s) end-to-end in CapCut for a seamless continuous 30-second video with 100% character appearance, outfit, environment, and story continuity.`
      : `20-SECOND CONNECTED STORY MANDATE (2 SEPARATE 10s PROMPTS FOR GOOGLE FLOW / GEMINI):
For this 20-second Video, format the output concept into TWO distinct, copyable 10-second prompt blocks (Clip 1 & Clip 2) so the user can generate Clip 1 in Google Flow / Gemini, generate Clip 2 in Google Flow / Gemini, and combine them in CapCut:

${input.customDialogueSeq1 ? `User Sequence 1 Spoken Dialogue (First 10s Clip): "${input.customDialogueSeq1}"` : ""}
${input.customDialogueSeq2 ? `User Sequence 2 Spoken Dialogue (Second 10s Clip): "${input.customDialogueSeq2}"` : ""}

REQUIRED OUTPUT FORMAT STRUCTURE:
[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]

🎬 20-SECOND CONNECTED STORY (2 SEPARATE 10s PROMPTS FOR GOOGLE FLOW / GEMINI)

📋 LOCKED CHARACTER & ENVIRONMENT CONTINUITY BIBLE:
• Character 1: [Name/Role, exact age, hair style/color, facial structure, skin tone, locked outfit & exact clothing colors, body build]
• Character 2 (if present): [Name/Role, exact age, hair style/color, skin tone, locked outfit & exact clothing colors]
• Visual & Environment Bible: [Location, lighting, rendering style, color palette, background props]

🎥 CLIP 1 PROMPT (First 10-Second Scene — Google Flow / Gemini Prompt):
10-second video animation [Visual Style]. Setting: [Location & Lighting]. Characters: [Character 1 details wearing locked outfit] and [Character 2 details]. Action (0-10s): [Opening setup beat, initial visual action or question]. Camera: [Dynamic camera move].
💬 First Sequence Spoken Dialogue: "${input.customDialogueSeq1 ? input.customDialogueSeq1 : '[Dialogue for 0-10s]'}"

🎥 CLIP 2 PROMPT (Second 10-Second Scene — Google Flow / Gemini Continuation Prompt):
10-second video continuation [Visual Style]. Setting: [Same Location & Lighting]. Characters: [Same locked Character 1 in identical outfit] and [Same locked Character 2]. Action (10-20s): [Direct continuation beat following immediately from Clip 1, resolving the situation with a clear climax or warm conclusion]. Camera: [Matching smooth camera move].
💬 Second Sequence Spoken Dialogue: "${input.customDialogueSeq2 ? input.customDialogueSeq2 : '[Dialogue for 10-20s]'}"

✂️ CAPCUT CONTINUITY & EDITING NOTES:
• Stitch Clip 1 (0-10s) and Clip 2 (10-20s) end-to-end in CapCut for a seamless continuous 20-second video with 100% character appearance, outfit, environment, and audio narrative continuity.`
    : input.category === "CHARACTER_BIBLE"
    ? `CHARACTER BIBLE GENERATION MANDATE:
For the CHARACTER_BIBLE category, format the output idea as a comprehensive, locked Character & World Bible for multi-clip AI video generation:

📋 CHARACTER 1 (MAIN PROTAGONIST):
• Name / Role: [Character Name & Role]
• Age & Demographics: [Exact Age & Cultural Background]
• Facial Identity: [Eye color, skin tone, facial structure, distinctive features]
• Hair & Grooming: [Exact hair color, length, style, facial hair if applicable]
• Locked Outfit & Costume: [Exact clothing style, top, bottom, footwear, colors, textures, accessories]
• Body Build & Stature: [Height, posture, build]
• Personality & Mannerisms: [Core personality traits, body language, facial expressions, signature gestures]
• Voice & Spoken Style: [Tone of voice, language style, speech cadence, catchphrases]

📋 CHARACTER 2 (SUPPORTING / COMPANION, IF APPLICABLE):
• Name / Role: [Character Name & Role]
• Facial Identity & Outfit: [Exact locked visual details]

🎨 VISUAL & WORLD ENVIRONMENT BIBLE:
• Setting & Environment: [Primary location, atmosphere, set details]
• Visual Style & Lighting: [Rendering style e.g., 3D Pixar / Photorealistic 8K, color palette, lighting]

🔒 PROMPT CONSISTENCY RULEBOOK:
• Copyable Master Prompt Prefix: [Exact prompt prefix to use for 100% character consistency across all generated clips]`
    : input.category === "SHORT_CLIP"
    ? `SHORT CLIP BIBLE & CONNECTED SCENE MANDATE (CRITICAL - UP TO 10 CONNECTED CLIPS):
For the SHORT_CLIP category, you MUST format the output idea as a connected multi-clip project (supporting 4 to 10 connected 10-second clips) built from a locked Character Bible & Visual Bible:

📋 PROJECT CHARACTER & VISUAL BIBLE:
• Character 1: [Fixed name/role, exact age, hair color/style, facial structure, skin tone, locked outfit & exact clothing colors, body type]
• Character 2 (if present): [Fixed name/role, exact age, hair color/style, facial structure, skin tone, locked outfit & exact clothing colors, body type]
• Visual & Environment Bible: [Fixed location, lighting, cinematic rendering style, color grading, time of day]
• Romance & Dance Theme Context: [Interpersonal chemistry, dance choreography style (slow dance, duet, rain dance, classical Kathak, rooftop dance), emotional progression]

🎬 CONNECTED 10-SECOND CLIP SEQUENCE (CLIP 1 TO CLIP 10 STORY ARC):

🎥 CLIP 1 (0-10s): [Opening scene / initial romantic meeting or glance. Must explicitly reference exact Character & Visual Bible details].
🎥 CLIP 2 (10-20s): [Scene 2 beat / romantic interaction or playful dance banter. Must maintain exact same Character & Visual Bible details].
🎥 CLIP 3 (20-30s): [Scene 3 beat / synchronized dance choreography or emotional depth. Must maintain exact same Character & Visual Bible details].
🎥 CLIP 4 (30-40s): [Scene 4 beat / emotional turning point, conflict, or tender embrace. Must maintain exact same Character & Visual Bible details].
[Continue adding CLIP 5, CLIP 6, CLIP 7, CLIP 8, CLIP 9, CLIP 10 if creating a complete 10-clip romantic story arc].

${input.withoutDialogue || (input.category as string) === "FRUIT_DANCING" || (input.category as string) === "ANIMAL_DANCING" ? "CRITICAL FORMAT RULE: Because Without Dialogue is enabled, DO NOT output any 'Spoken Dialogue:' label or script paragraph. Visual storytelling & dance body language only." : ""}
${input.withoutMusic ? "MUSIC RULE: Music is OFF by default. Focus purely on environmental audio Foley and natural sound FX." : ""}`
    : input.category === "COMMERCIAL_AD"
    ? `COMMERCIAL AD & BRAND PITCH MANDATE (10-20 SECONDS COMMERCIAL AD):
For the COMMERCIAL_AD category, format the prompt as a high-converting 10-20 second promotional video ad, UGC commercial, or brand pitch script:

🛍️ BRAND & PRODUCT PITCH SPECIFICATIONS:
• Brand / Product: ${input.customSceneDescription || "Featured Brand / Product"}
• Hook Style: Problem-Agitate-Solve / UGC Aesthetic / Cinematic Luxury Pitch
• Visual Style: ${input.visualStyle || "Photorealistic 8K Commercial"}

🎬 COMMERCIAL AD SCRIPT STRUCTURE:
• 🧲 SCROLL-STOPPING HOOK (0-3s): High-impact visual hook addressing a pain point or displaying an irresistible macro product shot.
• 💡 VALUE PITCH & DEMO (3-12s): Product demonstration, key benefit reveal, or dramatic before & after transformation.
• 🎯 CALL TO ACTION / OFFER (12-20s): Strong conversion CTA (e.g. "Tap link in bio to get 20% off today!"), brand logo freeze frame.`
    : input.isShortIdea
    ? `SHORT IDEA & FULL IDEA DUAL GENERATION MANDATE:
You MUST generate BOTH a "Short Idea" and a "Full Idea" for this concept.

The generated output text MUST strictly use this EXACT format structure:

📌 SHORT IDEA (3-4 Clips Concept):
[Provide a concise version of the overall story concept structured into 3-4 separate clips/scenes (Clip 1, Clip 2, Clip 3, Clip 4) that can serve as the foundation for creating a complete short video. Describe the overall story/concept and visual progression across the 3-4 clips rather than just summarizing dialogue.]

🎬 FULL DETAILED IDEA:
[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]

${
  input.category === "SONG"
    ? `10-second ${input.visualStyle || "Hyper-Realistic CGI"} music video (photorealistic 8K cinematic quality, film-grade color grading, volumetric stage lighting, shallow depth of field bokeh, adult vocalists/singers ONLY — NO children, NO cartoons, NO animated kids)`
    : input.category === "POETRY"
    ? `10-second ${input.visualStyle || "Hyper-Realistic CGI"} poetry visual (photorealistic 8K cinematic quality, warm ambient Mushaira Mehfil lighting, film-grade color grading, adult Shayars/poets ONLY — NO children, NO cartoons, NO animated kids)`
    : input.category === "SHORT_CLIP"
    ? `10-second ${input.visualStyle || "Photorealistic 8K Cinematic"} video clip (100% character consistency lock, photorealistic 8K cinematic quality, film-grade color grading, exact character appearance/outfit continuity from clip to clip)`
    : input.category === "LIVE_STAGE_METAMORPHOSIS"
    ? `10-second ${input.visualStyle || "Ultra-realistic Live Smartphone POV 8K"} (hyper-detailed VFX metamorphosis, photorealistic stage physics, 8K resolution, live audience perspective — NO cartoon characters, NO children)`
    : input.category === "CHARACTER_BIBLE"
    ? `Comprehensive Character & World Bible (locked character appearance, outfit, facial features, personality, and visual rules)`
    : `10-second ${input.visualStyle || "high-quality 3D cartoon animation"} (Pixar & Illumination 3D render quality, soft PBR fabric & skin shaders, subsurface scattering, warm volumetric rim lighting, shallow depth of field with creamy background bokeh)`
}, [Detailed setting, lighting, environment, character setup, age, outfit, and props]. HOOK (0-3s): [Opening action ${input.withoutDialogue || input.category === "FRUIT_DANCING" || input.category === "ANIMAL_DANCING" || (input.charPerformance && /silent|reaction|dance|surprise|funny action|emotional/i.test(input.charPerformance) && !input.customDialogue) ? "(NO SPOKEN DIALOGUE)" : "& dialogue"}]. ESCALATION (3-7s): [Camera movement & action escalation]. PUNCHLINE (7-10s): [Visual reaction/gag ending, freeze frame, sound effects, music]. No text, no logos, no overlays.`
    : `STRICT 9:16 PROMPT FORMAT MANDATE:
The generated prompt string MUST follow this EXACT structure:

[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]

${
  input.category === "SONG"
    ? `10-second ${input.visualStyle || "Hyper-Realistic CGI"} music video (photorealistic 8K cinematic quality, film-grade color grading, volumetric stage lighting, shallow depth of field bokeh, adult vocalists/singers ONLY — NO children, NO cartoons, NO animated kids)`
    : input.category === "POETRY"
    ? `10-second ${input.visualStyle || "Hyper-Realistic CGI"} poetry visual (photorealistic 8K cinematic quality, warm ambient Mushaira Mehfil lighting, film-grade color grading, adult Shayars/poets ONLY — NO children, NO cartoons, NO animated kids)`
    : input.category === "SHORT_CLIP"
    ? `10-second ${input.visualStyle || "Photorealistic 8K Cinematic"} video clip (100% character consistency lock, photorealistic 8K cinematic quality, film-grade color grading, exact character appearance/outfit continuity from clip to clip)`
    : input.category === "LIVE_STAGE_METAMORPHOSIS"
    ? `10-second ${input.visualStyle || "Ultra-realistic Live Smartphone POV 8K"} (hyper-detailed VFX metamorphosis, photorealistic stage physics, 8K resolution, live audience perspective — NO cartoon characters, NO children)`
    : input.category === "CHARACTER_BIBLE"
    ? `Comprehensive Character & World Bible (locked character appearance, outfit, facial features, personality, and visual rules)`
    : `10-second ${input.visualStyle || "high-quality 3D cartoon animation"} (Pixar & Illumination 3D render quality, soft PBR fabric & skin shaders, subsurface scattering, warm volumetric rim lighting, shallow depth of field with creamy background bokeh)`
}, [Detailed setting, lighting, environment, character setup, age, outfit, and props]. HOOK (0-3s): [Opening action ${input.withoutDialogue || input.category === "FRUIT_DANCING" || input.category === "ANIMAL_DANCING" || (input.charPerformance && /silent|reaction|dance|surprise|funny action|emotional/i.test(input.charPerformance) && !input.customDialogue) ? "(NO SPOKEN DIALOGUE)" : "& dialogue"}]. ESCALATION (3-7s): [Camera movement & action escalation]. PUNCHLINE (7-10s): [Visual reaction/gag ending, freeze frame, sound effects, music]. No text, no logos, no overlays.`
}
${input.withoutDialogue || input.category === "FRUIT_DANCING" || input.category === "ANIMAL_DANCING" ? "CRITICAL FORMAT RULE: Because Without Dialogue is enabled, DO NOT output any 'Spoken Dialogue:' label, script paragraph, or spoken monologue anywhere in the prompt text. Keep the generated concept concise and visual-only." : ""}

CATEGORY CHARACTER ISOLATION MANDATE (CRITICAL — DO NOT MIX):
${
  input.category === "CUTE_KIDS"
    ? "CUTE_KIDS CATEGORY: This prompt is STRICTLY for cute children/toddlers/babies. NEVER include any adults with beards, Shayars, poets, singers, or any adult character details from Poetry or Song categories. Characters MUST be young children with innocent, playful, age-appropriate features."
    : input.category === "SONG"
    ? "SONG CATEGORY: This prompt is STRICTLY for adult vocalists/singers/musicians. NEVER include any children, toddlers, babies, cute kids, or any kid character details from Cute Kids category. Maintain 100% locked character facial consistency, hair style, beard, skin tone, and outfit continuity across all generated scripts using these settings."
    : input.category === "POETRY"
    ? "POETRY CATEGORY: This prompt is STRICTLY for adult Shayars/poets reciting Shayari. NEVER include any children, toddlers, babies, cute kids, or any kid character details from Cute Kids category. Maintain 100% locked character facial consistency, hair style, beard, skin tone, and outfit continuity across all generated scripts using these settings."
    : input.category === "SHORT_CLIP"
    ? "SHORT_CLIP CATEGORY: This prompt is for connected 10-second video clips. Maintain 100% locked character consistency (exact same facial structure, clothing, hair, age, body type) across all clips in the project so they can be combined into a longer video."
    : input.category === "LIVE_STAGE_METAMORPHOSIS"
    ? "LIVE STAGE METAMORPHOSIS CATEGORY: This prompt is STRICTLY for adult stage performers transforming into creatures. NEVER include any children, cute kids, or any kid character details. Characters MUST be adult stage performers."
    : "Strictly use characters appropriate for this category only. Do NOT borrow or blend character details from other categories."
}

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

  // Gracefully fallback to built-in prompt engine if Anthropic credit balance is low or API key fails
  if (
    lastError?.message?.includes("credit balance") ||
    lastError?.message?.includes("too low") ||
    lastError?.message?.includes("invalid_request_error") ||
    lastError?.status === 400
  ) {
    console.warn("Anthropic API credit balance low. Using built-in Fallback Generator Engine.");
    return generateFallbackIdeaPrompt(input);
  }

  throw new ValidationError({
    success: false,
    stage: "Idea Suggestion Generator",
    reason: lastError?.message || "API is not working. Please check your API key or model permissions.",
  });
}

function generateFallbackIdeaPrompt(input: any): string[] {
  const cat = input.category || "FUNNY";
  const style = input.visualStyle || "Photorealistic 8K Cinematic";
  const loc = input.kidsLocation && input.kidsLocation !== "Any / AI Decides" ? input.kidsLocation : "Candlelit Solitary Room (تنہا کمرہ / Tanhai) 🕯️";
  const vibe = input.kidsVibe && input.kidsVibe !== "Any / AI Decides" ? input.kidsVibe : "Deep Emotional Devastation & Comfort";
  const setup = input.characterSetup && input.characterSetup !== "Any / AI Decides" ? input.characterSetup : "Couple (Male & Female Shayar Duo) 💑";
  const outfit = input.kidsClothing && input.kidsClothing !== "Any / AI Decides" ? input.kidsClothing : "Male Charcoal Sherwani & Female Ivory Muslin Dupatta 🥋";
  const desc = input.customSceneDescription || "An emotional scene filled with depth, expressive performances, and atmospheric lighting.";

  if (cat === "CHARACTER_BIBLE") {
    return [
      `[FORMAT: 9:16 Vertical Aspect Ratio. Center main action.]\n\n` +
      `📋 CHARACTER 1 (MAIN PROTAGONIST):\n` +
      `• Name / Role: Little Omar (Cute Pakistani Boy)\n` +
      `• Age & Demographics: 6 years old, Pakistani Desi\n` +
      `• Facial Identity: Big innocent dark brown eyes, chubby rosy cheeks, joyful expressive smile\n` +
      `• Hair & Grooming: Short dark brown hair, neat trim\n` +
      `• Locked Outfit & Costume: Bright turquoise blue polo shirt, beige shorts, white sneakers\n` +
      `• Body Build & Stature: Petite, energetic, light build\n` +
      `• Personality & Mannerisms: Curious, mischievous, highly expressive, laughs easily\n` +
      `• Voice & Spoken Style: Cute toddler Urdu accent, enthusiastic high pitch\n\n` +
      `🎨 VISUAL & WORLD ENVIRONMENT BIBLE:\n` +
      `• Setting & Environment: Sunny home living room with colorful rug and wooden toy boxes\n` +
      `• Visual Style & Lighting: 3D Pixar Cartoon Style, soft PBR fabric shaders, warm volumetric lighting\n\n` +
      `🔒 PROMPT CONSISTENCY RULEBOOK:\n` +
      `• Master Prompt Prefix: "6yo Pakistani boy, big dark brown eyes, turquoise polo shirt, beige shorts, 3D Pixar animation style, locked appearance."`
    ];
  }

  if ((Number(input.videoDuration) === 20 || Number(input.videoDuration) === 30) && (cat === "CUTE_KIDS" || cat === "KIDS_FUNNY")) {
    const seq1Dialogue = input.customDialogueSeq1 || "ابو دیکھو! میں نے ایک نیا کھیل دریافت کر لیا ہے!";
    const seq2Dialogue = input.customDialogueSeq2 || "ارے یہ کیا ہو گیا! لیکن کتنا مزہ آیا!";

    if (input.kids20sStep === "SCENE_1_ONLY") {
      return [
        `[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]\n\n` +
        `🎬 20-SECOND CONNECTED KIDS STORY (STEP 1: FIRST 10s SCENE & CHARACTER BIBLE)\n\n` +
        `📋 LOCKED CHARACTER & ENVIRONMENT CONTINUITY BIBLE:\n` +
        `• Character 1: 6yo Pakistani boy, dark brown eyes, chubby cheeks, wearing bright turquoise polo shirt & beige shorts.\n` +
        `• Visual & Environment Bible: Cozy home living room, warm volumetric lighting, ${style}.\n\n` +
        `🎥 CLIP 1 PROMPT (First 10-Second Scene — Google Flow / Gemini Prompt):\n` +
        `10-second ${style} cute kids animation in ${loc}. Setting: ${loc}. Characters: ${setup} wearing ${outfit}. Action (0-10s): ${desc}\n` +
        `💬 First Sequence Spoken Dialogue: "${seq1Dialogue}"\n\n` +
        `⏳ STEP 2 STATUS: [Scene 1 Ready for Review. Click "✨ Generate Second Scene (10-20s)" once you approve Scene 1].\n\n` +
        `⚠️ NOTE: Generated via Built-in Engine (Anthropic API Credit Balance Low).`
      ];
    } else if (input.kids20sStep === "SCENE_2_ONLY") {
      const baseScene1 = (input.scene1Text || "").replace(/⏳\s*STEP 2 STATUS:[\s\S]*$/i, "").trim();
      return [
        `${baseScene1}\n\n` +
        `🎥 CLIP 2 PROMPT (Second 10-Second Scene — Google Flow / Gemini Continuation Prompt):\n` +
        `10-second ${style} continuation in ${loc}. Setting: ${loc}. Characters: Locked ${setup} wearing identical ${outfit}. Action (10-20s): Direct continuation as the kid executes the funny surprise move with an adorable smile.\n` +
        `💬 Second Sequence Spoken Dialogue: "${seq2Dialogue}"\n\n` +
        `✂️ CAPCUT CONTINUITY & EDITING NOTES:\n` +
        `• Stitch Clip 1 (0-10s) and Clip 2 (10-20s) end-to-end in CapCut for a seamless continuous 20-second video with 100% character appearance, outfit, environment, and story continuity.\n\n` +
        `⚠️ NOTE: Generated via Built-in Engine (Anthropic API Credit Balance Low).`
      ];
    }

    return [
      `[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]\n\n` +
      `🎬 20-SECOND CONNECTED KIDS STORY (2 SEPARATE 10s PROMPTS FOR GOOGLE FLOW / GEMINI)\n\n` +
      `📋 LOCKED CHARACTER & ENVIRONMENT CONTINUITY BIBLE:\n` +
      `• Character 1: 6yo Pakistani boy, dark brown eyes, chubby cheeks, wearing bright turquoise polo shirt & beige shorts.\n` +
      `• Visual & Environment Bible: Cozy home living room, warm volumetric lighting, ${style}.\n\n` +
      `🎥 CLIP 1 PROMPT (First 10-Second Scene — Google Flow / Gemini Prompt):\n` +
      `10-second ${style} cute kids animation in ${loc}. Setting: ${loc}. Characters: ${setup} wearing ${outfit}. Action (0-10s): ${desc}\n` +
      `💬 First Sequence Spoken Dialogue: "${seq1Dialogue}"\n\n` +
      `🎥 CLIP 2 PROMPT (Second 10-Second Scene — Google Flow / Gemini Continuation Prompt):\n` +
      `10-second ${style} continuation in ${loc}. Setting: ${loc}. Characters: Locked ${setup} wearing identical ${outfit}. Action (10-20s): Direct continuation as the kid executes the funny surprise move with an adorable smile.\n` +
      `💬 Second Sequence Spoken Dialogue: "${seq2Dialogue}"\n\n` +
      `✂️ CAPCUT CONTINUITY & EDITING NOTES:\n` +
      `• Stitch Clip 1 (0-10s) and Clip 2 (10-20s) end-to-end in CapCut for a seamless continuous 20-second video with 100% character appearance, outfit, environment, and story continuity.\n\n` +
      `⚠️ NOTE: Generated via Built-in Engine (Anthropic API Credit Balance Low).`
    ];
  }

  if (cat === "SHORT_CLIP") {
    return [
      `[FORMAT: 9:16 Vertical Aspect Ratio. Center main action.]\n\n` +
      `📋 PROJECT CHARACTER & VISUAL BIBLE:\n` +
      `• Character 1 (Man): Lean adult male, sharp refined features, dark disheveled hair, wearing ${outfit}.\n` +
      `• Character 2 (Girl): Elegant adult female, dark expressive eyes, wearing matching ${outfit}.\n` +
      `• Visual & Environment Bible: Location: ${loc}, Vibe: ${vibe}, Rendering: ${style}.\n\n` +
      `🎬 CONNECTED 10-SECOND CLIP SEQUENCE:\n\n` +
      `🎥 CLIP 1 (0-10s): Opening scene in ${loc}. ${desc} Camera slowly pushes in on the character's expressive face.\n` +
      `🎥 CLIP 2 (10-20s): Dynamic interaction beat in ${loc}. Locked character appearance maintained seamlessly.\n` +
      `🎥 CLIP 3 (20-30s): Emotional climax and warm embrace under soft volumetric lighting.\n` +
      `🎥 CLIP 4 (30-40s): Final lingering glance and peaceful resolution in ${loc}.\n\n` +
      `⚠️ NOTE: Generated via Built-in Engine (Anthropic API Credit Balance Low). To re-enable full Claude AI models, add credits at console.anthropic.com/settings/plans`
    ];
  }

  const customDiagLine = input.customDialogue
    ? `💬 Spoken Dialogue: "${input.customDialogue}"\n\n`
    : "";

  return [
    `[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]\n\n` +
    `10-second ${style} concept set in ${loc}.\n` +
    `Setting: ${loc} with ${vibe} atmosphere.\n` +
    `Character Setup: ${setup} wearing ${outfit}.\n` +
    `Scene: ${desc}\n` +
    `HOOK (0-3s): Opening visual focus on character performance.\n` +
    `ESCALATION (3-7s): Dynamic camera movement as emotional intensity peaks.\n` +
    `PUNCHLINE (7-10s): Cinematic freeze frame ending with lingering emotional resonance.\n\n` +
    customDiagLine +
    `⚠️ NOTE: Generated via Built-in Engine.`
  ];
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
    ...CLAUDE_MODELS,
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
  kidsAudioStyle?: string;
  kidsTalkingSpeed?: string;
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
  songCrowdFx?: string;
  characterFaceType?: string;
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
    ...CLAUDE_MODELS,
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
5. Output Format: Return ONLY the corrected, clean dialogue text with NO extra intro, outro explanations, or markdown quotes.
${input.customSceneDescription && input.customSceneDescription.trim() ? `6. SCENE CONTEXT: The dialogue should fit naturally within this scene/situation: "${input.customSceneDescription.trim()}". Ensure the corrected dialogue matches the mood, setting, and context of this scene.` : ""}
${
  (input.category === "POETRY" || input.category === "SONG")
    ? `
POETRY & SONG — STRICT 10-SECOND SCRIPT RULES (CRITICAL):
6. NO LINE REPETITION: NEVER repeat the same Shayari couplet, lyric line, or phrase more than once. Every line must be unique and forward-moving.
7. FIT IN 10 SECONDS: The entire script must be readable/speakable in a natural, expressive 10-second delivery. Max 2-3 lines or 1 complete Shayari sher (couplet) only.
8. COMPLETE THOUGHT: The script must have a clear opening line, a middle build, and a final climactic word or line — all within the 10-second window.`
    : ""
}`,
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
    ...CLAUDE_MODELS,
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
