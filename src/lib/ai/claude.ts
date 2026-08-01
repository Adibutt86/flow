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
} from "./gemini";
import { getCategoryConfig } from "../categories/index";

const CLAUDE_MODELS = [
  "claude-3-7-sonnet-20250219",
  "claude-3-5-sonnet-20241022",
  "claude-3-haiku-20240307",
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

function safeJsonParse<T>(rawText: string, schema: z.ZodSchema<T>): T {
  const cleaned = cleanJsonResponse(rawText);
  try {
    const parsed = JSON.parse(cleaned);
    return schema.parse(parsed);
  } catch (err: any) {
    try {
      const repaired = cleaned
        .replace(/,\s*([\]}])/g, "$1")
        .replace(/[\u0000-\u001F]+/g, " ");
      const parsedRepaired = JSON.parse(repaired);
      return schema.parse(parsedRepaired);
    } catch (repairErr: any) {
      console.error("Failed to parse Claude output:", rawText);
      throw new Error(`Invalid structured response from Claude API: ${err.message || err}`);
    }
  }
}

export async function generateProjectContentWithClaude(
  input: GenerateProjectInput
): Promise<GeneratedProjectOutput & { aiUsed: boolean; provider: string; model: string; generationMode: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const ctx = generateStoryContext(input);

  console.log("[CLAUDE INPUT]", input.idea);

  if (apiKey) {
    const anthropic = new Anthropic({ apiKey });

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

CRITICAL RULES:
1. ABSOLUTELY NO PLACEHOLDERS ALLOWED. Never output "Sammy", "Hero", "Main Character", "Operation is a go!", "Watch closely", "Matching character outfit", or generic strings!
2. The entire story MUST BE 100% COMPLETE AND FULLY RESOLVED within EXACTLY ${ctx.clipCount} scenes.
3. Every scene MUST have short dialogue (UNDER 12 WORDS) and time-sliced 8-second video motion breakdown (0-2s, 2-4s, 4-6s, 6-8s).
4. Image prompt MUST start with: "CHARACTER CONSISTENCY LOCK: Maintain exact features of ${ctx.mainCharacterName}. (NO TEXT, NO TITLES, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN VISUAL RENDER)."

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
      "appearance": "${ctx.mainCharacterAppearance}",
      "clothing": "${ctx.mainCharacterClothing}",
      "personality": "${ctx.mainCharacterPersonality}",
      "referencePrompt": "Master reference sheet prompt. (NO TEXT, NO TITLES, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN STUDIO BACKGROUND)."
    }
  ],
  "visualBible": {
    "style": "${ctx.visualStyle}",
    "lighting": "Warm key light",
    "colorPalette": "Vibrant",
    "cameraStyle": "Dynamic lens",
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

    for (const modelName of CLAUDE_MODELS) {
      try {
        const response = await anthropic.messages.create({
          model: modelName,
          max_tokens: 4096,
          temperature: 0.7,
          messages: [{ role: "user", content: prompt }],
        });

        const responseText = response.content[0].type === "text" ? response.content[0].text : "";
        const parsed = safeJsonParse(responseText, ProjectStoryOutputSchema);
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
        console.warn(`Claude (${modelName}) output failed validation, trying next model:`, val.reason);
      } catch (error: any) {
        console.warn(`Claude (${modelName}) API call / parse error, trying next model:`, error?.message || error);
      }
    }
  }

  const fallback = generateFullStoryboardFromPipeline(input);
  return {
    ...fallback,
    aiUsed: false,
    provider: "Local Engine",
    model: "Pipeline Engine",
    generationMode: "PIPELINE_HYBRID",
  };
}

export async function generateIdeaSuggestionsWithClaude(
  input: SuggestIdeasInput
): Promise<string[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const categoryConfig = getCategoryConfig(input.category);

  if (apiKey) {
    const anthropic = new Anthropic({ apiKey });
    for (const modelName of CLAUDE_MODELS) {
      try {
        const response = await anthropic.messages.create({
          model: modelName,
          max_tokens: 2048,
          temperature: 0.9,
          messages: [
            {
              role: "user",
              content: `Generate EXACTLY 10 distinct, highly creative, family-friendly viral video concept ideas for short video creation.
Category: ${categoryConfig.name} (${input.category})
Language: ${input.language}
Visual Style: ${input.visualStyle}

Return ONLY a valid JSON array of 10 strings:
[
  "Idea 1...",
  "Idea 2...",
  "Idea 3...",
  "Idea 4...",
  "Idea 5...",
  "Idea 6...",
  "Idea 7...",
  "Idea 8...",
  "Idea 9...",
  "Idea 10..."
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
      } catch (err) {
        console.warn(`Claude (${modelName}) idea suggestion error, trying next model:`, err);
      }
    }
  }

  return [
    "A fat orange cat acts like a mafia boss while getting massaged by a tiny robot vacuum cleaner.",
    "A pirate penguin tries to steal a giant birthday cake from the ship kitchen.",
    "Chintu dukaan par ja kar aisa mazedar sawal poochta hai ke shopkeeper dang reh jata hai.",
    "A sneaky raccoon tries to snatch a glossy red apple from a picnic table.",
    "A cute golden retriever puppy discovers its reflection in a full-length mirror.",
    "A dramatic husky acts completely exhausted after walking two steps toward his food bowl.",
  ];
}

export async function regenerateSingleSceneWithClaude(
  input: SingleSceneRegenInput
): Promise<z.infer<typeof SceneSchema>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const ctx = generateStoryContext({
    category: input.category,
    duration: input.totalScenes * 8,
    language: input.language,
    visualStyle: input.visualStyle,
    idea: input.idea,
  });

  const mainChar = input.characters[0] || { name: ctx.mainCharacterName, appearance: ctx.mainCharacterAppearance };
  const isFirst = input.sceneNumber === 1;
  const isFinal = input.sceneNumber === input.totalScenes;

  if (apiKey) {
    const anthropic = new Anthropic({ apiKey });
    for (const modelName of CLAUDE_MODELS) {
      try {
        const prompt = `You are a short video director. Regenerate scene #${input.sceneNumber} of ${input.totalScenes} for:
Idea: "${input.idea}"
Character: ${mainChar.name} (${mainChar.appearance})
Visual Style: ${input.visualStyle}
${input.userPromptToRegen ? `User Directive: "${input.userPromptToRegen}"` : ""}

Return ONLY valid JSON matching:
{
  "sceneNumber": ${input.sceneNumber},
  "duration": 8,
  "narration": "Narration text",
  "dialogue": "Short dialogue under 12 words",
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
          max_tokens: 1500,
          temperature: 0.7,
          messages: [{ role: "user", content: prompt }],
        });

        const responseText = response.content[0].type === "text" ? response.content[0].text : "";
        const parsed = safeJsonParse(responseText, SceneSchema);
        return parsed;
      } catch (err) {
        console.warn(`Claude (${modelName}) scene regeneration fallback:`, err);
      }
    }
  }

  const dialogue = isFirst ? `"Ah... magnificent massage, robot!"` : isFinal ? `"Whoa! Respect the boss!"` : `"Faster, servant!"`;
  const narration = isFirst ? `${mainChar.name} lies back luxuriously as the robot vacuum massages his belly!` : isFinal ? `The robot vacuum bumps furniture, sending ${mainChar.name} sliding into a final boss pose!` : `${mainChar.name} commands the robot vacuum to accelerate!`;

  return {
    sceneNumber: input.sceneNumber,
    duration: 8,
    narration,
    dialogue,
    imagePrompt: `CHARACTER CONSISTENCY LOCK: Maintain exact features of ${mainChar.name} (${mainChar.appearance}). Vertical 9:16, 35mm lens. (NO TEXT, NO TITLES, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN VISUAL RENDER).`,
    videoPrompt: `During this 8-second clip: 0-2s: ${mainChar.name} in ${ctx.location}. 2-4s: Action escalates. 4-6s: Speaks lip-sync: ${dialogue}. 6-8s: ${isFinal ? "Final visual punchline freeze frame." : "Holds pose for next scene."} (NO TEXT OVERLAYS, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN FULL FRAME VIDEO).`,
    camera: "Dynamic tracking 35mm lens",
    motion: `${mainChar.name} performing time-sliced motion`,
    lighting: "Soft volumetric key light",
    sfx: "Robot vacuum hum and floor slide thud",
    music: "Background soundtrack",
    continuityNotes: `Continuous transition for scene #${input.sceneNumber}`,
    previousSceneState: input.previousSceneState || "",
    nextSceneState: input.nextSceneState || "",
  };
}

export async function generateVariationsWithClaude(
  input: GenerateVariationsInput
): Promise<string[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    const anthropic = new Anthropic({ apiKey });
    for (const modelName of CLAUDE_MODELS) {
      try {
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
          temperature: 0.8,
          messages: [{ role: "user", content: prompt }],
        });

        const text = response.content[0].type === "text" ? response.content[0].text : "";
        const cleaned = cleanJsonResponse(text);
        const array = JSON.parse(cleaned);
        if (Array.isArray(array)) return array.map(String);
      } catch (e) {
        // fallback
      }
    }
  }

  return [
    `Option A: High-stakes opening for ${input.idea}`,
    `Option B: Unexpected comedic twist on ${input.idea}`,
    `Option C: Atmospheric slow-burn reveal for ${input.idea}`,
  ];
}
