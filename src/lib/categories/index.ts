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

  ANIMAL_DANCING: {
    id: "ANIMAL_DANCING",
    name: "Animal Dancing",
    badge: "Viral Cosplay Pets",
    iconName: "Music",
    description: "Hilarious viral videos of cute 3D/CGI kittens, puppies, and baby animals standing on two legs performing energetic dance routines in cute cosplay costumes.",
    storytellingRules: [
      "Feature ultra-cute 3D/CGI kittens, puppies, baby pandas, or bunnies standing upright on two hind legs",
      "Include detailed plush cosplay costumes (e.g. Strawberry hood hat & diaper with pink crocs, Yellow & black bumblebee suit with wings, Cowboy hat & boots, Dinosaur onesie, Pirate captain)",
      "Set the dance on clean polished living room hardwood floors with giant plush teddy bears in the background or sun-dappled outdoor settings",
      "The animal must start dancing immediately on the first second",
      "MUST NOT add any banners, text, subtitles, or typography on the video",
      "The animal must complete three or four distinct dance moves within 10 seconds",
      "Perform synchronized on-beat dance choreography (side-to-side leg kicks, beat-drop butt wiggle, freeze-on-beat statue pose, arm pumps, spinning twirls)",
      "Sync dance movement with upbeat viral rhythm beats, cute baby animal giggles, and meows/barks"
    ],
    tone: "Cute, hilarious, energetic, viral, trendy, upbeat",
    pacing: "Fast, rhythmic, synchronized on-beat choreography",
    hookStyle: "Cute baby animal in cosplay costume taking a rhythmic opening stance",
    endingStyle: "Synchronized group pose with a cute wink, arm-up victory, or freeze frame",
    characterStyle: "Adorable 3D cartoon or CGI pets (kittens, puppies, pandas, bunnies) standing on two legs wearing plush cosplay outfits",
    visualStyleSuggestions: [
      "3D Pixar Animation",
      "3D Cartoon",
      "Hyper-Realistic CGI",
      "Realistic"
    ],
    dialogueStyle: "Pure dance visual — NO spoken dialogue or script (syncs with viral music & animal SFX)",
    promptInstructions:
      "Emphasize large expressive round eyes, plush costume textures, polished wooden floor reflections, background stuffed animals, and precise on-beat dance choreography.",
  },

  CARBOX: {
    id: "CARBOX",
    name: "Car Unboxing",
    badge: "Premium ASMR",
    iconName: "Video",
    description: "Premium ASMR unboxing of high-end die-cast car models with ultra-realistic macro photography.",
    storytellingRules: [
      "Top-down overhead camera on a pristine studio tabletop",
      "Feature satisfying ASMR sounds (peeling plastic, crisp clicks, rustling)",
      "Focus ONLY on ultra-realistic macro details of the car (grille, wheels, headlights, paint)",
      "Maintain a luxury commercial product reveal aesthetic",
      "STRICTLY NO cats, NO animals, and NO unrelated objects. ONLY car unboxing.",
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

  SONG: {
    id: "SONG",
    name: "Song",
    badge: "Music & Vocals",
    iconName: "Music",
    description: "Adult music video content engine for romantic two-liner songs, Coke Studio acoustic fusion, Sufi Qawwali, and vocal duets.",
    storytellingRules: [
      "Feature romantic, soulful adult singers or vocalists (couples, singers, qawwali group, or acoustic artists)",
      "Focus on emotional vocal depth, rhythm, and musical performance",
      "Highlight two-liner song lyrics paired with expressive music video visuals",
      "Incorporate classic or modern musical instruments (guitar, sitar, harmonium, tabla, Coke Studio fusion)",
      "End with a soul-stirring musical beat or romantic music video glance"
    ],
    tone: "Melodic, romantic, artistic, soulful, musical",
    pacing: "Melodic, smooth, synced with the musical rhythm and song vocal delivery",
    hookStyle: "Captivating musical intro with acoustic guitar or harmonium sound opening",
    endingStyle: "A fading echo of song lyrics or serene aesthetic music video atmosphere",
    characterStyle: "Stylish adult vocalists (Solo Singer, Acoustic Duo, Qawwali Party, Dulha & Dulhan)",
    visualStyleSuggestions: [
      "Hyper-Realistic CGI",
      "Photorealistic 8K Cinematic",
      "Bollywood Cinematic",
      "3D Pixar Animation",
      "Soft Pastel Watercolor"
    ],
    dialogueStyle: "Two-liner song lyrics, melodic vocals, or romantic duet lyrics",
    promptInstructions:
      "Emphasize music video aesthetics, stage/acoustic lighting, crisp instrument details, stylish outfits, and rhythmic vocal expression.",
  },

  POETRY: {
    id: "POETRY",
    name: "Poetry",
    badge: "Shayari & Mushaira",
    iconName: "Feather",
    description: "Dedicated Shayari & Poetry engine for romantic Ghazals, Mushaira Mehfils, funny satirical Shayars, and Urdu/Punjabi couplets.",
    storytellingRules: [
      "Feature eloquent adult Shayars or poets (romantic Shayara, funny comedic poet, classic Mushaira Shayar)",
      "Focus on poetic expressions, dramatic pauses, deep eye contact, or witty satirical punchlines",
      "Highlight traditional Urdu Ghazals, romantic Shayari, funny satire (Tanzo Mazah), or Punjabi Tappa",
      "Incorporate traditional Mushaira Mehfil settings (Gao Takiya bolster cushions, warm ambient lamps, vintage mic)",
      "End with a soul-stirring Shayari climax, audience Wah Wah reaction, or funny comedic poetry punchline"
    ],
    tone: "Poetic, eloquent, emotional, humorous, romantic, artistic",
    pacing: "Deliberate, expressive, with natural poetic pauses for audience Wah Wah or comedic punchlines",
    hookStyle: "A mesmerizing poetic opening line or a funny Shayar addressing the audience",
    endingStyle: "Deep poetic gaze, fading Shayari echo, or hilarious audience laughter and applause",
    characterStyle: "Eloquent Shayars (Solo Shayar, Funny Comedy Poet, Mushaira Mehfil Duo, Romantic Shayara)",
    visualStyleSuggestions: [
      "Hyper-Realistic CGI",
      "Photorealistic 8K Cinematic",
      "Bollywood Cinematic",
      "Dark Fantasy & Eerie Glow",
      "Soft Pastel Watercolor"
    ],
    dialogueStyle: "Urdu Ghazal lines, romantic Shayari couplets, funny satirical Tanzo Mazah, or Punjabi Boliyan",
    promptInstructions:
      "Emphasize authentic Mushaira Mehfil atmosphere, warm glowing ambient lamps, expressively moving hands, and rich traditional/Western outfits.",
  },

  SHORT_CLIP: {
    id: "SHORT_CLIP",
    name: "Short Clip",
    badge: "10s Connected Clips",
    iconName: "Film",
    description: "Connected 10-second video clip ideas with 100% character consistency across clips to build complete short film stories.",
    storytellingRules: [
      "Series of connected 10-second video clip ideas representing specific emotional moments",
      "100% CHARACTER CONSISTENCY MANDATE: All clips use exact same character appearance, clothing, hair, age & body type",
      "Maintain story continuity from clip to clip so they can be combined into a longer video",
      "Focus on visual storytelling, character performance, facial expressions & body language",
      "Music OFF/muted by default (optional music toggle available)",
    ],
    tone: "Emotional, cinematic, narrative, story-driven, character-focused",
    pacing: "Connected 10-second scene beats with strong visual emotional continuity",
    hookStyle: "Clear opening moment capturing a character in a specific emotional state or scene beat",
    endingStyle: "Meaningful scene beat resolving or escalating the overall multi-clip story arc",
    characterStyle: "Locked consistent characters (e.g. Solo character, Couple, Family) with identical outfits & features",
    visualStyleSuggestions: [
      "Hyper-Realistic CGI",
      "Photorealistic 8K Cinematic",
      "Bollywood Cinematic",
      "3D Cartoon",
      "Soft Pastel Watercolor"
    ],
    dialogueStyle: "Silent visual storytelling by default or sparse authentic dialogue couplets",
    promptInstructions:
      "Enforce 100% character consistency across all connected 10-second clips. Keep music OFF by default unless explicitly enabled. Structure clips cleanly so they combine seamlessly into a continuous short film.",
  },

  LIVE_STAGE_METAMORPHOSIS: {
    id: "LIVE_STAGE_METAMORPHOSIS",
    name: "Live Stage Metamorphosis",
    badge: "10s Live VFX Metamorphosis",
    iconName: "Zap",
    description: "Live Event / Audience POV / VFX Illusion Transformation (10 Seconds)",
    storytellingRules: [
      "Target video length: exactly 10 Seconds",
      "Audience POV view of a live stage environment with crowd members holding up glowing smartphone screens",
      "Performer executes a trigger action (tossing cape, spinning in dense fog, snapping fingers) under dramatic stage lighting & VFX",
      "In a single seamless motion, the performer transforms into a massive, realistic target entity (lion, cybernetic panther, phoenix)",
      "The creature lets out a dramatic roar toward the audience while smartphones record the metamorphosis"
    ],
    tone: "Electrifying, magical, high-energy, mesmerizing, epic live illusion",
    pacing: "Fast, dramatic 10-second progression leading to a spectacular VFX morph climax",
    hookStyle: "Audience smartphone POV looking at an illuminated stage under bright spotlights",
    endingStyle: "Massive transformed creature roaring at the crowd as smartphone screens flash and film the moment",
    characterStyle: "Live Stage Performers (Ringmaster, Magician, Illusionist, Acrobat) morphing into Majestic Creatures",
    visualStyleSuggestions: [
      "Ultra-realistic Live Smartphone POV 8K",
      "Cinematic 35mm Live Concert",
      "Hyper-detailed 3D VFX Metamorphosis",
      "Dark Fantasy Stage Illusion"
    ],
    dialogueStyle: "Live crowd cheeres & dramatic creature roar (Audience POV)",
    promptInstructions:
      "Follow the Master Template: [Audience Perspective] view of a [Stage Environment]. A [Initial Performer] stands under [Lighting & FX]. Suddenly, the performer [Trigger Action]. In a single seamless motion, the performer transforms into a massive, realistic [Target Entity]. The creature stands on stage and lets out a dramatic roar toward the audience, while foreground crowd members hold up glowing smartphone screens recording the moment. Ultra-realistic, seamless VFX metamorphosis, photorealistic stage physics, 8k resolution.",
  },

  COMMERCIAL_AD: {
    id: "COMMERCIAL_AD",
    name: "Commercial Ad & Brand Pitch",
    badge: "10-20s Brand Video Ad",
    iconName: "Megaphone",
    description: "High-converting 10-20 second promotional video ads, product pitches, UGC commercials, and marketing pitches.",
    storytellingRules: [
      "Scroll-stopping visual hook in the first 0-3 seconds addressing a problem or desire",
      "High-impact product demonstration, aesthetic reveal, or emotional value pitch (3-12s)",
      "Strong conversion call to action (CTA), discount code, or link in bio push (12-20s)",
      "Photorealistic commercial lighting, premium color grading, and crisp brand framing",
    ],
    tone: "Persuasive, high-converting, premium, energetic",
    pacing: "Fast-paced commercial editing with crisp value delivery",
    hookStyle: "Problem-Agitate-Solve, ASMR product unboxing, or dramatic transformation reveal",
    endingStyle: "Clear Call To Action (CTA) offer with brand logo & link in bio incentive",
    characterStyle: "Relatable customer, brand ambassador, or charismatic product presenter",
    visualStyleSuggestions: [
      "Photorealistic 8K Commercial",
      "UGC TikTok Style",
      "Cinematic Luxury Ad",
      "ASMR Unboxing & Macro",
      "3D Product Animation",
    ],
    dialogueStyle: "Snappy, persuasive, benefit-driven voiceover or energetic UGC customer pitch",
    promptInstructions: "Structure prompt with clear HOOK (0-3s), VALUE PITCH & DEMO (3-12s), and CALL TO ACTION (12-20s). Emphasize brand aesthetics, macro closeups, and high-converting visual appeal.",
  },

  CHARACTER_BIBLE: {
    id: "CHARACTER_BIBLE",
    name: "Character Bible",
    badge: "Character Consistency & World Building",
    iconName: "UserCheck",
    description: "Detailed Character Bible with locked character appearance, physical traits, costume design, personality, background, and visual consistency rules across all connected scenes.",
    storytellingRules: [
      "Define 100% locked visual appearance including face, hair, eye color, age, body height & build",
      "Specify exact clothing/outfit details, colors, textures, accessories, and signature style",
      "Outline character personality traits, tone of voice, posture, facial expressions, and unique mannerisms",
      "Provide locked prompt rules so the character remains 100% identical in every video clip",
      "Set up world-building and character backstory to drive rich multi-clip storytelling",
    ],
    tone: "Detailed, authoritative, consistent, character-focused",
    pacing: "Comprehensive character breakdown and consistent story arc setup",
    hookStyle: "Detailed character introduction showcasing signature visual style and core motivation",
    endingStyle: "Locked character reference guidelines and scene placement scenarios",
    characterStyle: "Locked main protagonist and supporting characters with exact physical and costume specifications",
    visualStyleSuggestions: [
      "Photorealistic 8K Cinematic",
      "Hyper-Realistic CGI",
      "3D Pixar Animation",
      "3D Disney Animation",
      "Studio Ghibli Anime",
      "Oil Painting Masterpiece",
    ],
    dialogueStyle: "Character voice profiling, signature catchphrases, and spoken dialogue guidelines",
    promptInstructions:
      "Generate a comprehensive Character Bible detailing locked physical appearance, costume, accessories, facial features, age, personality, voice guidelines, and visual consistency instructions for AI video rendering.",
  },

  FRUIT_DANCING: {
    id: "FRUIT_DANCING",
    name: "Fruit Dancing",
    badge: "Viral Insta Trend",
    iconName: "Sparkles",
    description: "Viral Instagram & TikTok trend featuring adorable 3D cartoon babies & toddlers wearing fuzzy 3D fruit costumes (Kiwi, Watermelon, Strawberry, Mango, Pineapple, Banana, Avocado) performing cute dance routines.",
    storytellingRules: [
      "Feature an ultra-cute 3D cartoon baby or toddler (1-3 yrs old) with big expressive eyes and rosy chubby cheeks",
      "Dress the baby in a plush, fuzzy 3D fruit Onesie costume (Kiwi, Watermelon, Strawberry, Mango, Pineapple, Banana, Avocado, Dragon Fruit)",
      "Include realistic fruit texture details (fuzzy kiwi peel, sliced fruit belly with black seeds, strawberry seed dots, textured watermelon skin)",
      "Feature energetic, cute toddler dance moves (hip-hop bounce, wobbly wiggle, hands up in the air, foot tapping, cute spins)",
      "Set the performance in a lush, vibrant fruit orchard or garden surrounded by giant sliced fruits on the ground and warm soft lighting",
    ],
    tone: "Cute, joyful, energetic, wholesome, viral",
    pacing: "Bouncy, rhythmic, synchronized with upbeat viral music and toddler giggles",
    hookStyle: "Cute 3D baby in a fuzzy fruit costume striking an adorable opening dance pose",
    endingStyle: "Flawless finishing dance move, cute toddler giggle, or an adorable sit-down bow",
    characterStyle: "Chubby 3D cartoon baby/toddler wearing a textured fuzzy 3D fruit suit with a sliced fruit belly",
    visualStyleSuggestions: [
      "3D Pixar Animation",
      "Hyper-Realistic CGI",
      "3D Disney Animation",
      "Photorealistic 8K Cinematic",
    ],
    dialogueStyle: "Upbeat viral music, cute baby giggles, or short adorable spoken line (e.g. 'Look at my Kiwi dance!')",
    promptInstructions:
      "Emphasize plush fuzzy fruit costume textures, sliced fruit belly with seeds, big shiny baby eyes, chubby cheeks, vibrant outdoor orchard setting, and energetic toddler dance choreography.",
  },

  LOCATION_NEWS: {
    id: "LOCATION_NEWS",
    name: "Location-Based News",
    badge: "News Studio & Interview",
    iconName: "Mic",
    description: "News-channel-style setup where a boy or girl acts as the interviewer/host, asking questions, while a separate character answers in a news setting.",
    storytellingRules: [
      "Interviewer acts as a news host (boy or girl) asking questions",
      "A separate character responds to the interviewer",
      "Both characters remain visually consistent throughout the video",
      "Character appearance, clothing, age, expressions, and personality must be consistent",
      "Location should be a professional news studio, outdoor reporting location, or street interview area",
      "Maintain location and background consistency throughout the video",
      "DO NOT add a news ticker, channel logo, watermark, lower-third graphics, or any other news-channel branding"
    ],
    tone: "Professional, engaging, interview-style, informative or humorous",
    pacing: "Moderate, mimicking a natural back-and-forth news interview",
    hookStyle: "News anchor introduces the topic or directly asks a compelling question",
    endingStyle: "Anchor signs off or gives a final reaction to the answer",
    characterStyle: "Sharp, professional, expressive news anchor (boy or girl) and a visually distinct guest",
    visualStyleSuggestions: [
      "Photorealistic 8K Cinematic",
      "Hyper-Realistic CGI",
      "3D Cartoon",
      "Anime"
    ],
    dialogueStyle: "News reporter style questions and conversational or dramatic guest answers",
    promptInstructions: "Emphasize a clean news environment (studio, street, or outdoor reporting) with proper lighting. Keep the anchor and guest visually consistent across shots. ABSOLUTELY NO lower-thirds, news tickers, logos, or watermarks."
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
