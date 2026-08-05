"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useToast } from "@/components/ui/Toast";
import { CATEGORIES } from "@/lib/categories";
import { CategoryId } from "@/lib/categories/types";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Trash2,
  Heart,
  FileVideo,
  Edit3,
  Search,
  RotateCcw,
  ArrowUpDown,
  Bookmark,
  Share2,
  MessageSquare,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const LANGUAGE_OPTIONS = ["English", "Hindi", "Urdu", "Roman Urdu", "Punjabi"];
const VISUAL_STYLES = [
  "3D Cartoon Style",
  "3D Pixar Animation",
  "3D Disney Animation",
  "Claymation 3D",
  "Photorealistic 8K Cinematic",
  "Realistic ASMR Commercial",
  "Hyper-Realistic CGI",
  "Anime (Shonen / Modern)",
  "Studio Ghibli Anime",
  "Chibi Anime Style",
  "Comic Book & Graphic Novel",
  "Vintage 90s Cartoon",
  "Retro 80s Synthwave",
  "Cyberpunk Neon",
  "Soft Pastel Watercolor",
  "Oil Painting Masterpiece",
  "Paper Cutout Art",
  "Low Poly 3D World",
  "Isometric 3D Architecture",
  "Dark Fantasy & Eerie Glow",
  "Noir Vintage Film",
  "Vector Flat Art Animation",
  "Pencil Sketch & Charcoal",
];

const KIDS_AGE_OPTIONS = [
  "Newborn (0-6 mos)",
  "Infant (6-12 mos)",
  "Baby (1-2 yrs)",
  "Early Toddler (1.5-2.5 yrs)",
  "Toddler (2-4 yrs)",
  "Little Kids (3-5 yrs)",
  "Preschooler (4-5 yrs)",
  "Child (5-8 yrs)",
  "School Age (6-9 yrs)",
  "Pre-Teen (9-12 yrs)",
  "Tween (10-12 yrs)",
  "Early Teen (13-15 yrs)",
  "Teenager (13-17 yrs)",
  "Older Teen (16-18 yrs)",
  "Young Adult (18-24 yrs)",
  "Adult & Child Combo (Mixed Ages)",
  "Family (All Ages)",
];

const KIDS_AGE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Babies & Toddlers (0-4 yrs)",
    options: [
      { value: "Newborn (0-6 mos)", label: "Newborn (0-6 mos)", desc: "Tiny newborn baby, soft blankets, gentle baby coos." },
      { value: "Infant (6-12 mos)", label: "Infant (6-12 mos)", desc: "Crawling infant, cute giggles, exploring toys." },
      { value: "Baby (1-2 yrs)", label: "Baby (1-2 yrs)", desc: "Wobbly first steps, adorable babbling, cute chubby cheeks." },
      { value: "Early Toddler (1.5-2.5 yrs)", label: "Early Toddler (1.5-2.5 yrs)", desc: "Bouncy, curious toddler learning new words." },
      { value: "Toddler (2-4 yrs)", label: "Toddler (2-4 yrs)", desc: "High-energy, playful toddler full of innocent mischief." },
    ],
  },
  {
    category: "Little Kids & Preschoolers (3-9 yrs)",
    options: [
      { value: "Little Kids (3-5 yrs)", label: "Little Kids (3-5 yrs)", desc: "Playful preschooler with big expressive eyes & innocent humor." },
      { value: "Preschooler (4-5 yrs)", label: "Preschooler (4-5 yrs)", desc: "Curious kid asking funny 'why' questions." },
      { value: "Child (5-8 yrs)", label: "Child (5-8 yrs)", desc: "School-age child with playful personality and colorful outfits." },
      { value: "School Age (6-9 yrs)", label: "School Age (6-9 yrs)", desc: "Smart school kid with backpack and fun story ideas." },
    ],
  },
  {
    category: "Pre-Teens & Mixed Ages (9+ yrs)",
    options: [
      { value: "Pre-Teen (9-12 yrs)", label: "Pre-Teen (9-12 yrs)", desc: "Growing pre-teen with fun hobbies and friends." },
      { value: "Tween (10-12 yrs)", label: "Tween (10-12 yrs)", desc: "Cool tween with trendy style." },
      { value: "Teenager (13-17 yrs)", label: "Teenager (13-17 yrs)", desc: "Young teen in casual everyday clothes." },
      { value: "Adult & Child Combo (Mixed Ages)", label: "Adult & Child Combo", desc: "Heartwarming parent and child interaction." },
      { value: "Family (All Ages)", label: "Family (All Ages)", desc: "Multi-generational family with kids, parents, and grandparents." },
    ],
  },
];

const CUTE_KIDS_PRESETS = [
  {
    icon: "⚡",
    title: "Desi Pind Toddler",
    age: "Toddler (2-4 yrs)",
    location: "Desi Village & Punjabi Pind",
    health: "Healthy",
    vibe: "Cheerful & Energetic",
    setup: "One Cute Little Girl",
    perScene: "2 Characters",
    nationality: "Pakistani Punjabi",
    musicType: "Punjabi Beats & Bhangra",
    dialogueStyle: "None",
  },
  {
    icon: "💖",
    title: "Cozy Baby & Mom",
    age: "Baby (1-2 yrs)",
    location: "Cozy Home Living Room",
    health: "Happy & Healthy",
    vibe: "Cute & Playful",
    setup: "Girl + Mother",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    musicType: "None",
    dialogueStyle: "None",
  },
  {
    icon: "🍦",
    title: "Toddler Duo Ice Cream",
    age: "Toddler (2-4 yrs)",
    location: "Ice Cream Shop",
    health: "Healthy",
    vibe: "Silly Kid",
    setup: "One Girl & One Boy",
    perScene: "2 Characters",
    nationality: "Global / Any",
    musicType: "Kids Nursery Rhymes",
    dialogueStyle: "None",
  },
  {
    icon: "🏫",
    title: "School Friends",
    age: "Child (5-8 yrs)",
    location: "Desi Primary School Classroom",
    health: "Healthy & Active",
    vibe: "Happy Explorer",
    setup: "Two Kids (Friends)",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    musicType: "None",
    dialogueStyle: "None",
  },
  {
    icon: "🎤",
    title: "Cute Qawwal Duo",
    age: "Child (5-8 yrs)",
    location: "Traditional Desi Courtyard & Vehra",
    health: "Healthy",
    vibe: "Cheerful & Energetic",
    setup: "Boy & Girl Qawwal Duo",
    perScene: "2 Characters",
    nationality: "Pakistani Punjabi",
    musicType: "Sufi Qawwali & Harmonium",
    dialogueStyle: "None",
  },
  {
    icon: "🐮",
    title: "Boy Singer & Calf",
    age: "Toddler (2-4 yrs)",
    location: "Desi Village & Punjabi Pind",
    health: "Healthy",
    vibe: "Cheerful & Energetic",
    setup: "Boy Singer + Calf",
    perScene: "2 Characters",
    nationality: "Pakistani Punjabi",
    musicType: "Punjabi Beats & Bhangra",
    dialogueStyle: "None",
  },
  // ── NEW PRESETS ──────────────────────────────────────────────────────────────
  {
    icon: "🎵",
    title: "Qawali Night",
    age: "Child (5-8 yrs)",
    location: "Traditional Desi Courtyard & Vehra",
    health: "Healthy",
    vibe: "Romantic",
    setup: "Boy Qawwali Group (Qawwal Party)",
    perScene: "3 Characters",
    nationality: "Pakistani (General / Desi)",
    musicType: "Sufi Qawwali & Harmonium",
    dialogueStyle: "Poetic/Shayari",
  },
  {
    icon: "🎤",
    title: "Shayari Mehfil",
    age: "Child (5-8 yrs)",
    location: "Traditional Desi Courtyard & Vehra",
    health: "Healthy",
    vibe: "Romantic",
    setup: "Boy & Girl Shayar Duo",
    perScene: "2 Characters",
    nationality: "Pakistani Muhajir / Urdu Speaking",
    musicType: "Desi Classical Sitar & Tabla",
    dialogueStyle: "Poetic/Shayari",
  },
  {
    icon: "👦",
    title: "Single Boy Dialogue",
    age: "Child (5-8 yrs)",
    location: "Cozy Home Living Room",
    health: "Healthy",
    vibe: "Cheerful & Energetic",
    setup: "One Cute Little Boy",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    musicType: "None",
    dialogueStyle: "Monologue",
  },
  {
    icon: "👧",
    title: "Single Girl Dialogue",
    age: "Child (5-8 yrs)",
    location: "Cozy Home Living Room",
    health: "Healthy",
    vibe: "Cheerful & Energetic",
    setup: "One Cute Little Girl",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    musicType: "None",
    dialogueStyle: "Monologue",
  },
  {
    icon: "❤️",
    title: "Miya Biwi",
    age: "Young Adult (18-24 yrs)",
    location: "Cozy Home Living Room",
    health: "Happy & Healthy",
    vibe: "Romantic",
    setup: "Husband & Wife (Miya Biwi)",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    musicType: "Lo-Fi Chill & Chillhop",
    dialogueStyle: "None",
  },
  {
    icon: "👬",
    title: "Two Friends",
    age: "Child (5-8 yrs)",
    location: "Desi Dhaba & Roadside Chai Stall",
    health: "Healthy & Active",
    vibe: "Silly Kid",
    setup: "Two Boy Friends (Best Friends)",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    musicType: "Funny Comedy Sound Effects",
    dialogueStyle: "None",
  },
];

export interface OptionWithDesc {
  value: string;
  label: string;
  desc: string;
}

export interface OptionGroupWithDesc {
  category: string;
  options: OptionWithDesc[];
}

export function getOptionDescription(groups: OptionGroupWithDesc[], currentValue: string): string {
  for (const g of groups) {
    const found = g.options.find((o) => o.value === currentValue);
    if (found) return found.desc;
  }
  return "";
}

// 1. LOCATION OPTIONS
const KIDS_LOCATION_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Desi (Indian & Pakistani) Locations",
    options: [
      { value: "Desi Village & Punjabi Pind", label: "Desi Village & Pind (پنڈ / गाँव)", desc: "Authentic rural Desi village with green sugarcane fields, mud houses, and wooden charpai." },
      { value: "Bustling Desi Bazaar & Street Market", label: "Bustling Desi Bazaar (بازار)", desc: "Vibrant local market with colorful spice stalls, bangles, fruits, and rickshaws." },
      { value: "Traditional Desi Courtyard & Vehra", label: "Desi Courtyard / Vehra (صحن)", desc: "Traditional open-air house courtyard with charpais, clay pots, and potted plants." },
      { value: "Desi Dhaba & Roadside Chai Stall", label: "Desi Dhaba & Chai Stall (ڈھابہ)", desc: "Outdoor highway dhaba with wooden charpais, steaming hot chai, and samosas." },
      { value: "House Rooftop Kite Flying (Kotha)", label: "Desi House Rooftop / Kotha (چھت)", desc: "Sunny house rooftop with colorful kites (Patang), festive reels, and city skyline view." },
      { value: "Desi Halwai & Sweet Shop", label: "Desi Sweet Shop / Halwai (مٹھائی)", desc: "Bustling mithai shop with hot jalebis, gulab jamuns, and samosa trays." },
      { value: "Mango & Guava Fruit Orchard", label: "Desi Fruit Orchard / Baagh (باغ)", desc: "Lush green fruit orchard with shady mango and guava trees." },
      { value: "Green Wheat & Mustard Fields", label: "Mustard & Wheat Fields (سرسوں کے کھیت)", desc: "Vibrant yellow mustard (Sarson) and green wheat fields under a sunny blue sky." },
      { value: "Desi Canal & Green Riverbank", label: "Desi Canal & Riverbank (نہر / ندی)", desc: "Scenic rural canal bank with flowing water, lush shade trees, and grazing cattle." },
      { value: "Desi Primary School Classroom", label: "Desi School Classroom (اسکول)", desc: "Desi school classroom with uniform kids, wooden desks, and green chalkboard." },
      { value: "Desi Mela & Festival Fairground", label: "Desi Mela / Festival (میلہ)", desc: "Festive carnival ground with colorful lights, toy stalls, and giant Ferris wheel." },
      { value: "Festive Eid & Chand Raat Market", label: "Eid & Chand Raat Market (عید بازار)", desc: "Night street market decorated with fairy lights, bangles, henna, and sweets." },
      { value: "Traditional Heritage Haveli", label: "Traditional Haveli & Courtyard (حویلی)", desc: "Grand heritage brick Haveli with carved wooden doors, archways, and jharokhas." },
    ],
  },
  {
    category: "Indoor & Home Settings",
    options: [
      { value: "Cozy Home Living Room", label: "Cozy Home / Living Room", desc: "Warm indoor family home setting with sofa, rug, and toys." },
      { value: "Modern Kitchen", label: "Kitchen & Dining", desc: "Clean kitchen with dining table, breakfast snacks, and fruits." },
      { value: "Colorful Kids Bedroom", label: "Kids Bedroom / Playroom", desc: "Vibrant bedroom with bed, stuffed animals, and storybooks." },
      { value: "Cozy Library & Book Nook", label: "Library & Reading Nook", desc: "Quiet library with tall wooden bookshelves, cozy reading chairs, and books." },
      { value: "School Classroom", label: "School Classroom", desc: "Learning environment with tiny desks, colorful charts, and chalkboard." },
      { value: "Daycare & Nursery", label: "Daycare & Nursery", desc: "Safe activity playroom with soft foam blocks and play mats." },
    ],
  },
  {
    category: "Outdoor, Nature & Farm",
    options: [
      { value: "Lush Green Park", label: "Park & Garden", desc: "Lush outdoor green grass, flowers, trees, and sunny sky." },
      { value: "Sunny Playground", label: "Outdoor Playground", desc: "Fun slides, swings, seesaws, and sandbox." },
      { value: "Peaceful Village & Countryside", label: "Village & Countryside", desc: "Rustic rural farm with green fields and friendly animals." },
      { value: "Enchanted Forest & Woodland Trail", label: "Enchanted Forest & Trail", desc: "Sunlit green forest path with towering trees, butterflies, and singing birds." },
      { value: "Misty Mountain Valley & Waterfall", label: "Mountain Valley & Waterfall", desc: "Breathtaking mountain valley with cascading crystal waterfall and wildflowers." },
      { value: "Neighborhood Street", label: "Neighborhood Street", desc: "Clean sunny sidewalk in front of cozy colorful houses." },
      { value: "Sunny Beach & Ocean", label: "Beach & Seaside", desc: "Sandy ocean beach with gentle waves and sea shells." },
      { value: "Cozy Camping Site & Bonfire", label: "Camping Site & Campfire", desc: "Cozy campsite with tents, glowing campfire, and starry night sky." },
    ],
  },
  {
    category: "Fantasy, Sci-Fi & Adventure",
    options: [
      { value: "Magical Cloud Kingdom", label: "Magical Cloud Kingdom", desc: "Floating pastel clouds, rainbow bridges, and sparkling fairy-tale castles." },
      { value: "Futuristic Space Station & Moon Base", label: "Space Station & Moon Base", desc: "High-tech spaceship interior with glowing holograms and starry cosmic views." },
      { value: "Underwater Coral Reef", label: "Underwater Coral Reef", desc: "Vibrant ocean floor with glowing sea anemones, colorful fish, and sunken treasure." },
      { value: "Candyland & Chocolate River", label: "Candyland & Sweet Kingdom", desc: "Whimsical landscape of giant lollipop trees, gummy bear hills, and chocolate river." },
      { value: "Pirate Island & Treasure Cove", label: "Pirate Island & Treasure Cove", desc: "Tropical palm island with a wooden pirate ship and golden treasure map." },
    ],
  },
  {
    category: "Shops, Places & City",
    options: [
      { value: "Ice Cream Shop", label: "Ice Cream Shop", desc: "Colorful sweet parlor with colorful scoops and ice cream cones." },
      { value: "Magical Toy Store", label: "Toy Store", desc: "Exciting shop filled with shelves of toys, dolls, and robots." },
      { value: "Supermarket & Grocery Market", label: "Market / Supermarket", desc: "Bustling market aisle with fruit baskets and shopping carts." },
      { value: "Cozy Restaurant & Cafe", label: "Restaurant & Bakery", desc: "Cozy dining table with treats, cakes, and fruit juices." },
      { value: "Amusement Park & Carnival", label: "Amusement Park", desc: "Festive fairground with colorful rides and balloons." },
      { value: "Arcade & Game Zone", label: "Retro Arcade & Game Zone", desc: "Vibrant gaming arcade with claw machines and neon lights." },
    ],
  },
  {
    category: "Special & Creative",
    options: [
      { value: "Little Science Lab & Art Studio", label: "Science Lab / Art Studio", desc: "Fun workshop with paints, easels, or bubbly science test tubes." },
      { value: "Winter Wonderland & Snow Village", label: "Winter Wonderland & Snow Village", desc: "Snow-covered village with snowmen, wooden cabins, and falling snowflakes." },
      { value: "Global / Any Location", label: "Any / Flexible Location", desc: "Versatile background adapted automatically to the story concept." },
    ],
  },
];

// 2. KIDS HEALTH OPTIONS
const KIDS_HEALTH_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "General Health & Physical Wellness",
    options: [
      { value: "Healthy", label: "Healthy", desc: "Energetic, active, cheerful child with vibrant physical wellness." },
      { value: "Sleepy", label: "Sleepy / Tired", desc: "Tired with slow movements, cute yawning, and soft gestures." },
      { value: "Happy Chubby Kid", label: "Happy Chubby Kid", desc: "Adorable chubby, joyful child full of sweetness." },
      { value: "Cute Chubby Boy", label: "Cute Chubby Boy", desc: "Cute chubby male toddler or boy." },
      { value: "Cute Chubby Girl", label: "Cute Chubby Girl", desc: "Cute chubby female toddler or girl." },
      { value: "Healthy Lifestyle", label: "Healthy Lifestyle", desc: "Balanced daily routine with wholesome habits." },
      { value: "Healthy Eating", label: "Healthy Eating", desc: "Enjoying fresh fruits, vegetables, and nutritious food." },
      { value: "Healthy & Active", label: "Healthy & Active", desc: "Moving around healthily and happily." },
      { value: "Healthy Habits", label: "Healthy Habits", desc: "Good hygiene, handwashing, and positive routines." },
      { value: "Happy & Healthy", label: "Happy & Healthy", desc: "Radiant overall wellbeing and vibrant cheer." },
    ],
  },
  {
    category: "Fitness & Physical Activity",
    options: [
      { value: "Fun Exercise", label: "Fun Exercise", desc: "Playful stretches, jumping, and fun workout moves." },
      { value: "Active Play", label: "Active Play", desc: "High-energy running, chasing, and active outdoor fun." },
      { value: "Morning Workout", label: "Morning Workout", desc: "Fresh morning stretches and cheerful wake-up routine." },
      { value: "Dance Challenge", label: "Dance Challenge", desc: "Bouncy, energetic rhythmic dance moves." },
      { value: "Playground Fun", label: "Playground Fun", desc: "Climbing, sliding, and active playground sports." },
      { value: "Jump Rope Challenge", label: "Jump Rope Challenge", desc: "Skipping rope with playful focus and determination." },
      { value: "Mini Sports Star", label: "Mini Sports Star", desc: "Playing with mini basketballs, soccer balls, or bats." },
      { value: "Stretch & Smile", label: "Stretch & Smile", desc: "Soft physical stretching with a bright smile." },
      { value: "Feel Strong", label: "Feel Strong", desc: "Flexing mini muscles and feeling empowered." },
      { value: "Kids Fitness", label: "Kids Fitness", desc: "Youth-friendly fitness exercises and fun movements." },
      { value: "Tiny Athlete", label: "Tiny Athlete", desc: "Enthusiastic mini sportsman or sportswoman." },
      { value: "Energy Boost", label: "Energy Boost", desc: "Full of vibrant physical energy and stamina." },
      { value: "Family Fitness", label: "Family Fitness", desc: "Exercising together with parents and siblings." },
    ],
  },
  {
    category: "Nutrition & Daily Habits",
    options: [
      { value: "Fruit Time", label: "Fruit Time", desc: "Munching on fresh, colorful apples, bananas, and berries." },
      { value: "Veggie Challenge", label: "Veggie Challenge", desc: "Fun, brave attempts at tasting green vegetables." },
      { value: "Water Break", label: "Water Break", desc: "Refreshing hydration break during active play." },
    ],
  },
];

// 3. KIDS VIBE OPTIONS
const KIDS_VIBE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Mood & Energy",
    options: [
      { value: "Cheerful & Energetic", label: "Cheerful & Energetic", desc: "Bright smiles, joyful laughter, and high positive energy." },
      { value: "Excited", label: "Excited", desc: "Full of energy, enthusiasm, wide-eyed wonder, and eagerness." },
      { value: "Shy", label: "Shy", desc: "Quiet, hesitant, soft-spoken, bashful, and cute." },
      { value: "Sleepy & Cozy", label: "Sleepy & Cozy", desc: "Calming, gentle, relaxed mood." },
      { value: "Cute & Playful", label: "Cute & Playful", desc: "Adorably mischievous and fun-loving spirit." },
      { value: "Happy Explorer", label: "Happy Explorer", desc: "Curious about surroundings with an adventurous spirit." },
      { value: "Sunshine Smile", label: "Sunshine Smile", desc: "Radiating warmth, sweetness, and happy expressions." },
      { value: "Big Smiles", label: "Big Smiles", desc: "Heartwarming, wide beam of pure joy." },
      { value: "Positive Energy", label: "Positive Energy", desc: "Spreading wholesome optimism and cheerful vibes." },
      { value: "Confidence Boost", label: "Confidence Boost", desc: "Brave, proud, and self-assured stance." },
      { value: "Self-Love", label: "Self-Love", desc: "Happy in their own skin and feeling proud." },
    ],
  },
  {
    category: "Themes & Style Vibes",
    options: [
      { value: "Rainbow Adventure", label: "Rainbow Adventure", desc: "Magical, colorful, and imaginative play atmosphere." },
      { value: "Before School Routine", label: "Before School Routine", desc: "Getting ready for school with books and backpack." },
      { value: "Weekend Fun", label: "Weekend Fun", desc: "Carefree, relaxed, weekend play atmosphere." },
      { value: "Silly Kid", label: "Silly Kid / Funny", desc: "Playful funny faces, goofy antics, and slapstick humor." },
      { value: "Romantic", label: "Romantic Vibe", desc: "Sweet, affectionate, heartwarming, and dreamy romantic mood." },
      { value: "Funny Teacher", label: "Funny Teacher Vibe", desc: "Playful classroom roleplay and funny teaching antics." },
      { value: "Dad Jokes", label: "Dad Jokes Vibe", desc: "Wholesome humor and silly parent-child jokes." },
    ],
  },
  {
    category: "Outfits & Everyday Styles",
    options: [
      { value: "Colorful Casual", label: "Colorful Casual", desc: "Bright, everyday casual kids clothes." },
      { value: "Storybook Princess (everyday, not fancy)", label: "Storybook Princess", desc: "Sweet everyday princess vibes without fancy gowns." },
      { value: "Nature Lover", label: "Nature Lover", desc: "Loving animals, flowers, and outdoor exploration." },
      { value: "Little Dancer", label: "Little Dancer", desc: "Rhythmic, graceful, and dance-loving spirit." },
      { value: "Mini Gardener", label: "Mini Gardener", desc: "Loving potted plants, mud, and flowers." },
      { value: "Cozy Homewear", label: "Cozy Homewear", desc: "Comfortable pajamas or soft home clothing." },
      { value: "Soft Pastel Style", label: "Soft Pastel Style", desc: "Aesthetic pastel colors and gentle lighting." },
      { value: "Sporty Toddler", label: "Sporty Toddler", desc: "Athletic sneakers and sporty toddler outfit." },
    ],
  },
  {
    category: "Sensory & ASMR",
    options: [
      { value: "Satisfying Sounds", label: "Satisfying Sounds", desc: "Soft sensory ASMR audio cues and gentle focus." },
      { value: "Soft Whisper", label: "Soft Whisper", desc: "Quiet, gentle, whispering speech." },
      { value: "Crunchy Food", label: "Crunchy Food", desc: "Satisfying crunching sounds while eating snacks." },
    ],
  },
];

export interface AnimalCompanionDef {
  name: string;
  emoji: string;
  desc: string;
}

export const SINGER_ANIMAL_DEFS: AnimalCompanionDef[] = [
  { name: "Calf", emoji: "🐮", desc: "Cute young calf companion standing beside the lead singer." },
  { name: "Cow", emoji: "🐄", desc: "Gentle farm cow companion listening nearby." },
  { name: "Buffalo", emoji: "🐃", desc: "Rural Desi buffalo resting as a companion character." },
  { name: "Goat", emoji: "🐐", desc: "Energetic little goat hopping around as a companion." },
  { name: "Sheep", emoji: "🐑", desc: "Fluffy white sheep standing by as a companion." },
  { name: "Camel", emoji: "🐪", desc: "Tall desert camel companion standing in the scene." },
  { name: "Horse", emoji: "🐎", desc: "Noble horse companion standing beside the singer." },
  { name: "Donkey", emoji: "🫏", desc: "Friendly donkey companion listening to the performance." },
  { name: "Chicken", emoji: "🐓", desc: "Feathery farm chicken clucking along as a companion." },
  { name: "Duck", emoji: "🦆", desc: "Cute yellow duck companion standing in the scene." },
  { name: "Rabbit", emoji: "🐰", desc: "Adorable bunny rabbit sitting near the singer." },
  { name: "Cat", emoji: "🐱", desc: "Cute kitten companion purring beside the singer." },
  { name: "Dog", emoji: "🐶", desc: "Loyal puppy dog companion wagging tail nearby." },
  { name: "Parrot", emoji: "🦜", desc: "Colorful parrot companion perched in the scene." },
  { name: "Peacock", emoji: "🦚", desc: "Vibrant peacock companion fanning feathers." },
  { name: "Pigeon", emoji: "🕊️", desc: "Gentle cooing pigeon resting near the singer." },
];

export function createSingerWithAnimalGroup(
  singerRole: "Boy" | "Girl",
  categoryName: string,
  animals: AnimalCompanionDef[]
): OptionGroupWithDesc {
  return {
    category: categoryName,
    options: animals.map((a) => ({
      value: `${singerRole} Singer + ${a.name}`,
      label: `${singerRole} Singer + ${a.name} ${a.emoji}`,
      desc: `Main Lead Singer: ${singerRole} | Companion: ${a.name}. Little ${singerRole.toLowerCase()} holds the mic as main lead singer; ${a.name.toLowerCase()} appears as companion. ${a.desc}`,
    })),
  };
}

// 4. CHARACTER SETUP GROUPS (EXPANDED WITH PREDEFINED COMBOS)
const CHARACTER_SETUP_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Girl Characters",
    options: [
      { value: "One Cute Little Girl", label: "One Cute Little Girl", desc: "Single cute little girl protagonist." },
      { value: "Cute Hijabi Little Girl", label: "Cute Hijabi Little Girl", desc: "Adorable little girl wearing a neat cute hijab." },
      { value: "Little Girl in Traditional Shalwar Kameez", label: "Little Girl in Shalwar Kameez", desc: "Dressed in a vibrant traditional Shalwar Kameez outfit." },
      { value: "Little Girl in Phulkari Dupatta", label: "Little Girl in Phulkari Dupatta", desc: "Cute Punjabi girl wearing a traditional colorful Phulkari Dupatta." },
      { value: "Smiling Little Girl", label: "Smiling Little Girl", desc: "Bright smiling little girl." },
      { value: "Happy Little Girl", label: "Happy Little Girl", desc: "Joyful and cheerful little girl." },
      { value: "Curious Little Girl", label: "Curious Little Girl", desc: "Inquisitive little girl asking questions." },
      { value: "Shy Little Girl", label: "Shy Little Girl", desc: "Quiet and gentle little girl." },
      { value: "Playful Little Girl", label: "Playful Little Girl", desc: "Fun-loving playful girl." },
      { value: "Energetic Little Girl", label: "Energetic Little Girl", desc: "High energy active little girl." },
      { value: "Laughing Little Girl", label: "Laughing Little Girl", desc: "Giggling and laughing little girl." },
      { value: "Cheerful Village Girl", label: "Cheerful Village Girl", desc: "Cute rural village girl in vibrant traditional clothing." },
      { value: "Little Girl Riding a Bicycle", label: "Little Girl Riding a Bicycle", desc: "Happy girl riding a small pink bicycle with training wheels." },
      { value: "Little Girl with a Kitten", label: "Little Girl with a Kitten", desc: "Little girl tenderly holding a fluffy cute kitten." },
      { value: "Little Girl with a Puppy", label: "Little Girl with a Puppy", desc: "Excited girl cuddling a playful little puppy." },
      { value: "Little Girl Superhero", label: "Little Girl Superhero", desc: "Fearless little girl wearing a mini superhero cape." },
      { value: "Little Girl Astronaut", label: "Little Girl Astronaut", desc: "Cute girl in a white spacesuit dreaming of space." },
      { value: "Little Girl Doctor", label: "Little Girl Doctor", desc: "Little girl with a toy stethoscope checking her teddy bear." },
      { value: "Cute Twin Girls", label: "Cute Twin Girls", desc: "Matching cute twin little girls holding hands." },
      { value: "Little Girl with Fairy Wings", label: "Little Girl with Fairy Wings", desc: "Enchanting little girl with sparkling magical fairy wings." },
      { value: "Sleeping Little Girl", label: "Sleeping Little Girl", desc: "Peacefully sleeping little girl." },
      { value: "Reading Little Girl", label: "Reading Little Girl", desc: "Little girl reading a storybook." },
      { value: "Drawing Little Girl", label: "Drawing Little Girl", desc: "Little girl drawing with crayons." },
      { value: "Singing Little Girl", label: "Singing Little Girl", desc: "Little girl singing cheerfully." },
      { value: "Dancing Little Girl", label: "Dancing Little Girl", desc: "Little girl dancing gracefully." },
      { value: "Little Girl with Glasses", label: "Little Girl with Glasses", desc: "Cute little girl wearing glasses." },
      { value: "Little Girl with Curly Hair", label: "Little Girl with Curly Hair", desc: "Little girl with bouncy curly hair." },
      { value: "Little Girl with Ponytail", label: "Little Girl with Ponytail", desc: "Little girl with high ponytail." },
      { value: "Little Girl with Braids", label: "Little Girl with Braids", desc: "Little girl with braided hair." },
      { value: "Little Girl in School Uniform", label: "Little Girl in School Uniform", desc: "Neat school uniform look." },
      { value: "Little Girl in Princess Dress", label: "Little Girl in Princess Dress", desc: "Cute princess dress outfit." },
      { value: "Little Girl in Sports Outfit", label: "Little Girl in Sports Outfit", desc: "Sporty outfit and sneakers." },
      { value: "Little Girl in Raincoat", label: "Little Girl in Raincoat", desc: "Bright yellow raincoat and boots." },
      { value: "Little Girl in Winter Clothes", label: "Little Girl in Winter Clothes", desc: "Warm beanie and winter coat." },
      { value: "Little Girl in Pajamas", label: "Little Girl in Pajamas", desc: "Cozy bedtime pajamas." },
      { value: "Little Girl Wearing a Backpack", label: "Little Girl Wearing a Backpack", desc: "School backpack on shoulders." },
      { value: "Little Girl Holding a Toy", label: "Little Girl Holding a Toy", desc: "Holding a favorite toy." },
      { value: "Little Girl Holding a Balloon", label: "Little Girl Holding a Balloon", desc: "Holding a colorful helium balloon." },
      { value: "Little Girl Holding a Teddy Bear", label: "Little Girl Holding a Teddy Bear", desc: "Hugging a plush teddy bear." },
      { value: "Little Girl Eating Fruit", label: "Little Girl Eating Fruit", desc: "Eating fresh fruit happily." },
      { value: "Little Girl Brushing Teeth", label: "Little Girl Brushing Teeth", desc: "Brushing teeth at bathroom sink." },
      { value: "Toddler Girl", label: "Toddler Girl", desc: "Adorable toddler girl (1.5-3 yrs)." },
      { value: "Preschool Girl", label: "Preschool Girl", desc: "Preschool girl (3-5 yrs)." },
      { value: "Kindergarten Girl", label: "Kindergarten Girl", desc: "Kindergarten girl (5-6 yrs)." },
      { value: "School-Age Girl", label: "School-Age Girl", desc: "School age girl (6-9 yrs)." },
      { value: "Confident Little Girl", label: "Confident Little Girl", desc: "Brave, proud, and confident." },
      { value: "Adventurous Little Girl", label: "Adventurous Little Girl", desc: "Bold and adventurous explorer." },
      { value: "Thoughtful Little Girl", label: "Thoughtful Little Girl", desc: "Deeply thoughtful and observant." },
      { value: "Funny Little Girl", label: "Funny Little Girl", desc: "Funny facial expressions and jokes." },
      { value: "Creative Little Girl", label: "Creative Little Girl", desc: "Imaginative and creative spirit." },
      { value: "Little Girl Scientist", label: "Little Girl Scientist", desc: "Mini scientist with lab goggles." },
      { value: "Little Girl Chef", label: "Little Girl Chef", desc: "Mini chef with apron and chef hat." },
      { value: "Little Girl Artist", label: "Little Girl Artist", desc: "Mini artist with paintbrush and palette." },
      { value: "Little Girl Explorer", label: "Little Girl Explorer", desc: "Little explorer with magnifying glass." },
      { value: "Little Girl Gardener", label: "Little Girl Gardener", desc: "Gardening with watering can and flowers." },
      { value: "Little Girl Musician", label: "Little Girl Musician", desc: "Playing toy piano or xylophone." },
    ],
  },
  {
    category: "Boy Characters",
    options: [
      { value: "One Cute Little Boy", label: "One Cute Little Boy", desc: "Single cute little boy protagonist." },
      { value: "Little Boy in Traditional Kurta Pajama", label: "Little Boy in Kurta Pajama", desc: "Handsome little boy in neat traditional Kurta-Pajama." },
      { value: "Little Boy in Punjabi Pagri / Turban", label: "Little Boy in Punjabi Turban", desc: "Cute little boy wearing a mini Punjabi turban or cap." },
      { value: "Little Boy with Toy Car / Truck", label: "Little Boy with Toy Car", desc: "Excited little boy driving a red toy car or monster truck." },
      { value: "Little Boy Riding a Scooter", label: "Little Boy Riding a Scooter", desc: "Active boy riding a kick scooter with a helmet." },
      { value: "Little Boy with a Puppy", label: "Little Boy with a Puppy", desc: "Little boy playing fetch with a cute golden puppy." },
      { value: "Little Boy with a Kitten", label: "Little Boy with a Kitten", desc: "Little boy feeding milk to a cute tiny kitten." },
      { value: "Little Boy Soccer Player", label: "Little Boy Soccer Player", desc: "Sporty boy kicking a soccer ball in a jersey." },
      { value: "Little Boy Pilot / Aviator", label: "Little Boy Pilot", desc: "Cute boy wearing aviator goggles and a bomber jacket." },
      { value: "Little Boy Astronaut", label: "Little Boy Astronaut", desc: "Little boy wearing a space helmet and rocket backpack." },
      { value: "Little Boy Detective", label: "Little Boy Detective", desc: "Curious boy with a magnifying glass inspecting footprints." },
      { value: "Little Boy Firefighter", label: "Little Boy Firefighter", desc: "Little boy in a red firefighter hat holding a hose." },
      { value: "Little Boy Dinosaur Fan", label: "Little Boy Dinosaur Fan", desc: "Little boy in a dino hoodie holding toy T-Rex." },
      { value: "Cute Twin Boys", label: "Cute Twin Boys", desc: "Matching cute twin little boys playing together." },
      { value: "Little Boy Village Hero", label: "Little Boy Village Hero", desc: "Playful boy running through green village fields with a windmill toy." },
      { value: "Smiling Little Boy", label: "Smiling Little Boy", desc: "Bright smiling little boy." },
      { value: "Happy Little Boy", label: "Happy Little Boy", desc: "Joyful and cheerful little boy." },
      { value: "Curious Little Boy", label: "Curious Little Boy", desc: "Inquisitive little boy exploring." },
      { value: "Shy Little Boy", label: "Shy Little Boy", desc: "Quiet and bashful little boy." },
      { value: "Playful Little Boy", label: "Playful Little Boy", desc: "Fun-loving playful boy." },
      { value: "Energetic Little Boy", label: "Energetic Little Boy", desc: "High energy active little boy." },
      { value: "Laughing Little Boy", label: "Laughing Little Boy", desc: "Giggling and laughing little boy." },
      { value: "Sleeping Little Boy", label: "Sleeping Little Boy", desc: "Peacefully sleeping little boy." },
      { value: "Reading Little Boy", label: "Reading Little Boy", desc: "Little boy reading a comic or book." },
      { value: "Drawing Little Boy", label: "Drawing Little Boy", desc: "Little boy sketching with markers." },
      { value: "Singing Little Boy", label: "Singing Little Boy", desc: "Little boy singing enthusiastically." },
      { value: "Dancing Little Boy", label: "Dancing Little Boy", desc: "Little boy doing funny dance moves." },
      { value: "Little Boy with Glasses", label: "Little Boy with Glasses", desc: "Cute little boy with round glasses." },
      { value: "Little Boy with Curly Hair", label: "Little Boy with Curly Hair", desc: "Little boy with curly mop hair." },
      { value: "Little Boy with Spiky Hair", label: "Little Boy with Spiky Hair", desc: "Cool spiky hair style." },
      { value: "Little Boy in School Uniform", label: "Little Boy in School Uniform", desc: "Neat school uniform look." },
      { value: "Little Boy in Superhero Costume", label: "Little Boy in Superhero Costume", desc: "Fun superhero cape & costume." },
      { value: "Little Boy in Sports Outfit", label: "Little Boy in Sports Outfit", desc: "Jersey, shorts, and sneakers." },
      { value: "Little Boy in Raincoat", label: "Little Boy in Raincoat", desc: "Raincoat and puddle jumping boots." },
      { value: "Little Boy in Winter Clothes", label: "Little Boy in Winter Clothes", desc: "Heavy winter jacket and scarf." },
      { value: "Little Boy in Pajamas", label: "Little Boy in Pajamas", desc: "Pajama set with car prints." },
      { value: "Little Boy Wearing a Backpack", label: "Little Boy Wearing a Backpack", desc: "School bag on back." },
      { value: "Little Boy Holding a Toy", label: "Little Boy Holding a Toy", desc: "Holding a toy race car." },
      { value: "Little Boy Holding a Balloon", label: "Little Boy Holding a Balloon", desc: "Holding a big red balloon." },
      { value: "Little Boy Holding a Teddy Bear", label: "Little Boy Holding a Teddy Bear", desc: "Holding a soft teddy bear." },
      { value: "Little Boy Eating Fruit", label: "Little Boy Eating Fruit", desc: "Eating juicy watermelon or apple." },
      { value: "Little Boy Brushing Teeth", label: "Little Boy Brushing Teeth", desc: "Brushing teeth cheerfully." },
      { value: "Toddler Boy", label: "Toddler Boy", desc: "Adorable toddler boy (1.5-3 yrs)." },
      { value: "Preschool Boy", label: "Preschool Boy", desc: "Preschool boy (3-5 yrs)." },
      { value: "Kindergarten Boy", label: "Kindergarten Boy", desc: "Kindergarten boy (5-6 yrs)." },
      { value: "School-Age Boy", label: "School-Age Boy", desc: "School age boy (6-9 yrs)." },
      { value: "Confident Little Boy", label: "Confident Little Boy", desc: "Proud, brave, and cheerful." },
      { value: "Adventurous Little Boy", label: "Adventurous Little Boy", desc: "Bold adventurer exploring." },
      { value: "Thoughtful Little Boy", label: "Thoughtful Little Boy", desc: "Observant and thoughtful kid." },
      { value: "Funny Little Boy", label: "Funny Little Boy", desc: "Comedic expressions and laughs." },
      { value: "Creative Little Boy", label: "Creative Little Boy", desc: "Imaginative builder and creator." },
      { value: "Little Boy Scientist", label: "Little Boy Scientist", desc: "Mini scientist with beaker & glasses." },
      { value: "Little Boy Chef", label: "Little Boy Chef", desc: "Mini chef with wooden spoon & hat." },
      { value: "Little Boy Artist", label: "Little Boy Artist", desc: "Mini painter with easel." },
      { value: "Little Boy Explorer", label: "Little Boy Explorer", desc: "Little adventurer with safari hat." },
      { value: "Little Boy Gardener", label: "Little Boy Gardener", desc: "Watering plants in the garden." },
      { value: "Little Boy Musician", label: "Little Boy Musician", desc: "Playing toy drums or guitar." },
    ],
  },
  {
    category: "Multiple & Duo Characters",
    options: [
      { value: "Two Little Girls", label: "Two Little Girls", desc: "Duo of two adorable little girls." },
      { value: "Two Little Boys", label: "Two Little Boys", desc: "Duo of two friendly little boys." },
      { value: "One Girl & One Boy", label: "One Girl & One Boy", desc: "Classic boy and girl duo." },
      { value: "Brother & Sister", label: "Brother & Sister", desc: "Heartwarming sibling brother and sister team." },
      { value: "Two Kids (Siblings)", label: "Two Kids (Siblings)", desc: "Two sibling kids playing together." },
      { value: "Two Kids (Friends)", label: "Two Kids (Friends)", desc: "Two best friend kids having fun." },
      { value: "Two Boy Friends (Best Friends)", label: "Two Boy Friends (Best Friends)", desc: "Two best buddy boys laughing, joking, and hanging out together." },
      { value: "Two Girl Friends (Best Friends)", label: "Two Girl Friends (Best Friends)", desc: "Two best girl friends sharing secrets and having fun." },
      { value: "Husband & Wife (Miya Biwi)", label: "Husband & Wife (Miya Biwi) ❤️", desc: "A loving husband and wife couple in everyday Desi home scenarios." },
      { value: "Twins", label: "Twins", desc: "Adorable twin kids." },
      { value: "Three Happy Kids", label: "Three Happy Kids", desc: "Trio group of three happy children." },
      { value: "Best Friends", label: "Best Friends", desc: "Inseparable best friends." },
      { value: "Happy Family", label: "Happy Family", desc: "Parents and children together." },
      { value: "Child & Mom", label: "Child & Mom", desc: "Child with loving mother." },
      { value: "Child & Dad", label: "Child & Dad", desc: "Child with loving father." },
      { value: "Child & Shopkeeper", label: "Child & Shopkeeper", desc: "Child interacting with a friendly shopkeeper." },
      { value: "Boy + Shopkeeper", label: "Boy + Shopkeeper", desc: "Boy buying treats from a shopkeeper." },
      { value: "Girl + Shopkeeper", label: "Girl + Shopkeeper", desc: "Girl visiting a toy or sweet shopkeeper." },
      { value: "Child & Doctor", label: "Child & Doctor", desc: "Child visiting a friendly doctor." },
      { value: "Child & Teacher", label: "Child & Teacher", desc: "Child with school teacher." },
      { value: "Child & Friendly Robot", label: "Child & Friendly Robot", desc: "Child with a cute companion robot." },
    ],
  },
  {
    category: "Predefined Role & Adult Combinations",
    options: [
      { value: "Boy + Shopkeeper", label: "Boy + Shopkeeper", desc: "Little boy interacting with a friendly shopkeeper." },
      { value: "Girl + Shopkeeper", label: "Girl + Shopkeeper", desc: "Little girl interacting with a friendly shopkeeper." },
      { value: "Boy + Mother", label: "Boy + Mother", desc: "Little boy with his loving mother." },
      { value: "Girl + Mother", label: "Girl + Mother", desc: "Little girl with her loving mother." },
      { value: "Boy + Father", label: "Boy + Father", desc: "Little boy with his caring father." },
      { value: "Girl + Father", label: "Girl + Father", desc: "Little girl with her caring father." },
      { value: "Boy + Teacher", label: "Boy + Teacher", desc: "Little boy learning from a helpful teacher." },
      { value: "Girl + Teacher", label: "Girl + Teacher", desc: "Little girl learning from a helpful teacher." },
      { value: "Boy + Police Officer", label: "Boy + Police Officer", desc: "Little boy talking to a friendly police officer." },
      { value: "Girl + Police Officer", label: "Girl + Police Officer", desc: "Little girl talking to a friendly police officer." },
      { value: "Boy + Doctor", label: "Boy + Doctor", desc: "Little boy visiting a gentle doctor." },
      { value: "Girl + Doctor", label: "Girl + Doctor", desc: "Little girl visiting a gentle doctor." },
      { value: "Boy + Robot", label: "Boy + Robot", desc: "Little boy playing with a futuristic friendly robot." },
      { value: "Girl + Robot", label: "Girl + Robot", desc: "Little girl playing with a futuristic friendly robot." },
      { value: "Boy + Friend", label: "Boy + Friend", desc: "Little boy playing with his best friend." },
      { value: "Girl + Friend", label: "Girl + Friend", desc: "Little girl playing with her best friend." },
    ],
  },
  createSingerWithAnimalGroup("Boy", "Boy – Singer with Animal", SINGER_ANIMAL_DEFS),
  createSingerWithAnimalGroup("Girl", "Girl – Singer with Animal", SINGER_ANIMAL_DEFS),
  {
    category: "Singers, Qawwals & Musical Performers",
    options: [
      { value: "Boy & Girl Singer Duet", label: "Boy & Girl Singer Duet", desc: "Boy singer and girl singer performing a duet together with dual mics on stage." },
      { value: "Brother & Sister Singer Duet", label: "Brother & Sister Singer Duet", desc: "Heartwarming brother & sister duo singing a duet performance." },
      { value: "Boy & Girl Qawwal Duo", label: "Boy & Girl Qawwal Duo", desc: "Boy lead Qawwal and girl lead Qawwal singing Sufi Qawwali together." },
      { value: "Boy & Girl Shayar Duo", label: "Boy & Girl Shayar Duo", desc: "Boy Shayar and girl Shayar reciting Shayari poetry back and forth in a Mushaira." },
      { value: "Boy & Girl Folk Singers", label: "Boy & Girl Folk Singers", desc: "Boy and girl singing traditional Desi Folk songs together with Dhol & Tumbi." },
      { value: "Child Folk Singer (Desi Folk)", label: "Child Folk Singer (Desi Folk)", desc: "Cute child singing traditional Folk songs with Ektara, Tumbi or Chimta." },
      { value: "Punjabi Folk Singer (Jugni & Tappa)", label: "Punjabi Folk Singer (Jugni & Tappa)", desc: "Energetic Punjabi Folk singer performing Jugni & Tappa with Dhol beats." },
      { value: "Sindhi / Balochi Folk Singer", label: "Sindhi / Balochi Folk Singer", desc: "Soulful Folk singer performing traditional Sindhi/Balochi heritage tunes." },
      { value: "Pashtun Folk Singer (with Rubab)", label: "Pashtun Folk Singer (with Rubab)", desc: "Pashtun singer reciting traditional Folk melodies backed by Rubab." },
      { value: "Rajasthani Folk Singer", label: "Rajasthani Folk Singer", desc: "Traditional Rajasthani Folk singer performing in colorful attire with Khartal." },
      { value: "Boy Qawwal (Lead Singer)", label: "Boy Qawwal (Lead Singer)", desc: "Young boy in Kurta-Pajama as lead Sufi Qawwali singer clapping & singing." },
      { value: "Girl Qawwal (Lead Singer)", label: "Girl Qawwal (Lead Singer)", desc: "Young girl lead Qawwali singer performing soulful melodies." },
      { value: "Boy Qawwali Group (Qawwal Party)", label: "Boy Qawwali Group (Qawwal Party)", desc: "Group of young boys sitting on carpet with Harmonium & Dholak performing Qawwali." },
      { value: "Child Qawwal & Harmonium Player", label: "Child Qawwal & Harmonium Player", desc: "Child singing Qawwali while playing Harmonium." },
      { value: "Child Singer (Kid Vocalist)", label: "Child Singer (Kid Vocalist)", desc: "Cute child performing with a microphone on stage." },
      { value: "Boy Singer & Performer", label: "Boy Singer & Performer", desc: "Energetic boy singer with wireless mic and musical stage lights." },
      { value: "Girl Singer & Performer", label: "Girl Singer & Performer", desc: "Cute girl singer performing a sweet melody." },
      { value: "Child & Professional Singer", label: "Child & Professional Singer", desc: "Child singing alongside a famous professional singer." },
      { value: "Child & Singer Duo", label: "Child & Singer Duo", desc: "Child and singer performing a duet performance." },
      { value: "Child Naat Khawan / Nasheed Singer", label: "Child Naat Khawan / Nasheed Singer", desc: "Child wearing traditional cap reciting beautiful Naat/Nasheed." },
      { value: "Child Shayar (Poet) & Singer Duo", label: "Child Shayar (Poet) & Singer Duo", desc: "Child reciting Shayari poetry backed by a melodic Singer." },
      { value: "Kids Musical Band", label: "Kids Musical Band", desc: "Group of kids with mic, drums, guitar, and keyboard." },
      { value: "Street Singer Kid", label: "Street Singer Kid", desc: "Talented street kid singer performing in a bustling market." },
      { value: "Child Classical Singer", label: "Child Classical Singer", desc: "Child singing classical Raga melodies with Harmonium." },
    ],
  },
];

// 5. CHARACTERS PER SCENE OPTIONS
const CHARACTERS_PER_SCENE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Characters Count Per Scene",
    options: [
      { value: "1 Character", label: "1 Character", desc: "Single character focus in every scene." },
      { value: "2 Characters", label: "2 Characters", desc: "Two characters (duo interaction - Recommended)." },
      { value: "3 Characters", label: "3 Characters", desc: "Three characters in the scene." },
      { value: "4 Characters", label: "4 Characters", desc: "Four characters / group family scene." },
      { value: "Custom", label: "Custom", desc: "Specify custom character count or breakdown." },
    ],
  },
];

// 6. NATIONALITY / CULTURE OPTIONS
const KIDS_NATIONALITY_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Pakistani Cultural Aesthetics",
    options: [
      { value: "Pakistani (General / Desi)", label: "Pakistani (General)", desc: "Traditional Pakistani aesthetic with Shalwar Kameez and cultural charm." },
      { value: "Pakistani Punjabi", label: "Pakistani Punjabi (پنجابی)", desc: "Vibrant Punjabi Pind culture, colorful Phulkari, and energetic warmth." },
      { value: "Pakistani Pashtun / Pathan", label: "Pakistani Pashtun / Pathan (پشتون)", desc: "Pashtun cultural attire, traditional Pakol, and hospitality vibes." },
      { value: "Pakistani Sindhi", label: "Pakistani Sindhi (سندھی)", desc: "Rich Sindhi Ajrak patterns, Ralli embroidery, and Sindhi cap." },
      { value: "Pakistani Balochi", label: "Pakistani Balochi (بلوچی)", desc: "Traditional Balochi heavy embroidered dresses and turban heritage." },
      { value: "Pakistani Muhajir / Urdu Speaking", label: "Pakistani Urdu Speaking (اردو)", desc: "Classic urban Pakistani cultural attire with elegant Urdu etiquette." },
      { value: "Pakistani Kashmiri", label: "Pakistani Kashmiri (کشمیری)", desc: "Kashmiri Pheran, wooden craft aesthetic, and mountain charm." },
    ],
  },
  {
    category: "Indian & Sikh Cultural Aesthetics",
    options: [
      { value: "Indian Punjabi Sikh", label: "Indian Punjabi Sikh (ਪੰਜਾਬੀ ਸਿੱਖ)", desc: "Traditional Sikh attire, colorful Pagri / Turban, and Punjabi cultural pride." },
      { value: "Indian Punjabi", label: "Indian Punjabi (ਪੰਜਾਬੀ)", desc: "Vibrant Punjabi bhangra outfits, bright suits, and energetic Desi style." },
      { value: "Indian (General / Desi)", label: "Indian (General)", desc: "Classic Indian cultural representation with colorful festive clothing." },
      { value: "Indian South Indian", label: "South Indian (Tamil / Telugu / Malayalam / Kannada)", desc: "Traditional Veshti, Kanjeevaram silk, and South Indian heritage." },
      { value: "Indian North Indian / Hindi Heartband", label: "North Indian (Hindi Belt)", desc: "Traditional Kurta-Pajama, Ghagra, and festive North Indian aesthetic." },
      { value: "Indian Bengali", label: "Indian Bengali (বাংলা)", desc: "Traditional Bengali Kurta, Panjabi, and cultural artistic charm." },
      { value: "Indian Gujarati / Rajasthani", label: "Indian Gujarati / Rajasthani", desc: "Colorful Bandhani, mirror-work Bandhej outfits, and festive vibes." },
    ],
  },
  {
    category: "Other Global Cultures",
    options: [
      { value: "Bangladeshi / Bengali", label: "Bangladeshi (বাংলাদেশী)", desc: "Traditional Bangladeshi attire, Lungi, Panjabi, and rivers aesthetic." },
      { value: "Middle Eastern / Arab", label: "Middle Eastern / Arab (عربي)", desc: "Middle Eastern traditional Kandura, Thobe, and desert heritage." },
      { value: "Turkish / Central Asian", label: "Turkish & Central Asian", desc: "Eurasian cultural attire, Ottoman heritage, and vibrant embroidery." },
      { value: "American / Western", label: "American / Western", desc: "Modern Western casual clothing, denim, and international style." },
      { value: "East Asian (Japanese/Korean/Chinese)", label: "East Asian (Japanese/Korean/Chinese)", desc: "East Asian cultural representation with cute modern or traditional elements." },
      { value: "African", label: "African Culture", desc: "Vibrant Dashiki, Kitenge patterns, and rich African cultural heritage." },
      { value: "European", label: "European Culture", desc: "Classic European countryside or urban aesthetic." },
      { value: "Latin American", label: "Latin American Culture", desc: "Colorful Latin American traditional garments and joyful spirit." },
      { value: "Global / Any", label: "Global / Any Culture", desc: "Flexible universal representation adapted automatically." },
    ],
  },
];

const MUSIC_TYPE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Default Soundscape",
    options: [
      { value: "None", label: "None (Default)", desc: "No background music specified. Pure ambient dialogue & sound effects." },
    ],
  },
  {
    category: "Punjabi Folk & Cultural Rhythms",
    options: [
      { value: "Punjabi Tappa & Dholak", label: "Punjabi Tappa & Dholak", desc: "Fast-paced rhythmic Punjabi Tappa couplets with Dholak & Chimta." },
      { value: "Punjabi Jugni Folk Beats", label: "Punjabi Jugni Folk Beats", desc: "High-energy traditional Punjabi Jugni folk rhythm with Tumbi." },
      { value: "Punjabi Boliyan & Giddha", label: "Punjabi Boliyan & Giddha", desc: "Lively Giddha clapping, Boliyan chants, and festive folk beats." },
      { value: "Punjabi Mahiya & Dhola", label: "Punjabi Mahiya & Dhola", desc: "Soulful Punjabi Mahiya & Dhola acoustic folk melodies." },
      { value: "Punjabi Mirza & Heer Legends", label: "Punjabi Mirza & Heer Legends", desc: "Emotional storytelling ballads with Sarangi & Tumbi." },
      { value: "Punjabi Jhumar & Luddi", label: "Punjabi Jhumar & Luddi", desc: "Joyful festive Punjabi Jhumar & Luddi dance rhythms." },
      { value: "Punjabi Beats & Bhangra", label: "Punjabi Beats & Bhangra", desc: "Energetic Dhol beats, Tumbi, and vibrant Punjabi Bhangra." },
    ],
  },
  {
    category: "Sufi, Spiritual & Regional Desi Folk",
    options: [
      { value: "Sufi Qawwali & Harmonium", label: "Sufi Qawwali & Harmonium", desc: "Soulful Qawwali clapping, Harmonium, and mystical Sufi melodies." },
      { value: "Sufi Instrumental Flute & Rubab", label: "Sufi Instrumental Flute & Rubab", desc: "Meditative bamboo flute, Rubab, and gentle ambient drone." },
      { value: "Dhamal & Sufi Dhol", label: "Dhamal & Sufi Dhol", desc: "Spiritual ecstasy Dhamal beats with heavy Sufi Dhol & brass bells." },
      { value: "Pashtun Rubab & Attan Beats", label: "Pashtun Rubab & Attan Beats", desc: "Melodic Pashto Rubab paired with traditional Attan drum rhythm." },
      { value: "Sindhi Ajrak & Alghoza", label: "Sindhi Ajrak & Alghoza", desc: "Authentic Sindhi Alghoza double flute and Matka percussion." },
      { value: "Balochi Chhap & Tamboor", label: "Balochi Chhap & Tamboor", desc: "Rhythmic Balochi Chhap clapping and Tamboor folk instrument." },
      { value: "Kashmiri Rouf & Rabab", label: "Kashmiri Rouf & Rabab", desc: "Gentle Kashmiri Rouf folk rhythm with Rabab & Santoor." },
      { value: "Rajasthani Manganiyar Folk", label: "Rajasthani Manganiyar Folk", desc: "Soulful Manganiyar folk vocals, Khartal, and Kamaicha." },
      { value: "Bengali Baul & Ektara", label: "Bengali Baul & Ektara", desc: "Philosophical Bengali Baul folk song with Ektara & Dotara." },
      { value: "Desi Classical Sitar & Tabla", label: "Desi Classical Sitar & Tabla", desc: "Traditional Indian classical Sitar, Tabla, Harmonium, and Ragas." },
      { value: "Nasheed / Vocal Only", label: "Nasheed / Vocal Only", desc: "Harmonious vocal-only a cappella background melodies without instruments." },
    ],
  },
  {
    category: "Bollywood & Commercial Desi",
    options: [
      { value: "Bollywood Masala & Filmi", label: "Bollywood Masala & Filmi", desc: "Upbeat cinematic Bollywood dance rhythms and brass fanfares." },
      { value: "Desi Hip-Hop & Trap", label: "Desi Hip-Hop & Trap", desc: "Heavy bass 808s blended with Desi ethnic synth melodies." },
    ],
  },
  {
    category: "Global & Popular Music Genres",
    options: [
      { value: "Pop & Upbeat Dance", label: "Pop & Upbeat Dance", desc: "Catchy modern synth-pop and energetic radio hit melodies." },
      { value: "Hip-Hop & Urban Beats", label: "Hip-Hop & Urban Beats", desc: "Rhythmic beat drops, funky basslines, and boom-bap drums." },
      { value: "Rock & Electric Guitars", label: "Rock & Electric Guitars", desc: "High-energy electric guitar riffs, bass, and punchy acoustic drums." },
      { value: "EDM & Electronic Dance", label: "EDM & Electronic Dance", desc: "High-bpm electronic synth drops, festival beats, and energetic bass." },
      { value: "Lo-Fi Chill & Chillhop", label: "Lo-Fi Chill & Chillhop", desc: "Relaxing lofi beats, vinyl crackle, and cozy acoustic piano chords." },
      { value: "Smooth Jazz & Lounge", label: "Smooth Jazz & Lounge", desc: "Cool saxophone, upright bass, and relaxed cafe jazz piano." },
      { value: "Orchestral & Grand Symphony", label: "Orchestral & Grand Symphony", desc: "Full symphonic strings, brass fanfares, and epic cinematic timpani." },
      { value: "Cinematic Epic & Dramatic", label: "Cinematic Epic & Dramatic", desc: "Suspenseful movie trailer strings, brass swells, and action percussion." },
      { value: "Kids Nursery Rhymes", label: "Kids Nursery Rhymes", desc: "Playful xylophone, cute bells, and joyful children's melody tunes." },
      { value: "Funny Comedy Sound Effects", label: "Funny Comedy Sound Effects", desc: "Playful cartoon boings, slide whistles, and comical kazoo tunes." },
      { value: "Acoustic Guitar & Whistling", label: "Acoustic Guitar & Whistling", desc: "Warm strummed acoustic guitar with friendly whistling melody." },
    ],
  },
];

const SERIOUS_DIALOGUE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Default Tone",
    options: [
      { value: "None", label: "None (Default)", desc: "Use normal dialogue style (humorous, casual, or standard)." },
    ],
  },
  {
    category: "Emotional & Heartfelt",
    options: [
      { value: "Emotional", label: "Emotional", desc: "Heartfelt, touching, and deeply emotional dialogue." },
      { value: "Sad", label: "Sad", desc: "Emotional, reflective, and sorrowful conversation." },
      { value: "Heartbroken", label: "Heartbroken", desc: "Deep emotional pain, betrayal, or sense of loss." },
    ],
  },
  {
    category: "Motivational & Uplifting",
    options: [
      { value: "Motivational", label: "Motivational", desc: "Inspiring, confidence-building, and uplifting speech." },
      { value: "Inspirational", label: "Inspirational", desc: "Positive messages encouraging hope and perseverance." },
      { value: "Self-Confidence", label: "Self-Confidence", desc: "Bold, fearless, and empowering statements." },
      { value: "Success Mindset", label: "Success Mindset", desc: "Focused on ambition, discipline, and achievement." },
    ],
  },
  {
    category: "Moral & Philosophical",
    options: [
      { value: "Life Lesson", label: "Life Lesson", desc: "Dialogue with a meaningful moral or life lesson." },
      { value: "Wise", label: "Wise", desc: "Mature advice with thoughtful and philosophical insights." },
      { value: "Reality Check", label: "Reality Check", desc: "Honest, direct, and eye-opening dialogue." },
      { value: "Islamic Reminder", label: "Islamic Reminder", desc: "Respectful Islamic advice and reminders with an appropriate tone." },
    ],
  },
  {
    category: "Dramatic & Intense",
    options: [
      { value: "Dramatic", label: "Dramatic", desc: "Intense, cinematic, and suspenseful dialogue." },
      { value: "Angry", label: "Angry", desc: "Strong, frustrated, and powerful expressions." },
      { value: "Respectful", label: "Respectful", desc: "Calm, polite, and dignified conversation." },
      { value: "Patriotic", label: "Patriotic", desc: "Dialogue expressing love, pride, and dedication to the country." },
    ],
  },
  {
    category: "Storytelling & Speech Formats",
    options: [
      { value: "Narration Style", label: "Narration Style", desc: "A storytelling voiceover rather than direct conversation." },
      { value: "Speech Style", label: "Speech Style", desc: "Written like a public speech or motivational address." },
      { value: "Monologue", label: "Monologue", desc: "The character speaks continuously to themselves or the audience." },
      { value: "Poetic/Shayari", label: "Poetic/Shayari", desc: "Dialogue written with poetic expressions and shayari." },
    ],
  },
];

const AI_MODEL_OPTIONS = [
  { id: "claude-sonnet-4-6", label: "Claude 4.6 Sonnet (Best Quality)", badge: "Best Quality" },
  { id: "claude-sonnet-4-5-20250929", label: "Claude 4.5 Sonnet (Balanced)", badge: "Balanced" },
  { id: "claude-haiku-4-5-20251001", label: "Claude 4.5 Haiku (Fastest)", badge: "Fastest" },
  { id: "claude-opus-4-6", label: "Claude 4.6 Opus (Max Power)", badge: "Max Power" },
];

const ITEMS_PER_PAGE = 10;

interface SavedIdea {
  id: string;
  text: string;
  category: CategoryId;
  language: string;
  visualStyle: string;
  createdAt: string;
  isFavorite?: boolean;
  videoFileName?: string;
  aiModel?: string;
  customDialogue?: string;
  musicType?: string;
  seriousDialogueStyle?: string;
  socialContent?: {
    title: string;
    shortsTitle?: string;
    reelsTitle?: string;
    tiktokTitle?: string;
    description?: string;
    hashtags: string;
    trendingTags?: string;
  };
}

function getIdeaDialogue(idea: SavedIdea): string {
  if (idea.customDialogue && idea.customDialogue.trim()) {
    return idea.customDialogue.trim();
  }
  const text = idea.text || "";
  const match = text.match(/(?:Dialogue|Spoken Dialogue|Audio Dialogue|Script|Spoken Line|Urdu Dialogue|Punjabi Dialogue):\s*([^\n]+)/i);
  if (match && match[1]) {
    return match[1].replace(/^["']|["']$/g, "").trim();
  }
  const quoteMatches = text.match(/"([^"]+)"/g);
  if (quoteMatches && quoteMatches.length > 0) {
    return quoteMatches.map(q => q.replace(/"/g, "")).join(" | ");
  }
  return `Voiceover / Dialogue: "${idea.text.slice(0, 120)}..."`;
}

function getIdeaDescription(idea: SavedIdea): string {
  if (idea.socialContent?.description && idea.socialContent.description.trim()) {
    return idea.socialContent.description.trim();
  }
  return `Watch this viral ${CATEGORIES[idea.category]?.name || idea.category} 3D video concept! ${idea.text.slice(0, 160)}...`;
}

function getIdeaHashtags(idea: SavedIdea): string {
  if (idea.socialContent?.hashtags && idea.socialContent.hashtags.trim()) {
    return idea.socialContent.hashtags.trim();
  }
  const cleanCat = idea.category.replace(/[^a-zA-Z]/g, "");
  return `#${cleanCat} #3DAnimation #KidsVideo #Shorts #ViralAnimation`;
}

function getIdeaTitle(idea: SavedIdea): string {
  if (idea.socialContent?.title && idea.socialContent.title.trim()) {
    return idea.socialContent.title.trim();
  }
  const cleanCategory = CATEGORIES[idea.category]?.name || idea.category;
  return `${cleanCategory} - Fun 3D Animated Short`;
}

function getIdeaShortsTitle(idea: SavedIdea): string {
  if (idea.socialContent?.shortsTitle && idea.socialContent.shortsTitle.trim()) {
    return idea.socialContent.shortsTitle.trim();
  }
  return `Wait for the end! 😱🔥 ${getIdeaTitle(idea)} #Shorts`;
}

function getIdeaReelsTitle(idea: SavedIdea): string {
  if (idea.socialContent?.reelsTitle && idea.socialContent.reelsTitle.trim()) {
    return idea.socialContent.reelsTitle.trim();
  }
  return `Aapka Favourite Part Kaunsa Hai? 🤣👇 ${getIdeaTitle(idea)}`;
}

function getIdeaTikTokTitle(idea: SavedIdea): string {
  if (idea.socialContent?.tiktokTitle && idea.socialContent.tiktokTitle.trim()) {
    return idea.socialContent.tiktokTitle.trim();
  }
  return `When this happens... 😭✨ ${getIdeaTitle(idea)} #Viral`;
}

function getIdeaTrendingTags(idea: SavedIdea): string {
  if (idea.socialContent?.trendingTags && idea.socialContent.trendingTags.trim()) {
    return idea.socialContent.trendingTags.trim();
  }
  const cleanCat = idea.category.replace(/[^a-zA-Z]/g, "");
  return `#TrendingReels #ForyouPage #ShortsViral #${cleanCat} #ViralVideo #RelatableHumor`;
}

function cleanPromptText(text: string): string {
  if (!text) return "";
  return text.replace(/^\[FORMAT:[^\]]+\]\s*/gi, "").trim();
}

function getPrompt916(text: string): string {
  const cleaned = cleanPromptText(text);
  return `[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]\n\n${cleaned}`;
}

function getPrompt169(text: string): string {
  const cleaned = cleanPromptText(text);
  return `[FORMAT: 16:9 Widescreen Aspect Ratio.]\n\n${cleaned}`;
}

interface CustomSelectProps {
  label: string;
  icon?: string;
  value: string;
  onChange: (value: string) => void;
  groups: OptionGroupWithDesc[];
  badgeTitle?: string;
}

function CustomSelect({ label, icon, value, onChange, groups }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when selector modal is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Only auto-focus on non-touch devices (desktop) to avoid:
      // 1. Android Chrome address bar sliding in (white location bar)
      // 2. Android autofill / credit card suggestions bar appearing
      const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
      if (!isTouchDevice) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    } else {
      document.body.style.overflow = "";
      setSearchQuery("");
      setSelectedCategoryFilter("ALL");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Android hardware BACK BUTTON support:
  // Push a dummy history state when modal opens so the Android back button
  // triggers popstate (instead of navigating away), which we use to close modal.
  useEffect(() => {
    if (!isOpen) return;
    let isPushed = true;
    history.pushState({ customSelectOpen: true }, "");

    const handlePopState = () => {
      isPushed = false;
      setIsOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (isPushed && history.state?.customSelectOpen) {
        history.back();
      }
    };
  }, [isOpen]);

  let selectedOption: OptionWithDesc | undefined;
  for (const g of groups) {
    const found = g.options.find((o) => o.value === value);
    if (found) {
      selectedOption = found;
      break;
    }
  }

  const selectedLabel = selectedOption ? selectedOption.label : value;
  const selectedDesc = selectedOption ? selectedOption.desc : "";

  // Filter options by search query & category filter
  const filteredGroups = groups
    .map((group) => {
      if (selectedCategoryFilter !== "ALL" && group.category !== selectedCategoryFilter) {
        return { ...group, options: [] };
      }
      const filteredOptions = group.options.filter((opt) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return (
          opt.label.toLowerCase().includes(q) ||
          opt.value.toLowerCase().includes(q) ||
          (opt.desc && opt.desc.toLowerCase().includes(q))
        );
      });
      return { ...group, options: filteredOptions };
    })
    .filter((group) => group.options.length > 0);

  const totalFilteredCount = filteredGroups.reduce((acc, g) => acc + g.options.length, 0);

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[11px] sm:text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          {icon && <span>{icon}</span>}
          <span>{label}</span>
        </span>
      </label>

      {/* Main Touch-Friendly Field Trigger Card */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 text-left transition-all shadow-md touch-manipulation active:scale-[0.98] group flex flex-col justify-between gap-1 min-h-[58px]"
      >
        <div className="flex items-center justify-between gap-2 w-full">
          <span className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
            {selectedLabel}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300">
              Change
            </span>
            <ChevronDown className="w-4 h-4 text-indigo-400 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </div>
        {selectedDesc && (
          <p className="text-[11px] text-slate-400 truncate w-full font-normal">
            {selectedDesc}
          </p>
        )}
      </button>

      {/* FULL-SCREEN / BOTTOM-SHEET TOUCH SELECTOR MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex flex-col justify-end sm:justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
          {/* Backdrop Click */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />

          <div
            ref={containerRef}
            className="w-full sm:max-w-2xl sm:mx-auto h-[90vh] sm:h-[85vh] max-h-[90vh] rounded-t-3xl sm:rounded-3xl bg-[#080b14] border border-indigo-500/40 shadow-2xl flex flex-col overflow-hidden relative font-sans"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-indigo-500/20 bg-[#0c101d] sticky top-0 z-30 space-y-3">
              {/* Mobile handle */}
              <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto sm:hidden -mt-1 mb-1" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">{icon || "✨"}</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                      Select {label}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-indigo-300/80 font-medium">
                      Current: <span className="text-white font-bold">{selectedLabel}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 sm:p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95 shrink-0"
                  title="Close option selector"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="search"
                  inputMode="search"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${label.toLowerCase()} options...`}
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-black/70 border border-indigo-500/30 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 p-1 text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter Pills (Horizontal Scroll) */}
              {groups.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth touch-pan-x">
                  <button
                    type="button"
                    onClick={() => setSelectedCategoryFilter("ALL")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategoryFilter === "ALL"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                        : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    All ({groups.reduce((acc, g) => acc + g.options.length, 0)})
                  </button>
                  {groups.map((g) => (
                    <button
                      key={g.category}
                      type="button"
                      onClick={() => setSelectedCategoryFilter(g.category)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategoryFilter === g.category
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                          : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                      }`}
                    >
                      {g.category} ({g.options.length})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Scrollable Options Area */}
            <div
              className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-5 overscroll-contain scrollbar-thin scrollbar-thumb-indigo-500/40 pb-36 sm:pb-8 touch-pan-y"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {totalFilteredCount === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400 font-medium space-y-3">
                  <p>No matching options for &quot;{searchQuery}&quot;</p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                filteredGroups.map((group, groupIdx) => (
                  <div key={groupIdx} className="space-y-2.5">
                    <div className="px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-indigo-400 border-b border-indigo-500/20 sticky top-0 bg-[#080b14]/95 backdrop-blur-md z-10 flex items-center justify-between">
                      <span>{group.category}</span>
                      <span className="text-[10px] text-indigo-300/70 font-medium">
                        {group.options.length} options
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {group.options.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              onChange(opt.value);
                              setIsOpen(false);
                            }}
                            className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between cursor-pointer select-none touch-manipulation active:scale-[0.98] ${
                              isSelected
                                ? "bg-gradient-to-r from-indigo-950/90 to-slate-900/90 border-2 border-indigo-500 text-white shadow-xl shadow-indigo-500/20 ring-1 ring-indigo-500/50"
                                : "bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900 text-slate-200"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                                {opt.label}
                              </span>
                              {isSelected && (
                                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                            {opt.desc && (
                              <p className="text-[11px] sm:text-xs text-indigo-200/80 leading-relaxed font-normal mt-1.5">
                                {opt.desc}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface IdeasPageSettings {
  category?: CategoryId;
  language?: string;
  visualStyle?: string;
  videoDuration?: number;
  customDialogue?: string;
  kidsAge?: string;
  kidsLocation?: string;
  kidsHealth?: string;
  kidsVibe?: string;
  characterSetup?: string;
  charactersPerScene?: string;
  customCharactersPerScene?: string;
  kidsNationality?: string;
  carboxBrand?: string;
  carboxColor?: string;
  carboxPackaging?: string;
  carboxBackground?: string;
  customIdea?: string;
  filterCategory?: CategoryId | "ALL" | "FAVORITES";
  searchQuery?: string;
  sortBy?: "NEWEST" | "OLDEST" | "FAVORITES_FIRST";
  currentPage?: number;
  aiModel?: string;
  musicType?: string;
  seriousDialogueStyle?: string;
}

export default function IdeasPage() {
  const { showToast } = useToast();

  const savedIdeasSectionRef = useRef<HTMLDivElement>(null);
  const customIdeaOptimizerRef = useRef<HTMLDivElement>(null);

  // Load saved settings from localStorage on initial render
  const getInitialSettings = (): IdeasPageSettings => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("flow-ideas-page-settings");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Error reading ideas page settings from localStorage", e);
      }
    }
    return {};
  };

  const initialSettings = getInitialSettings();

  const getModelBadgeLabel = (modelId?: string) => {
    if (!modelId || modelId.includes("claude-sonnet-4-6")) return "Claude 4.6 Sonnet";
    if (modelId === "claude-sonnet-4-5-20250929") return "Claude 4.5 Sonnet";
    if (modelId === "claude-haiku-4-5-20251001") return "Claude 4.5 Haiku";
    if (modelId === "claude-opus-4-6") return "Claude 4.6 Opus";
    return "Claude 4.6 Sonnet";
  };

  // Generation controls
  const [category, setCategory] = useState<CategoryId>(initialSettings.category || "FUNNY");
  const [language, setLanguage] = useState(initialSettings.language || "Urdu");
  const [visualStyle, setVisualStyle] = useState(initialSettings.visualStyle || "3D Cartoon Style");
  const [videoDuration, setVideoDuration] = useState<number>(initialSettings.videoDuration || 10);
  const [customDialogue, setCustomDialogue] = useState(initialSettings.customDialogue || "");
  const [isDialogueExpanded, setIsDialogueExpanded] = useState(false);
  const [aiModel, setAiModel] = useState<string>(
    initialSettings.aiModel && ["claude-sonnet-4-6", "claude-sonnet-4-5-20250929", "claude-haiku-4-5-20251001", "claude-opus-4-6"].includes(initialSettings.aiModel)
      ? initialSettings.aiModel
      : "claude-sonnet-4-6"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggestingDialogue, setIsSuggestingDialogue] = useState(false);

  // Saved Dialogues
  interface SavedDialogueItem {
    id: string;
    text: string;
    createdAt: string;
  }

  const [savedDialogues, setSavedDialogues] = useState<SavedDialogueItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("flow-saved-dialogues");
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error("Error reading saved dialogues", e);
      }
    }
    return [];
  });

  const saveDialoguesToStorage = (dialogues: SavedDialogueItem[]) => {
    setSavedDialogues(dialogues);
    if (typeof window !== "undefined") {
      localStorage.setItem("flow-saved-dialogues", JSON.stringify(dialogues));
    }
  };

  // Script & Dialogue Modal State
  const [scriptModalIdea, setScriptModalIdea] = useState<SavedIdea | null>(null);
  const [editedScriptText, setEditedScriptText] = useState("");

  const handleOpenScriptModal = (idea: SavedIdea) => {
    setScriptModalIdea(idea);
    setEditedScriptText(getIdeaDialogue(idea));
  };

  const handleSaveScriptModal = () => {
    if (!scriptModalIdea) return;
    const updated = savedIdeas.map((i) =>
      i.id === scriptModalIdea.id ? { ...i, customDialogue: editedScriptText } : i
    );
    setSavedIdeas(updated);
    showToast("Spoken script / dialogue saved!", "success");
    setScriptModalIdea(null);
  };

  const handleSaveDialogue = () => {
    if (!customDialogue.trim()) {
      showToast("Please enter or generate a dialogue to save first.", "error");
      return;
    }
    const newItem: SavedDialogueItem = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      text: customDialogue.trim(),
      createdAt: new Date().toISOString(),
    };
    saveDialoguesToStorage([newItem, ...savedDialogues]);
    showToast("Spoken dialogue saved for future reuse!", "success");
  };

  const handleDeleteSavedDialogue = (id: string) => {
    const updated = savedDialogues.filter((d) => d.id !== id);
    saveDialoguesToStorage(updated);
    showToast("Deleted saved dialogue.", "info");
  };

  const handleUseSavedDialogue = (text: string) => {
    setCustomDialogue(text);
    showToast("Loaded saved dialogue into input field!", "success");
  };

  const handleSuggestDialogue = async () => {
    if (category === "CARBOX") return;
    setIsSuggestingDialogue(true);
    try {
      const res = await fetch("/api/suggest-dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          language,
          customIdea,
          existingDialogue: customDialogue,
          kidsAge,
          kidsLocation,
          kidsHealth,
          kidsVibe,
          characterSetup,
          charactersPerScene: charactersPerScene === "Custom" ? (customCharactersPerScene || "Custom") : charactersPerScene,
          aiModel,
          seriousDialogueStyle,
        }),
      });
      const data = await res.json();
      if (data.success && data.dialogue) {
        setCustomDialogue(data.dialogue);
        showToast("Generated AI dialogue suggestion!", "success");
      } else {
        throw new Error(data.error || "Failed to suggest dialogue");
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to suggest dialogue", "error");
    } finally {
      setIsSuggestingDialogue(false);
    }
  };
  
  // Cute Kids specific options
  const [kidsAge, setKidsAge] = useState(initialSettings.kidsAge || "Toddler (2-4 yrs)");
  const [kidsLocation, setKidsLocation] = useState(initialSettings.kidsLocation || "Cozy Home Living Room");
  const [kidsHealth, setKidsHealth] = useState(initialSettings.kidsHealth || "Healthy");
  const [kidsVibe, setKidsVibe] = useState(initialSettings.kidsVibe || "Cheerful & Energetic");
  const [characterSetup, setCharacterSetup] = useState(initialSettings.characterSetup || "One Cute Little Girl");
  const [charactersPerScene, setCharactersPerScene] = useState(initialSettings.charactersPerScene || "2 Characters");
  const [customCharactersPerScene, setCustomCharactersPerScene] = useState(initialSettings.customCharactersPerScene || "");
  const [kidsNationality, setKidsNationality] = useState(initialSettings.kidsNationality || "Global / Any");
  const [musicType, setMusicType] = useState<string>(initialSettings.musicType || "None");
  const [seriousDialogueStyle, setSeriousDialogueStyle] = useState<string>(initialSettings.seriousDialogueStyle || "None");

  const applyCuteKidsPreset = (preset: typeof CUTE_KIDS_PRESETS[0]) => {
    setKidsAge(preset.age);
    setKidsLocation(preset.location);
    setKidsHealth(preset.health);
    setKidsVibe(preset.vibe);
    setCharacterSetup(preset.setup);
    setCharactersPerScene(preset.perScene);
    setKidsNationality(preset.nationality);
    if (preset.musicType) setMusicType(preset.musicType);
    if (preset.dialogueStyle) setSeriousDialogueStyle(preset.dialogueStyle);
    showToast(`✅ Applied "${preset.title}" preset!`, "success");
  };
  
  const isRtl = language === "Urdu" || language === "Punjabi";
  
  // Carbox specific options
  const [carboxBrand, setCarboxBrand] = useState(initialSettings.carboxBrand || "Premium BMW");
  const [carboxColor, setCarboxColor] = useState(initialSettings.carboxColor || "Glossy Black");
  const [carboxPackaging, setCarboxPackaging] = useState(initialSettings.carboxPackaging || "Elegant Retail Box");
  const [carboxBackground, setCarboxBackground] = useState(initialSettings.carboxBackground || "Clean White Studio Tabletop");
  
  // Custom Idea Optimization
  const [customIdea, setCustomIdea] = useState(initialSettings.customIdea || "");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedData, setOptimizedData] = useState<{title: string, scenes: {sceneNumber: number, content: string}[]} | null>(null);
  const [activeSceneTab, setActiveSceneTab] = useState(1);

  // Saved ideas
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);

  useEffect(() => {
    fetch("/api/ideas")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSavedIdeas(data.ideas || []);
        }
        setIsLoadingIdeas(false);
      })
      .catch((err) => {
        console.error("Failed to fetch ideas", err);
        setIsLoadingIdeas(false);
      });
  }, []);

  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState<number>(initialSettings.currentPage || 1);
  const [filterCategory, setFilterCategory] = useState<CategoryId | "ALL" | "FAVORITES">(initialSettings.filterCategory || "ALL");
  const [searchQuery, setSearchQuery] = useState<string>(initialSettings.searchQuery || "");
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST" | "FAVORITES_FIRST">(initialSettings.sortBy || "NEWEST");

  // Save all settings to localStorage whenever any setting changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const settings: IdeasPageSettings = {
        category,
        language,
        visualStyle,
        videoDuration,
        customDialogue,
        kidsAge,
        kidsLocation,
        kidsHealth,
        kidsVibe,
        characterSetup,
        charactersPerScene,
        customCharactersPerScene,
        kidsNationality,
        carboxBrand,
        carboxColor,
        carboxPackaging,
        carboxBackground,
        customIdea,
        filterCategory,
        searchQuery,
        sortBy,
        currentPage,
        aiModel,
        musicType,
        seriousDialogueStyle,
      };
      localStorage.setItem("flow-ideas-page-settings", JSON.stringify(settings));
    }
  }, [
    category,
    language,
    visualStyle,
    videoDuration,
    customDialogue,
    kidsAge,
    kidsLocation,
    kidsHealth,
    kidsVibe,
    characterSetup,
    charactersPerScene,
    customCharactersPerScene,
    kidsNationality,
    carboxBrand,
    carboxColor,
    carboxPackaging,
    carboxBackground,
    customIdea,
    filterCategory,
    searchQuery,
    sortBy,
    currentPage,
    aiModel,
    musicType,
    seriousDialogueStyle,
  ]);

  const handleResetSettings = () => {
    setCategory("CUTE_KIDS");
    setLanguage("Urdu");
    setVisualStyle("3D Cartoon Style");
    setVideoDuration(10);
    setCustomDialogue("");
    setKidsAge("Toddler (2-4 yrs)");
    setKidsLocation("Cozy Home Living Room");
    setKidsHealth("Healthy");
    setKidsVibe("Cheerful & Energetic");
    setCharacterSetup("One Cute Little Girl");
    setCharactersPerScene("2 Characters");
    setCustomCharactersPerScene("");
    setKidsNationality("Global / Any");
    setMusicType("None");
    setSeriousDialogueStyle("None");
    setCarboxBrand("Premium BMW");
    setCarboxColor("Glossy Black");
    setCarboxPackaging("Elegant Retail Box");
    setCarboxBackground("Clean White Studio Tabletop");
    setCustomIdea("");
    setFilterCategory("ALL");
    setSearchQuery("");
    setSortBy("NEWEST");
    setCurrentPage(1);
    setAiModel("claude-sonnet-4-6");
    if (typeof window !== "undefined") {
      localStorage.removeItem("flow-ideas-page-settings");
    }
    showToast("Reset search, filters, & options to default!", "info");
  };

  // Copied state tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Editable Filename state
  const [editingFileNameId, setEditingFileNameId] = useState<string | null>(null);
  const [editingFileNameText, setEditingFileNameText] = useState("");
  const [generatingSocialId, setGeneratingSocialId] = useState<string | null>(null);

  const getFallbackFileName = (idea: SavedIdea) => {
    let name = idea.videoFileName ? idea.videoFileName.replace(/\.mp4$/i, "") : "";
    if (name) return name;
    const cleanId = idea.id.slice(-4).toLowerCase();
    if (idea.category === "CARBOX") {
      const words = idea.text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
      const vehicleKey = words.slice(0, 2).join("_") || "vehicle";
      return `carbox_${vehicleKey}_${cleanId}`;
    }
    return `${idea.category.toLowerCase()}_${cleanId}`;
  };

  const handleSaveFileName = async (id: string) => {
    let formatted = editingFileNameText.trim().replace(/\.mp4$/i, "");
    if (!formatted) {
      setEditingFileNameId(null);
      return;
    }
    
    setSavedIdeas((prev) => prev.map((i) =>
      i.id === id ? { ...i, videoFileName: formatted } : i
    ));
    setEditingFileNameId(null);

    try {
      await fetch(`/api/ideas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoFileName: formatted })
      });
      showToast(`Video name saved as "${formatted}"`, "success");
    } catch (e) {
      showToast("Failed to save video name", "error");
    }
  };

  const handleOptimize = async () => {
    if (!customIdea.trim()) {
      showToast("Please enter a custom idea first", "error");
      return;
    }
    setIsOptimizing(true);
    try {
      const res = await fetch("/api/optimize-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawIdea: customIdea, aiModel }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to optimize idea");
      }
      setOptimizedData({ ...data.optimized, modelUsed: aiModel });
      setActiveSceneTab(1);
      showToast("Idea optimized successfully!", "success");
      setTimeout(() => {
        customIdeaOptimizerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (e: any) {
      showToast(e.message || "Failed to optimize idea", "error");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/suggest-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          language,
          visualStyle,
          videoDuration,
          customDialogue,
          kidsAge,
          kidsLocation,
          kidsHealth,
          kidsVibe,
          characterSetup,
          charactersPerScene: charactersPerScene === "Custom" ? (customCharactersPerScene || "Custom") : charactersPerScene,
          kidsNationality,
          carboxBrand,
          carboxColor,
          carboxPackaging,
          carboxBackground,
          aiModel,
          musicType,
          seriousDialogueStyle,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.reason || data.error || "Failed to generate ideas");
      }
      
      const createdIdeas = await Promise.all(data.ideas.map(async (text: string) => {
        const tempId = Date.now().toString() + Math.random().toString(36).slice(2);
        const cleanBrand = (carboxBrand || "car").toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").slice(0, 12);
        const cleanId = tempId.slice(-4);
        const videoFileName = category === "CARBOX" 
          ? `carbox_${cleanBrand}_${cleanId}`
          : `${category.toLowerCase()}_${cleanId}`;
          
        const ideaData = {
          text,
          category,
          language,
          visualStyle,
          videoFileName,
          aiModel: aiModel || "claude-3-7-sonnet-20250219",
          customDialogue: customDialogue && customDialogue.trim() ? customDialogue.trim() : undefined,
          musicType: musicType !== "None" ? musicType : undefined,
          seriousDialogueStyle: seriousDialogueStyle !== "None" ? seriousDialogueStyle : undefined,
        };
        
        const res = await fetch("/api/ideas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ideaData),
        });
        const ideaRes = await res.json();
        return ideaRes.idea;
      }));
      
      setSavedIdeas((prev) => [...createdIdeas, ...prev]);
      setFilterCategory("ALL");
      setCurrentPage(1);
      
      showToast(`Generated and saved ${data.ideas.length} idea!`, "success");
      setTimeout(() => {
        savedIdeasSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (e: any) {
      showToast(e.message || "Failed to generate ideas", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteIdea = async (id: string) => {
    setSavedIdeas((prev) => prev.filter((i) => i.id !== id));
    try {
      await fetch(`/api/ideas/${id}`, { method: "DELETE" });
    } catch (e) {
      showToast("Failed to delete idea", "error");
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const idea = savedIdeas.find((i) => i.id === id);
    if (!idea) return;
    const newStatus = !idea.isFavorite;
    
    setSavedIdeas((prev) => prev.map((i) => 
      i.id === id ? { ...i, isFavorite: newStatus } : i
    ));

    try {
      await fetch(`/api/ideas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: newStatus })
      });
    } catch (e) {
      showToast("Failed to update favorite status", "error");
    }
  };

  const handleGenerateSocial = async (idea: SavedIdea) => {
    setGeneratingSocialId(idea.id);
    try {
      const res = await fetch("/api/generate-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaText: idea.text,
          category: idea.category,
          language: idea.language,
          visualStyle: idea.visualStyle,
          aiModel,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate social content");
      }

      setSavedIdeas((prev) => prev.map((i) =>
        i.id === idea.id ? { ...i, socialContent: data.social } : i
      ));

      await fetch(`/api/ideas/${idea.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socialContent: data.social })
      });

      showToast("Facebook social content generated!", "success");
    } catch (e: any) {
      showToast(e.message || "Failed to generate social content", "error");
    } finally {
      setGeneratingSocialId(null);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      showToast("Copied to clipboard!", "success");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Search Query state & sorting
  // Filtered saved ideas
  const filteredIdeas = savedIdeas.filter((idea) => {
    const matchesCategory =
      filterCategory === "ALL"
        ? true
        : filterCategory === "FAVORITES"
        ? idea.isFavorite
        : idea.category === filterCategory;

    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.trim().toLowerCase();
    const fileName = getFallbackFileName(idea).toLowerCase();
    const textContent = idea.text.toLowerCase();

    return fileName.includes(q) || textContent.includes(q);
  });

  // Sorted saved ideas
  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (sortBy === "OLDEST") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "FAVORITES_FIRST") {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Default NEWEST
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPages = Math.max(1, Math.ceil(sortedIdeas.length / ITEMS_PER_PAGE));
  const paginatedIdeas = sortedIdeas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const categoryEntries = Object.values(CATEGORIES);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Header / Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950/80 p-5 sm:p-8 border border-indigo-500/20 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-bold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>AI Video Concept & Prompt Engine</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <Lightbulb className="w-8 h-8 text-amber-400 shrink-0 filter drop-shadow-md" />
                AI Idea Generator
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Generate production-ready video prompts with Claude AI, refine scripts, save dialogues, and copy 9:16 vertical concepts for video creation.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <button
                onClick={handleResetSettings}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
                title="Reset all generator settings, filters, and search to default"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>
        </div>

        {/* Custom Idea Optimizer Section */}
        <div ref={customIdeaOptimizerRef} className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-slate-950/70 border border-emerald-500/20 shadow-xl backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <span>Optimize Custom Idea <span className="text-xs font-normal text-slate-400 hidden sm:inline">(e.g. from ChatGPT or Scratch)</span></span>
            </h2>
          </div>
          
          <div className="space-y-3.5">
            <textarea
              value={customIdea}
              onChange={(e) => setCustomIdea(e.target.value)}
              placeholder="Paste your raw story idea here (e.g. A toddler girl finds a tiny green alien toy in the living room and asks if it likes biryani)..."
              className="w-full h-32 px-4 py-3.5 rounded-xl bg-black/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none font-sans"
            />
            
            <div className="flex justify-end">
              <button
                onClick={handleOptimize}
                disabled={isOptimizing || !customIdea.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
              >
                {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isOptimizing ? "Optimizing & Splitting into Scenes..." : "Rewrite & Optimize into Video Script"}
              </button>
            </div>
          </div>

          {/* Optimized Output Card */}
          {optimizedData && (
            <div className="mt-6 space-y-4 pt-6 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base sm:text-lg font-extrabold text-emerald-400">
                  {optimizedData.title}
                </h3>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{(optimizedData as any).modelUsed ? getModelBadgeLabel((optimizedData as any).modelUsed) : getModelBadgeLabel(aiModel)}</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {optimizedData.scenes.map((scene) => (
                  <button
                    key={scene.sceneNumber}
                    onClick={() => setActiveSceneTab(scene.sceneNumber)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeSceneTab === scene.sceneNumber
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                        : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                    }`}
                  >
                    Scene {scene.sceneNumber}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-black/70 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans shadow-inner">
                {optimizedData.scenes.find(s => s.sceneNumber === activeSceneTab)?.content}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => handleCopy(optimizedData.scenes.find(s => s.sceneNumber === activeSceneTab)?.content || "", "opt-scene")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white hover:border-emerald-500/40 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {copiedId === "opt-scene" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
                  {copiedId === "opt-scene" ? "Copied Scene Content!" : "Copy Scene Content"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Generate New Ideas Form Controls */}
        <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-slate-950/70 border border-indigo-500/20 shadow-xl relative z-30 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <span>Generate New Video Concept</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as CategoryId;
                  setCategory(cat);
                  if (cat === "CARBOX") {
                    setLanguage("ASMR Unboxing Effects");
                    setVisualStyle("Realistic");
                  }
                  else if (cat === "PUNJABI_JOKE") setLanguage("Punjabi");
                  else if (cat === "HINDI_JOKE") setLanguage("Hindi");
                  else if (language === "ASMR Unboxing Effects") setLanguage("Urdu");
                }}
                className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium cursor-pointer"
              >
                {categoryEntries.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium cursor-pointer disabled:opacity-50"
                disabled={category === "CARBOX"}
              >
                {category === "CARBOX" ? (
                  <option value="ASMR Unboxing Effects" className="bg-slate-900 text-white">ASMR Unboxing Effects</option>
                ) : (
                  LANGUAGE_OPTIONS.map((l) => (
                    <option key={l} value={l} className="bg-slate-900 text-white">
                      {l}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Visual Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Visual Style</label>
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium cursor-pointer"
              >
                {VISUAL_STYLES.map((s) => (
                  <option key={s} value={s} className="bg-slate-900 text-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                <span>Duration</span>
              </label>
              <select
                value={videoDuration}
                onChange={(e) => setVideoDuration(Number(e.target.value))}
                className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-indigo-500/40 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium cursor-pointer"
              >
                <option value={8} className="bg-slate-900 text-white">8 Sec Story Clip</option>
                <option value={10} className="bg-slate-900 text-white">⚡ 10 Sec Fast & Energetic</option>
              </select>
            </div>

            {/* AI Model Selector */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🤖 AI Model</span>
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-purple-500/40 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all font-semibold cursor-pointer"
              >
                {AI_MODEL_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Background Music Type Dropdown */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <CustomSelect
                label="Background Music Type"
                icon="🎵"
                value={musicType}
                onChange={(val) => setMusicType(val)}
                groups={MUSIC_TYPE_GROUPS}
                badgeTitle="Music Style"
              />
            </div>

            {/* Serious Dialogue Style Dropdown */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <CustomSelect
                label="Serious Dialogue Style"
                icon="🎭"
                value={seriousDialogueStyle}
                onChange={(val) => setSeriousDialogueStyle(val)}
                groups={SERIOUS_DIALOGUE_GROUPS}
                badgeTitle="Dialogue Tone"
              />
            </div>

            {/* Custom Spoken Dialogue Section */}
            {category !== "CARBOX" && (
              <div className="space-y-3 lg:col-span-5 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <label className="text-xs font-extrabold text-amber-300 flex items-center gap-2">
                    <span>💬 Custom Spoken Dialogue (Optional)</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {customDialogue && (
                      <>
                        <button
                          type="button"
                          onClick={handleSaveDialogue}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700/50 text-xs font-bold text-indigo-200 transition-all cursor-pointer active:scale-95 shadow-sm"
                          title="Save dialogue for future reuse"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(customDialogue, "custom-dialogue-input")}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer active:scale-95 shadow-sm"
                          title="Copy spoken dialogue"
                        >
                          {copiedId === "custom-dialogue-input" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === "custom-dialogue-input" ? "Copied" : "Copy"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomDialogue("");
                            showToast("Cleared dialogue text", "info");
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-xs font-bold text-rose-300 transition-all cursor-pointer active:scale-95 shadow-sm"
                          title="Clear dialogue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear</span>
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsDialogueExpanded(!isDialogueExpanded)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 transition-all cursor-pointer active:scale-95 shadow-sm"
                      title={isDialogueExpanded ? "Collapse to normal height" : "Expand field height for large script view"}
                    >
                      {isDialogueExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                      <span>{isDialogueExpanded ? "Collapse" : "Expand"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSuggestDialogue}
                      disabled={isSuggestingDialogue}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm"
                      title="Generate a short, natural dialogue line matching current script style"
                    >
                      {isSuggestingDialogue ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      {isSuggestingDialogue ? "Suggesting..." : "✨ Suggest AI Dialogue"}
                    </button>
                  </div>
                </div>

                <textarea
                  value={customDialogue}
                  onChange={(e) => setCustomDialogue(e.target.value)}
                  dir={isRtl ? "rtl" : "ltr"}
                  rows={isDialogueExpanded ? 8 : 4}
                  placeholder='e.g. Abu: "Chips kahan gaye?" \n Bachha: "Taqeeqat jaari hain!" (Or click Suggest AI Dialogue)'
                  className={`w-full px-4.5 py-3.5 rounded-2xl bg-black/80 border-2 border-amber-500/50 text-base sm:text-lg lg:text-xl font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all resize-y overflow-y-auto custom-scrollbar shadow-inner ${
                    isRtl ? "text-right leading-relaxed tracking-wide font-sans" : "text-left leading-relaxed font-sans"
                  }`}
                />

                {/* Saved Dialogues Tag List */}
                {savedDialogues.length > 0 && (
                  <div className="mt-3 p-3.5 rounded-xl bg-black/40 border border-indigo-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                        Saved Dialogues ({savedDialogues.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pt-1">
                      {savedDialogues.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 shadow-sm"
                        >
                          <span
                            dir={language === "Urdu" || language === "Punjabi" ? "rtl" : "ltr"}
                            className="truncate max-w-[180px] sm:max-w-xs font-medium"
                          >
                            {item.text}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUseSavedDialogue(item.text)}
                            className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] transition-all cursor-pointer active:scale-95"
                          >
                            Use
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSavedDialogue(item.id)}
                            className="p-0.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete saved dialogue"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cute Kids Options */}
          {category === "CUTE_KIDS" && (
            <div className="p-4 sm:p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/25 space-y-5 shadow-xl relative z-30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-500/20 pb-3 gap-2">
                <div>
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                    Cute Kids Generator Parameters (Mobile Optimized)
                  </span>
                  <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                    Tap any option below to open a full-screen, touch-friendly bottom selector for fast navigation on Android.
                  </p>
                </div>
                <span className="text-[10px] text-indigo-300/80 font-semibold px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/20 self-start sm:self-auto">
                  Touch-Friendly Selectors
                </span>
              </div>

              {/* One-Tap Mobile Presets Bar */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    One-Tap Mobile Presets
                  </span>
                  <button
                    type="button"
                    onClick={handleResetSettings}
                    title="Reset all settings to default values"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 touch-manipulation"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span>Reset</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {CUTE_KIDS_PRESETS.map((preset) => {
                    const isActive = 
                      kidsAge === preset.age &&
                      kidsLocation === preset.location &&
                      kidsHealth === preset.health &&
                      kidsVibe === preset.vibe &&
                      characterSetup === preset.setup &&
                      charactersPerScene === preset.perScene &&
                      kidsNationality === preset.nationality &&
                      (!preset.musicType || musicType === preset.musicType) &&
                      (!preset.dialogueStyle || seriousDialogueStyle === preset.dialogueStyle);
                    
                    return (
                      <button
                        key={preset.title}
                        type="button"
                        onClick={() => applyCuteKidsPreset(preset)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-sm touch-manipulation w-full text-left ${
                          isActive 
                            ? "bg-indigo-600 border-indigo-400 shadow-md shadow-indigo-500/40 ring-1 ring-indigo-400" 
                            : "bg-indigo-900/60 hover:bg-indigo-800 border-indigo-500/40"
                        }`}
                      >
                        <span className="text-base shrink-0">{preset.icon}</span>
                        <span className="truncate">{preset.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Characters Age */}
                <CustomSelect
                  label="Characters Age"
                  icon="👶"
                  value={kidsAge}
                  onChange={setKidsAge}
                  groups={KIDS_AGE_GROUPS}
                />

                {/* 2. Scene Location */}
                <CustomSelect
                  label="Scene Location"
                  icon="📍"
                  value={kidsLocation}
                  onChange={setKidsLocation}
                  groups={KIDS_LOCATION_GROUPS}
                />

                {/* 3. Kids Health */}
                <CustomSelect
                  label="Kids Health"
                  icon="❤️"
                  value={kidsHealth}
                  onChange={setKidsHealth}
                  groups={KIDS_HEALTH_GROUPS}
                />

                {/* 4. Kids Vibe */}
                <CustomSelect
                  label="Kids Vibe"
                  icon="✨"
                  value={kidsVibe}
                  onChange={setKidsVibe}
                  groups={KIDS_VIBE_GROUPS}
                />

                {/* 5. Character Setup */}
                <CustomSelect
                  label="Character Setup"
                  icon="👥"
                  value={characterSetup}
                  onChange={setCharacterSetup}
                  groups={CHARACTER_SETUP_GROUPS}
                />

                {/* 6. Characters Per Scene */}
                <div className="space-y-1.5">
                  <CustomSelect
                    label="Characters Per Scene"
                    icon="🔢"
                    value={charactersPerScene}
                    onChange={setCharactersPerScene}
                    groups={CHARACTERS_PER_SCENE_GROUPS}
                  />
                  {charactersPerScene === "Custom" && (
                    <input
                      type="text"
                      value={customCharactersPerScene}
                      onChange={(e) => setCustomCharactersPerScene(e.target.value)}
                      placeholder="e.g. 5 Characters (3 Kids + 2 Adults)..."
                      className="w-full mt-2 px-3.5 py-2.5 rounded-xl bg-black/80 border border-indigo-500/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 font-medium shadow-inner"
                    />
                  )}
                </div>

                {/* 7. Nationality */}
                <CustomSelect
                  label="Nationality / Culture"
                  icon="🌍"
                  value={kidsNationality}
                  onChange={setKidsNationality}
                  groups={KIDS_NATIONALITY_GROUPS}
                />
              </div>
            </div>
          )}

          {/* Carbox Options */}
          {category === "CARBOX" && (
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Vehicle Type / Brand / Model</label>
                <select
                  value={carboxBrand}
                  onChange={(e) => setCarboxBrand(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium cursor-pointer"
                >
                  <option value="Hypercar" className="bg-slate-900 text-white">Hypercar</option>
                  <option value="Supercar" className="bg-slate-900 text-white">Supercar</option>
                  <option value="Sports Car" className="bg-slate-900 text-white">Sports Car</option>
                  <option value="Luxury Sedan" className="bg-slate-900 text-white">Luxury Sedan</option>
                  <option value="Muscle Car" className="bg-slate-900 text-white">Muscle Car</option>
                  <option value="Classic Car" className="bg-slate-900 text-white">Classic Car</option>
                  <option value="Rally Car" className="bg-slate-900 text-white">Rally Car</option>
                  <option value="Formula Race Car" className="bg-slate-900 text-white">Formula Race Car</option>
                  <option value="Drift Car" className="bg-slate-900 text-white">Drift Car</option>
                  <option value="SUV" className="bg-slate-900 text-white">SUV</option>
                  <option value="Pickup Truck" className="bg-slate-900 text-white">Pickup Truck</option>
                  <option value="Heavy Duty Truck" className="bg-slate-900 text-white">Heavy Duty Truck</option>
                  <option value="Monster Truck" className="bg-slate-900 text-white">Monster Truck</option>
                  <option value="Electric Vehicle" className="bg-slate-900 text-white">Electric Vehicle</option>
                  <option value="Police Car (Emergency)" className="bg-slate-900 text-white">Police Car (Emergency)</option>
                  <option value="Ambulance (Emergency)" className="bg-slate-900 text-white">Ambulance (Emergency)</option>
                  <option value="Fire Truck (Emergency)" className="bg-slate-900 text-white">Fire Truck (Emergency)</option>
                  <option value="City Bus" className="bg-slate-900 text-white">City Bus</option>
                  <option value="School Bus" className="bg-slate-900 text-white">School Bus</option>
                  <option value="Motorcycle" className="bg-slate-900 text-white">Motorcycle</option>
                  <option value="Sport Bike" className="bg-slate-900 text-white">Sport Bike</option>
                  <option value="Cruiser Bike" className="bg-slate-900 text-white">Cruiser Bike</option>
                  <option value="Adventure Bike" className="bg-slate-900 text-white">Adventure Bike</option>
                  <option value="Dirt Bike" className="bg-slate-900 text-white">Dirt Bike</option>
                  <option value="Scooter" className="bg-slate-900 text-white">Scooter</option>
                  <option value="ATV / Quad Bike" className="bg-slate-900 text-white">ATV / Quad Bike</option>
                  <option value="Farm Tractor" className="bg-slate-900 text-white">Farm Tractor</option>
                  <option value="Construction Excavator" className="bg-slate-900 text-white">Construction Excavator</option>
                  <option value="Premium BMW" className="bg-slate-900 text-white">Premium BMW</option>
                  <option value="Mercedes Benz" className="bg-slate-900 text-white">Mercedes Benz</option>
                  <option value="Porsche 911" className="bg-slate-900 text-white">Porsche 911</option>
                  <option value="Ferrari" className="bg-slate-900 text-white">Ferrari</option>
                  <option value="Lamborghini" className="bg-slate-900 text-white">Lamborghini</option>
                  <option value="JDM Nissan GTR" className="bg-slate-900 text-white">JDM Nissan GTR</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Vehicle Color</label>
                <select
                  value={carboxColor}
                  onChange={(e) => setCarboxColor(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium cursor-pointer"
                >
                  <option value="Pearl White" className="bg-slate-900 text-white">Pearl White</option>
                  <option value="Gloss Black" className="bg-slate-900 text-white">Gloss Black</option>
                  <option value="Matte Black" className="bg-slate-900 text-white">Matte Black</option>
                  <option value="Metallic Silver" className="bg-slate-900 text-white">Metallic Silver</option>
                  <option value="Gunmetal Gray" className="bg-slate-900 text-white">Gunmetal Gray</option>
                  <option value="Racing Red" className="bg-slate-900 text-white">Racing Red</option>
                  <option value="Crimson Red" className="bg-slate-900 text-white">Crimson Red</option>
                  <option value="Electric Blue" className="bg-slate-900 text-white">Electric Blue</option>
                  <option value="Navy Blue" className="bg-slate-900 text-white">Navy Blue</option>
                  <option value="Emerald Green" className="bg-slate-900 text-white">Emerald Green</option>
                  <option value="British Racing Green" className="bg-slate-900 text-white">British Racing Green</option>
                  <option value="Sunset Orange" className="bg-slate-900 text-white">Sunset Orange</option>
                  <option value="Bright Yellow" className="bg-slate-900 text-white">Bright Yellow</option>
                  <option value="Gold" className="bg-slate-900 text-white">Gold</option>
                  <option value="Rose Gold" className="bg-slate-900 text-white">Rose Gold</option>
                  <option value="Copper" className="bg-slate-900 text-white">Copper</option>
                  <option value="Purple" className="bg-slate-900 text-white">Purple</option>
                  <option value="Pink" className="bg-slate-900 text-white">Pink</option>
                  <option value="Matte Olive" className="bg-slate-900 text-white">Matte Olive</option>
                  <option value="Desert Sand" className="bg-slate-900 text-white">Desert Sand</option>
                  <option value="Carbon Fiber" className="bg-slate-900 text-white">Carbon Fiber</option>
                  <option value="Chrome" className="bg-slate-900 text-white">Chrome</option>
                  <option value="Color-shifting Chameleon" className="bg-slate-900 text-white">Color-shifting Chameleon</option>
                  <option value="Neon Gradient" className="bg-slate-900 text-white">Neon Gradient</option>
                  <option value="Custom Livery" className="bg-slate-900 text-white">Custom Livery</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Packaging Style</label>
                <select
                  value={carboxPackaging}
                  onChange={(e) => setCarboxPackaging(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium cursor-pointer"
                >
                  <option value="Premium Aluminum Case" className="bg-slate-900 text-white">Premium Aluminum Case</option>
                  <option value="Luxury Wooden Crate" className="bg-slate-900 text-white">Luxury Wooden Crate</option>
                  <option value="Carbon Fiber Case" className="bg-slate-900 text-white">Carbon Fiber Case</option>
                  <option value="Tempered Glass Display Box" className="bg-slate-900 text-white">Tempered Glass Display Box</option>
                  <option value="Acrylic Display Case" className="bg-slate-900 text-white">Acrylic Display Case</option>
                  <option value="Flight Case" className="bg-slate-900 text-white">Flight Case</option>
                  <option value="Magnetic Gift Box" className="bg-slate-900 text-white">Magnetic Gift Box</option>
                  <option value="Velvet Collector's Box" className="bg-slate-900 text-white">Velvet Collector's Box</option>
                  <option value="Transparent Showcase Box" className="bg-slate-900 text-white">Transparent Showcase Box</option>
                  <option value="Industrial Metal Crate" className="bg-slate-900 text-white">Industrial Metal Crate</option>
                  <option value="Futuristic Capsule" className="bg-slate-900 text-white">Futuristic Capsule</option>
                  <option value="Titanium Case" className="bg-slate-900 text-white">Titanium Case</option>
                  <option value="Military Supply Crate" className="bg-slate-900 text-white">Military Supply Crate</option>
                  <option value="Premium Leather Case" className="bg-slate-900 text-white">Premium Leather Case</option>
                  <option value="Luxury Suitcase" className="bg-slate-900 text-white">Luxury Suitcase</option>
                  <option value="Sci-Fi Energy Container" className="bg-slate-900 text-white">Sci-Fi Energy Container</option>
                  <option value="Elegant Retail Box" className="bg-slate-900 text-white">Elegant Retail Box</option>
                  <option value="Vintage Blister Pack" className="bg-slate-900 text-white">Vintage Blister Pack</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tabletop Background</label>
                <select
                  value={carboxBackground}
                  onChange={(e) => setCarboxBackground(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium cursor-pointer"
                >
                  <option value="Matte Black Studio" className="bg-slate-900 text-white">Matte Black Studio</option>
                  <option value="White Marble" className="bg-slate-900 text-white">White Marble</option>
                  <option value="Black Marble" className="bg-slate-900 text-white">Black Marble</option>
                  <option value="Carbon Fiber Mat" className="bg-slate-900 text-white">Carbon Fiber Mat</option>
                  <option value="Brushed Aluminum" className="bg-slate-900 text-white">Brushed Aluminum</option>
                  <option value="Dark Walnut Wood" className="bg-slate-900 text-white">Dark Walnut Wood</option>
                  <option value="Oak Wood" className="bg-slate-900 text-white">Oak Wood</option>
                  <option value="Concrete" className="bg-slate-900 text-white">Concrete</option>
                  <option value="Glass Surface" className="bg-slate-900 text-white">Glass Surface</option>
                  <option value="Acrylic" className="bg-slate-900 text-white">Acrylic</option>
                  <option value="Leather Surface" className="bg-slate-900 text-white">Leather Surface</option>
                  <option value="Granite" className="bg-slate-900 text-white">Granite</option>
                  <option value="Slate Stone" className="bg-slate-900 text-white">Slate Stone</option>
                  <option value="Premium Fabric" className="bg-slate-900 text-white">Premium Fabric</option>
                  <option value="Neon Cyberpunk Table" className="bg-slate-900 text-white">Neon Cyberpunk Table</option>
                  <option value="Mirror Surface" className="bg-slate-900 text-white">Mirror Surface</option>
                  <option value="Racing Garage Workbench" className="bg-slate-900 text-white">Racing Garage Workbench</option>
                  <option value="Luxury Showroom Floor" className="bg-slate-900 text-white">Luxury Showroom Floor</option>
                  <option value="Industrial Steel Platform" className="bg-slate-900 text-white">Industrial Steel Platform</option>
                  <option value="Clean White Studio Tabletop" className="bg-slate-900 text-white">Clean White Studio Tabletop</option>
                </select>
              </div>
            </div>
          )}

          {/* Generator Action Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 shadow-inner w-full sm:w-auto">
              <span className="text-sm">✨</span>
              <span>
                <strong>Clean Video Mandate:</strong> Completely clean & unobstructed video (no text, logos, or UI overlays).
                {category === "CARBOX" && " Model branding permitted for car videos."}
              </span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-indigo-500/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0 w-full sm:w-auto"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {isGenerating ? "Generating Concept..." : "✨ Generate 1 Idea"}
            </button>
          </div>
        </div>

        {/* Saved Ideas Section */}
        <div ref={savedIdeasSectionRef} className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-slate-950/70 border border-slate-800/80 shadow-xl backdrop-blur-xl space-y-5 relative z-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Saved Ideas ({filteredIdeas.length})</span>
            </h2>

            <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto justify-end">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by filename or prompt..."
                  className="w-full pl-10 pr-8 py-2 rounded-xl bg-black/60 border border-indigo-500/40 text-xs text-indigo-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold p-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 bg-black/60 border border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-medium"
                >
                  <option value="NEWEST" className="bg-slate-900 text-white">Newest First</option>
                  <option value="OLDEST" className="bg-slate-900 text-white">Oldest First</option>
                  <option value="FAVORITES_FIRST" className="bg-slate-900 text-white">Favorites First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => { setFilterCategory("ALL"); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                filterCategory === "ALL"
                  ? "bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              All ({savedIdeas.length})
            </button>
            <button
              onClick={() => { setFilterCategory("FAVORITES"); setCurrentPage(1); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                filterCategory === "FAVORITES"
                  ? "bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-600/30"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800"
              }`}
            >
              <Heart className="w-3 h-3 fill-current" />
              Favorites ({savedIdeas.filter(i => i.isFavorite).length})
            </button>
            {categoryEntries.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setFilterCategory(cat.id); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                  filterCategory === cat.id
                    ? "bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Cards Display Grid */}
          {paginatedIdeas.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm font-medium">
              {savedIdeas.length === 0
                ? "No saved ideas yet. Click 'Generate 1 Idea' above to create your first video prompt!"
                : "No saved ideas match your search filter."}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedIdeas.map((idea) => {
                const isRtl = idea.language === "Urdu" || idea.language === "Punjabi";
                return (
                  <div
                    key={idea.id}
                    className="group flex flex-col items-start justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-black/40 border border-slate-800 hover:border-indigo-500/30 transition-all shadow-md hover:shadow-xl w-full"
                  >
                    {/* Full Width Prompt Area */}
                    <div className="w-full space-y-3">
                      <div
                        dir={isRtl ? "rtl" : "ltr"}
                        className={`w-full p-4 rounded-xl bg-black/30 border border-slate-800/80 text-sm sm:text-base text-slate-100 leading-relaxed font-sans select-text ${
                          isRtl ? "text-right" : "text-left"
                        }`}
                      >
                        {idea.text}
                      </div>
                      
                      {/* Badges & Filename Toolbar */}
                      <div className="flex items-center justify-between gap-2 flex-wrap pt-1 w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                            {CATEGORIES[idea.category]?.name || idea.category}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            {idea.language}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                            {idea.visualStyle}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                            <span>{getModelBadgeLabel(idea.aiModel)}</span>
                          </span>
                          {idea.musicType && (
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                              <span>🎵</span>
                              <span>{idea.musicType}</span>
                            </span>
                          )}
                          {idea.seriousDialogueStyle && (
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                              <span>🎭</span>
                              <span>{idea.seriousDialogueStyle}</span>
                            </span>
                          )}
                        </div>

                        {/* Unique Video Filename Badge & Inline Editor */}
                        {editingFileNameId === idea.id ? (
                          <div className="flex items-center gap-1.5 bg-black border border-indigo-500 rounded-xl px-2.5 py-1 text-xs shadow-md">
                            <FileVideo className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <input
                              type="text"
                              value={editingFileNameText}
                              onChange={(e) => setEditingFileNameText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveFileName(idea.id);
                                if (e.key === "Escape") setEditingFileNameId(null);
                              }}
                              className="bg-transparent text-indigo-200 text-xs font-mono focus:outline-none w-48 sm:w-56"
                              placeholder="carbox_bmw_01"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveFileName(idea.id)}
                              className="text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-2.5 py-1 transition-colors cursor-pointer active:scale-95"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl px-3 py-1 text-xs text-indigo-200">
                            <FileVideo className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="font-mono text-[11px] text-indigo-300 font-semibold select-all">
                              {getFallbackFileName(idea)}
                            </span>
                            <button
                              onClick={() => {
                                setEditingFileNameId(idea.id);
                                setEditingFileNameText(getFallbackFileName(idea));
                              }}
                              className="text-slate-400 hover:text-indigo-300 p-0.5 transition-colors cursor-pointer"
                              title="Edit Video Filename"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleCopy(getFallbackFileName(idea), `${idea.id}-filename`)}
                              className="flex items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-white transition-colors border-l border-indigo-500/30 pl-2 ml-1 cursor-pointer"
                              title="Copy Filename to send to friend"
                            >
                              {copiedId === `${idea.id}-filename` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-indigo-400" />
                              )}
                              Copy Name
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Spoken Script & Custom Dialogue Banner */}
                      <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-black/40 border border-amber-500/40 space-y-2.5 w-full shadow-lg">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                              <span>💬</span>
                              <span>{idea.customDialogue ? "Custom Spoken Dialogue" : "Spoken Dialogue & Script"}</span>
                            </span>
                            {idea.customDialogue && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                User Custom Input
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleCopy(getIdeaDialogue(idea), `${idea.id}-card-dialogue`)}
                              className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white transition-colors cursor-pointer bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30 shadow-sm"
                              title="Copy Spoken Dialogue"
                            >
                              {copiedId === `${idea.id}-card-dialogue` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                              <span>Copy Dialogue</span>
                            </button>

                            <button
                              onClick={() => {
                                setCustomDialogue(getIdeaDialogue(idea));
                                showToast("Loaded custom dialogue into generator form!", "info");
                              }}
                              className="flex items-center gap-1 text-[11px] font-bold text-emerald-300 hover:text-white transition-colors cursor-pointer bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30 shadow-sm"
                              title="Use this dialogue in the generator form above"
                            >
                              <Sparkles className="w-3 h-3 text-emerald-400" />
                              <span>Use in Generator</span>
                            </button>

                            <button
                              onClick={() => handleOpenScriptModal(idea)}
                              className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-white transition-colors cursor-pointer bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-500/40 shadow-sm"
                              title="Open Full Dialogue Box Modal"
                            >
                              <MessageSquare className="w-3 h-3 text-indigo-400" />
                              <span>Open Dialog Box</span>
                            </button>
                          </div>
                        </div>

                        <div
                          dir={isRtl ? "rtl" : "ltr"}
                          className={`p-4 rounded-xl bg-black/80 border border-amber-500/40 text-base sm:text-lg font-bold text-amber-100 leading-relaxed tracking-wide ${
                            isRtl ? "text-right" : "text-left"
                          }`}
                        >
                          {getIdeaDialogue(idea) || (
                            <span className="text-slate-400 italic">No custom spoken dialogue specified yet. Click &quot;Open Dialog Box&quot; to add dialogue.</span>
                          )}
                        </div>
                      </div>

                      {/* Social Media Content — Prominent CTA when not yet generated */}
                      {!idea.socialContent && (
                        <div className="mt-4 rounded-2xl border border-blue-500/40 bg-gradient-to-br from-blue-950/50 via-indigo-950/40 to-black/60 shadow-xl overflow-hidden">
                          <button
                            onClick={() => handleGenerateSocial(idea)}
                            disabled={generatingSocialId === idea.id}
                            className="w-full flex flex-col items-center justify-center gap-3 py-6 px-4 text-center active:scale-[0.98] transition-transform disabled:opacity-60 cursor-pointer"
                          >
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/50 shadow-lg">
                              {generatingSocialId === idea.id ? (
                                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                              ) : (
                                <Share2 className="w-6 h-6 text-blue-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-extrabold text-blue-200 tracking-wide">
                                {generatingSocialId === idea.id ? "Generating Social Assets…" : "📣 Generate Social Media Titles & Assets"}
                              </p>
                              <p className="text-[11px] text-blue-400/80 mt-0.5">
                                YouTube Shorts · Facebook Reels · TikTok · IG · Hashtags · Trending Tags
                              </p>
                            </div>
                            {generatingSocialId !== idea.id && (
                              <span className="px-5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors">
                                Tap to Generate
                              </span>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Social Media Content Display Box */}
                      {idea.socialContent && (
                        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-indigo-950/30 to-black/50 border border-blue-500/40 space-y-4 w-full shadow-xl font-sans">
                          <div className="flex items-center justify-between border-b border-blue-500/20 pb-3 flex-wrap gap-2">
                            <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-blue-300 uppercase tracking-wider">
                              <Share2 className="w-4 h-4 text-blue-400" />
                              <span>Social Media Titles & Trending Assets</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleCopy(`🔴 YOUTUBE SHORTS TITLE:\n${getIdeaShortsTitle(idea)}\n\n📘 FACEBOOK REELS TITLE:\n${getIdeaReelsTitle(idea)}\n\n🎵 TIKTOK / IG REELS TITLE:\n${getIdeaTikTokTitle(idea)}\n\n📝 DESCRIPTION:\n${getIdeaDescription(idea)}\n\n🏷️ HASHTAGS:\n${getIdeaHashtags(idea)}\n\n🔥 TRENDING TAGS & SUGGESTIONS:\n${getIdeaTrendingTags(idea)}`, `${idea.id}-social-all`)}
                                className="px-3 py-1.5 rounded-xl bg-blue-600/40 border border-blue-500/50 hover:bg-blue-600/60 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
                                title="Copy all platform titles, description, hashtags and trending tags together"
                              >
                                {copiedId === `${idea.id}-social-all` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-300" />}
                                <span>Copy All Social Assets</span>
                              </button>
                              <button
                                onClick={() => handleGenerateSocial(idea)}
                                disabled={generatingSocialId === idea.id}
                                className="text-xs font-bold text-slate-400 hover:text-blue-200 transition-colors flex items-center gap-1 cursor-pointer bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700"
                              >
                                <RotateCcw className="w-3 h-3 text-blue-400" />
                                <span>Regenerate Titles</span>
                              </button>
                            </div>
                          </div>

                          {/* 🔴 YouTube Shorts Title */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                              <span>🔴 YouTube Shorts Title (Emoji-Rich & Catchy)</span>
                              <button
                                onClick={() => handleCopy(getIdeaShortsTitle(idea), `${idea.id}-shorts-title`)}
                                className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-white transition-colors cursor-pointer bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30"
                              >
                                {copiedId === `${idea.id}-shorts-title` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-rose-400" />}
                                Copy Shorts Title
                              </button>
                            </div>
                            <div dir={isRtl ? "rtl" : "ltr"} className={`p-2.5 rounded-xl bg-black/70 border border-rose-500/30 text-xs sm:text-sm text-rose-100 font-semibold ${isRtl ? "text-right" : "text-left"}`}>
                              {getIdeaShortsTitle(idea)}
                            </div>
                          </div>

                          {/* 📘 Facebook Reels Title */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-blue-300">
                              <span>📘 Facebook Reels Title (Viral Hook & Humor)</span>
                              <button
                                onClick={() => handleCopy(getIdeaReelsTitle(idea), `${idea.id}-reels-title`)}
                                className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-white transition-colors cursor-pointer bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30"
                              >
                                {copiedId === `${idea.id}-reels-title` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-blue-400" />}
                                Copy Reels Title
                              </button>
                            </div>
                            <div dir={isRtl ? "rtl" : "ltr"} className={`p-2.5 rounded-xl bg-black/70 border border-blue-500/30 text-xs sm:text-sm text-blue-100 font-semibold ${isRtl ? "text-right" : "text-left"}`}>
                              {getIdeaReelsTitle(idea)}
                            </div>
                          </div>

                          {/* 🎵 TikTok & IG Reels Title */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                              <span>🎵 TikTok & IG Reels Title (Trend Style)</span>
                              <button
                                onClick={() => handleCopy(getIdeaTikTokTitle(idea), `${idea.id}-tiktok-title`)}
                                className="flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-white transition-colors cursor-pointer bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30"
                              >
                                {copiedId === `${idea.id}-tiktok-title` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-purple-400" />}
                                Copy TikTok Title
                              </button>
                            </div>
                            <div dir={isRtl ? "rtl" : "ltr"} className={`p-2.5 rounded-xl bg-black/70 border border-purple-500/30 text-xs sm:text-sm text-purple-100 font-semibold ${isRtl ? "text-right" : "text-left"}`}>
                              {getIdeaTikTokTitle(idea)}
                            </div>
                          </div>

                          {/* 📌 Universal Main Title */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                              <span>📌 Universal Main Title</span>
                              <button
                                onClick={() => handleCopy(getIdeaTitle(idea), `${idea.id}-social-title`)}
                                className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer bg-slate-900 px-2 py-0.5 rounded border border-slate-700"
                              >
                                {copiedId === `${idea.id}-social-title` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                Copy Main Title
                              </button>
                            </div>
                            <div dir={isRtl ? "rtl" : "ltr"} className={`p-2.5 rounded-xl bg-black/70 border border-slate-800 text-xs text-white font-medium ${isRtl ? "text-right" : "text-left"}`}>
                              {getIdeaTitle(idea)}
                            </div>
                          </div>

                          {/* 📝 Video Description */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                              <span>📝 Video Description</span>
                              <button
                                onClick={() => handleCopy(getIdeaDescription(idea), `${idea.id}-social-desc`)}
                                className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer bg-slate-900 px-2 py-0.5 rounded border border-slate-700"
                              >
                                {copiedId === `${idea.id}-social-desc` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                Copy Description
                              </button>
                            </div>
                            <div dir={isRtl ? "rtl" : "ltr"} className={`p-2.5 rounded-xl bg-black/70 border border-slate-800 text-xs text-slate-200 font-medium ${isRtl ? "text-right" : "text-left"}`}>
                              {getIdeaDescription(idea)}
                            </div>
                          </div>

                          {/* 🏷️ Core Hashtags & 🔥 Trending Tags */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {/* Core Hashtags */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                                <span>🏷️ Core Hashtags (4-5)</span>
                                <button
                                  onClick={() => handleCopy(getIdeaHashtags(idea), `${idea.id}-social-tags`)}
                                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-white transition-colors cursor-pointer bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30"
                                >
                                  {copiedId === `${idea.id}-social-tags` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-indigo-400" />}
                                  Copy Tags
                                </button>
                              </div>
                              <div dir="ltr" className="p-2.5 rounded-xl bg-black/70 border border-indigo-500/30 text-xs text-indigo-300 font-mono">
                                {getIdeaHashtags(idea)}
                              </div>
                            </div>

                            {/* Trending Tags & Suggestions */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                                <span>🔥 Trending Tags & Growth</span>
                                <button
                                  onClick={() => handleCopy(getIdeaTrendingTags(idea), `${idea.id}-trending-tags`)}
                                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-white transition-colors cursor-pointer bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30"
                                >
                                  {copiedId === `${idea.id}-trending-tags` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-emerald-400" />}
                                  Copy Trending Tags
                                </button>
                              </div>
                              <div dir="ltr" className="p-2.5 rounded-xl bg-black/70 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
                                {getIdeaTrendingTags(idea)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions Row - Full Width Right-Aligned with Separate Copy Buttons */}
                    <div className="w-full flex items-center justify-end gap-2 flex-wrap pt-3 border-t border-slate-800/60">
                      {/* Individual Copy Buttons requested by user */}
                      <button
                        onClick={() => handleCopy(getIdeaDialogue(idea), `${idea.id}-action-dialogue`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs font-bold text-amber-300 hover:text-white transition-all cursor-pointer active:scale-95"
                        title="Copy Spoken Dialogue Script"
                      >
                        {copiedId === `${idea.id}-action-dialogue` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                        <span>Copy Dialogue</span>
                      </button>

                      <button
                        onClick={() => handleCopy(cleanPromptText(idea.text), `${idea.id}-action-prompt`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer active:scale-95"
                        title="Copy Clean Video Prompt (Without Format Tag)"
                      >
                        {copiedId === `${idea.id}-action-prompt` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                        <span>Copy Prompt</span>
                      </button>

                      {/* 9:16 Mobile Vertical Aspect Ratio Prompt */}
                      <button
                        onClick={() => handleCopy(getPrompt916(idea.text), `${idea.id}-mobile`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-700/50 text-xs font-bold text-indigo-300 hover:text-white hover:bg-indigo-900/60 transition-all cursor-pointer active:scale-95 shadow-sm"
                        title="Copy 9:16 Mobile Vertical Aspect Ratio Prompt"
                      >
                        {copiedId === `${idea.id}-mobile` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                        <span>9:16 Mobile</span>
                      </button>

                      {/* 16:9 Full Widescreen Aspect Ratio Prompt */}
                      <button
                        onClick={() => handleCopy(getPrompt169(idea.text), `${idea.id}-full`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                        title="Copy 16:9 Full Widescreen Aspect Ratio Prompt"
                      >
                        {copiedId === `${idea.id}-full` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>16:9 Full</span>
                      </button>

                      <button
                        onClick={() => handleCopy(getIdeaTitle(idea), `${idea.id}-action-title`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/40 text-xs font-bold text-blue-300 hover:text-white transition-all cursor-pointer active:scale-95"
                        title="Copy Title"
                      >
                        {copiedId === `${idea.id}-action-title` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                        <span>Copy Title</span>
                      </button>

                      <button
                        onClick={() => handleCopy(getIdeaDescription(idea), `${idea.id}-action-desc`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs font-bold text-purple-300 hover:text-white transition-all cursor-pointer active:scale-95"
                        title="Copy Description"
                      >
                        {copiedId === `${idea.id}-action-desc` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                        <span>Copy Description</span>
                      </button>

                      <button
                        onClick={() => handleCopy(getIdeaHashtags(idea), `${idea.id}-action-tags`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-bold text-emerald-300 hover:text-white transition-all cursor-pointer active:scale-95"
                        title="Copy Hashtags"
                      >
                        {copiedId === `${idea.id}-action-tags` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>Copy Tags</span>
                      </button>

                      {/* Generate Social Button */}
                      <button
                        onClick={() => handleGenerateSocial(idea)}
                        disabled={generatingSocialId === idea.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-600/50 text-xs font-bold text-blue-300 hover:text-white hover:bg-blue-900/80 transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                        title="Generate Facebook title, description, caption & hashtags"
                      >
                        {generatingSocialId === idea.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span>{idea.socialContent ? "Regenerate Social" : "Generate Social"}</span>
                      </button>

                      {/* Favorite Toggle Button */}
                      <button
                        onClick={() => handleToggleFavorite(idea.id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                          idea.isFavorite 
                            ? "bg-rose-950/60 border-rose-500/50 text-rose-400 hover:bg-rose-900/60 shadow-md shadow-rose-950/40" 
                            : "bg-slate-900 border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/40"
                        }`}
                        title={idea.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={`w-4 h-4 ${idea.isFavorite ? "fill-current" : ""}`} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteIdea(idea.id)}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-all cursor-pointer active:scale-95"
                        title="Delete idea"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800/80">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white disabled:opacity-30 transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <span className="text-xs text-slate-400 font-bold px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white disabled:opacity-30 transition-all cursor-pointer active:scale-95"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Script & Dialogue Modal Dialog Box */}
      {scriptModalIdea && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl rounded-2xl bg-[#0b0e17] border border-indigo-500/40 p-6 space-y-4 shadow-2xl relative font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-white">
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">💬</span>
                <span>Spoken Dialogue & Script Box</span>
              </div>
              <button
                onClick={() => setScriptModalIdea(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Video Filename Sub-header */}
            <div className="text-xs text-indigo-300/80 font-mono flex items-center gap-2 bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/20">
              <FileVideo className="w-3.5 h-3.5 text-indigo-400" />
              <span>Video ID: {getFallbackFileName(scriptModalIdea)}</span>
            </div>

            {/* Editable Script Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Dialogue Lines & Voiceover Script</span>
                <span className="text-[10px] text-indigo-400 font-normal">Edit & save script for reuse</span>
              </label>
              <textarea
                value={editedScriptText}
                onChange={(e) => setEditedScriptText(e.target.value)}
                dir={scriptModalIdea.language === "Urdu" || scriptModalIdea.language === "Punjabi" ? "rtl" : "ltr"}
                rows={6}
                className="w-full p-4 rounded-xl bg-black/80 border-2 border-indigo-500/50 text-base sm:text-lg lg:text-xl font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition-all leading-relaxed tracking-wide font-sans overflow-y-auto custom-scrollbar resize-y shadow-inner"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleCopy(editedScriptText, `${scriptModalIdea.id}-modal-script`)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/30 text-xs font-bold text-indigo-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              >
                {copiedId === `${scriptModalIdea.id}-modal-script` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
                <span>{copiedId === `${scriptModalIdea.id}-modal-script` ? "Copied Script" : "Copy Script"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScriptModalIdea(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveScriptModal}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
                >
                  Save Script
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
