"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useToast } from "@/components/ui/Toast";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { safeJsonResponse } from "@/lib/utils";
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
  Mic,
  Lock,
  Feather,
  X,
  Eye,
  ArrowUp,
  Smartphone,
  FileText,
  Sun,
  Moon,
  Compass,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const LANGUAGE_OPTIONS = ["English", "Hindi", "Urdu", "Roman Urdu", "Punjabi"];
const VISUAL_STYLES: { value: string; label: string; desc: string; tag?: string }[] = [
  // ─── Realistic / Cinematic ───
  { value: "Photorealistic Natural Proportions", label: "🌟 Photorealistic Natural Proportions", desc: "100% realistic human facial proportions, natural eyes, lifelike skin textures & cinematic lighting", tag: "🔥 NEW / Natural Eyes" },
  { value: "Photorealistic 8K Cinematic", label: "Photorealistic 8K Cinematic", desc: "Film-quality depth, bokeh, cinematic lighting — perfect for romantic & emotional Shayari scenes", tag: "⭐ Best for Poetry" },
  { value: "Hyper-Realistic CGI", label: "Hyper-Realistic CGI", desc: "Near-photorealistic with extra visual punch — great for moonlit palaces & Mughal courtyards", tag: "🏆 Top Pick" },
  { value: "Realistic ASMR Commercial", label: "Realistic ASMR Commercial", desc: "Ultra-clean, polished look ideal for product unboxing & ASMR sensory content" },
  // ─── 3D Animation ───
  { value: "Realistic 3D Character (Natural Eyes)", label: "✨ Realistic 3D Character (Natural Eyes)", desc: "Polished 3D feature animation with natural human eyes, refined proportions & realistic lighting", tag: "🔥 NEW / Natural Eyes" },
  { value: "3D Pixar Animation", label: "3D Pixar Animation", desc: "Warm lighting, natural expressive features & Pixar skin shaders — ideal for emotional storytelling", tag: "💡 Popular" },
  { value: "3D Disney Animation", label: "3D Disney Animation", desc: "Classic Disney magic with rich colors & princely aesthetics — perfect for fairy-tale narratives" },
  { value: "3D Cartoon Style", label: "3D Cartoon Style", desc: "Fun, vibrant 3D characters with natural expressive facial features & lively animation" },
  { value: "Claymation 3D", label: "Claymation 3D", desc: "Handcrafted clay-like textures with quirky charm — unique look for funny or whimsical stories" },
  // ─── Anime ───
  { value: "Studio Ghibli Anime", label: "Studio Ghibli Anime", desc: "Dreamy, painterly — moonlit lakes, autumn forests, snow cabins. Emotionally resonant for Shayari", tag: "🌸 Romantic Mood" },
  { value: "Anime (Shonen / Modern)", label: "Anime (Shonen / Modern)", desc: "Dynamic action lines, vivid colors & intense expressions — great for adventure & drama" },
  { value: "Chibi Anime Style", label: "Chibi Anime Style", desc: "Cute anime-inspired characters with adorable expressions & lighthearted charm" },
  // ─── Artistic ───
  { value: "Oil Painting Masterpiece", label: "Oil Painting Masterpiece", desc: "Grand Mehfil & Mughal settings — rich painterly Urdu poetry aesthetic", tag: "🎨 Poetic Classic" },
  { value: "Soft Pastel Watercolor", label: "Soft Pastel Watercolor", desc: "Delicate sakura blossoms, rose gardens — gentle romantic scenes with an airy dream-like quality" },
  { value: "Pencil Sketch & Charcoal", label: "Pencil Sketch & Charcoal", desc: "Raw, expressive hand-drawn feel — perfect for introspective, artsy storytelling" },
  { value: "Paper Cutout Art", label: "Paper Cutout Art", desc: "Layered paper-craft aesthetic — visually distinctive for educational or children's content" },
  { value: "Vector Flat Art Animation", label: "Vector Flat Art Animation", desc: "Clean, modern flat design with bold shapes — ideal for explainer videos & infographics" },
  // ─── Dark / Stylized ───
  { value: "Noir Vintage Film", label: "Noir Vintage Film", desc: "Moody black & white cinematic feel — perfect for sad/heartbreak Shayari & mystery drama", tag: "💔 Heartbreak Mood" },
  { value: "Dark Fantasy & Eerie Glow", label: "Dark Fantasy & Eerie Glow", desc: "Ominous gothic atmospheres with ethereal glow — great for supernatural & thriller narratives" },
  { value: "Cyberpunk Neon", label: "Cyberpunk Neon", desc: "Electric neon-lit futuristic cityscape — best for sci-fi, tech & action-packed content" },
  { value: "Retro 80s Synthwave", label: "Retro 80s Synthwave", desc: "Glowing grids, chrome retro aesthetics — nostalgic and high-energy for music-driven clips" },
  // ─── Misc ───
  { value: "Comic Book & Graphic Novel", label: "Comic Book & Graphic Novel", desc: "Bold outlines, halftone dots & action panels — dynamic look for superhero & drama shorts" },
  { value: "Vintage 90s Cartoon", label: "Vintage 90s Cartoon", desc: "Nostalgic Saturday morning cartoon style — charming throwback for comedy & kids" },
  { value: "Low Poly 3D World", label: "Low Poly 3D World", desc: "Geometric faceted 3D landscapes — minimalist artistic look, great for calm ambient content" },
  { value: "Isometric 3D Architecture", label: "Isometric 3D Architecture", desc: "Top-down isometric cityscapes & rooms — ideal for architecture, city-builder & explainer clips" },
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
    category: "Default / AI Decides",
    options: [
      { value: "Any / AI Decides", label: "Any / AI Decides (Default)", desc: "Let the AI choose the best age for the story automatically." },
    ]
  },
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

const FRUIT_DANCING_PRESETS = [
  {
    icon: "🥝",
    title: "Kiwi Fuzzy Toddler",
    fruitType: "Fuzzy Kiwi Fruit (Sliced Green Kiwi Belly with Seeds)",
    age: "Toddler (2-4 yrs)",
    location: "Lush Kiwi Orchard with Sliced Kiwis on Grass",
    vibe: "Cute Wobbly Bounce & Foot Tapping",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🍉",
    title: "Watermelon Wiggle",
    fruitType: "Striped Watermelon Onesie (Red Juicy Sliced Belly)",
    age: "Toddler (2-4 yrs)",
    location: "Sunny Watermelon Patch with Giant Melon Slices",
    vibe: "Cheerful Hip-Hop & Arm Waving",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🍓",
    title: "Strawberry Sweetie",
    fruitType: "Plush Red Strawberry Costume with Green Leaf Hat",
    age: "Toddler (2-4 yrs)",
    location: "Magical Strawberry Patch with Floating Berry Sparkles",
    vibe: "Adorable Twirl & Giggle Dance",
    musicType: "Cute Playful Children Symphony",
    visualStyle: "3D Disney Animation",
  },
  {
    icon: "🥭",
    title: "Mango Swag Toddler",
    fruitType: "Golden Yellow Mango Onesie with Soft Velvet Texture",
    age: "Toddler (2-4 yrs)",
    location: "Tropical Mango Grove under Golden Hour Sunlight",
    vibe: "Swag Toddler Dance & Head Bop",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "Hyper-Realistic CGI",
  },
  {
    icon: "🍍",
    title: "Pineapple Groover",
    fruitType: "Spiky Textured Golden Pineapple Suit with Crown Top",
    age: "Toddler (2-4 yrs)",
    location: "Tropical Island Orchard with Palm Trees",
    vibe: "Funky Island Groove & Hip Sway",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🍌",
    title: "Banana Bounce",
    fruitType: "Peeled Yellow Banana Suit Framing Cute Face",
    age: "Toddler (2-4 yrs)",
    location: "Vibrant Tropical Jungle Path with Banana Palms",
    vibe: "High Energy Wobbly Bounce",
    musicType: "Funny Comedy Sound Effects",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🥑",
    title: "Avocado Chubby Dancer",
    fruitType: "Green Avocado Suit with Dark Brown Seed Pit Belly",
    age: "Toddler (2-4 yrs)",
    location: "Aesthetic Green Garden with Giant Sliced Avocados",
    vibe: "Chubby Belly Wobble & Cute Spin",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🍊",
    title: "Orange Citrus Popper",
    fruitType: "Bright Orange Citrus Onesie with Leaf Collar",
    age: "Toddler (2-4 yrs)",
    location: "Sun-dappled Orange Grove with Sliced Oranges",
    vibe: "Zesty Pop & Foot Tapping",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "Hyper-Realistic CGI",
  },
  {
    icon: "🍇",
    title: "Grape Cluster Shuffle",
    fruitType: "Purple Grape Cluster Bubble Suit with Green Vine Top",
    age: "Toddler (2-4 yrs)",
    location: "Sunny Italian Vineyard with Hanging Grapes",
    vibe: "Rhythmic Grape Shuffle & Clapping",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🍑",
    title: "Peach Blossom Wiggle",
    fruitType: "Soft Fuzzy Pink Peach Suit with Velvet Finish",
    age: "Toddler (2-4 yrs)",
    location: "Peach Blossom Garden with Petals Drifting in Wind",
    vibe: "Gentle Sweet Wiggle & Soft Giggles",
    musicType: "Cute Playful Children Symphony",
    visualStyle: "3D Disney Animation",
  },
  {
    icon: "🍎",
    title: "Crispy Apple Hop",
    fruitType: "Shiny Red Apple Suit with Green Stem Hood",
    age: "Toddler (2-4 yrs)",
    location: "Autumn Apple Orchard under Warm Afternoon Sun",
    vibe: "Energetic Apple Hop & Clapping",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🐉",
    title: "Dragonfruit Neon Dancer",
    fruitType: "Vibrant Magenta Dragonfruit Suit with White Seeded Belly",
    age: "Toddler (2-4 yrs)",
    location: "Exotic Tropical Garden with Glowing Lotus Flowers",
    vibe: "Neon Glow Groove & Cute Pose",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "Hyper-Realistic CGI",
  },
  {
    icon: "🍒",
    title: "Cherry Pair Twirler",
    fruitType: "Double Red Cherry Suit with Twin Stem Crown",
    age: "Toddler (2-4 yrs)",
    location: "Cherry Blossom Orchard in Full Bloom",
    vibe: "Playful Twirl & High Fives",
    musicType: "Cute Playful Children Symphony",
    visualStyle: "3D Disney Animation",
  },
  {
    icon: "🍋",
    title: "Zesty Lemon Spin",
    fruitType: "Bright Lemon Yellow Suit with Citrus Texture",
    age: "Toddler (2-4 yrs)",
    location: "Mediterranean Lemon Grove with Sunlight Bokeh",
    vibe: "Zesty Spin & Happy Shoulder Shakes",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🥥",
    title: "Coconut Beach Bouncer",
    fruitType: "Hairy Brown Coconut Suit with Pure White Core Belly",
    age: "Toddler (2-4 yrs)",
    location: "Tropical Sandy Beach with Gentle Turquoise Waves",
    vibe: "Beach Hula Bounce & Arm Waving",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "Hyper-Realistic CGI",
  },
  {
    icon: "🍐",
    title: "Pear Blossom Hopper",
    fruitType: "Gentle Lime Green Pear Suit with Leaf Accent",
    age: "Toddler (2-4 yrs)",
    location: "Pear Blossom Garden with Soft Morning Sunlight",
    vibe: "Sweet Hopper Dance & Cute Bow",
    musicType: "Cute Playful Children Symphony",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🫐",
    title: "Blueberry Pop Toddler",
    fruitType: "Round Deep Blue Berry Suit with Crown Top",
    age: "Toddler (2-4 yrs)",
    location: "Berry Patch Meadow with Oversized Blueberries",
    vibe: "Bouncy Berry Pop & Foot Tapping",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🍈",
    title: "Honeydew Melon Breeze",
    fruitType: "Soft Pastel Green Honeydew Suit with Mesh Texture",
    age: "Toddler (2-4 yrs)",
    location: "Lush Meadow Garden with Giant Melon Cutouts",
    vibe: "Breezy Wiggle & Happy Giggles",
    musicType: "Cute Playful Children Symphony",
    visualStyle: "3D Disney Animation",
  },
  {
    icon: "🌽",
    title: "Sweet Corn Pop Jig",
    fruitType: "Golden Yellow Corn Husk Suit with Husk Leaves",
    age: "Toddler (2-4 yrs)",
    location: "Golden Countryside Cornfield under Blue Sky",
    vibe: "Country Pop Jig & Hands Up",
    musicType: "Funny Comedy Sound Effects",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🧺",
    title: "Multi-Fruit Party",
    fruitType: "Fruit Salad Combo Costumes (Kiwi, Strawberry, Watermelon)",
    age: "Toddler (2-4 yrs)",
    location: "Giant Woven Picnic Fruit Basket Arena",
    vibe: "Group Dance Party & Synced Bounce",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
];

// ─── FRUIT DANCING SPECIFIC OPTION GROUPS ────────────────────────────────────

const FRUIT_DANCING_AGE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🍼 Baby & Toddler Age Ranges",
    options: [
      { value: "Newborn Baby (0-12 months)", label: "👶 Newborn Baby (0-12 months)", desc: "Tiny newborn baby in a fruit onesie with chubby cheeks and a sleepy smile." },
      { value: "Baby (1-2 yrs)", label: "🐣 Baby (1-2 yrs)", desc: "Wobbly standing baby just starting to bounce and clap." },
      { value: "Toddler (2-4 yrs)", label: "🧒 Toddler (2-4 yrs) — Most Viral", desc: "Classic viral age: chubby cheeks, wobbly dancing, biggest cute factor." },
      { value: "Preschool Kid (4-5 yrs)", label: "👦 Preschool Kid (4-5 yrs)", desc: "More energetic and coordinated dancer with expressive reactions." },
      { value: "Twin Babies (2-4 yrs)", label: "👯 Twin Babies (2-4 yrs)", desc: "Two identical twins in matching fruit suits dancing in sync — extra viral." },
    ],
  },
];

const FRUIT_DANCING_LOCATION_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🌳 Fruit Orchards & Gardens",
    options: [
      { value: "Lush Kiwi Orchard with Sliced Kiwis on Grass", label: "🥝 Kiwi Orchard with Sliced Kiwis", desc: "Lush green kiwi orchard with giant sliced kiwis scattered on soft grass." },
      { value: "Sunny Watermelon Patch with Giant Melon Slices", label: "🍉 Sunny Watermelon Patch", desc: "Bright sunny watermelon patch with giant sliced melons and green vines." },
      { value: "Magical Strawberry Patch with Floating Berry Sparkles", label: "🍓 Magical Strawberry Patch", desc: "Enchanted strawberry patch with glowing sparkles and giant red berries." },
      { value: "Tropical Mango Grove under Golden Hour Sunlight", label: "🥭 Tropical Mango Grove (Golden Hour)", desc: "Lush mango orchard glowing under warm golden-hour sunlight." },
      { value: "Tropical Island Orchard with Palm Trees", label: "🍍 Tropical Island Orchard & Palms", desc: "Tropical beach-side orchard with tall swaying palm trees and sunshine." },
      { value: "Vibrant Tropical Jungle Path with Banana Palms", label: "🍌 Tropical Jungle Path & Banana Palms", desc: "Colorful jungle path lined with banana palms and dappled sunlight." },
      { value: "Aesthetic Green Garden with Giant Sliced Avocados", label: "🥑 Aesthetic Avocado Garden", desc: "Dreamy green garden with giant sliced avocados and soft pastel light." },
      { value: "Sun-dappled Orange Grove with Sliced Oranges", label: "🍊 Sun-dappled Orange Grove", desc: "Beautiful orange grove with sliced citrus fruits on the warm grass floor." },
      { value: "Sunny Italian Vineyard with Hanging Grapes", label: "🍇 Sunny Italian Vineyard", desc: "Classic Mediterranean vineyard with lush hanging grape clusters." },
      { value: "Peach Blossom Garden with Petals Drifting in Wind", label: "🍑 Peach Blossom Garden", desc: "Romantic garden with pink peach blossoms floating gently in the breeze." },
      { value: "Autumn Apple Orchard under Warm Afternoon Sun", label: "🍎 Autumn Apple Orchard", desc: "Warm autumn apple orchard with golden light and scattered leaves." },
      { value: "Exotic Tropical Garden with Glowing Lotus Flowers", label: "🐉 Exotic Tropical Garden (Neon Glow)", desc: "Vibrant tropical garden with glowing lotus flowers and neon-lit foliage." },
      { value: "Cherry Blossom Orchard in Full Bloom", label: "🍒 Cherry Blossom Orchard (Sakura)", desc: "Stunning pink cherry blossom orchard with petals raining from the sky." },
      { value: "Mediterranean Lemon Grove with Sunlight Bokeh", label: "🍋 Mediterranean Lemon Grove", desc: "Bright Mediterranean lemon grove with warm golden bokeh sunlight." },
      { value: "Tropical Sandy Beach with Gentle Turquoise Waves", label: "🥥 Tropical Sandy Beach & Waves", desc: "Sunny tropical beach with clear turquoise waves and coconut palms." },
      { value: "Pear Blossom Garden with Soft Morning Sunlight", label: "🍐 Pear Blossom Garden", desc: "Gentle garden with soft morning sunlight and white pear blossoms." },
      { value: "Berry Patch Meadow with Oversized Blueberries", label: "🫐 Berry Patch Meadow", desc: "Colorful meadow with giant oversized blueberries scattered on the grass." },
      { value: "Lush Meadow Garden with Giant Melon Cutouts", label: "🍈 Lush Meadow with Melon Cutouts", desc: "Breezy green meadow with giant decorative melon cutouts and flowers." },
      { value: "Golden Countryside Cornfield under Blue Sky", label: "🌽 Golden Countryside Cornfield", desc: "Vast golden cornfield under a bright blue sky with fluffy clouds." },
      { value: "Giant Woven Picnic Fruit Basket Arena", label: "🧺 Giant Picnic Fruit Basket Arena", desc: "Whimsical giant woven fruit basket filled with colorful fruits as the dance arena." },
    ],
  },
  {
    category: "✨ Magical & Studio Settings",
    options: [
      { value: "Colorful Confetti Dance Studio with Balloons", label: "🎈 Confetti Dance Studio & Balloons", desc: "Bright studio with rainbow confetti falling and colorful balloon arches." },
      { value: "Pastel Rainbow Candy Land Dance Floor", label: "🌈 Pastel Rainbow Candy Land", desc: "Dreamy candy-land setting with rainbow floors and pastel candy decorations." },
      { value: "Magical Floating Fruits Sky Garden", label: "☁️ Magical Floating Fruits Sky Garden", desc: "Sky-high magical garden with floating giant fruits and soft cloud floor." },
    ],
  },
];

const FRUIT_DANCING_VIBE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🕺 Dance Styles & General Vibes",
    options: [
      { value: "Cute Wobbly Bounce & Foot Tapping", label: "🐾 Cute Wobbly Bounce & Foot Tapping", desc: "Classic wobbly toddler bounce with happy foot tapping — maximum cuteness." },
      { value: "Cheerful Hip-Hop & Arm Waving", label: "🤸 Cheerful Hip-Hop & Arm Waving", desc: "Energetic hip-hop vibes with enthusiastic arm waves and head bops." },
      { value: "Adorable Twirl & Giggle Dance", label: "🌀 Adorable Twirl & Giggle Dance", desc: "Sweet spinning twirls paired with contagious baby giggles throughout." },
      { value: "Swag Toddler Dance & Head Bop", label: "😎 Swag Toddler Dance & Head Bop", desc: "Extra-confident toddler swagger with rhythmic head bops and attitude." },
      { value: "Funky Island Groove & Hip Sway", label: "🌴 Funky Island Groove & Hip Sway", desc: "Tropical island-inspired funky hip sway with a big joyful smile." },
      { value: "High Energy Wobbly Bounce", label: "⚡ High Energy Wobbly Bounce", desc: "Non-stop high-energy bouncing with zero chill and maximum enthusiasm." },
      { value: "Chubby Belly Wobble & Cute Spin", label: "🫃 Chubby Belly Wobble & Cute Spin", desc: "The iconic chubby belly wobble with an adorable slow spin." },
      { value: "Zesty Pop & Foot Tapping", label: "🍊 Zesty Pop & Foot Tapping", desc: "Quick pop dance moves with snappy foot tapping and citrus energy." },
      { value: "Rhythmic Grape Shuffle & Clapping", label: "🍇 Rhythmic Grape Shuffle & Clapping", desc: "Rhythmic side-shuffle with enthusiastic hand clapping to the beat." },
      { value: "Gentle Sweet Wiggle & Soft Giggles", label: "🌸 Gentle Sweet Wiggle & Soft Giggles", desc: "Soft and gentle wiggle dance with the most adorable baby giggles." },
      { value: "Energetic Apple Hop & Clapping", label: "🍎 Energetic Apple Hop & Clapping", desc: "Bouncy hops with clapping hands in perfect rhythm — very energetic." },
      { value: "Neon Glow Groove & Cute Pose", label: "✨ Neon Glow Groove & Cute Pose", desc: "Stylish groove moves with a cool neon-lit finishing pose." },
      { value: "Playful Twirl & High Fives", label: "🍒 Playful Twirl & High Fives", desc: "Fun spinning twirls with imaginary high-five moments to the camera." },
      { value: "Beach Hula Bounce & Arm Waving", label: "🌊 Beach Hula Bounce & Arm Waving", desc: "Tropical hula-inspired bounce with wide arm waves like ocean waves." },
      { value: "Country Pop Jig & Hands Up", label: "🌽 Country Pop Jig & Hands Up", desc: "Fun country-style jig with both hands shooting up to the sky." },
      { value: "Group Dance Party & Synced Bounce", label: "🧺 Group Party Dance & Synced Bounce", desc: "Multiple babies bouncing in perfect sync — maximum viral energy." },
    ],
  },
  {
    category: "🤣 Funny On-Beat Kids Moves",
    options: [
      {
        value: "On-Beat Butt Wiggle — Baby shakes booty exactly on every beat drop with a cheeky look at camera",
        label: "🍑 On-Beat Butt Wiggle (Beat Drop Booty)",
        desc: "Baby's booty shakes PRECISELY on each beat drop — hilariously timed, maximum comedy, camera side-eye.",
      },
      {
        value: "Freeze-on-beat — Baby dances wildly then FREEZES completely stiff on every beat hit like a statue",
        label: "🧊 Freeze-on-Beat Statue Move",
        desc: "Wild random dance bursts then sudden full-body freeze on every beat — looks shockingly funny.",
      },
      {
        value: "Beat-Synced Head Bobble — Giant exaggerated head nod forward on every single beat, body barely moves",
        label: "🗿 Giant Head Bobble On Every Beat",
        desc: "Huge exaggerated head nod forward in perfect sync with each beat — body still, only head moves.",
      },
      {
        value: "On-Beat Clap-Stomp Combo — Clap hands and stomp one foot simultaneously on every beat like a tiny DJ",
        label: "👏 On-Beat Clap-Stomp Combo (Tiny DJ)",
        desc: "Both hands clap AND one foot stomps hard on each beat in perfect sync — looks like a tiny DJ.",
      },
      {
        value: "Beat-Drop Squat — Baby does a full sit-squat exactly when the beat drops then pops back up instantly",
        label: "💥 Beat-Drop Squat & Pop Up",
        desc: "Full squat down on the beat drop, instantly pop back up — repeated each drop. Hilarious timing.",
      },
      {
        value: "Shoulder Shrug On Beat — Dramatic slow shoulder shrug up on the beat then snap drop on the off-beat",
        label: "🤷 Dramatic Shoulder Shrug On Beat",
        desc: "Slow dramatic shoulders-up on beat, snap-drop off-beat — like a confused superstar.",
      },
      {
        value: "Point-at-Camera On Beat — Baby extends one finger and points directly at camera on every single beat",
        label: "☝️ On-Beat Camera Point (I See You!)",
        desc: "Single finger jab straight at camera on every beat — serious face makes it incredibly funny.",
      },
      {
        value: "Beat-Synced Eye Blink — Baby blinks both eyes wildly wide on beat, tiny body barely moves",
        label: "👀 On-Beat Wild Eye Blink (Shocked Face)",
        desc: "Eyes go massive-wide on each beat — tiny body still, only eyes react. Looks hilariously shocked.",
      },
      {
        value: "Knock-Knock Knee Tap — Baby taps both knees together on every beat with a wobbly silly stance",
        label: "🦵 On-Beat Knock-Knock Knee Tap",
        desc: "Both chubby knees tap together on each beat with a wide wobbly stance — pure funny toddler energy.",
      },
      {
        value: "On-Beat Arm Fling — Both arms fling outward explosively on beat then snap back in, repeatedly",
        label: "💥 On-Beat Explosive Arm Fling",
        desc: "Arms explode outward on every beat and snap back in — like a tiny surprised bird taking off.",
      },
      {
        value: "Hip Pop Lock On Beat — Baby locks hip to one side on beat, holds for one beat, then snaps to the other",
        label: "🎯 Hip Pop-Lock On Beat (Left-Right Snap)",
        desc: "Sharp hip-pop left on one beat, lock, then snap right on next — perfectly rhythmic and funny.",
      },
      {
        value: "On-Beat Tummy Poke — Baby pokes own belly button on every beat with a confused look then giggles",
        label: "🫃 On-Beat Belly Button Poke & Giggle",
        desc: "Pokes own chubby belly on each beat then looks confused then giggles — irresistibly hilarious.",
      },
      {
        value: "Tongue-Out Head Shake On Beat — Tongue sticks out and head shakes left-right wildly on every beat",
        label: "😜 On-Beat Tongue-Out Head Shake",
        desc: "Tongue out, head shaking left-right in perfect rhythm on each beat — maximum silly energy.",
      },
      {
        value: "On-Beat Baby Dab — Full dab pose executed perfectly on each beat drop, bounces normally in between",
        label: "🎤 On-Beat Baby Dab (Beat Drop Dab)",
        desc: "Baby dabs sharply on every beat drop and bounces normally in between — classic yet hilarious.",
      },
      {
        value: "Surprise Face On Beat — Baby's eyebrows shoot up and mouth opens wide in shock on every beat hit",
        label: "😲 On-Beat Surprise Face Reaction",
        desc: "Eyebrows jump up + mouth opens in shock on every beat — looks genuinely surprised every time.",
      },
      {
        value: "On-Beat Spin-Clap-Drop — Baby spins once, claps, then drops to squat in perfect 3-beat sequence",
        label: "🌀 Spin → Clap → Drop (3-Beat Combo)",
        desc: "Three-beat combo: spin on beat 1, clap on beat 2, squat drop on beat 3 — perfectly rhythmic.",
      },
    ],
  },
  {
    category: "🎬 10-Second Choreographed Move Sequences",
    options: [
      {
        value: "[0-3s] Cute waddle entrance → [3-6s] Double arm pump + hip bounce → [6-9s] Full 360° spin → [9-10s] Freeze pose with cheeky grin",
        label: "🌀 Waddle → Arm Pump → Spin → Freeze Pose",
        desc: "Perfect 10s arc: cute walking in, arm pumping, full spin, and a freeze finish."
      },
      {
        value: "[0-2s] Bounce in place → [2-5s] Side shuffle left & right → [5-8s] Big belly wiggle → [8-10s] Sit-down bow",
        label: "🍑 Bounce → Shuffle → Belly Wiggle → Bow",
        desc: "Classic 10s viral format: bouncing, shuffling sides, belly wiggle, adorable bow ending."
      },
      {
        value: "[0-3s] Jump jump jump with arms out → [3-6s] Head shake side-to-side → [6-9s] Stomp stomp clap → [9-10s] Arms up victory pose",
        label: "🎉 Jump → Head Shake → Stomp Clap → Victory",
        desc: "High energy 10s: jumping start, head shakes, stomping, hands-up winner pose."
      },
      {
        value: "[0-3s] Slow hip sway left-right → [3-6s] Shoulder shimmy with big smile → [6-8s] Quick spin → [8-10s] Point at camera cutely",
        label: "💃 Hip Sway → Shimmy → Spin → Point at Camera",
        desc: "Smooth groovy 10s: gentle hip sways, shoulder shimmy, spin, and a cute camera point."
      },
      {
        value: "[0-2s] Stomp entrance with arms wide → [2-5s] Alternating arm waves → [5-8s] Whole-body bounce → [8-10s] Wink & blow kiss",
        label: "😘 Stomp → Arm Waves → Full Bounce → Blow Kiss",
        desc: "Charming 10s: powerful stomp start, alternating waves, bouncing, ends with a blown kiss."
      },
      {
        value: "[0-3s] Tiptoe spin → [3-5s] Freeze & look surprised → [5-8s] Rapid booty shake → [8-10s] Collapse into giggles",
        label: "😂 Tiptoe Spin → Surprise Freeze → Booty Shake → Giggles",
        desc: "Funny 10s: tiptoe spin, surprised freeze, funny booty shake, collapses laughing."
      },
      {
        value: "[0-3s] Robot stiff arm march → [3-6s] Disco finger point up-down → [6-9s] Side-to-side slide step → [9-10s] Jazz hands finish",
        label: "🤖 Robot March → Disco Point → Slide Step → Jazz Hands",
        desc: "Funny retro 10s: stiff robot walk, disco pointing, sliding, jazzy finish."
      },
      {
        value: "[0-2s] Run in from side → [2-5s] Crash stop & look at camera → [5-8s] Crazy wobbly head spin → [8-10s] Fall down & pop back up",
        label: "🏃 Run In → Crash Stop → Wobbly Spin → Fall & Pop Up",
        desc: "Comedy 10s: running entrance, surprised stop, silly spin, tumbles and pops back up."
      },
      {
        value: "[0-3s] March in with exaggerated steps → [3-6s] Floss dance left & right → [6-8s] Mini moonwalk backward → [8-10s] Double thumbs up",
        label: "🕺 March → Floss → Moonwalk → Thumbs Up",
        desc: "Trendy 10s moves: exaggerated march, floss, moonwalk, double thumbs-up ending."
      },
      {
        value: "[0-3s] Wiggle wiggle in place → [3-6s] Jump and clap three times → [6-8s] Fast tiptoe circle → [8-10s] Big surprised eyes freeze",
        label: "😲 Wiggle → Jump Clap → Tiptoe Circle → Surprise Freeze",
        desc: "Playful 10s: wiggles, jump-claps, tiptoe spin, ends with huge surprised eyes."
      },
    ],
  },
];

const FRUIT_DANCING_COSTUME_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🍃 Soft & Fuzzy Fruit Onesies",
    options: [
      { value: "Fuzzy Kiwi Fruit (Sliced Green Kiwi Belly with Seeds)", label: "🥝 Fuzzy Kiwi Onesie (Green Sliced Belly)", desc: "Fuzzy textured brown kiwi skin hood suit with vibrant green sliced kiwi belly and black seeds." },
      { value: "Striped Watermelon Onesie (Red Juicy Sliced Belly)", label: "🍉 Striped Watermelon Onesie", desc: "Classic watermelon onesie with green striped skin and red juicy sliced belly with seeds." },
      { value: "Plush Red Strawberry Costume with Green Leaf Hat", label: "🍓 Plush Red Strawberry Costume", desc: "Adorable plush red strawberry suit with seed dots and a matching green leaf hood." },
      { value: "Golden Yellow Mango Onesie with Soft Velvet Texture", label: "🥭 Golden Yellow Mango Onesie", desc: "Rich golden mango onesie with soft velvet texture and a warm yellow-orange glow." },
      { value: "Spiky Textured Golden Pineapple Suit with Crown Top", label: "🍍 Spiky Golden Pineapple Suit (Crown Top)", desc: "Iconic golden pineapple suit with spiky surface texture and a green crown hood top." },
      { value: "Peeled Yellow Banana Suit Framing Cute Face", label: "🍌 Peeled Banana Suit (Face Framed)", desc: "Bright yellow banana peel suit that frames the baby's adorable face perfectly." },
      { value: "Green Avocado Suit with Dark Brown Seed Pit Belly", label: "🥑 Green Avocado Suit (Seed Pit Belly)", desc: "Trendy avocado suit in green with a large dark brown seed pit on the belly." },
      { value: "Bright Orange Citrus Onesie with Leaf Collar", label: "🍊 Bright Orange Citrus Onesie", desc: "Vibrant orange citrus onesie with a cute green leaf collar accent." },
      { value: "Purple Grape Cluster Bubble Suit with Green Vine Top", label: "🍇 Purple Grape Cluster Bubble Suit", desc: "Puffy purple grape cluster bubble suit with green vine and leaf hood." },
      { value: "Soft Fuzzy Pink Peach Suit with Velvet Finish", label: "🍑 Soft Fuzzy Pink Peach Suit", desc: "Velvety soft pink peach suit with a slightly fuzzy finish and rosy warmth." },
      { value: "Shiny Red Apple Suit with Green Stem Hood", label: "🍎 Shiny Red Apple Suit (Stem Hood)", desc: "Classic shiny red apple costume with a cute green stem and leaf hood." },
      { value: "Vibrant Magenta Dragonfruit Suit with White Seeded Belly", label: "🐉 Vibrant Magenta Dragonfruit Suit", desc: "Eye-catching magenta dragonfruit suit with white seeded belly pattern." },
      { value: "Double Red Cherry Suit with Twin Stem Crown", label: "🍒 Double Red Cherry Suit (Twin Stems)", desc: "Adorable twin red cherry costume with a matching twin-stem crown top." },
      { value: "Bright Lemon Yellow Suit with Citrus Texture", label: "🍋 Bright Lemon Yellow Suit", desc: "Zesty bright lemon yellow suit with realistic citrus peel texture." },
      { value: "Hairy Brown Coconut Suit with Pure White Core Belly", label: "🥥 Hairy Brown Coconut Suit", desc: "Textured hairy brown coconut shell suit with pure white coconut core belly." },
      { value: "Gentle Lime Green Pear Suit with Leaf Accent", label: "🍐 Lime Green Pear Suit (Leaf Accent)", desc: "Soft lime green pear-shaped suit with a cute green leaf accent on the hood." },
      { value: "Round Deep Blue Berry Suit with Crown Top", label: "🫐 Deep Blue Blueberry Suit (Crown Top)", desc: "Round chubby blueberry suit in deep blue with a tiny crown-top detail." },
      { value: "Soft Pastel Green Honeydew Suit with Mesh Texture", label: "🍈 Pastel Green Honeydew Suit", desc: "Soft pastel green honeydew onesie with delicate mesh texture pattern." },
      { value: "Golden Yellow Corn Husk Suit with Husk Leaves", label: "🌽 Golden Corn Husk Suit (Husk Leaves)", desc: "Bright golden corn suit with realistic green corn husk leaf framing the face." },
      { value: "Fruit Salad Combo Costumes (Kiwi, Strawberry, Watermelon)", label: "🧺 Multi-Fruit Salad Party Costumes", desc: "Multiple babies each wearing different fruit suits for a colourful fruit salad party." },
    ],
  },
];

const FRUIT_DANCING_CHARACTER_SETUP_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "👶 Baby Character Setup",
    options: [
      { value: "One Cute 3D Baby/Toddler in Fruit Suit", label: "👶 Single Cute Toddler (Most Viral)", desc: "One adorable 3D baby or toddler dancing solo in a fruit onesie — the classic viral format." },
      { value: "Twin Babies in Matching Fruit Suits", label: "👯 Twin Babies (Matching Suits)", desc: "Two identical twin babies wearing perfectly matching fruit costumes and dancing in sync." },
      { value: "Two Toddlers in Different Fruit Suits", label: "🍉🥝 Two Toddlers (Different Fruits)", desc: "Two toddlers each wearing a different fruit suit, dancing together playfully." },
      { value: "Baby Girl in Fruit Suit", label: "👧 Baby Girl in Fruit Suit", desc: "An adorable baby girl wearing a plush fruit onesie with cute hair accessories." },
      { value: "Baby Boy in Fruit Suit", label: "👦 Baby Boy in Fruit Suit", desc: "A chubby baby boy in a fruit onesie with big expressive eyes and a wide grin." },
      { value: "Baby & Toddler Siblings in Fruit Suits", label: "🍓🍌 Baby & Toddler Siblings", desc: "An older toddler and younger baby sibling dancing together in matching fruit costumes." },
      { value: "Group of 3-4 Toddlers in Fruit Suits (Party)", label: "🎉 Group Party (3-4 Toddlers)", desc: "A lively group of 3 to 4 toddlers each wearing different fruit suits for a party dance." },
    ],
  },
];

// ─── ANIMAL DANCING PRESETS & OPTION GROUPS ─────────────────────────────────

const ANIMAL_DANCING_PRESETS = [
  {
    icon: "🍓",
    title: "Strawberry Kitten Shuffle",
    animalType: "5 Cute Kittens Line Dance (Strawberry, Bee, Cowboy, Dino, Pirate)",
    costume: "Strawberry Hood + Pattern Shorts & Pink Crocs",
    age: "Tiny Kittens & Puppies (6-12 months)",
    location: "Living Room Hardwood Floor with Giant Plush Teddy Bears",
    vibe: "🍑 On-Beat Butt Wiggle (Beat Drop Booty)",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🐝",
    title: "Bumblebee Pup Bop",
    animalType: "Solo Golden Retriever Puppy",
    costume: "Yellow & Black Bumblebee Suit with Wings & Antennas",
    age: "Tiny Kittens & Puppies (6-12 months)",
    location: "Living Room Hardwood Floor with Giant Plush Teddy Bears",
    vibe: "👏 On-Beat Clap-Stomp Combo (Tiny DJ)",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🤠",
    title: "Cowboy Cat Line Dance",
    animalType: "Ginger Tabby Kitten Solo",
    costume: "Brown Cowboy Hat, Leather Vest & Tiny Boots",
    age: "Playful Toddler Pets (1-2 yrs)",
    location: "Polished Wooden Floor with Warm Indoor Sunlight",
    vibe: "🤠 Cowboy Line Dance Stomp & Side-Step",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "Hyper-Realistic CGI",
  },
  {
    icon: "🦖",
    title: "Dino Kitten Groove",
    animalType: "Solo Tabby Kitten",
    costume: "Green Dinosaur Onesie with Back Spikes",
    age: "Tiny Kittens & Puppies (6-12 months)",
    location: "Living Room Hardwood Floor with Giant Plush Teddy Bears",
    vibe: "💥 On-Beat Explosive Arm Fling",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🏴‍☠️",
    title: "Pirate Kitten Crew Jig",
    animalType: "5 Cute Kittens Line Dance (Strawberry, Bee, Cowboy, Dino, Pirate)",
    costume: "Pirate Captain Hat with Skull & Crossbones & Striped Pants",
    age: "Tiny Kittens & Puppies (6-12 months)",
    location: "Living Room Hardwood Floor with Giant Plush Teddy Bears",
    vibe: "🌀 Waddle → Arm Pump → Spin → Freeze Pose",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🐼",
    title: "Baby Panda Hula",
    animalType: "Baby Panda Bear Solo",
    costume: "Hawaiian Hula Grass Skirt & Floral Lei",
    age: "Playful Toddler Pets (1-2 yrs)",
    location: "Tropical Sandy Beach & Palm Trees",
    vibe: "🌴 Funky Island Groove & Hip Sway",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🐰",
    title: "Bunny Chef Beat",
    animalType: "Fluffy Bunny Rabbit Squad",
    costume: "White Chef Hat & Apron",
    age: "Playful Toddler Pets (1-2 yrs)",
    location: "Clean Kitchen Countertop & Bakery Counter",
    vibe: "💥 Beat-Drop Squat & Pop Up",
    musicType: "Funny Comedy Sound Effects",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "🦈",
    title: "Baby Shark Pup",
    animalType: "French Bulldog Puppy",
    costume: "Blue Baby Shark Onesie",
    age: "Tiny Kittens & Puppies (6-12 months)",
    location: "Living Room Hardwood Floor with Giant Plush Teddy Bears",
    vibe: "💥 Beat-Drop Squat & Pop Up",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "👨‍🚀",
    title: "Space Hamster Boogie",
    animalType: "Tiny Hamster Crew",
    costume: "Metallic Silver Astronaut Suit",
    age: "Playful Toddler Pets (1-2 yrs)",
    location: "Neon Glow Disco Dance Studio & Balloons",
    vibe: "🤖 Robot March → Disco Point → Slide Step → Jazz Hands",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "3D Pixar Animation",
  },
  {
    icon: "👑",
    title: "Royal King Kitty",
    animalType: "Fluffy White Persian Kitten",
    costume: "Gold Royal King Crown & Red Velvet Cape",
    age: "Tiny Kittens & Puppies (6-12 months)",
    location: "Polished Wooden Floor with Warm Indoor Sunlight",
    vibe: "🌀 Spin → Clap → Drop (3-Beat Combo)",
    musicType: "Upbeat Viral TikTok Beats",
    visualStyle: "Hyper-Realistic CGI",
  },
];

const ANIMAL_DANCING_AGE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🐾 Pet Age & Stage",
    options: [
      { value: "Newborn Baby Animals (0-6 months)", label: "🍼 Newborn Baby Animals (0-6 months)", desc: "Tiny newborn kittens & puppies waddling cutely." },
      { value: "Tiny Kittens & Puppies (6-12 months)", label: "🐣 Tiny Kittens & Puppies (6-12 mos) — Most Viral", desc: "Classic viral size: fluffy coats, standing on two legs, max cute factor." },
      { value: "Playful Toddler Pets (1-2 yrs)", label: "🧒 Playful Toddler Pets (1-2 yrs)", desc: "Energetic and synchronized dancers with expressive facial reactions." },
      { value: "Cute Fluffy Squad (Matching Twins)", label: "👯 Cute Fluffy Squad (Matching Twins)", desc: "Multiple identical pets in matching cosplay suits dancing in sync." },
    ],
  },
];

const ANIMAL_DANCING_SPECIES_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🐾 Animal & Species Setup",
    options: [
      { value: "5 Cute Kittens Line Dance (Strawberry, Bee, Cowboy, Dino, Pirate)", label: "🐱 5 Kittens Line Dance (Cat.mp4 Iconic Squad)", desc: "5 cute kittens standing in a row wearing Strawberry hood, Bee, Cowboy, Dino, and Pirate suits." },
      { value: "Solo White Kitten in Strawberry Outfit", label: "🍓 Solo White Kitten in Strawberry Hood & Crocs", desc: "Iconic white kitten in strawberry hood hat, diaper shorts, and tiny pink crocs dancing center stage." },
      { value: "Solo Golden Retriever Puppy", label: "🐶 Solo Golden Retriever Puppy", desc: "Super cute fluffy golden puppy dancing upright with floppy ears." },
      { value: "Kitten & Puppy Duet Dance", label: "🐱🐶 Kitten & Puppy Duet Squad", desc: "A kitten and a puppy dancing together side-by-side on beat." },
      { value: "Ginger Tabby Kitten Solo", label: "🐈 Ginger Tabby Kitten Solo", desc: "Handsome ginger tabby kitten performing energetic dance moves." },
      { value: "Baby Panda Bear Solo", label: "🐼 Baby Panda Bear Solo", desc: "Chubby baby panda wobbling and dancing cutely." },
      { value: "Fluffy Bunny Rabbit Squad", label: "🐰 Fluffy Bunny Rabbit Squad", desc: "Cute bunnies with long floppy ears hopping and dancing on beat." },
      { value: "French Bulldog Puppy", label: "🐶 French Bulldog Puppy", desc: "Chubby Frenchie puppy with bat ears doing beat-drop squats." },
      { value: "Cute Baby Bears Duo", label: "🐻 Cute Baby Bears Duo", desc: "Two fluffy baby bears dancing in synchronized rhythm." },
      { value: "Fox & Raccoon Dance Duo", label: "🦊🦝 Fox & Raccoon Dance Duo", desc: "Playful little fox and raccoon duo dancing together." },
      { value: "Tiny Hamster Crew", label: "🐹 Tiny Hamster Crew", desc: "Chubby fluffy hamsters dancing in mini costumes." },
    ],
  },
];

const ANIMAL_DANCING_COSTUME_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "👗 Cosplay Costume & Outfit",
    options: [
      { value: "Strawberry Hood + Pattern Shorts & Pink Crocs", label: "🍓 Strawberry Hood & Pink Crocs (Cat.mp4 Iconic)", desc: "Red strawberry hood hat with stem, patterned diaper shorts, and tiny pink crocs." },
      { value: "Yellow & Black Bumblebee Suit with Wings & Antennas", label: "🐝 Bumblebee Suit with Wings & Antennas", desc: "Striped yellow & black bumblebee onesie with tiny wings and bouncy antennas." },
      { value: "Brown Cowboy Hat, Leather Vest & Tiny Boots", label: "🤠 Cowboy Hat, Leather Vest & Boots", desc: "Mini brown cowboy hat, fringe leather vest, and tiny boots." },
      { value: "Green Dinosaur Onesie with Back Spikes", label: "🦖 Green Dinosaur Onesie (Back Spikes)", desc: "Cute green dino hood suit with yellow belly and felt back spikes." },
      { value: "Pirate Captain Hat with Skull & Crossbones & Striped Pants", label: "🏴‍☠️ Pirate Captain Hat & Striped Pants", desc: "Classic pirate tricorn hat with skull logo and red-and-white striped pants." },
      { value: "Blue Baby Shark Onesie", label: "🦈 Blue Baby Shark Onesie", desc: "Adorable blue shark hooded onesie with fin on the back." },
      { value: "White Chef Hat & Apron", label: "👨‍🍳 White Chef Hat & Apron", desc: "Tall white chef hat and tiny kitchen apron." },
      { value: "Gold Royal King Crown & Red Velvet Cape", label: "👑 Gold Royal King Crown & Red Velvet Cape", desc: "Shiny gold crown and plush red velvet cape with white faux fur." },
      { value: "Superhero Cape & Eye Mask", label: "🦸 Superhero Cape & Eye Mask", desc: "Vibrant superhero cape fluttering behind with a matching eye mask." },
      { value: "Metallic Silver Astronaut Suit", label: "👨‍🚀 Metallic Silver Astronaut Suit", desc: "Futuristic space suit with tiny helmet and patches." },
      { value: "Hawaiian Hula Grass Skirt & Floral Lei", label: "🌴 Hawaiian Hula Grass Skirt & Floral Lei", desc: "Green grass skirt with colorful flower lei necklace." },
      { value: "Martial Arts Karate Gi & Black Belt", label: "🥋 Martial Arts Karate Gi & Black Belt", desc: "White karate uniform with tiny black belt." },
    ],
  },
];

const ANIMAL_DANCING_LOCATION_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🏠 Living Room & Indoor Floors",
    options: [
      { value: "Living Room Hardwood Floor with Giant Plush Teddy Bears", label: "🧸 Living Room Hardwood Floor & Teddy Bears (Cat.mp4)", desc: "Polished hardwood floor with plush teddy bears, couch, and soft sunlight." },
      { value: "Polished Wooden Floor with Warm Indoor Sunlight", label: "🪵 Polished Wooden Floor (Sunlit)", desc: "Clean glossy hardwood floor reflecting warm golden sunlight." },
      { value: "Neon Glow Disco Dance Studio & Balloons", label: "🪩 Neon Glow Disco Studio", desc: "Vibrant dance floor with colorful neon lights and floating balloons." },
      { value: "Clean Kitchen Countertop & Bakery Counter", label: "🍳 Kitchen Countertop & Bakery", desc: "Sparkling clean kitchen counter with baking props and warm ambient light." },
    ],
  },
  {
    category: "🌴 Outdoor & Fantasy Settings",
    options: [
      { value: "Tropical Sandy Beach & Palm Trees", label: "🏖️ Tropical Sandy Beach & Palms", desc: "Sunny beach with clear turquoise ocean waves and palm trees." },
      { value: "Cherry Blossom Garden with Petals Falling", label: "🌸 Cherry Blossom Garden (Sakura)", desc: "Romantic park with pink cherry blossoms raining down." },
      { value: "Pastel Rainbow Candy Land Floor", label: "🌈 Pastel Rainbow Candy Land", desc: "Dreamy candy garden with rainbow dance floor and sweets." },
      { value: "Magical Sky Garden with Floating Clouds", label: "☁️ Magical Sky Garden & Clouds", desc: "Enchanted sky platform with soft cloud floor and starlight." },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const KIDS_AUDIO_STYLE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Voice & Audio Atmosphere",
    options: [
      { value: "Any / AI Decides", label: "Any / AI Decides (Default)", desc: "Let the AI choose the most fitting audio style for the scene." },
      { value: "Cute Baby Giggles & Babble SFX", label: "👶 Cute Baby Giggles & Babble", desc: "Adorable baby laughters, coos, giggles, and innocent babble sound FX." },
      { value: "Innocent Toddler Speech", label: "🗣️ Innocent Toddler Speech", desc: "Natural toddler speaking voice with cute pronunciation and curiosity." },
      { value: "Soft Mother/Father Narration", label: "🎙️ Soft Parent Narration (Voiceover)", desc: "Warm, loving parent story narration overlay with silent kid acting." },
      { value: "Funny High-Pitch Cartoon Voice", label: "🤡 Funny High-Pitch Cartoon Voice", desc: "Silly, playful cartoon pitch voiceover for comedic kid clips." },
    ]
  }
];

const CUTE_KIDS_PRESET_GROUPS = [
  {
    groupName: "🔥 Viral Kid Moments",
    presets: [
      {
        icon: "🍋",
        title: "First Lemon Taste",
        age: "Baby (1-2 yrs)",
        location: "Modern Kitchen",
        health: "Healthy",
        vibe: "Innocent & Curious",
        setup: "One Cute Little Girl",
        perScene: "1 Character",
        nationality: "Global / Any",
        food: "Fresh Yellow Lemon Slice 🍋",
        prop: "Highchair & Bib 👶",
        expression: "Giggles & Laughter 😄",
        performance: "Cute Reactions",
      },
      {
        icon: "🧁",
        title: "Cupcake Theft",
        age: "Toddler (2-4 yrs)",
        location: "Modern Kitchen",
        health: "Healthy",
        vibe: "Funny & Mischievous",
        setup: "One Cute Little Boy",
        perScene: "1 Character",
        nationality: "Global / Any",
        food: "Frosted Chocolate Cupcake 🧁",
        prop: "Plate & Frosting Marks 🎂",
        expression: "Shocked & Surprised 😲",
        performance: "Surprise Moments",
      },
      {
        icon: "👟",
        title: "Dad's Giant Shoes",
        age: "Early Toddler (1.5-2.5 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy",
        vibe: "Sweet & Wholesome",
        setup: "One Cute Little Girl",
        perScene: "1 Character",
        nationality: "Global / Any",
        prop: "Oversized Leather Shoes 👞",
        expression: "Proud & Happy 😁",
        performance: "Funny Actions",
      },
      {
        icon: "⛺",
        title: "Secret Blanket Fort",
        age: "Toddler (2-4 yrs)",
        location: "Cozy Bedroom Attic & Secret Fort",
        health: "Healthy",
        vibe: "Innocent & Curious",
        setup: "Brother & Sister",
        perScene: "2 Characters",
        nationality: "Global / Any",
        food: "Chocolate Chip Cookies 🍪",
        prop: "Flashlight & Pillows 🔦",
        expression: "Giggles & Laughter 😄",
        performance: "Cute Reactions",
      },
      {
        icon: "🎨",
        title: "Wall Paint Disaster",
        age: "Toddler (2-4 yrs)",
        location: "Art Studio & Paint Corner",
        health: "Healthy",
        vibe: "Funny & Mischievous",
        setup: "One Girl & One Boy",
        perScene: "2 Characters",
        nationality: "Global / Any",
        prop: "Paint Brushes & Paint Cans 🎨",
        expression: "Confused & Innocent 😕",
        performance: "Mixed Performance",
      },
    ]
  },
  {
    groupName: "Popular Combinations",
    presets: [
      {
        icon: "👬",
        title: "Friends",
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
      {
        icon: "🪁",
        title: "Brother & Sister",
        age: "Child (5-8 yrs)",
        location: "House Rooftop Kite Flying (Kotha)",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Brother & Sister",
        perScene: "2 Characters",
        nationality: "Pakistani Punjabi",
        musicType: "Punjabi Beats & Bhangra",
        dialogueStyle: "None",
      },
      {
        icon: "👫",
        title: "Boy & Girl",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy",
        vibe: "Cheerful & Energetic",
        setup: "One Girl & One Boy",
        perScene: "2 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🇵🇰",
        title: "14 August Song",
        age: "Child (5-8 yrs)",
        location: "City Street / Road",
        health: "Healthy & Active",
        vibe: "Patriotic & Emotional",
        setup: "One Girl & One Boy",
        perScene: "2 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "National Anthem/Patriotic Song",
        clothing: "Green & White Independence Day Clothes",
        dialogueStyle: "None",
      },
    ]
  },
  {
    groupName: "Solo Characters",
    presets: [
      {
        icon: "👧",
        title: "Single Girl Solo",
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
        icon: "👦",
        title: "Single Boy Solo",
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
        icon: "👤",
        title: "1 Character Solo",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy",
        vibe: "Cheerful & Energetic",
        setup: "One Cute Little Girl",
        perScene: "1 Character",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
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
        icon: "✨",
        title: "Fairy Tale Girl",
        age: "Toddler (2-4 yrs)",
        location: "Magical Cloud Kingdom",
        health: "Healthy",
        vibe: "Rainbow Adventure",
        setup: "Little Girl with Fairy Wings",
        perScene: "1 Character",
        nationality: "Global / Any",
        musicType: "Orchestral & Grand Symphony",
        dialogueStyle: "None",
      },
      {
        icon: "🚀",
        title: "Space Explorer",
        age: "Child (5-8 yrs)",
        location: "Futuristic Space Station & Moon Base",
        health: "Healthy & Active",
        vibe: "Happy Explorer",
        setup: "Little Boy Astronaut",
        perScene: "1 Character",
        nationality: "Global / Any",
        musicType: "Cinematic Epic & Dramatic",
        dialogueStyle: "Narration Style",
      },
      {
        icon: "🎧",
        title: "Lo-Fi Story Time",
        age: "Child (5-8 yrs)",
        location: "Cozy Library & Book Nook",
        health: "Healthy",
        vibe: "Soft Pastel Style",
        setup: "Reading Little Girl",
        perScene: "1 Character",
        nationality: "Global / Any",
        musicType: "Lo-Fi Chill & Chillhop",
        dialogueStyle: "Narration Style",
      },
      {
        icon: "🪕",
        title: "Punjabi Folk Singer",
        age: "Child (5-8 yrs)",
        location: "Green Wheat & Mustard Fields",
        health: "Healthy",
        vibe: "Cheerful & Energetic",
        setup: "Punjabi Folk Singer (Jugni & Tappa)",
        perScene: "1 Character",
        nationality: "Pakistani Punjabi",
        dialogueStyle: "Poetic/Shayari",
      },
    ]
  },
  {
    groupName: "Kids & Toddler Scenes",
    presets: [
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
        icon: "🐱",
        title: "Toddler & Kitten",
        age: "Toddler (2-4 yrs)",
        location: "Cozy Home Living Room",
        health: "Happy & Healthy",
        vibe: "Cute & Playful",
        setup: "Little Girl with a Kitten",
        perScene: "2 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "Acoustic Guitar & Whistling",
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
      {
        icon: "🕌",
        title: "Eid Celebration",
        age: "Child (5-8 yrs)",
        location: "Festive Eid & Chand Raat Market",
        health: "Healthy",
        vibe: "Cheerful & Energetic",
        setup: "Two Girl Friends (Best Friends)",
        perScene: "2 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "Nasheed / Vocal Only",
        dialogueStyle: "Emotional",
      },
    ]
  },
  {
    groupName: "Performances & Couples",
    presets: [
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
        icon: "🎸",
        title: "Coke Studio Jam",
        age: "Child (5-8 yrs)",
        location: "Traditional Heritage Haveli",
        health: "Healthy & Active",
        vibe: "Positive Energy",
        setup: "Boy & Girl Singer Duet",
        perScene: "2 Characters",
        nationality: "Pakistani Punjabi",
        musicType: "Coke Studio Style Fusion",
        dialogueStyle: "Poetic/Shayari",
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
        icon: "👰‍♀️",
        title: "Dulha & Dulhan",
        age: "Young Adult (18-24 yrs)",
        location: "Traditional Heritage Haveli",
        health: "Happy & Healthy",
        vibe: "Romantic",
        setup: "Dulha & Dulhan (Bride & Groom Couple)",
        perScene: "2 Characters",
        nationality: "Pakistani (General / Desi)",
        musicType: "Sufi Qawwali & Harmonium",
        dialogueStyle: "Poetic/Shayari",
      },
    ]
  }
,
  {
    groupName: "Dialogue Presets",
    presets: [
      {
        icon: "🗣️",
        title: "Two Boys Dialogue",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Two Little Boys",
        perScene: "2 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Two Girls Dialogue",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Two Little Girls",
        perScene: "2 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Boy & Girl Dialogue",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "One Girl & One Boy",
        perScene: "2 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Three Boys Dialogue",
        age: "Child (5-8 yrs)",
        location: "Desi Dhaba & Roadside Chai Stall",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Three Boy Friends (Trio Squad)",
        perScene: "3 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Three Girls Dialogue",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Three Girl Friends (Trio Squad)",
        perScene: "3 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Two Boys & One Girl",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Two Boys & One Girl",
        perScene: "3 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Two Girls & One Boy",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Two Girls & One Boy",
        perScene: "3 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Brother & Sister Dialogue",
        age: "Child (5-8 yrs)",
        location: "Cozy Home Living Room",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Brother & Sister",
        perScene: "2 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Friends Dialogue",
        age: "Child (5-8 yrs)",
        location: "Desi Primary School Classroom",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Two Kids (Friends)",
        perScene: "2 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
      {
        icon: "🗣️",
        title: "Classmates Dialogue",
        age: "Child (5-8 yrs)",
        location: "Desi Primary School Classroom",
        health: "Healthy & Active",
        vibe: "Cheerful & Energetic",
        setup: "Classmates",
        perScene: "2 Characters",
        nationality: "Global / Any",
        musicType: "None",
        dialogueStyle: "None",
      },
    ]
  }
];

const FATHER_CLOTHING_OPTIONS = [
  "AI Decides",
  "Traditional White Kurta Shalwar",
  "Casual Polo & Denim Jeans",
  "Waistcoat & Embroidered Kurta",
  "Classic Sherwani",
  "Tracksuit & Loungewear",
  "Formal Suit & Tie",
  "Custom",
];

const MOTHER_CLOTHING_OPTIONS = [
  "AI Decides",
  "Traditional Embroidered Lawn Suit",
  "Simple Cotton Shalwar Kameez",
  "Elegant Silk Suit with Silk Dupatta",
  "Abaya & Hijab",
  "Casual Home Loungewear",
  "Saree / Festive Wear",
  "Custom",
];

// ── SONG & SHAYARI OPTION GROUPS (FULL AGE RANGE 6-9 YRS TO OLD MAN) ──
const SONG_AGE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Performers Age Ranges (Child 6-9 to Old Man Legend)",
    options: [
      { value: "Child Singer (6-9 yrs)", label: "👦 Child Singer (6-9 yrs)", desc: "Talented young child singer or prodigy performer." },
      { value: "Pre-Teen & Teen (10-17 yrs)", label: "🧑 Pre-Teen & Teen Singer (10-17 yrs)", desc: "Youthful teenage vocalist with fresh energy and style." },
      { value: "Young Adult (18-24 yrs)", label: "👤 Young Adult Singer (18-24 yrs)", desc: "Youthful singer or shayara with vibrant romantic energy." },
      { value: "Adult (25-35 yrs)", label: "🎩 Adult Vocalist (25-35 yrs)", desc: "Experienced adult artist with deep melodic vocal presence." },
      { value: "Mature Master (36-50 yrs)", label: "🌟 Mature Master Singer (36-50 yrs)", desc: "Mature artist with classic elegance and rich emotional tone." },
      { value: "Senior Maestro (51-65 yrs)", label: "🔮 Senior Maestro Singer (51-65 yrs)", desc: "Experienced maestro ghazal singer or traditional Qawwal master." },
      { value: "Old Man Legend (65+ yrs)", label: "👴 Old Man Legend (65+ yrs)", desc: "Venerable old man Sufi singer, folk legend, or elder Shayar." },
      { value: "Multi-Generational Duet", label: "👥 Multi-Generational Duet", desc: "Duet pairing young and senior/old man artists together." },
    ],
  },
];

const SONG_CROWD_FX_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Background Noise & Audience Sound Effects",
    options: [
      { value: "AI Decides", label: "🤖 AI Decides (Default)", desc: "Let the AI pick the most fitting background audience sound for the scene automatically." },
      { value: "DISABLED (Quiet Studio - Default)", label: "🚫 DISABLED (Quiet Studio)", desc: "No background noise or audience Wah Wah. Pure clean studio voice." },
      { value: "Live Mushaira Crowd (Wah Wah & Irshad)", label: "👏 Live Mushaira Crowd (Wah Wah & Irshad)", desc: "Authentic audience reactions shouting Wah Wah! and Irshad! during pauses." },
      { value: "Concert Crowd Cheering & Clapping", label: "🏟️ Concert Crowd Cheering & Clapping", desc: "Live concert arena crowd cheering and applauding." },
      { value: "Desi Mehfil Dholak & Clapping", label: "🥁 Desi Mehfil Dholak & Clapping", desc: "Traditional rhythmic hand clapping and warm Dholak room ambience." },
      { value: "Simple Rhythmic Claps", label: "👏 Simple Rhythmic Claps", desc: "Basic rhythmic hand clapping on the beat." },
      { value: "Polite Applause", label: "👏 Polite Audience Applause", desc: "Soft, polite clapping from a small audience." },
      { value: "Finger Snaps", label: "🫰 Finger Snaps & Acoustic Vibe", desc: "Acoustic café style finger snapping on beat." },
      { value: "Vintage Tape Hiss & Vinyl Crackle", label: "📻 Vintage Tape Hiss & Vinyl Crackle", desc: "Nostalgic retro lofi vinyl crackle and warm studio tape haze." },
      { value: "Rain & Cozy Fireside Ambience", label: "🌧️ Rain & Cozy Fireside Ambience", desc: "Gentle rain tapping on window and crackling fireplace warmth." },
    ],
  },
];


const SONG_PRESETS = [
  {
    icon: "🎵",
    title: "Romantic 2-Liner",
    age: "Young Adult (18-24 yrs)",
    location: "Sunset Rooftop & City Skyline 🌇",
    vibe: "Romantic & Soulful",
    setup: "Solo Adult Female Singer 👩‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    musicType: "Acoustic Guitar & Whistling",
    dialogueStyle: "Poetic/Shayari",
  },
  {
    icon: "🎤",
    title: "Urdu Shayari Mehfil",
    age: "Adult (25-35 yrs)",
    location: "Traditional Heritage Haveli",
    vibe: "Poetic Shayari Mehfil",
    setup: "Male & Female Duet (Shayar & Singer)",
    perScene: "2 Characters",
    nationality: "Pakistani Muhajir / Urdu Speaking",
    musicType: "Desi Classical Sitar & Tabla",
    dialogueStyle: "Poetic/Shayari",
  },
  {
    icon: "🎧",
    title: "Lo-Fi Sunset Jam",
    age: "Young Adult (18-24 yrs)",
    location: "Rainy Window Coffee Shop ☕",
    vibe: "Aesthetic Lo-Fi Chill",
    setup: "Singer + Acoustic Guitarist",
    perScene: "2 Characters",
    nationality: "Global / Any",
    musicType: "Lo-Fi Chill & Chillhop",
    dialogueStyle: "None",
  },
  {
    icon: "👰‍♀️",
    title: "Dulha & Dulhan Ghazal",
    age: "Young Adult (18-24 yrs)",
    location: "Traditional Heritage Haveli",
    vibe: "Romantic & Soulful",
    setup: "Dulha & Dulhan (Bride & Groom)",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    musicType: "Sufi Qawwali & Harmonium",
    dialogueStyle: "Poetic/Shayari",
  },
  {
    icon: "🎸",
    title: "Coke Studio Duet",
    age: "Adult (25-35 yrs)",
    location: "Coke Studio Fusion Stage 🎸",
    vibe: "Coke Studio Fusion Vibe",
    setup: "Male & Female Duet (Shayar & Singer)",
    perScene: "2 Characters",
    nationality: "Pakistani Punjabi",
    musicType: "Coke Studio Style Fusion",
    dialogueStyle: "Poetic/Shayari",
  },
  {
    icon: "🪕",
    title: "Punjabi Tappa Folk",
    age: "Adult (25-35 yrs)",
    location: "Golden Mustard & Wheat Fields 🌾",
    vibe: "Romantic & Soulful",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani Punjabi",
    musicType: "Punjabi Tappa & Dholak",
    dialogueStyle: "Poetic/Shayari",
  },
  {
    icon: "🌧️",
    title: "Rainy Window Sad Shayari",
    age: "Adult (25-35 yrs)",
    location: "Rainy Bedroom Window 🌧️",
    vibe: "Deep Emotional & Heartbroken (Sad Shayari)",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani Muhajir / Urdu Speaking",
    musicType: "Bansuri Flute & Ambient Nature",
    dialogueStyle: "Poetic/Shayari",
  },
  {
    icon: "🕌",
    title: "Sufi Qawwali Party",
    age: "Mature Adult (36-45 yrs)",
    location: "Traditional Heritage Haveli",
    vibe: "Sufi Mystical & Spiritual",
    setup: "Qawwali Group (Qawwal Party)",
    perScene: "3 Characters",
    nationality: "Pakistani Punjabi",
    musicType: "Sufi Qawwali & Harmonium",
    dialogueStyle: "Poetic/Shayari",
  },
  {
    icon: "🌹",
    title: "Rose Garden Romantic Shayari",
    age: "Young Adult (18-24 yrs)",
    location: "Blooming Rose Garden at Golden Hour 🌹",
    vibe: "Romantic & Soulful",
    setup: "Male Poet Recites + Girl Listens & Admires 🎤👁️",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Man & Girl Combo: Kurta Waistcoat & Anarkali Frock 👫",
    musicType: "Acoustic Guitar & Whistling",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "AI Decides",
    faceType: "Rugged Stubble & Groomed Beard 🧔",
  },
  {
    icon: "🌕",
    title: "Moonlit Palace Duet",
    age: "Adult (25-35 yrs)",
    location: "Moonlit Palace Rooftop Terrace 🌕",
    vibe: "Romantic & Soulful",
    setup: "Man Shayar & Girl Shayara Duo 🎤",
    perScene: "2 Characters",
    nationality: "Pakistani Muhajir / Urdu Speaking",
    clothing: "Man & Girl Combo: Royal Sherwani & Embellished Lehenga 👑",
    musicType: "Desi Classical Sitar & Tabla",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "AI Decides",
    faceType: "Classic Urdu Shayar Full Beard 🕌",
  },
  {
    icon: "🌸",
    title: "Sakura Blossom Ghazal",
    age: "Young Adult (18-24 yrs)",
    location: "Cherry Blossom Garden (Sakura) 🌸",
    vibe: "Romantic & Soulful",
    setup: "Female Poet Recites + Man Listens & Admires 🎤🧔",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Man & Girl Combo: Acoustic Sweaters & Wool Scarves 🧣",
    musicType: "Soft Acoustic Guitar Melody",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "AI Decides",
    faceType: "Graceful Desi Female (Large Expressive Eyes) 👁️",
  },
  {
    icon: "❄️",
    title: "Snow Cabin Heartbreak Shayari",
    age: "Adult (25-35 yrs)",
    location: "Snow-Capped Mountain Cabin & Fireplace ❄️🔥",
    vibe: "Deep Emotional & Heartbroken (Sad Shayari)",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Knit Turtleneck & Wool Scarf 🧣",
    musicType: "Bansuri Flute & Ambient Nature",
    dialogueStyle: "Sad / Heartbreak Shayari",
    crowdFx: "DISABLED (Quiet Studio - Default)",
    faceType: "Dense Salt-and-Pepper Beard (40s-50s) 🧔‍♂️",
  },
  {
    icon: "🚣",
    title: "Shikara Moonlit Lake Mehfil",
    age: "Adult (25-35 yrs)",
    location: "Lakeside Boat Mehfil (Shikara / Dal Lake) 🚣",
    vibe: "Poetic Shayari Mehfil",
    setup: "Male Poet Recites + Girl Listens & Admires 🎤👁️",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Man & Girl Combo: Kurta Waistcoat & Anarkali Frock 👫",
    musicType: "Desi Classical Sitar & Tabla",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "AI Decides",
    faceType: "Classic Urdu Shayar Full Beard 🕌",
  },
  {
    icon: "🍷",
    title: "Rooftop Candlelight Romance",
    age: "Young Adult (18-24 yrs)",
    location: "Rooftop Candlelight Dinner Setup 🍷🕯️",
    vibe: "Romantic & Soulful",
    setup: "Female Poet Recites + Man Listens & Admires 🎤🧔",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Man & Girl Combo: Suit & Elegant Gown 👔👗",
    musicType: "Acoustic Guitar & Whistling",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "AI Decides",
    faceType: "Western High-Fashion Model Face 💃",
  },
  {
    icon: "🌄",
    title: "Desert Dunes Sad Shayar",
    age: "Mature Adult (36-45 yrs)",
    location: "Desert Dunes at Sunset with Bonfire 🌄🔥",
    vibe: "Very Sad & Heartbroken Mehfil (Shayari of Grief & Loss) 💔😭",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Traditional Shalwar Kameez & Waistcoat 👔",
    musicType: "Bansuri Flute & Ambient Nature",
    dialogueStyle: "Sad / Heartbreak Shayari",
    crowdFx: "DISABLED (Quiet Studio - Default)",
    faceType: "Regal Mughal & Royal Features 👑",
  },
  {
    icon: "🤭",
    title: "Playful Romantic Tease",
    age: "Young Adult (18-24 yrs)",
    location: "Sunset Rooftop & City Skyline 🌇",
    vibe: "Shy, Playful & Naughty 😏💖",
    setup: "Female Poet Recites + Man Listens & Admires 🎤🧔",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Man & Girl Combo: Kurta Waistcoat & Anarkali Frock 👫",
    musicType: "Acoustic Guitar & Whistling",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "AI Decides",
    faceType: "Shy & Naughty Playful Expression 😏😳",
  },
  {
    icon: "🌸",
    title: "Shy Confession Song",
    age: "Young Adult (18-24 yrs)",
    location: "Cherry Blossom Garden (Sakura) 🌸",
    vibe: "Shy, Playful & Naughty 😏💖",
    setup: "Solo Adult Female Singer 👩‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    musicType: "Soft Acoustic Guitar Melody",
    dialogueStyle: "Two-Liner Romantic Song",
    crowdFx: "DISABLED (Quiet Studio - Default)",
    faceType: "Shy & Naughty Playful Expression 😏😳",
  },
];

const POETRY_PRESETS = [
  {
    icon: "📖",
    title: "Classic Urdu Ghazal Mehfil",
    age: "Adult (25-35 yrs)",
    location: "Traditional Heritage Haveli",
    vibe: "Poetic Shayari Mehfil",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani Muhajir / Urdu Speaking",
    musicType: "Desi Classical Sitar & Tabla",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "Live Mushaira Crowd (Wah Wah & Irshad)",
  },
  {
    icon: "😂",
    title: "Funny Satirical Shayar",
    age: "Adult (25-35 yrs)",
    location: "Bustling Desi Bazaar & Street Market",
    vibe: "Funny & Humorous Shayari (Tanzo Mazah)",
    setup: "Funny Comedic Shayar (Tanzo Mazah Poet) 😂",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    musicType: "None",
    dialogueStyle: "Funny Satirical Shayari (Tanzo Mazah)",
    crowdFx: "Live Mushaira Crowd (Wah Wah & Irshad)",
  },
  {
    icon: "💔",
    title: "Heartbreak Sad Shayari",
    age: "Young Adult (18-24 yrs)",
    location: "Rainy Window Coffee Shop ☕",
    vibe: "Deep Emotional & Heartbroken (Sad Shayari)",
    setup: "Solo Adult Female Singer 👩‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    musicType: "Bansuri Flute & Ambient Nature",
    dialogueStyle: "Sad / Heartbreak Shayari",
    crowdFx: "Rain & Cozy Fireside Ambience",
  },
  {
    icon: "🕌",
    title: "Sufi Mystical Kalam",
    age: "Senior Maestro (51-65 yrs)",
    location: "Old City Street & Mughal Architecture",
    vibe: "Sufi Mystical & Spiritual",
    setup: "Qawwali Group (Qawwal Party)",
    perScene: "3 Characters",
    nationality: "Pakistani Sufi / Punjabi",
    musicType: "Sufi Instrumental Flute & Rubab",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "Desi Mehfil Dholak & Clapping",
  },
  {
    icon: "👴",
    title: "Old Man Legend Shayari",
    age: "Old Man Legend (65+ yrs)",
    location: "Vintage Library & Fireplace 📚",
    vibe: "Poetic Shayari Mehfil",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani Muhajir / Urdu Speaking",
    musicType: "Desi Classical Sitar & Tabla",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "Live Mushaira Crowd (Wah Wah & Irshad)",
  },
  {
    icon: "🥀",
    title: "Solitary Candlelit Tanhai",
    age: "Young Adult (18-24 yrs)",
    location: "Candlelit Solitary Room (Tanhai / Solitary Room) 🕯️",
    vibe: "Lonely & Isolated Solitude (Tanhai / Solemn Isolation) 🌧️🥀",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Simple Button-Down Shirt & Dark Trousers (Sad/Lonely Poet) 👔",
    musicType: "Soft Acoustic Guitar Melody",
    dialogueStyle: "Sad / Heartbreak Shayari",
    crowdFx: "DISABLED (Quiet Studio - Default)",
  },
  {
    icon: "🪑",
    title: "Lonely Man on Park Bench",
    age: "Adult (25-35 yrs)",
    location: "Solitary Bench in Misty Autumn Park 🍁",
    vibe: "Lonely & Isolated Solitude (Tanhai / Solemn Isolation) 🌧️🥀",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Overcoat & Scarf (Lonely Park Walk) 🧥",
    musicType: "Soft Acoustic Guitar Melody",
    dialogueStyle: "Sad / Heartbreak Shayari",
    crowdFx: "DISABLED (Quiet Studio - Default)",
    faceType: "Rugged Stubble & Groomed Beard 🧔",
  },
  {
    icon: "☕",
    title: "Rainy Window Café Solitude",
    age: "Young Adult (18-24 yrs)",
    location: "Rainy Window Coffee Shop ☕",
    vibe: "Deep Emotional & Heartbroken (Sad Shayari)",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Simple Button-Down Shirt & Dark Trousers (Sad/Lonely Poet) 👔",
    musicType: "Bansuri Flute & Ambient Nature",
    dialogueStyle: "Sad / Heartbreak Shayari",
    crowdFx: "Rain & Cozy Fireside Ambience",
    faceType: "Western Rockstar Undercut & Stubble 🎸",
  },
  {
    icon: "🏮",
    title: "Late Night Streetlamp Walk",
    age: "Adult (25-35 yrs)",
    location: "Vintage European Cobblestone Street 🇫🇷🌙",
    vibe: "Lonely & Isolated Solitude (Tanhai / Solemn Isolation) 🌧️🥀",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Overcoat & Scarf (Lonely Park Walk) 🧥",
    musicType: "Soft Acoustic Guitar Melody",
    dialogueStyle: "Sad / Heartbreak Shayari",
    crowdFx: "DISABLED (Quiet Studio - Default)",
  },
  {
    icon: "🌅",
    title: "Sunset Rooftop Romantic Duo",
    age: "Young Adult (18-24 yrs)",
    location: "Sunset Rooftop & City Skyline 🌇",
    vibe: "Romantic & Soulful",
    setup: "Male Poet Recites + Girl Listens & Admires 🎤👁️",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Man & Girl Combo: Kurta Waistcoat & Anarkali Frock 👫",
    musicType: "Acoustic Guitar & Whistling",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "AI Decides",
    faceType: "Rugged Stubble & Groomed Beard 🧔",
  },
  {
    icon: "🏜️",
    title: "Desert Bonfire Romantic Shayari",
    age: "Adult (25-35 yrs)",
    location: "Desert Dunes at Sunset with Bonfire 🌄🔥",
    vibe: "Romantic & Soulful",
    setup: "Male Poet Recites + Girl Listens & Admires 🎤👁️",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Man & Girl Combo: Kurta Waistcoat & Anarkali Frock 👫",
    musicType: "Sufi Instrumental Flute & Rubab",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "AI Decides",
  },
  {
    icon: "🕌",
    title: "Grand Floor Mehfil (Gaddi & Masnad)",
    age: "Adult (25-35 yrs)",
    location: "Mehfil Stage with Carpet & Bolster Pillows (محفل کی رونک) 🕌",
    vibe: "Poetic Shayari Mehfil",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani Muhajir / Urdu Speaking",
    clothing: "Male Traditional Shalwar Kameez & Waistcoat 👔",
    musicType: "Desi Classical Sitar & Tabla",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "Live Mushaira Crowd (Wah Wah & Irshad)",
  },
  {
    icon: "👑",
    title: "Mughal Courtyard Royal Mehfil",
    age: "Mature Adult (36-45 yrs)",
    location: "Royal Mughal Courtyard Mehfil 👑",
    vibe: "Poetic Shayari Mehfil",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani Muhajir / Urdu Speaking",
    clothing: "Male Royal Embroidered Sherwani 👑",
    musicType: "Desi Classical Sitar & Tabla",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "Live Mushaira Crowd (Wah Wah & Irshad)",
    faceType: "Regal Mughal & Royal Features 👑",
  },
  {
    icon: "🌹",
    title: "Rose Garden Male Poet",
    age: "Young Adult (18-24 yrs)",
    location: "Blooming Rose Garden at Golden Hour 🌹",
    vibe: "Romantic & Soulful",
    setup: "Male Poet Recites + Girl Listens & Admires 🎤👁️",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Man & Girl Combo: Kurta Waistcoat & Anarkali Frock 👫",
    musicType: "Acoustic Guitar & Whistling",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "AI Decides",
    faceType: "Rugged Stubble & Groomed Beard 🧔",
  },
  {
    icon: "🎤",
    title: "Female Poet — Candlelit Library",
    age: "Young Adult (18-24 yrs)",
    location: "Candlelit Indoor Library & Books 🕯️📚",
    vibe: "Romantic & Soulful",
    setup: "Female Poet Recites + Man Listens & Admires 🎤🧔",
    perScene: "2 Characters",
    nationality: "Pakistani Muhajir / Urdu Speaking",
    clothing: "Man & Girl Combo: Acoustic Sweaters & Wool Scarves 🧣",
    musicType: "Soft Acoustic Guitar Melody",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "AI Decides",
    faceType: "Graceful Desi Female (Large Expressive Eyes) 👁️",
  },
  {
    icon: "🌧️",
    title: "Rainy Terrace Midnight Tanhai",
    age: "Young Adult (18-24 yrs)",
    location: "Terrace with City View & Rain 🌧️🏙️",
    vibe: "Melancholic Midnight Rain (Ghamgina Shayari) 🌙🌧️",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Unbuttoned Linen Shirt & Rolled Sleeves (Heartbroken) 💔",
    musicType: "Bansuri Flute & Ambient Nature",
    dialogueStyle: "Sad / Heartbreak Shayari",
    crowdFx: "DISABLED (Quiet Studio - Default)",
    faceType: "Rugged Stubble & Groomed Beard 🧔",
  },
  {
    icon: "🍂",
    title: "Autumn Forest Solo Ghazal",
    age: "Adult (25-35 yrs)",
    location: "Autumn Leaf Forest Path 🍂🌲",
    vibe: "Lonely & Isolated Solitude (Tanhai / Solemn Isolation) 🌧️🥀",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Simple Button-Down Shirt & Dark Trousers (Sad/Lonely Poet) 👔",
    musicType: "Soft Acoustic Guitar Melody",
    dialogueStyle: "Sad / Heartbreak Shayari",
    crowdFx: "DISABLED (Quiet Studio - Default)",
    faceType: "Dense Salt-and-Pepper Beard (40s-50s) 🧔‍♂️",
  },
  {
    icon: "🛶",
    title: "Shikara Romantic Duo",
    age: "Adult (25-35 yrs)",
    location: "Lakeside Boat Mehfil (Shikara / Dal Lake) 🚣",
    vibe: "Romantic & Soulful",
    setup: "Male Poet Recites + Girl Listens & Admires 🎤👁️",
    perScene: "2 Characters",
    nationality: "Pakistani Muhajir / Urdu Speaking",
    clothing: "Man & Girl Combo: Royal Sherwani & Embellished Lehenga 👑",
    musicType: "Desi Classical Sitar & Tabla",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "AI Decides",
    faceType: "Classic Urdu Shayar Full Beard 🕌",
  },
  {
    icon: "🌙",
    title: "Desi Rooftop Moonlight Mehfil",
    age: "Adult (25-35 yrs)",
    location: "Desi Rooftop Mehfil under Moonlight 🌙",
    vibe: "Poetic Shayari Mehfil",
    setup: "Male Poet Recites + Girl Listens & Admires 🎤👁️",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Man & Girl Combo: Kurta Waistcoat & Anarkali Frock 👫",
    musicType: "Desi Classical Sitar & Tabla",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "Live Mushaira Crowd (Wah Wah & Irshad)",
    faceType: "Classic Urdu Shayar Full Beard 🕌",
  },
  {
    icon: "😏",
    title: "Naughty Shayari Tease",
    age: "Young Adult (18-24 yrs)",
    location: "Desi Rooftop Mehfil under Moonlight 🌙",
    vibe: "Shy, Playful & Naughty 😏💖",
    setup: "Girl Recites Shayari + Man Admires 🎤👁️",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Man & Girl Combo: Acoustic Sweaters & Wool Scarves 🧣",
    musicType: "Desi Classical Sitar & Tabla",
    dialogueStyle: "Poetic/Shayari",
    crowdFx: "Live Mushaira Crowd (Wah Wah & Irshad)",
    faceType: "Shy & Naughty Playful Expression 😏😳",
  },
  {
    icon: "😉",
    title: "Playful Witty Ghazal",
    age: "Adult (25-35 yrs)",
    location: "Traditional Heritage Haveli",
    vibe: "Funny & Humorous Shayari (Tanzo Mazah)",
    setup: "Man Shayar & Girl Shayara Duo 🎤",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Man & Girl Combo: Royal Sherwani & Embellished Lehenga 👑",
    musicType: "None",
    dialogueStyle: "Funny Satirical Shayari (Tanzo Mazah)",
    crowdFx: "Live Mushaira Crowd (Wah Wah & Irshad)",
    faceType: "Shy & Naughty Playful Expression 😏😳",
  },
];

const COMMERCIAL_AD_PRESETS = [
  {
    icon: "🧴",
    title: "Skincare UGC Ad",
    desc: "Problem Hook → Serum Glow Demo → 20% Off CTA",
    age: "Young Adult (18-24 yrs)",
    location: "Clean Sunlit Bathroom Studio 🧴",
    vibe: "Aesthetic & Glowing",
    setup: "Solo Adult Female Model 👩‍🎤",
    perScene: "1 Character",
    nationality: "Global / Any",
    clothing: "White Cotton Robe & Silk Headband 🧖‍♀️",
    visualStyle: "UGC TikTok Style",
    customSceneDescription: "Glowing Skincare Serum (Problem: Dry Skin → Value: Instant Hydration → CTA: Tap link in bio for 20% off)",
  },
  {
    icon: "🍕",
    title: "Food & Restaurant Ad",
    desc: "Sizzling Macro Shot → Cheese Pull → Order Now",
    age: "Adult (25-35 yrs)",
    location: "Bustling Gourmet Kitchen & Bistro 🍕",
    vibe: "Mouthwatering & Energetic",
    setup: "Charismatic Chef & Foodie Presenter 👨‍🍳",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Black Chef Apron & Denim Shirt 👨‍🍳",
    visualStyle: "Photorealistic 8K Commercial",
    customSceneDescription: "Artisanal Gourmet Pizza (Hook: Sizzling melted cheese pull → Demo: Wood-fired crust → CTA: Order on Foodpanda now)",
  },
  {
    icon: "🏎️",
    title: "Luxury Perfume Pitch",
    desc: "Cinematic Moody Lighting → Spray Macro → Shop Collection",
    age: "Adult (25-35 yrs)",
    location: "Moonlit Palace Rooftop Terrace 🌕",
    vibe: "Luxury & Mysterious",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Global / Any",
    clothing: "Black Velvet Smoking Jacket & Silk Gown 🤵‍♀️",
    visualStyle: "Cinematic Luxury Ad",
    customSceneDescription: "Royal Oud & Rose Fragrance (Hook: Mist bottle spray close-up → Pitch: Sensual allure → CTA: Visit store today)",
  },
  {
    icon: "📱",
    title: "SaaS App & Software Promo",
    desc: "Frustrated Creator → 1-Click Solution → Free Trial",
    age: "Young Adult (18-24 yrs)",
    location: "Modern Sunlit Co-Working Office 💻",
    vibe: "Productive & Tech",
    setup: "Solo Adult Male Creator 👨‍💻",
    perScene: "1 Character",
    nationality: "Global / Any",
    clothing: "Casual Grey Hoodie & Glasses 👓",
    visualStyle: "UGC TikTok Style",
    customSceneDescription: "AI Video Editing App (Hook: Hours of manual editing → Solution: 1-Click AI Magic → CTA: Start 7-Day Free Trial)",
  },
  {
    icon: "👗",
    title: "Fashion & Clothing Ad",
    desc: "Street Jump Cuts → Outfit Transitions → Shop Collection",
    age: "Young Adult (18-24 yrs)",
    location: "Vintage European Cobblestone Alley 🌙",
    vibe: "Trendy & High-Fashion",
    setup: "Female Fashion Influencer 👗",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Embroidered Velvet Festive Anarkali 🥻",
    visualStyle: "Photorealistic 8K Commercial",
    customSceneDescription: "Festive Lawn Collection (Hook: Snap-turn outfit change → Demo: Fabric motion & embroidery details → CTA: Shop New Drops)",
  },
  {
    icon: "🏠",
    title: "Real Estate & Tour Pitch",
    desc: "Grand Door Entrance → Skyline View → Book Private Tour",
    age: "Adult (25-35 yrs)",
    location: "Sunset Rooftop & City Skyline 🌇",
    vibe: "Opulent & Premium",
    setup: "Professional Real Estate Agent 👔",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Crisp Charcoal Navy Suit & Watch ⌚",
    visualStyle: "Photorealistic 8K Commercial",
    customSceneDescription: "Penthouse Apartment Tour (Hook: Floor-to-ceiling city skyline view → Pitch: Smart home features → CTA: DM for Private Tour)",
  },
];

const SHORT_CLIP_PRESETS = [
  {
    icon: "❤️",
    title: "Love Story",
    desc: "Bench → Meeting → Happy Duo",
    age: "Adult (25-35 yrs)",
    location: "Solitary Bench in Misty Autumn Park 🍁",
    vibe: "Romantic & Heartfelt",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Navy Overcoat & Female White Sweater 🧥👗",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🌧️",
    title: "Sad → Happy",
    desc: "Heartbreak to Joyous Reconnection",
    age: "Adult (25-35 yrs)",
    location: "Rainy Window Coffee Shop ☕",
    vibe: "Sad → Happy Emotional Arc",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Black Leather Jacket & Female Crimson Scarf 🧥🧣",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "👨‍👩‍👧",
    title: "Family Moment",
    desc: "Warm Household Gathering & Joy",
    age: "Adult (25-35 yrs)",
    location: "Cozy Heritage Living Room 🛋️",
    vibe: "Wholesome & Heartwarming",
    setup: "Family Group (Parents & Child) 👨‍👩‍👧",
    perScene: "3 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Traditional Shalwar Kameez & Warm Shawls 🥻",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🤝",
    title: "Friendship",
    desc: "Loyal Companions Through Rain & Sun",
    age: "Adult (25-35 yrs)",
    location: "Vintage Urban Rooftop at Sunset 🌇",
    vibe: "Loyal & Emotional Friendship",
    setup: "Two Best Friends (Male Duo) 👨‍👦",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Casual Denim Jackets & Warm Hoodies 🧥",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🥺",
    title: "Emotional Story",
    desc: "Silent Look to Warm Embrace",
    age: "Adult (25-35 yrs)",
    location: "Candlelit Solitary Room (Tanhai / Solitary Room) 🕯️",
    vibe: "Deep Emotional Devastation & Comfort",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Charcoal Sherwani & Female Ivory Muslin Dupatta 🥋",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "⏳",
    title: "Before & After",
    desc: "Struggle to Triumphant Success",
    age: "Adult (25-35 yrs)",
    location: "Old City Street & Mughal Architecture",
    vibe: "Nostalgic & Triumphant",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Simple Faded Kurta → Crisp Charcoal Suit 👔",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "⚔️",
    title: "Meet → Conflict → Happy Ending",
    desc: "Chance Meeting, Misunderstanding & Reunion",
    age: "Adult (25-35 yrs)",
    location: "Vintage Railway Platform at Dusk 🚉",
    vibe: "Dramatic Conflict & Happy Reunion",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Overcoat & Female Floral Muslin Suit 🧥🥻",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🧸",
    title: "Childhood Memories",
    desc: "Past Playtime Flashback to Adult Reconnection",
    age: "Adult (25-35 yrs)",
    location: "Kashmiri Apple Orchard in Bloom 🍎🌸",
    vibe: "Nostalgic Childhood Flashback",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Traditional Woolen Pheran & Kashmiri Embroidered Shawl 🥻",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "😂",
    title: "Funny Story",
    desc: "Playful Misunderstanding & Comedic Reaction",
    age: "Adult (25-35 yrs)",
    location: "Bustling Desi Bazaar & Street Market",
    vibe: "Witty & Hilarious Banter",
    setup: "Funny Comedic Shayar (Tanzo Mazah Poet) 😂",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Bright Color-Blocked Jackets & Waistcoats 🦺",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🎬",
    title: "Cinematic Story",
    desc: "Foggy Suspense to Dramatic Push-in Reveal",
    age: "Adult (25-35 yrs)",
    location: "Foggy Mountain Ridge at Twilight 🏔️",
    vibe: "Epic & Atmospheric",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Dark Tactical Trenchcoat & Scarf 🧥",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "☕",
    title: "Cozy Café Conversation",
    desc: "Warm Coffee Shop Dialogue & Shared Smiles",
    age: "Young Adult (18-24 yrs)",
    location: "Rainy Window Coffee Shop ☕",
    vibe: "Cozy & Intimate",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Wool Sweaters & Warm Scarves 🧣",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🌅",
    title: "Sunset Rooftop Reunion",
    desc: "Golden Hour Skyline Embrace & Reunion",
    age: "Adult (25-35 yrs)",
    location: "Sunset Rooftop & City Skyline 🌇",
    vibe: "Romantic & Soulful",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Man & Girl Combo: Kurta Waistcoat & Anarkali Frock 👫",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🍁",
    title: "Autumn Park Bench Reflection",
    desc: "Misty Leaf Path Walk & Solitary Deep Thought",
    age: "Adult (25-35 yrs)",
    location: "Solitary Bench in Misty Autumn Park 🍁",
    vibe: "Lonely & Isolated Solitude (Tanhai / Solemn Isolation) 🌧️🥀",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Overcoat & Scarf (Lonely Park Walk) 🧥",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🌧️",
    title: "Rainy Window Solitude",
    desc: "Faded Light & Raindrops on Glass Window",
    age: "Young Adult (18-24 yrs)",
    location: "Terrace with City View & Rain 🌧️🏙️",
    vibe: "Melancholic Midnight Rain (Ghamgina Shayari) 🌙🌧️",
    setup: "Solo Adult Female Singer 👩‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Simple Silk Dupatta & Soft Muslin Suit 🥻",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🕌",
    title: "Heritage Haveli Courtyard",
    desc: "Urdu Calligraphy & Candlelit Archways",
    age: "Adult (25-35 yrs)",
    location: "Traditional Heritage Haveli",
    vibe: "Poetic Shayari Mehfil",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani Muhajir / Urdu Speaking",
    clothing: "Male Charcoal Sherwani 🥋",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🚂",
    title: "Vintage Station Goodbye",
    desc: "Emotional Train Platform Departure & Wave",
    age: "Adult (25-35 yrs)",
    location: "Vintage Railway Platform at Dusk 🚉",
    vibe: "Bittersweet Farewell",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Male Woolen Trenchcoat & Female Floral Shawl 🧥🥻",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🌸",
    title: "Cherry Blossom Orchard Walk",
    desc: "Petal-Filled Breeze & Playful Moment",
    age: "Young Adult (18-24 yrs)",
    location: "Kashmiri Apple Orchard in Bloom 🍎🌸",
    vibe: "Dreamy & Romantic",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Soft Pastels & Kashmiri Embroidered Suits 🥻",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🏜️",
    title: "Desert Bonfire Twilight",
    desc: "Sand Dunes & Flickering Campfire Glow",
    age: "Adult (25-35 yrs)",
    location: "Desert Dunes at Sunset with Bonfire 🌄🔥",
    vibe: "Mystical & Warm",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Traditional Embroidered Shawls & Kurtas 🥻",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🕯️",
    title: "Candlelit Library Study",
    desc: "Ancient Books & Quiet Shared Glances",
    age: "Young Adult (18-24 yrs)",
    location: "Candlelit Indoor Library & Books 🕯️📚",
    vibe: "Poetic & Academic",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani Muhajir / Urdu Speaking",
    clothing: "Classic Oxford Sweaters & Linen Shirts 👔",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🏙️",
    title: "City Lights Midnight Walk",
    desc: "Lit Cobblestone Streets & Starlit Skyline",
    age: "Adult (25-35 yrs)",
    location: "Vintage European Cobblestone Street 🇫🇷🌙",
    vibe: "Cinematic Solitude",
    setup: "Solo Adult Male Shayar 👨‍🎤",
    perScene: "1 Character",
    nationality: "Pakistani (General / Desi)",
    clothing: "Dark Tailored Overcoat & Scarf 🧥",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "💃",
    title: "Romantic Dance & Duet Story",
    desc: "Meeting → Slow Dance → Rain Dance → Sunset Embrace",
    age: "Young Adult (18-24 yrs)",
    location: "Sunset Rooftop & City Skyline 🌇",
    vibe: "Romantic Dance & Duet Story",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Fitting Black Tuxedo & Red Flowing Ballgown 💃🕺",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🕺",
    title: "Bollywood Musical Romance",
    desc: "Playful Dance Banter → Synchronized Duet → Reunion",
    age: "Adult (25-35 yrs)",
    location: "Kashmiri Apple Orchard in Bloom 🍎🌸",
    vibe: "Bollywood Musical Dance",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Color-Coordinated Desi Kurta & Anarkali Frock 🥻",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🌧️",
    title: "Rain Dance Romance",
    desc: "Monsoon Rain Dance → Tender Glance → Heartfelt Hug",
    age: "Young Adult (18-24 yrs)",
    location: "Terrace with City View & Rain 🌧️🏙️",
    vibe: "Monsoon Rain Dance & Romance",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Wet White Kurta & Muslin Saree 🌧️🥻",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "🪩",
    title: "Modern Rooftop Couple Dance",
    desc: "Fairy Light Night Dance → Starlit Romance",
    age: "Adult (25-35 yrs)",
    location: "Open-Air Garden Mehfil under Fairy Lights ✨",
    vibe: "Modern Rooftop Dance",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani (General / Desi)",
    clothing: "Stylish Evening Suit & Sparkling Cocktail Dress 👗",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
  {
    icon: "💃",
    title: "Classical Courtyard Dance",
    desc: "Historic Haveli Kathak Dance → Poetic Romance",
    age: "Adult (25-35 yrs)",
    location: "Traditional Heritage Haveli",
    vibe: "Classical Kathak & Haveli Romance",
    setup: "Couple (Male & Female Shayar Duo) 💑",
    perScene: "2 Characters",
    nationality: "Pakistani Muhajir / Urdu Speaking",
    clothing: "Traditional Ghungroo Anarkali & Silk Kurta Waistcoat 🥻",
    withoutMusic: true,
    withoutDialogue: true,
    isShortIdea: true,
  },
];

const SONG_LOCATION_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🏛️ Mehfil & Mushaira Settings",
    options: [
      { value: "Traditional Heritage Haveli", label: "Heritage Haveli & Courtyard (حویلی)", desc: "Carved archways, wooden balconies, flickering oil lamps, and historic courtyard." },
      { value: "Mehfil Stage with Carpet & Bolster Pillows (محفل کی رونک) 🕌", label: "Mehfil Stage with Carpets & Gaddi (محفل کی رونک) 🕌", desc: "Traditional floor seating with plush carpets, velvet bolster pillows (Masnad), and candle stand." },
      { value: "Colonial Heritage Auditorium & Stage 🏛️", label: "Colonial Heritage Auditorium Stage 🏛️", desc: "Grand auditorium with antique wooden stage, vintage brass mic, and ambient spotlight." },
      { value: "Open-Air Garden Mehfil under Fairy Lights ✨", label: "Open-Air Garden Mehfil under Fairy Lights ✨", desc: "Nighttime outdoor garden gathering illuminated by twinkling fairy lights." },
      { value: "Ancient Fort Archway & Torches 🏰", label: "Ancient Fort Archway & Torches 🏰", desc: "Historic stone fort archways lit by glowing oil torches and starry night sky." },
      { value: "Dynamic Multi-Location Mehfil & Solitude 🎭", label: "Dynamic Multi-Location (Stage + Solitary Room) 🎭", desc: "Transitions between a lively Mushaira stage and a quiet solitary room." },
      { value: "Desi Rooftop Mehfil under Moonlight 🌙", label: "Desi Rooftop Mehfil under Moonlight 🌙", desc: "House rooftop with warm diyas, scattered rose petals, and a full moon glowing above the gathering." },
      { value: "Royal Mughal Courtyard Mehfil 👑", label: "Royal Mughal Courtyard Mehfil 👑", desc: "Opulent Mughal-era open courtyard with marble floors, fountain, Persian rugs, and chandelier lanterns." },
      { value: "Lakeside Boat Mehfil (Shikara / Dal Lake) 🚣", label: "Lakeside Shikara Boat Mehfil 🚣", desc: "Romantic wooden shikara boat floating on glassy lake at dusk, lanterns reflecting on calm water." },
    ],
  },
  {
    category: "🌧️ Solitary, Sad & Atmospheric Locations",
    options: [
      { value: "Candlelit Solitary Room (Tanhai / Solitary Room) 🕯️", label: "Candlelit Solitary Room (تنہا کمرہ / Tanhai) 🕯️", desc: "Dimly lit room, flickering desk candle, handwritten poetry papers, and quiet solitude." },
      { value: "Rain-Slicked Midnight Rooftop Balcony 🌧️🌙", label: "Rain-Slicked Midnight Balcony 🌧️🌙", desc: "Standing alone under pouring midnight rain gazing at distant city lights." },
      { value: "Rainy Window Coffee Shop ☕", label: "Rainy Window Coffee Shop ☕", desc: "Warm coffee shop interior with raindrops streaking glass window." },
      { value: "Sunset Rooftop & City Skyline 🌇", label: "Sunset Rooftop & Skyline 🌇", desc: "Golden hour rooftop view of twinkling city lights under twilight sky." },
      { value: "Dimly Lit Vintage Tea House (Dhaba) ☕", label: "Dimly Lit Vintage Tea House / Dhaba ☕", desc: "Late night quiet corner table with warm steaming tea and vintage aesthetic." },
      { value: "Solitary Bench in Misty Autumn Park 🍁", label: "Solitary Bench in Misty Park 🍁", desc: "Foggy morning park bench surrounded by falling leaves and morning mist." },
      { value: "Ocean Cliff at Dusk 🌊", label: "Ocean Cliff at Dusk 🌊", desc: "Dramatic ocean waves crashing against rocks under purple dusk sky." },
      { value: "Acoustic Music Studio 🎤", label: "Acoustic Music Studio 🎤", desc: "Studio stage with vintage ribbon microphones and warm spotlight bokeh." },
      { value: "Coke Studio Fusion Stage 🎸", label: "Coke Studio Stage 🎸", desc: "Modern lighting rig, oriental rugs, acoustic instruments, and electric vibe." },
    ],
  },
  {
    category: "💕 Romantic Places & Couple Locations",
    options: [
      { value: "Blooming Rose Garden at Golden Hour 🌹", label: "Blooming Rose Garden at Golden Hour 🌹", desc: "Lush rose garden bathed in warm golden-hour sunlight, fallen petals on grass, gentle breeze." },
      { value: "Moonlit Palace Rooftop Terrace 🌕", label: "Moonlit Palace Rooftop Terrace 🌕", desc: "Luxurious rooftop terrace of a heritage palace under a glowing full moon with fairy lights." },
      { value: "Candlelit Indoor Library & Books 🕯️📚", label: "Candlelit Library & Book Nook 🕯️📚", desc: "Warm dim library, tall wooden shelves of Urdu poetry books, flickering candelabras, Persian rug." },
      { value: "Riverside Sunset Promenade 🌅🌊", label: "Riverside Sunset Promenade 🌅🌊", desc: "Scenic riverside pathway at sunset, soft waves, warm orange sky, and willow trees." },
      { value: "Flower Market & Gol Gappa Stall Evening 🌺", label: "Desi Flower Market Evening 🌺", desc: "Colorful bazaar flower stall at dusk, fresh roses and marigolds, warm market lamp glow." },
      { value: "Snow-Capped Mountain Cabin & Fireplace ❄️🔥", label: "Snow Mountain Cabin & Fireplace ❄️🔥", desc: "Cozy wooden cabin in snowy mountains, glowing fireplace, wool blankets, and hot tea." },
      { value: "Cherry Blossom Garden (Sakura) 🌸", label: "Cherry Blossom Garden (Sakura) 🌸", desc: "Dreamy sakura blossom garden with pink petals floating in the breeze and soft bokeh light." },
      { value: "Rooftop Candlelight Dinner Setup 🍷🕯️", label: "Rooftop Candlelight Dinner 🍷🕯️", desc: "Elegant rooftop table with white linen, pillar candles, rose petals, and city glitter view." },
      { value: "Hidden Waterfall & Lush Green Valley 🌿💦", label: "Hidden Waterfall & Green Valley 🌿💦", desc: "Secluded waterfall surrounded by lush tropical foliage, misty air, and soft diffused light." },
      { value: "Vintage European Cobblestone Street 🇫🇷🌙", label: "Vintage European Cobblestone Alley 🌙", desc: "Romantic Paris-style narrow cobblestone alley with gas lanterns, ivy walls, and rain puddles." },
      { value: "Boat Ride on Moonlit Lake 🛶🌕", label: "Moonlit Lake Boat Ride 🛶🌕", desc: "Two characters in a wooden rowboat on a perfectly still moonlit lake, lantern softly glowing." },
      { value: "Desert Dunes at Sunset with Bonfire 🌄🔥", label: "Desert Dunes Sunset & Bonfire 🌄🔥", desc: "Golden sand dunes under a blazing sunset sky with a warm crackling bonfire nearby." },
      { value: "Terrace with City View & Rain 🌧️🏙️", label: "Rainy Terrace with City View 🌧️🏙️", desc: "Open terrace in gentle rain, blurred neon city lights below, cozy shawl-wrapped couple." },
      { value: "Autumn Leaf Forest Path 🍂🌲", label: "Autumn Forest Path 🍂🌲", desc: "Magical forest path covered in fallen red and gold leaves under soft autumn afternoon light." },
      { value: "Indoor Haveli Balcony with Diyas (Diwali / Night) 🪔", label: "Heritage Haveli Balcony with Diyas 🪔", desc: "Ornate Haveli balcony adorned with warm clay diyas, rose garlands, and carved jali screens." },
      { value: "Old Vintage Railway Platform at Dusk 🚂🌅", label: "Vintage Railway Platform at Dusk 🚂🌅", desc: "Antique wooden train platform with warm hanging lamps, soft dusk sky, and romantic nostalgia." },
      { value: "Glasshouse Botanical Conservatory 🌿🌸", label: "Glasshouse Botanical Conservatory 🌿🌸", desc: "Ornate Victorian glasshouse with tropical palms, blooming pink orchids, and romantic sunbeams." },
      { value: "Seaside Lighthouse Balcony at Twilight 🗼🌊", label: "Seaside Lighthouse Balcony at Twilight 🗼🌊", desc: "High cliff lighthouse balcony with slooking intently purple dusk sky and crashing ocean waves." },
      { value: "Kashmiri Apple Orchard in Bloom 🍎🌸", label: "Kashmiri Apple Orchard in Bloom 🍎🌸", desc: "Beautiful mountain valley apple orchard in pink bloom with morning mist and rustic wooden fence." },
      { value: "Candlelit Vine Covered Gazebo 🍇🕯️", label: "Candlelit Vine Covered Gazebo 🍇🕯️", desc: "Romantic outdoor wooden gazebo covered in green vines, hanging glass candle lanterns, and rose petals." },
      { value: "Heritage Library Window (Jharoka) 📚🪟", label: "Heritage Library Window (Jharoka) 📚🪟", desc: "Ornate carved Haveli jharoka window overlooking quiet stone courtyard with vintage poetry books." },
      { value: "Starry Desert Oasis & Palm Trees 🌴✨", label: "Starry Desert Oasis & Palm Trees 🌴✨", desc: "Quiet desert oasis surrounded by tall date palms under a glowing starry night sky." },
      { value: "Hilltop Pavilion & City Lights View ⛰️🌃", label: "Hilltop Pavilion & City Lights View ⛰️🌃", desc: "High mountain gazebo overlooking a sparkling city skyline under romantic moonlight." },
      { value: "Lavender Field at Sunset 🪻🌅", label: "Lavender Field at Sunset 🪻🌅", desc: "Endless purple lavender fields glowing under a golden sunset sky with soft warm breeze." },
      { value: "Old Town Café Balcony at Dusk 🍷🕯️", label: "Old Town Café Balcony at Dusk 🍷🕯️", desc: "Charming vintage balcony with wrought-iron railing, candle lantern, and distant clock tower view." },
    ],
  },
];

const SONG_VIBE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Song & Shayari Moods",
    options: [
      { value: "Very Sad & Heartbroken Mehfil (Shayari of Grief & Loss) 💔😭", label: "Very Sad & Heartbroken Mehfil 💔😭", desc: "Profound grief, deeply emotional eyes, broken heart Shayari, and tragic emotional intensity." },
      { value: "Lonely & Isolated Solitude (Tanhai / Solemn Isolation) 🌧️🥀", label: "Lonely & Isolated Solitude (تنہائی) 🌧️🥀", desc: "Solitary character sitting alone in quiet darkness reflecting on painful memories." },
      { value: "Melancholic Midnight Rain (Ghamgina Shayari) 🌙🌧️", label: "Melancholic Midnight Rain (غمگین شاعری) 🌙🌧️", desc: "Gloomy atmospheric midnight rain with sorrowful poetic recitation." },
      { value: "Funny & Humorous Shayari (Tanzo Mazah)", label: "Funny & Humorous Shayari (طنز و مزاح) 😂", desc: "Witty comedic Shayari, hilarious satire (Tanzo Mazah), and funny poetry punchlines." },
      { value: "Romantic & Soulful", label: "Romantic & Soulful", desc: "Deep romantic devotion, sweet glances, and heartwarming affection." },
      { value: "Shy, Playful & Naughty 😏💖", label: "Shy, Playful & Naughty 😏💖", desc: "A blend of sweet shyness with mischievous, playful and naughty expressions." },
      { value: "Deep Emotional & Heartbroken (Sad Shayari)", label: "Deep Emotional & Sad Shayari 💔", desc: "Poetic sorrow, longing for lost love, and emotional gaze." },
      { value: "Aesthetic Lo-Fi Chill", label: "Aesthetic Lo-Fi Chill", desc: "Cozy, relaxed, aesthetic atmosphere with calm artistic focus." },
      { value: "Coke Studio Fusion Vibe", label: "Coke Studio Fusion Vibe", desc: "Dynamic vocal energy, rhythmic hand clapping, and musical passion." },
      { value: "Poetic Shayari Mehfil", label: "Poetic Shayari Mehfil", desc: "Classical literary gathering atmosphere with Urdu Shayari couplets." },
      { value: "Nostalgic & Vintage Retro", label: "Nostalgic & Vintage Retro", desc: "90s Bollywood or classic vinyl record nostalgia." },
      { value: "Sufi Mystical & Spiritual", label: "Sufi Mystical & Spiritual", desc: "Transcendent spiritual ecstasy, Sufi devotion, and rhythmic clapping." },
    ],
  },
];

const SITUATION_CATEGORIES = [
  {
    id: "TRAIN",
    label: "🚂 Train & Station Farewell",
    suggestions: [
      "A girl is running along the platform after a departing vintage steam train, looking deeply as her silk dupatta flutters in the misty wind.",
      "A man standing on a train doorway waving goodbye to a girl standing alone on a foggy rain-soaked railway platform.",
      "A couple sharing a last quiet glance through a rain-streaked train window as the train slowly starts moving.",
    ],
  },
  {
    id: "ROMANTIC",
    label: "❤️ Romantic & Reunion",
    suggestions: [
      "A man and girl meeting unexpectedly at a sunset rooftop cafe after years apart, exchanging an emotional embrace.",
      "A couple walking hand in hand under a canopy of blooming cherry blossom trees as pink petals fall around them.",
      "A man surprising a girl with a hand-carved wooden gift in a candlelit courtyard at dusk.",
    ],
  },
  {
    id: "RAIN",
    label: "🌧️ Rainy Solitude & Sadness",
    suggestions: [
      "A solitary man sitting on a park bench in heavy rainfall, staring at a faded photograph as autumn leaves wash away.",
      "A girl gazing out of a rain-splattered coffee shop window, holding a hot cup of tea with a bittersweet longing look.",
      "Two people standing under a single small umbrella in pouring rain, looking into each other's eyes silently.",
    ],
  },
  {
    id: "DANCE",
    label: "💃 Dance & Duet",
    suggestions: [
      "A couple performing a graceful, synchronized slow dance in a heritage haveli courtyard under hanging fairy lights.",
      "A man and girl dancing joyously in a sudden monsoon rain shower on an open terrace overlooking city lights.",
      "A classical dancer performing Kathak turns in a candlelit archway, her ghungroo bells resonating with passion.",
    ],
  },
  {
    id: "FUNNY",
    label: "😂 Funny & Misunderstanding",
    suggestions: [
      "A kid trying to sneak cookies from a high counter jar on tip-toes, slipping on a toy car as flour spills all over.",
      "A man trying to impress a girl with a magic trick, but accidentally pulling out a noisy toy chicken instead.",
      "A dog wearing a tiny superhero cape dashing through a living room while a bewildered toddler chases after it.",
    ],
  },
  {
    id: "DRAMATIC",
    label: "🎬 Cinematic & Suspense",
    suggestions: [
      "A lone figure walking slowly into a dense misty forest at twilight as mysterious golden particles float in the air.",
      "A dramatic confrontation between two rivals on a windy cliffside at dusk, heavy clouds swirling overhead.",
      "A magician on a shadowy circus stage tossing a velvet cape into the air as bright spotlights converge.",
    ],
  },
];

const QUICK_SITUATION_PILLS = [
  { label: "🚂 Girl Running After Train", text: "A girl is running along the platform after a departing vintage steam train, looking deeply as her silk dupatta flutters in the misty wind." },
  { label: "❤️ Sunset Rooftop Reunion", text: "A man and girl meeting unexpectedly at a sunset rooftop cafe after years apart, sharing an emotional embrace." },
  { label: "🌧️ Rainy Solitude on Bench", text: "A solitary man sitting on a park bench in heavy rainfall, staring at a faded photograph as autumn leaves wash away." },
  { label: "💃 Haveli Courtyard Rain Dance", text: "A couple performing a graceful, synchronized slow dance in a heritage haveli courtyard under hanging fairy lights." },
  { label: "☕ Cozy Café Conversation", text: "Two close friends sharing coffee by a rain-streaked window, laughing quietly together." },
  { label: "🧸 Sneaking Cookies Jar", text: "A kid trying to sneak cookies from a high counter jar on tip-toes, slipping on a toy car as flour spills all over." },
];

const SONG_CHARACTER_SETUP_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Adult Performers & Duet Combos",
    options: [
      { value: "Man & Girl Combo (Duet Performers) 👫", label: "Man & Girl Combo (Duet Performers) 👫", desc: "Dual performance clip featuring a man and a girl performing together." },
      { value: "Man Shayar & Girl Shayara Duo 🎤", label: "Man Shayar & Girl Shayara Duo 🎤", desc: "Poetic recitation exchange between male Shayar and female Shayara." },
      { value: "Man Singer & Girl Lead Vocalist Duet 👩‍🎤👨‍🎤", label: "Man Singer & Girl Lead Vocalist 👩‍🎤👨‍🎤", desc: "Romantic acoustic or Coke Studio duet between man and girl singers." },
      { value: "Man Guitarist & Girl Lead Vocalist 🎸👩‍🎤", label: "Man Guitarist & Girl Lead Vocalist 🎸👩‍🎤", desc: "Male acoustic guitarist playing for female lead singer." },
      { value: "Funny Comedic Shayar (Tanzo Mazah Poet) 😂", label: "Funny Comedic Shayar (طنزیہ شاعر) 😂", desc: "Hilarious comedy poet performing funny satirical Shayari with comic body language." },
      { value: "Solo Adult Female Singer 👩‍🎤", label: "Solo Adult Female Singer 👩‍🎤", desc: "Single stylish female vocalist performing two-liner lyrics or Shayari." },
      { value: "Solo Adult Male Shayar 👨‍🎤", label: "Solo Adult Male Shayar 👨‍🎤", desc: "Single handsome male poet reciting emotional Shayari." },
      { value: "Romantic Couple (Miya Biwi)", label: "Romantic Couple (Miya Biwi)", desc: "Loving husband & wife or romantic couple sharing a sweet moment." },
      { value: "Dulha & Dulhan (Bride & Groom)", label: "Dulha & Dulhan (Bride & Groom)", desc: "Royal Desi bride and groom couple in rich wedding attire." },
      { value: "Qawwali Group (Qawwal Party)", label: "Qawwali Group (Qawwal Party)", desc: "Traditional Qawwali lead singer with harmonium player and clappers." },
      { value: "Two Male Friends Jamming", label: "Two Male Friends Jamming", desc: "Best friends sitting with acoustic guitars or harmonium." },
    ],
  },
  {
    category: "🎤 Shayar & Listener — Poetry Duos",
    options: [
      {
        value: "Male Poet Recites + Girl Listens & Admires 🎤👁️",
        label: "Male Poet Recites + Girl Listens & Admires 🎤👁️",
        desc: "Man recites Shayari with passion. Girl sits beside him in the same location, listening quietly with admiration and an impressed, moved expression. Only the speaking role differs.",
      },
      {
        value: "Female Poet Recites + Man Listens & Admires 🎤🧔",
        label: "Female Poet Recites + Man Listens & Admires 🎤🧔",
        desc: "Girl recites Shayari with emotion and elegance. Man sits beside her in the same location, listening quietly with an admiring, captivated expression. Only the speaking role differs.",
      },
    ],
  },
];

const SONG_CLOTHING_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "👨 Male Shayar & Performer Outfits",
    options: [
      { value: "Male Simple Button-Down Shirt & Dark Trousers (Sad/Lonely Poet) 👔", label: "Male Simple Pant & Button-Down Shirt (Sad/Lonely) 👔", desc: "Simple unbuttoned collar dress shirt and dark trousers for a solitary, heartbroken Shayar." },
      { value: "Male Casual Polo T-Shirt & Chino Pants (Everyday Melancholic) 👕", label: "Male Casual T-Shirt & Chino Pants (Melancholic) 👕", desc: "Minimalist casual shirt with dark pants for a modern everyday sad poet." },
      { value: "Male Unbuttoned Linen Shirt & Rolled Sleeves (Heartbroken) 💔", label: "Male Unbuttoned Linen Shirt & Dark Jeans (Heartbroken) 💔", desc: "Relaxed unbuttoned linen shirt, rolled-up sleeves, dark jeans, and lonely demeanor." },
      { value: "Male Simple Plain White Shalwar Kameez (Solitary Desi Shayar) 🌧️", label: "Male Simple Plain Shalwar Kameez (Solitary Desi) 🌧️", desc: "Simple unembroidered cotton Shalwar Kameez for a contemplative, melancholic Shayar." },
      { value: "Male Traditional Shalwar Kameez & Waistcoat 👔", label: "Male Shalwar Kameez & Velvet Waistcoat 👔", desc: "Crisp white/black traditional Shalwar Kameez with embroidered velvet waistcoat." },
      { value: "Male Royal Embroidered Sherwani 👑", label: "Male Royal Embroidered Sherwani 👑", desc: "Regal embroidered silk Sherwani with matching stole and formal shoes." },
      { value: "Male Western Tuxedo Suit & Bowtie 🕴️", label: "Male Western Tuxedo Suit & Bowtie 🕴️", desc: "Tailored 3-piece Western tuxedo suit, crisp dress shirt, and bowtie." },
      { value: "Male Leather Jacket & Dark Denim Jeans 🧥", label: "Male Leather Jacket & Dark Denim Jeans 🧥", desc: "Cool black leather jacket over fitted t-shirt and dark denim jeans." },
      { value: "Male Knit Turtleneck & Wool Scarf 🧣", label: "Male Knit Turtleneck & Wool Scarf 🧣", desc: "Acoustic artist turtleneck sweater, wool scarf, and stylish glasses." },
      { value: "Male Oversized Hoodie & Streetwear 👟", label: "Male Oversized Hoodie & Streetwear 👟", desc: "Modern oversized designer hoodie, cargo pants, and fresh sneakers." },
      { value: "Male Traditional Qawwal Kurta & Turban 🕌", label: "Male Qawwal Kurta & Turban 🕌", desc: "Embroidered traditional Qawwal kurta with matching turban." },
    ],
  },
  {
    category: "👩 Female Shayara & Singer Outfits",
    options: [
      { value: "Female Heavily Embellished Lehenga Choli 👗", label: "Female Embellished Lehenga Choli 👗", desc: "Royal embroidered bridal/party Lehenga Choli with sheer Dupatta." },
      { value: "Female Elegant Silk Saree & Jewels 🥻", label: "Female Elegant Silk Saree & Jewels 🥻", desc: "Graceful Banarasi/silk saree with traditional jhumka earrings." },
      { value: "Female Stylish Anarkali Frock & Dupatta ✨", label: "Female Stylish Anarkali Frock & Dupatta ✨", desc: "Flowing floor-length Anarkali suit with heavy hand-embroidered borders." },
      { value: "Female Elegant Abaya & Silk Hijab 🧕", label: "Female Elegant Abaya & Silk Hijab 🧕", desc: "Modest and graceful dark abaya with a beautifully draped silk hijab." },
      { value: "Female Traditional Salwar Kameez with Hijab 🧕", label: "Female Salwar Kameez with Hijab 🧕", desc: "Modest ethnic Shalwar Kameez paired with a neatly styled matching hijab." },
      { value: "Female Modest Long Gown with Chiffon Hijab 🧕", label: "Female Modest Gown with Chiffon Hijab 🧕", desc: "Flowing modest evening gown styled with a delicate chiffon hijab." },
      { value: "Female Full Niqab (Strictly Fully Covered, ONLY Eyes Visible) 🧕👁️", label: "Female Full Niqab (Only Eyes Showing) 🧕👁️", desc: "Traditional modest Niqab/Burqa. The girl is fully covered. The entire face, hair, neck, and body must be completely covered. STRICTLY ONLY her expressive eyes are visible." },
      { value: "Female Western Formal Evening Gown 💃", label: "Female Western Evening Gown 💃", desc: "Sophisticated floor-length Western silk evening gown with heels." },
      { value: "Female Western Chic Cocktail Dress 👠", label: "Female Western Cocktail Dress & Heels 👠", desc: "Modern Western cocktail dress with elegant jewelry and heels." },
      { value: "Female Casual Denim Jacket & Sundress 🌸", label: "Female Denim Jacket & Sundress 🌸", desc: "Breezy floral sundress paired with a light denim jacket." },
    ],
  },
  {
    category: "👫 Man & Girl Combo Outfits",
    options: [
      { value: "Man & Girl Combo: Suit & Elegant Gown 👔👗", label: "Man & Girl Combo: Suit & Gown 👔👗", desc: "Tailored Western suit for man and elegant gown for girl." },
      { value: "Man & Girl Combo: Kurta Waistcoat & Anarkali Frock 👫", label: "Man & Girl Combo: Kurta & Anarkali 👫", desc: "Traditional Shalwar Kameez waistcoat for man and Anarkali frock for girl." },
      { value: "Man & Girl Combo: Leather Jackets & Denim Jeans 🧥", label: "Man & Girl Combo: Leather Jackets & Denim 🧥", desc: "Matching stylish leather jackets and dark denim jeans." },
      { value: "Man & Girl Combo: Royal Sherwani & Embellished Lehenga 👑", label: "Man & Girl Combo: Royal Sherwani & Lehenga 👑", desc: "Regal embroidered Sherwani for man and heavy Lehenga for girl." },
      { value: "Man & Girl Combo: Casual Hoodies & Jeans 👟", label: "Man & Girl Combo: Casual Hoodies & Jeans 👟", desc: "Cozy modern hoodies, t-shirts, and casual denim jeans." },
      { value: "Man & Girl Combo: Acoustic Sweaters & Wool Scarves 🧣", label: "Man & Girl Combo: Acoustic Sweaters & Scarves 🧣", desc: "Cozy turtleneck sweaters and wool scarves for acoustic jam video." },
    ],
  },
];

const CHARACTER_FACE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🤖 Default & Random",
    options: [
      { value: "Any / AI Decides", label: "Any / AI Decides", desc: "Let the AI pick unique facial features." },
      { value: "Unique Non-Repetitive Random Face 🎲", label: "Unique Random Face Every Time 🎲", desc: "Forces AI to generate a completely distinct face structure for every video." },
    ],
  },
  {
    category: "👨 Male Facial Features & Beards",
    options: [
      { value: "Young Handsome & Clean-Shaven 🧑", label: "Young Handsome & Clean-Shaven 🧑", desc: "Sharp jawline, smooth clean-shaven skin, expressive eyes, modern hair fade." },
      { value: "Rugged Stubble & Groomed Beard 🧔", label: "Rugged Stubble & Groomed Beard 🧔", desc: "Fitted short stubble, well-groomed mustache, deep intense gaze, masculine structure." },
      { value: "Classic Urdu Shayar Full Beard 🕌", label: "Classic Urdu Shayar Full Beard 🕌", desc: "Traditional full neat beard, intellectual look, expressive eyes, classic poet face." },
      { value: "Regal Mughal & Royal Features 👑", label: "Regal Mughal & Royal Features 👑", desc: "High cheekbones, royal mustache, dignified posture, rich heritage face." },
      { value: "Old Maestro Silver Beard (60+ yrs) 👴", label: "Old Maestro Silver Beard (60+ yrs) 👴", desc: "Weathered wise face, silver/grey beard, deep expressive laugh lines." },
      { value: "Western Rockstar Undercut & Stubble 🎸", label: "Western Rockstar Undercut & Stubble 🎸", desc: "Modern undercut hairstyle, light stubble, sharp model jawline." },
      { value: "Dense Salt-and-Pepper Beard (40s-50s) 🧔‍♂️", label: "Dense Salt-and-Pepper Beard (40s-50s) 🧔‍♂️", desc: "Mature distinguished salt-and-pepper beard, refined features, dignified look." },
      { value: "Curly Hair & Short Boxed Beard 👨‍🦱", label: "Curly Hair & Short Boxed Beard 👨‍🦱", desc: "Natural curly hair, trimmed short boxed beard, warm friendly eyes." },
      { value: "Traditional Punjabi Turban & Full Beard 👳", label: "Traditional Punjabi Turban & Full Beard 👳", desc: "Iconic colorful turban, full neat Sikh/Punjabi beard, proud royal features." },
      { value: "Bold Bald Head & Heavy Beard 👨‍🦲", label: "Bold Bald Head & Heavy Beard 👨‍🦲", desc: "Clean shaved bald head with a thick full beard, strong athletic jawline." },
      { value: "Stylish Glasses & Goatee Beard 👓", label: "Stylish Glasses & Goatee Beard 👓", desc: "Intellectual thin-rim glasses, neat goatee beard, artistic Shayar look." },
      { value: "Western Blond / Light Brown Hair Model 👱", label: "Western Blond / Light Brown Hair Model 👱", desc: "Light brown or blond hair, light eyes, sharp Western fashion model structure." },
    ],
  },
  {
    category: "👩 Female Facial Features & Styles",
    options: [
      { value: "Graceful Desi Female (Large Expressive Eyes) 👁️", label: "Graceful Desi Female (Expressive Eyes) 👁️", desc: "Soft oval face, large expressive dark eyes, delicate smile, long black hair." },
      { value: "Royal Kashmiri / Northern Fair Complexion 🌸", label: "Royal Kashmiri / Fair Complexion 🌸", desc: "Rosy cheeks, fair skin tone, hazel/green eyes, elegant traditional hair." },
      { value: "Traditional Hijab & Graceful Features 🧕", label: "Traditional Hijab & Graceful Features 🧕", desc: "Elegant silk hijab framing a serene face with soft expressive eyes." },
      { value: "Western High-Fashion Model Face 💃", label: "Western High-Fashion Model Face 💃", desc: "Defined cheekbones, sharp jawline, modern chic hairstyle, glamour look." },
      { value: "Short Curly Hair & Chic Modern Face 👩‍🦱", label: "Short Curly Hair & Chic Modern Face 👩‍🦱", desc: "Trendy short curly hair, bright smile, modern stylish aesthetic." },
      { value: "Shy & Naughty Playful Expression 😏😳", label: "Shy & Naughty Playful Expression 😏😳", desc: "A mix of sweet shyness and a naughty, mischievous playful smile with expressive eyes." },
      { value: "Playful laughter 😄", label: "Playful Laughter 😄", desc: "Laughing with a cute, charming attitude." },
      { value: "Coy laugh 🤭", label: "Coy Laugh 🤭", desc: "A shy, flirtatious, slightly teasing laugh." },
      { value: "Charming giggle 😊", label: "Charming Giggle 😊", desc: "Soft, cute, and graceful giggle." },
      { value: "Playful smile with a soft laugh ☺️", label: "Playful Smile & Soft Laugh ☺️", desc: "Playful smile with a soft laugh - perfect for an aesthetic AI video." },
      { value: "Ada-filled laugh (Urdu Ada) 💖", label: "Ada-filled Laugh (ادا) 💖", desc: "A graceful, stylish, or coquettish (Ada) mannered laugh." },
    ],
  },
];

const SONG_STYLE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Romantic, Poetic & Comedic Styles",
    options: [
      { value: "Funny Satirical Shayari (Tanzo Mazah)", label: "Funny Satirical Shayari (طنز و مزاح) 🤣", desc: "Humorous Shayari couplets with witty punchlines and comical expressions." },
      { value: "Two-Liner Romantic Song", label: "Two-Liner Romantic Song 🎵", desc: "Catchy 2-liner acoustic song lyrics synced to emotional video." },
      { value: "Urdu Shayari Couplet (Ghazal)", label: "Urdu Ghazal Shayari (غزل)", desc: "Deep Urdu ghazal Shayari lines with poetic narration." },
      { value: "Coke Studio Sufi Fusion", label: "Coke Studio Sufi Fusion 🎤", desc: "Soulful Coke Studio style acoustic and electric fusion vocals." },
      { value: "Classical Raag & Khayal", label: "Classical Raag & Khayal 🎶", desc: "Traditional Hindustani classical vocal raag inflections." },
      { value: "Sad / Heartbreak Shayari", label: "Sad / Heartbreak Shayari 💔", desc: "Emotional Shayari about heartbreak, parting, and pain." },
      { value: "Sufi Qawwali Clapping", label: "Sufi Qawwali Clapping 🕌", desc: "Energetic Sufi Qawwali performance lines." },
      { value: "Lo-Fi Acoustic Melody", label: "Lo-Fi Acoustic Melody 🎧", desc: "Soft whispering vocals over lo-fi guitar chords." },
    ],
  },
  {
    category: "Regional Desi Folk & Cultural Tones",
    options: [
      { value: "Punjabi Folk & Boliyan Style", label: "Punjabi Folk & Boliyan (پنجابی)", desc: "Authentic Punjabi folk couplets, Boliyan chants, and Jugni style." },
      { value: "Sindhi Sufi & Shah Bhait Style", label: "Sindhi Sufi & Shah Bhait (سنڌي)", desc: "Melodic Sindhi Sufi poetry and Shah Abdul Latif bhait vocal style." },
      { value: "Pashto Folk & Landay Style", label: "Pashto Folk & Landay (پښتو)", desc: "Expressive Pashto Landay poetry and Rubab-infused folk vocal cadence." },
      { value: "Balochi Chhap & Folk Style", label: "Balochi Chhap & Folk (بلوچی)", desc: "Rhythmic Balochi folk chants, Tamboor, and desert vocal storytelling." },
      { value: "Seraiki Jhumar & Kafi Style", label: "Seraiki Jhumar & Kafi (سرائیکی)", desc: "Soulful Seraiki Khwaja Ghulam Farid Kafi and Jhumar rhythm." },
    ],
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
    category: "Default / AI Decides",
    options: [
      { value: "Any / AI Decides", label: "Any / AI Decides (Default)", desc: "Let the AI choose the best location automatically." },
    ]
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
      { value: "Indoor Toy Store & Arcade", label: "Indoor Toy Store / Arcade 🧸", desc: "Bright toy shop filled with teddy bear shelves, dollhouses, and arcade claw games." },
      { value: "Cozy Bedroom Attic & Secret Fort", label: "Attic & Secret Blanket Fort ⛺", desc: "Cozy wooden attic bedroom with fairy lights, blanket fort, and pillows." },
      { value: "Supermarket & Snack Aisle", label: "Supermarket / Grocery Store 🛒", desc: "Colorful supermarket aisle stacked with snack boxes, cereal, and mini shopping carts." },
      { value: "Art Studio & Paint Corner", label: "Art Studio & Painting Room 🎨", desc: "Creative art studio with mini easels, paint-splattered floor, and colorful canvases." },
      { value: "Bakery & Pastry Shop", label: "Sweet Bakery & Pastry Shop 🧁", desc: "Warm bakery display filled with fresh frosted cupcakes, donuts, and birthday cakes." },
      { value: "Indoor Swimming Pool & Splash Zone", label: "Indoor Heated Pool & Splash Zone 🏊", desc: "Clean turquoise indoor swimming pool with pool floats and colorful water slides." },
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
      { value: "Botanical Flower Garden & Greenhouse", label: "Botanical Flower Garden 🌸", desc: "Vibrant flower conservatory blooming with roses, tulips, and giant sunlit greenhouse." },
      { value: "Sunny Backyard & Treehouse", label: "Backyard Garden & Treehouse 🏡", desc: "Green backyard lawn with wooden treehouse ladder, swing, and garden flowers." },
      { value: "Sunflower Field under Blue Sky", label: "Golden Sunflower Field 🌻", desc: "Vibrant endless field of tall yellow sunflowers under bright afternoon sun." },
      { value: "Autumn Park with Golden Fallen Leaves", label: "Autumn Park / Fallen Leaves 🍂", desc: "Golden autumn park path covered in crisp red and orange fallen maple leaves." },
      { value: "Winter Snow Park & Snowman Yard", label: "Winter Snow Park & Snowman ☃️", desc: "Soft white snow-covered park with pine trees, wooden sled, and cute snowman." },
      { value: "Zoo & Friendly Animal Safari", label: "Zoo & Petting Farm 🦒", desc: "Friendly zoo enclosure with giraffes, rabbits, duck pond, and wooden fences." },
    ],
  },
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
      { value: "Bollywood Festive Wedding Stage", label: "Bollywood Wedding / Shaadi Stage 🎉", desc: "Colorful marigold flowers, bright drapes, fairy lights, and festive Bollywood vibe." },
      { value: "Bollywood Movie Set", label: "Bollywood Movie Set & Dancers 🎥", desc: "Vibrant Bollywood movie set with colorful background dancers and bright spotlights." },
      { value: "Grand Mughal Palace", label: "Grand Royal Palace 🏰", desc: "Luxurious traditional palace courtyard with glowing lanterns and royal architecture." },
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
    category: "Medical & Community Services",
    options: [
      { value: "Doctor Clinic & Children Hospital", label: "Doctor Clinic / Children's Hospital 🏥", desc: "Gentle pediatrician clinic with colorful wall murals, height chart, and examination bed." },
      { value: "Dentist Clinic & Tooth Care", label: "Dentist Clinic / Tooth Care 🪥", desc: "Bright friendly dentist clinic with dental chair, mouth mirror, and toothbrush posters." },
      { value: "Pharmacy & Medicine Shop", label: "Pharmacy & Medicine Shop 💊", desc: "Neighborhood pharmacy filled with medicine shelves, syrup bottles, and pharmacist counter." },
      { value: "Veterinary Clinic & Pet Hospital", label: "Veterinary Clinic & Pet Hospital 🐾", desc: "Cute pet clinic with stethoscope, examination table, and friendly puppy/kitten patients." },
      { value: "Fire Station & Red Fire Truck", label: "Fire Station & Fire Truck 🚒", desc: "Exciting fire station garage with shiny red fire truck, helmets, and hose reel." },
      { value: "Police Station & Patrol Car", label: "Police Station & Patrol Car 🚓", desc: "Friendly neighborhood police station with blue patrol car, badge signs, and desk." },
      { value: "Post Office & Mail Room", label: "Post Office & Mail Room 📮", desc: "Cozy neighborhood post office with red mailboxes, stamps, and letter sorting boxes." },
    ],
  },
  {
    category: "Shops, Places & City",
    options: [
      { value: "Ice Cream Shop", label: "Ice Cream Shop", desc: "Colorful sweet parlor with colorful scoops and ice cream cones." },
      { value: "Magical Toy Store", label: "Toy Store", desc: "Exciting shop filled with shelves of toys, dolls, and robots." },
      { value: "Supermarket & Grocery Market", label: "Market / Supermarket", desc: "Bustling market aisle with fruit baskets and shopping carts." },
      { value: "Cozy Restaurant & Cafe", label: "Restaurant & Cafe", desc: "Cozy dining table with treats, cakes, and fruit juices." },
      { value: "Bakery & Pastry Shop", label: "Bakery & Pastry Shop 🥐", desc: "Aromatic bakery shop with glass display of hot bread, cupcakes, and chef counter." },
      { value: "Amusement Park & Carnival", label: "Amusement Park", desc: "Festive fairground with colorful rides and balloons." },
      { value: "Arcade & Game Zone", label: "Retro Arcade & Game Zone", desc: "Vibrant gaming arcade with claw machines and neon lights." },
      { value: "Airport Terminal & Airplane", label: "Airport Terminal & Airplane ✈️", desc: "Bustling airport terminal with large glass windows overlooking passenger airplanes on runway." },
      { value: "Train Station Platform", label: "Train Station & Platform 🚉", desc: "Bustling train station platform with passenger trains, luggage carts, and track views." },
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
    category: "Default / AI Decides",
    options: [
      { value: "Any / AI Decides", label: "Any / AI Decides", desc: "Let the AI decide the health and wellness based on the story." },
    ],
  },
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
    category: "🧠 Intelligence & Clever Kids (Smart & Genius)",
    options: [
      { value: "Smart & Intelligent Genius Kid 🧠👓", label: "Smart & Intelligent Genius Kid 🧠👓", desc: "Super smart, clever child with curious eyes, solving puzzles or asking brilliant questions." },
      { value: "Clever Little Scientist 🔬🧪", label: "Clever Little Scientist 🔬🧪", desc: "Curious kid exploring science experiments, magnifying glasses, and fun discoveries." },
      { value: "Smart Bookworm & Avid Reader 📚🤓", label: "Smart Bookworm & Avid Reader 📚🤓", desc: "Cute intellectual kid holding a storybook or reading with focused attention." },
      { value: "Quick Learner & Tech Whiz 💻💡", label: "Quick Learner & Tech Whiz 💻💡", desc: "Tech-savvy, sharp kid interacting with educational toys, tablets, or building blocks." },
      { value: "Clever Problem Solver 🧩✨", label: "Clever Problem Solver 🧩✨", desc: "Focused, sharp child completing Rubik's cube, jigsaw puzzles, or Lego inventions." },
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
      { value: "Korean Aegyo & Cute Heart Hands 🫰🇰🇷", label: "Korean Aegyo & Heart Hands 🫰🇰🇷", desc: "Adorable Korean Aegyo expressions, finger heart gestures (🫰), and sweet winks." },
      { value: "K-Drama Soft Aesthetic Vibe 🌸", label: "K-Drama Soft Aesthetic Vibe 🌸", desc: "Soft pastel lighting, aesthetic bokeh, cinematic K-drama warm tone, and gentle smiles." },
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
      { value: "Dulhan Girl / Desi Bride", label: "Dulhan Girl / Desi Bride (دلہن)", desc: "Beautiful Desi bride girl (Dulhan) in traditional bridal dress, heavy jewelry, and veil." },
      { value: "Mehndi / Mayun Bride Girl", label: "Mehndi / Mayun Bride Girl", desc: "Cute Mehndi bride girl in vibrant yellow outfit with floral jewelry." },
      { value: "Cute Hijabi Little Girl", label: "Cute Hijabi Little Girl", desc: "Adorable little girl wearing a neat cute hijab." },
      { value: "Little Girl in Traditional Shalwar Kameez", label: "Little Girl in Shalwar Kameez", desc: "Dressed in a vibrant traditional Shalwar Kameez outfit." },
      { value: "Little Girl in Phulkari Dupatta", label: "Little Girl in Phulkari Dupatta", desc: "Cute Punjabi girl wearing a traditional colorful Phulkari Dupatta." },
      { value: "Little Girl in Dupatta & Bangles", label: "Little Girl in Dupatta & Bangles", desc: "Cute girl wearing colorful glass bangles and a flowing dupatta." },
      { value: "Little Girl with Mehndi / Henna", label: "Little Girl with Mehndi / Henna", desc: "Cute girl showing off delicate henna patterns on her hands." },
      { value: "Little Girl Jumping Rope", label: "Little Girl Jumping Rope", desc: "Active girl skipping jump rope cheerfully in the courtyard." },
      { value: "Little Girl Feeding Birds", label: "Little Girl Feeding Birds", desc: "Tenderly scattering grain for cooing pigeons in the courtyard." },
      { value: "Little Girl Playing Hopscotch", label: "Little Girl Playing Hopscotch", desc: "Fun-loving girl hopping on chalk numbers in the courtyard." },
      { value: "Little Girl Tea Party Host", label: "Little Girl Tea Party Host", desc: "Cute girl hosting a mini tea party with toy teacups." },
      { value: "Little Girl on Tree Swing", label: "Little Girl on Tree Swing", desc: "Joyful girl swinging on a wooden swing tied to a shady tree." },
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
      { value: "Dulha Boy / Desi Groom", label: "Dulha Boy / Desi Groom (دولہا)", desc: "Handsome Desi groom boy (Dulha) in royal Sherwani, turban (Pagri), and Sehra." },
      { value: "Little Boy in Traditional Kurta Pajama", label: "Little Boy in Kurta Pajama", desc: "Handsome little boy in neat traditional Kurta-Pajama." },
      { value: "Little Boy in Kurta & Waistcoat", label: "Little Boy in Kurta & Waistcoat", desc: "Handsome boy wearing an embroidered waistcoat over Kurta." },
      { value: "Little Boy in Punjabi Pagri / Turban", label: "Little Boy in Punjabi Turban", desc: "Cute little boy wearing a mini Punjabi turban or cap." },
      { value: "Little Boy with Cricket Bat", label: "Little Boy with Cricket Bat", desc: "Enthusiastic little boy holding a wooden cricket bat and tennis ball." },
      { value: "Little Boy Flying a Kite", label: "Little Boy Flying a Kite", desc: "Excited boy holding a kite reel (Patang) on a sunny rooftop." },
      { value: "Little Boy Eating Jalebi / Sweet", label: "Little Boy Eating Jalebi", desc: "Munching happily on a warm crispy sweet jalebi." },
      { value: "Little Boy Riding a Tricycle", label: "Little Boy Riding a Tricycle", desc: "Cute boy pedaling a colorful toddler tricycle." },
      { value: "Little Boy Builder with Blocks", label: "Little Boy Builder with Blocks", desc: "Creative boy stacking colorful building blocks into towers." },
      { value: "Little Boy Playing Tabla / Harmonium", label: "Little Boy Playing Tabla", desc: "Mini musician tapping rhythmically on small tabla drums." },
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
      { value: "Little Boy in Pajamas", label: "Little Boy in Pajamas", desc: "Cozy bedtime pajamas." },
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
    category: "Dulha & Dulhan (Married Couple / Wedding)",
    options: [
      { value: "Dulha & Dulhan (Bride & Groom Couple)", label: "Dulha & Dulhan (Bride & Groom Couple) 👰‍♀️🤵‍♂️", desc: "Beautiful newlywed Desi bride & groom couple (Dulha & Dulhan) in traditional wedding attire." },
      { value: "Husband & Wife (Miya Biwi)", label: "Husband & Wife (Miya Biwi) ❤️", desc: "A loving husband and wife couple in everyday Desi home scenarios." },
      { value: "Barat Bride & Groom (Red & Gold)", label: "Barat Couple (Red Lehenga & Gold Sherwani)", desc: "Royal Barat ceremony couple with bride in heavy red embroidered lehenga and groom in golden sherwani." },
      { value: "Walima Married Couple (Pastel Aesthetic)", label: "Walima Couple (Pastel & Suit/Sherwani)", desc: "Elegant Walima reception married couple in soft pastel lehenga and sharp suit/sherwani." },
      { value: "Mayun / Mehndi Couple (Yellow Outfits)", label: "Mehndi Couple (Yellow Outfits & Flower Garlands)", desc: "Festive Mehndi/Mayun couple in vibrant yellow outfits with marigold flower garlands." },
      { value: "Nikkah Married Couple (White & Gold)", label: "Nikkah Couple (White & Gold Attire)", desc: "Serene Nikkah ceremony couple dressed in elegant white and gold traditional attire." },
      { value: "Desi Village Married Couple (Pind Style)", label: "Desi Village Married Couple (Pind Style)", desc: "Authentic Punjabi village married couple in traditional Punjabi suits and Kurta Tehmat." },
    ],
  },
  {
    category: "Girls with Friends & Family",
    options: [
      { value: "Two Girl Friends (Best Friends)", label: "Two Girl Friends (Best Friends)", desc: "Two best girl friends sharing secrets and having fun." },
      { value: "Three Girl Friends (Trio Squad)", label: "Three Girl Friends (Trio Squad)", desc: "Trio squad of three best girl friends giggling and playing." },
      { value: "Group of Girl Friends (Girls Squad)", label: "Group of Girl Friends (Girls Squad)", desc: "Fun group of girl friends on a playdate or party." },
      { value: "Girl & Mother (Mommy & Me)", label: "Girl & Mother (Mommy & Me)", desc: "Heartwarming mother and daughter pair spending loving moments." },
      { value: "Girl & Father (Daddy's Princess)", label: "Girl & Father (Daddy's Girl)", desc: "Loving father and daughter bonding warmly together." },
      { value: "Girl & Grandmother (Dadi / Nani)", label: "Girl & Grandmother (Dadi / Nani)", desc: "Little girl listening to bedtime stories from her grandmother." },
      { value: "Girl & Grandfather (Dada / Nana)", label: "Girl & Grandfather (Dada / Nana)", desc: "Little girl walking hand-in-hand with her grandfather." },
      { value: "Girl & Sister (Sisters Duo)", label: "Girl & Sister (Sisters Duo)", desc: "Two loving sisters sharing toys and hugs." },
      { value: "Girl & Cousin (Female Cousins)", label: "Girl & Cousin (Female Cousins)", desc: "Girl playing cheerfully with her favorite female cousin." },
      { value: "Girl & Aunt (Khala / Phuppo)", label: "Girl & Aunt (Khala / Phuppo)", desc: "Girl enjoying sweet treats with her caring aunt." },
      { value: "Girl & Whole Family", label: "Girl & Whole Family", desc: "Happy girl surrounded by parents, grandparents, and siblings." },
    ],
  },
  {
    category: "Boys with Friends",
    options: [
      { value: "Two Boy Friends (Best Friends)", label: "Two Boy Friends (Best Friends)", desc: "Two best buddy boys laughing, joking, and hanging out together." },
      { value: "Three Boy Friends (Trio Squad)", label: "Three Boy Friends (Trio Squad)", desc: "Three energetic buddy boys playing sports or games." },
      { value: "Group of Boy Friends (Boys Squad)", label: "Group of Boy Friends (Boys Squad)", desc: "Fun neighborhood squad of boys playing cricket or tag." },
      { value: "Boy & Cousin (Male Cousins)", label: "Boy & Cousin (Male Cousins)", desc: "Boy hanging out with his favorite male cousin." },
      { value: "Boy & Older Brother", label: "Boy & Older Brother", desc: "Little boy looking up to his protective older brother." },
      { value: "Boy & Younger Brother", label: "Boy & Younger Brother", desc: "Caring older boy guiding his cute younger brother." },
      { value: "Boy Football / Cricket Squad", label: "Boy Cricket / Football Squad", desc: "Group of young boys playing village cricket or soccer." },
      { value: "Boy Video Game Buddies", label: "Boy Video Game Buddies", desc: "Two boys sitting together with game controllers having fun." },
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
      { value: "Two Boys & One Girl", label: "Two Boys & One Girl", desc: "A trio consisting of two boys and one girl." },
      { value: "Two Girls & One Boy", label: "Two Girls & One Boy", desc: "A trio consisting of two girls and one boy." },
      { value: "Classmates", label: "Classmates", desc: "Two or more classmates talking." },
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
  {
    category: "Community Heroes & Career Roles",
    options: [
      { value: "Child & Pediatrician Doctor", label: "Child & Pediatrician Doctor 🏥", desc: "Child receiving a friendly checkup from a gentle pediatrician in a doctor clinic." },
      { value: "Child & Friendly Dentist", label: "Child & Friendly Dentist 🪥", desc: "Child getting a brave smile checkup at a dentist clinic." },
      { value: "Child & Pharmacist", label: "Child & Pharmacist 💊", desc: "Child getting sweet vitamin syrup from a friendly pharmacist." },
      { value: "Child & Veterinarian (Pet Doctor)", label: "Child & Veterinarian 🐾", desc: "Child helping a caring pet doctor examine a cute puppy or kitten." },
      { value: "Boy + Firefighter", label: "Boy + Firefighter 🚒", desc: "Little boy in a mini firefighter hat standing next to a real firefighter and red fire truck." },
      { value: "Girl + Firefighter", label: "Girl + Firefighter 🚒", desc: "Little girl wearing a firefighter helmet touring a fire station." },
      { value: "Child & Mail Carrier / Postman", label: "Child & Mail Carrier / Postman 📮", desc: "Child receiving a colorful letter or parcel from a friendly postman." },
      { value: "Child & Friendly Baker", label: "Child & Friendly Baker 🥐", desc: "Child baking delicious cupcakes with a master baker in a bakery kitchen." },
      { value: "Child & Pilot / Flight Captain", label: "Child & Pilot / Flight Captain ✈️", desc: "Child wearing pilot wings visiting an airplane cockpit with a friendly captain." },
      { value: "Child & Train Driver / Conductor", label: "Child & Train Driver 🚉", desc: "Child wearing a conductor cap waving to passengers at a train station." },
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

// --- NEW POETRY AND SONG SPLIT GROUPS ---
const POETRY_AGE_GROUPS = SONG_AGE_GROUPS; // Inheriting age groups
const POETRY_LOCATION_GROUPS = SONG_LOCATION_GROUPS;
const POETRY_VIBE_GROUPS = SONG_VIBE_GROUPS;
const POETRY_CHARACTER_SETUP_GROUPS = SONG_CHARACTER_SETUP_GROUPS;
const POETRY_CLOTHING_GROUPS = SONG_CLOTHING_GROUPS;
const POETRY_STYLE_GROUPS = [
  {
    category: "Poetry & Satire Style",
    options: [
      { value: "Sufi Kalam", label: "Sufi Kalam", desc: "Deep spiritual and mystical Sufi poetry." },
      { value: "Classic Ghazal", label: "Classic Ghazal", desc: "Traditional Ghazal format with deep romantic meaning." },
      { value: "Nazm (Storytelling Poetry)", label: "Nazm (Storytelling Poetry)", desc: "Poetry that tells a continuous story or theme." },
      { value: "Qataa (4-line short poetry)", label: "Qat'aa (4-line short)", desc: "Short, impactful four-line poetry." },
      { value: "Urdu/Punjabi Tappe", label: "Urdu/Punjabi Tappe", desc: "Folk traditional Punjabi or Urdu poetic verses." },
      { value: "Funny & Humorous Shayari (Tanzo Mazah)", label: "Funny & Humorous Shayari", desc: "Comedic and satirical poetry." },
      { value: "Takhallus Reveal (Ending)", label: "Takhallus Reveal (Ending)", desc: "The final signature verse of a Ghazal." }
    ]
  }
];
const POETRY_CROWD_FX_GROUPS = SONG_CROWD_FX_GROUPS; // Wah Wah, etc.
const POETRY_MUSIC_TYPE_GROUPS = [
  {
    category: "Background Music Instrument & Genre",
    options: [
      { value: "AI Decides", label: "🤖 AI Decides (Default)", desc: "Let the AI pick the most fitting background music style automatically." },
      { value: "Bollywood Romantic", label: "Bollywood Romantic", desc: "Flute, Violin, Soft Acoustic." },
      { value: "Bollywood Item Song", label: "Bollywood Item Song", desc: "Dholak, Synths, High Energy." },
      { value: "Bollywood 90s Melody", label: "Bollywood 90s Melody", desc: "Nostalgic Synth, Congas." },
      { value: "Ghazal & Semi-Classical", label: "Ghazal & Semi-Classical", desc: "Tabla, Sarangi, Harmonium." },
      { value: "Indian Classical", label: "Indian Classical", desc: "Sitar, Tabla, Tanpura." },
      { value: "Punjabi Pop", label: "Punjabi Pop", desc: "Tumbi, Dhol, Electronic Beat." },
      { value: "Pakistani Tarana / Milli Naghma", label: "Pakistani Tarana (Patriotic)", desc: "Grand orchestral, marching band, and patriotic anthem beats." },
      { value: "Punjabi Bhangra Dhol", label: "Punjabi Bhangra Dhol", desc: "High energy Punjabi Dhol beats." },
      { value: "Sufi Qawwali", label: "Sufi Qawwali", desc: "Harmonium, Dholak, Hand Claps." },
      { value: "Pop / Acoustic", label: "Pop / Acoustic", desc: "Mainstream pop or acoustic guitar." },
      { value: "Electric Guitar & Drums", label: "Electric Guitar & Drums", desc: "Full rock band setup." },
      { value: "Synth Pop Beat", label: "Synth Pop Beat", desc: "Modern electronic synth beat." },
      { value: "Acoustic Guitar", label: "Acoustic Guitar", desc: "Simple acoustic strumming." },
      { value: "Piano Ballad", label: "Piano Ballad", desc: "Emotional piano accompaniment." },
      { value: "Tabla & Harmonium", label: "Tabla & Harmonium", desc: "Classic Desi instruments." },
      { value: "Sitar & Flute", label: "Sitar & Flute", desc: "Traditional Indian classical setup." },
      { value: "Lo-Fi Hip Hop Beat", label: "Lo-Fi Hip Hop Beat", desc: "Chill and relaxing lo-fi music." },
      { value: "R&B / Soul Groove", label: "R&B / Soul Groove", desc: "Smooth bass and soulful rhythm." },
      { value: "Jazz / Blues", label: "Jazz / Blues", desc: "Saxophone, Upright Bass, Piano." },
      { value: "Country / Western", label: "Country / Western", desc: "Acoustic Guitar, Fiddle, Steel Guitar." },
      { value: "EDM / House", label: "EDM / House", desc: "Four-on-the-floor beat, heavy synths." },
      { value: "K-Pop / J-Pop", label: "K-Pop / J-Pop", desc: "Upbeat electronic pop production." },
      { value: "Afrobeat / Dancehall", label: "Afrobeat / Dancehall", desc: "Rhythmic percussion, tropical vibe." },
      { value: "Cinematic Orchestral", label: "Cinematic Orchestral", desc: "Epic string section and brass." },
      { value: "Heavy Metal / Hard Rock", label: "Heavy Metal / Hard Rock", desc: "Intense distorted guitars and loud drums." },
      { value: "Reggae / Dancehall", label: "Reggae / Dancehall", desc: "Upbeat tropical island vibe." },
      { value: "No Music (Acapella)", label: "No Music (Acapella)", desc: "Vocals only, no instruments." }
    ]
  }
];

const NEW_SONG_LOCATION_GROUPS = [
  {
    category: "🎸 Music Video & Stage Settings",
    options: [
      { value: "Live Concert Arena 🎤", label: "Live Concert Arena 🎤", desc: "Massive indoor arena with lasers, stage lights, and cheering fans." },
      { value: "Coke Studio Fusion Stage 🎸", label: "Coke Studio Stage 🎸", desc: "Modern lighting rig, oriental rugs, acoustic instruments, and electric vibe." },
      { value: "Underground Indie Club 🪩", label: "Underground Indie Club 🪩", desc: "Intimate dark club with neon signs and a small stage for local bands." },
      { value: "Modern Recording Studio Booth 🎧", label: "Recording Studio Booth 🎧", desc: "Professional studio booth with a condenser mic, soundproofing, and headphones." },
      { value: "Acoustic Beach Bonfire 🔥🌊", label: "Acoustic Beach Bonfire 🔥🌊", desc: "Nighttime beach setting with a crackling bonfire and friends playing guitar." },
      { value: "Neon Cyberpunk Street 🌃", label: "Neon Cyberpunk Street 🌃", desc: "Vibrant neon-lit rainy city street perfect for a modern pop music video." },
    ],
  },
  {
    category: "💕 Romantic & Aesthetic Locations",
    options: [
      { value: "Sunset Rooftop & City Skyline 🌇", label: "Sunset Rooftop & Skyline 🌇", desc: "Golden hour rooftop view of twinkling city lights under twilight sky." },
      { value: "Vintage European Cobblestone Street 🇫🇷🌙", label: "Vintage European Alley 🌙", desc: "Romantic narrow cobblestone alley with gas lanterns, ivy walls, and rain puddles." },
      { value: "Acoustic Music Studio 🎤", label: "Acoustic Music Studio 🎤", desc: "Studio stage with vintage ribbon microphones and warm spotlight bokeh." },
    ],
  },
  {
    category: "🎬 Bollywood & Desi Vibe Settings",
    options: [
      { value: "Grand Bollywood Palace / Haveli 🏰", label: "Bollywood Palace / Haveli 🏰", desc: "Luxurious traditional courtyard with glowing lanterns and royal architecture." },
      { value: "Festive Desi Wedding / Mehndi Stage 🎉", label: "Mehndi / Wedding Stage 🎉", desc: "Colorful marigold flowers, bright drapes, and fairy lights for a festive vibe." },
      { value: "Mustard Fields (Sarson ka Khet) 🌼", label: "Mustard Fields (Sarson ka Khet) 🌼", desc: "Endless bright yellow mustard fields under a sunny sky, classic Bollywood style." },
      { value: "Vibrant Indian Mela (Carnival) 🎪", label: "Desi Mela (Carnival) 🎪", desc: "Colorful village fair with giant ferris wheels, balloons, and sweet stalls." },
      { value: "Rainy Desi Street (Romantic Monsoon) 🌧️", label: "Monsoon Rainy Street 🌧️", desc: "Lush green trees and rain-soaked streets with a cinematic romantic Bollywood feel." },
      { value: "Royal Rajasthani Desert Camp 🏜️", label: "Rajasthani Desert Camp 🏜️", desc: "Sand dunes, folk dancers, glowing fire pits, and colorful desert tents." },
      { value: "Glitzy Bollywood Dance Floor 🪩", label: "Bollywood Disco Dance Floor 🪩", desc: "Retro or modern glitzy dance floor with flashing neon tiles and disco balls." }
    ]
  }
];

const SONG_STYLE_GROUPS_NEW = [
  {
    category: "Song Genre / Style",
    options: [
      { value: "Pop / Acoustic", label: "Pop / Acoustic", desc: "Mainstream pop or acoustic guitar." },
      { value: "Rock / Indie", label: "Rock / Indie", desc: "Energetic rock or indie style." },
      { value: "Hip-Hop / Rap", label: "Hip-Hop / Rap", desc: "Rhythmic hip-hop and rap vocal style." },
      { value: "Sufi / Folk", label: "Sufi / Folk", desc: "Traditional Sufi and folk fusion." },
      { value: "Lofi / Chillhop", label: "Lofi / Chillhop", desc: "Relaxed lofi beat style." }
    ]
  }
];

const SONG_CROWD_FX_GROUPS_NEW = [
  {
    category: "Concert / Audience FX",
    options: [
      { value: "Concert Crowd Cheers", label: "Concert Crowd Cheers", desc: "Loud stadium cheers." },
      { value: "Fans Singing Along", label: "Fans Singing Along", desc: "Crowd singing the chorus." },
      { value: "Simple Rhythmic Claps", label: "Simple Rhythmic Claps", desc: "Basic rhythmic hand clapping on the beat." },
      { value: "Polite Applause", label: "Polite Applause", desc: "Soft, polite clapping." },
      { value: "Finger Snaps", label: "Finger Snaps", desc: "Acoustic café style finger snapping." },
      { value: "Studio Silence", label: "Studio Silence", desc: "Pure studio environment with no crowd." }
    ]
  }
];

const SONG_MUSIC_TYPE_GROUPS = [
  {
    category: "Background Music Instrument & Genre",
    options: [
      { value: "AI Decides", label: "🤖 AI Decides (Default)", desc: "Let the AI pick the most fitting background music style automatically." },
      { value: "Bollywood Romantic", label: "Bollywood Romantic", desc: "Flute, Violin, Soft Acoustic." },
      { value: "Bollywood Item Song", label: "Bollywood Item Song", desc: "Dholak, Synths, High Energy." },
      { value: "Bollywood 90s Melody", label: "Bollywood 90s Melody", desc: "Nostalgic Synth, Congas." },
      { value: "Ghazal & Semi-Classical", label: "Ghazal & Semi-Classical", desc: "Tabla, Sarangi, Harmonium." },
      { value: "Indian Classical", label: "Indian Classical", desc: "Sitar, Tabla, Tanpura." },
      { value: "Punjabi Pop", label: "Punjabi Pop", desc: "Tumbi, Dhol, Electronic Beat." },
      { value: "Pakistani Tarana / Milli Naghma", label: "Pakistani Tarana (Patriotic)", desc: "Grand orchestral, marching band, and patriotic anthem beats." },
      { value: "Punjabi Bhangra Dhol", label: "Punjabi Bhangra Dhol", desc: "High energy Punjabi Dhol beats." },
      { value: "Sufi Qawwali", label: "Sufi Qawwali", desc: "Harmonium, Dholak, Hand Claps." },
      { value: "Pop / Acoustic", label: "Pop / Acoustic", desc: "Mainstream pop or acoustic guitar." },
      { value: "Electric Guitar & Drums", label: "Electric Guitar & Drums", desc: "Full rock band setup." },
      { value: "Synth Pop Beat", label: "Synth Pop Beat", desc: "Modern electronic synth beat." },
      { value: "Acoustic Guitar", label: "Acoustic Guitar", desc: "Simple acoustic strumming." },
      { value: "Piano Ballad", label: "Piano Ballad", desc: "Emotional piano accompaniment." },
      { value: "Tabla & Harmonium", label: "Tabla & Harmonium", desc: "Classic Desi instruments." },
      { value: "Sitar & Flute", label: "Sitar & Flute", desc: "Traditional Indian classical setup." },
      { value: "Lo-Fi Hip Hop Beat", label: "Lo-Fi Hip Hop Beat", desc: "Chill and relaxing lo-fi music." },
      { value: "R&B / Soul Groove", label: "R&B / Soul Groove", desc: "Smooth bass and soulful rhythm." },
      { value: "Jazz / Blues", label: "Jazz / Blues", desc: "Saxophone, Upright Bass, Piano." },
      { value: "Country / Western", label: "Country / Western", desc: "Acoustic Guitar, Fiddle, Steel Guitar." },
      { value: "EDM / House", label: "EDM / House", desc: "Four-on-the-floor beat, heavy synths." },
      { value: "K-Pop / J-Pop", label: "K-Pop / J-Pop", desc: "Upbeat electronic pop production." },
      { value: "Afrobeat / Dancehall", label: "Afrobeat / Dancehall", desc: "Rhythmic percussion, tropical vibe." },
      { value: "Cinematic Orchestral", label: "Cinematic Orchestral", desc: "Epic string section and brass." },
      { value: "Heavy Metal / Hard Rock", label: "Heavy Metal / Hard Rock", desc: "Intense distorted guitars and loud drums." },
      { value: "Reggae / Dancehall", label: "Reggae / Dancehall", desc: "Upbeat tropical island vibe." },
      { value: "No Music (Acapella)", label: "No Music (Acapella)", desc: "Vocals only, no instruments." }
    ]
  }
];


const CHARACTERS_PER_SCENE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Characters Count & Combos",
    options: [
      { value: "1 Character", label: "1 Character", desc: "Single character focus in every scene." },
      { value: "2 Characters (1 Man + 1 Girl Combo) 👫", label: "2 Characters (1 Man + 1 Girl Combo) 👫", desc: "Explicit duet combo pairing one man and one girl/woman." },
      { value: "3 Characters (1 Man + 1 Girl + 1 Musician) 👥", label: "3 Characters (1 Man + 1 Girl + Musician) 👥", desc: "Duet combo with an additional instrument player." },
      { value: "2 Characters", label: "2 Characters", desc: "Two characters (duo interaction - Recommended)." },
      { value: "3 Characters", label: "3 Characters", desc: "Three characters in the scene." },
      { value: "4 Characters", label: "4 Characters", desc: "Four characters / group family scene." },
      { value: "Custom", label: "Custom", desc: "Specify custom character count or breakdown." },
    ],
  },
];

// 5.5 KIDS CLOTHING OPTIONS — Separated by Girl & Boy
const KIDS_CLOTHING_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🇰🇷 Korean Fashion & Hanbok Outfits",
    options: [
      { value: "Korean Pastel Oversized Knit Sweater & Beanie 🇰🇷", label: "Korean Oversized Knit & Beanie 🇰🇷", desc: "Cozy Korean pastel oversized sweater, bucket hat/beanie, dark trousers, and cute sneakers." },
      { value: "Korean Traditional Silk Hanbok Dress (Chuseok) 👘", label: "Korean Traditional Silk Hanbok Dress 👘", desc: "Vibrant traditional Korean silk Hanbok with embroidered ribbon (Otgoreum) and pouch." },
      { value: "Korean K-Pop Aesthetic Streetwear & Cardigan 🎵", label: "Korean K-Pop Aesthetic Streetwear 🎵", desc: "Trendy Korean idol-inspired oversized cardigan, graphic tee, cargo pants, and fresh kicks." },
      { value: "Korean Chic School Uniform (K-Drama Style) 🎒", label: "Korean K-Drama School Uniform 🎒", desc: "Neat Korean school uniform with pleated skirt/trousers, tie, blazer, and cute backpack." },
    ]
  },
  {
    category: "👗 Girls — Everyday & Casual",
    options: [
      { value: "Girl — Colorful Casual T-shirt & Jeans", label: "Colorful Casual T-shirt & Jeans", desc: "Bright pastel t-shirt with comfy jeans and cute sneakers." },
      { value: "Girl — Floral Dress & Sandals", label: "Floral Dress & Sandals", desc: "Pretty floral summer dress with flat sandals." },
      { value: "Girl — Dungarees / Overalls", label: "Dungarees / Overalls", desc: "Adorable denim or pastel dungaree overalls with a stripe tee." },
      { value: "Girl — Cozy Pajamas / Sleepwear", label: "Cozy Pajamas / Sleepwear", desc: "Cute matching pajamas with cartoon prints." },
      { value: "Girl — Soft Pastel Leggings & Top", label: "Soft Pastel Leggings & Top", desc: "Aesthetic pastel leggings with a matching crop top." },
      { value: "Girl — Skirt & Blouse", label: "Skirt & Blouse", desc: "Cute pleated skirt with a ruffled blouse." },
      { value: "Girl — Sporty Tracksuit", label: "Sporty Tracksuit", desc: "Athletic tracksuit in bright colors with sporty sneakers." },
      { value: "Girl — Winter Sweater & Boots", label: "Winter Sweater & Boots", desc: "Fluffy chunky sweater, warm leggings, and ankle boots." },
      { value: "Girl — Denim Jacket & Skirt", label: "Denim Jacket & Skirt", desc: "Cool denim jacket over a floral skirt." },
    ]
  },
  {
    category: "✨ Girls — Traditional & Cultural",
    options: [
      { value: "Girl — Desi Shalwar Kameez", label: "Desi Shalwar Kameez (شلوار قمیض)", desc: "Traditional clean shalwar kameez with dupatta for girls." },
      { value: "Girl — Embroidered Frocksuit / Lawn Frock", label: "Embroidered Frock / Lawn Suit", desc: "Colorful embroidered frock suit with lace trim and churidar." },
      { value: "Girl — Fancy Eid Festive Dress", label: "Fancy Eid Dress (عید لباس)", desc: "Festive embroidered dress with glitter and bright colors." },
      { value: "Girl — Sindhi / Phulkari Embroidered Outfit", label: "Sindhi / Phulkari Embroidered Outfit", desc: "Vibrant folk embroidery outfit with mirror-work and bright thread." },
      { value: "Girl — Desi School Uniform (Pinafore)", label: "Desi School Uniform (Pinafore)", desc: "Neat white shirt with dark pinafore dress and white socks." },
      { value: "Girl — Princess Gown (Desi Style)", label: "Princess Gown (Desi Style)", desc: "Glittery Cinderella-style princess gown with tiara and heels." },
      { value: "Girl — Ghagra Choli", label: "Ghagra Choli (Indian Folk)", desc: "Colorful traditional Ghagra Choli with lehenga and dupatta." },
    ]
  },
  {
    category: "🎀 Girls — Costumes & Special",
    options: [
      { value: "Girl — Fairy Costume with Wings", label: "Fairy Costume with Wings", desc: "Shimmery fairy outfit with sparkly wings and wand." },
      { value: "Girl — Superhero Cape & Mask", label: "Superhero Cape & Mask", desc: "Fun homemade superhero costume with a bright cape and mask." },
      { value: "Girl — Animal Onesie", label: "Animal Onesie", desc: "Cute plush onesie like bunny, cat, panda, or unicorn." },
      { value: "Girl — Ballet Tutu & Leotard", label: "Ballet Tutu & Leotard", desc: "Classic pink ballet tutu with matching leotard and ballet flats." },
      { value: "Girl — Doctor Coat & Stethoscope", label: "Tiny Doctor Coat", desc: "Mini white doctor coat with stethoscope toy." },
      { value: "Girl — Chef Apron & Hat", label: "Chef Apron & Hat", desc: "Miniature chef apron and tall white chef hat." },
    ]
  },
  {
    category: "👕 Boys — Everyday & Casual",
    options: [
      { value: "Boy — Casual T-shirt & Shorts", label: "Casual T-shirt & Shorts", desc: "Simple graphic t-shirt with cargo or jogger shorts." },
      { value: "Boy — Hoodie & Sweatpants", label: "Hoodie & Sweatpants", desc: "Comfy hoodie with matching sweatpants and sneakers." },
      { value: "Boy — Denim Jacket & Jeans", label: "Denim Jacket & Jeans", desc: "Cool double denim look with graphic tee underneath." },
      { value: "Boy — Sporty Tracksuit", label: "Sporty Tracksuit", desc: "Athletic tracksuit in bold colors with matching sports shoes." },
      { value: "Boy — Cozy Pajamas / Sleepwear", label: "Cozy Pajamas / Sleepwear", desc: "Cute matching pajamas with superhero or cartoon prints." },
      { value: "Boy — Polo Shirt & Trousers", label: "Polo Shirt & Trousers", desc: "Smart-casual polo shirt with neat trousers and loafers." },
      { value: "Boy — Graphic Tee & Joggers", label: "Graphic Tee & Joggers", desc: "Fun graphic print tee with jogger pants and sneakers." },
      { value: "Boy — Winter Coat & Boots", label: "Winter Coat & Boots", desc: "Warm puffer coat, jeans, beanie, and winter boots." },
    ]
  },
  {
    category: "🧕 Boys — Traditional & Cultural",
    options: [
      { value: "Boy — Desi Shalwar Kameez", label: "Desi Shalwar Kameez (شلوار قمیض)", desc: "Traditional clean shalwar kameez for boys." },
      { value: "Boy — Kurta & Pajama", label: "Desi Kurta & Pajama", desc: "Vibrant embroidered traditional boys kurta with pajama." },
      { value: "Boy — Fancy Eid Sherwani", label: "Fancy Eid Sherwani (شیروانی)", desc: "Elegant sherwani with khussa shoes for Eid occasion." },
      { value: "Boy — Sindhi / Punjabi Folk Attire", label: "Sindhi / Punjabi Folk Attire", desc: "Cultural clothes with traditional embroidery or Phulkari work." },
      { value: "Boy — Desi School Uniform", label: "Desi School Uniform (یونیفارم)", desc: "Neat white shirt with dark trousers and black shoes." },
      { value: "Boy — Pathani Shalwar Suit", label: "Pathani Shalwar Suit", desc: "Classic Pathani-style kameez shalwar with khussa." },
      { value: "Boy — Dhoti & Kurta", label: "Dhoti & Kurta (Indian Folk)", desc: "Traditional white dhoti with embroidered kurta." },
    ]
  },
  {
    category: "🦸 Boys — Costumes & Special",
    options: [
      { value: "Boy — Superhero Costume", label: "Superhero Costume", desc: "Full superhero outfit with cape, mask, and belt." },
      { value: "Boy — Animal Onesie", label: "Animal Onesie", desc: "Cute plush onesie like lion, dinosaur, bear, or tiger." },
      { value: "Boy — Pilot / Aviator Suit", label: "Pilot / Aviator Suit", desc: "Mini aviator jacket, goggles, and captain cap." },
      { value: "Boy — Chef Apron & Hat", label: "Chef Apron & Hat", desc: "Miniature chef apron and tall white chef hat." },
      { value: "Boy — Doctor Coat & Stethoscope", label: "Tiny Doctor Coat", desc: "Mini white doctor coat with stethoscope toy." },
      { value: "Boy — Astronaut Suit", label: "Astronaut Suit", desc: "White space suit with helmet visor and NASA-style patches." },
      { value: "Boy — Mini Police Uniform", label: "Mini Police Uniform", desc: "Cute toy police uniform with cap, badge, and belt." },
    ]
  },
];

// 5.6 KIDS EXPRESSION / REACTION STYLE
const KIDS_EXPRESSION_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🤖 Default",
    options: [
      { value: "Any / AI Decides", label: "Any / AI Decides", desc: "Let the AI choose the most fitting expression for the scene." },
    ]
  },
  {
    category: "Cute & Heartwarming",
    options: [
      { value: "Wide Eyes Surprise", label: "Wide Eyes Surprise", desc: "Big adorable surprised eyes with an open mouth." },
      { value: "Burst Out Laughing", label: "Burst Out Laughing", desc: "Uncontrollable giggles with head thrown back." },
      { value: "Sunshine Beam Smile", label: "Sunshine Beam Smile", desc: "Ear-to-ear heart-melting beam of pure joy." },
      { value: "Shy Hide Face", label: "Shy Hide Face", desc: "Hiding face in hands or looking away with rosy cheeks." },
      { value: "Adorable Head Tilt", label: "Adorable Head Tilt", desc: "Cute tilted head with a puzzled or wondering expression." },
    ]
  },
  {
    category: "Funny & Viral",
    options: [
      { value: "Pouty Lip About to Cry", label: "Pouty Lip / About to Cry", desc: "Quivering lip and glistening eyes — maximum cute drama." },
      { value: "Sneaky Side-Eye", label: "Sneaky Side-Eye", desc: "Mischievous glance sideways, clearly plotting something." },
      { value: "Disgusted Face", label: "Disgusted Face", desc: "Dramatic disgust at food or something they dislike." },
      { value: "Mini Lecture Mode", label: "Mini Lecture Mode", desc: "Wagging finger seriously, explaining something with authority." },
      { value: "Confused Blink", label: "Confused Blink", desc: "Slow blink with a deeply puzzled expression." },
      { value: "Dramatic Gasp", label: "Dramatic Gasp", desc: "Over-the-top shocked gasp with hand on cheek." },
    ]
  },
  {
    category: "Triumphant & Proud",
    options: [
      { value: "Victory Fist Pump", label: "Victory Fist Pump", desc: "Triumphant celebration arms raised high." },
      { value: "Proud Arms Crossed", label: "Proud Arms Crossed", desc: "Confident pose with arms crossed and satisfied smile." },
      { value: "Embarrassed Red Cheeks", label: "Embarrassed Red Cheeks", desc: "Red cheeks, looking down, covering face with a shy smile." },
      { value: "None / Natural", label: "None / Natural (AI decides)", desc: "Let the AI choose the most fitting natural expression." },
    ]
  },
];

// 5.7 FOOD / SNACK IN SCENE
const KIDS_FOOD_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🤖 Default",
    options: [
      { value: "Any / AI Decides", label: "Any / AI Decides", desc: "Let the AI choose what food or snack to include, if any." },
    ]
  },
  {
    category: "Desi Favourites",
    options: [
      { value: "Mango Slice (Aam)", label: "Mango Slice (آم)", desc: "Juicy ripe mango slice dripping in summer sweetness." },
      { value: "Samosa", label: "Samosa (سموسہ)", desc: "Hot triangle Desi fried snack with chutney." },
      { value: "Kheer / Halwa", label: "Kheer / Halwa (کھیر / حلوہ)", desc: "Traditional sweet dessert bowl of Kheer or Halwa." },
      { value: "Aam Papad / Tamarind Candy", label: "Aam Papad / Imli Candy", desc: "Tangy roll-up Aam Papad or Imli candy on a stick." },
      { value: "Gulab Jamun", label: "Gulab Jamun (گلاب جامن)", desc: "Soft syrupy Gulab Jamun in a bowl." },
      { value: "Chai (Desi Tea)", label: "Desi Chai Cup (چائے)", desc: "Steaming cup of milky Desi Chai." },
    ]
  },
  {
    category: "Sweet & Fun",
    options: [
      { value: "Ice Cream Cone", label: "Ice Cream Cone 🍦", desc: "Single or double scoop cone with rainbow sprinkles." },
      { value: "Birthday Cake Slice", label: "Birthday Cake Slice 🎂", desc: "A colourful birthday cake slice with candles." },
      { value: "Lollipop", label: "Big Round Lollipop 🍭", desc: "Oversized colourful spiral lollipop." },
      { value: "Chocolate Bar", label: "Chocolate Bar 🍫", desc: "Unwrapped or half-bitten chocolate bar." },
      { value: "Cupcake", label: "Cupcake 🧁", desc: "Frosted cupcake with sprinkles on top." },
      { value: "Cotton Candy", label: "Cotton Candy (Pashmak) 🩷", desc: "Fluffy pink cotton candy on a stick." },
    ]
  },
  {
    category: "Healthy & Fruit",
    options: [
      { value: "Watermelon Slice", label: "Watermelon Slice 🍉", desc: "Big red juicy slice of watermelon." },
      { value: "Apple", label: "Apple 🍎", desc: "Shiny red apple held in small hands." },
      { value: "Banana", label: "Banana 🍌", desc: "Yellow banana mid-peel." },
      { value: "Fresh Fruit Plate", label: "Fresh Fruit Plate 🍓", desc: "Colourful platter of grapes, strawberries, and berries." },
    ]
  },
  {
    category: "Snacks & Savoury",
    options: [
      { value: "Chips / Crisps Packet", label: "Chips / Crisps Packet 🥔", desc: "Open Lays or crisp packet being crunched." },
      { value: "Popcorn Bowl", label: "Popcorn Bowl 🍿", desc: "Overflowing bowl of buttered popcorn." },
      { value: "Pizza Slice", label: "Pizza Slice 🍕", desc: "Stretchy cheesy pizza slice." },
      { value: "Burger", label: "Burger 🍔", desc: "Mini kids burger with dripping cheese." },
      { value: "None / No Food", label: "None / No Food", desc: "No food in the scene." },
    ]
  },
];

// 5.8 PROPS / OBJECT IN HAND
const KIDS_PROP_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🤖 Default",
    options: [
      { value: "Any / AI Decides", label: "Any / AI Decides", desc: "Let the AI choose what prop or object to include, if any." },
    ]
  },
  {
    category: "Toys & Comfort",
    options: [
      { value: "Teddy Bear", label: "Teddy Bear 🧸", desc: "Classic soft stuffed teddy bear." },
      { value: "Toy Car / Truck", label: "Toy Car / Truck 🚗", desc: "Boys' classic toy car or mini truck." },
      { value: "Doll / Barbie", label: "Doll / Barbie 🪆", desc: "Colourful doll or Barbie in hand." },
      { value: "Stuffed Animal", label: "Stuffed Animal", desc: "Random cute plush animal toy." },
    ]
  },
  {
    category: "Art & School",
    options: [
      { value: "Coloring Book & Crayons", label: "Colouring Book & Crayons 🖍️", desc: "Open colouring book with a box of crayons." },
      { value: "Pencil & Notebook", label: "Pencil & Notebook 📝", desc: "Little pencil and exercise notebook." },
      { value: "School Bag / Backpack", label: "School Bag / Backpack 🎒", desc: "Ready-for-school backpack on shoulders or in hand." },
      { value: "Book / Storybook", label: "Storybook / Book 📚", desc: "Holding an open picture storybook." },
    ]
  },
  {
    category: "Festive & Fun",
    options: [
      { value: "Balloon (bunch)", label: "Balloon Bunch 🎈", desc: "Colourful bunch of helium balloons." },
      { value: "Single Balloon", label: "Single Balloon 🎈", desc: "Holding one big round balloon on a string." },
      { value: "Flower Bouquet", label: "Flower Bouquet 💐", desc: "Giving or holding a bunch of colourful flowers." },
      { value: "Magic Wand", label: "Magic Wand 🪄", desc: "Sparkly fairy magic wand." },
      { value: "Kite", label: "Kite 🪁", desc: "Holding a string attached to a flying kite." },
    ]
  },
  {
    category: "Tech & Instruments",
    options: [
      { value: "Tablet / Smartphone", label: "Tablet / Smartphone 📱", desc: "Kids-sized tablet or smartphone." },
      { value: "Toy Microphone", label: "Toy Microphone 🎤", desc: "Bright colourful toy microphone singing into." },
      { value: "Dholki / Mini Drum", label: "Dholki / Mini Drum 🥁", desc: "Desi dholki or mini toy drum." },
      { value: "None / No Prop", label: "None / No Prop", desc: "No prop — natural empty hands." },
    ]
  },
];

// 5.9 TIME OF DAY / LIGHTING MOOD
const TIME_OF_DAY_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Daytime",
    options: [
      { value: "Bright Morning Sunshine", label: "Bright Morning Sunshine ☀️", desc: "Warm golden hour morning light streaming in." },
      { value: "Afternoon Daylight", label: "Afternoon Daylight", desc: "Clear neutral midday lighting, bright and crisp." },
      { value: "Overcast Cloudy Day", label: "Overcast Cloudy Day ⛅", desc: "Soft diffused light, slightly muted and gentle." },
    ]
  },
  {
    category: "Evening & Night",
    options: [
      { value: "Golden Hour Sunset", label: "Golden Hour Sunset 🌅", desc: "Warm orange-pink dusk glow through windows or outdoors." },
      { value: "Blue Hour Twilight", label: "Blue Hour Twilight 🌆", desc: "Cool soft purple-blue twilight just after sunset." },
      { value: "Cozy Night Lamp", label: "Cozy Night Lamp 🌙", desc: "Soft warm indoor lamp light at night, cozy atmosphere." },
      { value: "Starry Night Sky", label: "Starry Night Sky ⭐", desc: "Clear night with visible stars, outdoor or rooftop scene." },
    ]
  },
  {
    category: "Weather & Seasonal",
    options: [
      { value: "Rainy Day Indoors", label: "Rainy Day Indoors 🌧️", desc: "Rain on the window, cozy warm indoor glow." },
      { value: "Snowfall Winter", label: "Snowfall Winter ❄️", desc: "Soft falling snow, winter wonderland atmosphere." },
      { value: "Spring Bloom", label: "Spring Bloom 🌸", desc: "Cherry blossom petals falling, fresh green light." },
      { value: "Any / AI Decides", label: "Any / AI Decides", desc: "Let the AI pick the most fitting time and lighting." },
    ]
  },
];

// 5.91 STORY BEAT / NARRATIVE MOMENT
const STORY_BEAT_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🤖 Default",
    options: [
      { value: "Any / AI Decides", label: "Any / AI Decides", desc: "Let the AI craft the narrative moment freely." },
    ]
  },
  {
    category: "Funny & Viral Moments",
    options: [
      { value: "Kid Caught Red-Handed", label: "Kid Caught Red-Handed 😳", desc: "Getting caught doing something naughty mid-act." },
      { value: "Sneaking a Snack", label: "Sneaking a Snack 🍪", desc: "Tiptoeing quietly to steal a cookie or snack." },
      { value: "Refusing Vegetables", label: "Refusing Vegetables 🥦", desc: "Classic hilarious veggie rejection scene." },
      { value: "Disgusted Food Reaction", label: "Disgusted Food Reaction 🤢", desc: "Dramatic over-the-top reaction to tasting something yucky." },
      { value: "Sneaky Side-Eye Plotting", label: "Sneaky Plotting Side-Eye 😏", desc: "Kid glancing sideways mischievously, clearly scheming." },
    ]
  },
  {
    category: "Heartwarming Moments",
    options: [
      { value: "Big Reveal Surprise", label: "Big Reveal / Surprise 🎁", desc: "Unwrapping a gift or discovering a surprise." },
      { value: "First Day Achievement", label: "First Day Achievement 🏆", desc: "Showing off a result or trophy proudly." },
      { value: "Asking a Deep Innocent Question", label: "Asking Deep Innocent Question 🤔", desc: "Sweet philosophical question to a parent or teacher." },
      { value: "Showing Off Skills", label: "Showing Off Skills 🌟", desc: "Dancing, counting, singing, or reciting something proudly." },
      { value: "Making Up After Fight", label: "Making Up After a Fight 🤝", desc: "Two kids hugging and reconciling after a disagreement." },
    ]
  },
  {
    category: "Learning & Discovery",
    options: [
      { value: "Trying Something New", label: "Trying Something New 🆕", desc: "Hesitant first bite, first step, or first attempt." },
      { value: "Fixing a Mistake", label: "Fixing a Mistake ✏️", desc: "Realizing an error and correcting it earnestly." },
      { value: "Sharing With a Friend", label: "Sharing With a Friend 🤲", desc: "Generously offering a snack or toy to another kid." },
      { value: "None / Open Story", label: "None / Open Story", desc: "No fixed beat — let the AI craft the narrative." },
    ]
  },
];

// 5.92 CAMERA SHOT STYLE
const CAMERA_SHOT_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Fixed & Locked Camera",
    options: [
      { value: "Fixed Camera on Character", label: "Fixed Camera on Character 📌", desc: "Camera locked stationary on the main character throughout the scene with no panning or shaking." },
      { value: "Static Center Framing", label: "Static Center Framing 🎯", desc: "Character remains perfectly locked in center frame as background action happens." },
      { value: "Tracking Lock on Character", label: "Tracking Lock on Character 🎥", desc: "Camera follows character movement smoothly keeping them fixed in center view." },
    ]
  },
  {
    category: "Standard Shots",
    options: [
      { value: "Close-Up Face Shot", label: "Close-Up Face Shot 🎥", desc: "Tight shot on the kid's face and expressions." },
      { value: "Full Body Wide Shot", label: "Full Body Wide Shot", desc: "Head-to-toe view with environment clearly visible." },
      { value: "Medium Shot (Waist Up)", label: "Medium Shot (Waist Up)", desc: "Mid-body shot from the waist up." },
    ]
  },
  {
    category: "Cinematic & Creative",
    options: [
      { value: "Over-Shoulder Shot", label: "Over-Shoulder Shot", desc: "Camera behind one character looking at another." },
      { value: "Low Angle (Kid Hero POV)", label: "Low Angle / Kid Hero POV", desc: "Camera at kid's eye level, makes them look heroic." },
      { value: "Bird's Eye Top-Down", label: "Bird's Eye / Top-Down View", desc: "Overhead aerial view of the kid and scene." },
      { value: "Slow Motion Reaction", label: "Slow Motion Reaction ✨", desc: "Slow-motion capture of an expression change or action." },
      { value: "Zoom-In Reveal", label: "Zoom-In Reveal", desc: "Camera slowly zooms in to reveal a reaction or detail." },
      { value: "Any / AI Decides", label: "Any / AI Decides", desc: "Let the AI pick the most cinematic shot style." },
    ]
  },
];

// 5.93 CHARACTER PERFORMANCE
const CHARACTER_PERFORMANCE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "🤖 Default",
    options: [
      { value: "Any / AI Decides", label: "Any / AI Decides", desc: "Let the AI decide the best performance style for the scene." },
    ]
  },
  {
    category: "Speech & Expression",
    options: [
      { value: "Dialogue", label: "🗣️ Dialogue", desc: "Kid speaks naturally — words, sentences, funny or heartfelt lines." },
      { value: "Off-Screen Voiceover (No Lip-Sync)", label: "🎙️ Off-Screen Voiceover (No Lip-Sync)", desc: "Background narrator / voiceover plays audio while character acts silently with no mouth movement." },
      { value: "Silent Expressions", label: "🤫 Silent Expressions", desc: "No words — just powerful, expressive facial acting." },
      { value: "Cute Reactions", label: "😊 Cute Reactions", desc: "Responding to something with adorable non-verbal reactions." },
      { value: "Emotional Acting", label: "😭 Emotional Acting", desc: "Deep heartfelt performance — joy, sadness, pride, or love." },
      { value: "Surprise Moments", label: "😲 Surprise Moments", desc: "Shocked, startled, or astonished big dramatic reaction." },
    ]
  },
  {
    category: "Movement & Action",
    options: [
      { value: "Dance", label: "💃 Dance", desc: "Kid performs a fun dance move, groove, or freestyle." },
      { value: "Lip Sync", label: "🎵 Lip Sync", desc: "Mouthing lyrics or words to a song with energy and style." },
      { value: "Funny Actions", label: "😂 Funny Actions", desc: "Slapstick, goofy physical comedy — falling, wobbling, tripping." },
      { value: "Mixed Performance", label: "🎭 Mixed Performance", desc: "Combines dialogue, expressions, and movement in one scene." },
    ]
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
    category: "🇰🇷 East Asian & Korean Style Aesthetics",
    options: [
      { value: "Korean (K-Drama / Seoul Streetwear) 🇰🇷", label: "Korean (K-Drama / Seoul Fashion) 🇰🇷", desc: "Trendy Korean K-drama kid aesthetic, glass skin, K-pop style hair, pastel streetwear." },
      { value: "Korean Traditional Hanbok (Chuseok / Festival) 👘", label: "Korean Traditional Hanbok 👘", desc: "Charming traditional silk Hanbok dress with embroidered pouch and ribbon headband." },
      { value: "Japanese Kawaii / Harajuku Style 🇯🇵", label: "Japanese Kawaii Anime Style 🇯🇵", desc: "Ultra-cute Japanese Kawaii aesthetic, anime-inspired pastel outfit, and cute hairclips." },
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
      { value: "AI Decides", label: "🤖 AI Decides (Default)", desc: "Let the AI pick the most fitting background music style automatically." },
      { value: "None", label: "None", desc: "No background music specified. Pure ambient dialogue & sound effects." },
    ],
  },
  {
    category: "🪘 Dholki & Percussion Rhythms (ڈھولک اور بیٹس)",
    options: [
      { value: "Just Dholki & Rhythm Beat (ڈھولک بیٹس)", label: "Just Dholki & Rhythm Beat (ڈھولک بیٹس)", desc: "Pure acoustic Dholki percussion and rhythmic hand clapping beat (no heavy synths)." },
      { value: "Acoustic Dholak & Tabla Beat", label: "Acoustic Dholak & Tabla Beat", desc: "Traditional wooden Dholak paired with crisp Tabla beats and gentle rhythmic pulses." },
      { value: "Desi Dholak & Clapping Folk Beat", label: "Desi Dholak & Clapping Folk Beat", desc: "Authentic wedding Dholak beat with synchronized hand clapping and folk energy." },
    ],
  },
  {
    category: "🎬 Bollywood & Filmi Music Styles (بالی وڈ نغمے)",
    options: [
      { value: "Bollywood Romantic Strings & Violin", label: "Bollywood Romantic Strings & Violin", desc: "Lush romantic Bollywood orchestral strings, passionate violin solo, and emotional score." },
      { value: "Bollywood Lo-Fi Chill Beats & Flute", label: "Bollywood Lo-Fi Chill Beats & Flute", desc: "Cozy lofi hip-hop beat blended with romantic Bollywood Bansuri flute and vinyl warmth." },
      { value: "90s Classic Bollywood Melodious Beat", label: "90s Classic Bollywood Melodious Beat", desc: "Nostalgic 90s Bollywood melody with acoustic guitar, Dholak, and sweet flute accents." },
      { value: "Upbeat Bollywood Dance & Party Beat", label: "Upbeat Bollywood Dance & Party Beat", desc: "High-energy Bollywood dance party beat with brass fanfares, Dhol, and electronic bass drops." },
      { value: "Sufi Bollywood Fusion & Harmonium", label: "Sufi Bollywood Fusion & Harmonium", desc: "Soulful Sufi-style Bollywood fusion with Harmonium, Dholak, and passionate vocal hooks." },
      { value: "Bollywood Acoustic Guitar & Piano", label: "Bollywood Acoustic Guitar & Piano", desc: "Gentle unplugged Bollywood guitar strumming and soft romantic piano chords." },
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
    category: "Patriotic & National",
    options: [
      { value: "Pakistan Tarana", label: "Pakistan Tarana (پاکستانی ترانہ)", desc: "Inspiring and patriotic Pakistani national anthem style (Tarana) music with military band & orchestral elements." },
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
      { value: "Bansuri Flute & Ambient Nature", label: "Bansuri Flute & Ambient Nature", desc: "Peaceful bamboo Bansuri flute paired with soft nature sounds." },
      { value: "Nasheed / Vocal Only", label: "Nasheed / Vocal Only", desc: "Harmonious vocal-only a cappella background melodies without instruments." },
    ],
  },
  {
    category: "Coke Studio & Commercial Desi Fusion",
    options: [
      { value: "Coke Studio Style Fusion", label: "Coke Studio Fusion", desc: "Soulful fusion of Desi folk instruments with modern electric guitars and bass." },
      { value: "Sufi Rock & Acoustic Fusion", label: "Sufi Rock & Acoustic Fusion", desc: "Passionate Sufi vocals backed by acoustic strumming and rock guitar solos." },
      { value: "Bollywood Masala & Filmi", label: "Bollywood Masala & Filmi", desc: "Upbeat cinematic Bollywood dance rhythms and brass fanfares." },
      { value: "Desi Hip-Hop & Trap", label: "Desi Hip-Hop & Trap", desc: "Heavy bass 808s blended with Desi ethnic synth melodies." },
    ],
  },
  {
    category: "Global & Popular Music Genres",
    options: [
      { value: "Pop & Upbeat Dance", label: "Pop & Upbeat Dance", desc: "Catchy modern synth-pop and energetic radio hit melodies." },
      { value: "Afrobeats & Afro-Pop Rhythm", label: "Afrobeats & Afro-Pop", desc: "Bouncy, rhythmic Afrobeats with tropical percussion and infectious guitars." },
      { value: "Hip-Hop & Urban Beats", label: "Hip-Hop & Urban Beats", desc: "Rhythmic beat drops, funky basslines, and boom-bap drums." },
      { value: "Rock & Electric Guitars", label: "Rock & Electric Guitars", desc: "High-energy electric guitar riffs, bass, and punchy acoustic drums." },
      { value: "EDM & Electronic Dance", label: "EDM & Electronic Dance", desc: "High-bpm electronic synth drops, festival beats, and energetic bass." },
      { value: "Synthwave & 80s Retro Neon", label: "Synthwave & 80s Retro Neon", desc: "Nostalgic 80s analog synths, retro drum machines, and synthwave vibes." },
      { value: "Phonk & Drift Bass", label: "Phonk & Drift Bass", desc: "Aggressive distorted phonk basslines, heavy cowbells, and energetic dark beats." },
      { value: "Lo-Fi Chill & Chillhop", label: "Lo-Fi Chill & Chillhop", desc: "Relaxing lofi beats, vinyl crackle, and cozy acoustic piano chords." },
      { value: "Smooth Jazz & Lounge", label: "Smooth Jazz & Lounge", desc: "Cool saxophone, upright bass, and relaxed cafe jazz piano." },
      { value: "Orchestral & Grand Symphony", label: "Orchestral & Grand Symphony", desc: "Full symphonic strings, brass fanfares, and epic cinematic timpani." },
      { value: "Cinematic Epic & Dramatic", label: "Cinematic Epic & Dramatic", desc: "Suspenseful movie trailer strings, brass swells, and action percussion." },
      { value: "Kids Nursery Rhymes", label: "Kids Nursery Rhymes", desc: "Playful xylophone, cute bells, and joyful children's melody tunes." },
      { value: "Lullaby & Music Box", label: "Lullaby & Gentle Music Box", desc: "Gentle winding music box, soft harp strings, and bedtime lullaby chords." },
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

const OUTRO_EFFECTS_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Festive & Celebration",
    options: [
      { value: "None", label: "None (Default)", desc: "No special ending effect." },
      { value: "Confetti Burst", label: "Confetti Burst (آتش بازی/کونفیٹی)", desc: "Colorful confetti explosion celebrating the end of the scene." },
      { value: "Sparkles & Glitters", label: "Sparkles & Glitters", desc: "Magical fairy sparkles twinkling across the screen." },
      { value: "Balloon Drop", label: "Balloon Drop", desc: "Colorful helium balloons drifting down from above." },
      { value: "Firework Finale", label: "Firework Finale", desc: "Spectacular miniature fireworks lighting up the background." },
    ],
  },
  {
    category: "Cinematic Transitions",
    options: [
      { value: "Fade to Black", label: "Fade to Black", desc: "Cinematic fade-out to black screen." },
      { value: "Motion Blur Zoom out", label: "Motion Blur Zoom out", desc: "Dynamic blur effect as camera zooms out rapidly." },
      { value: "Camera Flash & Freeze Frame", label: "Camera Flash & Freeze Frame", desc: "Bright white flash ending in a sweet Polaroid-style freeze frame." }
    ]
  }
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
  kidsClothing?: string;
  kidsExpression?: string;
  kidsFood?: string;
  kidsProp?: string;
  timeOfDay?: string;
  storyBeat?: string;
  cameraShot?: string;
  customSceneDescription?: string;
  outroEffects?: string;
  isShortIdea?: boolean;
  withoutDialogue?: boolean;
  withoutMusic?: boolean;
  videoDuration?: number;
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

function cleanPromptText(text: string): string {
  if (!text) return "";
  return text.replace(/\[FORMAT:[^\]]+\]\s*/gi, "").trim();
}

function getIdeaDialogue(idea: SavedIdea): string {
  // If dialogue is disabled or category is Fruit Dancing / Animal Dancing, return empty string
  if (idea.withoutDialogue || idea.category === "FRUIT_DANCING" || idea.category === "ANIMAL_DANCING") {
    return "";
  }

  // If user provided a custom dialogue script, return full script directly
  if (idea.customDialogue && idea.customDialogue.trim()) {
    return cleanPromptText(idea.customDialogue.trim());
  }

  const text = cleanPromptText(idea.text || "");

  // Check for 20-second two-sequence dialogue matches
  const seq1Match = text.match(/(?:First Sequence Spoken Dialogue|Sequence 1 Dialogue|First Sequence Dialogue|0-10s Spoken Dialogue):\s*["']?([^\n\r]+)/i);
  const seq2Match = text.match(/(?:Second Sequence Spoken Dialogue|Sequence 2 Dialogue|Second Sequence Dialogue|10-20s Spoken Dialogue):\s*["']?([^\n\r]+)/i);

  if (seq1Match && seq2Match) {
    const s1 = seq1Match[1].replace(/^["'\s]+|["'\s]+$/g, "").trim();
    const s2 = seq2Match[1].replace(/^["'\s]+|["'\s]+$/g, "").trim();
    return `First Sequence (0-10s): "${s1}"\nSecond Sequence (10-20s): "${s2}"`;
  } else if (seq1Match) {
    const s1 = seq1Match[1].replace(/^["'\s]+|["'\s]+$/g, "").trim();
    return `First Sequence (0-10s): "${s1}"`;
  } else if (seq2Match) {
    const s2 = seq2Match[1].replace(/^["'\s]+|["'\s]+$/g, "").trim();
    return `Second Sequence (10-20s): "${s2}"`;
  }

  const match = text.match(/(?:💬\s*Spoken Dialogue|Spoken Dialogue|Audio Dialogue|Script|Spoken Line|Urdu Dialogue|Urdu spoken dialogue|Punjabi Dialogue):\s*["']?([^\n\r]+)/i);
  if (match && match[1]) {
    const extracted = match[1].replace(/^["'\s]+|["'\s]+$/g, "").trim();
    if (extracted.length > 2) {
      return extracted;
    }
  }

  return "";
}

function getClip1Prompt(ideaText: string): string {
  const text = cleanPromptText(ideaText || "");
  const match = text.match(/🎥\s*CLIP 1 PROMPT[^\n]*\n([\s\S]*?)(?=🎥\s*CLIP 2 PROMPT|✂️|$)/i) ||
                text.match(/🎥\s*FIRST SEQUENCE[^\n]*\n([\s\S]*?)(?=🎥\s*SECOND SEQUENCE|Continuity:|$)/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return text;
}

function getClip2Prompt(ideaText: string): string {
  const text = cleanPromptText(ideaText || "");
  const match = text.match(/🎥\s*CLIP 2 PROMPT[^\n]*\n([\s\S]*?)(?=🎥\s*CLIP 3 PROMPT|✂️|Continuity:|$)/i) ||
                text.match(/🎥\s*SECOND SEQUENCE[^\n]*\n([\s\S]*?)(?=🎥\s*THIRD SEQUENCE|Continuity:|$)/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return text;
}

function getClip3Prompt(ideaText: string): string {
  const text = cleanPromptText(ideaText || "");
  const match = text.match(/🎥\s*CLIP 3 PROMPT[^\n]*\n([\s\S]*?)(?=✂️|Continuity:|$)/i) ||
                text.match(/🎥\s*THIRD SEQUENCE[^\n]*\n([\s\S]*?)(?=Continuity:|$)/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return text;
}

function extractScene1Clothing(text: string): string {
  if (!text) return "";
  const matches = text.match(/(?:wearing|outfit|clothing|costume|attire|dressed in)[^,.\n]+/gi) ||
                  text.match(/•\s*Character\s*\d+:[^\n]+/gi);
  if (matches && matches.length > 0) {
    return matches.join(" | ").trim();
  }
  return "";
}

function getIdeaDescription(idea: SavedIdea): string {
  if (idea.socialContent?.description && idea.socialContent.description.trim()) {
    return idea.socialContent.description.trim();
  }
  const cleanedText = cleanPromptText(idea.text || "");
  return `Watch this viral ${CATEGORIES[idea.category]?.name || idea.category} 3D video concept! ${cleanedText.slice(0, 160)}...`;
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

// LIVE STAGE METAMORPHOSIS OPTION GROUPS
const AUDIENCE_PERSPECTIVE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Smartphone POV (Front Row & Crowd)",
    options: [
      { value: "Front row smartphone POV", label: "📱 Front Row Smartphone POV", desc: "Close-up front-row angle with phone recording screen in camera view." },
      { value: "Over-the-shoulder phone POV", label: "🤳 Over-the-Shoulder Phone POV", desc: "Over-the-shoulder crowd shot capturing the phone screen and stage action." },
      { value: "Close-up low angle crowd POV", label: "📱 Low Angle Crowd POV", desc: "Dynamic low angle looking up from the audience pit toward the stage." },
      { value: "Center floor audience POV", label: "📱 Center Floor Audience POV", desc: "Direct center stage view from standing floor crowd." },
    ],
  },
  {
    category: "Theater Balcony & Elevated Views",
    options: [
      { value: "Theater balcony view", label: "🎭 Theater Balcony View", desc: "Slightly elevated view overlooking the grand stage and crowd below." },
      { value: "VIP box seat perspective", label: "🎟️ VIP Box Seat Perspective", desc: "Side-angle elevated view with elegant venue architecture framing the stage." },
      { value: "Mid-arena crowd perspective", label: "🏟️ Mid-Arena Crowd Perspective", desc: "Balanced arena view capturing wide audience silhouettes and stage lights." },
      { value: "Far back arena wide POV", label: "✨ Wide Arena Panoramic POV", desc: "Epic panoramic perspective showing the entire arena, crowd, and stage." },
    ],
  },
];

const STAGE_ENVIRONMENT_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Circus & Illusionist Stages",
    options: [
      { value: "Circus arena ring", label: "🎪 Circus Arena Ring", desc: "Illuminated wooden circular arena ring with sawdust and spotlight beams." },
      { value: "Grand theater platform", label: "🎭 Grand Theater Platform", desc: "Ornate velvet-draped theater stage with polished hardwood flooring." },
      { value: "Illusionist stage", label: "🔮 Illusionist Stage", desc: "Mysterious dark illusionist platform with reflective black mirror floor." },
      { value: "Opera house main stage", label: "🏛️ Opera House Main Stage", desc: "Classic opera house stage with golden archways and grand chandeliers." },
    ],
  },
  {
    category: "Modern & Concert Event Stages",
    options: [
      { value: "Concert festival stage", label: "🎸 Concert Festival Stage", desc: "High-energy festival stage with massive LED video walls and trussing." },
      { value: "Neon stadium stage", label: "⚡ Neon Stadium Stage", desc: "Futuristic stadium stage lined with vibrant neon light bars." },
      { value: "Dark cyberpunk arena", label: "🏙️ Dark Cyberpunk Arena", desc: "Industrial cyberpunk stage with glowing neon grids and volumetric haze." },
      { value: "Gothic cathedral stage", label: "🕯️ Gothic Cathedral Stage", desc: "Eerie stone altar stage with tall stained-glass windows and candlelight." },
    ],
  },
];

const INITIAL_PERFORMER_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Classic Illusionists & Magicians",
    options: [
      { value: "Ringmaster in red coat", label: "🎪 Ringmaster in Red Coat & Top Hat", desc: "Charismatic circus ringmaster in embroidered red tailcoat." },
      { value: "Magician in black suit", label: "🎩 Magician in Black Suit", desc: "Sleek stage magician in custom black tuxedo and gloves." },
      { value: "Mysterious hooded illusionist", label: "🧙 Mysterious Hooded Illusionist", desc: "Enigmatic performer wrapped in a dark hooded robe." },
      { value: "Masked stage conjurer", label: "🎭 Masked Stage Conjurer", desc: "Intriguing masked performer in ornate Venetian costume." },
    ],
  },
  {
    category: "Modern & Fantasy Performers",
    options: [
      { value: "Cyberpunk stage performer", label: "⚡ Cyberpunk Stage Performer", desc: "Futuristic performer in chrome suit with LED accents." },
      { value: "Female acrobat in gold silk", label: "💃 Female Acrobat in Gold Silk", desc: "Graceful performer in shimmering gold sequin aerial silk costume." },
      { value: "Gothic sorcerer in velvet cape", label: "🖤 Gothic Sorcerer in Velvet Cape", desc: "Dramatic gothic performer in heavy dark velvet cape." },
      { value: "Street illusionist in leather jacket", label: "🧥 Street Illusionist in Leather Jacket", desc: "Edgy modern magician in dark leather jacket and boots." },
    ],
  },
];

const TRIGGER_ACTION_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Cape & Fabric Triggers",
    options: [
      { value: "Tossing a red cape upward", label: "🧥 Tossing Red Cape Upward", desc: "Hurling a large red cape into the air to envelop the transformation." },
      { value: "Spinning in dense fog", label: "🌫️ Spinning in Dense Fog", desc: "Rapidly spinning as heavy white stage fog swirls around the performer." },
      { value: "Swirling a heavy black cloak", label: "🖤 Swirling Heavy Black Cloak", desc: "Encircling the body in a dramatic cloak whip before the morph." },
      { value: "Dropping a silk veil to the floor", label: "✨ Dropping Silk Veil", desc: "Releasing a shimmering veil that falls over the performer as they change." },
    ],
  },
  {
    category: "FX & Physical Triggers",
    options: [
      { value: "Slapping hands together with sparks", label: "💥 Slapping Hands with Sparks", desc: "Clapping hands to unleash an explosion of bright golden sparks." },
      { value: "Snapping fingers as lasers flash", label: "⚡ Snapping Fingers with Lasers", desc: "Snapping fingers as intense laser beams pulse across the stage." },
      { value: "Vanishing into a burst of gold dust", label: "✨ Gold Dust Burst", desc: "Exploding into a cloud of glittering gold particles during the transformation." },
      { value: "Leaping into the air mid-stage", label: "🦘 Leaping into the Air", desc: "Jumping high into the spotlight beam and morphing before landing." },
    ],
  },
];

const TARGET_ENTITY_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Majestic Apex Predators",
    options: [
      { value: "Majestic male lion", label: "🦁 Majestic Male Lion", desc: "Powerful male lion with thick golden mane and fierce stance." },
      { value: "Cybernetic panther", label: "🐆 Cybernetic Panther", desc: "Sleek black panther with glowing blue neon cybernetic circuitry." },
      { value: "Massive Bengal tiger", label: "🐅 Massive Bengal Tiger", desc: "Hyper-realistic giant Bengal tiger with striking orange-black stripes." },
      { value: "Giant silverback gorilla", label: "🦍 Giant Silverback Gorilla", desc: "Colossal silverback gorilla thumping its chest in the spotlight." },
      { value: "Black panther with piercing eyes", label: "🖤 Black Panther", desc: "Stealthy, muscular black panther with luminous yellow eyes." },
    ],
  },
  {
    category: "Mythical & Elemental Creatures",
    options: [
      { value: "Fiery phoenix", label: "🔥 Fiery Phoenix", desc: "Breathtaking phoenix bird made of roaring flames and embers." },
      { value: "Golden celestial dragon", label: "🐉 Golden Celestial Dragon", desc: "Majestic Asian dragon with glowing golden scales and whiskers." },
      { value: "Eerie shadow wolf with red eyes", label: "🐺 Shadow Wolf", desc: "Imposing shadow wolf with glowing crimson eyes and smoke fur." },
      { value: "Crystalline frost tiger", label: "❄️ Crystalline Frost Tiger", desc: "Radiant tiger crafted from translucent ice crystals and blue light." },
    ],
  },
];

const LIGHTING_FX_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Spotlights & Lasers",
    options: [
      { value: "Bright overhead spotlights", label: "💡 Bright Overhead Spotlights", desc: "Intense white spotlight beams cutting through stage haze." },
      { value: "Flashing lasers & stage smoke", label: "⚡ Flashing Lasers & Stage Smoke", desc: "Pulsing laser arrays and thick rolling stage fog." },
      { value: "Dramatic backlit rim lighting", label: "✨ Backlit Rim Lighting", desc: "High-contrast silhouette lighting creating a dramatic edge glow." },
      { value: "Strobe flashes & neon sparks", label: "⚡ Strobe Flashes & Neon Sparks", desc: "Rapid strobe pulses and bursting electrical sparks." },
    ],
  },
  {
    category: "Magical & Atmospheric FX",
    options: [
      { value: "Golden particle aura & low fog", label: "✨ Golden Particle Aura & Low Fog", desc: "Floating gold embers and heavy floor-hugging dry ice fog." },
      { value: "Eerie purple volumetric smoke", label: "🟣 Eerie Purple Volumetric Smoke", desc: "Deep purple haze illuminated by blue beam lights." },
      { value: "Blinding white light burst", label: "💥 Blinding White Light Burst", desc: "Flash-bang white burst illuminating the exact morph moment." },
    ],
  },
];

const METAMORPHOSIS_AGE_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "Performer Age Ranges",
    options: [
      { value: "Young Adult (18-25 yrs)", label: "👤 Young Adult (18-25 yrs)", desc: "Dynamic young stage performer or modern illusionist." },
      { value: "Adult Illusionist (26-40 yrs)", label: "🎩 Adult Illusionist (26-40 yrs)", desc: "Experienced stage magician or ringmaster in their prime." },
      { value: "Master Stage Performer (40-55 yrs)", label: "🌟 Master Stage Performer (40-55 yrs)", desc: "Distinguished master illusionist with commanding presence." },
      { value: "Veteran Legend (55+ yrs)", label: "🔮 Veteran Illusionist Legend (55+ yrs)", desc: "Iconic veteran magician with classic dramatic wisdom." },
    ],
  },
];

const METAMORPHOSIS_LOCATION_GROUPS: OptionGroupWithDesc[] = [
  {
    category: "World Stage & Illusion Venues",
    options: [
      { value: "Circus Arena Ring", label: "🎪 Circus Arena Ring", desc: "Illuminated wooden circular arena ring under a grand big top." },
      { value: "Las Vegas Grand Illusion Theater", label: "🎰 Las Vegas Grand Theater", desc: "World-famous Las Vegas resort illusion stage with laser rigging." },
      { value: "Royal London Opera House", label: "🏛️ Royal London Opera House", desc: "Historic Victorian theater stage with gold decor and red velvet curtains." },
      { value: "Tokyo Cyberpunk Neon Arena", label: "🏙️ Tokyo Cyberpunk Neon Arena", desc: "Futuristic Tokyo stadium stage lined with glowing neon lighting." },
      { value: "Parisian Magic Cabaret Club", label: "🍷 Parisian Magic Cabaret", desc: "Intimate Parisian underground speakeasy magic club." },
      { value: "Outdoor Music Festival Stage", label: "🎸 Outdoor Festival Stage", desc: "Massive open-air festival stage with laser towers and crowd screens." },
    ],
  },
];

const STAGE_METAMORPHOSIS_PRESETS = [
  {
    name: "🎪 Circus Ringmaster -> Majestic Male Lion",
    performerAge: "Adult Illusionist (26-40 yrs)",
    stageLocation: "Circus Arena Ring",
    audiencePerspective: "Front row smartphone POV",
    stageEnvironment: "Circus arena ring",
    initialPerformer: "Ringmaster in red coat",
    triggerAction: "Tossing a red cape upward",
    targetEntity: "Majestic male lion",
    lightingFx: "Bright overhead spotlights",
  },
  {
    name: "⚡ Magician -> Cybernetic Panther",
    performerAge: "Young Adult (18-25 yrs)",
    stageLocation: "Tokyo Cyberpunk Neon Arena",
    audiencePerspective: "Over-the-shoulder phone POV",
    stageEnvironment: "Neon stadium stage",
    initialPerformer: "Magician in black suit",
    triggerAction: "Snapping fingers as lasers flash",
    targetEntity: "Cybernetic panther",
    lightingFx: "Flashing lasers & stage smoke",
  },
  {
    name: "🔥 Gothic Illusionist -> Fiery Phoenix",
    performerAge: "Master Stage Performer (40-55 yrs)",
    stageLocation: "Royal London Opera House",
    audiencePerspective: "Theater balcony view",
    stageEnvironment: "Illusionist stage",
    initialPerformer: "Gothic sorcerer in velvet cape",
    triggerAction: "Vanishing into a burst of gold dust",
    targetEntity: "Fiery phoenix",
    lightingFx: "Golden particle aura & low fog",
  },
  {
    name: "🐉 Sorcerer -> Golden Celestial Dragon",
    performerAge: "Veteran Legend (55+ yrs)",
    stageLocation: "Las Vegas Grand Illusion Theater",
    audiencePerspective: "Center floor audience POV",
    stageEnvironment: "Grand theater platform",
    initialPerformer: "Mysterious hooded illusionist",
    triggerAction: "Spinning in dense fog",
    targetEntity: "Golden celestial dragon",
    lightingFx: "Dramatic backlit rim lighting",
  },
  {
    name: "🐺 Acrobat -> Shadow Wolf",
    performerAge: "Young Adult (18-25 yrs)",
    stageLocation: "Parisian Magic Cabaret Club",
    audiencePerspective: "Close-up low angle crowd POV",
    stageEnvironment: "Dark cyberpunk arena",
    initialPerformer: "Female acrobat in gold silk",
    triggerAction: "Dropping a silk veil to the floor",
    targetEntity: "Eerie shadow wolf with red eyes",
    lightingFx: "Eerie purple volumetric smoke",
  },
];

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
  keepOpenOnSelect?: boolean;
  isLight?: boolean;
}

function CustomSelect({ label, icon, value, onChange, groups, keepOpenOnSelect = true, isLight = false }: CustomSelectProps) {
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
      <label className={`text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-between ${
        isLight ? "text-slate-900 font-black" : "text-slate-200 font-extrabold"
      }`}>
        <span className="flex items-center gap-1.5">
          {icon && <span>{icon}</span>}
          <span>{label}</span>
        </span>
      </label>

      {/* Main Touch-Friendly Field Trigger Card */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left transition-all shadow-md touch-manipulation active:scale-[0.98] group flex flex-col justify-between gap-1 min-h-[58px] ${
          isLight
            ? "bg-white border-slate-300 hover:border-indigo-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 shadow-sm"
            : "bg-slate-900/90 border-indigo-500/30 hover:border-indigo-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 text-white"
        }`}
      >
        <div className="flex items-center justify-between gap-2 w-full">
          <span className={`text-xs sm:text-sm truncate transition-colors ${
            isLight ? "font-extrabold text-slate-900 group-hover:text-indigo-700" : "font-bold text-white group-hover:text-indigo-300"
          }`}>
            {selectedLabel}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isLight ? "bg-indigo-50 border-indigo-200 text-indigo-800" : "bg-indigo-950/80 border-indigo-500/30 text-indigo-300"
            }`}>
              Change
            </span>
            <ChevronDown className="w-4 h-4 text-indigo-500 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </div>
        {selectedDesc && (
          <p className={`text-[11px] truncate w-full ${isLight ? "text-slate-600 font-semibold" : "text-slate-400 font-normal"}`}>
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
            className={`w-full sm:max-w-2xl sm:mx-auto h-[90vh] sm:h-[85vh] max-h-[90vh] rounded-t-3xl sm:rounded-3xl border shadow-2xl flex flex-col overflow-hidden relative font-sans ${
              isLight ? "bg-white border-zinc-300 text-zinc-900" : "bg-zinc-900 border-zinc-700 text-zinc-100"
            }`}
          >
            {/* Header */}
            <div className={`p-4 sm:p-5 border-b sticky top-0 z-30 space-y-3 ${
              isLight ? "bg-zinc-100 border-zinc-200 text-zinc-900" : "bg-zinc-950 border-zinc-800 text-white"
            }`}>
              {/* Mobile handle */}
              <div className={`w-12 h-1.5 rounded-full mx-auto sm:hidden -mt-1 mb-1 ${
                isLight ? "bg-zinc-400" : "bg-zinc-700"
              }`} />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">{icon || "✨"}</span>
                  <div>
                    <h3 className={`text-base sm:text-lg font-extrabold leading-tight ${isLight ? "text-zinc-950" : "text-white"}`}>
                      Select {label}
                    </h3>
                    <p className={`text-[11px] sm:text-xs font-semibold ${isLight ? "text-zinc-600" : "text-indigo-300/80"}`}>
                      Current: <span className={`font-black ${isLight ? "text-zinc-950" : "text-white"}`}>{selectedLabel}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`p-2 sm:p-2.5 rounded-full transition-colors cursor-pointer active:scale-95 shrink-0 ${
                    isLight
                      ? "bg-zinc-200 hover:bg-zinc-300 text-zinc-800"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                  }`}
                  title="Close option selector"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-indigo-500 absolute left-3.5 pointer-events-none" />
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
                  className={`w-full pl-10 pr-9 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all focus:outline-none ${
                    isLight
                      ? "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                      : "bg-zinc-950 border-zinc-700 text-white placeholder-zinc-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 p-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-white font-bold cursor-pointer"
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
                        : isLight
                        ? "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-300"
                        : "bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700"
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
                          : isLight
                          ? "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-300"
                          : "bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700"
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
                filteredGroups.map((group) => (
                  <div key={group.category} className="space-y-2.5">
                    <div className={`px-3 py-2 text-xs font-extrabold uppercase tracking-wider border-b sticky top-0 backdrop-blur-md z-10 flex items-center justify-between ${
                      isLight ? "bg-zinc-100/95 border-zinc-200 text-zinc-900" : "bg-zinc-900/95 border-zinc-800 text-indigo-400"
                    }`}>
                      <span>{group.category}</span>
                      <span className={`text-[10px] font-semibold ${isLight ? "text-zinc-600" : "text-indigo-300/70"}`}>
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
                            }}
                            className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between cursor-pointer select-none touch-manipulation active:scale-[0.98] ${
                              isSelected
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 border-2 border-indigo-500 text-white shadow-xl ring-2 ring-indigo-400"
                                : isLight
                                ? "bg-white border-2 border-zinc-200 hover:border-indigo-500 hover:bg-indigo-50/60 text-zinc-950 shadow-sm font-extrabold"
                                : "bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800 text-zinc-200"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className={`text-xs sm:text-sm leading-tight ${
                                isSelected ? "font-black text-white" : isLight ? "font-black text-zinc-950" : "font-extrabold text-white"
                              }`}>
                                {opt.label}
                              </span>
                              {isSelected && (
                                <div className="w-6 h-6 rounded-full bg-white text-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                            {opt.desc && (
                              <p className={`text-[11px] sm:text-xs leading-relaxed mt-1.5 ${
                                isSelected ? "text-indigo-100 font-medium" : isLight ? "text-zinc-700 font-semibold" : "text-indigo-200/80 font-normal"
                              }`}>
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

            {/* Sticky Save & Close Footer Bar */}
            <div className={`p-3.5 sm:p-4 border-t flex items-center justify-between gap-3 sticky bottom-0 z-30 shadow-2xl shrink-0 ${
              isLight ? "bg-zinc-100 border-zinc-200 text-zinc-900" : "bg-zinc-950 border-zinc-800 text-white"
            }`}>
              <div className="flex flex-col truncate">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isLight ? "text-zinc-600" : "text-indigo-300/70"}`}>Selected Choice</span>
                <span className={`text-xs sm:text-sm font-extrabold truncate ${isLight ? "text-zinc-900" : "text-white"}`}>{selectedLabel}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white text-xs font-black tracking-wide shadow-lg shadow-indigo-500/30 transition-all cursor-pointer active:scale-95 shrink-0 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Save Selection & Close ✓</span>
              </button>
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
  kidsAudioStyle?: string;
  kidsLocation?: string;
  kidsHealth?: string;
  kidsVibe?: string;
  kidsClothing?: string;
  kidsExpression?: string;
  kidsFood?: string;
  kidsProp?: string;
  timeOfDay?: string;
  storyBeat?: string;
  cameraShot?: string;
  charPerformance?: string;
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
  customSceneDescription?: string;
  outroEffects?: string;
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

// ─── Visual Style Custom Dropdown ───────────────────────────────────────────
function VisualStyleDropdown({
  value,
  onChange,
  isLight = false,
}: {
  value: string;
  onChange: (v: string) => void;
  isLight?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = VISUAL_STYLES.find((s) => s.value === value) ?? VISUAL_STYLES[0];

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl border focus:outline-none transition-all cursor-pointer group shadow-xs ${
          isLight
            ? "bg-white border-slate-300 hover:border-indigo-400 text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
            : "bg-black/60 border-slate-800 hover:border-indigo-500/60 text-white focus:ring-2 focus:ring-indigo-500/20"
        }`}
      >
        <span className="flex flex-col items-start text-left min-w-0">
          <span className={`text-xs sm:text-sm font-black truncate ${
            isLight ? "text-slate-900" : "text-white"
          }`}>
            {selected.label}
          </span>
          <span className={`text-[11px] truncate max-w-[260px] ${
            isLight ? "text-slate-600 font-medium" : "text-slate-400"
          }`}>
            {selected.desc}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            open
              ? "rotate-180 text-indigo-500"
              : isLight
              ? "text-slate-400 group-hover:text-slate-700"
              : "text-slate-400 group-hover:text-slate-300"
          }`}
        />
      </button>

      {/* Dropdown list */}
      {open && (
        <div className={`absolute z-50 mt-2 w-full max-h-72 overflow-y-auto rounded-xl border shadow-2xl scrollbar-thin ${
          isLight
            ? "bg-white border-slate-200 text-slate-900 shadow-slate-400/20"
            : "bg-[#0c0f1a] border-slate-700 text-white shadow-black/60"
        }`}>
          {VISUAL_STYLES.map((style) => {
            const isActive = style.value === value;
            return (
              <button
                key={style.value}
                type="button"
                onClick={() => {
                  onChange(style.value);
                  setOpen(false);
                }}
                className={`w-full flex items-start justify-between gap-2 px-4 py-3 text-left transition-colors ${
                  isLight
                    ? isActive
                      ? "bg-indigo-50 border-l-4 border-indigo-600"
                      : "hover:bg-slate-100 border-l-4 border-transparent"
                    : isActive
                    ? "bg-indigo-950/60 border-l-4 border-indigo-500"
                    : "hover:bg-indigo-950/50 border-l-4 border-transparent"
                }`}
              >
                <span className="flex flex-col min-w-0">
                  <span
                    className={`text-xs sm:text-sm font-black truncate ${
                      isLight
                        ? isActive
                          ? "text-indigo-950"
                          : "text-slate-900"
                        : isActive
                        ? "text-indigo-300"
                        : "text-white"
                    }`}
                  >
                    {style.label}
                  </span>
                  <span className={`text-[11px] leading-snug mt-0.5 line-clamp-2 ${
                    isLight ? "text-slate-600 font-semibold" : "text-slate-400"
                  }`}>
                    {style.desc}
                  </span>
                </span>
                {style.tag && (
                  <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full border whitespace-nowrap mt-0.5 ${
                    style.tag.includes("NEW")
                      ? "bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white border-amber-300/60 shadow-md shadow-rose-500/20 font-black animate-pulse"
                      : isLight
                      ? "bg-indigo-100 text-indigo-900 border-indigo-300"
                      : "bg-indigo-500/15 text-indigo-300 border-indigo-500/25"
                  }`}>
                    {style.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

export default function IdeasPage() {
  const { showToast } = useToast();
  const { currentUser, isLoggedIn, setIsAuthModalOpen } = useUser();

  const savedIdeasSectionRef = useRef<HTMLDivElement>(null);
  const customIdeaOptimizerRef = useRef<HTMLDivElement>(null);
  const categoryControlsRef = useRef<HTMLDivElement>(null);
  const generatorParametersRef = useRef<HTMLDivElement>(null);
  const dialogueSectionRef = useRef<HTMLDivElement>(null);
  const generateButtonRef = useRef<HTMLDivElement>(null);
  const presetsSectionRef = useRef<HTMLDivElement>(null);
  const ucpSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (targetRef: React.RefObject<HTMLDivElement | null>) => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToPresets = () => {
    setIsPresetsExpanded(true);
    if (presetsSectionRef.current) {
      presetsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (generatorParametersRef.current) {
      generatorParametersRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToUcp = () => {
    if (ucpSectionRef.current) {
      ucpSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
  const [visualStyle, setVisualStyle] = useState(
    initialSettings.visualStyle || ((initialSettings.category as string) === "SONG" ? "Hyper-Realistic CGI" : "3D Cartoon Style")
  );
  const [videoDuration, setVideoDuration] = useState<number>(initialSettings.videoDuration || 10);
  const [customDialogue, setCustomDialogue] = useState(initialSettings.customDialogue || "");
  const [customDialogueSeq1, setCustomDialogueSeq1] = useState("");
  const [customDialogueSeq2, setCustomDialogueSeq2] = useState("");
  const [customDialogueSeq3, setCustomDialogueSeq3] = useState("");
  const [isDialogueExpanded, setIsDialogueExpanded] = useState(false);
  const [isPresetsExpanded, setIsPresetsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [dialogueDir, setDialogueDir] = useState<"ltr" | "rtl">("rtl");
  const [showUrduKeyboard, setShowUrduKeyboard] = useState(false);
  const dialogueTextareaRef = useRef<HTMLTextAreaElement>(null);
  const voiceRecognitionRef = useRef<any>(null);
  const [aiModel, setAiModel] = useState<string>(
    initialSettings.aiModel && ["claude-sonnet-4-6", "claude-sonnet-4-5-20250929", "claude-haiku-4-5-20251001", "claude-opus-4-6"].includes(initialSettings.aiModel)
      ? initialSettings.aiModel
      : "claude-sonnet-4-6"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggestingDialogue, setIsSuggestingDialogue] = useState(false);
  const [loadingSceneStepId, setLoadingSceneStepId] = useState<string | null>(null);
  const [includeCharacterBible, setIncludeCharacterBible] = useState<boolean>(true);
  const [compactMode, setCompactMode] = useState<boolean>(true);
  const [fatherClothing, setFatherClothing] = useState<string>("AI Decides");
  const [customFatherClothing, setCustomFatherClothing] = useState<string>("");
  const [motherClothing, setMotherClothing] = useState<string>("AI Decides");
  const [customMotherClothing, setCustomMotherClothing] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [paramSearchQuery, setParamSearchQuery] = useState<string>("");
  const { theme, isLight, toggleTheme } = useTheme();
  const [isOptimizeSectionOpen, setIsOptimizeSectionOpen] = useState(false);

  const matchesParamFilter = (terms: string[]) => {
    if (!paramSearchQuery.trim()) return true;
    const q = paramSearchQuery.trim().toLowerCase();
    return terms.some((t) => t.toLowerCase().includes(q));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hotkey: Ctrl+Enter or Cmd+Enter to generate concept
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !isGenerating) {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGenerating]);

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

  const getLatestIdea = (): SavedIdea | null => {
    if (savedIdeas.length === 0) return null;
    return [...savedIdeas].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  };

  const handleCopyTopPrompt = () => {
    const targetIdea = getLatestIdea();
    if (!targetIdea) {
      showToast("No generated prompt available yet. Click 'Generate Idea' first!", "info");
      return;
    }
    const textToCopy = cleanPromptText(targetIdea.text);
    copyToClipboard(textToCopy);
    setCopiedId(`floating-prompt-${targetIdea.id}`);
    setTimeout(() => setCopiedId(null), 2000);
    showToast("Copied Latest Mobile Prompt (9:16) to clipboard!", "success");
  };

  const handleCopyTopScript = () => {
    const targetIdea = getLatestIdea();
    if (!targetIdea) {
      showToast("No generated script available yet. Click 'Generate Idea' first!", "info");
      return;
    }
    const scriptToCopy = getIdeaDialogue(targetIdea) || cleanPromptText(targetIdea.customDialogue || targetIdea.text);
    copyToClipboard(scriptToCopy);
    setCopiedId(`floating-script-${targetIdea.id}`);
    setTimeout(() => setCopiedId(null), 2000);
    showToast("Copied Latest Spoken Script to clipboard!", "success");
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const insertDialogueLabel = (label: string) => {
    const textarea = dialogueTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const text = customDialogue;
      const needsNewLine = start > 0 && text[start - 1] !== "\n";
      const insertion = (needsNewLine ? "\n" : "") + label + " ";
      const newText = text.substring(0, start) + insertion + text.substring(end);
      setCustomDialogue(newText);
      setTimeout(() => {
        textarea.focus();
        const newPos = start + insertion.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 50);
    } else {
      setCustomDialogue((prev) => (prev ? prev + "\n" + label + " " : label + " "));
    }
  };

  const insertUrduChar = (char: string) => {
    const textarea = dialogueTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const text = customDialogue;
      const newText = text.substring(0, start) + char + text.substring(end);
      setCustomDialogue(newText);
      setTimeout(() => {
        textarea.focus();
        const newPos = start + char.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 20);
    } else {
      setCustomDialogue((prev) => prev + char);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("🚫 Voice input needs Chrome browser (PC or Android).", "error");
      return;
    }

    if (isListening) {
      if (voiceRecognitionRef.current) {
        try {
          voiceRecognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setIsListening(false);
      showToast("⏹️ Voice recording stopped", "info");
      return;
    }

    const recognition = new SpeechRecognition();
    voiceRecognitionRef.current = recognition;

    recognition.lang =
      language === "Urdu" || language === "Roman Urdu" ? "ur-PK" :
      language === "Punjabi" ? "pa-PK" :
      language === "English" ? "en-US" : "ur-PK";

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    showToast("🎙️ Listening… speak now. Click Mic again to stop.", "info");

    let initialDialogue = customDialogue;
    if (initialDialogue && !initialDialogue.endsWith(" ") && !initialDialogue.endsWith("\n")) {
      initialDialogue += " ";
    }

    recognition.onresult = (event: any) => {
      let currentSessionText = "";
      for (let i = 0; i < event.results.length; i++) {
        currentSessionText += event.results[i][0].transcript;
      }
      setCustomDialogue(initialDialogue + currentSessionText);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      const friendlyErrors: Record<string, string> = {
        "no-speech":       "🔇 No speech detected — make sure your mic is on and speak clearly.",
        "audio-capture":   "🎤 Mic not found — check your microphone is connected and allowed.",
        "not-allowed":     "🚫 Mic access denied — click the 🔒 icon in the address bar and allow microphone.",
        "network":         "🌐 Network error — check your internet connection.",
        "aborted":         "⏹️ Recording stopped.",
        "service-not-allowed": "🚫 Speech service not allowed — try opening in Chrome.",
      };
      const msg = friendlyErrors[event.error] || `Voice error: ${event.error}`;
      if (event.error !== "aborted" && event.error !== "no-speech") showToast(msg, "error");
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
    }
  };

  const handleSuggestDialogue = async () => {
    if (category === "CARBOX") return;
    setIsSuggestingDialogue(true);
    try {
      const res = await fetch("/api/suggest-dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          category,
          language,
          customIdea,
          existingDialogue: customDialogue,
          kidsAge: (category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") ? kidsAge : undefined,
          kidsLocation: (category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") ? kidsLocation : undefined,
          kidsHealth: category === "CUTE_KIDS" ? kidsHealth : undefined,
          kidsClothing: (category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") ? kidsClothing : undefined,
          kidsVibe: (category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") ? kidsVibe : undefined,
          characterSetup: (category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") ? characterSetup : undefined,
          charactersPerScene: (category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") ? (charactersPerScene === "Custom" ? (customCharactersPerScene || "Custom") : charactersPerScene) : undefined,
          aiModel,
          seriousDialogueStyle,
          customSceneDescription,
          outroEffects,
          includeMic,
          performerAge: category === "LIVE_STAGE_METAMORPHOSIS" ? performerAge : undefined,
          stageLocation: category === "LIVE_STAGE_METAMORPHOSIS" ? stageLocation : undefined,
          songCrowdFx: ((category as string) === "SONG" || category === "POETRY") ? songCrowdFx : undefined,
          characterFaceType: characterFaceType !== "Any / AI Decides" ? characterFaceType : undefined,
          kidsExpression: category === "CUTE_KIDS" && kidsExpression !== "Any / AI Decides" ? kidsExpression : undefined,
          kidsFood: category === "CUTE_KIDS" && kidsFood !== "Any / AI Decides" ? kidsFood : undefined,
          kidsProp: category === "CUTE_KIDS" && kidsProp !== "Any / AI Decides" ? kidsProp : undefined,
          timeOfDay: timeOfDay !== "Any / AI Decides" ? timeOfDay : undefined,
          storyBeat: storyBeat !== "Any / AI Decides" ? storyBeat : undefined,
          cameraShot: cameraShot !== "Any / AI Decides" ? cameraShot : undefined,
          charPerformance: charPerformance !== "Any / AI Decides" ? charPerformance : undefined,
        }),
      });
      const data = await safeJsonResponse(res);
      if (data && data.success && data.dialogue) {
        setCustomDialogue(data.dialogue);
        showToast("Refined & corrected script!", "success");
      } else {
        throw new Error(data?.error || "Failed to suggest dialogue");
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to suggest dialogue", "error");
    } finally {
      setIsSuggestingDialogue(false);
    }
  };
  


  // Cute Kids specific options
  const [kidsAge, setKidsAge] = useState(initialSettings.kidsAge || "Any / AI Decides");
  const [kidsAudioStyle, setKidsAudioStyle] = useState(initialSettings.kidsAudioStyle || "Any / AI Decides");
  const [kidsLocation, setKidsLocation] = useState(initialSettings.kidsLocation || "Cozy Home Living Room");
  const [kidsHealth, setKidsHealth] = useState(initialSettings.kidsHealth || "Any / AI Decides");
  const [kidsVibe, setKidsVibe] = useState(initialSettings.kidsVibe || "Cheerful & Energetic");
  const [kidsClothing, setKidsClothing] = useState(initialSettings.kidsClothing || "Any / AI Decides");
  const [characterSetup, setCharacterSetup] = useState(initialSettings.characterSetup || "Any / AI Decides");
  const [charactersPerScene, setCharactersPerScene] = useState(initialSettings.charactersPerScene || "1 Character");
  const [customCharactersPerScene, setCustomCharactersPerScene] = useState(initialSettings.customCharactersPerScene || "");
  const [kidsNationality, setKidsNationality] = useState(initialSettings.kidsNationality || "Global / Any");
  const [musicType, setMusicType] = useState<string>(initialSettings.musicType || "AI Decides");
  const [seriousDialogueStyle, setSeriousDialogueStyle] = useState<string>(initialSettings.seriousDialogueStyle || "None");
  const [customSceneDescription, setCustomSceneDescription] = useState(initialSettings.customSceneDescription || "");
  const [selectedSituationCat, setSelectedSituationCat] = useState("TRAIN");

  const handleSuggestSituation = (catId?: string) => {
    const targetId = catId || selectedSituationCat;
    const foundCat = SITUATION_CATEGORIES.find((c) => c.id === targetId) || SITUATION_CATEGORIES[0];
    const randomSuggestion = foundCat.suggestions[Math.floor(Math.random() * foundCat.suggestions.length)];
    setCustomSceneDescription(randomSuggestion);
    showToast(`✨ Suggested situation: "${foundCat.label.split(" ")[1] || foundCat.label}"`, "success");
  };
  const [outroEffects, setOutroEffects] = useState<string>(initialSettings.outroEffects || "None");
  const [kidsExpression, setKidsExpression] = useState(initialSettings.kidsExpression || "Any / AI Decides");
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [referenceCharacterInfo, setReferenceCharacterInfo] = useState<string>("");
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [showCharacterLibrary, setShowCharacterLibrary] = useState(false);
  const [savedCharacters, setSavedCharacters] = useState<any[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [kidsFood, setKidsFood] = useState(initialSettings.kidsFood || "Any / AI Decides");
  const [kidsProp, setKidsProp] = useState(initialSettings.kidsProp || "Any / AI Decides");
  const [timeOfDay, setTimeOfDay] = useState(initialSettings.timeOfDay || "Any / AI Decides");
  const [storyBeat, setStoryBeat] = useState(initialSettings.storyBeat || "Any / AI Decides");
  const [cameraShot, setCameraShot] = useState(initialSettings.cameraShot || "Any / AI Decides");
  const [charPerformance, setCharPerformance] = useState(initialSettings.charPerformance || "Any / AI Decides");
  const [includeMic, setIncludeMic] = useState<boolean>(initialSettings.includeMic || false);
  const [songCrowdFx, setSongCrowdFx] = useState(initialSettings.songCrowdFx || "DISABLED (Quiet Studio - Default)");
  const [characterFaceType, setCharacterFaceType] = useState(initialSettings.characterFaceType || "Any / AI Decides");
  const [isShortIdea, setIsShortIdea] = useState<boolean>(initialSettings.isShortIdea || false);
  const [withoutDialogue, setWithoutDialogue] = useState<boolean>(initialSettings.withoutDialogue || false);
  const [withoutMusic, setWithoutMusic] = useState<boolean>(initialSettings.withoutMusic || false);

  // Live Stage Metamorphosis options
  const [performerAge, setPerformerAge] = useState(initialSettings.performerAge || "Adult Illusionist (26-40 yrs)");
  const [stageLocation, setStageLocation] = useState(initialSettings.stageLocation || "Circus Arena Ring");
  const [audiencePerspective, setAudiencePerspective] = useState(initialSettings.audiencePerspective || "Front row smartphone POV");
  const [stageEnvironment, setStageEnvironment] = useState(initialSettings.stageEnvironment || "Circus arena ring");
  const [initialPerformer, setInitialPerformer] = useState(initialSettings.initialPerformer || "Ringmaster in red coat");
  const [triggerAction, setTriggerAction] = useState(initialSettings.triggerAction || "Tossing a red cape upward");
  const [targetEntity, setTargetEntity] = useState(initialSettings.targetEntity || "Majestic male lion");
  const [lightingFx, setLightingFx] = useState(initialSettings.lightingFx || "Bright overhead spotlights");

  const applyStageMetamorphosisPreset = (preset: typeof STAGE_METAMORPHOSIS_PRESETS[0]) => {
    setPerformerAge(preset.performerAge);
    setStageLocation(preset.stageLocation);
    setAudiencePerspective(preset.audiencePerspective);
    setStageEnvironment(preset.stageEnvironment);
    setInitialPerformer(preset.initialPerformer);
    setTriggerAction(preset.triggerAction);
    setTargetEntity(preset.targetEntity);
    setLightingFx(preset.lightingFx);
    setIncludeCharacterBible(true);
    showToast(`Applied preset: ${preset.name}`, "success");
  };

  const CHARACTER_LOCATION_SMART_MAPPINGS: { pattern: RegExp; location: string; toastName: string }[] = [
    { pattern: /doctor|pediatrician/i, location: "Doctor Clinic & Children Hospital", toastName: "Doctor Clinic 🏥" },
    { pattern: /dentist/i, location: "Dentist Clinic & Tooth Care", toastName: "Dentist Clinic 🪥" },
    { pattern: /pharmacist/i, location: "Pharmacy & Medicine Shop", toastName: "Pharmacy 💊" },
    { pattern: /veterinarian|pet doctor|vet\b/i, location: "Veterinary Clinic & Pet Hospital", toastName: "Pet Hospital / Vet 🐾" },
    { pattern: /firefighter/i, location: "Fire Station & Red Fire Truck", toastName: "Fire Station 🚒" },
    { pattern: /police/i, location: "Police Station & Patrol Car", toastName: "Police Station 🚓" },
    { pattern: /postman|mail carrier/i, location: "Post Office & Mail Room", toastName: "Post Office 📮" },
    { pattern: /baker|chef/i, location: "Bakery & Pastry Shop", toastName: "Bakery 🥐" },
    { pattern: /pilot|flight captain|aviator/i, location: "Airport Terminal & Airplane", toastName: "Airport Terminal ✈️" },
    { pattern: /train driver|conductor/i, location: "Train Station Platform", toastName: "Train Station 🚉" },
    { pattern: /astronaut|spacesuit/i, location: "Futuristic Space Station & Moon Base", toastName: "Space Station 🚀" },
    { pattern: /dulha|dulhan|bride|groom|wedding|barat|walima|nikkah/i, location: "Traditional Heritage Haveli", toastName: "Heritage Haveli 🕌" },
    { pattern: /village hero|pind|folk singer/i, location: "Desi Village & Punjabi Pind", toastName: "Desi Pind 📍" },
    { pattern: /kite flying|rooftop/i, location: "House Rooftop Kite Flying (Kotha)", toastName: "House Rooftop 🪁" },
    { pattern: /shopkeeper/i, location: "Bustling Desi Bazaar & Street Market", toastName: "Bustling Bazaar 🛍️" },
    { pattern: /fairy wings|cloud/i, location: "Magical Cloud Kingdom", toastName: "Cloud Kingdom ✨" },
    { pattern: /soccer player|sports/i, location: "Sunny Playground", toastName: "Playground ⚽" },
    { pattern: /reading|library/i, location: "Cozy Library & Book Nook", toastName: "Library 📚" },
  ];

  const handleCharacterSetupChange = (newSetup: string) => {
    setCharacterSetup(newSetup);

    for (const mapping of CHARACTER_LOCATION_SMART_MAPPINGS) {
      if (mapping.pattern.test(newSetup)) {
        setKidsLocation(mapping.location);
        showToast(`📍 Auto-selected "${mapping.toastName}" location (you can change it anytime)`, "info");
        break;
      }
    }
  };

  const resetNonLocationSettingsToAIDefault = () => {
    setKidsAge("Any / AI Decides");
    setKidsHealth("AI Decides / Healthy");
    setKidsVibe("AI Decides / Balanced");
    setKidsClothing("AI Decides / Story Matching");
    setKidsNationality("AI Decides / Culturally Authentic");
    setCharacterFaceType("AI Decides / Naturally Proportioned");
    setMusicType("AI Decides / Scene Dynamic");
    setSeriousDialogueStyle("AI Decides / Emotional Match");
    setSongCrowdFx("DISABLED (Quiet Studio - Default)");
  };

  const applyCuteKidsPreset = (preset: any) => {
    if (preset.location) setKidsLocation(preset.location);
    if (preset.perScene) setCharactersPerScene(preset.perScene);
    if (preset.setup) setCharacterSetup(preset.setup);
    resetNonLocationSettingsToAIDefault();
    setIncludeCharacterBible(true);
    showToast(`✅ Applied "${preset.title}" preset (Location & Characters set, all else AI Default)!`, "success");
  };

  const applySongPreset = (preset: typeof SONG_PRESETS[0] & { clothing?: string; crowdFx?: string; faceType?: string }) => {
    if (preset.location) setKidsLocation(preset.location);
    if (preset.perScene) setCharactersPerScene(preset.perScene);
    if (preset.setup) setCharacterSetup(preset.setup);
    resetNonLocationSettingsToAIDefault();
    setIncludeCharacterBible(true);
    showToast(`✅ Applied "${preset.title}" Song preset (Location & Characters set, all else AI Default)!`, "success");
  };

  const applyPoetryPreset = (preset: typeof POETRY_PRESETS[0] & { clothing?: string; faceType?: string }) => {
    if (preset.location) setKidsLocation(preset.location);
    if (preset.perScene) setCharactersPerScene(preset.perScene);
    if (preset.setup) setCharacterSetup(preset.setup);
    resetNonLocationSettingsToAIDefault();
    setIncludeCharacterBible(true);
    showToast(`✅ Applied "${preset.title}" Poetry preset (Location & Characters set, all else AI Default)!`, "success");
  };

  const applyShortClipPreset = (preset: typeof SHORT_CLIP_PRESETS[0]) => {
    if (preset.location) setKidsLocation(preset.location);
    if (preset.perScene) setCharactersPerScene(preset.perScene);
    if (preset.setup) setCharacterSetup(preset.setup);
    resetNonLocationSettingsToAIDefault();
    setWithoutMusic(preset.withoutMusic !== undefined ? preset.withoutMusic : false);
    setWithoutDialogue(preset.withoutDialogue !== undefined ? preset.withoutDialogue : false);
    if (preset.isShortIdea !== undefined) setIsShortIdea(preset.isShortIdea);
    setIncludeCharacterBible(true);
    showToast(`✅ Applied "${preset.title}" Short Clip preset (Location & Characters set, all else AI Default)!`, "success");
  };

  const applyCommercialAdPreset = (preset: typeof COMMERCIAL_AD_PRESETS[0]) => {
    if (preset.location) setKidsLocation(preset.location);
    if (preset.perScene) setCharactersPerScene(preset.perScene);
    if (preset.setup) setCharacterSetup(preset.setup);
    resetNonLocationSettingsToAIDefault();
    if (preset.visualStyle) setVisualStyle(preset.visualStyle);
    if (preset.customSceneDescription) setCustomSceneDescription(preset.customSceneDescription);
    setWithoutMusic(false);
    setWithoutDialogue(false);
    setIncludeCharacterBible(true);
    showToast(`✅ Applied "${preset.title}" Brand Ad preset (Location & Characters set, all else AI Default)!`, "success");
  };

  const applyFruitDancingPreset = (preset: typeof FRUIT_DANCING_PRESETS[0]) => {
    setKidsAge("Toddler (2-4 yrs)");
    setKidsLocation(preset.location);
    setKidsVibe(preset.vibe);
    setKidsClothing(preset.fruitType);
    setCharacterSetup("One Cute 3D Baby/Toddler in Fruit Suit");
    setCharactersPerScene("1 Character");
    if (preset.musicType) setMusicType(preset.musicType);
    if (preset.visualStyle) setVisualStyle(preset.visualStyle);
    setWithoutDialogue(true);
    setWithoutMusic(false);
    setIncludeCharacterBible(true);
    showToast(`🍓 Applied "${preset.title}" Fruit Dancing preset!`, "success");
  };

  const applyAnimalDancingPreset = (preset: typeof ANIMAL_DANCING_PRESETS[0]) => {
    setKidsAge(preset.age);
    setKidsLocation(preset.location);
    setKidsVibe(preset.vibe);
    setKidsClothing(preset.costume);
    setCharacterSetup(preset.animalType);
    setCharactersPerScene("1 Character");
    if (preset.musicType) setMusicType(preset.musicType);
    if (preset.visualStyle) setVisualStyle(preset.visualStyle);
    setWithoutDialogue(true);
    setWithoutMusic(false);
    setIncludeCharacterBible(true);
    showToast(`🐱 Applied "${preset.title}" Animal Dancing preset!`, "success");
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
    setIsLoadingIdeas(true);
    const cacheKey = `flow-saved-ideas-cache_${currentUser.id}`;

    // 1. Instantly load cached ideas from localStorage if available
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedIdeas(parsed);
            setIsLoadingIdeas(false);
          }
        }
      } catch (e) {
        console.error("Failed to read saved ideas from cache", e);
      }
    }

    // 2. Fetch fresh ideas from DB scoped to currentUser.id
    fetch(`/api/ideas?userId=${encodeURIComponent(currentUser.id)}`, {
      headers: { "x-user-id": currentUser.id },
    })
      .then((res) => safeJsonResponse(res))
      .then((data) => {
        if (data && data.success && Array.isArray(data.ideas)) {
          setSavedIdeas(data.ideas);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(cacheKey, JSON.stringify(data.ideas));
            } catch (e) {
              console.error("Failed to update saved ideas cache", e);
            }
          }
        }
        setIsLoadingIdeas(false);
      })
      .catch((err) => {
        console.error("Failed to fetch ideas from API", err);
        setIsLoadingIdeas(false);
      });
  }, [currentUser.id]);

  // Sync savedIdeas to localStorage whenever savedIdeas state changes
  useEffect(() => {
    if (typeof window !== "undefined" && savedIdeas.length > 0) {
      try {
        localStorage.setItem(`flow-saved-ideas-cache_${currentUser.id}`, JSON.stringify(savedIdeas));
      } catch (e) {
        console.error("Failed to sync savedIdeas to localStorage", e);
      }
    }
  }, [savedIdeas, currentUser.id]);


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
        kidsClothing,
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
        customSceneDescription,
        outroEffects,
        kidsExpression,
        kidsFood,
        kidsProp,
        timeOfDay,
        storyBeat,
        cameraShot,
        isShortIdea,
        withoutDialogue,
        withoutMusic,
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
    kidsClothing,
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
    customSceneDescription,
    outroEffects,
    kidsExpression,
    kidsFood,
    kidsProp,
    timeOfDay,
    storyBeat,
    cameraShot,
    isShortIdea,
    withoutDialogue,
    withoutMusic,
  ]);

  const handleResetCategorySettings = (targetCat?: CategoryId) => {
    const catToReset = targetCat || category;

    // Set ALL parameter options to "Any / AI Decides" so AI chooses what is best by default
    setKidsAge("Any / AI Decides");
    setKidsLocation("Any / AI Decides");
    setKidsVibe("Any / AI Decides");
    setKidsClothing("Any / AI Decides");
    setCharacterSetup("Any / AI Decides");
    setCharactersPerScene("Any / AI Decides");
    setCustomCharactersPerScene("");
    setKidsNationality("Any / AI Decides");
    setKidsExpression("Any / AI Decides");
    setKidsFood("Any / AI Decides");
    setKidsProp("Any / AI Decides");
    setTimeOfDay("Any / AI Decides");
    setStoryBeat("Any / AI Decides");
    setCameraShot("Any / AI Decides");
    setCharPerformance("Any / AI Decides");
    setCharacterFaceType("Any / AI Decides");
    setSeriousDialogueStyle("Any / AI Decides");
    setMusicType("AI Decides");
    setSongCrowdFx("AI Decides");
    setCustomSceneDescription("");

    if (catToReset === "SHORT_CLIP") {
      setWithoutMusic(true);
      setWithoutDialogue(true);
    } else if (catToReset === "FRUIT_DANCING" || catToReset === "ANIMAL_DANCING") {
      setWithoutDialogue(true);
      setWithoutMusic(false);
    } else {
      setWithoutMusic(false);
      setWithoutDialogue(false);
    }

    if (catToReset === "LIVE_STAGE_METAMORPHOSIS") {
      setPerformerAge("Adult Illusionist (26-40 yrs)");
      setStageLocation("Circus Arena Ring");
      setAudiencePerspective("Front row smartphone POV");
      setStageEnvironment("Circus arena ring");
      setInitialPerformer("Ringmaster in red coat");
      setTriggerAction("Tossing a red cape upward");
      setTargetEntity("Majestic male lion");
      setLightingFx("Bright overhead spotlights");
    } else if (catToReset === "CARBOX") {
      setCarboxBrand("Premium BMW");
      setCarboxColor("Glossy Black");
      setCarboxPackaging("Elegant Retail Box");
      setCarboxBackground("Clean White Studio Tabletop");
    } else if (catToReset === "FRUIT_DANCING") {
      applyFruitDancingPreset(FRUIT_DANCING_PRESETS[0]);
    } else if (catToReset === "ANIMAL_DANCING") {
      applyAnimalDancingPreset(ANIMAL_DANCING_PRESETS[0]);
    }

    showToast(`Reset parameters to AI Default (AI will choose what is best)!`, "info");
  };

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
    setKidsClothing("Any / AI Decides");
    setCharacterSetup("Any / AI Decides");
    setCharactersPerScene("1 Character");
    setCustomCharactersPerScene("");
    setKidsNationality("Global / Any");
    setMusicType("AI Decides");
    setSeriousDialogueStyle("None");
    setCustomSceneDescription("");
    setOutroEffects("None");
    setKidsExpression("Any / AI Decides");
    setKidsFood("Any / AI Decides");
    setKidsProp("Any / AI Decides");
    setTimeOfDay("Any / AI Decides");
    setStoryBeat("Any / AI Decides");
    setCameraShot("Any / AI Decides");
    setCharPerformance("Any / AI Decides");
    setCarboxBrand("Premium BMW");
    setCarboxColor("Glossy Black");
    setCarboxPackaging("Elegant Retail Box");
    setCarboxBackground("Clean White Studio Tabletop");
    setSongCrowdFx("DISABLED (Quiet Studio - Default)");
    setPerformerAge("Adult Illusionist (26-40 yrs)");
    setStageLocation("Circus Arena Ring");
    setAudiencePerspective("Front row smartphone POV");
    setStageEnvironment("Circus arena ring");
    setInitialPerformer("Ringmaster in red coat");
    setTriggerAction("Tossing a red cape upward");
    setTargetEntity("Majestic male lion");
    setLightingFx("Bright overhead spotlights");
    setIsShortIdea(false);
    setWithoutDialogue(false);
    setWithoutMusic(false);
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
      const data = await safeJsonResponse(res);
      if (!res.ok || !data || !data.success) {
        throw new Error(data?.error || "Failed to optimize idea");
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

  const [isSavingOptimized, setIsSavingOptimized] = useState(false);
  const handleSaveOptimizedIdea = async () => {
    if (!optimizedData) return;
    setIsSavingOptimized(true);
    try {
      const fullText = `[TITLE: ${optimizedData.title}]\n\n` + optimizedData.scenes.map((s) => `SCENE ${s.sceneNumber}:\n${s.content}`).join("\n\n");
      const cleanId = Date.now().toString().slice(-4);
      const videoFileName = `${category.toLowerCase()}_opt_${cleanId}`;

      const ideaData = {
        text: fullText,
        category,
        language,
        visualStyle,
        videoFileName,
        userId: currentUser.id,
        aiModel: (optimizedData as any).modelUsed || aiModel || "claude-sonnet-4-6",
      };

      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser.id,
        },
        body: JSON.stringify(ideaData),
      });
      const data = await safeJsonResponse(res);
      if (data && data.success && data.idea) {
        setSavedIdeas((prev) => [data.idea, ...prev]);
        showToast("Optimized idea saved to your saved list!", "success");
      } else {
        throw new Error(data?.error || "Failed to save optimized idea");
      }
    } catch (e: any) {
      showToast(e.message || "Failed to save optimized idea", "error");
    } finally {
      setIsSavingOptimized(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsAnalyzingImage(true);
    for (const file of files) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.readAsDataURL(file);
      });
      setReferenceImages((prev) => [...prev, base64]);
      try {
        const res = await fetch("/api/analyze-character", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 })
        });
        const data = await safeJsonResponse(res);
        if (data && data.character?.description) {
          setReferenceCharacterInfo((prev) => prev ? prev + "\n\n" + data.character.description : data.character.description);
          showToast("Character reference analyzed and saved!", "success");
        } else {
          showToast(`Failed: ${data?.error || "Could not analyze image"}`, "error");
        }
      } catch (err: any) {
        console.error("Image upload fetch error:", err);
        showToast(`Error analyzing image: ${err.message || "Unknown error"}`, "error");
      }
    }
    setIsAnalyzingImage(false);
  };

  const fetchCharacterLibrary = async (force = false) => {
    if (!force && savedCharacters.length > 0) return; // instant re-open from cache
    setIsLoadingLibrary(true);
    try {
      const res = await fetch("/api/characters");
      const data = await safeJsonResponse(res);
      if (data && data.characters) setSavedCharacters(data.characters);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const handleSelectCharacterFromLibrary = async (char: any) => {
    try {
      const res = await fetch(`/api/characters/${char.id}`);
      const data = await safeJsonResponse(res);
      const fullImage = data?.character?.imageUrl || char.imageUrl;
      setReferenceImages((prev) => [...prev, fullImage]);
      setReferenceCharacterInfo((prev) => prev ? prev + "\n\n" + char.description : char.description);
      setShowCharacterLibrary(false);
      showToast("Character selected from library!", "success");
    } catch {
      setReferenceImages((prev) => [...prev, char.imageUrl]);
      setReferenceCharacterInfo((prev) => prev ? prev + "\n\n" + char.description : char.description);
      setShowCharacterLibrary(false);
      showToast("Character selected!", "success");
    }
  };

  const handleDeleteCharacterFromLibrary = async (e: React.MouseEvent, charId: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/characters/${charId}`, { method: "DELETE" });
      if (res.ok) {
        setSavedCharacters((prev) => prev.filter((c) => c.id !== charId));
        showToast("🗑️ Character deleted from library", "info");
      } else {
        showToast("Failed to delete character", "error");
      }
    } catch (err) {
      console.error("Delete character error", err);
      showToast("Error deleting character", "error");
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/suggest-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          category,
          language,
          visualStyle,
          videoDuration,
          includeCharacterBible,
          compactMode,
          kids20sStep: (videoDuration === 20 || videoDuration === 30) ? "SCENE_1_ONLY" : undefined,
          customDialogue: (videoDuration === 20 || videoDuration === 30)
            ? (customDialogueSeq1 || customDialogueSeq2 || customDialogueSeq3 ? `First Sequence (0-10s): "${customDialogueSeq1.trim()}"\nSecond Sequence (10-20s): "${customDialogueSeq2.trim()}"${videoDuration === 30 ? `\nThird Sequence (20-30s): "${customDialogueSeq3.trim()}"` : ""}` : customDialogue)
            : customDialogue,
          customDialogueSeq1: customDialogueSeq1 && customDialogueSeq1.trim() ? customDialogueSeq1.trim() : undefined,
          customDialogueSeq2: customDialogueSeq2 && customDialogueSeq2.trim() ? customDialogueSeq2.trim() : undefined,
          customDialogueSeq3: customDialogueSeq3 && customDialogueSeq3.trim() ? customDialogueSeq3.trim() : undefined,
          kidsAge: (category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") ? kidsAge : undefined,
          kidsAudioStyle: category === "CUTE_KIDS" && kidsAudioStyle !== "Any / AI Decides" ? kidsAudioStyle : undefined,
          kidsLocation: (category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") ? kidsLocation : undefined,
          kidsHealth: category === "CUTE_KIDS" ? kidsHealth : undefined,
          kidsClothing: (category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") ? kidsClothing : undefined,
          fatherClothing: fatherClothing === "Custom" ? (customFatherClothing || "Custom") : (fatherClothing !== "AI Decides" ? fatherClothing : undefined),
          motherClothing: motherClothing === "Custom" ? (customMotherClothing || "Custom") : (motherClothing !== "AI Decides" ? motherClothing : undefined),
          kidsVibe: (category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") ? kidsVibe : undefined,
          characterSetup: (category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") ? characterSetup : undefined,
          charactersPerScene: (category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") ? (charactersPerScene === "Custom" ? (customCharactersPerScene || "Custom") : charactersPerScene) : undefined,
          kidsNationality: (category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") ? kidsNationality : undefined,
          carboxBrand,
          carboxColor,
          carboxPackaging,
          carboxBackground,
          aiModel,
          musicType,
          seriousDialogueStyle: category === "CUTE_KIDS" ? undefined : seriousDialogueStyle,
          customSceneDescription,
          outroEffects,
          referenceCharacterInfo: referenceCharacterInfo || undefined,
          includeMic: category === "CUTE_KIDS" ? false : includeMic,
          audiencePerspective: category === "LIVE_STAGE_METAMORPHOSIS" ? audiencePerspective : undefined,
          stageEnvironment: category === "LIVE_STAGE_METAMORPHOSIS" ? stageEnvironment : undefined,
          initialPerformer: category === "LIVE_STAGE_METAMORPHOSIS" ? initialPerformer : undefined,
          triggerAction: category === "LIVE_STAGE_METAMORPHOSIS" ? triggerAction : undefined,
          targetEntity: category === "LIVE_STAGE_METAMORPHOSIS" ? targetEntity : undefined,
          lightingFx: category === "LIVE_STAGE_METAMORPHOSIS" ? lightingFx : undefined,
          performerAge: category === "LIVE_STAGE_METAMORPHOSIS" ? performerAge : undefined,
          stageLocation: category === "LIVE_STAGE_METAMORPHOSIS" ? stageLocation : undefined,
          songCrowdFx: ((category as string) === "SONG" || category === "POETRY") ? songCrowdFx : undefined,
          characterFaceType: characterFaceType !== "Any / AI Decides" ? characterFaceType : undefined,
          kidsExpression: category === "CUTE_KIDS" && kidsExpression !== "Any / AI Decides" ? kidsExpression : undefined,
          kidsFood: category === "CUTE_KIDS" && kidsFood !== "Any / AI Decides" ? kidsFood : undefined,
          kidsProp: category === "CUTE_KIDS" && kidsProp !== "Any / AI Decides" ? kidsProp : undefined,
          timeOfDay: timeOfDay !== "Any / AI Decides" ? timeOfDay : undefined,
          storyBeat: storyBeat !== "Any / AI Decides" ? storyBeat : undefined,
          cameraShot: cameraShot !== "Any / AI Decides" ? cameraShot : undefined,
          charPerformance: charPerformance !== "Any / AI Decides" ? charPerformance : undefined,
          isShortIdea,
          withoutDialogue,
          withoutMusic,
        }),
      });
      const data = await safeJsonResponse(res);
      if (!res.ok || !data || !data.success) {
        throw new Error(data?.reason || data?.error || "Failed to generate ideas");
      }
      
      const createdIdeasRaw = await Promise.all(data.ideas.map(async (text: string) => {
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
          userId: currentUser.id,
          aiModel: aiModel || "claude-sonnet-4-6",
          customDialogue: customDialogue && customDialogue.trim() ? customDialogue.trim() : undefined,
          musicType: musicType !== "None" ? musicType : undefined,
          seriousDialogueStyle: seriousDialogueStyle !== "None" ? seriousDialogueStyle : undefined,
          kidsClothing: category === "CUTE_KIDS" ? kidsClothing : undefined,
          kidsExpression: category === "CUTE_KIDS" && kidsExpression !== "Any / AI Decides" ? kidsExpression : undefined,
          kidsFood: category === "CUTE_KIDS" && kidsFood !== "Any / AI Decides" ? kidsFood : undefined,
          kidsProp: category === "CUTE_KIDS" && kidsProp !== "Any / AI Decides" ? kidsProp : undefined,
          timeOfDay: timeOfDay !== "Any / AI Decides" ? timeOfDay : undefined,
          storyBeat: storyBeat !== "Any / AI Decides" ? storyBeat : undefined,
          cameraShot: cameraShot !== "Any / AI Decides" ? cameraShot : undefined,
          customSceneDescription: customSceneDescription && customSceneDescription.trim() ? customSceneDescription.trim() : undefined,
          outroEffects: outroEffects !== "None" ? outroEffects : undefined,
          isShortIdea,
          withoutDialogue,
          withoutMusic,
          videoDuration,
        };
        
        try {
          const res = await fetch("/api/ideas", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": currentUser.id,
            },
            keepalive: true,
            body: JSON.stringify(ideaData),
          });
          const ideaRes = await safeJsonResponse(res);
          if (ideaRes && ideaRes.success && ideaRes.idea) {
            return ideaRes.idea;
          } else {
            console.error("API failed to save idea:", ideaRes?.error);
            showToast(`Idea saved locally (${ideaRes?.error || "DB error"})`, "info");
          }
        } catch (err) {
          console.error("Error saving generated idea to database:", err);
          showToast("Idea saved locally (network error)", "info");
        }
        return {
          id: tempId,
          text,
          category,
          language,
          visualStyle,
          videoFileName,
          aiModel: aiModel || "claude-sonnet-4-6",
          customDialogue: customDialogue && customDialogue.trim() ? customDialogue.trim() : undefined,
          musicType: musicType !== "None" ? musicType : undefined,
          seriousDialogueStyle: seriousDialogueStyle !== "None" ? seriousDialogueStyle : undefined,
          kidsClothing: category === "CUTE_KIDS" ? kidsClothing : undefined,
          videoDuration,
          createdAt: new Date().toISOString(),
          isFavorite: false,
        } as SavedIdea;
      }));
      
      const createdIdeas = createdIdeasRaw.filter(Boolean);
      setSavedIdeas((prev) => [...createdIdeas, ...prev]);
      setFilterCategory("ALL");
      setSearchQuery("");
      setCurrentPage(1);
      
      showToast(`Generated ${createdIdeas.length} idea!`, "success");
      setTimeout(() => {
        savedIdeasSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (e: any) {
      showToast(e.message || "Failed to generate ideas", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateScene2 = async (idea: SavedIdea) => {
    setLoadingSceneStepId(idea.id);
    try {
      const res = await fetch("/api/suggest-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: idea.category,
          language: idea.language,
          visualStyle: idea.visualStyle,
          videoDuration: idea.videoDuration === 30 ? 30 : 20,
          kids20sStep: "SCENE_2_ONLY",
          scene1Text: idea.text,
          scene1Clothing: extractScene1Clothing(idea.text),
          customDialogueSeq2: customDialogueSeq2 && customDialogueSeq2.trim() ? customDialogueSeq2.trim() : undefined,
          aiModel: idea.aiModel || aiModel || "claude-sonnet-4-6",
        }),
      });
      const data = await safeJsonResponse(res);
      if (!res.ok || !data || !data.success || !data.ideas?.[0]) {
        throw new Error(data?.reason || data?.error || "Failed to generate Scene 2");
      }

      const updatedText = data.ideas[0];

      setSavedIdeas((prev) =>
        prev.map((item) => (item.id === idea.id ? { ...item, text: updatedText } : item))
      );

      try {
        await fetch(`/api/ideas/${idea.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: updatedText }),
        });
      } catch (err) {
        console.error("Error updating idea with Scene 2 in DB:", err);
      }

      showToast("✨ Generated Scene 2! Both scenes ready for CapCut stitching.", "success");
    } catch (e: any) {
      showToast(e.message || "Failed to generate Scene 2", "error");
    } finally {
      setLoadingSceneStepId(null);
    }
  };

  const handleGenerateScene3 = async (idea: SavedIdea) => {
    setLoadingSceneStepId(idea.id);
    try {
      const res = await fetch("/api/suggest-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: idea.category,
          language: idea.language,
          visualStyle: idea.visualStyle,
          videoDuration: 30,
          kids20sStep: "SCENE_3_ONLY",
          scene1Text: idea.text, // Scene 1&2 Bible
          scene2Text: idea.text, // Scene 1&2 Bible is passed down
          scene1Clothing: extractScene1Clothing(idea.text),
          customDialogueSeq3: customDialogueSeq3 && customDialogueSeq3.trim() ? customDialogueSeq3.trim() : undefined,
          aiModel: idea.aiModel || aiModel || "claude-sonnet-4-6",
        }),
      });
      const data = await safeJsonResponse(res);
      if (!res.ok || !data || !data.success || !data.ideas?.[0]) {
        throw new Error(data?.reason || data?.error || "Failed to generate Scene 3");
      }

      const updatedText = data.ideas[0];

      setSavedIdeas((prev) =>
        prev.map((item) => (item.id === idea.id ? { ...item, text: updatedText } : item))
      );

      try {
        await fetch(`/api/ideas/${idea.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: updatedText }),
        });
      } catch (err) {
        console.error("Error updating idea with Scene 3 in DB:", err);
      }

      showToast("✨ Generated Scene 3! All 3 scenes ready for CapCut stitching.", "success");
    } catch (e: any) {
      showToast(e.message || "Failed to generate Scene 3", "error");
    } finally {
      setLoadingSceneStepId(null);
    }
  };

  const handleRegenerateScene1 = async (idea: SavedIdea) => {
    setLoadingSceneStepId(idea.id);
    try {
      const res = await fetch("/api/suggest-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: idea.category,
          language: idea.language,
          visualStyle: idea.visualStyle,
          videoDuration: idea.videoDuration === 30 ? 30 : 20,
          kids20sStep: "SCENE_1_ONLY",
          customDialogueSeq1: customDialogueSeq1 && customDialogueSeq1.trim() ? customDialogueSeq1.trim() : undefined,
          aiModel: idea.aiModel || aiModel || "claude-sonnet-4-6",
        }),
      });
      const data = await safeJsonResponse(res);
      if (!res.ok || !data || !data.success || !data.ideas?.[0]) {
        throw new Error(data?.reason || data?.error || "Failed to regenerate Scene 1");
      }

      const updatedText = data.ideas[0];

      setSavedIdeas((prev) =>
        prev.map((item) => (item.id === idea.id ? { ...item, text: updatedText } : item))
      );

      try {
        await fetch(`/api/ideas/${idea.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: updatedText }),
        });
      } catch (err) {
        console.error("Error updating idea with regenerated Scene 1 in DB:", err);
      }

      showToast("🔄 Regenerated First Scene! Review and click 'Generate Second Scene' when ready.", "success");
    } catch (e: any) {
      showToast(e.message || "Failed to regenerate Scene 1", "error");
    } finally {
      setLoadingSceneStepId(null);
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
      const data = await safeJsonResponse(res);
      if (!res.ok || !data || !data.success) {
        throw new Error(data?.error || "Failed to generate social content");
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

  const handleRemake = (idea: SavedIdea) => {
    setCategory(idea.category);
    if (idea.language) setLanguage(idea.language);
    if (idea.visualStyle) setVisualStyle(idea.visualStyle);
    if (idea.aiModel) setAiModel(idea.aiModel);
    
    setCustomDialogue(idea.customDialogue || "");
    setMusicType(idea.musicType || "None");
    setSeriousDialogueStyle(idea.seriousDialogueStyle || "None");
    setCustomSceneDescription(idea.customSceneDescription || "");
    setOutroEffects(idea.outroEffects || "None");
    setIsShortIdea(idea.isShortIdea || false);
    setWithoutDialogue(idea.withoutDialogue || false);
    setWithoutMusic(idea.withoutMusic || false);
    
    if (idea.kidsClothing) setKidsClothing(idea.kidsClothing);
    
    if (idea.kidsExpression) setKidsExpression(idea.kidsExpression);
    else setKidsExpression("Any / AI Decides");
    
    if (idea.kidsFood) setKidsFood(idea.kidsFood);
    else setKidsFood("Any / AI Decides");
    
    if (idea.kidsProp) setKidsProp(idea.kidsProp);
    else setKidsProp("Any / AI Decides");
    
    if (idea.timeOfDay) setTimeOfDay(idea.timeOfDay);
    else setTimeOfDay("Any / AI Decides");
    
    if (idea.storyBeat) setStoryBeat(idea.storyBeat);
    else setStoryBeat("Any / AI Decides");
    
    if (idea.cameraShot) setCameraShot(idea.cameraShot);
    else setCameraShot("Any / AI Decides");

    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast("Settings loaded! You can now remake this script.", "success");
  };

  const handleCategoryChange = (cat: CategoryId) => {
    const prevCat = category;
    setCategory(cat);

    if (cat !== prevCat) {
      setKidsAge("Any / AI Decides");
      setKidsLocation("Any / AI Decides");
      setKidsVibe("Any / AI Decides");
      setKidsClothing("Any / AI Decides");
      setCharacterSetup("Any / AI Decides");
      setCharactersPerScene("Any / AI Decides");
      setCustomCharactersPerScene("");
      setKidsNationality("Any / AI Decides");
      setKidsExpression("Any / AI Decides");
      setKidsFood("Any / AI Decides");
      setKidsProp("Any / AI Decides");
      setTimeOfDay("Any / AI Decides");
      setStoryBeat("Any / AI Decides");
      setCameraShot("Any / AI Decides");
      setCharPerformance("Any / AI Decides");
      setCharacterFaceType("Any / AI Decides");
      setSeriousDialogueStyle("Any / AI Decides");
      setMusicType("AI Decides");
      setKidsHealth("Healthy");

      if (cat === "CUTE_KIDS") {
        setVisualStyle("3D Cartoon Style");
      } else if (cat === "CHARACTER_BIBLE") {
        setVisualStyle("Photorealistic 8K Cinematic");
      } else if (cat === "SONG" || cat === "POETRY") {
        setVisualStyle("Hyper-Realistic CGI");
      } else if (cat === "COMMERCIAL_AD") {
        applyCommercialAdPreset(COMMERCIAL_AD_PRESETS[0]);
      } else if (cat === "SHORT_CLIP") {
        setWithoutMusic(true);
        setWithoutDialogue(true);
        setVisualStyle("Photorealistic 8K Cinematic");
      } else if (cat === "LIVE_STAGE_METAMORPHOSIS") {
        setPerformerAge("Adult Illusionist (26-40 yrs)");
        setStageLocation("Circus Arena Ring");
        setAudiencePerspective("Front row smartphone POV");
        setStageEnvironment("Circus arena ring");
        setInitialPerformer("Ringmaster in red coat");
        setTriggerAction("Tossing a red cape upward");
        setTargetEntity("Majestic male lion");
        setLightingFx("Bright overhead spotlights");
      } else if (cat === "CARBOX") {
        setLanguage("ASMR Unboxing Effects");
        setVisualStyle("Realistic");
      } else if (cat === "FRUIT_DANCING") {
        setVisualStyle("3D Pixar Animation");
        setWithoutDialogue(true);
        setWithoutMusic(false);
        applyFruitDancingPreset(FRUIT_DANCING_PRESETS[0]);
      } else if (cat === "ANIMAL_DANCING") {
        setVisualStyle("3D Pixar Animation");
        setWithoutDialogue(true);
        setWithoutMusic(false);
        applyAnimalDancingPreset(ANIMAL_DANCING_PRESETS[0]);
      }
    }

    if (cat === "PUNJABI_JOKE") setLanguage("Punjabi");
    else if (cat === "HINDI_JOKE") setLanguage("Hindi");
    else if (cat !== "CARBOX" && language === "ASMR Unboxing Effects") setLanguage("Urdu");
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

  const categoryEntries = Object.values(CATEGORIES).filter(cat => {
    if (cat.id === "SONG" || cat.id === "POETRY") {
      const name = currentUser?.name?.toLowerCase() || "";
      return name === "hassan" || name === "adi";
    }
    return true;
  });

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${
        isLight ? "bg-zinc-100 text-zinc-900" : "bg-zinc-950 text-zinc-100"
      }`}>
        <Navbar isLight={isLight} onToggleTheme={toggleTheme} />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-md mx-auto my-auto">
          <div className={`w-20 h-20 rounded-3xl border flex items-center justify-center shadow-2xl animate-pulse ${
            isLight
              ? "bg-indigo-100 border-indigo-300 text-indigo-700"
              : "bg-indigo-500/20 border-indigo-500/40 text-indigo-400"
          }`}>
            <Lock className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className={`text-2xl sm:text-3xl font-black ${isLight ? "text-slate-900" : "text-white"}`}>🔒 Login Required</h1>
            <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600 font-semibold" : "text-zinc-300"}`}>
              Please log in to your account (Hassan or Adi) to access the AI Idea Generator.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl gradient-bg-primary text-white font-black text-sm shadow-xl shadow-indigo-500/30 hover:opacity-95 transition-all active:scale-95 cursor-pointer w-full"
          >
            Login to Access Website
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white font-sans transition-colors duration-300 ${
      isLight ? "bg-zinc-100 text-zinc-900" : "bg-zinc-950 text-zinc-100"
    }`}>
      <Navbar isLight={isLight} onToggleTheme={toggleTheme} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Header / Hero Banner */}
        <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 border shadow-2xl transition-all duration-300 ${
          isLight
            ? "bg-gradient-to-r from-indigo-100 via-purple-100 to-amber-50 border-indigo-200 text-slate-900 shadow-lg"
            : "bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950/80 border-indigo-500/20 text-slate-100 backdrop-blur-xl"
        }`}>
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-bold text-indigo-400">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>AI Video Concept & Prompt Engine</span>
              </div>
              <h1 className={`text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-3 ${
                isLight ? "text-slate-900" : "text-white"
              }`}>
                <Lightbulb className="w-8 h-8 text-amber-400 shrink-0 filter drop-shadow-md" />
                AI Idea Generator
              </h1>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isLight ? "text-slate-600 font-medium" : "text-slate-300"
              }`}>
                Generate production-ready video prompts with Claude AI, refine scripts, save dialogues, and copy 9:16 vertical concepts for video creation.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2.5 self-stretch sm:self-auto justify-end flex-wrap">
              {/* Theme Switcher Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
                  isLight
                    ? "bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900"
                    : "bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-200 hover:text-white"
                }`}
                title="Switch between Light and Dark mode"
              >
                {isLight ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>☀️ Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>🌙 Dark Mode</span>
                  </>
                )}
              </button>

              {/* Optimize Idea Toggle Button */}
              <button
                type="button"
                onClick={() => setIsOptimizeSectionOpen((v) => !v)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
                  isOptimizeSectionOpen
                    ? "bg-emerald-600 text-white border-emerald-400"
                    : isLight
                    ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800"
                    : "bg-emerald-950/60 hover:bg-emerald-900/60 border-emerald-500/40 text-emerald-300"
                }`}
                title="Toggle Custom Idea Rewriter / Optimizer section"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isOptimizeSectionOpen ? "Hide Optimizer" : "✨ Rewrite Idea"}</span>
              </button>

              {/* Reset Defaults Button */}
              <button
                type="button"
                onClick={handleResetSettings}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
                  isLight
                    ? "bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-800"
                    : "bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-200 hover:text-white"
                }`}
                title="Reset all generator settings, filters, and search to default"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>
        </div>

        {/* Custom Idea Optimizer Section (Collapsible) */}
        {isOptimizeSectionOpen && (
          <div ref={customIdeaOptimizerRef} className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 border shadow-xl transition-all duration-300 space-y-5 ${
            isLight
              ? "bg-white border-emerald-300 text-slate-900 shadow-md"
              : "bg-slate-950/70 border-emerald-500/20 text-slate-100 backdrop-blur-xl"
          }`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-base sm:text-lg font-bold flex items-center gap-2.5 ${isLight ? "text-slate-900" : "text-white"}`}>
                <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span>Optimize Custom Idea <span className={`text-xs font-normal hidden sm:inline ${isLight ? "text-slate-500" : "text-slate-400"}`}>(e.g. from ChatGPT or Scratch)</span></span>
              </h2>
              <button
                type="button"
                onClick={() => setIsOptimizeSectionOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-200 p-1"
                title="Close section"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3.5">
              <textarea
                value={customIdea}
                onChange={(e) => setCustomIdea(e.target.value)}
                placeholder="Paste your raw story idea here (e.g. A toddler girl finds a tiny green alien toy in the living room and asks if it likes biryani)..."
                className={`w-full h-32 px-4 py-3.5 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none font-sans ${
                  isLight
                    ? "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                    : "bg-black/60 border-slate-800 text-white placeholder-slate-500"
                }`}
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
              <div className={`mt-6 space-y-4 pt-6 border-t ${isLight ? "border-slate-200" : "border-slate-800/80"}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base sm:text-lg font-extrabold text-emerald-500">
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
                          : isLight
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
                          : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                      }`}
                    >
                      Scene {scene.sceneNumber}
                    </button>
                  ))}
                </div>

                <div className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans shadow-inner border ${
                  isLight
                    ? "bg-slate-50 border-slate-200 text-slate-800"
                    : "bg-black/70 border-slate-800 text-slate-200"
                }`}>
                  {optimizedData.scenes.find(s => s.sceneNumber === activeSceneTab)?.content}
                </div>
                
                <div className="flex flex-wrap items-center justify-end gap-2.5">
                  <button
                    onClick={handleSaveOptimizedIdea}
                    disabled={isSavingOptimized}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {isSavingOptimized ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bookmark className="w-3.5 h-3.5" />}
                    {isSavingOptimized ? "Saving..." : "Save to Saved Ideas"}
                  </button>
                  <button
                    onClick={() => handleCopy(optimizedData.scenes.find(s => s.sceneNumber === activeSceneTab)?.content || "", "opt-scene")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 ${
                      isLight
                        ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800"
                        : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 hover:text-white"
                    }`}
                  >
                    {copiedId === "opt-scene" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
                    {copiedId === "opt-scene" ? "Copied Scene Content!" : "Copy Scene Content"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generate New Ideas Form Controls */}
        <div ref={categoryControlsRef} className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 border shadow-xl relative z-30 space-y-6 transition-all duration-300 ${
          isLight
            ? "bg-white border-indigo-200 text-slate-900 shadow-xl"
            : "bg-slate-950/70 border-indigo-500/20 text-slate-100"
        }`}>
          {/* 🧭 Sticky Floating Jump Navigation Bar (Pinned below navbar on mobile & desktop) */}
          <div className={`sticky top-16 z-30 py-2 px-2.5 sm:px-4 mb-4 rounded-2xl border backdrop-blur-xl shadow-xl transition-all flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar ${
            isLight
              ? "bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/30"
              : "bg-slate-950/95 border-slate-800 text-white shadow-black/80"
          }`}>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="p-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-500">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className={`text-xs sm:text-sm font-black tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                Jump:
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 overflow-x-auto hide-scrollbar py-0.5">
              {/* ⚡ One-Tap Presets */}
              <button
                type="button"
                onClick={scrollToPresets}
                className={`px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-1 shrink-0 ${
                  isLight ? "bg-cyan-100 hover:bg-cyan-200 border-cyan-300 text-cyan-950" : "bg-cyan-950/60 hover:bg-cyan-900/60 border-cyan-500/40 text-cyan-300"
                }`}
                title="Jump to One-Tap Presets"
              >
                <span>⚡</span>
                <span className="hidden sm:inline">Presets</span>
              </button>

              {/* 🌐 Universal Concept Options (UCP) */}
              <button
                type="button"
                onClick={scrollToUcp}
                className={`px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-1 shrink-0 ${
                  isLight ? "bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-950" : "bg-blue-950/60 hover:bg-blue-900/60 border-blue-500/40 text-blue-300"
                }`}
                title="Jump to Universal Concept Options (UCP)"
              >
                <span>🌐</span>
                <span className="hidden sm:inline">UCP</span>
              </button>

              {/* ⚙️ Parameters */}
              <button
                type="button"
                onClick={() => scrollToSection(generatorParametersRef)}
                className={`px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-1 shrink-0 ${
                  isLight ? "bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-950" : "bg-purple-950/60 hover:bg-purple-900/60 border-purple-500/40 text-purple-300"
                }`}
                title="Jump to Parameters"
              >
                <span>⚙️</span>
                <span className="hidden sm:inline">Parameters</span>
              </button>

              {/* 💬 Custom Spoken Dialogue & Script */}
              <button
                type="button"
                onClick={() => scrollToSection(dialogueSectionRef)}
                className={`px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-1 shrink-0 ${
                  isLight ? "bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-950" : "bg-amber-950/60 hover:bg-amber-900/60 border-amber-500/40 text-amber-300"
                }`}
                title="Jump to Custom Spoken Dialogue & Script"
              >
                <span>💬</span>
                <span className="hidden sm:inline">Script</span>
              </button>

              {/* ✨ Generate */}
              <button
                type="button"
                onClick={() => scrollToSection(generateButtonRef)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 shadow-md bg-gradient-to-r from-red-600 to-rose-600 text-white border border-red-400 hover:opacity-95 flex items-center gap-1 shrink-0"
                title="Jump to Generate Button"
              >
                <span>✨</span>
                <span className="hidden sm:inline">Generate</span>
              </button>

              {/* 📁 Saved */}
              <button
                type="button"
                onClick={() => scrollToSection(savedIdeasSectionRef)}
                className={`px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-1 shrink-0 ${
                  isLight ? "bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-950" : "bg-emerald-950/60 hover:bg-emerald-900/60 border-emerald-500/40 text-emerald-300"
                }`}
                title="Jump to Saved Ideas"
              >
                <span>📁</span>
                <span className="hidden sm:inline">Saved </span>
                <span>({savedIdeas.length})</span>
              </button>
            </div>
          </div>

          {/* 🌟 BIG UNIFIED CATEGORY & PRIMARY CONTROLS CARD (Right after Generate New Video Concept) */}
          <div className={`p-4 sm:p-6 rounded-2xl border-2 shadow-2xl space-y-5 transition-all ${
            isLight
              ? "bg-gradient-to-r from-amber-50 via-indigo-50 to-purple-50 border-amber-400 text-slate-900 shadow-md"
              : "bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-purple-950/60 border-amber-500/50 text-white"
          }`}>
            {/* Top Row: Big Active Category Display + Category Dropdown Selector */}
            <div className={`flex flex-col gap-4 border-b pb-4 w-full ${isLight ? "border-amber-400/50" : "border-amber-500/20"}`}>
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <span className={`text-3xl sm:text-4xl p-3 rounded-2xl border shadow-inner shrink-0 hidden sm:block ${
                  isLight ? "bg-white border-amber-300 text-slate-900 shadow-sm" : "bg-black/70 border-amber-500/40 text-white"
                }`}>
                  {CATEGORIES[category]?.badge || "💡"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 flex-wrap ${
                    isLight ? "text-amber-800" : "text-amber-400"
                  }`}>
                    <span className="inline-block sm:hidden text-base leading-none">{CATEGORIES[category]?.badge || "💡"}</span>
                    <span>ACTIVE CATEGORY</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                  </div>
                  <h3 className={`text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight mt-0.5 break-words ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}>
                    {CATEGORIES[category]?.name || category}
                  </h3>
                  <p className={`text-xs font-semibold mt-1 leading-snug break-words whitespace-normal ${
                    isLight ? "text-slate-700" : "text-slate-300"
                  }`}>
                    {CATEGORIES[category]?.description}
                  </p>
                </div>
              </div>

              {/* Category Dropdown Selector */}
              <div className="w-full md:w-auto md:min-w-[260px] shrink-0 max-w-full overflow-hidden">
                <label className={`text-[11px] font-black uppercase tracking-wider block mb-1 ${
                  isLight ? "text-amber-900" : "text-amber-300"
                }`}>
                  Change Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as CategoryId)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base font-black cursor-pointer shadow-xl transition-all truncate text-ellipsis ${
                    isLight
                      ? "bg-white border-amber-400 text-amber-950 focus:border-amber-500 focus:ring-amber-500/20"
                      : "bg-black/80 border-amber-500/60 text-amber-200 focus:border-amber-400 focus:ring-amber-500/20"
                  }`}
                >
                  {categoryEntries.map((cat) => (
                    <option key={cat.id} value={cat.id} className={isLight ? "bg-white text-slate-900 font-bold py-1.5" : "bg-slate-900 text-slate-100 font-bold py-1.5"}>
                      {cat.name} ({cat.badge})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bottom Row: Grouped Primary Options (Language, Visual Style, Duration, AI Model) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Language */}
              <div className="space-y-1.5">
                <label className={`text-xs font-black uppercase tracking-wider ${isLight ? "text-slate-900" : "text-slate-300"}`}>Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full px-3.5 py-3 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold cursor-pointer disabled:opacity-50 ${
                    isLight ? "bg-white border-slate-300 text-slate-900 shadow-sm" : "bg-black/70 border-slate-700 text-white"
                  }`}
                  disabled={category === "CARBOX"}
                >
                  {category === "CARBOX" ? (
                    <option value="ASMR Unboxing Effects" className={isLight ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>ASMR Unboxing Effects</option>
                  ) : (
                    LANGUAGE_OPTIONS.map((l) => (
                      <option key={l} value={l} className={isLight ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>
                        {l}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Visual Style */}
              <div className="space-y-1.5">
                <label className={`text-xs font-black uppercase tracking-wider ${isLight ? "text-slate-900" : "text-slate-300"}`}>Visual Style</label>
                <VisualStyleDropdown value={visualStyle} onChange={setVisualStyle} isLight={isLight} />
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className={`text-xs font-black uppercase tracking-wider flex items-center gap-1 ${isLight ? "text-indigo-900" : "text-indigo-300"}`}>
                  <span>Duration</span>
                </label>
                <select
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(Number(e.target.value))}
                  className={`w-full px-3.5 py-3 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold cursor-pointer ${
                    isLight ? "bg-white border-slate-300 text-slate-900 shadow-sm" : "bg-black/70 border-indigo-500/40 text-white"
                  }`}
                >
                  <option value={8} className={isLight ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>8 Sec Story Clip</option>
                  <option value={10} className={isLight ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>⚡ 10 Sec Fast & Energetic</option>
                  <option value={20} className={isLight ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>⚡🎬 20 Sec Connected Story (2x 10s)</option>
                  <option value={30} className={isLight ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>⚡🎬 30 Sec Connected Story (3x 10s)</option>
                </select>
              </div>

              {/* AI Model Selector */}
              <div className="space-y-1.5">
                <label className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${isLight ? "text-purple-950" : "text-purple-300"}`}>
                  <span>🤖 AI Model</span>
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className={`w-full px-3.5 py-3 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-extrabold cursor-pointer ${
                    isLight ? "bg-white border-purple-300 text-purple-950 shadow-sm" : "bg-black/70 border-purple-500/40 text-white"
                  }`}
                >
                  {AI_MODEL_OPTIONS.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Top Priority Inputs: Dialogue & Situation Description */}
          {category !== "CARBOX" && (
            <div className="space-y-4 mb-4">
              {/* Fruit Dancing & Animal Dancing: No-dialogue info badge */}
              {category === "FRUIT_DANCING" || category === "ANIMAL_DANCING" ? (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-950/30 border border-green-500/40 shadow-md">
                  <span className="text-2xl">🔇</span>
                  <div>
                    <p className="text-xs font-extrabold text-green-300 uppercase tracking-wide">No Spoken Dialogue — Pure Dance Video</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {category === "ANIMAL_DANCING" 
                        ? "Animal Dancing videos are silent visual performances. AI will not add any spoken script or character dialogue — only cute dance moves, rhythm beats, and animal sound effects."
                        : "Fruit Dancing videos are silent visual performances. AI will not add any spoken script or character dialogue — only dance moves, music, and baby giggles."}
                    </p>
                  </div>
                </div>
              ) : (
              <div ref={dialogueSectionRef} className={`space-y-3 p-4 rounded-2xl border transition-all ${
                isLight
                  ? "bg-amber-50/80 border-2 border-amber-300 text-slate-900 shadow-sm"
                  : "bg-amber-950/20 border border-amber-500/30 text-slate-100"
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <label className={`text-xs uppercase flex items-center gap-2 ${
                    isLight ? "text-amber-950 font-black" : "text-amber-300 font-extrabold"
                  }`}>
                    <span>💬 Custom Spoken Dialogue (Optional)</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {customDialogue && (
                      <>
                        <button
                          type="button"
                          onClick={handleSaveDialogue}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                            isLight ? "bg-indigo-100 border-indigo-300 text-indigo-950 hover:bg-indigo-200" : "bg-indigo-900/60 hover:bg-indigo-800 border-indigo-700/50 text-indigo-200"
                          }`}
                          title="Save dialogue for future reuse"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(customDialogue, "custom-dialogue-input")}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                            isLight ? "bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200" : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                          }`}
                          title="Copy spoken dialogue"
                        >
                          {copiedId === "custom-dialogue-input" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
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
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                            isLight ? "bg-rose-100 border-rose-300 text-rose-950 hover:bg-rose-200" : "bg-rose-950/40 hover:bg-rose-900/60 border-rose-800/40 text-rose-300"
                          }`}
                          title="Clear dialogue"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>Clear</span>
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsDialogueExpanded(!isDialogueExpanded)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                        isLight ? "bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200" : "bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300"
                      }`}
                      title={isDialogueExpanded ? "Collapse to normal height" : "Expand field height for large script view"}
                    >
                      {isDialogueExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                      <span>{isDialogueExpanded ? "Collapse" : "Expand"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSuggestDialogue}
                      disabled={isSuggestingDialogue}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-black transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm ${
                        isLight
                          ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-amber-500/20"
                          : "bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border-amber-500/40 text-amber-300"
                      }`}
                      title="Automatically fix Urdu/Punjabi spelling, grammar, and Zair/Zabar/Pesh diacritics while preserving exact meaning"
                    >
                      {isSuggestingDialogue ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      )}
                      {isSuggestingDialogue ? "Fixing Script..." : "✨ Fix Urdu & Punjabi Script"}
                    </button>
                  </div>
                </div>

                {/* Character Label Quick-Insert + Direction + Voice Input */}
                {(videoDuration !== 20 && videoDuration !== 30) && (
                  <div className="flex flex-wrap items-center gap-2 py-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? "text-slate-900" : "text-slate-400"}`}>👤 Add Label:</span>
                    {[
                      { label: "Boy:", color: "blue" },
                      { label: "Girl:", color: "pink" },
                      { label: "Abu:", color: "amber" },
                      { label: "Baita:", color: "green" },
                      { label: "Amma:", color: "purple" },
                      { label: "Uncle:", color: "orange" },
                    ].map(({ label, color }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => insertDialogueLabel(label)}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                          color === "blue" ? (isLight ? "bg-blue-100 border-blue-300 text-blue-950 hover:bg-blue-200" : "bg-blue-950/50 border-blue-500/40 text-blue-300 hover:bg-blue-900/60") :
                          color === "pink" ? (isLight ? "bg-pink-100 border-pink-300 text-pink-950 hover:bg-pink-200" : "bg-pink-950/50 border-pink-500/40 text-pink-300 hover:bg-pink-900/60") :
                          color === "amber" ? (isLight ? "bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200" : "bg-amber-950/50 border-amber-500/40 text-amber-300 hover:bg-amber-900/60") :
                          color === "green" ? (isLight ? "bg-emerald-100 border-emerald-300 text-emerald-950 hover:bg-emerald-200" : "bg-green-950/50 border-green-500/40 text-green-300 hover:bg-green-900/60") :
                          color === "purple" ? (isLight ? "bg-purple-100 border-purple-300 text-purple-950 hover:bg-purple-200" : "bg-purple-950/50 border-purple-500/40 text-purple-300 hover:bg-purple-900/60") :
                          (isLight ? "bg-orange-100 border-orange-300 text-orange-950 hover:bg-orange-200" : "bg-orange-950/50 border-orange-500/40 text-orange-300 hover:bg-orange-900/60")
                        }`}
                        title={`Insert "${label}" at cursor`}
                      >
                        {label}
                      </button>
                    ))}

                    {/* LTR / RTL direction toggle */}
                    <button
                      type="button"
                      onClick={() => setDialogueDir((d) => (d === "ltr" ? "rtl" : "ltr"))}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                        dialogueDir === "rtl"
                          ? (isLight ? "bg-teal-100 border-teal-300 text-teal-950" : "bg-teal-900/60 border-teal-500/50 text-teal-200")
                          : (isLight ? "bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200" : "bg-slate-800/80 border-slate-600/50 text-slate-300 hover:bg-slate-700")
                      }`}
                      title={dialogueDir === "ltr" ? "Switch to Right-to-Left (Urdu)" : "Switch to Left-to-Right (English/Labels)"}
                    >
                      <span>{dialogueDir === "ltr" ? "⇒ LTR" : "⇐ RTL"}</span>
                    </button>

                    {/* Urdu Soft Keyboard Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowUrduKeyboard(!showUrduKeyboard)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                        showUrduKeyboard
                          ? (isLight ? "bg-indigo-600 border-indigo-700 text-white" : "bg-indigo-600 border-indigo-500 text-white")
                          : (isLight ? "bg-indigo-100 border-indigo-300 text-indigo-950 hover:bg-indigo-200" : "bg-indigo-950/60 border-indigo-500/40 text-indigo-200 hover:bg-indigo-900/80")
                      }`}
                      title="Toggle On-Screen Soft Urdu Keyboard"
                    >
                      <span>⌨️ Urdu Keyboard</span>
                    </button>

                    {/* Voice mic button */}
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                        isListening
                          ? "bg-rose-600 border-rose-400 text-white animate-pulse"
                          : (isLight ? "bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200" : "bg-slate-800 border-slate-600/50 text-slate-300 hover:bg-slate-700 hover:text-white")
                      }`}
                      title={isListening ? "Listening — click to stop" : "Click to speak voice input (Chrome PC & Android)"}
                    >
                      <Mic className={`w-3.5 h-3.5 ${isListening ? "text-white animate-bounce" : (isLight ? "text-amber-900" : "text-slate-400")}`} />
                      <span>{isListening ? "Stop Mic" : "🎙️ Mic"}</span>
                    </button>
                  </div>
                )}

                {/* Interactive On-Screen Soft Urdu Virtual Keyboard */}
                {showUrduKeyboard && (
                  <div dir="rtl" className={`p-3 rounded-xl border transition-all space-y-2 my-2 ${
                    isLight ? "bg-indigo-50/90 border-indigo-200 shadow-sm" : "bg-slate-950 border-indigo-500/30"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black ${isLight ? "text-indigo-950" : "text-indigo-300"}`}>
                        ⌨️ اردو ماؤس کیبورڈ (Urdu Soft Keyboard):
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowUrduKeyboard(false)}
                        className={`text-xs font-bold px-2 py-0.5 rounded hover:bg-rose-500 hover:text-white ${isLight ? "text-slate-500" : "text-slate-400"}`}
                      >
                        ✕ Close
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-start">
                      {[
                        "آ", "ا", "ب", "پ", "ت", "ٹ", "ث", "ج", "چ", "ح", "خ",
                        "د", "ڈ", "ذ", "ر", "ڑ", "ز", "ژ", "س", "ش", "ص", "ض",
                        "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن",
                        "ں", "و", "ہ", "ھ", "ء", "ی", "ے", "۔", "؟", "!", " "
                      ].map((key, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => insertUrduChar(key)}
                          className={`min-w-[32px] h-9 px-2 rounded-lg border text-sm font-bold transition-all cursor-pointer active:scale-90 shadow-xs flex items-center justify-center font-urdu ${
                            key === " "
                              ? (isLight ? "bg-indigo-200 border-indigo-300 text-indigo-950 w-16" : "bg-indigo-900 border-indigo-700 text-white w-16")
                              : (isLight ? "bg-white border-slate-300 text-slate-900 hover:bg-indigo-100 hover:border-indigo-400" : "bg-slate-900 border-slate-700 text-white hover:bg-indigo-950 hover:border-indigo-500")
                          }`}
                          title={`Insert ${key === " " ? "Space" : key}`}
                        >
                          {key === " " ? "Space" : key}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(videoDuration === 20 || videoDuration === 30) ? (
                  <div className="space-y-4 pt-1">
                    <div className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                      isLight ? "bg-white border-2 border-amber-300 shadow-sm" : "bg-amber-950/40 border border-amber-500/40"
                    }`}>
                      <div className="flex items-center justify-between">
                        <label className={`text-xs font-black flex items-center gap-1.5 ${
                          isLight ? "text-amber-950" : "text-amber-300"
                        }`}>
                          <span>🎬 Sequence 1 Spoken Dialogue (First 10s Clip — 0-10s)</span>
                        </label>
                        {customDialogueSeq1 && (
                          <button
                            type="button"
                            onClick={() => setCustomDialogueSeq1("")}
                            className="text-[10px] font-black text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            Clear Seq 1
                          </button>
                        )}
                      </div>
                      <textarea
                        value={customDialogueSeq1}
                        onChange={(e) => setCustomDialogueSeq1(e.target.value)}
                        dir={customDialogueSeq1 && /[\u0600-\u06FF]/.test(customDialogueSeq1) ? "rtl" : "auto"}
                        rows={3}
                        placeholder={`Spoken dialogue for first 10s clip, e.g.:\nابو دیکھو! میں نے ایک نیا کھیل دریافت کر لیا ہے!`}
                        className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base font-bold focus:outline-none transition-all resize-y custom-scrollbar ${
                          isLight
                            ? "bg-white border-amber-300 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                            : "bg-black/80 border-amber-500/50 text-white placeholder-slate-500 focus:border-amber-400"
                        }`}
                      />
                    </div>

                    <div className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                      isLight ? "bg-white border-2 border-indigo-300 shadow-sm" : "bg-indigo-950/40 border border-indigo-500/40"
                    }`}>
                      <div className="flex items-center justify-between">
                        <label className={`text-xs font-black flex items-center gap-1.5 ${
                          isLight ? "text-indigo-950" : "text-indigo-300"
                        }`}>
                          <span>🎬 Sequence 2 Spoken Dialogue (Second 10s Clip — 10-20s Continuation)</span>
                        </label>
                        {customDialogueSeq2 && (
                          <button
                            type="button"
                            onClick={() => setCustomDialogueSeq2("")}
                            className="text-[10px] font-black text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            Clear Seq 2
                          </button>
                        )}
                      </div>
                      <textarea
                        value={customDialogueSeq2}
                        onChange={(e) => setCustomDialogueSeq2(e.target.value)}
                        dir={customDialogueSeq2 && /[\u0600-\u06FF]/.test(customDialogueSeq2) ? "rtl" : "auto"}
                        rows={3}
                        placeholder={`Spoken dialogue for second 10s clip, e.g.:\nارے یہ کیا ہو گیا! لیکن کتنا مزہ آیا!`}
                        className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base font-bold focus:outline-none transition-all resize-y custom-scrollbar ${
                          isLight
                            ? "bg-white border-indigo-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            : "bg-black/80 border-indigo-500/50 text-white placeholder-slate-500 focus:border-indigo-400"
                        }`}
                      />
                    </div>

                    {videoDuration === 30 && (
                      <div className={`p-3.5 rounded-xl border space-y-2 mt-4 transition-all ${
                        isLight ? "bg-white border-2 border-fuchsia-300 shadow-sm" : "bg-fuchsia-950/40 border border-fuchsia-500/40"
                      }`}>
                        <div className="flex items-center justify-between">
                          <label className={`text-xs font-black flex items-center gap-1.5 ${
                            isLight ? "text-fuchsia-950" : "text-fuchsia-300"
                          }`}>
                            <span>✨ Sequence 3 Spoken Dialogue (Third 10s Clip - 20-30s)</span>
                          </label>
                          {customDialogueSeq3 && (
                            <button
                              type="button"
                              onClick={() => setCustomDialogueSeq3("")}
                              className="text-[10px] font-black text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              Clear Seq 3
                            </button>
                          )}
                        </div>
                        <textarea
                          value={customDialogueSeq3}
                          onChange={(e) => setCustomDialogueSeq3(e.target.value)}
                          dir={customDialogueSeq3 && /[\u0600-\u06FF]/.test(customDialogueSeq3) ? "rtl" : "auto"}
                          rows={3}
                          placeholder={`Spoken dialogue for third 10s clip, e.g.:\nLook what happened!`}
                          className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base font-bold focus:outline-none transition-all resize-y custom-scrollbar ${
                            isLight
                              ? "bg-white border-fuchsia-300 text-slate-900 placeholder-slate-400 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
                              : "bg-black/80 border-fuchsia-500/50 text-white placeholder-slate-500 focus:border-fuchsia-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea
                    ref={dialogueTextareaRef}
                    value={customDialogue}
                    onChange={(e) => setCustomDialogue(e.target.value)}
                    dir={dialogueDir}
                    rows={isDialogueExpanded ? 8 : 4}
                    placeholder={dialogueDir === "ltr"
                      ? `e.g.:\nBoy: کتنے سال کی ہو؟\nGirl: ایج پہ مت جانا، سمجھدار ہوں۔\nBoy: چائے پہ چلو گی؟\nGirl: نہیں — چائے گرم ہے، پیر جل جائیں گے! 😂`
                      : `مثلاً:\nلڑکا: کتنے سال کی ہو؟\nلڑکی: ایج پہ مت جانا، سمجھدار ہوں۔`
                    }
                    className={`w-full px-4.5 py-3.5 rounded-2xl border-2 text-base sm:text-lg lg:text-xl font-extrabold focus:outline-none transition-all resize-y overflow-y-auto custom-scrollbar shadow-inner leading-relaxed tracking-wide font-sans ${
                      isLight
                        ? "bg-white border-amber-400 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20"
                        : "bg-black/80 border-amber-500/50 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20"
                    }`}
                  />
                )}

                {/* Saved Dialogues Tag List */}
                {savedDialogues.length > 0 && (
                  <div className={`mt-3 p-3.5 rounded-xl border space-y-2 ${
                    isLight ? "bg-indigo-50/80 border-indigo-200 text-slate-900" : "bg-black/40 border-indigo-500/20 text-white"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black flex items-center gap-1.5 ${
                        isLight ? "text-indigo-950" : "text-indigo-300"
                      }`}>
                        <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
                        Saved Dialogues ({savedDialogues.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pt-1">
                      {savedDialogues.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs shadow-sm ${
                            isLight
                              ? "bg-white border-slate-300 text-slate-900 font-bold"
                              : "bg-slate-900/90 border-slate-800 text-slate-200"
                          }`}
                        >
                          <span
                            dir={language === "Urdu" || language === "Punjabi" ? "rtl" : "ltr"}
                            className="truncate max-w-[180px] sm:max-w-xs font-bold"
                          >
                            {item.text}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUseSavedDialogue(item.text)}
                            className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] transition-all cursor-pointer active:scale-95"
                          >
                            Use
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSavedDialogue(item.id)}
                            className={`p-0.5 transition-colors cursor-pointer ${
                              isLight ? "text-slate-500 hover:text-rose-600" : "text-slate-400 hover:text-rose-400"
                            }`}
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

              {/* Situation/Scene Description Section */}
              <div className={`space-y-3 p-4 rounded-2xl border transition-all ${
                isLight
                  ? "bg-slate-50 border-2 border-indigo-200 text-slate-900 shadow-sm"
                  : "bg-indigo-950/20 border border-indigo-500/30 text-white"
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <label className={`text-xs font-black flex items-center gap-2 ${
                    isLight ? "text-slate-900" : "text-indigo-300"
                  }`}>
                    <span>🎬 Situation / Scene Description (Optional)</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Situation Category Selector Dropdown */}
                    <select
                      value={selectedSituationCat}
                      onChange={(e) => {
                        setSelectedSituationCat(e.target.value);
                        handleSuggestSituation(e.target.value);
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold focus:outline-none cursor-pointer shadow-sm ${
                        isLight
                          ? "bg-white border-slate-300 text-slate-900"
                          : "bg-indigo-950/80 border-indigo-500/40 text-indigo-200"
                      }`}
                      title="Select a situation category to get AI scene suggestions"
                    >
                      {SITUATION_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id} className={isLight ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>
                          {cat.label}
                        </option>
                      ))}
                    </select>

                    {/* AI Suggest Situation Button */}
                    <button
                      type="button"
                      onClick={() => handleSuggestSituation()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border border-indigo-400/40 text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                      title="Suggest a new random scenario for the selected situation category"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>✨ AI Suggest Situation</span>
                    </button>

                    {customSceneDescription && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomSceneDescription("");
                          showToast("Cleared situation description", "info");
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                        title="Clear description"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  value={customSceneDescription}
                  onChange={(e) => setCustomSceneDescription(e.target.value)}
                  rows={3}
                  placeholder={`e.g. A girl is running along the platform after a departing vintage steam train, looking deeply as her silk dupatta flutters in the misty wind.`}
                  className={`w-full px-4.5 py-3.5 rounded-2xl border-2 text-base sm:text-lg lg:text-xl font-bold focus:outline-none transition-all resize-y overflow-y-auto custom-scrollbar shadow-inner leading-relaxed tracking-wide font-sans ${
                    isLight
                      ? "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                      : "bg-black/80 border-indigo-500/50 text-white placeholder-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20"
                  }`}
                />

                {/* One-Tap Quick Situation Suggestions Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className={`text-[10px] uppercase tracking-wider ${
                    isLight ? "text-slate-900 font-black" : "text-slate-400 font-bold"
                  }`}>⚡ One-Tap Quick Situations:</span>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_SITUATION_PILLS.map((pill) => (
                      <button
                        key={pill.label}
                        type="button"
                        onClick={() => {
                          setCustomSceneDescription(pill.text);
                          showToast(`Applied situation: "${pill.label}"`, "info");
                        }}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm ${
                          isLight
                            ? "bg-white hover:bg-indigo-50 text-slate-900 border-slate-300"
                            : "bg-slate-900/90 hover:bg-indigo-900/60 border-slate-800 text-slate-300 hover:text-indigo-200"
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Background Music Type Dropdown */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <CustomSelect
                label="Background Music Type"
                icon="🎵"
                value={musicType}
                onChange={(val) => setMusicType(val)}
                groups={(category as string) === "SONG" ? SONG_MUSIC_TYPE_GROUPS : (category as string) === "POETRY" ? POETRY_MUSIC_TYPE_GROUPS : MUSIC_TYPE_GROUPS}
                badgeTitle="Music Style"
                isLight={isLight}
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
                isLight={isLight}
              />
            </div>

            {/* Ending/Outro Visual Effects Dropdown */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <CustomSelect
                label="Ending Outro Visual Effects"
                icon="🎬"
                value={outroEffects}
                onChange={(val) => setOutroEffects(val)}
                groups={OUTRO_EFFECTS_GROUPS}
                badgeTitle="Outro Effects"
                isLight={isLight}
              />
            </div>

            {/* Include Microphone Toggle Switch */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-pink-400" />
                  <span>Microphone (Mic)</span>
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${includeMic ? "bg-pink-500/20 text-pink-300 border border-pink-500/40" : "bg-slate-800 text-slate-400"}`}>
                  {includeMic ? "ENABLED 🎙️" : "DISABLED (Default)"}
                </span>
              </label>
              <button
                type="button"
                onClick={() => setIncludeMic(!includeMic)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none ${
                  includeMic
                    ? "bg-pink-950/60 border-pink-500 text-pink-200 shadow-md shadow-pink-500/20"
                    : "bg-black/60 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="truncate">{includeMic ? "🎙️ Mic Included in Prompt" : "🚫 No Mic (Natural Voice)"}</span>
                <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${includeMic ? "bg-pink-600" : "bg-slate-700"}`}>
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${includeMic ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </button>
            </div>

          </div>

          {/* Universal Concept Options: Short Idea, Without Dialogue, Without Music */}
          <div ref={ucpSectionRef} className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 relative z-30 transition-all ${
            isLight
              ? "bg-slate-50 border-2 border-indigo-200 text-slate-900 shadow-sm"
              : "bg-indigo-950/30 border border-indigo-500/30 text-slate-100 shadow-lg"
          }`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2.5 gap-1.5 ${
              isLight ? "border-indigo-200" : "border-indigo-500/20"
            }`}>
              <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
                isLight ? "text-slate-900" : "text-indigo-300"
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                Universal Concept Options (Applies to All Categories)
              </span>
              <span className={`text-[10px] font-extrabold ${isLight ? "text-slate-600" : "text-slate-400 font-medium"}`}>
                All options OFF by default
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {/* 1. Short Idea Toggle */}
              <div
                onClick={() => setIsShortIdea(!isShortIdea)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isShortIdea
                    ? "bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-200 shadow-md ring-2 ring-amber-500/40"
                    : isLight
                    ? "bg-white border-2 border-zinc-200 hover:border-amber-400 text-zinc-900 shadow-sm font-bold"
                    : "bg-black/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-black flex items-center gap-1.5 ${
                    isShortIdea ? "text-amber-900 dark:text-amber-200" : isLight ? "text-zinc-950" : "text-white"
                  }`}>
                    <span className="text-base">⚡</span>
                    <span>Short Idea</span>
                  </span>
                  <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${isShortIdea ? "bg-amber-500" : "bg-slate-700"}`}>
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${isShortIdea ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </div>
                <p className={`text-[10px] font-semibold mt-1 leading-snug ${
                  isLight ? "text-zinc-700" : "text-slate-400 font-medium"
                }`}>
                  {isShortIdea ? "ON: Generates 3-4 clip short concept + Full Idea" : "OFF: Generates normal/full idea only"}
                </p>
              </div>

              {/* 2. Without Dialogue Toggle */}
              <div
                onClick={() => setWithoutDialogue(!withoutDialogue)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  withoutDialogue
                    ? "bg-purple-500/10 border-purple-500 text-purple-900 dark:text-purple-200 shadow-md ring-2 ring-purple-500/40"
                    : isLight
                    ? "bg-white border-2 border-zinc-200 hover:border-purple-400 text-zinc-900 shadow-sm font-bold"
                    : "bg-black/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-black flex items-center gap-1.5 ${
                    withoutDialogue ? "text-purple-900 dark:text-purple-200" : isLight ? "text-zinc-950" : "text-white"
                  }`}>
                    <span className="text-base">🔇</span>
                    <span>Without Dialogue</span>
                  </span>
                  <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${withoutDialogue ? "bg-purple-600" : "bg-slate-700"}`}>
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${withoutDialogue ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </div>
                <p className={`text-[10px] font-semibold mt-1 leading-snug ${
                  isLight ? "text-zinc-700" : "text-slate-400 font-medium"
                }`}>
                  {withoutDialogue ? "ON: Dialogue & Spoken Script DISABLED (Silent Visual Storytelling)" : "OFF: Dialogue & Character Script ENABLED"}
                </p>
              </div>

              {/* 3. Without Music Toggle */}
              <div
                onClick={() => setWithoutMusic(!withoutMusic)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  withoutMusic
                    ? "bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-200 shadow-md ring-2 ring-rose-500/40"
                    : isLight
                    ? "bg-white border-2 border-zinc-200 hover:border-rose-400 text-zinc-900 shadow-sm font-bold"
                    : "bg-black/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-black flex items-center gap-1.5 ${
                    withoutMusic ? "text-rose-900 dark:text-rose-200" : isLight ? "text-zinc-950" : "text-white"
                  }`}>
                    <span className="text-base">🚫🎵</span>
                    <span>Without Music</span>
                  </span>
                  <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${withoutMusic ? "bg-rose-600" : "bg-slate-700"}`}>
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${withoutMusic ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </div>
                <p className={`text-[10px] font-semibold mt-1 leading-snug ${
                  isLight ? "text-zinc-700" : "text-slate-400 font-medium"
                }`}>
                  {withoutMusic ? "ON: No background music. Diegetic SFX only" : "OFF: Can include background music"}
                </p>
              </div>

              {/* 4. Character Continuity Bible Toggle */}
              <div
                onClick={() => setIncludeCharacterBible(!includeCharacterBible)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  includeCharacterBible
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-md ring-2 ring-indigo-500/40"
                    : isLight
                    ? "bg-white border-2 border-zinc-200 hover:border-indigo-400 text-zinc-900 shadow-sm font-bold"
                    : "bg-black/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-black flex items-center gap-1.5 ${
                    includeCharacterBible ? "text-indigo-900 dark:text-indigo-200" : isLight ? "text-zinc-950" : "text-white"
                  }`}>
                    <span className="text-base">📋🔒</span>
                    <span>Continuity Bible</span>
                  </span>
                  <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${includeCharacterBible ? "bg-indigo-600" : "bg-slate-700"}`}>
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${includeCharacterBible ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </div>
                <p className={`text-[10px] font-semibold mt-1 leading-snug ${
                  isLight ? "text-zinc-700" : "text-slate-400 font-medium"
                }`}>
                  {includeCharacterBible ? "ENABLED: Includes locked facial identity & outfit specs" : "DISABLED: Skips Bible header & outputs scene prompts directly"}
                </p>
              </div>

              {/* 5. Compact 9:16 Prompt Only (Credit Saver) Toggle */}
              <div
                onClick={() => setCompactMode(!compactMode)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  compactMode
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-md ring-2 ring-emerald-500/40"
                    : isLight
                    ? "bg-white border-2 border-zinc-200 hover:border-emerald-400 text-zinc-900 shadow-sm font-bold"
                    : "bg-black/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-black flex items-center gap-1.5 ${
                    compactMode ? "text-emerald-900 dark:text-emerald-200" : isLight ? "text-zinc-950" : "text-white"
                  }`}>
                    <span className="text-base">⚡📱</span>
                    <span>9:16 Credit Saver</span>
                  </span>
                  <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${compactMode ? "bg-emerald-600" : "bg-slate-700"}`}>
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${compactMode ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </div>
                <p className={`text-[10px] font-semibold mt-1 leading-snug ${
                  isLight ? "text-zinc-700" : "text-slate-400 font-medium"
                }`}>
                  {compactMode ? "ON: Generates lean 9:16 prompt only (Saves ~75% credits)" : "OFF: Generates extended detailed description"}
                </p>
              </div>
            </div>
          </div>

          {/* Cute Kids Options */}
          {category === "CUTE_KIDS" && (
            <div ref={generatorParametersRef} className={`p-4 sm:p-6 rounded-2xl border space-y-5 shadow-xl relative z-30 transition-all duration-300 ${
              isLight ? "bg-slate-50 border-indigo-200 text-slate-900" : "bg-indigo-950/20 border-indigo-500/25 text-slate-100"
            }`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2 ${isLight ? "border-indigo-200" : "border-indigo-500/20"}`}>
                <div>
                  <span className={`text-xs uppercase tracking-wider flex items-center gap-2 ${
                    isLight ? "text-indigo-950 font-black" : "text-indigo-300 font-bold"
                  }`}>
                    <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                    Cute Kids Generator Parameters (Mobile Optimized)
                  </span>
                  <p className={`text-[11px] font-medium mt-0.5 ${isLight ? "text-slate-700" : "text-slate-400"}`}>
                    Tap any option below to open a full-screen, touch-friendly bottom selector for fast navigation on Android.
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                  isLight ? "bg-indigo-100 text-indigo-900 border-indigo-300" : "bg-indigo-950/60 text-indigo-300/80 border-indigo-500/20"
                }`}>
                  Touch-Friendly Selectors
                </span>
              </div>

              {/* One-Tap Mobile Presets Bar */}
              <div ref={presetsSectionRef} className={`rounded-2xl border overflow-hidden transition-all ${
                isLight
                  ? "bg-white border-indigo-200 text-slate-900 shadow-md"
                  : "bg-indigo-950/40 border-indigo-500/30 text-slate-100"
              }`}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsPresetsExpanded((v) => !v)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsPresetsExpanded((v) => !v); }}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 cursor-pointer touch-manipulation select-none"
                >
                  <span className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    isLight ? "text-indigo-950" : "text-indigo-300"
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    One-Tap Mobile Presets
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleResetCategorySettings("CUTE_KIDS"); }}
                      title="Reset Cute Kids settings to default values"
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-black transition-all cursor-pointer active:scale-95 touch-manipulation ${
                        isLight ? "bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200" : "bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white"
                      }`}
                    >
                      <RotateCcw className="w-3 h-3 text-amber-500" />
                      <span>Reset</span>
                    </button>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      isLight ? "text-indigo-600" : "text-indigo-400"
                    } ${isPresetsExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>
                {isPresetsExpanded && (
                  <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 pb-2 custom-scrollbar">
                      {CUTE_KIDS_PRESET_GROUPS.map((group) => (
                        <div key={group.groupName} className="space-y-2">
                          <h4 className={`text-[11px] font-black uppercase tracking-wider px-1 ${
                            isLight ? "text-indigo-950" : "text-indigo-300/80"
                          }`}>
                            {group.groupName}
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {group.presets.map((preset: any) => {
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
                                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm touch-manipulation w-full text-left ${
                                    isActive 
                                      ? (isLight ? "bg-indigo-600 text-white border-indigo-700 shadow-indigo-500/30 ring-2 ring-indigo-400" : "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/40 ring-1 ring-indigo-400")
                                      : (isLight ? "bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-950" : "bg-indigo-900/60 hover:bg-indigo-800 border-indigo-500/40 text-white")
                                  }`}
                                >
                                  <span className="text-base shrink-0">{preset.icon}</span>
                                  <span className="truncate">{preset.title}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Search & Parameter Filter Bar */}
              <div className={`p-3 sm:p-4 rounded-xl border space-y-2.5 transition-all ${
                isLight
                  ? "bg-white border-2 border-indigo-200 text-zinc-900 shadow-sm"
                  : "bg-black/60 border border-indigo-500/30 text-white"
              }`}>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                  isLight
                    ? "bg-slate-50 border-slate-300 focus-within:border-indigo-500 text-zinc-900 shadow-inner"
                    : "bg-slate-900/90 border-indigo-500/40 text-white"
                }`}>
                  <Search className="w-4 h-4 text-indigo-500 shrink-0" />
                  <input
                    type="text"
                    value={paramSearchQuery}
                    onChange={(e) => setParamSearchQuery(e.target.value)}
                    placeholder="🔍 Fast Search parameters (e.g. Location, Clothing, Setup, Audio, Age, Food)..."
                    className={`w-full bg-transparent text-xs focus:outline-none font-extrabold ${
                      isLight ? "text-zinc-950 placeholder-zinc-500" : "text-white placeholder-slate-400 font-medium"
                    }`}
                  />
                  {paramSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setParamSearchQuery("")}
                      className={`text-xs px-2 py-0.5 rounded font-bold cursor-pointer ${
                        isLight ? "bg-zinc-200 text-zinc-800 hover:bg-zinc-300" : "bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Quick Jump Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className={`text-[10px] uppercase tracking-wider mr-1 ${
                    isLight ? "text-zinc-950 font-black" : "text-slate-400 font-extrabold"
                  }`}>
                    Quick Jump:
                  </span>
                  {[
                    { label: "📍 Location", search: "location" },
                    { label: "👶 Age", search: "age" },
                    { label: "👕 Clothing", search: "clothing" },
                    { label: "👥 Setup", search: "setup" },
                    { label: "🖼️ Reference Img", search: "reference" },
                    { label: "🎙️ Audio", search: "audio" },
                    { label: "😄 Expression", search: "expression" },
                    { label: "🍭 Food", search: "food" },
                    { label: "🎈 Props", search: "props" },
                    { label: "🌅 Lighting", search: "lighting" },
                    { label: "🎬 Story", search: "story" },
                    { label: "🎥 Camera", search: "camera" },
                    { label: "🎭 Performance", search: "performance" },
                  ].map((chip) => {
                    const isSelected = paramSearchQuery.toLowerCase() === chip.search;
                    return (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => setParamSearchQuery(isSelected ? "" : chip.search)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer active:scale-95 ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/40 ring-1 ring-indigo-400"
                            : isLight
                            ? "bg-white hover:bg-indigo-50 text-zinc-900 border-2 border-zinc-200 shadow-sm"
                            : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60"
                        }`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                  {paramSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setParamSearchQuery("")}
                      className="px-2 py-1 rounded-lg text-[10px] font-black text-rose-600 bg-rose-100 hover:bg-rose-200 border border-rose-300 transition-all cursor-pointer"
                    >
                      Show All (15)
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Characters Age */}
                {matchesParamFilter(["age", "characters age", "kids age", "toddler", "child"]) && (
                  <CustomSelect
                    label="Characters Age"
                    icon="👶"
                    value={kidsAge}
                    onChange={setKidsAge}
                    groups={KIDS_AGE_GROUPS}
                    isLight={isLight}
                  />
                )}

                {/* 2. Scene Location */}
                {matchesParamFilter(["location", "scene location", "place", "setting", "room", "park", "kitchen"]) && (
                  <CustomSelect
                    label="Scene Location"
                    icon="📍"
                    value={kidsLocation}
                    onChange={setKidsLocation}
                    groups={KIDS_LOCATION_GROUPS}
                    isLight={isLight}
                  />
                )}

                {/* 3. Kids Health */}
                {matchesParamFilter(["health", "kids health", "active", "chubby"]) && (
                  <CustomSelect
                    label="Kids Health"
                    icon="❤️"
                    value={kidsHealth}
                    onChange={setKidsHealth}
                    groups={KIDS_HEALTH_GROUPS}
                    isLight={isLight}
                  />
                )}

                {/* 4. Kids Vibe */}
                {matchesParamFilter(["vibe", "mood", "feeling", "kids vibe"]) && (
                  <CustomSelect
                    label="Kids Vibe"
                    icon="✨"
                    value={kidsVibe}
                    onChange={setKidsVibe}
                    groups={KIDS_VIBE_GROUPS}
                    isLight={isLight}
                  />
                )}

                {/* 4.5 Kids Clothing / Outfit Style */}
                {matchesParamFilter(["clothing", "outfit", "kids clothing", "dress", "kurta", "frock"]) && (
                  <CustomSelect
                    label="Kids Clothing / Outfit"
                    icon="👕"
                    value={kidsClothing}
                    onChange={setKidsClothing}
                    groups={KIDS_CLOTHING_GROUPS}
                    keepOpenOnSelect={true}
                    isLight={isLight}
                  />
                )}

                {/* 4.6 Voice & Audio Style */}
                {matchesParamFilter(["voice", "audio", "sound", "music", "dubbing", "audio style"]) && (
                  <CustomSelect
                    label="Voice & Audio Style"
                    icon="🎙️"
                    value={kidsAudioStyle}
                    onChange={setKidsAudioStyle}
                    groups={KIDS_AUDIO_STYLE_GROUPS}
                    isLight={isLight}
                  />
                )}

                {/* 4.6 Father Clothing & Outfit */}
                {matchesParamFilter(["clothing", "father", "father clothing", "father outfit", "abu"]) && (
                  <div className="space-y-1.5">
                    <label className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                      isLight ? "text-zinc-950 font-black" : "text-slate-300 font-bold"
                    }`}>
                      <span>👨</span>
                      <span>Father Clothing</span>
                    </label>
                    <select
                      value={fatherClothing}
                      onChange={(e) => setFatherClothing(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold focus:outline-none cursor-pointer ${
                        isLight ? "bg-white border-zinc-300 text-zinc-950 shadow-sm" : "bg-black/60 border-slate-800 text-indigo-300"
                      }`}
                    >
                      {FATHER_CLOTHING_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className={isLight ? "bg-white text-zinc-900" : "bg-slate-900 text-slate-200"}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {fatherClothing === "Custom" && (
                      <input
                        type="text"
                        value={customFatherClothing}
                        onChange={(e) => setCustomFatherClothing(e.target.value)}
                        placeholder="e.g. White Waistcoat over Navy Blue Kurta..."
                        className={`w-full mt-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold shadow-inner ${
                          isLight ? "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400" : "bg-black/80 border-indigo-500/40 text-white placeholder-slate-500"
                        }`}
                      />
                    )}
                  </div>
                )}

                {/* 4.7 Mother Clothing & Outfit */}
                {matchesParamFilter(["clothing", "mother", "mother clothing", "mother outfit", "amma"]) && (
                  <div className="space-y-1.5">
                    <label className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                      isLight ? "text-zinc-950 font-black" : "text-slate-300 font-bold"
                    }`}>
                      <span>👩</span>
                      <span>Mother Clothing</span>
                    </label>
                    <select
                      value={motherClothing}
                      onChange={(e) => setMotherClothing(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold focus:outline-none cursor-pointer ${
                        isLight ? "bg-white border-zinc-300 text-zinc-950 shadow-sm" : "bg-black/60 border-slate-800 text-indigo-300"
                      }`}
                    >
                      {MOTHER_CLOTHING_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className={isLight ? "bg-white text-zinc-900" : "bg-slate-900 text-slate-200"}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {motherClothing === "Custom" && (
                      <input
                        type="text"
                        value={customMotherClothing}
                        onChange={(e) => setCustomMotherClothing(e.target.value)}
                        placeholder="e.g. Emerald Green Silk Suit with Embroidered Dupatta..."
                        className={`w-full mt-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold shadow-inner ${
                          isLight ? "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400" : "bg-black/80 border-indigo-500/40 text-white placeholder-slate-500"
                        }`}
                      />
                    )}
                  </div>
                )}

                {/* 5. Character Setup */}
                {matchesParamFilter(["setup", "character setup", "father son", "kids duo", "solo kid"]) && (
                  <CustomSelect
                    label="Character Setup"
                    icon="👥"
                    value={characterSetup}
                    onChange={handleCharacterSetupChange}
                    groups={CHARACTER_SETUP_GROUPS}
                    isLight={isLight}
                  />
                )}

                {/* Optional Character Reference Upload */}
                {matchesParamFilter(["reference", "character reference image", "library", "image upload", "browse library", "image"]) && (
                  <div className="space-y-1.5 mt-4 mb-4">
                    <label className={`text-xs uppercase tracking-wider flex items-center justify-between ${
                      isLight ? "text-zinc-950 font-black" : "text-slate-300 font-bold"
                    }`}>
                      <span>Character Reference Image (Optional)</span>
                      <button 
                        type="button"
                        onClick={() => { setShowCharacterLibrary(true); fetchCharacterLibrary(); }}
                        className={`text-xs flex items-center gap-1 font-black px-2.5 py-1 rounded-lg border transition-all cursor-pointer shadow-xs active:scale-95 ${
                          isLight 
                            ? "bg-indigo-100 border-indigo-300 text-indigo-950 hover:bg-indigo-200" 
                            : "bg-indigo-900/60 border-indigo-500/40 text-indigo-200 hover:bg-indigo-800/80"
                        }`}
                      >
                        🖼️ Browse Library
                      </button>
                    </label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={handleImageUpload} 
                        className={`w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer ${
                          isLight ? "text-zinc-900" : "text-slate-300"
                        }`}
                      />
                      {isAnalyzingImage && <div className="text-xs text-indigo-500 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> Analyzing image(s) and saving character info...</div>}
                      {referenceImages.length > 0 && (
                        <div className={`flex flex-col gap-3 p-3 rounded-xl border ${
                          isLight ? "bg-indigo-50 border-indigo-200" : "bg-indigo-900/30 border-indigo-500/20"
                        }`}>
                          <div className="flex flex-wrap gap-2">
                            {referenceImages.map((img, idx) => (
                              <div key={idx} className="relative group/img">
                                <img src={img} alt={`Reference ${idx + 1}`} className="w-14 h-14 rounded-lg object-cover border border-indigo-500/50" />
                                <button
                                  type="button"
                                  onClick={() => { setReferenceImages((prev) => prev.filter((_, i) => i !== idx)); showToast(`Removed image ${idx + 1}`, "info"); }}
                                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-500 border border-rose-400 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
                                  title={`Remove image ${idx + 1}`}
                                >
                                  <X className="w-3 h-3 text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                          {referenceCharacterInfo && !isAnalyzingImage && (
                            <div className={`text-xs whitespace-pre-wrap max-h-32 overflow-y-auto ${isLight ? "text-zinc-900 font-semibold" : "text-indigo-300"}`}>{referenceCharacterInfo}</div>
                          )}
                          <button onClick={() => { setReferenceImages([]); setReferenceCharacterInfo(""); }} className="self-end text-xs text-slate-500 hover:text-red-500 flex items-center gap-1"><X className="w-4 h-4"/> Clear All</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 6. Characters Per Scene */}
                {matchesParamFilter(["per scene", "characters per scene", "count", "number of kids"]) && (
                  <div className="space-y-1.5">
                    <CustomSelect
                      label="Characters Per Scene"
                      icon="🔢"
                      value={charactersPerScene}
                      onChange={setCharactersPerScene}
                      groups={CHARACTERS_PER_SCENE_GROUPS}
                      isLight={isLight}
                    />
                    {charactersPerScene === "Custom" && (
                      <input
                        type="text"
                        value={customCharactersPerScene}
                        onChange={(e) => setCustomCharactersPerScene(e.target.value)}
                        placeholder="e.g. 5 Characters (3 Kids + 2 Adults)..."
                        className={`w-full mt-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold shadow-inner ${
                          isLight ? "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400" : "bg-black/80 border-indigo-500/40 text-white placeholder-slate-500"
                        }`}
                      />
                    )}
                  </div>
                )}

                {/* 7. Nationality */}
                {matchesParamFilter(["nationality", "culture", "pakistani", "indian", "desi", "country"]) && (
                  <CustomSelect
                    label="Nationality / Culture"
                    icon="🌍"
                    value={kidsNationality}
                    onChange={setKidsNationality}
                    groups={KIDS_NATIONALITY_GROUPS}
                    isLight={isLight}
                  />
                )}

                {/* 8. Kids Expression / Reaction Style */}
                {matchesParamFilter(["expression", "reaction", "funny", "laughing", "surprised", "style"]) && (
                  <CustomSelect
                    label="Expression / Reaction Style"
                    icon="😄"
                    value={kidsExpression}
                    onChange={setKidsExpression}
                    groups={KIDS_EXPRESSION_GROUPS}
                    isLight={isLight}
                  />
                )}

                {/* 9. Food / Snack in Scene */}
                {matchesParamFilter(["food", "snack", "ice cream", "biscuit", "eating"]) && (
                  <CustomSelect
                    label="Food / Snack in Scene"
                    icon="🍭"
                    value={kidsFood}
                    onChange={setKidsFood}
                    groups={KIDS_FOOD_GROUPS}
                    isLight={isLight}
                  />
                )}

                {/* 10. Props / Object in Hand */}
                {matchesParamFilter(["props", "object", "hand", "toy", "balloon", "phone"]) && (
                  <CustomSelect
                    label="Props / Object in Hand"
                    icon="🎈"
                    value={kidsProp}
                    onChange={setKidsProp}
                    groups={KIDS_PROP_GROUPS}
                    isLight={isLight}
                  />
                )}

                {/* 11. Time of Day / Lighting */}
                {matchesParamFilter(["time", "lighting", "day", "night", "golden hour", "sunset"]) && (
                  <CustomSelect
                    label="Time of Day / Lighting"
                    icon="🌅"
                    value={timeOfDay}
                    onChange={setTimeOfDay}
                    groups={TIME_OF_DAY_GROUPS}
                    isLight={isLight}
                  />
                )}

                {/* 12. Story Beat / Narrative Moment */}
                {matchesParamFilter(["story", "narrative", "beat", "climax", "ending"]) && (
                  <CustomSelect
                    label="Story Beat / Narrative"
                    icon="🎬"
                    value={storyBeat}
                    onChange={setStoryBeat}
                    groups={STORY_BEAT_GROUPS}
                    isLight={isLight}
                  />
                )}

                {/* 13. Camera Shot Style */}
                {matchesParamFilter(["camera", "shot", "cinematic", "close up", "wide shot"]) && (
                  <CustomSelect
                    label="Camera Shot Style"
                    icon="🎥"
                    value={cameraShot}
                    onChange={setCameraShot}
                    groups={CAMERA_SHOT_GROUPS}
                    isLight={isLight}
                  />
                )}

                {/* 14. Character Performance */}
                {matchesParamFilter(["performance", "acting", "silent", "reaction", "dance"]) && (
                  <CustomSelect
                    label="Character Performance"
                    icon="🎭"
                    value={charPerformance}
                    onChange={setCharPerformance}
                    groups={CHARACTER_PERFORMANCE_GROUPS}
                    isLight={isLight}
                  />
                )}
              </div>
            </div>
          )}

          {/* SONG & SHAYARI (ADULT CLONE OF CUTE KIDS) OPTIONS */}
          {(category as string) === "SONG" && (
            <div className="p-4 sm:p-6 rounded-2xl bg-pink-950/20 border border-pink-500/25 space-y-5 shadow-xl relative z-30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-pink-500/20 pb-3 gap-2">
                <div>
                  <span className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
                    Song & Shayari Generator Parameters (Adult Content Engine)
                  </span>
                  <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                    Adult video clone of Cute Kids tailored for romantic Shayari, Urdu ghazals, Coke Studio duets, and two-liner song clips.
                  </p>
                </div>
                <span className="text-[10px] text-pink-300/80 font-semibold px-2.5 py-1 rounded-full bg-pink-950/60 border border-pink-500/20 self-start sm:self-auto">
                  Adult Song Engine
                </span>
              </div>

              {/* One-Tap Presets Bar */}
              <div className="rounded-2xl bg-pink-950/40 border border-pink-500/30 overflow-hidden">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsPresetsExpanded((v) => !v)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsPresetsExpanded((v) => !v); }}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 cursor-pointer touch-manipulation select-none"
                >
                  <span className="text-[11px] font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    One-Tap Song & Shayari Presets
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleResetCategorySettings("SONG"); }}
                      title="Reset Song & Shayari settings to default values"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 touch-manipulation"
                    >
                      <RotateCcw className="w-3 h-3 text-amber-400" />
                      <span>Reset</span>
                    </button>
                    <ChevronDown className={`w-4 h-4 text-pink-400 transition-transform duration-200 ${isPresetsExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>
                {isPresetsExpanded && (
                  <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {SONG_PRESETS.map((preset) => {
                        const isActive = 
                          kidsAge === preset.age &&
                          kidsLocation === preset.location &&
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
                            onClick={() => applySongPreset(preset)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-sm touch-manipulation w-full text-left ${
                              isActive 
                                ? "bg-pink-600 border-pink-400 shadow-md shadow-pink-500/40 ring-1 ring-pink-400" 
                                : "bg-pink-900/60 hover:bg-pink-800 border-pink-500/40"
                            }`}
                          >
                            <span className="text-base shrink-0">{preset.icon}</span>
                            <span className="truncate">{preset.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Performers Age */}
                <CustomSelect
                  label="Performers Age Range"
                  icon="👤"
                  value={kidsAge}
                  onChange={setKidsAge}
                  groups={SONG_AGE_GROUPS}
                  isLight={isLight}
                />

                {/* 2. Song Scene Location */}
                <CustomSelect
                  label="Song & Shayari Scene Location"
                  icon="📍"
                  value={kidsLocation}
                  onChange={setKidsLocation}
                  groups={SONG_LOCATION_GROUPS}
                  isLight={isLight}
                />

                {/* 3. Song Vibe & Mood */}
                <CustomSelect
                  label="Song Vibe & Mood"
                  icon="✨"
                  value={kidsVibe}
                  onChange={setKidsVibe}
                  groups={SONG_VIBE_GROUPS}
                  isLight={isLight}
                />

                {/* 4. Performers Clothing / Outfit */}
                <CustomSelect
                  label="Performers Outfit & Attire"
                  icon="👗"
                  value={kidsClothing}
                  onChange={setKidsClothing}
                  groups={SONG_CLOTHING_GROUPS}
                  keepOpenOnSelect={true}
                  isLight={isLight}
                />

                {/* 5. Performer / Character Setup */}
                <CustomSelect
                  label="Performer / Character Setup"
                  icon="👥"
                  value={characterSetup}
                  onChange={handleCharacterSetupChange}
                  groups={SONG_CHARACTER_SETUP_GROUPS}
                  isLight={isLight}
                />

                {/* Optional Character Reference Upload */}
                <div className="space-y-1.5 mt-4 mb-4">
                  <label className={`text-xs uppercase tracking-wider flex items-center justify-between ${
                    isLight ? "text-zinc-950 font-black" : "text-slate-300 font-bold"
                  }`}>
                    <span>Character Reference Image (Optional)</span>
                    <button 
                      type="button"
                      onClick={() => { setShowCharacterLibrary(true); fetchCharacterLibrary(); }}
                      className={`text-xs flex items-center gap-1 font-black px-2.5 py-1 rounded-lg border transition-all cursor-pointer shadow-xs active:scale-95 ${
                        isLight 
                          ? "bg-indigo-100 border-indigo-300 text-indigo-950 hover:bg-indigo-200" 
                          : "bg-indigo-900/60 border-indigo-500/40 text-indigo-200 hover:bg-indigo-800/80"
                      }`}
                    >
                      🖼️ Browse Library
                    </button>
                  </label>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handleImageUpload} 
                      className={`w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer ${
                        isLight ? "text-zinc-900" : "text-slate-300"
                      }`}
                    />
                    {isAnalyzingImage && <div className="text-xs text-indigo-500 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> Analyzing image(s) and saving character info...</div>}
                    {referenceImages.length > 0 && (
                      <div className={`flex flex-col gap-3 p-3 rounded-xl border ${
                        isLight ? "bg-indigo-50 border-indigo-200" : "bg-indigo-900/30 border-indigo-500/20"
                      }`}>
                        <div className="flex flex-wrap gap-2">
                          {referenceImages.map((img, idx) => (
                            <img key={idx} src={img} alt={`Reference ${idx + 1}`} className="w-12 h-12 rounded-lg object-cover border border-indigo-500/50" />
                          ))}
                        </div>
                        {referenceCharacterInfo && !isAnalyzingImage && (
                          <div className={`text-xs whitespace-pre-wrap max-h-32 overflow-y-auto ${isLight ? "text-zinc-900 font-semibold" : "text-indigo-300"}`}>{referenceCharacterInfo}</div>
                        )}
                        <button onClick={() => { setReferenceImages([]); setReferenceCharacterInfo(""); }} className="self-end text-xs text-slate-500 hover:text-red-500 flex items-center gap-1 cursor-pointer"><X className="w-4 h-4"/> Clear All</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 6. Performers Per Scene */}
                <div className="space-y-1.5">
                  <CustomSelect
                    label="Performers Per Scene"
                    icon="🔢"
                    value={charactersPerScene}
                    onChange={setCharactersPerScene}
                    groups={CHARACTERS_PER_SCENE_GROUPS}
                    isLight={isLight}
                  />
                  {charactersPerScene === "Custom" && (
                    <input
                      type="text"
                      value={customCharactersPerScene}
                      onChange={(e) => setCustomCharactersPerScene(e.target.value)}
                      placeholder="e.g. 4 Performers (2 Singers + 2 Musicians)..."
                      className={`w-full mt-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold shadow-inner ${
                        isLight ? "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400" : "bg-black/80 border-pink-500/40 text-white placeholder-slate-500"
                      }`}
                    />
                  )}
                </div>

                {/* 7. Culture / Nationality */}
                <CustomSelect
                  label="Culture / Aesthetic"
                  icon="🌍"
                  value={kidsNationality}
                  onChange={setKidsNationality}
                  groups={KIDS_NATIONALITY_GROUPS}
                  isLight={isLight}
                />

                {/* 8. Vocal / Song Style */}
                <CustomSelect
                  label="Vocal & Song Style"
                  icon="🎶"
                  value={seriousDialogueStyle}
                  onChange={setSeriousDialogueStyle}
                  groups={(category as string) === "SONG" ? SONG_STYLE_GROUPS_NEW : POETRY_STYLE_GROUPS}
                  isLight={isLight}
                />

                {/* 9. Time of Day / Lighting */}
                <CustomSelect
                  label="Time of Day / Lighting"
                  icon="🌅"
                  value={timeOfDay}
                  onChange={setTimeOfDay}
                  groups={TIME_OF_DAY_GROUPS}
                  isLight={isLight}
                />

                {/* 10. Camera Shot Style */}
                <CustomSelect
                  label="Camera Shot Style"
                  icon="🎥"
                  value={cameraShot}
                  onChange={setCameraShot}
                  groups={CAMERA_SHOT_GROUPS}
                  isLight={isLight}
                />

                {/* 11. Character Performance */}
                <CustomSelect
                  label="Performance Expression"
                  icon="🎭"
                  value={charPerformance}
                  onChange={setCharPerformance}
                  groups={CHARACTER_PERFORMANCE_GROUPS}
                />

                {/* 12. Background Noise & Audience FX */}
                <CustomSelect
                  label="Background Noise / Crowd Effects"
                  icon="🔊"
                  value={songCrowdFx}
                  onChange={setSongCrowdFx}
                  groups={(category as string) === "SONG" ? SONG_CROWD_FX_GROUPS_NEW : POETRY_CROWD_FX_GROUPS}
                />

                {/* 13. Facial Features & Beard Style */}
                <CustomSelect
                  label="Facial Features & Beard Style"
                  icon="🧔"
                  value={characterFaceType}
                  onChange={setCharacterFaceType}
                  groups={CHARACTER_FACE_GROUPS}
                />
              </div>
            </div>
          )}

          {/* POETRY, SHORT CLIP, COMMERCIAL AD, FRUIT DANCING & ANIMAL DANCING OPTIONS */}
          {(category === "POETRY" || category === "SHORT_CLIP" || category === "COMMERCIAL_AD" || category === "FRUIT_DANCING" || category === "ANIMAL_DANCING") && (
            <div className="p-4 sm:p-6 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-5 shadow-xl relative z-30 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-500/20 pb-3 gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-purple-300 flex items-center gap-2 uppercase tracking-wide">
                    <Feather className="w-4 h-4 text-purple-400" />
                    {category === "ANIMAL_DANCING"
                      ? "Animal Dancing Parameters (Viral Cosplay Pets)"
                      : category === "FRUIT_DANCING"
                      ? "Fruit Dancing Parameters (Viral 3D Baby Costumes)"
                      : category === "SHORT_CLIP" 
                      ? "Short Clip Parameters (10s Connected Scenes)" 
                      : category === "COMMERCIAL_AD"
                      ? "Commercial Ad Parameters (10-20s Brand Video Ad)"
                      : "Poetry & Shayari Parameters"}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {category === "ANIMAL_DANCING"
                      ? "Generate viral 3D cartoon animal dance videos (kittens, puppies, pandas, bunnies) in cute cosplay costumes with 10 one-tap presets."
                      : category === "FRUIT_DANCING"
                      ? "Generate viral 3D cartoon baby fruit costume dance videos with 20 one-tap presets."
                      : category === "SHORT_CLIP" 
                      ? "Connected 10-second scene ideas with 100% locked character consistency. Music is OFF by default." 
                      : category === "COMMERCIAL_AD"
                      ? "High-converting brand ads, product pitches, and UGC commercial scripts."
                      : "Atmospheric Ghazals, romantic Shayari, satirical Tanzo Mazah, and Mushaira Mehfils."}
                  </p>
                </div>
                <span className="text-[10px] text-purple-300/80 font-semibold px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/20 self-start sm:self-auto">
                  Touch-Friendly Selectors
                </span>
              </div>

              {/* One-Tap Presets Bar */}
              <div className="rounded-2xl bg-purple-950/40 border border-purple-500/30 overflow-hidden">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsPresetsExpanded((v) => !v)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsPresetsExpanded((v) => !v); }}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 cursor-pointer touch-manipulation select-none"
                >
                  <span className="text-[11px] font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {category === "ANIMAL_DANCING"
                      ? "One-Tap Animal Dancing Presets (Viral Cosplay Pets)"
                      : category === "SHORT_CLIP" 
                      ? "One-Tap Short Clip Presets (Connected Stories)" 
                      : category === "COMMERCIAL_AD"
                      ? "One-Tap Commercial Ad & Brand Pitch Presets (10-20s)"
                      : category === "FRUIT_DANCING"
                      ? "One-Tap Fruit Dancing Presets (Viral Baby Costumes)"
                      : "One-Tap Poetry & Shayari Presets"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleResetCategorySettings(category); }}
                      title={`Reset ${category} settings to default values`}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 touch-manipulation"
                    >
                      <RotateCcw className="w-3 h-3 text-amber-400" />
                      <span>Reset</span>
                    </button>
                    <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform duration-200 ${isPresetsExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>
                {isPresetsExpanded && (
                  <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      {(category === "ANIMAL_DANCING" ? ANIMAL_DANCING_PRESETS : category === "FRUIT_DANCING" ? FRUIT_DANCING_PRESETS : category === "SHORT_CLIP" ? SHORT_CLIP_PRESETS : category === "COMMERCIAL_AD" ? COMMERCIAL_AD_PRESETS : POETRY_PRESETS).map((preset: any) => (
                        <button
                          key={`${category}-${preset.title}`}
                          type="button"
                          onClick={() => {
                            if (category === "ANIMAL_DANCING") applyAnimalDancingPreset(preset);
                            else if (category === "FRUIT_DANCING") applyFruitDancingPreset(preset);
                            else if (category === "SHORT_CLIP") applyShortClipPreset(preset);
                            else if (category === "COMMERCIAL_AD") applyCommercialAdPreset(preset);
                            else applyPoetryPreset(preset);
                          }}
                          className="flex flex-col items-start p-2.5 rounded-xl bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/30 text-left transition-all active:scale-95 touch-manipulation group"
                        >
                          <span className="text-base mb-1">{preset.icon}</span>
                          <span className="text-xs font-bold text-white group-hover:text-purple-200 line-clamp-1">{preset.title}</span>
                          <span className="text-[10px] text-purple-300/70 line-clamp-1">{preset.desc || preset.setup || preset.animalType}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Grid of Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Pet Age  ↔  Baby / Toddler Age  ↔  Shayar / Poet Age */}
                <CustomSelect
                  label={category === "ANIMAL_DANCING" ? "Pet Age / Stage" : category === "FRUIT_DANCING" ? "Baby / Toddler Age" : (category as string) === "SONG" ? "Singer / Artist Age Range" : "Shayar / Poet Age Range"}
                  icon={category === "ANIMAL_DANCING" ? "🐾" : category === "FRUIT_DANCING" ? "🍼" : "🎂"}
                  value={kidsAge}
                  onChange={setKidsAge}
                  groups={category === "ANIMAL_DANCING" ? ANIMAL_DANCING_AGE_GROUPS : category === "FRUIT_DANCING" ? FRUIT_DANCING_AGE_GROUPS : (category as string) === "SONG" ? SONG_AGE_GROUPS : POETRY_AGE_GROUPS}
                />

                {/* 2. Dance Location  ↔  Mehfil & Poetry Location */}
                <CustomSelect
                  label={category === "ANIMAL_DANCING" || category === "FRUIT_DANCING" ? "Dance Location / Setting" : (category as string) === "SONG" ? "Music Video Location" : "Mehfil & Poetry Location"}
                  icon={category === "ANIMAL_DANCING" || category === "FRUIT_DANCING" ? "🌳" : "📍"}
                  value={kidsLocation}
                  onChange={setKidsLocation}
                  groups={category === "ANIMAL_DANCING" ? ANIMAL_DANCING_LOCATION_GROUPS : category === "FRUIT_DANCING" ? FRUIT_DANCING_LOCATION_GROUPS : (category as string) === "SONG" ? NEW_SONG_LOCATION_GROUPS : POETRY_LOCATION_GROUPS}
                />

                {/* 3. Dance Style & Vibe  ↔  Poetry Vibe & Mood */}
                <CustomSelect
                  label={category === "ANIMAL_DANCING" || category === "FRUIT_DANCING" ? "Dance Style & Vibe" : (category as string) === "SONG" ? "Musical Vibe & Mood" : "Poetry Vibe & Mood"}
                  icon={category === "ANIMAL_DANCING" || category === "FRUIT_DANCING" ? "🕺" : "✨"}
                  value={kidsVibe}
                  onChange={setKidsVibe}
                  groups={category === "ANIMAL_DANCING" || category === "FRUIT_DANCING" ? FRUIT_DANCING_VIBE_GROUPS : (category as string) === "SONG" ? SONG_VIBE_GROUPS : POETRY_VIBE_GROUPS}
                />

                {/* 4. Cosplay Costume  ↔  Fruit Costume Type  ↔  Shayar Attire / Outfit */}
                <CustomSelect
                  label={category === "ANIMAL_DANCING" ? "Cosplay Costume & Outfit" : category === "FRUIT_DANCING" ? "Fruit Costume Type" : (category as string) === "SONG" ? "Singer Attire & Outfit" : "Shayar Attire & Outfit"}
                  icon={category === "ANIMAL_DANCING" ? "👗" : category === "FRUIT_DANCING" ? "🍉" : "👗"}
                  value={kidsClothing}
                  onChange={setKidsClothing}
                  groups={category === "ANIMAL_DANCING" ? ANIMAL_DANCING_COSTUME_GROUPS : category === "FRUIT_DANCING" ? FRUIT_DANCING_COSTUME_GROUPS : (category as string) === "SONG" ? SONG_CLOTHING_GROUPS : POETRY_CLOTHING_GROUPS}
                  keepOpenOnSelect={true}
                />

                {/* 5. Animal & Species Setup  ↔  Baby Character Setup  ↔  Shayar & Poet Setup */}
                <CustomSelect
                  label={category === "ANIMAL_DANCING" ? "Animal & Species Setup" : category === "FRUIT_DANCING" ? "Baby Character Setup" : (category as string) === "SONG" ? "Band & Vocal Setup" : "Shayar & Poet Setup"}
                  icon={category === "ANIMAL_DANCING" ? "🐱" : category === "FRUIT_DANCING" ? "👶" : "👥"}
                  value={characterSetup}
                  onChange={handleCharacterSetupChange}
                  groups={category === "ANIMAL_DANCING" ? ANIMAL_DANCING_SPECIES_GROUPS : category === "FRUIT_DANCING" ? FRUIT_DANCING_CHARACTER_SETUP_GROUPS : (category as string) === "SONG" ? SONG_CHARACTER_SETUP_GROUPS : POETRY_CHARACTER_SETUP_GROUPS}
                />

                {/* Optional Character Reference Upload */}
                <div className="space-y-1.5 mt-4 mb-4">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Character Reference Image (Optional)</span>
                    <button 
                      type="button"
                      onClick={() => { setShowCharacterLibrary(true); fetchCharacterLibrary(); }}
                      className={`text-xs flex items-center gap-1 font-black px-2.5 py-1 rounded-lg border transition-all cursor-pointer shadow-xs active:scale-95 ${
                        isLight 
                          ? "bg-indigo-100 border-indigo-300 text-indigo-950 hover:bg-indigo-200" 
                          : "bg-indigo-900/60 border-indigo-500/40 text-indigo-200 hover:bg-indigo-800/80"
                      }`}
                    >
                      🖼️ Browse Library
                    </button>
                  </label>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handleImageUpload} 
                      className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                    />
                    {isAnalyzingImage && <div className="text-xs text-indigo-400 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> Analyzing image(s) and saving character info...</div>}
                    {referenceImages.length > 0 && (
                      <div className="flex flex-col gap-3 bg-indigo-900/30 p-3 rounded-xl border border-indigo-500/20">
                        <div className="flex flex-wrap gap-2">
                          {referenceImages.map((img, idx) => (
                            <img key={idx} src={img} alt={`Reference ${idx + 1}`} className="w-12 h-12 rounded-lg object-cover border border-indigo-500/50" />
                          ))}
                        </div>
                        {referenceCharacterInfo && !isAnalyzingImage && (
                          <div className="text-xs text-indigo-300 whitespace-pre-wrap max-h-32 overflow-y-auto">{referenceCharacterInfo}</div>
                        )}
                        <button onClick={() => { setReferenceImages([]); setReferenceCharacterInfo(""); }} className="self-end text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 cursor-pointer"><X className="w-4 h-4"/> Clear All</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 6. Performers Per Scene */}
                <div className="space-y-1.5">
                  <CustomSelect
                    label="Performers Per Scene"
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
                      placeholder="e.g. 2 Shayars reciting Shayari..."
                      className="w-full mt-2 px-3.5 py-2.5 rounded-xl bg-black/80 border border-purple-500/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-medium shadow-inner"
                    />
                  )}
                </div>

                {/* 7. Culture / Aesthetic */}
                <CustomSelect
                  label="Culture / Aesthetic"
                  icon="🌍"
                  value={kidsNationality}
                  onChange={setKidsNationality}
                  groups={KIDS_NATIONALITY_GROUPS}
                />

                {/* 8. Poetry & Satire Style (hidden for FRUIT_DANCING & ANIMAL_DANCING) */}
                {category !== "FRUIT_DANCING" && category !== "ANIMAL_DANCING" && (
                <CustomSelect
                  label={(category as string) === "SONG" ? "Song Genre / Style" : "Poetry & Satire Style"}
                  icon="📜"
                  value={seriousDialogueStyle}
                  onChange={setSeriousDialogueStyle}
                  groups={(category as string) === "SONG" ? SONG_STYLE_GROUPS_NEW : POETRY_STYLE_GROUPS}
                />
                )}

                {/* 9. Background Music Instrument */}
                <CustomSelect
                  label="Background Music Instrument"
                  icon="🎶"
                  value={musicType}
                  onChange={setMusicType}
                  groups={(category as string) === "SONG" ? SONG_MUSIC_TYPE_GROUPS : (category as string) === "POETRY" ? POETRY_MUSIC_TYPE_GROUPS : MUSIC_TYPE_GROUPS}
                />

                {/* 10. Time of Day / Lighting */}
                <CustomSelect
                  label="Time of Day / Lighting"
                  icon="🌅"
                  value={timeOfDay}
                  onChange={setTimeOfDay}
                  groups={TIME_OF_DAY_GROUPS}
                />

                {/* 11. Camera Shot Style */}
                <CustomSelect
                  label="Camera Shot Style"
                  icon="🎥"
                  value={cameraShot}
                  onChange={setCameraShot}
                  groups={CAMERA_SHOT_GROUPS}
                />

                {/* 12. Background Audience Sound FX (hidden for FRUIT_DANCING & ANIMAL_DANCING) */}
                {category !== "FRUIT_DANCING" && category !== "ANIMAL_DANCING" && (
                <CustomSelect
                  label={(category as string) === "SONG" ? "Concert / Audience FX" : "Background Audience FX (Wah Wah)"}
                  icon="🔊"
                  value={songCrowdFx}
                  onChange={setSongCrowdFx}
                  groups={(category as string) === "SONG" ? SONG_CROWD_FX_GROUPS_NEW : POETRY_CROWD_FX_GROUPS}
                />
                )}

                {/* 13. Facial Features & Beard Style (hidden for FRUIT_DANCING & ANIMAL DANCING) */}
                {category !== "FRUIT_DANCING" && category !== "ANIMAL_DANCING" && (
                <CustomSelect
                  label="Facial Features & Beard Style"
                  icon="🧔"
                  value={characterFaceType}
                  onChange={setCharacterFaceType}
                  groups={CHARACTER_FACE_GROUPS}
                />
                )}

                {/* 14. Performance Expression & Lip-Sync */}
                <CustomSelect
                  label="Performance Expression"
                  icon="🎭"
                  value={charPerformance}
                  onChange={setCharPerformance}
                  groups={CHARACTER_PERFORMANCE_GROUPS}
                />
              </div>
            </div>
          )}

          {/* LIVE STAGE METAMORPHOSIS OPTIONS */}
          {category === "LIVE_STAGE_METAMORPHOSIS" && (
            <div className="p-4 sm:p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-5 shadow-xl relative z-30 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-500/20 pb-3 gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    Live Stage Metamorphosis Parameters (10-Second VFX Morph)
                  </span>
                  <p className="text-[11px] text-slate-300 font-normal mt-0.5">
                    Live Event / Audience POV / VFX Illusion Transformation. Seamlessly morph performers into iconic creatures recorded by smartphones.
                  </p>
                </div>
                <span className="text-[10px] text-amber-300/90 font-extrabold px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 self-start sm:self-auto shadow-sm">
                  10s VFX Metamorphosis
                </span>
              </div>

              {/* One-Tap Presets Bar */}
              <div className="rounded-2xl bg-amber-950/40 border border-amber-500/30 overflow-hidden">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsPresetsExpanded((v) => !v)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsPresetsExpanded((v) => !v); }}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 cursor-pointer touch-manipulation select-none"
                >
                  <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    One-Tap Metamorphosis Presets
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleResetCategorySettings("LIVE_STAGE_METAMORPHOSIS"); }}
                      title="Reset Live Stage Metamorphosis settings to default values"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 touch-manipulation"
                    >
                      <RotateCcw className="w-3 h-3 text-amber-400" />
                      <span>Reset</span>
                    </button>
                    <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform duration-200 ${isPresetsExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>
                {isPresetsExpanded && (
                  <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {STAGE_METAMORPHOSIS_PRESETS.map((preset) => {
                        const isActive =
                          audiencePerspective === preset.audiencePerspective &&
                          stageEnvironment === preset.stageEnvironment &&
                          initialPerformer === preset.initialPerformer &&
                          triggerAction === preset.triggerAction &&
                          targetEntity === preset.targetEntity &&
                          lightingFx === preset.lightingFx;

                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => applyStageMetamorphosisPreset(preset)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-sm touch-manipulation w-full text-left ${
                              isActive
                                ? "bg-amber-600 border-amber-400 shadow-md shadow-amber-500/40 ring-1 ring-amber-400"
                                : "bg-amber-950/60 hover:bg-amber-900 border-amber-500/40"
                            }`}
                          >
                            <span className="truncate">{preset.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Performer Age Range */}
                <CustomSelect
                  label="Performer Age Range"
                  icon="👤"
                  value={performerAge}
                  onChange={setPerformerAge}
                  groups={METAMORPHOSIS_AGE_GROUPS}
                />

                {/* 2. Stage Location / Venue */}
                <CustomSelect
                  label="Stage Location / Venue"
                  icon="📍"
                  value={stageLocation}
                  onChange={setStageLocation}
                  groups={METAMORPHOSIS_LOCATION_GROUPS}
                />

                {/* 3. Audience Perspective */}
                <CustomSelect
                  label="Audience Perspective"
                  icon="📱"
                  value={audiencePerspective}
                  onChange={setAudiencePerspective}
                  groups={AUDIENCE_PERSPECTIVE_GROUPS}
                />

                {/* 4. Stage Environment */}
                <CustomSelect
                  label="Stage Environment"
                  icon="🎪"
                  value={stageEnvironment}
                  onChange={setStageEnvironment}
                  groups={STAGE_ENVIRONMENT_GROUPS}
                />

                {/* 5. Initial Performer */}
                <CustomSelect
                  label="Initial Performer"
                  icon="🎩"
                  value={initialPerformer}
                  onChange={setInitialPerformer}
                  groups={INITIAL_PERFORMER_GROUPS}
                />

                {/* 4. Trigger Action */}
                <CustomSelect
                  label="Trigger Action"
                  icon="⚡"
                  value={triggerAction}
                  onChange={setTriggerAction}
                  groups={TRIGGER_ACTION_GROUPS}
                />

                {/* 5. Target Entity */}
                <CustomSelect
                  label="Target Entity (Morph Creature)"
                  icon="🦁"
                  value={targetEntity}
                  onChange={setTargetEntity}
                  groups={TARGET_ENTITY_GROUPS}
                />

                {/* 6. Lighting & FX */}
                <CustomSelect
                  label="Lighting & Stage FX"
                  icon="💡"
                  value={lightingFx}
                  onChange={setLightingFx}
                  groups={LIGHTING_FX_GROUPS}
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

          {/* Quick View Summary */}
          <div className={`mt-8 mb-6 p-4 sm:p-6 rounded-2xl border shadow-sm relative z-10 transition-all ${
            isLight
              ? "bg-slate-50 border-2 border-slate-300 text-slate-900"
              : "bg-zinc-900/60 border border-zinc-700/80 text-zinc-100"
          }`}>
            <h3 className={`text-sm font-black mb-4 flex items-center gap-2 uppercase tracking-wider ${
              isLight ? "text-slate-900" : "text-indigo-300"
            }`}>
              <Eye className="w-4 h-4 text-indigo-500" />
              Quick View: Selected Configuration
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-3 text-[11px] sm:text-xs">
              
              {/* Global Settings */}
              <div className="space-y-1">
                <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Category</span>
                <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{category}</span>
              </div>
              <div className="space-y-1">
                <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Language</span>
                <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{language}</span>
              </div>
              <div className="space-y-1">
                <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Visual Style</span>
                <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{visualStyle}</span>
              </div>
              <div className="space-y-1">
                <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>AI Model</span>
                <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{aiModel}</span>
              </div>
              <div className="space-y-1">
                <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Duration</span>
                <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{videoDuration}s</span>
              </div>
              {isShortIdea && (
                <div className="space-y-1">
                  <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Short Idea</span>
                  <span className="text-amber-600 dark:text-amber-300 font-extrabold">ON (3-4 Clips Concept)</span>
                </div>
              )}
              {withoutDialogue && (
                <div className="space-y-1">
                  <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Dialogue</span>
                  <span className="text-purple-600 dark:text-purple-300 font-extrabold">WITHOUT DIALOGUE</span>
                </div>
              )}
              {withoutMusic && (
                <div className="space-y-1">
                  <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Music</span>
                  <span className="text-rose-600 dark:text-rose-300 font-extrabold">WITHOUT MUSIC (SFX Only)</span>
                </div>
              )}

              {/* Shared Settings */}
              {musicType !== "None" && (
                <div className="space-y-1">
                  <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Music</span>
                  <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{musicType}</span>
                </div>
              )}
              {seriousDialogueStyle !== "None" && (
                <div className="space-y-1">
                  <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Dialogue Style</span>
                  <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{seriousDialogueStyle}</span>
                </div>
              )}
              {outroEffects !== "None" && (
                <div className="space-y-1">
                  <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Outro Effect</span>
                  <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{outroEffects}</span>
                </div>
              )}
              {characterFaceType !== "Any / AI Decides" && (
                <div className="space-y-1">
                  <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Face Type</span>
                  <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{characterFaceType}</span>
                </div>
              )}
              {timeOfDay !== "Any / AI Decides" && (
                <div className="space-y-1">
                  <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Time of Day</span>
                  <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{timeOfDay}</span>
                </div>
              )}
              {cameraShot !== "Any / AI Decides" && (
                <div className="space-y-1">
                  <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Camera Shot</span>
                  <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{cameraShot}</span>
                </div>
              )}

              {/* Character Categories */}
              {(category === "CUTE_KIDS" || (category as string) === "SONG" || category === "POETRY") && (
                <>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Characters</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{charactersPerScene === "Custom" ? customCharactersPerScene : charactersPerScene}</span>
                  </div>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Setup</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{characterSetup}</span>
                  </div>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Age</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{kidsAge}</span>
                  </div>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Location</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{kidsLocation}</span>
                  </div>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Clothing</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{kidsClothing}</span>
                  </div>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Vibe</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{kidsVibe}</span>
                  </div>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Nationality</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{kidsNationality}</span>
                  </div>
                </>
              )}
              
              {/* CUTE KIDS Specific */}
              {category === "CUTE_KIDS" && (
                <>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Health</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{kidsHealth}</span>
                  </div>
                  {kidsExpression !== "Any / AI Decides" && (
                    <div className="space-y-1">
                      <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Expression</span>
                      <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{kidsExpression}</span>
                    </div>
                  )}
                  {kidsFood !== "Any / AI Decides" && (
                    <div className="space-y-1">
                      <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Food</span>
                      <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{kidsFood}</span>
                    </div>
                  )}
                  {kidsProp !== "Any / AI Decides" && (
                    <div className="space-y-1">
                      <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Prop</span>
                      <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{kidsProp}</span>
                    </div>
                  )}
                </>
              )}
              
              {/* CARBOX */}
              {category === "CARBOX" && (
                <>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Brand</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{carboxBrand}</span>
                  </div>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Color</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{carboxColor}</span>
                  </div>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Packaging</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{carboxPackaging}</span>
                  </div>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Background</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{carboxBackground}</span>
                  </div>
                </>
              )}
              
              {/* LIVE STAGE */}
              {category === "LIVE_STAGE_METAMORPHOSIS" && (
                <>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Performer</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{initialPerformer}</span>
                  </div>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Target Entity</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{targetEntity}</span>
                  </div>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Action</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{triggerAction}</span>
                  </div>
                  <div className="space-y-1">
                    <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Environment</span>
                    <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{stageEnvironment}</span>
                  </div>
                </>
              )}

              {/* SONG & POETRY */}
              {((category as string) === "SONG" || category === "POETRY") && (
                <div className="space-y-1">
                  <span className={`font-black block uppercase text-[10px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>Crowd FX</span>
                  <span className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{songCrowdFx}</span>
                </div>
              )}
            </div>
            
            {customDialogue && customDialogue.trim() && (
              <div className={`mt-4 pt-3 border-t ${isLight ? "border-slate-300" : "border-indigo-500/20"}`}>
                <span className={`font-black block uppercase text-[10px] mb-1 ${isLight ? "text-slate-700" : "text-slate-400"}`}>Custom Dialogue</span>
                <p className={`text-xs italic line-clamp-2 ${isLight ? "text-amber-950 font-black" : "text-amber-200"}`}>"{customDialogue}"</p>
              </div>
            )}
            {customSceneDescription && customSceneDescription.trim() && (
              <div className={`mt-3 pt-3 border-t ${isLight ? "border-slate-300" : "border-indigo-500/20"}`}>
                <span className={`font-black block uppercase text-[10px] mb-1 ${isLight ? "text-slate-700" : "text-slate-400"}`}>Custom Scene Description</span>
                <p className={`text-xs italic line-clamp-2 ${isLight ? "text-indigo-950 font-black" : "text-indigo-100/90"}`}>"{customSceneDescription}"</p>
              </div>
            )}
          </div>

          {/* Generator Action Footer */}
          <div ref={generateButtonRef} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t ${
            isLight ? "border-slate-200" : "border-slate-800/80"
          }`}>
            <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs shadow-xs w-full sm:w-auto transition-all ${
              isLight
                ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}>
              <span className="text-sm">✨</span>
              <span>
                <strong className={isLight ? "text-emerald-950 font-black" : "text-white font-bold"}>Clean Video Mandate:</strong> Completely clean & unobstructed video (no text, logos, or UI overlays).
                {category === "CARBOX" && " Model branding permitted for car videos."}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-indigo-500/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0 w-full sm:w-auto"
                title="Press Ctrl + Enter to generate concept"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                <span>
                  {isGenerating
                    ? "Generating Concept..."
                    : videoDuration === 20
                    ? "🎬 Generate First Scene (0-10s)"
                    : "✨ Generate 1 Idea"}
                </span>
                <span className="hidden lg:inline-block text-[10px] font-black opacity-80 bg-black/20 px-2 py-0.5 rounded-md border border-white/20 ml-1">
                  Ctrl + ↵
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Saved Ideas Section */}
        <div ref={savedIdeasSectionRef} className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 border shadow-xl space-y-5 relative z-0 transition-all duration-300 ${
          isLight ? "bg-white border-slate-200 text-slate-900 shadow-md" : "bg-slate-950/70 border-slate-800/80 text-slate-100 backdrop-blur-xl"
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className={`text-base sm:text-lg font-black flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
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
                  className={`w-full pl-10 pr-8 py-2 rounded-xl border text-xs font-mono shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    isLight
                      ? "bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
                      : "bg-black/60 border-indigo-500/40 text-indigo-100 placeholder-slate-500 focus:border-indigo-400"
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className={`flex items-center gap-1.5 border px-3 py-2 rounded-xl text-xs font-bold ${
                isLight ? "bg-white border-slate-300 text-slate-900 shadow-sm" : "bg-black/60 border-slate-700 text-slate-300"
              }`}>
                <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className={`bg-transparent text-xs focus:outline-none cursor-pointer font-bold ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  <option value="NEWEST" className={isLight ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>Newest First</option>
                  <option value="OLDEST" className={isLight ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>Oldest First</option>
                  <option value="FAVORITES_FIRST" className={isLight ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>Favorites First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => { setFilterCategory("ALL"); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer shrink-0 ${
                filterCategory === "ALL"
                  ? "bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30"
                  : isLight
                  ? "bg-white hover:bg-indigo-50 text-slate-900 border-2 border-slate-200 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              All ({savedIdeas.length})
            </button>
            <button
              onClick={() => { setFilterCategory("FAVORITES"); setCurrentPage(1); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer shrink-0 ${
                filterCategory === "FAVORITES"
                  ? "bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-600/30"
                  : isLight
                  ? "bg-white hover:bg-rose-50 text-slate-900 border-2 border-slate-200 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800"
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              Favorites ({savedIdeas.filter(i => i.isFavorite).length})
            </button>
            {categoryEntries.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setFilterCategory(cat.id); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer shrink-0 ${
                  filterCategory === cat.id
                    ? "bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30"
                    : isLight
                    ? "bg-white hover:bg-indigo-50 text-slate-900 border-2 border-slate-200 shadow-sm"
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
                    className={`group flex flex-col items-start justify-between gap-4 p-5 sm:p-6 rounded-2xl border transition-all shadow-md hover:shadow-xl w-full ${
                      isLight
                        ? "bg-slate-50 border-slate-200 text-slate-900 hover:border-indigo-400"
                        : "bg-black/40 border-slate-800 text-slate-100 hover:border-indigo-500/30"
                    }`}
                  >
                    {/* Action Toolbar — Placed at TOP for immediate mobile access */}
                    <div className={`flex items-center gap-1.5 flex-wrap w-full pb-1 border-b ${isLight ? "border-slate-200" : "border-slate-800/80"}`}>
                      <button
                        onClick={() => handleCopy(getIdeaDialogue(idea), `${idea.id}-action-dialogue`)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                          isLight ? "bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200" : "bg-amber-950/60 border-amber-500/40 text-amber-300 hover:text-white"
                        }`}
                        title="Copy Spoken Dialogue"
                      >
                        {copiedId === `${idea.id}-action-dialogue` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                        <span>Copy Dialogue</span>
                      </button>

                      {(idea.videoDuration === 20 || (idea.text && (idea.text.includes("CLIP 1 PROMPT") || idea.text.includes("20-SECOND CONNECTED") || idea.text.includes("STEP 1:")))) && (
                        <>
                          <button
                            onClick={() => handleCopy(getClip1Prompt(idea.text), `${idea.id}-clip1`)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-xs font-bold text-emerald-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                            title="Copy Clip 1 Prompt (0-10s) for Google Flow / Gemini"
                          >
                            {copiedId === `${idea.id}-clip1` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
                            <span>Clip 1 Prompt (0-10s)</span>
                          </button>

                          {(idea.text.includes("CLIP 2 PROMPT") || idea.text.includes("SECOND SEQUENCE")) ? (
                            <>
                              <button
                                onClick={() => handleCopy(getClip2Prompt(idea.text), `${idea.id}-clip2`)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-500/50 text-xs font-bold text-indigo-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                                title="Copy Clip 2 Prompt (10-20s Continuation) for Google Flow / Gemini"
                              >
                                {copiedId === `${idea.id}-clip2` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                                <span>Clip 2 Prompt (10-20s)</span>
                              </button>

                              <button
                                onClick={() => handleRegenerateScene1(idea)}
                                disabled={loadingSceneStepId === idea.id}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                                title="Regenerate Scene 1 (0-10s)"
                              >
                                {loadingSceneStepId === idea.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> : <RotateCcw className="w-3.5 h-3.5 text-amber-400" />}
                                <span>Re-gen Scene 1</span>
                              </button>

                              <button
                                onClick={() => handleGenerateScene2(idea)}
                                disabled={loadingSceneStepId === idea.id}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                                title="Regenerate Scene 2 (10-20s)"
                              >
                                {loadingSceneStepId === idea.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" /> : <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />}
                                <span>Re-gen Scene 2</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleGenerateScene2(idea)}
                              disabled={loadingSceneStepId === idea.id}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 border border-emerald-400/40 text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                              title="Generate Second Scene (10-20s)"
                            >
                              {loadingSceneStepId === idea.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                              <span>✨ Generate Scene 2</span>
                            </button>
                          )}

                          {idea.videoDuration === 30 && (idea.text.includes("CLIP 2 PROMPT") || idea.text.includes("SECOND SEQUENCE")) && (
                            (idea.text.includes("CLIP 3 PROMPT") || idea.text.includes("THIRD SEQUENCE")) ? (
                              <>
                                <button
                                  onClick={() => handleCopy(getClip3Prompt(idea.text), `${idea.id}-clip3`)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-fuchsia-950/70 border border-fuchsia-500/50 text-xs font-bold text-fuchsia-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                                  title="Copy Clip 3 Prompt (20-30s Continuation) for Google Flow / Gemini"
                                >
                                  {copiedId === `${idea.id}-clip3` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-fuchsia-400" />}
                                  <span>Clip 3 Prompt (20-30s)</span>
                                </button>
                                <button
                                  onClick={() => handleGenerateScene3(idea)}
                                  disabled={loadingSceneStepId === idea.id}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                                  title="Regenerate Scene 3 (20-30s)"
                                >
                                  {loadingSceneStepId === idea.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-fuchsia-400" /> : <RotateCcw className="w-3.5 h-3.5 text-fuchsia-400" />}
                                  <span>Re-gen Scene 3</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleGenerateScene3(idea)}
                                disabled={loadingSceneStepId === idea.id}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 border border-indigo-400/40 text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                                title="Generate Third Scene (20-30s)"
                              >
                                {loadingSceneStepId === idea.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                                <span>✨ Generate Scene 3</span>
                              </button>
                            )
                          )}
                        </>
                      )}

                      <button
                        onClick={() => handleCopy(cleanPromptText(idea.text), `${idea.id}-action-prompt`)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                          isLight ? "bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200" : "bg-slate-900 border-slate-700 text-slate-200 hover:text-white"
                        }`}
                        title="Copy Clean Video Prompt"
                      >
                        {copiedId === `${idea.id}-action-prompt` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                        <span>Copy Prompt</span>
                      </button>

                      <button
                        onClick={() => handleCopy(getPrompt916(idea.text), `${idea.id}-mobile`)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                          isLight ? "bg-indigo-50 border-indigo-200 text-indigo-950 hover:bg-indigo-100" : "bg-indigo-950/60 border-indigo-700/50 text-indigo-300 hover:text-white"
                        }`}
                        title="Copy 9:16 Mobile Vertical Aspect Ratio Prompt"
                      >
                        {copiedId === `${idea.id}-mobile` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                        <span>9:16 Mobile</span>
                      </button>

                      <button
                        onClick={() => handleCopy(getPrompt169(idea.text), `${idea.id}-full`)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                          isLight ? "bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200" : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                        }`}
                        title="Copy 16:9 Full Widescreen Aspect Ratio Prompt"
                      >
                        {copiedId === `${idea.id}-full` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                        <span>16:9 Full</span>
                      </button>

                      <button
                        onClick={() => handleCopy(getIdeaTitle(idea), `${idea.id}-action-title`)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                          isLight ? "bg-blue-50 border-blue-200 text-blue-950 hover:bg-blue-100" : "bg-blue-950/40 border-blue-500/40 text-blue-300 hover:text-white"
                        }`}
                        title="Copy Video Title"
                      >
                        {copiedId === `${idea.id}-action-title` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                        <span>Copy Title</span>
                      </button>

                      <button
                        onClick={() => handleCopy(getIdeaDescription(idea), `${idea.id}-action-desc`)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                          isLight ? "bg-purple-50 border-purple-200 text-purple-950 hover:bg-purple-100" : "bg-purple-950/40 border-purple-500/40 text-purple-300 hover:text-white"
                        }`}
                        title="Copy Description"
                      >
                        {copiedId === `${idea.id}-action-desc` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                        <span>Copy Description</span>
                      </button>

                      <button
                        onClick={() => handleCopy(getIdeaHashtags(idea), `${idea.id}-action-tags`)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                          isLight ? "bg-emerald-50 border-emerald-200 text-emerald-950 hover:bg-emerald-100" : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:text-white"
                        }`}
                        title="Copy Hashtags"
                      >
                        {copiedId === `${idea.id}-action-tags` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>Copy Tags</span>
                      </button>

                      <button
                        onClick={() => handleGenerateSocial(idea)}
                        disabled={generatingSocialId === idea.id}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-50 ${
                          isLight ? "bg-blue-100 border-blue-300 text-blue-950 hover:bg-blue-200" : "bg-blue-950/60 border-blue-600/50 text-blue-300 hover:text-white"
                        }`}
                        title="Generate Social Media Assets"
                      >
                        {generatingSocialId === idea.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span>{idea.socialContent ? "Regenerate Social" : "Generate Social"}</span>
                      </button>

                      <button
                        onClick={() => handleRemake(idea)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                          isLight ? "bg-purple-100 border-purple-300 text-purple-950 hover:bg-purple-200" : "bg-purple-950/60 border-purple-600/50 text-purple-300 hover:text-white"
                        }`}
                        title="Load settings to remake this script"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                        <span>Remake</span>
                      </button>

                      <div className="ml-auto flex items-center gap-1.5">
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
                        <button
                          onClick={() => handleDeleteIdea(idea.id)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-all cursor-pointer active:scale-95"
                          title="Delete Idea Card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Step 1 Review Banner for 20s Kids Videos */}
                    {(idea.videoDuration === 20 || (idea.text && (idea.text.includes("CLIP 1 PROMPT") || idea.text.includes("20-SECOND CONNECTED") || idea.text.includes("STEP 1:")))) &&
                      !(idea.text.includes("CLIP 2 PROMPT") || idea.text.includes("SECOND SEQUENCE")) && (
                      <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-purple-950/80 to-slate-950 border border-indigo-500/50 space-y-3 shadow-lg my-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs font-extrabold text-amber-300 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                            <span>Step 1 Complete: First Scene (0-10s) Ready for Review</span>
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300">
                            Credits Saved ⚡ (Scene 2 Not Generated Yet)
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Review the First Scene & Locked Character Bible below. If satisfied, click <strong>✨ Generate Second Scene</strong> to create Scene 2 continuation. If not, click <strong>🔄 Regenerate First Scene</strong> to try another option without spending credits on Scene 2!
                        </p>
                        <div className="flex items-center gap-2.5 flex-wrap pt-1">
                          <button
                            onClick={() => handleRegenerateScene1(idea)}
                            disabled={loadingSceneStepId === idea.id}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                          >
                            {loadingSceneStepId === idea.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                            ) : (
                              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            <span>🔄 Regenerate First Scene (0-10s)</span>
                          </button>

                          <button
                            onClick={() => handleGenerateScene2(idea)}
                            disabled={loadingSceneStepId === idea.id}
                            className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 border border-emerald-400/40 text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-md shadow-emerald-900/30 disabled:opacity-50"
                          >
                            {loadingSceneStepId === idea.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-amber-300" />
                            )}
                            <span>✨ Generate Second Scene (10-20s)</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Full Width Prompt Area */}
                    <div className="w-full space-y-3">
                      <div className={`w-full p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm leading-relaxed font-sans select-text max-h-48 overflow-y-auto whitespace-pre-wrap space-y-1 transition-all ${
                        isLight
                          ? "bg-white border-slate-300 text-slate-900 shadow-sm"
                          : "bg-black/30 border-slate-800/80 text-slate-100"
                      }`}>
                        {cleanPromptText(idea.text).split("\n").map((line, idx) => {
                          const isUrduLine = /[\u0600-\u06FF]/.test(line);
                          return (
                            <div
                              key={`line-${idx}-${line.slice(0, 8)}`}
                              dir={isUrduLine ? "rtl" : "ltr"}
                              className={
                                isUrduLine
                                  ? (isLight ? "text-right font-black text-amber-950 py-0.5 tracking-wide" : "text-right font-medium text-amber-200 py-0.5 tracking-wide")
                                  : (isLight ? "text-left text-slate-900 font-bold" : "text-left text-slate-200")
                              }
                            >
                              {line}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Badges & Filename Toolbar */}
                      <div className="flex items-center justify-between gap-2 flex-wrap pt-1 w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                            isLight ? "bg-indigo-50 text-indigo-950 border-indigo-200" : "bg-indigo-950 text-indigo-300 border-indigo-500/30"
                          }`}>
                            {CATEGORIES[idea.category]?.name || idea.category}
                          </span>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                            isLight ? "bg-emerald-50 text-emerald-950 border-emerald-200" : "bg-emerald-950 text-emerald-300 border-emerald-500/30"
                          }`}>
                            {idea.language}
                          </span>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                            isLight ? "bg-purple-50 text-purple-950 border-purple-200" : "bg-purple-950 text-purple-300 border-purple-500/30"
                          }`}>
                            {idea.visualStyle}
                          </span>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                            isLight ? "bg-amber-50 text-amber-950 border-amber-200" : "bg-amber-950/80 text-amber-300 border-amber-500/30"
                          }`}>
                            <Sparkles className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                            <span>{getModelBadgeLabel(idea.aiModel)}</span>
                          </span>
                          {(idea.videoDuration === 20 || (idea.text && (idea.text.includes("20-SECOND CONNECTED KIDS STORY") || idea.text.includes("2x 10s SEQUENCES")))) && (
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                              isLight ? "bg-emerald-50 text-emerald-950 border-emerald-200" : "bg-emerald-950/90 text-emerald-300 border-emerald-500/40"
                            }`}>
                              <span>⚡🎬</span>
                              <span>20s (2x 10s Sequences)</span>
                            </span>
                          )}
                          {idea.isShortIdea && (
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                              isLight ? "bg-amber-50 text-amber-950 border-amber-200" : "bg-amber-950/90 text-amber-300 border-amber-500/40"
                            }`}>
                              <span>⚡</span>
                              <span>Short Idea</span>
                            </span>
                          )}
                          {idea.withoutDialogue && (
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                              isLight ? "bg-purple-50 text-purple-950 border-purple-200" : "bg-purple-950/90 text-purple-300 border-purple-500/40"
                            }`}>
                              <span>🔇</span>
                              <span>No Dialogue</span>
                            </span>
                          )}
                          {idea.withoutMusic && (
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                              isLight ? "bg-rose-50 text-rose-950 border-rose-200" : "bg-rose-950/90 text-rose-300 border-rose-500/40"
                            }`}>
                              <span>🚫🎵</span>
                              <span>No Music</span>
                            </span>
                          )}
                          {idea.musicType && (
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                              isLight ? "bg-rose-50 text-rose-950 border-rose-200" : "bg-rose-950/80 text-rose-300 border-rose-500/30"
                            }`}>
                              <span>🎵</span>
                              <span>{idea.musicType}</span>
                            </span>
                          )}
                          {idea.seriousDialogueStyle && (
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                              isLight ? "bg-cyan-50 text-cyan-950 border-cyan-200" : "bg-cyan-950/80 text-cyan-300 border-cyan-500/30"
                            }`}>
                              <span>🎭</span>
                              <span>{idea.seriousDialogueStyle}</span>
                            </span>
                          )}
                        </div>

                        {/* Unique Video Filename Badge & Inline Editor */}
                        {editingFileNameId === idea.id ? (
                          <div className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs shadow-md border ${
                            isLight ? "bg-white border-indigo-300 text-slate-900" : "bg-black border-indigo-500 text-indigo-200"
                          }`}>
                            <FileVideo className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <input
                              type="text"
                              value={editingFileNameText}
                              onChange={(e) => setEditingFileNameText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveFileName(idea.id);
                                if (e.key === "Escape") setEditingFileNameId(null);
                              }}
                              className={`bg-transparent text-xs font-mono font-bold focus:outline-none w-48 sm:w-56 ${
                                isLight ? "text-slate-900 placeholder-slate-400" : "text-indigo-200 placeholder-slate-500"
                              }`}
                              placeholder="carbox_bmw_01"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveFileName(idea.id)}
                              className="text-[10px] font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-2.5 py-1 transition-colors cursor-pointer active:scale-95"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs border ${
                            isLight ? "bg-indigo-50 border-indigo-200 text-indigo-950" : "bg-indigo-950/40 border-indigo-500/30 text-indigo-200"
                          }`}>
                            <FileVideo className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className={`font-mono text-[11px] font-black select-all ${
                              isLight ? "text-indigo-950" : "text-indigo-300"
                            }`}>
                              {getFallbackFileName(idea)}
                            </span>
                            <button
                              onClick={() => {
                                setEditingFileNameId(idea.id);
                                setEditingFileNameText(getFallbackFileName(idea));
                              }}
                              className="text-slate-400 hover:text-indigo-600 p-0.5 transition-colors cursor-pointer"
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
                      {idea.withoutDialogue || idea.category === "FRUIT_DANCING" || idea.category === "ANIMAL_DANCING" ? (
                        <div className="mt-3 p-3 sm:p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                            <span>🔇</span>
                            <span>Silent Visual Video — No Spoken Dialogue</span>
                          </span>
                          <span className="text-[10px] text-slate-500">Visuals & Music Only</span>
                        </div>
                      ) : (
                        <div className={`mt-3 p-3.5 sm:p-4 rounded-xl border space-y-2 w-full shadow-lg transition-all ${
                          isLight
                            ? "bg-amber-50/90 border-amber-300 text-slate-900"
                            : "bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-black/40 border-amber-500/40 text-amber-300"
                        }`}>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-black flex items-center gap-1.5 uppercase tracking-wider ${
                                isLight ? "text-amber-950" : "text-amber-300"
                              }`}>
                                <span>💬</span>
                                <span>{idea.customDialogue ? "Custom Spoken Dialogue" : "Spoken Dialogue & Script"}</span>
                              </span>
                              {idea.customDialogue && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  isLight ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                }`}>
                                  User Custom Input
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleCopy(getIdeaDialogue(idea), `${idea.id}-card-dialogue`)}
                                className={`flex items-center gap-1 text-[11px] font-black transition-colors cursor-pointer px-2.5 py-1 rounded-lg border shadow-sm ${
                                  isLight
                                    ? "bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200"
                                    : "bg-amber-950/80 text-amber-300 border-amber-500/30 hover:text-white"
                                }`}
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
                                className={`flex items-center gap-1 text-[11px] font-black transition-colors cursor-pointer px-2.5 py-1 rounded-lg border shadow-sm ${
                                  isLight
                                    ? "bg-emerald-100 text-emerald-950 border-emerald-300 hover:bg-emerald-200"
                                    : "bg-emerald-950/80 text-emerald-300 border-emerald-500/30 hover:text-white"
                                }`}
                                title="Use this dialogue in the generator form above"
                              >
                                <Sparkles className="w-3 h-3 text-emerald-500" />
                                <span>Use in Generator</span>
                              </button>

                              <button
                                onClick={() => handleOpenScriptModal(idea)}
                                className={`flex items-center gap-1 text-[11px] font-black transition-colors cursor-pointer px-2.5 py-1 rounded-lg border shadow-sm ${
                                  isLight
                                    ? "bg-indigo-100 text-indigo-950 border-indigo-300 hover:bg-indigo-200"
                                    : "bg-indigo-950/80 text-indigo-300 border-indigo-500/40 hover:text-white"
                                }`}
                                title="Open Full Dialogue Box Modal"
                              >
                                <MessageSquare className="w-3 h-3 text-indigo-500" />
                                <span>Open Dialog Box</span>
                              </button>
                            </div>
                          </div>

                          <div
                            dir={isRtl ? "rtl" : "ltr"}
                            className={`p-3 rounded-xl border text-sm sm:text-base font-extrabold leading-snug tracking-wide max-h-28 sm:max-h-36 overflow-y-auto ${
                              isRtl ? "text-right" : "text-left"
                            } ${
                              isLight
                                ? "bg-white border-amber-300 text-slate-900 shadow-sm"
                                : "bg-black/80 border-amber-500/40 text-amber-100"
                            }`}
                          >
                            {getIdeaDialogue(idea) || (
                              <span className={isLight ? "text-slate-500 italic font-semibold" : "text-slate-400 italic"}>No custom spoken dialogue specified yet. Click &quot;Open Dialog Box&quot; to add dialogue.</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Social Media Content — Prominent CTA when not yet generated */}
                      {!idea.socialContent && (
                        <div className={`mt-4 rounded-2xl border shadow-xl overflow-hidden transition-all ${
                          isLight
                            ? "bg-blue-50 border-blue-200 text-slate-900"
                            : "border-blue-500/40 bg-gradient-to-br from-blue-950/50 via-indigo-950/40 to-black/60 text-slate-100"
                        }`}>
                          <button
                            onClick={() => handleGenerateSocial(idea)}
                            disabled={generatingSocialId === idea.id}
                            className="w-full flex flex-col items-center justify-center gap-3 py-6 px-4 text-center active:scale-[0.98] transition-transform disabled:opacity-60 cursor-pointer"
                          >
                            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border shadow-lg ${
                              isLight ? "bg-white border-blue-300 text-blue-600" : "bg-blue-600/30 border-blue-500/50 text-blue-400"
                            }`}>
                              {generatingSocialId === idea.id ? (
                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                              ) : (
                                <Share2 className="w-6 h-6 text-blue-500" />
                              )}
                            </div>
                            <div>
                              <p className={`text-sm font-black tracking-wide ${
                                isLight ? "text-blue-950" : "text-blue-200"
                              }`}>
                                {generatingSocialId === idea.id ? "Generating Social Assets…" : "📣 Generate Social Media Titles & Assets"}
                              </p>
                              <p className={`text-[11px] mt-0.5 ${
                                isLight ? "text-blue-700 font-bold" : "text-blue-400/80"
                              }`}>
                                YouTube Shorts · Facebook Reels · TikTok · IG · Hashtags · Trending Tags
                              </p>
                            </div>
                            {generatingSocialId !== idea.id && (
                              <span className="px-5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md transition-colors">
                                Tap to Generate
                              </span>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Social Media Content Display Box */}
                      {idea.socialContent && (
                        <div className={`mt-4 p-4 rounded-2xl border space-y-4 w-full shadow-xl font-sans transition-all ${
                          isLight
                            ? "bg-blue-50/80 border-blue-200 text-slate-900 shadow-md"
                            : "bg-gradient-to-br from-blue-950/40 via-indigo-950/30 to-black/50 border-blue-500/40 text-slate-100"
                        }`}>
                          <div className={`flex items-center justify-between border-b pb-3 flex-wrap gap-2 ${
                            isLight ? "border-blue-200" : "border-blue-500/20"
                          }`}>
                            <div className={`flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider ${
                              isLight ? "text-blue-950" : "text-blue-300"
                            }`}>
                              <Share2 className="w-4 h-4 text-blue-500" />
                              <span>Social Media Titles & Trending Assets</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleCopy(`🎬 VIDEO TITLE:\n${getIdeaShortsTitle(idea) || getIdeaTitle(idea)}\n\n📝 DESCRIPTION:\n${getIdeaDescription(idea)}\n\n🏷️ HASHTAGS:\n${getIdeaHashtags(idea)}\n\n🔥 TRENDING TAGS & SUGGESTIONS:\n${getIdeaTrendingTags(idea)}`, `${idea.id}-social-all`)}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md ${
                                  isLight ? "bg-blue-600 text-white border-blue-700 hover:bg-blue-700 shadow-blue-500/20" : "bg-blue-600/40 border-blue-500/50 hover:bg-blue-600/60 text-white"
                                }`}
                                title="Copy all platform titles, description, hashtags and trending tags together"
                              >
                                {copiedId === `${idea.id}-social-all` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-200" />}
                                <span>Copy All Social Assets</span>
                              </button>
                              <button
                                onClick={() => handleGenerateSocial(idea)}
                                disabled={generatingSocialId === idea.id}
                                className={`text-xs font-black transition-colors flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-lg border shadow-sm ${
                                  isLight ? "bg-white text-slate-900 border-slate-300 hover:bg-slate-100" : "bg-slate-900/80 text-slate-400 hover:text-blue-200 border-slate-700"
                                }`}
                              >
                                <RotateCcw className="w-3 h-3 text-blue-500" />
                                <span>Regenerate Titles</span>
                              </button>
                            </div>
                          </div>

                          {/* 🎬 Universal Video Title (All Platforms: YouTube Shorts, FB Reels, TikTok & IG) */}
                          <div className="space-y-1">
                            <div className={`flex items-center justify-between text-xs font-black ${
                              isLight ? "text-indigo-950" : "text-indigo-300"
                            }`}>
                              <span>🎬 Universal Video Title (Fits YouTube Shorts, FB Reels, TikTok & IG)</span>
                              <button
                                onClick={() => handleCopy(getIdeaShortsTitle(idea) || getIdeaTitle(idea), `${idea.id}-universal-title`)}
                                className={`flex items-center gap-1 text-[11px] font-black transition-colors cursor-pointer px-2.5 py-1 rounded-lg border shadow-sm ${
                                  isLight ? "bg-indigo-100 text-indigo-950 border-indigo-300 hover:bg-indigo-200" : "bg-indigo-950/80 text-indigo-300 border-indigo-500/40 hover:text-white"
                                }`}
                              >
                                {copiedId === `${idea.id}-universal-title` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-indigo-500" />}
                                Copy Video Title
                              </button>
                            </div>
                            <div dir={isRtl ? "rtl" : "ltr"} className={`p-3 rounded-xl border text-sm sm:text-base font-extrabold tracking-wide ${isRtl ? "text-right" : "text-left"} ${
                              isLight ? "bg-white border-indigo-200 text-slate-900 shadow-xs" : "bg-black/80 border-indigo-500/40 text-white"
                            }`}>
                              {getIdeaShortsTitle(idea) || getIdeaTitle(idea)}
                            </div>
                          </div>

                          {/* 📝 Video Description */}
                          <div className="space-y-1">
                            <div className={`flex items-center justify-between text-xs font-black ${
                              isLight ? "text-slate-900" : "text-slate-300"
                            }`}>
                              <span>📝 Video Description</span>
                              <button
                                onClick={() => handleCopy(getIdeaDescription(idea), `${idea.id}-social-desc`)}
                                className={`flex items-center gap-1 text-[11px] font-black transition-colors cursor-pointer px-2 py-0.5 rounded border shadow-xs ${
                                  isLight ? "bg-white text-slate-900 border-slate-300 hover:bg-slate-100" : "bg-slate-900 text-slate-300 border-slate-700 hover:text-white"
                                }`}
                              >
                                {copiedId === `${idea.id}-social-desc` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                Copy Description
                              </button>
                            </div>
                            <div dir={isRtl ? "rtl" : "ltr"} className={`p-2.5 rounded-xl border text-xs font-bold ${isRtl ? "text-right" : "text-left"} ${
                              isLight ? "bg-white border-slate-200 text-slate-900 shadow-xs" : "bg-black/70 border-slate-800 text-slate-200 font-medium"
                            }`}>
                              {getIdeaDescription(idea)}
                            </div>
                          </div>

                          {/* 🏷️ Core Hashtags & 🔥 Trending Tags */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {/* Core Hashtags */}
                            <div className="space-y-1">
                              <div className={`flex items-center justify-between text-xs font-black ${
                                isLight ? "text-indigo-950" : "text-indigo-300"
                              }`}>
                                <span>🏷️ Core Hashtags (4-5)</span>
                                <button
                                  onClick={() => handleCopy(getIdeaHashtags(idea), `${idea.id}-social-tags`)}
                                  className={`flex items-center gap-1 text-[11px] font-black transition-colors cursor-pointer px-2 py-0.5 rounded border shadow-xs ${
                                    isLight ? "bg-indigo-100 text-indigo-950 border-indigo-300 hover:bg-indigo-200" : "bg-indigo-950/60 text-indigo-400 border-indigo-500/30 hover:text-white"
                                  }`}
                                >
                                  {copiedId === `${idea.id}-social-tags` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-indigo-500" />}
                                  Copy Tags
                                </button>
                              </div>
                              <div dir="ltr" className={`p-2.5 rounded-xl border text-xs font-mono font-bold ${
                                isLight ? "bg-white border-indigo-200 text-indigo-950 shadow-xs" : "bg-black/70 border-indigo-500/30 text-indigo-300"
                              }`}>
                                {getIdeaHashtags(idea)}
                              </div>
                            </div>

                            {/* Trending Tags & Suggestions */}
                            <div className="space-y-1">
                              <div className={`flex items-center justify-between text-xs font-black ${
                                isLight ? "text-emerald-950" : "text-emerald-300"
                              }`}>
                                <span>🔥 Trending Tags & Growth</span>
                                <button
                                  onClick={() => handleCopy(getIdeaTrendingTags(idea), `${idea.id}-trending-tags`)}
                                  className={`flex items-center gap-1 text-[11px] font-black transition-colors cursor-pointer px-2 py-0.5 rounded border shadow-xs ${
                                    isLight ? "bg-emerald-100 text-emerald-950 border-emerald-300 hover:bg-emerald-200" : "bg-emerald-950/60 text-emerald-400 border-emerald-500/30 hover:text-white"
                                  }`}
                                >
                                  {copiedId === `${idea.id}-trending-tags` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-emerald-500" />}
                                  Copy Trending Tags
                                </button>
                              </div>
                              <div dir="ltr" className={`p-2.5 rounded-xl border text-xs font-mono font-bold ${
                                isLight ? "bg-white border-emerald-200 text-emerald-950 shadow-xs" : "bg-black/70 border-emerald-500/30 text-emerald-300"
                              }`}>
                                {getIdeaTrendingTags(idea)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`flex items-center justify-center gap-3 pt-4 border-t ${
              isLight ? "border-slate-300" : "border-slate-800/80"
            }`}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 disabled:opacity-40 ${
                  isLight ? "bg-white hover:bg-slate-100 border-slate-300 text-slate-900 shadow-xs" : "bg-slate-900 border-slate-700 text-slate-200 hover:text-white"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <span className={`text-xs font-black px-2 ${isLight ? "text-slate-700" : "text-slate-400"}`}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 disabled:opacity-40 ${
                  isLight ? "bg-white hover:bg-slate-100 border-slate-300 text-slate-900 shadow-xs" : "bg-slate-900 border-slate-700 text-slate-200 hover:text-white"
                }`}
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
                dir={editedScriptText && /[\u0600-\u06FF]/.test(editedScriptText) ? "rtl" : "auto"}
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

      {/* 🚀 Floating Fixed Action Toolbar (Left-Center Screen) */}
      <div className="hidden sm:flex fixed left-4 top-1/2 -translate-y-1/2 z-[99999] flex-col gap-2 sm:gap-3 items-start select-none">
        
        {/* 0. Generate Script Floating Button (Red) */}
        <div className="relative group">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`p-2.5 sm:p-3.5 rounded-2xl bg-red-600/90 hover:bg-red-500 border border-red-400/50 text-white shadow-xl shadow-red-950/80 backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer ring-2 ring-red-500/30 ${
              isGenerating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Generate Script"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-100 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-red-100" />
            )}
          </button>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/95 border border-red-500/40 text-xs font-bold text-red-200 whitespace-nowrap shadow-2xl backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>Generate Script</span>
          </div>
        </div>

        {/* 1. Copy Mobile Prompt Floating Button */}
        {savedIdeas.length > 0 && (
          <div className="relative group">
            <button
              type="button"
              onClick={handleCopyTopPrompt}
              className="p-2.5 sm:p-3.5 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 border border-indigo-400/50 text-white shadow-xl shadow-indigo-950/80 backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer ring-2 ring-indigo-500/30"
              title="Copy Mobile Prompt (9:16)"
            >
              {copiedId?.startsWith("floating-prompt") ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300 animate-bounce" />
              ) : (
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-100" />
              )}
            </button>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/95 border border-indigo-500/40 text-xs font-bold text-indigo-200 whitespace-nowrap shadow-2xl backdrop-blur-md">
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Copy Mobile Prompt (9:16)</span>
            </div>
          </div>
        )}

        {/* 2. Copy Generated Script Floating Button */}
        {savedIdeas.length > 0 && (
          <div className="relative group">
            <button
              type="button"
              onClick={handleCopyTopScript}
              className="p-2.5 sm:p-3.5 rounded-2xl bg-purple-600/90 hover:bg-purple-500 border border-purple-400/50 text-white shadow-xl shadow-purple-950/80 backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer ring-2 ring-purple-500/30"
              title="Copy Generated Script"
            >
              {copiedId?.startsWith("floating-script") ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300 animate-bounce" />
              ) : (
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-100" />
              )}
            </button>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/95 border border-purple-500/40 text-xs font-bold text-purple-200 whitespace-nowrap shadow-2xl backdrop-blur-md">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Copy Generated Script</span>
            </div>
          </div>
        )}

        {/* 3. Go to Top Floating Button */}
        <div className="relative group">
          <button
            type="button"
            onClick={handleScrollToTop}
            className={`p-2.5 sm:p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white shadow-xl shadow-slate-950/90 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer ring-2 ring-slate-700/50 ${
              showScrollTop ? "opacity-100 scale-100" : "opacity-75 hover:opacity-100"
            }`}
            title="Go to Top"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/95 border border-slate-700 text-xs font-bold text-slate-200 whitespace-nowrap shadow-2xl backdrop-blur-md">
            <ArrowUp className="w-3.5 h-3.5 text-slate-400" />
            <span>Go to Top</span>
          </div>
        </div>
      </div>

      {/* Character Library Modal */}
      {showCharacterLibrary && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className={`rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border transition-all ${
            isLight
              ? "bg-white border-2 border-slate-300 text-slate-900 shadow-slate-400/20"
              : "bg-slate-900 border border-slate-800 text-white shadow-black/80"
          }`}>
            <div className={`p-4 border-b flex justify-between items-center ${
              isLight ? "bg-slate-100/90 border-slate-200" : "bg-black/40 border-white/5"
            }`}>
              <h3 className={`text-lg font-black flex items-center gap-2 ${
                isLight ? "text-slate-900" : "text-white"
              }`}>
                🖼️ Character Library
                {savedCharacters.length > 0 && (
                  <span className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    ({savedCharacters.length} saved)
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fetchCharacterLibrary(true)}
                  className={`text-xs flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    isLight
                      ? "text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 border border-indigo-200"
                      : "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 border border-indigo-500/20"
                  }`}
                  title="Reload library"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Refresh
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCharacterLibrary(false)} 
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    isLight ? "text-slate-500 hover:text-slate-900 hover:bg-slate-200" : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
              {isLoadingLibrary ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  <span className={`text-xs font-bold ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    Loading character library...
                  </span>
                </div>
              ) : savedCharacters.length === 0 ? (
                <div className="text-center py-16">
                  <p className={`font-bold ${isLight ? "text-slate-700" : "text-slate-400"}`}>No characters saved yet.</p>
                  <p className={`text-xs mt-2 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                    Upload an image in the generator to save your first character!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {savedCharacters.map((char) => (
                    <div 
                      key={char.id} 
                      className={`group relative rounded-xl border transition-all overflow-hidden flex flex-col ${
                        isLight
                          ? "bg-slate-50 border-slate-200 hover:border-indigo-500 hover:shadow-md"
                          : "bg-black/40 border-white/10 hover:border-indigo-500/60"
                      }`}
                    >
                      <div className="aspect-square overflow-hidden relative bg-slate-800">
                        <img
                          src={char.imageUrl}
                          alt={char.name || "Character"}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCharacterFromLibrary(e, char.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 hover:scale-105 transition-all shadow-md cursor-pointer opacity-90 sm:opacity-0 group-hover:opacity-100"
                          title="Delete character"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className={`p-2.5 flex items-center justify-between gap-1 border-t ${
                        isLight ? "bg-white border-slate-200" : "bg-slate-900/90 border-white/5"
                      }`}>
                        <p className={`text-xs font-black truncate ${
                          isLight ? "text-slate-900" : "text-white"
                        }`}>
                          {char.name || "Character"}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSelectCharacterFromLibrary(char)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black transition-colors active:scale-95 cursor-pointer shrink-0"
                        >
                          Use ➔
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
