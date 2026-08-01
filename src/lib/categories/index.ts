import { CategoryConfig, CategoryId } from "./types";

export const CATEGORIES: Record<CategoryId, CategoryConfig> = {
  HORROR: {
    id: "HORROR",
    name: "Horror Story",
    badge: "Eerie & Suspenseful",
    iconName: "Ghost",
    description: "Chilling short tales built on mystery, unsettling dread, and a terrifying twist.",
    storytellingRules: [
      "Instantly grabbing, terrifying visual hook within the first 2 seconds",
      "Building ominous suspense and atmospheric dread",
      "Escalation of supernatural or psychological threat",
      "Shadowy mystery or unsettling discovery",
      "Shocking or haunting twist ending",
    ],
    tone: "Dark, ominous, tense, unsettling",
    pacing: "Slow-burn buildup exploding into high-tension climax",
    hookStyle: "Mysterious phenomenon, strange noise, or terrifying sight appearing unexpectedly",
    endingStyle: "Shock twist ending or sudden scary reveal leaving the viewer gasping",
    characterStyle: "Vulnerable protagonist, ominous creature or shadowed antagonist",
    visualStyleSuggestions: [
      "Dark Fantasy",
      "Cinematic Lighting (Moody)",
      "Found Footage / VHS",
      "Photorealistic Gothic",
    ],
    dialogueStyle: "Whispered, sparse, panic-stricken dialogue or eerie narration",
    promptInstructions:
      "Emphasize harsh shadows, low-key volumetric lighting, atmospheric fog, unsettling angles, and high visual contrast.",
  },

  FUNNY: {
    id: "FUNNY",
    name: "Funny Story",
    badge: "Witty & Hilarious",
    iconName: "Laugh",
    description: "Classic comedic storytelling with setup, expectation, absurd escalation, and punchline.",
    storytellingRules: [
      "Clear setup establishing a relatable everyday scenario",
      "Strong subverted expectation or hilarious misunderstanding",
      "Visual escalation of chaotic actions",
      "Physical comedy and expressive character reactions",
      "Unforgettable visual punchline or ironic twist",
    ],
    tone: "Playful, energetic, humorous, absurd",
    pacing: "Brisk setup with rapid comedic timing",
    hookStyle: "Relatable or curious mistake about to go wrong",
    endingStyle: "High-impact visual punchline or funny awkward moment",
    characterStyle: "Overly confident or easily flustered characters with exaggerated expressions",
    visualStyleSuggestions: [
      "3D Cartoon",
      "Vibrant Stylized",
      "Comic Book",
      "Claymation",
    ],
    dialogueStyle: "Fast-paced, witty, comedic banter with funny sound effects cues",
    promptInstructions:
      "Emphasize expressive facial reactions, exaggerated poses, wide-angle comedy framing, vibrant saturation, and humorous timing.",
  },

  HINDI_JOKE: {
    id: "HINDI_JOKE",
    name: "Hindi Joke / Chutkule",
    badge: "Desi Humor",
    iconName: "MessageCircle",
    description: "Authentic Desi banter, natural conversational Hindi, sharp misunderstandings & viral punchlines.",
    storytellingRules: [
      "Natural conversational Hindi dialogue (short, crisp, catchy lines)",
      "Relatable Indian household, street, or school setup",
      "Hilarious misunderstanding or clever comeback",
      "Desi cultural nuance and expressive comedy facial shots",
      "Instant hilarious punchline framing",
    ],
    tone: "Desi, light-hearted, viral, funny",
    pacing: "Quick dialogue exchange with dramatic pauses before the punchline",
    hookStyle: "Casual funny conversation or typical Desi situation starting up",
    endingStyle: "Shocked face, facepalm, or hilarious final retort",
    characterStyle: "Relatable characters (Chintu, Pappu, Professor, Inspector, Boss, Dadi)",
    visualStyleSuggestions: [
      "3D Indian Cartoon",
      "Bollywood Cinematic",
      "Vibrant 3D Render",
    ],
    dialogueStyle: "Conversational Hindi with authentic slang and short snappy lines",
    promptInstructions:
      "Maintain vibrant Indian environments, rich colorful clothing, dynamic camera push-ins for punchline reactions, and crisp lighting.",
  },

  PUNJABI_JOKE: {
    id: "PUNJABI_JOKE",
    name: "Punjabi Joke / Chutkule",
    badge: "Punjabi Desi Humor",
    iconName: "Smile",
    description: "Hilarious Punjabi banter, Santa-Banta comedy, authentic Pind & city humor, and epic Punjabi comebacks.",
    storytellingRules: [
      "Authentic Punjabi conversational dialogue (Short Punjabi phrases like 'Oye Hoye!', 'Kyu Tussi!', 'Dhyan Naal')",
      "Relatable Punjabi Pind (village), dhaba, or city family setup",
      "Witty Punjabi misunderstanding or iconic Santa-Banta style logic",
      "Exaggerated Punjabi body language, turban/kurta details, and comedy expressions",
      "Instant funny Punjabi punchline with shocked double-take reactions",
    ],
    tone: "Lively, energetic, Punjabi Desi, viral comedy",
    pacing: "Fast-paced Punjabi banter building to an absurd punchline",
    hookStyle: "Friendly Punjabi argument or funny dhaba conversation starting up",
    endingStyle: "High-impact Punjabi laugh reaction, facepalm, or hilarious loud retort",
    characterStyle: "Classic Punjabi characters (Santa, Banta, Papaji, Bebe, Jatt, Inspector)",
    visualStyleSuggestions: [
      "3D Punjabi Cartoon",
      "Colorful 3D Village Render",
      "Bollywood Punjabi Comedy",
    ],
    dialogueStyle: "Conversational Punjabi with funny slang, catchy lines, and expressive comedic timing",
    promptInstructions:
      "Maintain vibrant Punjabi clothing (bright turbans, colorful dupattas, embroidered kurtas), lush green fields/dhaba settings, dynamic camera push-ins for punchline reactions, and warm sunny lighting.",
  },

  KIDS_FUNNY: {
    id: "KIDS_FUNNY",
    name: "Kids Funny",
    badge: "Cute & Whimsical",
    iconName: "Sparkles",
    description: "Delightful physical comedy, cute characters, safe humor, and adorable surprises.",
    storytellingRules: [
      "Cute, lovable characters with instantly clear goals",
      "Simple, innocent storyline easy for kids to follow",
      "Playful slapstick, clumsy attempts, and safe humor",
      "Visual surprise or cheeky little victory",
      "Heartwarming or funny cute ending",
    ],
    tone: "Cute, joyful, energetic, innocent",
    pacing: "Playful, cheerful, and visually captivating",
    hookStyle: "Kid attempting a secret mission or mischievous idea",
    endingStyle: "Giggling character, cute reaction, or heartwarming mess",
    characterStyle: "Big-eyed cute kids, toddlers, or friendly cartoon companions",
    visualStyleSuggestions: [
      "3D High-Quality Cartoon",
      "Soft Toy Animation",
      "Watercolor Dream",
    ],
    dialogueStyle: "Simple, cheerful dialogue or funny cute voiceovers",
    promptInstructions:
      "Bright warm lighting, soft rounded character features, saturated primary colors, clean cheerful environments.",
  },

  FUNNY_ANIMALS: {
    id: "FUNNY_ANIMALS",
    name: "Funny Animals",
    badge: "Pets & Wildlife",
    iconName: "Dog",
    description: "Anthropomorphic animals in human situations, unexpected tricks, and visual comedy.",
    storytellingRules: [
      "Strong animal personality (e.g. sneaky cat, overly dramatic dog, sophisticated monkey)",
      "Placing the animal in a uniquely human-like predicament or job",
      "Visual comedy through animal body language and expressions",
      "Unexpected animal stunt or failure",
      "Laugh-out-loud punchline",
    ],
    tone: "Amusing, cheeky, chaotic, lovable",
    pacing: "Fast-moving animal antics with crisp action cuts",
    hookStyle: "Animal doing something surprisingly smart or ridiculous",
    endingStyle: "Smug animal posture or hilarious pet chaos outcome",
    characterStyle: "Expressive animals with distinct accessories (glasses, hats, aprons)",
    visualStyleSuggestions: [
      "3D Animal Animation",
      "Photorealistic Animals in Clothes",
      "Stylized Cartoon",
    ],
    dialogueStyle: "Humorous inner animal thoughts, snappy narration, or comedic pet noises",
    promptInstructions:
      "Focus on animal fur details, micro-expressions, human clothing tailored to animal body shapes, and eye-level framing.",
  },

  ABSTRACT: {
    id: "ABSTRACT",
    name: "Abstract & Surreal",
    badge: "Mind-Bending",
    iconName: "Eye",
    description: "Surreal transformations, impossible physics, hypnotic visuals, and viral aesthetic concepts.",
    storytellingRules: [
      "Striking visual motif that immediately captures curiosity",
      "Surreal material transformation (liquids, glass, neon, floating particles)",
      "Defying real-world physics with fluid, mesmerizing movement",
      "Escalating visual rhythm aligned with audio beats",
      "Seamless loop or stunning dreamlike final state",
    ],
    tone: "Hypnotic, dreamlike, mysterious, artistic",
    pacing: "Fluid, rhythmic, hypnotic motion transitions",
    hookStyle: "Impossible physical transformation happening right before eyes",
    endingStyle: "Mind-bending visual climax or seamless video loop transition",
    characterStyle: "Abstract figures, geometric humanoids, or morphing entities",
    visualStyleSuggestions: [
      "Surreal 3D Glass & Neon",
      "Cyberpunk Holographic",
      "Psychedelic Liquid Art",
      "Minimalist Abstract",
    ],
    dialogueStyle: "Minimal poetic narration or pure atmospheric sound design focus",
    promptInstructions:
      "Emphasize refractive materials, glossy reflections, vibrant gradient lighting, macro camera depth, and dynamic fluid dynamics.",
  },

  CINEMATIC: {
    id: "CINEMATIC",
    name: "Cinematic Story",
    badge: "Epic & Atmospheric",
    iconName: "Film",
    description: "High-production visual storytelling, cinematic lighting, emotional depth, and dramatic camera moves.",
    storytellingRules: [
      "High-impact cinematic shot setting an immersive mood",
      "Visual character motivation without reliance on heavy dialogue",
      "Dramatic camera motion (dolly push, tracking shot, low-angle hero shot)",
      "Emotional turning point or tense confrontation",
      "Memorable cinematic hero frame or bittersweet cliffhanger",
    ],
    tone: "Atmospheric, dramatic, immersive, epic",
    pacing: "Deliberate cinematic build with intense emotional impact",
    hookStyle: "Breathtaking wide atmosphere shot or tense character close-up",
    endingStyle: "Epic cinematic reveal or powerful atmospheric freeze-frame",
    characterStyle: "Deeply expressive characters with detailed realistic textures and heroic/flawed traits",
    visualStyleSuggestions: [
      "Cinematic 35mm Film",
      "Anamorphic Sci-Fi",
      "Photorealistic Drama",
      "Historical Epic",
    ],
    dialogueStyle: "Sparse, powerful dialogue with cinematic voiceover narration",
    promptInstructions:
      "Focus on 35mm/50mm lens optics, shallow depth of field (bokeh), cinematic color grading, volumetric mist, and precise key lighting.",
  },

  CUTE_KIDS: {
    id: "CUTE_KIDS",
    name: "Cute Kids Videos",
    badge: "Wholesome & Adorable",
    iconName: "Baby",
    description: "Adorable and funny short videos featuring children interacting in heartwarming or silly situations.",
    storytellingRules: [
      "Feature either one cute little girl or a duo of kids (boy/girl, siblings, friends) as main characters",
      "Focus on innocent humor, curiosity, or adorable misunderstandings",
      "Highlight highly expressive, wholesome reactions (giggles, confused looks, big smiles)",
      "Keep interactions sweet, family-friendly, and viral-friendly",
      "End with a heartwarming, laugh-out-loud, or incredibly cute resolution"
    ],
    tone: "Wholesome, sweet, innocent, playful, heartwarming",
    pacing: "Light and bouncy, allowing time to show facial expressions",
    hookStyle: "An adorable question, a funny observation, or a cute attempt at doing something 'grown up'",
    endingStyle: "A sweet hug, a funny toddler logic conclusion, or a big adorable smile",
    characterStyle: "Cute little girl or two kids with expressive faces and playful outfits",
    visualStyleSuggestions: [
      "3D Cartoon",
      "3D Animation",
      "Watercolor",
      "Cinematic Lighting (Soft)"
    ],
    dialogueStyle: "Cute toddler-speak, innocent questions, and bubbly exclamations",
    promptInstructions:
      "Emphasize large expressive eyes, soft lighting, vibrant pastel colors, adorable oversized clothing, and heartwarming physical comedy.",
  },

  CATS_DANCING: {
    id: "CATS_DANCING",
    name: "Cats Dancing",
    badge: "Viral Trend",
    iconName: "Music",
    description: "Hilarious and energetic videos of cats performing trending dance styles with cute costumes and accessories.",
    storytellingRules: [
      "Select a unique dance style (hip-hop, breakdance, salsa, bhangra, K-pop, Bollywood, robot, shuffle, moonwalk, ballet, etc.)",
      "Give the cat a distinct persona (e.g., cool street cat, elegant ballet kitty, swag hip-hop kitten)",
      "Include entertaining costumes or accessories matching the dance style (sunglasses, tutus, gold chains, tiny hats)",
      "Feature hilarious and surprisingly coordinated feline dance moves",
      "Set the performance in a lively, colorful, and engaging environment"
    ],
    tone: "Energetic, hilarious, trendy, upbeat, surprisingly cool",
    pacing: "Fast, rhythmic, synchronized with an imagined upbeat viral audio track",
    hookStyle: "A cat dramatically putting on an accessory (like sunglasses) or striking an unexpected opening pose",
    endingStyle: "A flawless finishing pose, a mic-drop moment, or a funny tired meow",
    characterStyle: "Highly energetic cats (male or female, varying ages from kittens to cool older cats) with swagger",
    visualStyleSuggestions: [
      "3D Cartoon",
      "3D Animation",
      "Neon Cyberpunk",
      "Anime"
    ],
    dialogueStyle: "Mostly rhythmic action-matched SFX, meows, or silent swagger (minimal actual dialogue)",
    promptInstructions:
      "Emphasize dynamic motion blur, neon/stage lighting, hilarious cat facial expressions of intense focus, detailed tiny costumes, and rhythmic action cues.",
  },

  CARBOX: {
    id: "CARBOX",
    name: "Carbox (ASMR Unboxing)",
    badge: "Premium ASMR",
    iconName: "Video",
    description: "Premium ASMR unboxing of high-end die-cast car models with ultra-realistic macro photography.",
    storytellingRules: [
      "Top-down overhead camera on a pristine studio tabletop",
      "Feature satisfying ASMR sounds (peeling plastic, crisp clicks, rustling)",
      "Focus on ultra-realistic macro details of the car (grille, wheels, headlights, paint)",
      "Maintain a luxury commercial product reveal aesthetic",
      "No text, no logos, no watermarks, vertical 9:16 format"
    ],
    tone: "Elegant, premium, satisfying, meticulous, high-end",
    pacing: "Slow, deliberate, revealing, mesmerizing",
    hookStyle: "A highly premium packaged box sliding smoothly into the frame",
    endingStyle: "The unboxed car placed perfectly center stage, doors open, sparkling under studio lights",
    characterStyle: "Just realistic, elegant human hands performing the unboxing",
    visualStyleSuggestions: [
      "Photorealistic",
      "Cinematic 35mm",
      "Realistic",
      "Ultra-detailed Macro"
    ],
    dialogueStyle: "Pure ASMR (No dialogue, just crisp, satisfying audio)",
    promptInstructions:
      "Emphasize bright softbox studio lighting, shallow depth of field, ultra-realistic textures, satisfying unboxing action, and luxury product showcase vibes.",
  },

  CUSTOM: {
    id: "CUSTOM",
    name: "Custom Rules",
    badge: "User Defined",
    iconName: "Sliders",
    description: "Define your own unique storytelling rules, tone, and pacing requirements.",
    storytellingRules: [
      "Follow user-provided custom instructions explicitly",
      "Ensure clear 8-second visual pacing for Google Flow",
      "Maintain consistent character identity across clips",
    ],
    tone: "Custom as specified by the user",
    pacing: "Tailored to user idea",
    hookStyle: "Custom user hook",
    endingStyle: "Custom user ending",
    characterStyle: "Custom characters defined in user prompt",
    visualStyleSuggestions: [
      "3D Cartoon",
      "Cinematic",
      "Anime",
      "Photorealistic",
      "Custom",
    ],
    dialogueStyle: "Custom dialogue preference",
    promptInstructions: "Adapt style and prompt parameters to user's custom instructions.",
  },
};

export function getCategoryConfig(id: CategoryId | string): CategoryConfig {
  return CATEGORIES[id as CategoryId] || CATEGORIES.CUSTOM;
}
