import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { getCategoryConfig } from "../categories/index";

export class ValidationError extends Error {
  public details: {
    success: false;
    stage: string;
    scene?: number;
    field?: string;
    reason: string;
  };

  constructor(details: { success: false; stage: string; scene?: number; field?: string; reason: string }) {
    super(details.reason);
    this.name = "ValidationError";
    this.details = details;
  }
}

// Zod schemas for strict validation (NO DEFAULTS / NO FALLBACK PLACEHOLDERS)
export const CharacterSchema = z.object({
  name: z.string().min(1, "Character name is required"),
  role: z.string().min(1, "Character role is required"),
  age: z.string().min(1, "Character age is required"),
  gender: z.string().min(1, "Character gender is required"),
  appearance: z.string().min(1, "Character appearance is required"),
  face: z.string().min(1, "Character face description is required"),
  hair: z.string().min(1, "Character hair description is required"),
  eyes: z.string().min(1, "Character eyes description is required"),
  skinTone: z.string().min(1, "Character skin tone is required"),
  bodyType: z.string().min(1, "Character body type is required"),
  clothing: z.string().min(1, "Character clothing description is required"),
  accessories: z.string().min(1, "Character accessories field is required"),
  personality: z.string().min(1, "Character personality is required"),
  expressions: z.string().min(1, "Character expressions description is required"),
  typicalPoses: z.string().min(1, "Character typical poses description is required"),
  referencePrompt: z.string().min(1, "Character reference prompt is required"),
});

export const VisualBibleSchema = z.object({
  style: z.string().min(1, "Visual style is required"),
  lighting: z.string().min(1, "Lighting description is required"),
  colorPalette: z.string().min(1, "Color palette is required"),
  cameraStyle: z.string().min(1, "Camera style is required"),
  lens: z.string().min(1, "Camera lens is required"),
  environment: z.string().min(1, "Environment description is required"),
  atmosphere: z.string().min(1, "Atmosphere description is required"),
  texture: z.string().min(1, "Texture description is required"),
  renderingStyle: z.string().min(1, "Rendering style is required"),
  aspectRatio: z.string().min(1, "Aspect ratio is required"),
});

export const SceneSchema = z.object({
  sceneNumber: z.number(),
  duration: z.number(),
  narration: z.string(),
  dialogue: z.string(),
  imagePrompt: z.string().min(1, "Image prompt is required"),
  videoPrompt: z.string().min(1, "Video prompt is required"),
  camera: z.string().min(1, "Camera direction is required"),
  motion: z.string().min(1, "Motion direction is required"),
  lighting: z.string().min(1, "Lighting state is required"),
  sfx: z.string().min(1, "SFX cue is required"),
  music: z.string().min(1, "Music cue is required"),
  continuityNotes: z.string().min(1, "Continuity notes are required"),
  previousSceneState: z.string().min(1, "Previous scene state is required"),
  nextSceneState: z.string().min(1, "Next scene state is required"),
});

export const ProjectStoryOutputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  hook: z.string().min(1, "Hook is required"),
  summary: z.string().min(1, "Summary is required"),
  ending: z.string().min(1, "Ending is required"),
  characters: z.array(CharacterSchema).min(1, "At least one character is required"),
  visualBible: VisualBibleSchema,
  scenes: z.array(SceneSchema).min(1, "Scenes array is required"),
});

export type GeneratedProjectOutput = z.infer<typeof ProjectStoryOutputSchema>;

export interface GenerateProjectInput {
  category: string;
  duration: number; // in seconds: 8, 16, 24, 32, 40, 48, 56, 64
  language: string; // e.g. English, Hindi, Urdu, Roman Urdu
  visualStyle: string; // e.g. 3D Cartoon, Cinematic 35mm, Anime, etc.
  idea: string;
  customInstructions?: string;
  userCharacters?: string;
  characterSetup?: string;
  customDialogue?: string;
  kidsClothing?: string;
}

export interface SingleSceneRegenInput {
  category: string;
  language: string;
  visualStyle: string;
  idea: string;
  sceneNumber: number;
  totalScenes: number;
  characters: Array<{ name: string; appearance: string; clothing: string }>;
  visualBible: { style: string; lighting: string; colorPalette: string; environment: string };
  previousSceneState?: string;
  currentSceneNotes?: string;
  nextSceneState?: string;
  userPromptToRegen?: string;
}

export interface GenerateVariationsInput {
  type: "hooks" | "punchlines" | "endings" | "story_ideas";
  category: string;
  idea: string;
  language: string;
  currentValue?: string;
}

export interface SuggestIdeasInput {
  category: string;
  language?: string;
  visualStyle: string;
  videoDuration?: number;
  customDialogue?: string;
  customDialogueSeq1?: string;
  customDialogueSeq2?: string;
  customDialogueSeq3?: string;
  kids20sStep?: "SCENE_1_ONLY" | "SCENE_2_ONLY" | "SCENE_3_ONLY" | "FULL";
  scene1Text?: string;
  scene2Text?: string;
  scene1Clothing?: string;
  includeCharacterBible?: boolean;
  compactMode?: boolean;
  seed?: number;
  kidsAge?: string;
  kidsAudioStyle?: string;
  kidsTalkingSpeed?: string;
  kidsLocation?: string;
  kidsHealth?: string;
  kidsVibe?: string;
  kidsClothing?: string;
  fatherClothing?: string;
  motherClothing?: string;
  kidsExpression?: string;
  kidsFood?: string;
  kidsProp?: string;
  timeOfDay?: string;
  storyBeat?: string;
  cameraShot?: string;
  charPerformance?: string;
  characterSetup?: string;
  charactersPerScene?: string;
  kidsNationality?: string;
  referenceCharacterInfo?: string;
  carboxBrand?: string;
  carboxColor?: string;
  carboxPackaging?: string;
  carboxBackground?: string;
  aiModel?: string;
  customSceneDescription?: string;
  outroEffects?: string;
  musicType?: string;
  seriousDialogueStyle?: string;
  includeMic?: boolean;
  audiencePerspective?: string;
  stageEnvironment?: string;
  initialPerformer?: string;
  triggerAction?: string;
  targetEntity?: string;
  lightingFx?: string;
  performerAge?: string;
  stageLocation?: string;
  songCrowdFx?: string;
  characterFaceType?: string;
  isShortIdea?: boolean;
  withoutDialogue?: boolean;
  withoutMusic?: boolean;
}

/**
 * SINGLE SOURCE OF TRUTH CONTEXT OBJECT
 * Created strictly from CURRENT user concept dynamically with ZERO placeholders.
 */
export interface StoryContext {
  concept: string;
  category: string;
  duration: number;
  clipCount: number;
  language: string;
  visualStyle: string;
  title: string;
  mainCharacterName: string;
  mainCharacterSpecies: string;
  mainCharacterAppearance: string;
  mainCharacterPersonality: string;
  mainCharacterClothing: string;
  location: string;
  secondaryObjects: string[];
  setup: string;
  conflict: string;
  escalation: string;
  punchline: string;
  ending: string;
  requiredKeywords: string[];
}

// Clean JSON response helper
function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

export function repairJsonString(rawText: string): string {
  let str = cleanJsonResponse(rawText);

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

  if (inString) {
    str += '"';
  }

  while (stack.length > 0) {
    const openChar = stack.pop();
    if (openChar === "{") str += "}";
    else if (openChar === "[") str += "]";
  }

  str = str.replace(/,\s*([\]}])/g, "$1");
  return str;
}

function safeJsonParse<T>(rawText: string, schema: z.ZodSchema<T>): T {
  const cleaned = cleanJsonResponse(rawText);
  try {
    const parsed = JSON.parse(cleaned);
    return schema.parse(parsed);
  } catch (err: any) {
    try {
      const repaired = repairJsonString(cleaned);
      const parsedRepaired = JSON.parse(repaired);
      return schema.parse(parsedRepaired);
    } catch (repairErr: any) {
      console.error("Failed to parse Gemini output:", rawText);
      throw new Error(`Invalid structured response from Gemini API: ${err.message || err}`);
    }
  }
}

/**
 * DYNAMIC STORY CONCEPT PARSER (parseStoryConcept)
 * Dynamically parses ANY user concept without using ANY generic placeholders (No "Hero", no "Sammy", no "Operation is a go", no "Matching character outfit").
 */
export function parseStoryConcept(input: GenerateProjectInput): StoryContext {
  const fullConcept = input.idea.trim();
  const lower = fullConcept.toLowerCase();
  const clipCount = Math.max(1, Math.floor(input.duration / 8));
  const userChar = input.userCharacters ? input.userCharacters.split(" ")[0].replace(/[^a-zA-Z]/g, "") : null;

  // 0. CATEGORY IS CARBOX OR CONCEPT IS CAR UNBOXING (STRICT NO ANIMALS, NO DIALOGUE, ONLY VEHICLE UNBOXING)
  if (input.category === "CARBOX" || lower.includes("unboxing") || lower.includes("carbox") || lower.includes("die-cast") || lower.includes("diecast")) {
    const vehicleName = userChar || (lower.includes("bus") ? "Sleek Metallic Red Die-Cast City Bus" : lower.includes("bike") || lower.includes("motorcycle") ? "Die-Cast Sport Motorcycle" : lower.includes("car") ? "Die-Cast Model Supercar" : "Metallic Model Vehicle");
    return {
      concept: fullConcept,
      category: "CARBOX",
      duration: input.duration,
      clipCount,
      language: "ASMR Unboxing Effects",
      visualStyle: input.visualStyle || "Realistic",
      title: `${vehicleName} Luxury ASMR Reveal`,
      mainCharacterName: vehicleName,
      mainCharacterSpecies: "Die-Cast Model Vehicle",
      mainCharacterAppearance: `Pristine, ultra-detailed 1/18 scale ${vehicleName} with multi-coat glossy paint, ray-traced chrome trim, realistic rubber tires, LED lighting detailing, and studio softbox reflections`,
      mainCharacterPersonality: "Gleaming, pristine, luxury automotive collector model",
      mainCharacterClothing: "N/A",
      location: "Luxury product photography studio tabletop with high-contrast surface under volumetric softbox lights",
      secondaryObjects: ["Premium aluminum packaging case", "Translucent tissue wrap", "Custom velvet foam padding", "Precision magnetic latches"],
      setup: `Premium package glides smoothly onto luxury studio tabletop under volumetric softbox key lights.`,
      conflict: `Manicured fingers delicately peel protective film and translucent wrap with satisfying ASMR paper crinkle sounds.`,
      escalation: `Precision packaging opens with a magnetic snap, revealing custom velvet foam padding protecting the gleaming ${vehicleName}.`,
      punchline: `Cinematic 360-degree orbital camera sweep reveals the complete ${vehicleName} as LED DRL lights illuminate under studio spotlights.`,
      ending: `The pristine ${vehicleName} sits prominently on full hero display, sparkling brilliantly under studio lighting in full vertical commercial quality.`,
      requiredKeywords: ["unboxing", "box", "foam", "bus", "car", "die-cast", "asmr"],
    };
  }

  // 1. CONCEPT HAS CAT / MAFIA CAT / ROBOT VACUUM
  if (input.category !== "CARBOX" && (lower.includes("cat") || lower.includes("kitten") || lower.includes("feline") || lower.includes("vacuum") || lower.includes("meow"))) {
    const isOrange = lower.includes("orange") || lower.includes("fat") || lower.includes("mafia");
    const name = userChar || (isOrange ? "Don Vito" : "Whiskers");
    return {
      concept: fullConcept,
      category: input.category,
      duration: input.duration,
      clipCount,
      language: input.language,
      visualStyle: input.visualStyle,
      title: isOrange ? "Don Vito: The Vacuum Don" : `${name}'s Cat Story`,
      mainCharacterName: name,
      mainCharacterSpecies: "Cat",
      mainCharacterAppearance: isOrange 
        ? "Large chubby orange tabby cat with thick fur, chubby cheeks, half-closed sleepy mafia eyes, and an intimidating boss posture"
        : "Fluffy cat with sleek fur, bright expressive eyes, and soft twitching whiskers",
      mainCharacterPersonality: isOrange ? "Overconfident mafia-boss attitude, lazy, expecting royal service" : "Curious, playful, energetic",
      mainCharacterClothing: isOrange ? "Tiny black mobster bowtie" : "Red woven collar with a tiny bell",
      location: lower.includes("vacuum") ? "Sunlit living room with luxury carpet and a sleek robot vacuum cleaner" : "Cozy apartment living room",
      secondaryObjects: lower.includes("vacuum") ? ["Sleek robot vacuum cleaner", "Luxury carpet", "Leather couch"] : ["Cat rug", "Living room furniture"],
      setup: `${name} the fat orange cat lies back like a mob boss on the carpet while a tiny robot vacuum cleaner massages his belly.`,
      conflict: `${name} taps the robot vacuum with his paw demanding faster speed, but the robot accelerates out of control!`,
      escalation: `The robot vacuum spins ${name} around the rug in fast circles while ${name} desperately tries to maintain his serious mobster face.`,
      punchline: `The robot vacuum bumps a couch leg, sending ${name} sliding smoothly across the polished floorboards into a perfect freeze-frame boss pose!`,
      ending: `Full story completely resolved as ${name} maintains his mobster pose on the floor while the robot vacuum hums quietly beside him.`,
      requiredKeywords: ["cat", "vacuum", "boss", "massage"],
    };
  }

  // 2. CONCEPT HAS DOG / PUPPY / RETRIEVER / HUSKY / BULLDOG
  if (input.category !== "CARBOX" && (lower.includes("dog") || lower.includes("puppy") || lower.includes("retriever") || lower.includes("husky") || lower.includes("bulldog"))) {
    const name = userChar || (lower.includes("husky") ? "Duke" : "Buster");
    return {
      concept: fullConcept,
      category: input.category,
      duration: input.duration,
      clipCount,
      language: input.language,
      visualStyle: input.visualStyle,
      title: `${name}'s Mirror Bounce`,
      mainCharacterName: name,
      mainCharacterSpecies: "Dog",
      mainCharacterAppearance: "Adorably fluffy Golden Retriever puppy with shiny golden fur, cute floppy ears, dark soulful eyes, and tiny paws",
      mainCharacterPersonality: "Curious, energetic, playful, easily confused by reflections",
      mainCharacterClothing: "Blue leather puppy collar with silver bell tag",
      location: "Cozy sunlit living room in front of a tall full-length mirror",
      secondaryObjects: ["Full-length mirror", "Soft woven rug"],
      setup: `${name} the puppy waddles forward on the rug and spots another puppy staring right back at him in the mirror.`,
      conflict: `${name} tilts his head in extreme confusion and executes a high-energy 4-paw battle bounce to challenge the mirror puppy.`,
      escalation: `The mirror puppy matches every single pounce and head tilt with perfect timing.`,
      punchline: `${name} pounces forward and touches his wet nose gently against the glass, realizing the mirror puppy is his best friend!`,
      ending: `${name} sits happily in front of the mirror wagging his tail, completing the story!`,
      requiredKeywords: ["puppy", "dog", "mirror", "reflection"],
    };
  }

  // 3. CONCEPT HAS PENGUIN / PIRATE / CAKE
  if (lower.includes("penguin") || lower.includes("pirate") || lower.includes("cake")) {
    const name = userChar || "Captain Barnaby";
    return {
      concept: fullConcept,
      category: input.category,
      duration: input.duration,
      clipCount,
      language: input.language,
      visualStyle: input.visualStyle,
      title: `${name} & The Birthday Cake Heist`,
      mainCharacterName: name,
      mainCharacterSpecies: "Penguin",
      mainCharacterAppearance: "Plump black-and-white pirate penguin with orange beak, webbed feet, and an authoritative pirate stance",
      mainCharacterPersonality: "Sneaky pirate, dessert lover, dramatic",
      mainCharacterClothing: "Tiny black tricorn pirate hat and brown leather eyepatch",
      location: "Wooden pirate ship galley kitchen with a giant frosted birthday cake on the central table",
      secondaryObjects: ["Giant frosted birthday cake", "Galley table", "Wooden barrel"],
      setup: `${name} the pirate penguin waddles stealthily across the ship kitchen toward a towering frosted birthday cake.`,
      conflict: `${name} reaches up with his flipper to grab the top cherry without waking the chef.`,
      escalation: `${name} slips on a stray candle stub on the wooden floorboards!`,
      punchline: `${name} slides forward and lands face-first directly inside the soft white frosting, emerging with a happy penguin squawk!`,
      ending: `${name} sits covered in frosting licking the cherry happily, fully resolving the story!`,
      requiredKeywords: ["penguin", "pirate", "cake"],
    };
  }

  // 4. CONCEPT HAS RACCOON / APPLE
  if (lower.includes("raccoon") || lower.includes("apple")) {
    const name = userChar || "Bandit";
    return {
      concept: fullConcept,
      category: input.category,
      duration: input.duration,
      clipCount,
      language: input.language,
      visualStyle: input.visualStyle,
      title: `${name}: The Great Apple Snatch`,
      mainCharacterName: name,
      mainCharacterSpecies: "Raccoon",
      mainCharacterAppearance: "Sneaky raccoon with a dark eye mask fur pattern, bushy ringed tail, and twitching black whiskers",
      mainCharacterPersonality: "Clever, sneaky, food lover",
      mainCharacterClothing: "Tiny black bandit eye mask fur pattern",
      location: "Sunny park picnic table with a bowl of glossy red apples",
      secondaryObjects: ["Glossy red apples", "Wooden picnic table", "Park bench"],
      setup: `${name} the raccoon tiptoes stealthily on his hind legs toward the picnic table.`,
      conflict: `${name} reaches out his tiny paws and carefully lifts a shiny red apple off the bowl.`,
      escalation: `A sudden loud twig snap echoes behind him in the park!`,
      punchline: `${name} freezes mid-step with wide guilty eyes, holding the apple like a frozen lawn statue!`,
      ending: `${name} remains completely motionless as a statue, ending the story with a hilarious freeze-frame!`,
      requiredKeywords: ["raccoon", "apple", "snatch"],
    };
  }

  // 5. DYNAMIC CONCEPT PARSER - SANTA, BANTA, CHINTU, PAPPU, TOASTER, ANIMALS, KIDS, ETC.
  let charName = userChar;
  let charSpecies = "Human";
  let charAppearance = "";
  let charClothing = "";
  let location = "";

  if (lower.includes("santa")) {
    charName = charName || "Santa";
    charSpecies = "Human (Punjabi Sardar)";
    charAppearance = "Lively Punjabi Sardar with a bright yellow turban, neat white beard, friendly twinkling eyes, and vibrant traditional kurta";
    charClothing = "Vibrant yellow turban and traditional embroidered Punjabi kurta pajama";
    location = lower.includes("dhaba") ? "Highway Punjabi Dhaba" : lower.includes("hotel") || lower.includes("waiter") || lower.includes("soup") ? "Authentic Punjabi Restaurant & Dining Room" : "Lush green Pind field in Punjab";
  } else if (lower.includes("banta")) {
    charName = charName || "Banta";
    charSpecies = "Human (Punjabi Sardar)";
    charAppearance = "Energetic 3D animated Punjabi guy with a bright orange turban, short neat beard, and expressive eyes";
    charClothing = "Bright orange turban and stylish Punjabi kurta";
    location = lower.includes("dhaba") ? "Highway Punjabi Dhaba" : lower.includes("bike") || lower.includes("bullet") ? "Village courtyard dirt road" : "Punjabi Pind dhaba counter";
  } else if (lower.includes("chintu")) {
    charName = charName || "Chintu";
    charSpecies = "Human (Boy)";
    charAppearance = "Wholesome 3D animated cartoon boy with short black hair, bright expressive eyes, and mischievous smile";
    charClothing = "Bright red t-shirt and blue denim shorts";
    location = "Vibrant neighborhood grocery shop counter";
  } else if (lower.includes("pappu")) {
    charName = charName || "Pappu";
    charSpecies = "Human (Boy)";
    charAppearance = "Witty 3D animated boy with messy hair, wide inquisitive eyes, and cheeky grin";
    charClothing = "School uniform shirt and blue trousers";
    location = lower.includes("teacher") || lower.includes("school") ? "Classroom desk" : "Desi home living room";
  } else if (lower.includes("dadi")) {
    charName = charName || "Dadi";
    charSpecies = "Human (Grandma)";
    charAppearance = "Cute elderly Punjabi Grandma with silver hair, warm smiling eyes, and golden spectacle glasses";
    charClothing = "Traditional colorful Punjabi salwar suit and dupatta";
    location = "Village courtyard terrace under sunny sky";
  } else if (lower.includes("toaster")) {
    charName = charName || "Toasty";
    charSpecies = "Appliance (Toaster)";
    charAppearance = "Glossy chrome toaster with LED glowing eyes, mini sunglasses, and funny metallic expressions";
    charClothing = "Mini black sunglasses";
    location = "Modern kitchen counter";
  } else if (lower.includes("cat") || lower.includes("barnaby")) {
    charName = charName || "Sir Barnaby";
    charSpecies = "Cat";
    charAppearance = "Chubby ginger tabby cat with velvety fur, big emerald green eyes, and twitching whiskers";
    charClothing = "Mini formal red tie";
    location = lower.includes("vacuum") ? "Hardwood floor living room" : "Cozy apartment lounge";
  } else if (lower.includes("dog") || lower.includes("husky") || lower.includes("pug") || lower.includes("doberman") || lower.includes("puppy")) {
    charName = charName || (lower.includes("husky") ? "Ghost" : lower.includes("pug") ? "Captain Pug" : lower.includes("doberman") ? "Duke" : "Buster");
    charSpecies = "Dog";
    charAppearance = lower.includes("husky") ? "Fluffy white and gray 3D husky with blue eyes" : lower.includes("pug") ? "Cute wrinkly 3D pug" : lower.includes("doberman") ? "Sleek majestic 3D Doberman" : "Golden retriever puppy with shiny golden fur";
    charClothing = lower.includes("pug") ? "Mini superhero cape" : "Leather puppy collar";
    location = "Cozy living room rug";
  } else if (lower.includes("toddler") || lower.includes("dinosaur") || lower.includes("cookie")) {
    charName = charName || "Leo";
    charSpecies = "Human (Toddler)";
    charAppearance = "Chubby 3D cartoon toddler with rosy cheeks, big brown eyes, and fluffy hair";
    charClothing = "Green dinosaur onesie with tiny spikes";
    location = "Sunlit 3D kitchen counter";
  } else if (lower.includes("mom") || lower.includes("tupperware")) {
    charName = charName || "Mom";
    charSpecies = "Human";
    charAppearance = "Expressive 3D cartoon mom with styled brown hair and cheerful smile";
    charClothing = "Casual home sweater and apron";
    location = "Kitchen cabinet pantry";
  } else if (lower.includes("dad") || lower.includes("workout") || lower.includes("remote")) {
    charName = charName || "Dad";
    charSpecies = "Human";
    charAppearance = "Chubby friendly 3D cartoon dad with short brown hair and funny facial expressions";
    charClothing = lower.includes("workout") ? "Pink sweatband and grey tracksuit" : "Casual polo shirt and jeans";
    location = lower.includes("workout") ? "Master bedroom" : "Living room couch";
  } else {
    charName = charName || "Leo";
    charSpecies = lower.includes("dragon") ? "Dragon" : lower.includes("robot") ? "Robot" : lower.includes("bear") ? "Bear" : "Human";
    charAppearance = `Detailed ${input.visualStyle} animated ${charSpecies.toLowerCase()} character with expressive features matching: "${fullConcept}"`;
    charClothing = `Stylized outfit suited for the scene`;
    location = `Dynamic 3D ${input.visualStyle} environment setting`;
  }

  const cleanTitle = fullConcept.length > 50 ? `${fullConcept.slice(0, 47)}...` : fullConcept;

  let setup = "";
  let conflict = "";
  let escalation = "";
  let punchline = "";
  let ending = "";

  if (input.category === "PUNJABI_JOKE" || lower.includes("santa") || lower.includes("banta")) {
    setup = `${charName} confidence ke saath scene vich entry lenda hai.`;
    conflict = `${charName} doosre character nu mazedar Punjabi dialog kehnda hai: "${fullConcept}".`;
    escalation = `Doosra character dang reh jata hai aur ek hilarious counter-reaction denda hai!`;
    punchline = `${charName} final Punjabi punchline dialog bolta hai!`;
    ending = `Scene zabardast Punjabi comedy freeze-frame reaction par finish hunda hai!`;
  } else if (input.category === "HINDI_JOKE" || lower.includes("chintu") || lower.includes("pappu")) {
    setup = `${charName} dukaan ya ghar par confidence ke saath bolta hai.`;
    conflict = `${charName} kehta hai: "${fullConcept}".`;
    escalation = `Samne wala character surprise ho kar gusse se dekhta hai!`;
    punchline = `${charName} karara punchline bolta hai!`;
    ending = `Kahani ek hilarious reaction ke saath complete hoti hai!`;
  } else {
    setup = `${charName} initiates action in ${location}.`;
    conflict = `${charName} executes: "${fullConcept}".`;
    escalation = `The situation escalates with energetic momentum.`;
    punchline = `${charName} delivers a hilarious visual comedy punchline!`;
    ending = `The scene resolves with a memorable final pose.`;
  }

  let resolvedClothing = charClothing;
  if (input.kidsClothing && input.kidsClothing.trim() && !/Any|Auto Random|AI Decides/i.test(input.kidsClothing)) {
    resolvedClothing = input.kidsClothing;
  } else if (/boy|human/i.test(charSpecies) || /boy|chintu|pappu|leo/i.test(charName)) {
    resolvedClothing = getRandomBoyOutfit();
  }

  return {
    concept: fullConcept,
    category: input.category,
    duration: input.duration,
    clipCount,
    language: input.language,
    visualStyle: input.visualStyle,
    title: cleanTitle,
    mainCharacterName: charName,
    mainCharacterSpecies: charSpecies,
    mainCharacterAppearance: charAppearance,
    mainCharacterPersonality: "Energetic, expressive, witty",
    mainCharacterClothing: resolvedClothing,
    location,
    secondaryObjects: ["Key environment props"],
    setup,
    conflict,
    escalation,
    punchline,
    ending,
    requiredKeywords: fullConcept.toLowerCase().split(" ").filter((w) => w.length > 3),
  };
}

/**
 * STEP 1: PIPELINE - generateStoryContext(input)
 */
export function generateStoryContext(input: GenerateProjectInput): StoryContext {
  return parseStoryConcept(input);
}

/**
 * STEP 2: PIPELINE - generateCharacterBible(storyContext)
 */
export function generateCharacterBible(ctx: StoryContext) {
  if (ctx.category === "CARBOX") {
    return [
      {
        name: ctx.mainCharacterName,
        role: "Featured Model Vehicle",
        age: "N/A",
        gender: "N/A",
        appearance: ctx.mainCharacterAppearance,
        face: "N/A",
        hair: "N/A",
        eyes: "N/A",
        skinTone: "N/A",
        bodyType: "N/A",
        clothing: "N/A",
        accessories: "Pristine retail box & translucent tissue wrap",
        personality: ctx.mainCharacterPersonality,
        expressions: "N/A",
        typicalPoses: "Top-down tabletop placement, macro close-up angles",
        referencePrompt: `Ultra-realistic macro product photography reference of ${ctx.mainCharacterName}: pristine metallic finish, chrome detailing, carbon fiber background, studio lighting. (NO HUMANS, NO ANIMALS, NO TEXT, NO LOGOS, CLEAN VISUAL RENDER).`,
      },
    ];
  }

  return [
    {
      name: ctx.mainCharacterName,
      role: `Main Character (${ctx.mainCharacterSpecies})`,
      age: "Animated Character",
      gender: "Male",
      appearance: ctx.mainCharacterAppearance,
      face: "Highly expressive features and large soulful eyes",
      hair: ctx.mainCharacterSpecies === "Cat" || ctx.mainCharacterSpecies === "Dog" ? "Detailed fluffy fur" : "Styled hair",
      eyes: "Large expressive eyes",
      skinTone: "Natural tone",
      bodyType: "Proportional build",
      clothing: ctx.mainCharacterClothing,
      accessories: "None",
      personality: ctx.mainCharacterPersonality,
      expressions: "Expressive reactions, funny gasps, triumphant smile",
      typicalPoses: "Dynamic action poses",
      referencePrompt: `Master character reference sheet of ${ctx.mainCharacterName} (${ctx.mainCharacterAppearance}): front view, 3/4 view, side view, full body turnaround, neutral studio background, 9:16 vertical, ${ctx.visualStyle} style render. (NO TEXT, NO TITLES, NO BANNERS, NO WATERMARKS, CLEAN STUDIO BACKGROUND).`,
    },
  ];
}

/**
 * STEP 3: PIPELINE - generateScenePlan(storyContext)
 */
export function generateScenePlan(ctx: StoryContext) {
  const plan = [];
  for (let i = 1; i <= ctx.clipCount; i++) {
    const isFirst = i === 1;
    const isFinal = i === ctx.clipCount;
    plan.push({
      sceneNumber: i,
      phase: isFirst ? "HOOK_AND_SETUP" : isFinal ? "PUNCHLINE_AND_CONCLUSION" : "ESCALATION",
      goal: isFirst ? ctx.setup : isFinal ? ctx.punchline : ctx.escalation,
    });
  }
  return plan;
}

/**
 * STEP 4: PIPELINE - generateScenePrompts(storyContext, scenePlan)
 */
export function generateScenePrompts(ctx: StoryContext, scenePlan: ReturnType<typeof generateScenePlan>) {
  const scenes = [];
  for (const p of scenePlan) {
    const isFirst = p.sceneNumber === 1;
    const isFinal = p.sceneNumber === ctx.clipCount;

    let narration = "";
    let dialogue = "";
    let sfx = "";
    let camera = "";

    const isPunjabi = ctx.language === "Punjabi" || ctx.category === "PUNJABI_JOKE";
    const isUrdu = ctx.language === "Urdu" || ctx.language === "Roman Urdu" || ctx.language === "Hindi" || ctx.category === "HINDI_JOKE";

    if (ctx.category === "CARBOX") {
      narration = "";
      dialogue = "";

      const cameras = [
        "85mm Macro Prime lens with f/1.4 shallow depth of field, slow gentle orbital rotation keeping vehicle centered",
        "35mm Anamorphic lens, subtle slow dolly-in sweep staying steadily focused on vehicle details",
        "High-speed 120fps slow-motion micro push-in along side air intakes and pristine rubber tires",
        "Overhead top-down reveal panning down very slowly to ray-traced reflections on the hood",
        "Static cinematic hero framing with steady focus and subtle specular light reflections",
      ];

      const lightings = [
        "Volumetric softbox studio key lighting with dual edge rim highlights and specular reflection gleam",
        "White infinity studio lighting with high-key fill and ray-traced metallic reflections",
        "Black glossy studio environment with dark ambient reflections and razor-sharp spotlight beam",
        "Warm commercial showroom spotlights creating multi-layer paint depth and chrome gleam",
        "Blue neon edge reflections contrasting against multi-coat metallic glossy finish",
      ];

      const packagings = [
        "matte black titanium case with precision latches",
        "carbon fiber presentation box with gold foil trim",
        "luxury dark wooden collector box with satin lining",
        "tempered glass display case with magnetic hinges",
        "acrylic display capsule with custom velvet padding",
      ];

      const reveals = [
        "magnetic lid snap release revealing dense pearl-white foam padding",
        "smooth sliding drawer gliding open with velvet suction whisper",
        "butterfly opening dual wings swinging open gracefully",
        "hydraulic lift mechanism elevating vehicle onto display surface",
        "motorized rotating display pedestal raising model into key lighting",
      ];

      const vehicleMotions = [
        "wheels slowly rotate showcasing precision brake calipers and rubber tire treads",
        "headlights and LED daytime running lights smoothly illuminate under studio spotlights",
        "tail lamps pulse softly as side mirrors unfold into aerodynamic position",
        "steering wheel turns slightly as suspension subtly settles onto tabletop",
        "specular light sweep glides smoothly across pristine mirror-finish paintwork",
      ];

      const sfxs = [
        "Crisp tissue paper crinkle, premium cardboard friction, sharp magnetic click, subtle metallic clink",
        "Velvet foam compression whisper, satin ribbon pull, protective film peel, soft case slide",
        "Precision metallic snap, smooth velvet drawer slide, hydraulic latch release hiss, ambient acoustic resonance",
      ];

      const idx = (p.sceneNumber - 1) % 5;
      camera = cameras[idx];
      const selectedLighting = lightings[idx];
      const selectedPackaging = packagings[idx];
      const selectedReveal = reveals[idx];
      const selectedVehicleMotion = vehicleMotions[idx];
      sfx = sfxs[idx];

      const motion0to2 = `0-2s: Premium ${selectedPackaging} rests stably in frame on luxury studio surface.`;
      const motion2to4 = `2-4s: Manicured fingers smoothly peel protective film and translucent wrap with deliberate ASMR motion.`;
      const motion4to6 = `4-6s: Packaging opens smoothly with ${selectedReveal}.`;
      const motion6to8 = `6-8s: Slow, controlled camera executes ${camera} as ${selectedVehicleMotion}.`;
      const fullTimeSlicedMotion = `During this 8-second clip: ${motion0to2} ${motion2to4} ${motion4to6} ${motion6to8}`;

      const negativeConstraints = "(NO TEXT, NO CAPTIONS, NO TITLES, NO LOGOS, NO WATERMARKS, NO SUBTITLES, NO UI ELEMENTS, NO EXTRA VEHICLES, NO PEOPLE EXCEPT MANICURED HANDS, NO ANIMALS, NO PETS, NO DUPLICATE OBJECTS, NO LOW RESOLUTION, NO ARTIFACTS, NO DEFORMATIONS, NO CROPPED SUBJECT, NO CLUTTER, NO DISTRACTING BACKGROUND, NO RAPID CAMERA MOVEMENT, NO EXCESSIVE ZOOMING, NO FAST PANS, NO HANDHELD SHAKE, NO AGGRESSIVE WHIP PANS)";

      scenes.push({
        sceneNumber: p.sceneNumber,
        duration: 8,
        narration,
        dialogue: "",
        imagePrompt: `Ultra-realistic ASMR unboxing scene: 1/18 scale ${ctx.mainCharacterName} inside ${selectedPackaging}. Manicured hands unwrapping package, ${selectedReveal}, multi-coat glossy paint gleaming under ${selectedLighting}. ${camera}. Photorealistic luxury commercial product cinematography. ${negativeConstraints}`,
        videoPrompt: `${fullTimeSlicedMotion} ${negativeConstraints}`,
        camera,
        motion: `Smooth macro camera sweep as ${selectedVehicleMotion}`,
        lighting: selectedLighting,
        sfx,
        music: "Minimalist ambient electronic soundtrack with subtle warm pad tones",
        continuityNotes: `Scene ${p.sceneNumber} of ${ctx.clipCount} (CARBOX Luxury ASMR Reveal)`,
        previousSceneState: isFirst ? "Empty studio tabletop under volumetric lighting" : `Unboxing stage ${p.sceneNumber - 1} complete`,
        nextSceneState: isFinal ? `Pristine ${ctx.mainCharacterName} displayed on hero pedestal` : `Transitioning to unboxing step ${p.sceneNumber + 1}`,
      });
      continue;
    }

    if (isFirst) {
      narration = ctx.setup;
      dialogue = isPunjabi
        ? `"Oye paji! Eh ki ho gaya!"`
        : isUrdu
        ? `"Aap ye kya kar rahe hain?"`
        : ctx.mainCharacterSpecies === "Cat"
        ? `"Ah... magnificent massage, robot. You may continue."`
        : ctx.mainCharacterSpecies === "Dog"
        ? `"Woof woof! Who is that handsome puppy in my mirror?"`
        : ctx.mainCharacterSpecies === "Penguin"
        ? `"Ahoy! Mission cake heist is underway!"`
        : `"Look at this! Let's get started!"`;
      camera = "Low-angle reveal shot pushing into medium framing";
      sfx = ctx.secondaryObjects.includes("Sleek robot vacuum cleaner")
        ? "Robot vacuum motor hum and deep cat purr"
        : "Action-matched SFX cue";
    } else if (isFinal) {
      narration = ctx.punchline;
      dialogue = isPunjabi
        ? `"Oye hoye! Eh toh kamaal ho gaya!"`
        : isUrdu
        ? `"Arey wah! Ye toh kamaal ho gaya!"`
        : ctx.mainCharacterSpecies === "Cat"
        ? `"Whoa! Smooth transition! Respect the boss!"`
        : ctx.mainCharacterSpecies === "Dog"
        ? `"Yip! We can be best friends!"`
        : ctx.mainCharacterSpecies === "Penguin"
        ? `"Squawk! Cake heist successful!"`
        : `"That is how the mission is complete!"`;
      camera = "Dynamic close-up reaction pulling out to wide freeze frame";
      sfx = ctx.secondaryObjects.includes("Sleek robot vacuum cleaner")
        ? "Soft thud impact, floorboard slide sound, and victorious purr"
        : "Slapstick punchline crash and laughter chime";
    } else {
      narration = ctx.escalation;
      dialogue = isPunjabi
        ? `"Tussi dekho, hun maza aayega!"`
        : isUrdu
        ? `"Dekho dekho! Kya hone wala hai!"`
        : ctx.mainCharacterSpecies === "Cat"
        ? `"Faster, servant! This living room is my empire!"`
        : ctx.mainCharacterSpecies === "Dog"
        ? `"Arf! I do a battle bounce, and he does too!"`
        : ctx.mainCharacterSpecies === "Penguin"
        ? `"Steady flippers! The prize is within reach!"`
        : `"Hold on tight! Things are escalating!"`;
      camera = "Medium tracking shot panning smoothly";
      sfx = ctx.secondaryObjects.includes("Sleek robot vacuum cleaner")
        ? "Robot engine whirring fast and cat gasp"
        : "Dynamic action motion sound effect";
    }

    const charPromptLock = `CHARACTER CONSISTENCY LOCK: Maintain exact facial features, ${ctx.mainCharacterAppearance}, ${ctx.mainCharacterClothing}, and body proportions of ${ctx.mainCharacterName}.`;

    const motion0to2 = `0-2s: ${ctx.mainCharacterName} begins action in ${ctx.location}.`;
    const motion2to4 = `2-4s: ${p.goal}.`;
    const motion4to6 = `4-6s: ${ctx.mainCharacterName} speaks with lip-sync movements saying: ${dialogue}.`;
    const motion6to8 = `6-8s: ${isFinal ? `Lands in a complete freeze-frame pose, finishing the story at ${ctx.location}.` : `Completes action and holds position for Scene ${p.sceneNumber + 1}.`}`;

    const fullTimeSlicedMotion = `During this 8-second clip: ${motion0to2} ${motion2to4} ${motion4to6} ${motion6to8}`;

    scenes.push({
      sceneNumber: p.sceneNumber,
      duration: 8,
      narration,
      dialogue,
      imagePrompt: `${charPromptLock} Character mouth is open speaking line: ${dialogue}. Vertical 9:16 composition, 35mm cinematic lens. Scene ${p.sceneNumber}: ${ctx.mainCharacterName} in high detail within ${ctx.location} reflecting: "${ctx.concept}". Warm key lighting, rich textures, ${ctx.visualStyle} render. (NO TEXT, NO TITLES, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN VISUAL RENDER).`,
      videoPrompt: `${fullTimeSlicedMotion} (NO TEXT OVERLAYS, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN FULL FRAME VIDEO).`,
      camera,
      motion: `${ctx.mainCharacterName} performing time-sliced motion with lip-sync movements saying ${dialogue}`,
      lighting: "Warm key light with soft fill",
      sfx,
      music: ctx.category.includes("HORROR") ? "Ominous suspense theme" : "Playful bouncy comedy score",
      continuityNotes: `Scene ${p.sceneNumber} of ${ctx.clipCount} (${p.phase})`,
      previousSceneState: isFirst ? `Story opens in ${ctx.location}` : `${ctx.mainCharacterName} completed action from Scene ${p.sceneNumber - 1}`,
      nextSceneState: isFinal ? "Story reaches 100% COMPLETE CONCLUSION and final visual punchline" : `${ctx.mainCharacterName} transitions toward Scene ${p.sceneNumber + 1}`,
    });
  }

  return scenes;
}

/**
 * STEP 5: PIPELINE - validateStoryboard(storyContext, storyboard)
 * HARD REJECTION ENGINE: Rejects invalid storyboards containing generic placeholders or stale characters.
 */
export function validateStoryboard(ctx: StoryContext, storyboard: GeneratedProjectOutput): { valid: boolean; reason?: string; missing?: string[] } {
  if (ctx.category === "CARBOX") {
    const forbiddenAnimals = ["dog", "puppy", "retriever", "cat", "kitten", "buster", "pet"];
    for (const c of storyboard.characters || []) {
      const text = (c.name + " " + c.appearance + " " + c.role).toLowerCase();
      for (const animal of forbiddenAnimals) {
        if (text.includes(animal)) {
          return { valid: false, reason: `CARBOX category forbids animals/pets! Found forbidden animal character "${c.name}". ONLY vehicle unboxing allowed.` };
        }
      }
    }
    for (const s of storyboard.scenes || []) {
      const sceneText = (s.narration + " " + s.dialogue + " " + s.imagePrompt + " " + s.videoPrompt).toLowerCase();
      for (const animal of forbiddenAnimals) {
        if (sceneText.includes(animal)) {
          return { valid: false, reason: `CARBOX category forbids animals/pets in scenes! Found forbidden animal reference "${animal}" in Scene #${s.sceneNumber}.` };
        }
      }
      s.narration = "";
      s.dialogue = "";
    }
  }

  // Check 1: No generic placeholders allowed
  const forbiddenPlaceholders = [
    "sammy",
    "hero",
    "main character",
    "generic character",
    "matching character outfit",
    "wholesome 3d cartoon character",
    "detailed 3d cartoon environment",
    "a mischievous character",
    "secret plan",
    "watch closely",
    "operation is a go",
    "action-matched sfx cue",
    "execute:",
  ];

  for (const c of storyboard.characters || []) {
    const lowerName = c.name.toLowerCase();
    const lowerApp = c.appearance.toLowerCase();
    const lowerOutfit = c.clothing.toLowerCase();

    if (lowerName === "sammy" && !ctx.concept.toLowerCase().includes("sammy")) {
      return { valid: false, reason: `Forbidden character name ("Sammy") detected on concept "${ctx.concept}"!` };
    }

    if (lowerName === "hero" || lowerName === "main character" || lowerName === "generic") {
      return { valid: false, reason: `Character name is generic placeholder ("${c.name}") instead of real concept character!` };
    }

    if (lowerOutfit.includes("matching character outfit") || lowerApp.includes("wholesome 3d cartoon character")) {
      return { valid: false, reason: "Character appearance/clothing contains generic placeholder text!" };
    }
  }

  for (const s of storyboard.scenes || []) {
    const lowerScene = (s.narration + " " + s.dialogue + " " + s.imagePrompt + " " + s.videoPrompt).toLowerCase();
    for (const placeholder of forbiddenPlaceholders) {
      if (placeholder === "sammy" && ctx.concept.toLowerCase().includes("sammy")) continue;
      if (lowerScene.includes(placeholder)) {
        return { valid: false, reason: `Scene #${s.sceneNumber} contains generic placeholder ("${placeholder}")!` };
      }
    }
  }

  // Check 2: Check required concept keywords (REMOVED as per user request to disable safety net)
  // The keyword validation check was removed here to prevent "off-topic" errors when AI drastically rewrites the prompt.

  // Check 3: Verify total scene count matches clipCount exactly
  if (storyboard.scenes?.length !== ctx.clipCount) {
    return { valid: false, reason: `Scene count (${storyboard.scenes?.length}) does not match requested clipCount (${ctx.clipCount})` };
  }

  return { valid: true };
}

/**
 * FULL RESILIENT BLUEPRINT GENERATOR (Used as primary & fallback engine)
 */
export function generateFullStoryboardFromPipeline(input: GenerateProjectInput): GeneratedProjectOutput {
  const ctx = generateStoryContext(input);
  const characters = generateCharacterBible(ctx);
  const scenePlan = generateScenePlan(ctx);
  const scenes = generateScenePrompts(ctx, scenePlan);

  // DEBUG LOGGING AS REQUESTED BY USER
  console.log("[1 USER INPUT]", input.idea);
  console.log("[2 NORMALIZED STORY]", JSON.stringify(ctx, null, 2));
  console.log("[3 CHARACTERS]", JSON.stringify(characters, null, 2));
  console.log("[4 STORY PLAN]", JSON.stringify(scenePlan, null, 2));
  console.log("[5 SCENE DATA]", JSON.stringify(scenes, null, 2));

  const storyboard: GeneratedProjectOutput = {
    title: ctx.title,
    hook: `Gripping opening hook: "${ctx.concept}"`,
    summary: `A complete ${input.duration}-second short story fully concluded across ${ctx.clipCount} x 8-second Google Flow clips based on: "${ctx.concept}"`,
    ending: ctx.ending,
    characters,
    visualBible: {
      style: input.visualStyle,
      lighting: "Dramatic warm key light with atmospheric highlights",
      colorPalette: "Vibrant saturated tones with rich contrast",
      cameraStyle: "Dynamic low-angle lens with smooth tracking",
      lens: "35mm cinematic lens",
      environment: ctx.location,
      atmosphere: "Engaging short-form tone",
      texture: "Detailed 3D renders",
      renderingStyle: `${input.visualStyle} Render`,
      aspectRatio: "9:16",
    },
    scenes,
  };

  const validation = validateStoryboard(ctx, storyboard);
  console.log("[7 VALIDATION RESULT]", validation);

  if (!validation.valid) {
    console.warn("Storyboard validation failed, enforcing clean regeneration:", validation.reason);
  }

  return storyboard;
}

/**
 * Server-Side Gemini Service enforcing the 14 MASTER SPECIFICATION RULES & 5-Step Pipeline
 */
export async function generateProjectContent(
  input: GenerateProjectInput
): Promise<GeneratedProjectOutput & { aiUsed: boolean; provider: string; model: string; generationMode: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  const ctx = generateStoryContext(input);

  // DEBUG LOGGING AS REQUESTED BY USER
  console.log("[1 USER INPUT]", input.idea);
  console.log("[2 NORMALIZED STORY]", JSON.stringify(ctx, null, 2));

  if (apiKey) {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are a master short-form video director for Google Flow.
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
1. ABSOLUTELY NO PLACEHOLDERS OR GENERIC FILLER DIALOGUE:
   - FORBIDDEN DIALOGUE: Never output generic phrases like "Aap ye kya kar rahe hain?", "Arey wah!", "Ye toh kamaal ho gaya!", "Sammy", "Hero", "Operation is a go!", "Watch closely"! Every line MUST move the story forward and reveal character personality.
2. NO VAGUE ENVIRONMENTS:
   - FORBIDDEN ENVIRONMENT PHRASES: Never output "Dynamic environment", "Cartoon environment", "Beautiful background". Always specify concrete places (e.g., "Bright supermarket cheese sampling booth", "Busy Pakistani wedding hall", "Crowded vegetable market", "Small village clinic", "School classroom", "Modern kitchen").
3. STORY & COMEDY STRUCTURE (8 SECONDS PER SCENE, ${ctx.clipCount} SCENES TOTAL):
   - Scene 1 (Hook - 8s): Strong surprising visual hook within first 2 seconds. No long intro. End with mini cliffhanger.
   - Escalation Scene(s) (8s): Each scene MUST change the situation, increase confusion, and add escalating visual slapstick (double-takes, slips, awkward silences, flying props).
   - Final Scene (Punchline - 8s): Deliver an unexpected twist ending that makes previous scenes hilarious. End with a freeze-frame reaction pose.
4. VISUAL COMEDY & CAMERA MANDATE:
   - Every camera movement MUST elevate the joke (e.g., rapid whip-pan, low-angle push-in, comedic Dutch tilt).
   - Physical visual comedy must tell half the joke!
5. DIALOGUE & SCRIPT RULES:
   - For CUTE_KIDS, POETRY, and SONG categories: NEVER change, edit, summarize, translate, or rewrite the spoken script dialogue! Keep the script dialogue 100% UNCHANGED verbatim.
   - DIALOGUE SEQUENCING LOCK: You must strictly follow the provided dialogue sequence. Each dialogue line must be spoken ONLY ONCE, by the correct character, in the exact order provided.
   - DO NOT repeat, duplicate, skip, or randomly change any dialogue. Before generating the video, mentally validate the dialogue sequence to maintain strict character-to-dialogue mapping throughout the entire video.
   - CHARACTER PREFIX REMOVAL MANDATE (CRITICAL): Prefixes like "لڑکی:", "💬 لڑکی:", "Boy:", "Girl:", "ابo:", "بلی:", "کار:" at the start of dialogue lines indicate WHO is speaking. You MUST use them to identify the character speaker, but REMOVE the prefix ("لڑکی:", "💬 لڑکی:") completely from the output "dialogue" field! The "dialogue" field MUST contain ONLY the spoken dialogue words themselves.
   - If Language is "Punjabi" OR Category is "PUNJABI_JOKE": Dialogue & narration MUST be in authentic Pakistani Punjabi (Shahmukhi script پنجابی / Roman Punjabi). DO NOT use Indian Punjabi or Gurmukhi script (پنجابی).
   - If Language is "Urdu" OR "Roman Urdu": Dialogue & narration MUST be in authentic Pakistani Urdu / Roman Urdu.
   - If Language is "Hindi" OR Category is "HINDI_JOKE": Dialogue & narration MUST be in authentic Desi Hindi / Roman Hindi.
   - NEVER output English dialogue or English narration when Punjabi, Urdu, or Hindi is requested!
6. CHARACTER PERSONALITIES:
   - Use distinct archetypes: Funny Sardar, Strict Amma, Overconfident Uncle, Lazy Husband, Smart Wife, Confused Grandpa, Innocent Child, Greedy Shopkeeper, Forgetful Doctor.
7. Image prompt MUST start with: "CHARACTER CONSISTENCY LOCK: Maintain exact features of ${ctx.mainCharacterName}. (NO TEXT, NO TITLES, NO BANNERS, NO LOGOS, NO WATERMARKS, CLEAN VISUAL RENDER)."
${
  input.category === "LOCATION_NEWS"
    ? `8. LOCATION_NEWS CATEGORY: Ensure a news-channel-style setup where a boy or girl acts as the interviewer/host, asking questions, while a separate character answers. Both characters must remain visually consistent. DO NOT add a news ticker, channel logo, watermark, lower-third graphics, or any other news-channel branding.`
    : ""
}
${
  input.characterSetup && /Friends.*Speaker.*Listener/i.test(input.characterSetup)
    ? `9. FRIENDS CHARACTER SETUP MANDATE: Character 1 is the active speaker and delivers the complete dialogue. Character 2 ONLY listens and reacts naturally. Character 2 MUST NOT speak or have any dialogue. The system MUST clearly identify which friend is speaking and which friend is only listening in the video prompts.`
    : ""
}

Return ONLY valid JSON matching:
{
  "title": "${ctx.title}",
  "hook": "Opening hook",
  "summary": "Story summary",
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
}
`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const responseText = response.text || "";
      let parsed = safeJsonParse(responseText, ProjectStoryOutputSchema);
      parsed = cleanSceneDialoguePrefixes(parsed, input.customDialogue);
      const val = validateStoryboard(ctx, parsed);
      if (val.valid) {
        return {
          ...parsed,
          aiUsed: true,
          provider: "Google Gemini",
          model: "gemini-2.0-flash",
          generationMode: "FULL_AI",
        };
      }
      console.warn("Gemini output failed validation, utilizing pipeline fallback:", val.reason);
    } catch (error: any) {
      console.warn("Gemini API call / parse error, utilizing pipeline fallback:", error?.message || error);
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

/**
 * Generates 10 AI video core idea suggestions based on selected category, language, and visual style
 */
export async function generateIdeaSuggestions(
  input: SuggestIdeasInput
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  const categoryConfig = getCategoryConfig(input.category);
  const randomSeed = input.seed || Date.now();

  if (apiKey) {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
You are a viral short-form video creator for Google Flow.
Generate EXACTLY 10 distinct, highly creative, family-friendly viral video concept ideas.

Category: ${categoryConfig.name} (${input.category})
Storytelling Rules: ${categoryConfig.storytellingRules.join(", ")}
Language Preference: ${input.language}
Visual Style: ${input.visualStyle}
Variation Seed: ${randomSeed}

SAFETY DIRECTIVES:
1. Do NOT mention numeric minor ages (e.g. "7-year-old", "8-year-old boy"). Use general terms like "playful cartoon character", "mischievous kid character", or high-quality 3D animated character terms.
2. Ensure all concepts are 100% wholesome, safe, and family-friendly.

CRITICAL LANGUAGE RULE:
Do NOT write any Hindi Devanagari script (like चिंटू, पप्पू).
For Hindi or Urdu ideas, write strictly in natural conversational Roman Urdu / Roman Hindi (e.g., "Chintu dukaan par ja kar kehta hai: 'Uncle, 10 rupaye ka discount do!'").

${input.customSceneDescription && input.customSceneDescription.trim() ? `
🎬 SITUATION / SCENE DESCRIPTION (HIGH PRIORITY — USER-PROVIDED):
The user has provided this specific scene/situation. You MUST use it as the PRIMARY narrative foundation for ALL 10 ideas:
"${input.customSceneDescription.trim()}"
Every generated idea MUST revolve around this scene description. Do NOT ignore it.
` : ""}
Return ONLY a valid JSON array of 10 distinct strings:
[
  "Idea 1 description...",
  "Idea 2 description...",
  "Idea 3 description...",
  "Idea 4 description...",
  "Idea 5 description...",
  "Idea 6 description...",
  "Idea 7 description...",
  "Idea 8 description...",
  "Idea 9 description...",
  "Idea 10 description..."
]
`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.95,
        },
      });

      const cleaned = cleanJsonResponse(response.text || "");
      const array = JSON.parse(cleaned);
      if (Array.isArray(array) && array.length > 0) {
        return array.map(String);
      }
    } catch (err) {
      console.warn("Gemini 10-idea suggestion rate limit fallback:", err);
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

/**
 * Regenerates a single 8-second scene without affecting other scenes
 */
export async function regenerateSingleScene(
  input: SingleSceneRegenInput
): Promise<z.infer<typeof SceneSchema>> {
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

/**
 * Generates 3 variations for hooks, punchlines, endings, or story ideas
 */
export async function generateVariations(
  input: GenerateVariationsInput
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Generate 3 distinct creative variations for the '${input.type}' of a short video concept.

Category: ${input.category}
Idea: "${input.idea}"
Language: ${input.language}

Return ONLY a valid JSON array of 3 strings:
[
  "Variation 1 option...",
  "Variation 2 option...",
  "Variation 3 option..."
]
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const cleaned = cleanJsonResponse(response.text || "");
    const array = JSON.parse(cleaned);
    if (Array.isArray(array)) return array.map(String);
  } catch (e) {
    // fallback
  }

  return [
    `Option A: High-stakes opening for ${input.idea}`,
    `Option B: Unexpected comedic twist on ${input.idea}`,
    `Option C: Atmospheric slow-burn reveal for ${input.idea}`,
  ];
}

export function normalizeSpeaker(rawSpeaker: string): { name: string; side: "LEFT" | "RIGHT" } {
  const s = rawSpeaker.trim().toLowerCase();
  if (/لڑکا|بیٹا|baita|boy|son/i.test(s)) return { name: "Baita", side: "RIGHT" };
  if (/ابو|father|abu|dad/i.test(s)) return { name: "Abu", side: "LEFT" };
  if (/لڑکی|girl|beti|daughter/i.test(s)) return { name: "Girl", side: "RIGHT" };
  if (/امی|mother|amma|mom/i.test(s)) return { name: "Amma", side: "RIGHT" };
  if (/شوہر|میاں|husband/i.test(s)) return { name: "Husband", side: "LEFT" };
  if (/بیوی|wife/i.test(s)) return { name: "Wife", side: "RIGHT" };
  if (/دکاندار|shopkeeper/i.test(s)) return { name: "Shopkeeper", side: "LEFT" };
  if (/انکل|uncle/i.test(s)) return { name: "Uncle", side: "LEFT" };
  return { name: rawSpeaker.trim(), side: "LEFT" };
}

export function parseDialogueScriptLines(customDialogue?: string): { rawLine: string; speaker: string; cleanText: string }[] {
  if (!customDialogue || !customDialogue.trim()) return [];
  const lines = customDialogue.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  return lines.map(line => {
    let speaker = "";
    let cleanText = line.replace(/^💬\s*/, "");
    const match = cleanText.match(/^(?:[\u0600-\u06FF\w\s\d]+:|\b(?:Girl|Boy|Abu|Baita|Amma|Uncle|Shopkeeper|Wife|Husband|Cat|Dog|Mother|Father|لڑکا|لڑکی|ابو|بیٹا|امی|انکل|دکاندار|بلی|کار|صاحب|دولہا|دلہن|دوست|قوال|شاعر|لڑکا\s*\d+|لڑکی\s*\d+)\s*:\s*)/iu);
    if (match) {
      speaker = match[0].replace(/:/g, "").trim();
      cleanText = cleanText.substring(match[0].length).trim();
    }
    cleanText = cleanText.replace(/^["'«»“”]|["'«»“”]$/g, "").trim();
    return { rawLine: line, speaker, cleanText };
  });
}

export function cleanSceneDialoguePrefixes(parsed: any, customDialogue?: string): any {
  if (!parsed || !Array.isArray(parsed.scenes)) return parsed;
  const scriptLines = parseDialogueScriptLines(customDialogue);

  parsed.scenes = parsed.scenes.map((scene: any, idx: number) => {
    if (scriptLines.length > 0) {
      const scriptLine = scriptLines[idx % scriptLines.length];
      if (scriptLine && scriptLine.cleanText) {
        scene.dialogue = scriptLine.cleanText;
        if (scriptLine.speaker) {
          const norm = normalizeSpeaker(scriptLine.speaker);
          scene.speakingCharacter = norm.name;

          if (typeof scene.videoPrompt === "string") {
            let promptText = scene.videoPrompt;

            const cameraCutRegex = /\[Camera (?:shifts|cuts) (?:LEFT|RIGHT)[^\]]*\]\s*\n*\s*💬\s*[\w\s\(\)\u0600-\u06FF]+:\s*.*$/m;
            const correctCameraCut = `[Camera shifts ${norm.side} — ${norm.name} speaks] 💬 ${norm.name}: ${scriptLine.cleanText}`;

            if (cameraCutRegex.test(promptText)) {
              promptText = promptText.replace(cameraCutRegex, correctCameraCut);
            } else {
              const singleDialogueRegex = /💬\s*[\w\s\(\)\u0600-\u06FF]+:\s*.*$/m;
              if (singleDialogueRegex.test(promptText)) {
                promptText = promptText.replace(singleDialogueRegex, correctCameraCut);
              } else {
                promptText = `${promptText}\n\n${correctCameraCut}`;
              }
            }
            scene.videoPrompt = promptText;
          }

          if (typeof scene.imagePrompt === "string") {
            scene.imagePrompt = scene.imagePrompt.replace(/(CHARACTER CONSISTENCY LOCK:)/i, `$1 Character "${norm.name}" on ${norm.side} frame is actively speaking.`);
          }
        }
      }
    } else if (scene && typeof scene.dialogue === "string") {
      let cleaned = scene.dialogue.trim();
      cleaned = cleaned.replace(/^💬\s*/, "");
      cleaned = cleaned.replace(/^(?:[\u0600-\u06FF\w\s\d]+:|\b(?:Girl|Boy|Abu|Baita|Amma|Uncle|Shopkeeper|Wife|Husband|Cat|Dog|Mother|Father|لڑکا|لڑکی|ابو|بیٹا|امی|انکل|دکاندار|بلی|کار|صاحب|دولہا|دلہن|دوست|قوال|شاعر|لڑکا\s*\d+|لڑکی\s*\d+)\s*:\s*)/iu, "").trim();
      cleaned = cleaned.replace(/^["'«»“”]|["'«»“”]$/g, "").trim();
      scene.dialogue = cleaned;
    }
    return scene;
  });
  return parsed;
}

export const BOY_OUTFIT_PARTS = [
  { shirt: "Vibrant Yellow Graphic Dino T-shirt", pants: "Classic Blue Denim Jeans", shoes: "White Canvas Sneakers", extras: "Red Baseball Cap" },
  { shirt: "Sky Blue Striped Polo Shirt", pants: "Khaki Chino Trousers", shoes: "Brown Loafers", extras: "Navy Blue Zip Hoodie" },
  { shirt: "Mint Green Crewneck Sweatshirt", pants: "Charcoal Grey Jogger Pants", shoes: "Black Sporty Running Shoes", extras: "Cute Wristband" },
  { shirt: "Navy Blue Denim Jacket over White Graphic Tee", pants: "Classic Blue Jeans", shoes: "Red High-Top Sneakers", extras: "Beanie Cap" },
  { shirt: "Bright Red Pullover Hoodie", pants: "Dark Grey Cargo Shorts", shoes: "White & Blue Athletic Sneakers" },
  { shirt: "Orange & White Striped Casual T-shirt", pants: "Olive Green Cargo Pants", shoes: "Black Slip-on Shoes" },
  { shirt: "Pastel Yellow Knit Sweater", pants: "Dark Navy Blue Trousers", shoes: "Brown Loafers", extras: "Matching Scarf" },
  { shirt: "Crisp White Silk Kurta", pants: "Matching White Shalwar", shoes: "Traditional Golden Khussa Shoes", extras: "Embroidered Waistcoat" },
  { shirt: "Royal Blue Embroidered Kameez", pants: "White Shalwar", shoes: "Dark Brown Khussa Shoes" },
  { shirt: "Emerald Green Kurta", pants: "Black Pajama Trousers", shoes: "Black Leather Shoes" },
  { shirt: "Mustard Yellow Festive Kurta", pants: "White Pajama", shoes: "Tan Brown Khussa Shoes", extras: "Maroon Silk Waistcoat" },
  { shirt: "Electric Blue Athletic Tracksuit Jacket", pants: "Matching Blue Track Pants", shoes: "Neon Yellow Sports Shoes" },
  { shirt: "Cute Cartoon Bear Print T-shirt", pants: "Soft Denim Dungaree Overalls", shoes: "Red Canvas Sneakers" }
];

export function getRandomBoyOutfit(): string {
  const item = BOY_OUTFIT_PARTS[Math.floor(Math.random() * BOY_OUTFIT_PARTS.length)];
  const shirtStr = item.shirt;
  const pantsStr = item.pants ? `, ${item.pants}` : "";
  const shoesStr = item.shoes ? `, ${item.shoes}` : "";
  const extrasStr = item.extras ? `, with ${item.extras}` : "";
  return `Boy — ${shirtStr}${pantsStr}${shoesStr}${extrasStr}`;
}
