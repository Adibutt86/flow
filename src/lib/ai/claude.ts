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
3. PIXAR 4-SCENE COMEDY STRUCTURE (8 SECONDS PER SCENE):
   - Scene 1 (Hook - 8s): Start with a surprising or funny situation immediately. No long intro. Make viewers curious. End with a mini cliffhanger.
   - Scene 2 (Build-up - 8s): Another character reacts. Increase confusion with funny expressions and short dialogue under 12 words.
   - Scene 3 (Escalation - 8s): Situation becomes crazier. Visual slapstick comedy increases rapidly.
   - Scene 4 (Punchline - 8s): Deliver an unexpected twist ending that makes previous scenes hilarious. End with a freeze-frame reaction pose.
4. Image prompt MUST start with: "CHARACTER CONSISTENCY LOCK: Maintain exact features of ${ctx.mainCharacterName}. (NO TEXT, NO TITLES, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN VISUAL RENDER)."
5. DIALOGUE & NARRATION LANGUAGE MANDATE:
   - If Language is "Punjabi" OR Category is "PUNJABI_JOKE": The character dialogue AND narration MUST be strictly in authentic Punjabi / Roman Punjabi (e.g. "Oye paji, eh ki ho gaya!", "Tu mera lassi da glass kyu peeta?", "Sardaar ji, dhyan naal!").
   - If Language is "Urdu" OR "Roman Urdu": The character dialogue AND narration MUST be strictly in authentic Urdu / Roman Urdu (e.g. "Mera khana kahan hai?", "Ye kya ho raha hai?", "Aap ne ye kya kar diya?").
   - If Language is "Hindi" OR Category is "HINDI_JOKE": The character dialogue AND narration MUST be strictly in authentic Desi Hindi / Roman Hindi (e.g. "Chintu dukaan par ja kar kehta hai...", "Uncle, discount do!").
   - NEVER output English dialogue or English narration when Punjabi, Urdu, or Hindi is requested!

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
          temperature: 0.95,
          messages: [
            {
              role: "user",
              content: `You are an expert AI video scriptwriter for short 8-second video clips (Google Flow / VEO format).
Generate EXACTLY 10 distinct, highly creative, family-friendly viral video concept ideas strictly tailored to the chosen Category, Language, and Visual Style below.

Category: ${categoryConfig.name} (${input.category})
Badge: ${categoryConfig.badge}
Description: ${categoryConfig.description}
Tone: ${categoryConfig.tone}
Pacing: ${categoryConfig.pacing}
Hook Style: ${categoryConfig.hookStyle}
Language: ${input.language}
Visual Style: ${input.visualStyle}

STRICT CATEGORY & LANGUAGE GUIDELINES:
1. If Category is "PUNJABI_JOKE" or Language is "Punjabi":
   - ALL 10 ideas MUST be funny Punjabi jokes/chutkule written in Roman Punjabi (e.g., "Santa Banta se kehta hai: 'Oye Hoye! Tu dhaba par kya kar raha hai?'", "Papaji Jatt se kehte hain...", "Inspector ne Banta se poochha...").
   - Include authentic Punjabi characters (Santa, Banta, Papaji, Bebe, Jatt, Inspector).
   - Do NOT write generic English animal stories.

2. If Category is "HINDI_JOKE" or Language is "Hindi" or "Urdu" or "Roman Urdu":
   - ALL 10 ideas MUST be funny Desi jokes written in Roman Hindi/Urdu (e.g., "Chintu dukaan par ja kar kehta hai...", "Pappu teacher se poochhta hai...").

3. If Category is "HORROR":
   - ALL 10 ideas MUST be terrifying eerie horror tales with creepy visual hooks and dark twists.

4. If Category is "FUNNY_ANIMALS":
   - ALL 10 ideas MUST feature hilarious pets/animals in absurd human situations.

5. If Category is "KIDS_FUNNY":
   - ALL 10 ideas MUST be cute, whimsical Pixar/Disney style child & pet physical comedy.

Return ONLY a valid JSON array of 10 distinct strings:
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

  // Category-specific Fallback Ideas
  if (input.category === "PUNJABI_JOKE" || input.language === "Punjabi") {
    return [
      "Santa voice-controls his 1980 vintage tractor in a green Pind field: 'Oye Siri! Start the tractor and play Bhangra!'",
      "Banta opens an English Dhaba and translates 'Sarson Ka Saag' as 'Mustard Green Power Paste' for a confused tourist.",
      "Santa argues with GPS on a dirt road: 'Oye Madam! Khet vich kyu mor rahi hai? Aage ganna laga hai!'",
      "Banta jumps with full body weight on a Royal Enfield kickstarter 5 times before it launches him onto a soft hay bale.",
      "Dadi attaches a solar panel to her traditional wooden charkha spinning wheel to spin cotton at 1000 RPM.",
      "Santa Banta se kehta hai: 'Oye Banta, tu dhaba par chal kar lassi pyeyega ya bullet par stunt karega?'",
      "Papaji ne Santa se poochha: 'Tu exam vich fail kyu ho gaya?' Santa bola: 'Papaji, paper hi out of syllabus si!'",
      "Banta petrol pump par ja kar kehta hai: 'Oye paji, 50 rupaye ka petrol car vich pa do aur 10 rupaye da hawai jahaj vich!'",
      "Santa hospital vich doctor se kehta hai: 'Doctor saab, mainu neend vich Punjabi gaane sunai dete hain!'",
      "Inspector Banta se kehta hai: 'Tu red light kyu todi?' Banta bola: 'Sardaar ji, gaadi di brake hi Punjabi dance kar rahi si!'"
    ];
  }

  if (input.category === "HINDI_JOKE" || input.language === "Hindi" || input.language === "Urdu" || input.language === "Roman Urdu") {
    return [
      "Chintu dukaan par ja kar kehta hai: 'Uncle, 10 rupaye ka discount do!' Shopkeeper bola: 'Pehle 10 rupaye to do!'",
      "Pappu teacher se kehta hai: 'Sir, agar main homework na karoon toh aap gussa karoge?' Teacher: 'Haan!' Pappu: 'Toh main nahi kar raha!'",
      "Dadi Chintu se kehti hain: 'Beta, mobile chhodo aur thoda dhyan lagao!' Chintu: 'Dadi, dhyan hi toh mobile par laga raha hoon!'",
      "Inspector Pappu se kehta hai: 'Tumne chori kyu ki?' Pappu: 'Sir, board par likha tha — Please Take What You Need!'",
      "Chintu doctor se kehta hai: 'Doctor saab, mujhe bhoolne ki bimari hai!' Doctor: 'Kab se?' Chintu: 'Kya kab se?'",
      "Mom opens the kitchen cabinet causing 40 plastic containers to avalanche out while looking for one missing green lid.",
      "Dad is sleeping snoring on the couch holding the TV remote, but his eye instantly snaps open the moment the channel is changed.",
      "An uncle thumps three watermelons like a dholak drum set before proudly walking away with one tiny lemon.",
      "A kid wears 3 different hats and fake mustaches to revisit the supermarket free cheese sample booth 4 times.",
      "A student in the back row launches a paper airplane across the classroom right into the teacher's submission tray."
    ];
  }

  if (input.category === "HORROR") {
    return [
      "A girl looks into an antique vanity mirror late at night and her reflection blinks 3 seconds after she does.",
      "A night security guard walks down a pitch-black hospital hallway when a wheelchair rolls toward him with fresh wet footprints appearing on the floor.",
      "A boy hears his mother calling him down for dinner from the kitchen, but her voice whispers from under his bed: 'Don't go down, I heard it too.'",
      "An old grandfather clock stops ticking at midnight, and every portrait painting in the dimly lit hallway turns to face the front door.",
      "A photographer develops vintage Polaroid photos, discovering a shadowy silhouette standing closer to the camera in every consecutive frame.",
      "A lonely hiker pitches a tent in foggy woods and watches two giant glowing eyes illuminate right against the thin nylon tent fabric.",
      "A man receives a video doorbell notification on his phone at 3 AM showing himself sleeping inside his locked bedroom from above.",
      "A wooden rocking chair in a dark attic begins rocking frantically by itself while a child's faint laughter echoes behind the wall.",
      "A subway train enters a dark tunnel, and when the interior lights flicker back on, all passengers have swapped faces.",
      "A lone driver on a deserted highway looks in his rearview mirror and sees a pale figure sitting silently in the backseat."
    ];
  }

  if (input.category === "FUNNY_ANIMALS") {
    return [
      "Sir Barnaby the fat ginger cat wearing a mini red tie inspects a robot vacuum cleaner before riding it like a king.",
      "A dramatic husky takes 3 steps toward his food bowl, gasps dramatically, and flops onto his side like he walked 100 miles.",
      "A sneaky black cat in a spy harness rappels down from the ceiling on a black thread to steal a single french fry.",
      "A clever parrot blurts out the owner's secret Wi-Fi password out the balcony window to the entire neighborhood.",
      "A giant gentle Doberman drops a squeaky yellow tennis ball at a burglar's feet and forces him to play fetch.",
      "An otter floats on its back in a sparkling river, pulls out a smooth glowing pebble from its pocket, and shows it off proudly.",
      "A French bulldog tries to do yoga poses alongside his owner on a yoga mat with hilarious clumsy rolls.",
      "A cat wearing a tiny business suit conducts an urgent board meeting with three confused golden retrievers.",
      "A golden retriever tries to fit a gigantic wooden stick through a narrow park door with extreme determination.",
      "A puppy gets super confused seeing his own reflection in a full-length mirror and does a cute battle bounce."
    ];
  }

  if (input.category === "KIDS_FUNNY") {
    return [
      "A toddler in a green dinosaur onesie uses a wooden spoon catapult and a flour bag to launch toward the high cookie jar.",
      "A 2-year-old in a T-Rex onesie stomps up to a sleeping bulldog and lets out a tiny squeak-roar.",
      "A mischievous kid builds a giant fortress out of sofa cushions, but one tiny sneeze collapses the entire castle delightfully.",
      "A toddler wears his dad's oversized dress shoes and wobbles around the living room like a clumsy penguin.",
      "A playful puppy gets tangled in a massive roll of colorful toilet paper and rolls across the living room like a snowball.",
      "A little girl tries to feed her giant teddy bear broccoli, making hilarious dramatic eating noises for the toy.",
      "A cute kitten tries to catch a floating soap bubble and does a dramatic mid-air belly flop on a plush rug.",
      "A boy attempts to blow a huge bubble gum bubble that grows larger than his head until it pops all over his face.",
      "A little kid tries to slide down a wooden hallway in fluffy socks, gliding like an Olympic skater into soft cushions.",
      "A baby panda cub rolls down a gentle grassy hill, accidentally knocking over a stack of bamboo toys."
    ];
  }

  if (input.category === "ABSTRACT") {
    return [
      "A chrome toaster puts on sunglasses and launches golden glowing neon bagels into the air like fireworks.",
      "A man reaches into a bathroom mirror for coffee; his reflection reaches out and hands him a fresh hot doughnut instead.",
      "A spilled bowl of cereal and milk automatically rewinds in mid-air, assembling perfectly back into the box.",
      "A pug in a red cape does a dramatic superhero slow-mo landing soft onto a dog bed and falls asleep instantly.",
      "Surreal glass spheres morph into liquid neon ripples in sync with rhythmic audio beats.",
      "A glowing holographic cat walks across a futuristic neon city rooftop in floating gravity-defying steps."
    ];
  }

  return [
    "A toddler in a green dinosaur onesie uses a wooden spoon catapult to launch toward the high cookie jar.",
    "Sir Barnaby the fat ginger cat wearing a mini red tie inspects a robot vacuum cleaner before riding it like a king.",
    "Santa voice-controls his 1980 vintage tractor in a green Pind field: 'Oye Siri! Start the tractor and play Bhangra!'",
    "Dad wakes up at 5 AM wearing a pink sweatband, lifts a tiny 2kg dumbbell, and instantly collapses back asleep.",
    "Mom opens the kitchen cabinet causing 40 plastic containers to avalanche out while looking for one green lid.",
    "A character pulls a slice of pizza and the cheese stretches out the window and hitches onto a passing bus.",
    "An uncle pushes a grocery cart down a shiny aisle and executes a perfect 360-degree drift into cereal.",
    "A sneaky black cat in a spy harness rappels from the ceiling to steal a single french fry.",
    "A man reaches into a bathroom mirror for coffee; his reflection reaches out and hands him a fresh hot doughnut.",
    "A giant gentle Doberman drops a squeaky yellow tennis ball at an intruder's feet and forces him to play fetch."
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

  const isPunjabi = input.language === "Punjabi" || input.category === "PUNJABI_JOKE";
  const isUrdu = input.language === "Urdu" || input.language === "Roman Urdu" || input.language === "Hindi" || input.category === "HINDI_JOKE";

  const dialogue = isPunjabi
    ? (isFirst ? `"Oye paji! Eh ki ho gaya!"` : isFinal ? `"Oye hoye! Eh toh kamaal ho gaya!"` : `"Tussi dekho, hun maza aayega!"`)
    : isUrdu
    ? (isFirst ? `"Aap ye kya kar rahe hain?"` : isFinal ? `"Arey wah! Ye toh kamaal ho gaya!"` : `"Dekho dekho! Kya hone wala hai!"`)
    : (isFirst ? `"Ah... magnificent massage, robot!"` : isFinal ? `"Whoa! Respect the boss!"` : `"Faster, servant!"`);

  const narration = isPunjabi
    ? (isFirst ? `${mainChar.name} Punjabi style vich scene da aaghaz karda hai.` : isFinal ? `${mainChar.name} zabardast punchline reaction denda hai!` : `${mainChar.name} action nu agay badhata hai!`)
    : isUrdu
    ? (isFirst ? `${mainChar.name} kahani ka aaghaz karta hai.` : isFinal ? `${mainChar.name} zabardast final reaction deta hai!` : `${mainChar.name} aage badhta hai!`)
    : (isFirst ? `${mainChar.name} lies back luxuriously as the robot vacuum massages his belly!` : isFinal ? `The robot vacuum bumps furniture, sending ${mainChar.name} sliding into a final boss pose!` : `${mainChar.name} commands the robot vacuum to accelerate!`);

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
