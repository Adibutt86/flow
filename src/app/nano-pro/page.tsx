"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Image as ImageIcon, Copy, RefreshCw, RotateCcw, Clock, Library, X, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { FB_POST_QUOTES } from "@/lib/data/fb-quotes";
import { SHAYARI_QUOTES } from "@/lib/data/shayari-quotes";

const VISUAL_STYLES: { value: string; label: string; desc: string; tag?: string }[] = [
  // ─── Realistic / Cinematic ───
  { value: "Photorealistic 8K Cinematic", label: "Photorealistic 8K Cinematic", desc: "Film-quality depth, bokeh, cinematic lighting — perfect for romantic & emotional Shayari scenes", tag: "⭐ Best for Poetry" },
  { value: "Hyper-Realistic CGI", label: "Hyper-Realistic CGI", desc: "Near-photorealistic with extra visual punch — great for moonlit palaces & Mughal courtyards", tag: "🏆 Top Pick" },
  { value: "Realistic ASMR Commercial", label: "Realistic ASMR Commercial", desc: "Ultra-clean, polished look ideal for product unboxing & ASMR sensory content" },
  // ─── 3D Animation ───
  { value: "3D Pixar Animation", label: "3D Pixar Animation", desc: "Warm lighting, expressive faces & Pixar skin shaders — ideal for emotional storytelling & Poet+Listener duos", tag: "💡 Highly Recommended" },
  { value: "3D Disney Animation", label: "3D Disney Animation", desc: "Classic Disney magic with rich colors & princely aesthetics — perfect for fairy-tale narratives" },
  { value: "3D Cartoon Style", label: "3D Cartoon Style", desc: "Fun, vibrant 3D characters with exaggerated expressions — great for comedy & kids' content" },
  { value: "Claymation 3D", label: "Claymation 3D", desc: "Handcrafted clay-like textures with quirky charm — unique look for funny or whimsical stories" },
  // ─── Anime ───
  { value: "Studio Ghibli Anime", label: "Studio Ghibli Anime", desc: "Dreamy, painterly — moonlit lakes, autumn forests, snow cabins. Emotionally resonant for Shayari", tag: "🌸 Romantic Mood" },
  { value: "Anime (Shonen / Modern)", label: "Anime (Shonen / Modern)", desc: "Dynamic action lines, vivid colors & intense expressions — great for adventure & drama" },
  { value: "Chibi Anime Style", label: "Chibi Anime Style", desc: "Tiny adorable characters with oversized heads — best for cute, lighthearted & funny clips" },
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

const CHARACTER_TYPE_GROUPS = [
  {
    "category": "Basic / General",
    "options": [
      {
        "value": "Girl",
        "label": "Girl"
      },
      {
        "value": "Boy",
        "label": "Boy"
      },
      {
        "value": "Female (Adult)",
        "label": "Female (Adult)"
      },
      {
        "value": "Male (Adult)",
        "label": "Male (Adult)"
      },
      {
        "value": "Elderly Woman",
        "label": "Elderly Woman"
      },
      {
        "value": "Elderly Man",
        "label": "Elderly Man"
      },
      {
        "value": "Dancing Cat",
        "label": "Dancing Cat"
      },
      {
        "value": "Cute Dog",
        "label": "Cute Dog"
      },
      {
        "value": "Robot",
        "label": "Robot"
      },
      {
        "value": "Alien",
        "label": "Alien"
      }
    ]
  },
  {
    "category": "Girl Characters",
    "options": [
      {
        "value": "One Cute Little Girl",
        "label": "One Cute Little Girl"
      },
      {
        "value": "Dulhan Girl / Desi Bride",
        "label": "Dulhan Girl / Desi Bride (دلہن)"
      },
      {
        "value": "Mehndi / Mayun Bride Girl",
        "label": "Mehndi / Mayun Bride Girl"
      },
      {
        "value": "Cute Hijabi Little Girl",
        "label": "Cute Hijabi Little Girl"
      },
      {
        "value": "Little Girl in Traditional Shalwar Kameez",
        "label": "Little Girl in Shalwar Kameez"
      },
      {
        "value": "Little Girl in Phulkari Dupatta",
        "label": "Little Girl in Phulkari Dupatta"
      },
      {
        "value": "Little Girl in Dupatta & Bangles",
        "label": "Little Girl in Dupatta & Bangles"
      },
      {
        "value": "Little Girl with Mehndi / Henna",
        "label": "Little Girl with Mehndi / Henna"
      },
      {
        "value": "Little Girl Jumping Rope",
        "label": "Little Girl Jumping Rope"
      },
      {
        "value": "Little Girl Feeding Birds",
        "label": "Little Girl Feeding Birds"
      },
      {
        "value": "Little Girl Playing Hopscotch",
        "label": "Little Girl Playing Hopscotch"
      },
      {
        "value": "Little Girl Tea Party Host",
        "label": "Little Girl Tea Party Host"
      },
      {
        "value": "Little Girl on Tree Swing",
        "label": "Little Girl on Tree Swing"
      },
      {
        "value": "Smiling Little Girl",
        "label": "Smiling Little Girl"
      },
      {
        "value": "Happy Little Girl",
        "label": "Happy Little Girl"
      },
      {
        "value": "Curious Little Girl",
        "label": "Curious Little Girl"
      },
      {
        "value": "Shy Little Girl",
        "label": "Shy Little Girl"
      },
      {
        "value": "Playful Little Girl",
        "label": "Playful Little Girl"
      },
      {
        "value": "Energetic Little Girl",
        "label": "Energetic Little Girl"
      },
      {
        "value": "Laughing Little Girl",
        "label": "Laughing Little Girl"
      },
      {
        "value": "Cheerful Village Girl",
        "label": "Cheerful Village Girl"
      },
      {
        "value": "Little Girl Riding a Bicycle",
        "label": "Little Girl Riding a Bicycle"
      },
      {
        "value": "Little Girl with a Kitten",
        "label": "Little Girl with a Kitten"
      },
      {
        "value": "Little Girl with a Puppy",
        "label": "Little Girl with a Puppy"
      },
      {
        "value": "Little Girl Superhero",
        "label": "Little Girl Superhero"
      },
      {
        "value": "Little Girl Astronaut",
        "label": "Little Girl Astronaut"
      },
      {
        "value": "Little Girl Doctor",
        "label": "Little Girl Doctor"
      },
      {
        "value": "Cute Twin Girls",
        "label": "Cute Twin Girls"
      },
      {
        "value": "Little Girl with Fairy Wings",
        "label": "Little Girl with Fairy Wings"
      },
      {
        "value": "Sleeping Little Girl",
        "label": "Sleeping Little Girl"
      },
      {
        "value": "Reading Little Girl",
        "label": "Reading Little Girl"
      },
      {
        "value": "Drawing Little Girl",
        "label": "Drawing Little Girl"
      },
      {
        "value": "Singing Little Girl",
        "label": "Singing Little Girl"
      },
      {
        "value": "Dancing Little Girl",
        "label": "Dancing Little Girl"
      },
      {
        "value": "Little Girl with Glasses",
        "label": "Little Girl with Glasses"
      },
      {
        "value": "Little Girl with Curly Hair",
        "label": "Little Girl with Curly Hair"
      },
      {
        "value": "Little Girl with Ponytail",
        "label": "Little Girl with Ponytail"
      },
      {
        "value": "Little Girl with Braids",
        "label": "Little Girl with Braids"
      },
      {
        "value": "Little Girl in School Uniform",
        "label": "Little Girl in School Uniform"
      },
      {
        "value": "Little Girl in Princess Dress",
        "label": "Little Girl in Princess Dress"
      },
      {
        "value": "Little Girl in Sports Outfit",
        "label": "Little Girl in Sports Outfit"
      },
      {
        "value": "Little Girl in Raincoat",
        "label": "Little Girl in Raincoat"
      },
      {
        "value": "Little Girl in Winter Clothes",
        "label": "Little Girl in Winter Clothes"
      },
      {
        "value": "Little Girl in Pajamas",
        "label": "Little Girl in Pajamas"
      },
      {
        "value": "Little Girl Wearing a Backpack",
        "label": "Little Girl Wearing a Backpack"
      },
      {
        "value": "Little Girl Holding a Toy",
        "label": "Little Girl Holding a Toy"
      },
      {
        "value": "Little Girl Holding a Balloon",
        "label": "Little Girl Holding a Balloon"
      },
      {
        "value": "Little Girl Holding a Teddy Bear",
        "label": "Little Girl Holding a Teddy Bear"
      },
      {
        "value": "Little Girl Eating Fruit",
        "label": "Little Girl Eating Fruit"
      },
      {
        "value": "Little Girl Brushing Teeth",
        "label": "Little Girl Brushing Teeth"
      },
      {
        "value": "Toddler Girl",
        "label": "Toddler Girl"
      },
      {
        "value": "Preschool Girl",
        "label": "Preschool Girl"
      },
      {
        "value": "Kindergarten Girl",
        "label": "Kindergarten Girl"
      },
      {
        "value": "School-Age Girl",
        "label": "School-Age Girl"
      },
      {
        "value": "Confident Little Girl",
        "label": "Confident Little Girl"
      },
      {
        "value": "Adventurous Little Girl",
        "label": "Adventurous Little Girl"
      },
      {
        "value": "Thoughtful Little Girl",
        "label": "Thoughtful Little Girl"
      },
      {
        "value": "Funny Little Girl",
        "label": "Funny Little Girl"
      },
      {
        "value": "Creative Little Girl",
        "label": "Creative Little Girl"
      },
      {
        "value": "Little Girl Scientist",
        "label": "Little Girl Scientist"
      },
      {
        "value": "Little Girl Chef",
        "label": "Little Girl Chef"
      },
      {
        "value": "Little Girl Artist",
        "label": "Little Girl Artist"
      },
      {
        "value": "Little Girl Explorer",
        "label": "Little Girl Explorer"
      },
      {
        "value": "Little Girl Gardener",
        "label": "Little Girl Gardener"
      },
      {
        "value": "Little Girl Musician",
        "label": "Little Girl Musician"
      }
    ]
  },
  {
    "category": "Boy Characters",
    "options": [
      {
        "value": "One Cute Little Boy",
        "label": "One Cute Little Boy"
      },
      {
        "value": "Dulha Boy / Desi Groom",
        "label": "Dulha Boy / Desi Groom (دولہا)"
      },
      {
        "value": "Little Boy in Traditional Kurta Pajama",
        "label": "Little Boy in Kurta Pajama"
      },
      {
        "value": "Little Boy in Kurta & Waistcoat",
        "label": "Little Boy in Kurta & Waistcoat"
      },
      {
        "value": "Little Boy in Punjabi Pagri / Turban",
        "label": "Little Boy in Punjabi Turban"
      },
      {
        "value": "Little Boy with Cricket Bat",
        "label": "Little Boy with Cricket Bat"
      },
      {
        "value": "Little Boy Flying a Kite",
        "label": "Little Boy Flying a Kite"
      },
      {
        "value": "Little Boy Eating Jalebi / Sweet",
        "label": "Little Boy Eating Jalebi"
      },
      {
        "value": "Little Boy Riding a Tricycle",
        "label": "Little Boy Riding a Tricycle"
      },
      {
        "value": "Little Boy Builder with Blocks",
        "label": "Little Boy Builder with Blocks"
      },
      {
        "value": "Little Boy Playing Tabla / Harmonium",
        "label": "Little Boy Playing Tabla"
      },
      {
        "value": "Little Boy with Toy Car / Truck",
        "label": "Little Boy with Toy Car"
      },
      {
        "value": "Little Boy Riding a Scooter",
        "label": "Little Boy Riding a Scooter"
      },
      {
        "value": "Little Boy with a Puppy",
        "label": "Little Boy with a Puppy"
      },
      {
        "value": "Little Boy with a Kitten",
        "label": "Little Boy with a Kitten"
      },
      {
        "value": "Little Boy Soccer Player",
        "label": "Little Boy Soccer Player"
      },
      {
        "value": "Little Boy Pilot / Aviator",
        "label": "Little Boy Pilot"
      },
      {
        "value": "Little Boy Astronaut",
        "label": "Little Boy Astronaut"
      },
      {
        "value": "Little Boy Detective",
        "label": "Little Boy Detective"
      },
      {
        "value": "Little Boy Firefighter",
        "label": "Little Boy Firefighter"
      },
      {
        "value": "Little Boy Dinosaur Fan",
        "label": "Little Boy Dinosaur Fan"
      },
      {
        "value": "Cute Twin Boys",
        "label": "Cute Twin Boys"
      },
      {
        "value": "Little Boy Village Hero",
        "label": "Little Boy Village Hero"
      },
      {
        "value": "Smiling Little Boy",
        "label": "Smiling Little Boy"
      },
      {
        "value": "Happy Little Boy",
        "label": "Happy Little Boy"
      },
      {
        "value": "Curious Little Boy",
        "label": "Curious Little Boy"
      },
      {
        "value": "Shy Little Boy",
        "label": "Shy Little Boy"
      },
      {
        "value": "Playful Little Boy",
        "label": "Playful Little Boy"
      },
      {
        "value": "Energetic Little Boy",
        "label": "Energetic Little Boy"
      },
      {
        "value": "Laughing Little Boy",
        "label": "Laughing Little Boy"
      },
      {
        "value": "Sleeping Little Boy",
        "label": "Sleeping Little Boy"
      },
      {
        "value": "Reading Little Boy",
        "label": "Reading Little Boy"
      },
      {
        "value": "Drawing Little Boy",
        "label": "Drawing Little Boy"
      },
      {
        "value": "Singing Little Boy",
        "label": "Singing Little Boy"
      },
      {
        "value": "Dancing Little Boy",
        "label": "Dancing Little Boy"
      },
      {
        "value": "Little Boy with Glasses",
        "label": "Little Boy with Glasses"
      },
      {
        "value": "Little Boy with Curly Hair",
        "label": "Little Boy with Curly Hair"
      },
      {
        "value": "Little Boy with Spiky Hair",
        "label": "Little Boy with Spiky Hair"
      },
      {
        "value": "Little Boy in School Uniform",
        "label": "Little Boy in School Uniform"
      },
      {
        "value": "Little Boy in Superhero Costume",
        "label": "Little Boy in Superhero Costume"
      },
      {
        "value": "Little Boy in Sports Outfit",
        "label": "Little Boy in Sports Outfit"
      },
      {
        "value": "Little Boy in Raincoat",
        "label": "Little Boy in Raincoat"
      },
      {
        "value": "Little Boy in Winter Clothes",
        "label": "Little Boy in Winter Clothes"
      },
      {
        "value": "Little Boy in Pajamas",
        "label": "Little Boy in Pajamas"
      },
      {
        "value": "Little Boy Wearing a Backpack",
        "label": "Little Boy Wearing a Backpack"
      },
      {
        "value": "Little Boy Holding a Toy",
        "label": "Little Boy Holding a Toy"
      },
      {
        "value": "Little Boy Holding a Balloon",
        "label": "Little Boy Holding a Balloon"
      },
      {
        "value": "Little Boy Holding a Teddy Bear",
        "label": "Little Boy Holding a Teddy Bear"
      },
      {
        "value": "Little Boy Eating Fruit",
        "label": "Little Boy Eating Fruit"
      },
      {
        "value": "Little Boy Brushing Teeth",
        "label": "Little Boy Brushing Teeth"
      },
      {
        "value": "Toddler Boy",
        "label": "Toddler Boy"
      },
      {
        "value": "Preschool Boy",
        "label": "Preschool Boy"
      },
      {
        "value": "Kindergarten Boy",
        "label": "Kindergarten Boy"
      },
      {
        "value": "School-Age Boy",
        "label": "School-Age Boy"
      },
      {
        "value": "Confident Little Boy",
        "label": "Confident Little Boy"
      },
      {
        "value": "Adventurous Little Boy",
        "label": "Adventurous Little Boy"
      },
      {
        "value": "Thoughtful Little Boy",
        "label": "Thoughtful Little Boy"
      },
      {
        "value": "Funny Little Boy",
        "label": "Funny Little Boy"
      },
      {
        "value": "Creative Little Boy",
        "label": "Creative Little Boy"
      },
      {
        "value": "Little Boy Scientist",
        "label": "Little Boy Scientist"
      },
      {
        "value": "Little Boy Chef",
        "label": "Little Boy Chef"
      },
      {
        "value": "Little Boy Artist",
        "label": "Little Boy Artist"
      },
      {
        "value": "Little Boy Explorer",
        "label": "Little Boy Explorer"
      },
      {
        "value": "Little Boy Gardener",
        "label": "Little Boy Gardener"
      },
      {
        "value": "Little Boy Musician",
        "label": "Little Boy Musician"
      }
    ]
  },
  {
    "category": "Dulha & Dulhan (Married Couple / Wedding)",
    "options": [
      {
        "value": "Dulha & Dulhan (Bride & Groom Couple)",
        "label": "Dulha & Dulhan (Bride & Groom Couple) 👰‍♀️🤵‍♂️"
      },
      {
        "value": "Husband & Wife (Miya Biwi)",
        "label": "Husband & Wife (Miya Biwi) ❤️"
      },
      {
        "value": "Barat Bride & Groom (Red & Gold)",
        "label": "Barat Couple (Red Lehenga & Gold Sherwani)"
      },
      {
        "value": "Walima Married Couple (Pastel Aesthetic)",
        "label": "Walima Couple (Pastel & Suit/Sherwani)"
      },
      {
        "value": "Mayun / Mehndi Couple (Yellow Outfits)",
        "label": "Mehndi Couple (Yellow Outfits & Flower Garlands)"
      },
      {
        "value": "Nikkah Married Couple (White & Gold)",
        "label": "Nikkah Couple (White & Gold Attire)"
      },
      {
        "value": "Desi Village Married Couple (Pind Style)",
        "label": "Desi Village Married Couple (Pind Style)"
      }
    ]
  },
  {
    "category": "Girls with Friends & Family",
    "options": [
      {
        "value": "Two Girl Friends (Best Friends)",
        "label": "Two Girl Friends (Best Friends)"
      },
      {
        "value": "Three Girl Friends (Trio Squad)",
        "label": "Three Girl Friends (Trio Squad)"
      },
      {
        "value": "Group of Girl Friends (Girls Squad)",
        "label": "Group of Girl Friends (Girls Squad)"
      },
      {
        "value": "Girl & Mother (Mommy & Me)",
        "label": "Girl & Mother (Mommy & Me)"
      },
      {
        "value": "Girl & Father (Daddy's Princess)",
        "label": "Girl & Father (Daddy's Girl)"
      },
      {
        "value": "Girl & Grandmother (Dadi / Nani)",
        "label": "Girl & Grandmother (Dadi / Nani)"
      },
      {
        "value": "Girl & Grandfather (Dada / Nana)",
        "label": "Girl & Grandfather (Dada / Nana)"
      },
      {
        "value": "Girl & Sister (Sisters Duo)",
        "label": "Girl & Sister (Sisters Duo)"
      },
      {
        "value": "Girl & Cousin (Female Cousins)",
        "label": "Girl & Cousin (Female Cousins)"
      },
      {
        "value": "Girl & Aunt (Khala / Phuppo)",
        "label": "Girl & Aunt (Khala / Phuppo)"
      },
      {
        "value": "Girl & Whole Family",
        "label": "Girl & Whole Family"
      }
    ]
  },
  {
    "category": "Boys with Friends",
    "options": [
      {
        "value": "Two Boy Friends (Best Friends)",
        "label": "Two Boy Friends (Best Friends)"
      },
      {
        "value": "Three Boy Friends (Trio Squad)",
        "label": "Three Boy Friends (Trio Squad)"
      },
      {
        "value": "Group of Boy Friends (Boys Squad)",
        "label": "Group of Boy Friends (Boys Squad)"
      },
      {
        "value": "Boy & Cousin (Male Cousins)",
        "label": "Boy & Cousin (Male Cousins)"
      },
      {
        "value": "Boy & Older Brother",
        "label": "Boy & Older Brother"
      },
      {
        "value": "Boy & Younger Brother",
        "label": "Boy & Younger Brother"
      },
      {
        "value": "Boy Football / Cricket Squad",
        "label": "Boy Cricket / Football Squad"
      },
      {
        "value": "Boy Video Game Buddies",
        "label": "Boy Video Game Buddies"
      }
    ]
  },
  {
    "category": "Multiple & Duo Characters",
    "options": [
      {
        "value": "Two Little Girls",
        "label": "Two Little Girls"
      },
      {
        "value": "Two Little Boys",
        "label": "Two Little Boys"
      },
      {
        "value": "One Girl & One Boy",
        "label": "One Girl & One Boy"
      },
      {
        "value": "Brother & Sister",
        "label": "Brother & Sister"
      },
      {
        "value": "Two Kids (Siblings)",
        "label": "Two Kids (Siblings)"
      },
      {
        "value": "Two Kids (Friends)",
        "label": "Two Kids (Friends)"
      },
      {
        "value": "Two Boys & One Girl",
        "label": "Two Boys & One Girl"
      },
      {
        "value": "Two Girls & One Boy",
        "label": "Two Girls & One Boy"
      },
      {
        "value": "Classmates",
        "label": "Classmates"
      },
      {
        "value": "Twins",
        "label": "Twins"
      },
      {
        "value": "Three Happy Kids",
        "label": "Three Happy Kids"
      },
      {
        "value": "Best Friends",
        "label": "Best Friends"
      },
      {
        "value": "Happy Family",
        "label": "Happy Family"
      },
      {
        "value": "Child & Mom",
        "label": "Child & Mom"
      },
      {
        "value": "Child & Dad",
        "label": "Child & Dad"
      },
      {
        "value": "Child & Shopkeeper",
        "label": "Child & Shopkeeper"
      },
      {
        "value": "Boy + Shopkeeper",
        "label": "Boy + Shopkeeper"
      },
      {
        "value": "Girl + Shopkeeper",
        "label": "Girl + Shopkeeper"
      },
      {
        "value": "Child & Doctor",
        "label": "Child & Doctor"
      },
      {
        "value": "Child & Teacher",
        "label": "Child & Teacher"
      },
      {
        "value": "Child & Friendly Robot",
        "label": "Child & Friendly Robot"
      }
    ]
  },
  {
    "category": "Predefined Role & Adult Combinations",
    "options": [
      {
        "value": "Boy + Mother",
        "label": "Boy + Mother"
      },
      {
        "value": "Girl + Mother",
        "label": "Girl + Mother"
      },
      {
        "value": "Boy + Father",
        "label": "Boy + Father"
      },
      {
        "value": "Girl + Father",
        "label": "Girl + Father"
      },
      {
        "value": "Boy + Teacher",
        "label": "Boy + Teacher"
      },
      {
        "value": "Girl + Teacher",
        "label": "Girl + Teacher"
      },
      {
        "value": "Boy + Police Officer",
        "label": "Boy + Police Officer"
      },
      {
        "value": "Girl + Police Officer",
        "label": "Girl + Police Officer"
      },
      {
        "value": "Boy + Doctor",
        "label": "Boy + Doctor"
      },
      {
        "value": "Girl + Doctor",
        "label": "Girl + Doctor"
      },
      {
        "value": "Boy + Robot",
        "label": "Boy + Robot"
      },
      {
        "value": "Girl + Robot",
        "label": "Girl + Robot"
      },
      {
        "value": "Boy + Friend",
        "label": "Boy + Friend"
      },
      {
        "value": "Girl + Friend",
        "label": "Girl + Friend"
      }
    ]
  },
  {
    "category": "Community Heroes & Career Roles",
    "options": [
      {
        "value": "Child & Pediatrician Doctor",
        "label": "Child & Pediatrician Doctor 🏥"
      },
      {
        "value": "Child & Friendly Dentist",
        "label": "Child & Friendly Dentist 🪥"
      },
      {
        "value": "Child & Pharmacist",
        "label": "Child & Pharmacist 💊"
      },
      {
        "value": "Child & Veterinarian (Pet Doctor)",
        "label": "Child & Veterinarian 🐾"
      },
      {
        "value": "Boy + Firefighter",
        "label": "Boy + Firefighter 🚒"
      },
      {
        "value": "Girl + Firefighter",
        "label": "Girl + Firefighter 🚒"
      },
      {
        "value": "Child & Mail Carrier / Postman",
        "label": "Child & Mail Carrier / Postman 📮"
      },
      {
        "value": "Child & Friendly Baker",
        "label": "Child & Friendly Baker 🥐"
      },
      {
        "value": "Child & Pilot / Flight Captain",
        "label": "Child & Pilot / Flight Captain ✈️"
      },
      {
        "value": "Child & Train Driver / Conductor",
        "label": "Child & Train Driver 🚉"
      }
    ]
  },
  {
    "category": "Singers, Qawwals & Musical Performers",
    "options": [
      {
        "value": "Boy & Girl Singer Duet",
        "label": "Boy & Girl Singer Duet"
      },
      {
        "value": "Brother & Sister Singer Duet",
        "label": "Brother & Sister Singer Duet"
      },
      {
        "value": "Boy & Girl Qawwal Duo",
        "label": "Boy & Girl Qawwal Duo"
      },
      {
        "value": "Boy & Girl Shayar Duo",
        "label": "Boy & Girl Shayar Duo"
      },
      {
        "value": "Boy & Girl Folk Singers",
        "label": "Boy & Girl Folk Singers"
      },
      {
        "value": "Child Folk Singer (Desi Folk)",
        "label": "Child Folk Singer (Desi Folk)"
      },
      {
        "value": "Punjabi Folk Singer (Jugni & Tappa)",
        "label": "Punjabi Folk Singer (Jugni & Tappa)"
      },
      {
        "value": "Sindhi / Balochi Folk Singer",
        "label": "Sindhi / Balochi Folk Singer"
      },
      {
        "value": "Pashtun Folk Singer (with Rubab)",
        "label": "Pashtun Folk Singer (with Rubab)"
      },
      {
        "value": "Rajasthani Folk Singer",
        "label": "Rajasthani Folk Singer"
      },
      {
        "value": "Boy Qawwal (Lead Singer)",
        "label": "Boy Qawwal (Lead Singer)"
      },
      {
        "value": "Girl Qawwal (Lead Singer)",
        "label": "Girl Qawwal (Lead Singer)"
      },
      {
        "value": "Boy Qawwali Group (Qawwal Party)",
        "label": "Boy Qawwali Group (Qawwal Party)"
      },
      {
        "value": "Child Qawwal & Harmonium Player",
        "label": "Child Qawwal & Harmonium Player"
      },
      {
        "value": "Child Singer (Kid Vocalist)",
        "label": "Child Singer (Kid Vocalist)"
      },
      {
        "value": "Boy Singer & Performer",
        "label": "Boy Singer & Performer"
      },
      {
        "value": "Girl Singer & Performer",
        "label": "Girl Singer & Performer"
      },
      {
        "value": "Child & Professional Singer",
        "label": "Child & Professional Singer"
      },
      {
        "value": "Child & Singer Duo",
        "label": "Child & Singer Duo"
      },
      {
        "value": "Child Naat Khawan / Nasheed Singer",
        "label": "Child Naat Khawan / Nasheed Singer"
      },
      {
        "value": "Child Shayar (Poet) & Singer Duo",
        "label": "Child Shayar (Poet) & Singer Duo"
      },
      {
        "value": "Kids Musical Band",
        "label": "Kids Musical Band"
      },
      {
        "value": "Street Singer Kid",
        "label": "Street Singer Kid"
      },
      {
        "value": "Child Classical Singer",
        "label": "Child Classical Singer"
      }
    ]
  },
  {
    "category": "Adult Performers & Duet Combos",
    "options": [
      {
        "value": "Man & Girl Combo (Duet Performers) 👫",
        "label": "Man & Girl Combo (Duet Performers) 👫"
      },
      {
        "value": "Man Shayar & Girl Shayara Duo 🎤",
        "label": "Man Shayar & Girl Shayara Duo 🎤"
      },
      {
        "value": "Man Singer & Girl Lead Vocalist Duet 👩‍🎤👨‍🎤",
        "label": "Man Singer & Girl Lead Vocalist 👩‍🎤👨‍🎤"
      },
      {
        "value": "Man Guitarist & Girl Lead Vocalist 🎸👩‍🎤",
        "label": "Man Guitarist & Girl Lead Vocalist 🎸👩‍🎤"
      },
      {
        "value": "Funny Comedic Shayar (Tanzo Mazah Poet) 😂",
        "label": "Funny Comedic Shayar (طنزیہ شاعر) 😂"
      },
      {
        "value": "Solo Adult Female Singer 👩‍🎤",
        "label": "Solo Adult Female Singer 👩‍🎤"
      },
      {
        "value": "Solo Adult Male Shayar 👨‍🎤",
        "label": "Solo Adult Male Shayar 👨‍🎤"
      },
      {
        "value": "Romantic Couple (Miya Biwi)",
        "label": "Romantic Couple (Miya Biwi)"
      },
      {
        "value": "Dulha & Dulhan (Bride & Groom)",
        "label": "Dulha & Dulhan (Bride & Groom)"
      },
      {
        "value": "Qawwali Group (Qawwal Party)",
        "label": "Qawwali Group (Qawwal Party)"
      },
      {
        "value": "Two Male Friends Jamming",
        "label": "Two Male Friends Jamming"
      }
    ]
  },
  {
    "category": "🎤 Shayar & Listener — Poetry Duos",
    "options": [
      {
        "value": "Male Poet Recites + Girl Listens & Admires 🎤👁️",
        "label": "Male Poet Recites + Girl Listens & Admires 🎤👁️"
      },
      {
        "value": "Female Poet Recites + Man Listens & Admires 🎤🧔",
        "label": "Female Poet Recites + Man Listens & Admires 🎤🧔"
      }
    ]
  },
  {
    "category": "👶 Baby Character Setup",
    "options": [
      {
        "value": "One Cute 3D Baby/Toddler in Fruit Suit",
        "label": "👶 Single Cute Toddler (Most Viral)"
      },
      {
        "value": "Twin Babies in Matching Fruit Suits",
        "label": "👯 Twin Babies (Matching Suits)"
      },
      {
        "value": "Two Toddlers in Different Fruit Suits",
        "label": "🍉🥝 Two Toddlers (Different Fruits)"
      },
      {
        "value": "Baby Girl in Fruit Suit",
        "label": "👧 Baby Girl in Fruit Suit"
      },
      {
        "value": "Baby Boy in Fruit Suit",
        "label": "👦 Baby Boy in Fruit Suit"
      },
      {
        "value": "Baby & Toddler Siblings in Fruit Suits",
        "label": "🍓🍌 Baby & Toddler Siblings"
      },
      {
        "value": "Group of 3-4 Toddlers in Fruit Suits (Party)",
        "label": "🎉 Group Party (3-4 Toddlers)"
      }
    ]
  },
  {
    "category": "🐾 Animal & Species Setup",
    "options": [
      {
        "value": "5 Cute Kittens Line Dance (Strawberry, Bee, Cowboy, Dino, Pirate)",
        "label": "🐱 5 Kittens Line Dance (Cat.mp4 Iconic Squad)"
      },
      {
        "value": "Solo White Kitten in Strawberry Outfit",
        "label": "🍓 Solo White Kitten in Strawberry Hood & Crocs"
      },
      {
        "value": "Solo Golden Retriever Puppy",
        "label": "🐶 Solo Golden Retriever Puppy"
      },
      {
        "value": "Kitten & Puppy Duet Dance",
        "label": "🐱🐶 Kitten & Puppy Duet Squad"
      },
      {
        "value": "Ginger Tabby Kitten Solo",
        "label": "🐈 Ginger Tabby Kitten Solo"
      },
      {
        "value": "Baby Panda Bear Solo",
        "label": "🐼 Baby Panda Bear Solo"
      },
      {
        "value": "Fluffy Bunny Rabbit Squad",
        "label": "🐰 Fluffy Bunny Rabbit Squad"
      },
      {
        "value": "French Bulldog Puppy",
        "label": "🐶 French Bulldog Puppy"
      },
      {
        "value": "Cute Baby Bears Duo",
        "label": "🐻 Cute Baby Bears Duo"
      },
      {
        "value": "Fox & Raccoon Dance Duo",
        "label": "🦊🦝 Fox & Raccoon Dance Duo"
      },
      {
        "value": "Tiny Hamster Crew",
        "label": "🐹 Tiny Hamster Crew"
      }
    ]
  }
];

const CLOTHING_GROUPS = [
  {
    "category": "Basic / General",
    "options": [
      {
        "value": "Casual (T-shirt and jeans)",
        "label": "Casual (T-shirt and jeans)"
      },
      {
        "value": "Traditional Pakistani (Shalwar Kameez)",
        "label": "Traditional Pakistani (Shalwar Kameez)"
      },
      {
        "value": "Formal Wear (Suit/Dress)",
        "label": "Formal Wear (Suit/Dress)"
      },
      {
        "value": "Winter Wear (Sweater/Jacket)",
        "label": "Winter Wear (Sweater/Jacket)"
      },
      {
        "value": "School Uniform",
        "label": "School Uniform"
      },
      {
        "value": "Superhero Costume",
        "label": "Superhero Costume"
      },
      {
        "value": "Pajamas",
        "label": "Pajamas"
      },
      {
        "value": "Sportswear",
        "label": "Sportswear"
      },
      {
        "value": "Vintage 90s Outfit",
        "label": "Vintage 90s Outfit"
      },
      {
        "value": "Cyberpunk Techwear",
        "label": "Cyberpunk Techwear"
      }
    ]
  },
  {
    "category": "🇰🇷 Korean Fashion & Hanbok Outfits",
    "options": [
      {
        "value": "Korean Pastel Oversized Knit Sweater & Beanie 🇰🇷",
        "label": "Korean Oversized Knit & Beanie 🇰🇷"
      },
      {
        "value": "Korean Traditional Silk Hanbok Dress (Chuseok) 👘",
        "label": "Korean Traditional Silk Hanbok Dress 👘"
      },
      {
        "value": "Korean K-Pop Aesthetic Streetwear & Cardigan 🎵",
        "label": "Korean K-Pop Aesthetic Streetwear 🎵"
      },
      {
        "value": "Korean Chic School Uniform (K-Drama Style) 🎒",
        "label": "Korean K-Drama School Uniform 🎒"
      }
    ]
  },
  {
    "category": "👗 Girls — Everyday & Casual",
    "options": [
      {
        "value": "Girl — Colorful Casual T-shirt & Jeans",
        "label": "Colorful Casual T-shirt & Jeans"
      },
      {
        "value": "Girl — Floral Dress & Sandals",
        "label": "Floral Dress & Sandals"
      },
      {
        "value": "Girl — Dungarees / Overalls",
        "label": "Dungarees / Overalls"
      },
      {
        "value": "Girl — Cozy Pajamas / Sleepwear",
        "label": "Cozy Pajamas / Sleepwear"
      },
      {
        "value": "Girl — Soft Pastel Leggings & Top",
        "label": "Soft Pastel Leggings & Top"
      },
      {
        "value": "Girl — Skirt & Blouse",
        "label": "Skirt & Blouse"
      },
      {
        "value": "Girl — Sporty Tracksuit",
        "label": "Sporty Tracksuit"
      },
      {
        "value": "Girl — Winter Sweater & Boots",
        "label": "Winter Sweater & Boots"
      },
      {
        "value": "Girl — Denim Jacket & Skirt",
        "label": "Denim Jacket & Skirt"
      }
    ]
  },
  {
    "category": "✨ Girls — Traditional & Cultural",
    "options": [
      {
        "value": "Girl — Desi Shalwar Kameez",
        "label": "Desi Shalwar Kameez (شلوار قمیض)"
      },
      {
        "value": "Girl — Embroidered Frocksuit / Lawn Frock",
        "label": "Embroidered Frock / Lawn Suit"
      },
      {
        "value": "Girl — Fancy Eid Festive Dress",
        "label": "Fancy Eid Dress (عید لباس)"
      },
      {
        "value": "Girl — Sindhi / Phulkari Embroidered Outfit",
        "label": "Sindhi / Phulkari Embroidered Outfit"
      },
      {
        "value": "Girl — Desi School Uniform (Pinafore)",
        "label": "Desi School Uniform (Pinafore)"
      },
      {
        "value": "Girl — Princess Gown (Desi Style)",
        "label": "Princess Gown (Desi Style)"
      },
      {
        "value": "Girl — Ghagra Choli",
        "label": "Ghagra Choli (Indian Folk)"
      }
    ]
  },
  {
    "category": "🎀 Girls — Costumes & Special",
    "options": [
      {
        "value": "Girl — Fairy Costume with Wings",
        "label": "Fairy Costume with Wings"
      },
      {
        "value": "Girl — Superhero Cape & Mask",
        "label": "Superhero Cape & Mask"
      },
      {
        "value": "Girl — Animal Onesie",
        "label": "Animal Onesie"
      },
      {
        "value": "Girl — Ballet Tutu & Leotard",
        "label": "Ballet Tutu & Leotard"
      },
      {
        "value": "Girl — Doctor Coat & Stethoscope",
        "label": "Tiny Doctor Coat"
      },
      {
        "value": "Girl — Chef Apron & Hat",
        "label": "Chef Apron & Hat"
      }
    ]
  },
  {
    "category": "👕 Boys — Everyday & Casual",
    "options": [
      {
        "value": "Boy — Casual T-shirt & Shorts",
        "label": "Casual T-shirt & Shorts"
      },
      {
        "value": "Boy — Hoodie & Sweatpants",
        "label": "Hoodie & Sweatpants"
      },
      {
        "value": "Boy — Denim Jacket & Jeans",
        "label": "Denim Jacket & Jeans"
      },
      {
        "value": "Boy — Sporty Tracksuit",
        "label": "Sporty Tracksuit"
      },
      {
        "value": "Boy — Cozy Pajamas / Sleepwear",
        "label": "Cozy Pajamas / Sleepwear"
      },
      {
        "value": "Boy — Polo Shirt & Trousers",
        "label": "Polo Shirt & Trousers"
      },
      {
        "value": "Boy — Graphic Tee & Joggers",
        "label": "Graphic Tee & Joggers"
      },
      {
        "value": "Boy — Winter Coat & Boots",
        "label": "Winter Coat & Boots"
      }
    ]
  },
  {
    "category": "🧕 Boys — Traditional & Cultural",
    "options": [
      {
        "value": "Boy — Desi Shalwar Kameez",
        "label": "Desi Shalwar Kameez (شلوار قمیض)"
      },
      {
        "value": "Boy — Kurta & Pajama",
        "label": "Desi Kurta & Pajama"
      },
      {
        "value": "Boy — Fancy Eid Sherwani",
        "label": "Fancy Eid Sherwani (شیروانی)"
      },
      {
        "value": "Boy — Sindhi / Punjabi Folk Attire",
        "label": "Sindhi / Punjabi Folk Attire"
      },
      {
        "value": "Boy — Desi School Uniform",
        "label": "Desi School Uniform (یونیفارم)"
      },
      {
        "value": "Boy — Pathani Shalwar Suit",
        "label": "Pathani Shalwar Suit"
      },
      {
        "value": "Boy — Dhoti & Kurta",
        "label": "Dhoti & Kurta (Indian Folk)"
      }
    ]
  },
  {
    "category": "🦸 Boys — Costumes & Special",
    "options": [
      {
        "value": "Boy — Superhero Costume",
        "label": "Superhero Costume"
      },
      {
        "value": "Boy — Animal Onesie",
        "label": "Animal Onesie"
      },
      {
        "value": "Boy — Pilot / Aviator Suit",
        "label": "Pilot / Aviator Suit"
      },
      {
        "value": "Boy — Chef Apron & Hat",
        "label": "Chef Apron & Hat"
      },
      {
        "value": "Boy — Doctor Coat & Stethoscope",
        "label": "Tiny Doctor Coat"
      },
      {
        "value": "Boy — Astronaut Suit",
        "label": "Astronaut Suit"
      },
      {
        "value": "Boy — Mini Police Uniform",
        "label": "Mini Police Uniform"
      }
    ]
  },
  {
    "category": "👨 Male Shayar & Performer Outfits",
    "options": [
      {
        "value": "Male Simple Button-Down Shirt & Dark Trousers (Sad/Lonely Poet) 👔",
        "label": "Male Simple Pant & Button-Down Shirt (Sad/Lonely) 👔"
      },
      {
        "value": "Male Casual Polo T-Shirt & Chino Pants (Everyday Melancholic) 👕",
        "label": "Male Casual T-Shirt & Chino Pants (Melancholic) 👕"
      },
      {
        "value": "Male Unbuttoned Linen Shirt & Rolled Sleeves (Heartbroken) 💔",
        "label": "Male Unbuttoned Linen Shirt & Dark Jeans (Heartbroken) 💔"
      },
      {
        "value": "Male Simple Plain White Shalwar Kameez (Solitary Desi Shayar) 🌧️",
        "label": "Male Simple Plain Shalwar Kameez (Solitary Desi) 🌧️"
      },
      {
        "value": "Male Traditional Shalwar Kameez & Waistcoat 👔",
        "label": "Male Shalwar Kameez & Velvet Waistcoat 👔"
      },
      {
        "value": "Male Royal Embroidered Sherwani 👑",
        "label": "Male Royal Embroidered Sherwani 👑"
      },
      {
        "value": "Male Western Tuxedo Suit & Bowtie 🕴️",
        "label": "Male Western Tuxedo Suit & Bowtie 🕴️"
      },
      {
        "value": "Male Leather Jacket & Dark Denim Jeans 🧥",
        "label": "Male Leather Jacket & Dark Denim Jeans 🧥"
      },
      {
        "value": "Male Knit Turtleneck & Wool Scarf 🧣",
        "label": "Male Knit Turtleneck & Wool Scarf 🧣"
      },
      {
        "value": "Male Oversized Hoodie & Streetwear 👟",
        "label": "Male Oversized Hoodie & Streetwear 👟"
      },
      {
        "value": "Male Traditional Qawwal Kurta & Turban 🕌",
        "label": "Male Qawwal Kurta & Turban 🕌"
      }
    ]
  },
  {
    "category": "👩 Female Shayara & Singer Outfits",
    "options": [
      {
        "value": "Female Heavily Embellished Lehenga Choli 👗",
        "label": "Female Embellished Lehenga Choli 👗"
      },
      {
        "value": "Female Elegant Silk Saree & Jewels 🥻",
        "label": "Female Elegant Silk Saree & Jewels 🥻"
      },
      {
        "value": "Female Stylish Anarkali Frock & Dupatta ✨",
        "label": "Female Stylish Anarkali Frock & Dupatta ✨"
      },
      {
        "value": "Female Elegant Abaya & Silk Hijab 🧕",
        "label": "Female Elegant Abaya & Silk Hijab 🧕"
      },
      {
        "value": "Female Traditional Salwar Kameez with Hijab 🧕",
        "label": "Female Salwar Kameez with Hijab 🧕"
      },
      {
        "value": "Female Modest Long Gown with Chiffon Hijab 🧕",
        "label": "Female Modest Gown with Chiffon Hijab 🧕"
      },
      {
        "value": "Female Full Niqab (Strictly Fully Covered, ONLY Eyes Visible) 🧕👁️",
        "label": "Female Full Niqab (Only Eyes Showing) 🧕👁️"
      },
      {
        "value": "Female Western Formal Evening Gown 💃",
        "label": "Female Western Evening Gown 💃"
      },
      {
        "value": "Female Western Chic Cocktail Dress 👠",
        "label": "Female Western Cocktail Dress & Heels 👠"
      },
      {
        "value": "Female Casual Denim Jacket & Sundress 🌸",
        "label": "Female Denim Jacket & Sundress 🌸"
      }
    ]
  },
  {
    "category": "👫 Man & Girl Combo Outfits",
    "options": [
      {
        "value": "Man & Girl Combo: Suit & Elegant Gown 👔👗",
        "label": "Man & Girl Combo: Suit & Gown 👔👗"
      },
      {
        "value": "Man & Girl Combo: Kurta Waistcoat & Anarkali Frock 👫",
        "label": "Man & Girl Combo: Kurta & Anarkali 👫"
      },
      {
        "value": "Man & Girl Combo: Leather Jackets & Denim Jeans 🧥",
        "label": "Man & Girl Combo: Leather Jackets & Denim 🧥"
      },
      {
        "value": "Man & Girl Combo: Royal Sherwani & Embellished Lehenga 👑",
        "label": "Man & Girl Combo: Royal Sherwani & Lehenga 👑"
      },
      {
        "value": "Man & Girl Combo: Casual Hoodies & Jeans 👟",
        "label": "Man & Girl Combo: Casual Hoodies & Jeans 👟"
      },
      {
        "value": "Man & Girl Combo: Acoustic Sweaters & Wool Scarves 🧣",
        "label": "Man & Girl Combo: Acoustic Sweaters & Scarves 🧣"
      }
    ]
  },
  {
    "category": "🍃 Soft & Fuzzy Fruit Onesies",
    "options": [
      {
        "value": "Fuzzy Kiwi Fruit (Sliced Green Kiwi Belly with Seeds)",
        "label": "🥝 Fuzzy Kiwi Onesie (Green Sliced Belly)"
      },
      {
        "value": "Striped Watermelon Onesie (Red Juicy Sliced Belly)",
        "label": "🍉 Striped Watermelon Onesie"
      },
      {
        "value": "Plush Red Strawberry Costume with Green Leaf Hat",
        "label": "🍓 Plush Red Strawberry Costume"
      },
      {
        "value": "Golden Yellow Mango Onesie with Soft Velvet Texture",
        "label": "🥭 Golden Yellow Mango Onesie"
      },
      {
        "value": "Spiky Textured Golden Pineapple Suit with Crown Top",
        "label": "🍍 Spiky Golden Pineapple Suit (Crown Top)"
      },
      {
        "value": "Peeled Yellow Banana Suit Framing Cute Face",
        "label": "🍌 Peeled Banana Suit (Face Framed)"
      },
      {
        "value": "Green Avocado Suit with Dark Brown Seed Pit Belly",
        "label": "🥑 Green Avocado Suit (Seed Pit Belly)"
      },
      {
        "value": "Bright Orange Citrus Onesie with Leaf Collar",
        "label": "🍊 Bright Orange Citrus Onesie"
      },
      {
        "value": "Purple Grape Cluster Bubble Suit with Green Vine Top",
        "label": "🍇 Purple Grape Cluster Bubble Suit"
      },
      {
        "value": "Soft Fuzzy Pink Peach Suit with Velvet Finish",
        "label": "🍑 Soft Fuzzy Pink Peach Suit"
      },
      {
        "value": "Shiny Red Apple Suit with Green Stem Hood",
        "label": "🍎 Shiny Red Apple Suit (Stem Hood)"
      },
      {
        "value": "Vibrant Magenta Dragonfruit Suit with White Seeded Belly",
        "label": "🐉 Vibrant Magenta Dragonfruit Suit"
      },
      {
        "value": "Double Red Cherry Suit with Twin Stem Crown",
        "label": "🍒 Double Red Cherry Suit (Twin Stems)"
      },
      {
        "value": "Bright Lemon Yellow Suit with Citrus Texture",
        "label": "🍋 Bright Lemon Yellow Suit"
      },
      {
        "value": "Hairy Brown Coconut Suit with Pure White Core Belly",
        "label": "🥥 Hairy Brown Coconut Suit"
      },
      {
        "value": "Gentle Lime Green Pear Suit with Leaf Accent",
        "label": "🍐 Lime Green Pear Suit (Leaf Accent)"
      },
      {
        "value": "Round Deep Blue Berry Suit with Crown Top",
        "label": "🫐 Deep Blue Blueberry Suit (Crown Top)"
      },
      {
        "value": "Soft Pastel Green Honeydew Suit with Mesh Texture",
        "label": "🍈 Pastel Green Honeydew Suit"
      },
      {
        "value": "Golden Yellow Corn Husk Suit with Husk Leaves",
        "label": "🌽 Golden Corn Husk Suit (Husk Leaves)"
      },
      {
        "value": "Fruit Salad Combo Costumes (Kiwi, Strawberry, Watermelon)",
        "label": "🧺 Multi-Fruit Salad Party Costumes"
      }
    ]
  },
  {
    "category": "👗 Cosplay Costume & Outfit",
    "options": [
      {
        "value": "Strawberry Hood + Pattern Shorts & Pink Crocs",
        "label": "🍓 Strawberry Hood & Pink Crocs (Cat.mp4 Iconic)"
      },
      {
        "value": "Yellow & Black Bumblebee Suit with Wings & Antennas",
        "label": "🐝 Bumblebee Suit with Wings & Antennas"
      },
      {
        "value": "Brown Cowboy Hat, Leather Vest & Tiny Boots",
        "label": "🤠 Cowboy Hat, Leather Vest & Boots"
      },
      {
        "value": "Green Dinosaur Onesie with Back Spikes",
        "label": "🦖 Green Dinosaur Onesie (Back Spikes)"
      },
      {
        "value": "Pirate Captain Hat with Skull & Crossbones & Striped Pants",
        "label": "🏴‍☠️ Pirate Captain Hat & Striped Pants"
      },
      {
        "value": "Blue Baby Shark Onesie",
        "label": "🦈 Blue Baby Shark Onesie"
      },
      {
        "value": "White Chef Hat & Apron",
        "label": "👨‍🍳 White Chef Hat & Apron"
      },
      {
        "value": "Gold Royal King Crown & Red Velvet Cape",
        "label": "👑 Gold Royal King Crown & Red Velvet Cape"
      },
      {
        "value": "Superhero Cape & Eye Mask",
        "label": "🦸 Superhero Cape & Eye Mask"
      },
      {
        "value": "Metallic Silver Astronaut Suit",
        "label": "👨‍🚀 Metallic Silver Astronaut Suit"
      },
      {
        "value": "Hawaiian Hula Grass Skirt & Floral Lei",
        "label": "🌴 Hawaiian Hula Grass Skirt & Floral Lei"
      },
      {
        "value": "Martial Arts Karate Gi & Black Belt",
        "label": "🥋 Martial Arts Karate Gi & Black Belt"
      }
    ]
  },
  {
    "category": "Parents & Family Outfits",
    "options": [
      {
        "value": "Traditional White Kurta Shalwar",
        "label": "Traditional White Kurta Shalwar"
      },
      {
        "value": "Casual Polo & Denim Jeans",
        "label": "Casual Polo & Denim Jeans"
      },
      {
        "value": "Waistcoat & Embroidered Kurta",
        "label": "Waistcoat & Embroidered Kurta"
      },
      {
        "value": "Classic Sherwani",
        "label": "Classic Sherwani"
      },
      {
        "value": "Tracksuit & Loungewear",
        "label": "Tracksuit & Loungewear"
      },
      {
        "value": "Formal Suit & Tie",
        "label": "Formal Suit & Tie"
      },
      {
        "value": "Traditional Embroidered Lawn Suit",
        "label": "Traditional Embroidered Lawn Suit"
      },
      {
        "value": "Simple Cotton Shalwar Kameez",
        "label": "Simple Cotton Shalwar Kameez"
      },
      {
        "value": "Elegant Silk Suit with Silk Dupatta",
        "label": "Elegant Silk Suit with Silk Dupatta"
      },
      {
        "value": "Abaya & Hijab",
        "label": "Abaya & Hijab"
      },
      {
        "value": "Casual Home Loungewear",
        "label": "Casual Home Loungewear"
      },
      {
        "value": "Saree / Festive Wear",
        "label": "Saree / Festive Wear"
      }
    ]
  }
];

const AGE_GROUPS = [
  {
    "category": "Basic / General",
    "options": [
      {
        "value": "Infant (0-1 years)",
        "label": "Infant (0-1 years)"
      },
      {
        "value": "Baby (1-2 years)",
        "label": "Baby (1-2 years)"
      },
      {
        "value": "Toddler (3-5 years)",
        "label": "Toddler (3-5 years)"
      },
      {
        "value": "Child (6-12 years)",
        "label": "Child (6-12 years)"
      },
      {
        "value": "Teenager (13-19 years)",
        "label": "Teenager (13-19 years)"
      },
      {
        "value": "Young Adult (20-35 years)",
        "label": "Young Adult (20-35 years)"
      },
      {
        "value": "Adult (36-55 years)",
        "label": "Adult (36-55 years)"
      },
      {
        "value": "Elderly (56-70 years)",
        "label": "Elderly (56-70 years)"
      },
      {
        "value": "Senior (71+ years)",
        "label": "Senior (71+ years)"
      },
      {
        "value": "Immortal / Ageless",
        "label": "Immortal / Ageless"
      }
    ]
  },
  {
    "category": "Babies & Toddlers (0-4 yrs)",
    "options": [
      {
        "value": "Newborn (0-6 mos)",
        "label": "Newborn (0-6 mos)"
      },
      {
        "value": "Infant (6-12 mos)",
        "label": "Infant (6-12 mos)"
      },
      {
        "value": "Baby (1-2 yrs)",
        "label": "Baby (1-2 yrs)"
      },
      {
        "value": "Early Toddler (1.5-2.5 yrs)",
        "label": "Early Toddler (1.5-2.5 yrs)"
      },
      {
        "value": "Toddler (2-4 yrs)",
        "label": "Toddler (2-4 yrs)"
      }
    ]
  },
  {
    "category": "Little Kids & Preschoolers (3-9 yrs)",
    "options": [
      {
        "value": "Little Kids (3-5 yrs)",
        "label": "Little Kids (3-5 yrs)"
      },
      {
        "value": "Preschooler (4-5 yrs)",
        "label": "Preschooler (4-5 yrs)"
      },
      {
        "value": "Child (5-8 yrs)",
        "label": "Child (5-8 yrs)"
      },
      {
        "value": "School Age (6-9 yrs)",
        "label": "School Age (6-9 yrs)"
      }
    ]
  },
  {
    "category": "Pre-Teens & Mixed Ages (9+ yrs)",
    "options": [
      {
        "value": "Pre-Teen (9-12 yrs)",
        "label": "Pre-Teen (9-12 yrs)"
      },
      {
        "value": "Tween (10-12 yrs)",
        "label": "Tween (10-12 yrs)"
      },
      {
        "value": "Teenager (13-17 yrs)",
        "label": "Teenager (13-17 yrs)"
      },
      {
        "value": "Adult & Child Combo (Mixed Ages)",
        "label": "Adult & Child Combo"
      },
      {
        "value": "Family (All Ages)",
        "label": "Family (All Ages)"
      }
    ]
  },
  {
    "category": "Performers Age Ranges (Child 6-9 to Old Man Legend)",
    "options": [
      {
        "value": "Child Singer (6-9 yrs)",
        "label": "👦 Child Singer (6-9 yrs)"
      },
      {
        "value": "Pre-Teen & Teen (10-17 yrs)",
        "label": "🧑 Pre-Teen & Teen Singer (10-17 yrs)"
      },
      {
        "value": "Young Adult (18-24 yrs)",
        "label": "👤 Young Adult Singer (18-24 yrs)"
      },
      {
        "value": "Adult (25-35 yrs)",
        "label": "🎩 Adult Vocalist (25-35 yrs)"
      },
      {
        "value": "Mature Master (36-50 yrs)",
        "label": "🌟 Mature Master Singer (36-50 yrs)"
      },
      {
        "value": "Senior Maestro (51-65 yrs)",
        "label": "🔮 Senior Maestro Singer (51-65 yrs)"
      },
      {
        "value": "Old Man Legend (65+ yrs)",
        "label": "👴 Old Man Legend (65+ yrs)"
      },
      {
        "value": "Multi-Generational Duet",
        "label": "👥 Multi-Generational Duet"
      }
    ]
  },
  {
    "category": "🐾 Pet Age & Stage",
    "options": [
      {
        "value": "Newborn Baby Animals (0-6 months)",
        "label": "🍼 Newborn Baby Animals (0-6 months)"
      },
      {
        "value": "Tiny Kittens & Puppies (6-12 months)",
        "label": "🐣 Tiny Kittens & Puppies (6-12 mos) — Most Viral"
      },
      {
        "value": "Playful Toddler Pets (1-2 yrs)",
        "label": "🧒 Playful Toddler Pets (1-2 yrs)"
      },
      {
        "value": "Cute Fluffy Squad (Matching Twins)",
        "label": "👯 Cute Fluffy Squad (Matching Twins)"
      }
    ]
  }
];

const NATIONALITY_GROUPS = [
  {
    "category": "Basic / General",
    "options": [
      {
        "value": "Pakistani",
        "label": "Pakistani"
      },
      {
        "value": "Indian",
        "label": "Indian"
      },
      {
        "value": "South Asian",
        "label": "South Asian"
      },
      {
        "value": "Middle Eastern",
        "label": "Middle Eastern"
      },
      {
        "value": "Arab",
        "label": "Arab"
      },
      {
        "value": "Caucasian / White",
        "label": "Caucasian / White"
      },
      {
        "value": "East Asian",
        "label": "East Asian"
      },
      {
        "value": "Southeast Asian",
        "label": "Southeast Asian"
      },
      {
        "value": "African / Black",
        "label": "African / Black"
      },
      {
        "value": "Hispanic / Latino",
        "label": "Hispanic / Latino"
      },
      {
        "value": "Native American / Indigenous",
        "label": "Native American / Indigenous"
      },
      {
        "value": "Mixed / Multiracial",
        "label": "Mixed / Multiracial"
      },
      {
        "value": "Fantasy / Otherworldly",
        "label": "Fantasy / Otherworldly"
      }
    ]
  },
  {
    "category": "Pakistani Cultural Aesthetics",
    "options": [
      {
        "value": "Pakistani (General / Desi)",
        "label": "Pakistani (General)"
      },
      {
        "value": "Pakistani Punjabi",
        "label": "Pakistani Punjabi (پنجابی)"
      },
      {
        "value": "Pakistani Pashtun / Pathan",
        "label": "Pakistani Pashtun / Pathan (پشتون)"
      },
      {
        "value": "Pakistani Sindhi",
        "label": "Pakistani Sindhi (سندھی)"
      },
      {
        "value": "Pakistani Balochi",
        "label": "Pakistani Balochi (بلوچی)"
      },
      {
        "value": "Pakistani Muhajir / Urdu Speaking",
        "label": "Pakistani Urdu Speaking (اردو)"
      },
      {
        "value": "Pakistani Kashmiri",
        "label": "Pakistani Kashmiri (کشمیری)"
      }
    ]
  },
  {
    "category": "Indian & Sikh Cultural Aesthetics",
    "options": [
      {
        "value": "Indian Punjabi Sikh",
        "label": "Indian Punjabi Sikh (ਪੰਜਾਬੀ ਸਿੱਖ)"
      },
      {
        "value": "Indian Punjabi",
        "label": "Indian Punjabi (ਪੰਜਾਬੀ)"
      },
      {
        "value": "Indian (General / Desi)",
        "label": "Indian (General)"
      },
      {
        "value": "Indian South Indian",
        "label": "South Indian (Tamil / Telugu / Malayalam / Kannada)"
      },
      {
        "value": "Indian North Indian / Hindi Heartband",
        "label": "North Indian (Hindi Belt)"
      },
      {
        "value": "Indian Bengali",
        "label": "Indian Bengali (বাংলা)"
      },
      {
        "value": "Indian Gujarati / Rajasthani",
        "label": "Indian Gujarati / Rajasthani"
      }
    ]
  },
  {
    "category": "🇰🇷 East Asian & Korean Style Aesthetics",
    "options": [
      {
        "value": "Korean (K-Drama / Seoul Streetwear) 🇰🇷",
        "label": "Korean (K-Drama / Seoul Fashion) 🇰🇷"
      },
      {
        "value": "Korean Traditional Hanbok (Chuseok / Festival) 👘",
        "label": "Korean Traditional Hanbok 👘"
      },
      {
        "value": "Japanese Kawaii / Harajuku Style 🇯🇵",
        "label": "Japanese Kawaii Anime Style 🇯🇵"
      }
    ]
  },
  {
    "category": "Other Global Cultures",
    "options": [
      {
        "value": "Bangladeshi / Bengali",
        "label": "Bangladeshi (বাংলাদেশী)"
      },
      {
        "value": "Middle Eastern / Arab",
        "label": "Middle Eastern / Arab (عربي)"
      },
      {
        "value": "Turkish / Central Asian",
        "label": "Turkish & Central Asian"
      },
      {
        "value": "American / Western",
        "label": "American / Western"
      },
      {
        "value": "East Asian (Japanese/Korean/Chinese)",
        "label": "East Asian (Japanese/Korean/Chinese)"
      },
      {
        "value": "African",
        "label": "African Culture"
      },
      {
        "value": "European",
        "label": "European Culture"
      },
      {
        "value": "Latin American",
        "label": "Latin American Culture"
      },
      {
        "value": "Global / Any",
        "label": "Global / Any Culture"
      }
    ]
  }
];

const COMPLEXION_GROUPS = [
  {
    "category": "Basic / General",
    "options": [
      {
        "value": "Fair / Pale",
        "label": "Fair / Pale"
      },
      {
        "value": "Light",
        "label": "Light"
      },
      {
        "value": "Medium / Olive",
        "label": "Medium / Olive"
      },
      {
        "value": "Tan / Brown",
        "label": "Tan / Brown"
      },
      {
        "value": "Dark Brown",
        "label": "Dark Brown"
      },
      {
        "value": "Black",
        "label": "Black"
      }
    ]
  },
  {
    "category": "🤖 Default & Random",
    "options": [
      {
        "value": "Unique Non-Repetitive Random Face 🎲",
        "label": "Unique Random Face Every Time 🎲"
      }
    ]
  },
  {
    "category": "👨 Male Facial Features & Beards",
    "options": [
      {
        "value": "Young Handsome & Clean-Shaven 🧑",
        "label": "Young Handsome & Clean-Shaven 🧑"
      },
      {
        "value": "Rugged Stubble & Groomed Beard 🧔",
        "label": "Rugged Stubble & Groomed Beard 🧔"
      },
      {
        "value": "Classic Urdu Shayar Full Beard 🕌",
        "label": "Classic Urdu Shayar Full Beard 🕌"
      },
      {
        "value": "Regal Mughal & Royal Features 👑",
        "label": "Regal Mughal & Royal Features 👑"
      },
      {
        "value": "Old Maestro Silver Beard (60+ yrs) 👴",
        "label": "Old Maestro Silver Beard (60+ yrs) 👴"
      },
      {
        "value": "Western Rockstar Undercut & Stubble 🎸",
        "label": "Western Rockstar Undercut & Stubble 🎸"
      },
      {
        "value": "Dense Salt-and-Pepper Beard (40s-50s) 🧔‍♂️",
        "label": "Dense Salt-and-Pepper Beard (40s-50s) 🧔‍♂️"
      },
      {
        "value": "Curly Hair & Short Boxed Beard 👨‍🦱",
        "label": "Curly Hair & Short Boxed Beard 👨‍🦱"
      },
      {
        "value": "Traditional Punjabi Turban & Full Beard 👳",
        "label": "Traditional Punjabi Turban & Full Beard 👳"
      },
      {
        "value": "Bold Bald Head & Heavy Beard 👨‍🦲",
        "label": "Bold Bald Head & Heavy Beard 👨‍🦲"
      },
      {
        "value": "Stylish Glasses & Goatee Beard 👓",
        "label": "Stylish Glasses & Goatee Beard 👓"
      },
      {
        "value": "Western Blond / Light Brown Hair Model 👱",
        "label": "Western Blond / Light Brown Hair Model 👱"
      }
    ]
  },
  {
    "category": "👩 Female Facial Features & Styles",
    "options": [
      {
        "value": "Graceful Desi Female (Large Expressive Eyes) 👁️",
        "label": "Graceful Desi Female (Expressive Eyes) 👁️"
      },
      {
        "value": "Royal Kashmiri / Northern Fair Complexion 🌸",
        "label": "Royal Kashmiri / Fair Complexion 🌸"
      },
      {
        "value": "Traditional Hijab & Graceful Features 🧕",
        "label": "Traditional Hijab & Graceful Features 🧕"
      },
      {
        "value": "Western High-Fashion Model Face 💃",
        "label": "Western High-Fashion Model Face 💃"
      },
      {
        "value": "Short Curly Hair & Chic Modern Face 👩‍🦱",
        "label": "Short Curly Hair & Chic Modern Face 👩‍🦱"
      },
      {
        "value": "Shy & Naughty Playful Expression 😏😳",
        "label": "Shy & Naughty Playful Expression 😏😳"
      },
      {
        "value": "Playful laughter 😄",
        "label": "Playful Laughter 😄"
      },
      {
        "value": "Coy laugh 🤭",
        "label": "Coy Laugh 🤭"
      },
      {
        "value": "Charming giggle 😊",
        "label": "Charming Giggle 😊"
      },
      {
        "value": "Playful smile with a soft laugh ☺️",
        "label": "Playful Smile & Soft Laugh ☺️"
      },
      {
        "value": "Ada-filled laugh (Urdu Ada) 💖",
        "label": "Ada-filled Laugh (ادا) 💖"
      }
    ]
  }
];

const BACKGROUND_GROUPS = [
  {
    "category": "Basic / General",
    "options": [
      {
        "value": "Solid Green Screen (For Chroma Key)",
        "label": "Solid Green Screen (For Chroma Key)"
      },
      {
        "value": "Solid Blue Screen",
        "label": "Solid Blue Screen"
      },
      {
        "value": "Solid White Background",
        "label": "Solid White Background"
      },
      {
        "value": "Solid Black Background",
        "label": "Solid Black Background"
      },
      {
        "value": "Natural / Realistic Setting",
        "label": "Natural / Realistic Setting"
      },
      {
        "value": "Abstract Gradient",
        "label": "Abstract Gradient"
      },
      {
        "value": "Studio Backdrop",
        "label": "Studio Backdrop"
      },
      {
        "value": "Blurry Bokeh",
        "label": "Blurry Bokeh"
      },
      {
        "value": "Cinematic Studio Lighting",
        "label": "Cinematic Studio Lighting"
      },
      {
        "value": "Dreamy Soft Focus",
        "label": "Dreamy Soft Focus"
      },
      {
        "value": "Neon Cyberpunk Alley",
        "label": "Neon Cyberpunk Alley"
      }
    ]
  },
  {
    "category": "Indoor & Home Settings",
    "options": [
      {
        "value": "Cozy Home Living Room",
        "label": "Cozy Home / Living Room"
      },
      {
        "value": "Modern Kitchen",
        "label": "Kitchen & Dining"
      },
      {
        "value": "Colorful Kids Bedroom",
        "label": "Kids Bedroom / Playroom"
      },
      {
        "value": "Cozy Library & Book Nook",
        "label": "Library & Reading Nook"
      },
      {
        "value": "School Classroom",
        "label": "School Classroom"
      },
      {
        "value": "Daycare & Nursery",
        "label": "Daycare & Nursery"
      },
      {
        "value": "Indoor Toy Store & Arcade",
        "label": "Indoor Toy Store / Arcade 🧸"
      },
      {
        "value": "Cozy Bedroom Attic & Secret Fort",
        "label": "Attic & Secret Blanket Fort ⛺"
      },
      {
        "value": "Supermarket & Snack Aisle",
        "label": "Supermarket / Grocery Store 🛒"
      },
      {
        "value": "Art Studio & Paint Corner",
        "label": "Art Studio & Painting Room 🎨"
      },
      {
        "value": "Bakery & Pastry Shop",
        "label": "Sweet Bakery & Pastry Shop 🧁"
      },
      {
        "value": "Indoor Swimming Pool & Splash Zone",
        "label": "Indoor Heated Pool & Splash Zone 🏊"
      }
    ]
  },
  {
    "category": "Outdoor, Nature & Farm",
    "options": [
      {
        "value": "Lush Green Park",
        "label": "Park & Garden"
      },
      {
        "value": "Sunny Playground",
        "label": "Outdoor Playground"
      },
      {
        "value": "Peaceful Village & Countryside",
        "label": "Village & Countryside"
      },
      {
        "value": "Enchanted Forest & Woodland Trail",
        "label": "Enchanted Forest & Trail"
      },
      {
        "value": "Misty Mountain Valley & Waterfall",
        "label": "Mountain Valley & Waterfall"
      },
      {
        "value": "Neighborhood Street",
        "label": "Neighborhood Street"
      },
      {
        "value": "Sunny Beach & Ocean",
        "label": "Beach & Seaside"
      },
      {
        "value": "Cozy Camping Site & Bonfire",
        "label": "Camping Site & Campfire"
      },
      {
        "value": "Botanical Flower Garden & Greenhouse",
        "label": "Botanical Flower Garden 🌸"
      },
      {
        "value": "Sunny Backyard & Treehouse",
        "label": "Backyard Garden & Treehouse 🏡"
      },
      {
        "value": "Sunflower Field under Blue Sky",
        "label": "Golden Sunflower Field 🌻"
      },
      {
        "value": "Autumn Park with Golden Fallen Leaves",
        "label": "Autumn Park / Fallen Leaves 🍂"
      },
      {
        "value": "Winter Snow Park & Snowman Yard",
        "label": "Winter Snow Park & Snowman ☃️"
      },
      {
        "value": "Zoo & Friendly Animal Safari",
        "label": "Zoo & Petting Farm 🦒"
      }
    ]
  },
  {
    "category": "Desi (Indian & Pakistani) Locations",
    "options": [
      {
        "value": "Desi Village & Punjabi Pind",
        "label": "Desi Village & Pind (پنڈ / गाँव)"
      },
      {
        "value": "Bustling Desi Bazaar & Street Market",
        "label": "Bustling Desi Bazaar (بازار)"
      },
      {
        "value": "Traditional Desi Courtyard & Vehra",
        "label": "Desi Courtyard / Vehra (صحن)"
      },
      {
        "value": "Desi Dhaba & Roadside Chai Stall",
        "label": "Desi Dhaba & Chai Stall (ڈھابہ)"
      },
      {
        "value": "House Rooftop Kite Flying (Kotha)",
        "label": "Desi House Rooftop / Kotha (چھت)"
      },
      {
        "value": "Desi Halwai & Sweet Shop",
        "label": "Desi Sweet Shop / Halwai (مٹھائی)"
      },
      {
        "value": "Mango & Guava Fruit Orchard",
        "label": "Desi Fruit Orchard / Baagh (باغ)"
      },
      {
        "value": "Green Wheat & Mustard Fields",
        "label": "Mustard & Wheat Fields (سرسوں کے کھیت)"
      },
      {
        "value": "Desi Canal & Green Riverbank",
        "label": "Desi Canal & Riverbank (نہر / ندی)"
      },
      {
        "value": "Desi Primary School Classroom",
        "label": "Desi School Classroom (اسکول)"
      },
      {
        "value": "Desi Mela & Festival Fairground",
        "label": "Desi Mela / Festival (میلہ)"
      },
      {
        "value": "Festive Eid & Chand Raat Market",
        "label": "Eid & Chand Raat Market (عید بازار)"
      },
      {
        "value": "Traditional Heritage Haveli",
        "label": "Traditional Haveli & Courtyard (حویلی)"
      },
      {
        "value": "Bollywood Festive Wedding Stage",
        "label": "Bollywood Wedding / Shaadi Stage 🎉"
      },
      {
        "value": "Bollywood Movie Set",
        "label": "Bollywood Movie Set & Dancers 🎥"
      },
      {
        "value": "Grand Mughal Palace",
        "label": "Grand Royal Palace 🏰"
      }
    ]
  },
  {
    "category": "Fantasy, Sci-Fi & Adventure",
    "options": [
      {
        "value": "Magical Cloud Kingdom",
        "label": "Magical Cloud Kingdom"
      },
      {
        "value": "Futuristic Space Station & Moon Base",
        "label": "Space Station & Moon Base"
      },
      {
        "value": "Underwater Coral Reef",
        "label": "Underwater Coral Reef"
      },
      {
        "value": "Candyland & Chocolate River",
        "label": "Candyland & Sweet Kingdom"
      },
      {
        "value": "Pirate Island & Treasure Cove",
        "label": "Pirate Island & Treasure Cove"
      }
    ]
  },
  {
    "category": "Medical & Community Services",
    "options": [
      {
        "value": "Doctor Clinic & Children Hospital",
        "label": "Doctor Clinic / Children's Hospital 🏥"
      },
      {
        "value": "Dentist Clinic & Tooth Care",
        "label": "Dentist Clinic / Tooth Care 🪥"
      },
      {
        "value": "Pharmacy & Medicine Shop",
        "label": "Pharmacy & Medicine Shop 💊"
      },
      {
        "value": "Veterinary Clinic & Pet Hospital",
        "label": "Veterinary Clinic & Pet Hospital 🐾"
      },
      {
        "value": "Fire Station & Red Fire Truck",
        "label": "Fire Station & Fire Truck 🚒"
      },
      {
        "value": "Police Station & Patrol Car",
        "label": "Police Station & Patrol Car 🚓"
      },
      {
        "value": "Post Office & Mail Room",
        "label": "Post Office & Mail Room 📮"
      }
    ]
  },
  {
    "category": "Shops, Places & City",
    "options": [
      {
        "value": "Ice Cream Shop",
        "label": "Ice Cream Shop"
      },
      {
        "value": "Magical Toy Store",
        "label": "Toy Store"
      },
      {
        "value": "Supermarket & Grocery Market",
        "label": "Market / Supermarket"
      },
      {
        "value": "Cozy Restaurant & Cafe",
        "label": "Restaurant & Cafe"
      },
      {
        "value": "Amusement Park & Carnival",
        "label": "Amusement Park"
      },
      {
        "value": "Arcade & Game Zone",
        "label": "Retro Arcade & Game Zone"
      },
      {
        "value": "Airport Terminal & Airplane",
        "label": "Airport Terminal & Airplane ✈️"
      },
      {
        "value": "Train Station Platform",
        "label": "Train Station & Platform 🚉"
      }
    ]
  },
  {
    "category": "Special & Creative",
    "options": [
      {
        "value": "Little Science Lab & Art Studio",
        "label": "Science Lab / Art Studio"
      },
      {
        "value": "Winter Wonderland & Snow Village",
        "label": "Winter Wonderland & Snow Village"
      },
      {
        "value": "Global / Any Location",
        "label": "Any / Flexible Location"
      }
    ]
  },
  {
    "category": "🏛️ Mehfil & Mushaira Settings",
    "options": [
      {
        "value": "Mehfil Stage with Carpet & Bolster Pillows (محفل کی رونک) 🕌",
        "label": "Mehfil Stage with Carpets & Gaddi (محفل کی رونک) 🕌"
      },
      {
        "value": "Colonial Heritage Auditorium & Stage 🏛️",
        "label": "Colonial Heritage Auditorium Stage 🏛️"
      },
      {
        "value": "Open-Air Garden Mehfil under Fairy Lights ✨",
        "label": "Open-Air Garden Mehfil under Fairy Lights ✨"
      },
      {
        "value": "Ancient Fort Archway & Torches 🏰",
        "label": "Ancient Fort Archway & Torches 🏰"
      },
      {
        "value": "Dynamic Multi-Location Mehfil & Solitude 🎭",
        "label": "Dynamic Multi-Location (Stage + Solitary Room) 🎭"
      },
      {
        "value": "Desi Rooftop Mehfil under Moonlight 🌙",
        "label": "Desi Rooftop Mehfil under Moonlight 🌙"
      },
      {
        "value": "Royal Mughal Courtyard Mehfil 👑",
        "label": "Royal Mughal Courtyard Mehfil 👑"
      },
      {
        "value": "Lakeside Boat Mehfil (Shikara / Dal Lake) 🚣",
        "label": "Lakeside Shikara Boat Mehfil 🚣"
      }
    ]
  },
  {
    "category": "🌧️ Solitary, Sad & Atmospheric Locations",
    "options": [
      {
        "value": "Candlelit Solitary Room (Tanhai / Solitary Room) 🕯️",
        "label": "Candlelit Solitary Room (تنہا کمرہ / Tanhai) 🕯️"
      },
      {
        "value": "Rain-Slicked Midnight Rooftop Balcony 🌧️🌙",
        "label": "Rain-Slicked Midnight Balcony 🌧️🌙"
      },
      {
        "value": "Rainy Window Coffee Shop ☕",
        "label": "Rainy Window Coffee Shop ☕"
      },
      {
        "value": "Sunset Rooftop & City Skyline 🌇",
        "label": "Sunset Rooftop & Skyline 🌇"
      },
      {
        "value": "Dimly Lit Vintage Tea House (Dhaba) ☕",
        "label": "Dimly Lit Vintage Tea House / Dhaba ☕"
      },
      {
        "value": "Solitary Bench in Misty Autumn Park 🍁",
        "label": "Solitary Bench in Misty Park 🍁"
      },
      {
        "value": "Ocean Cliff at Dusk 🌊",
        "label": "Ocean Cliff at Dusk 🌊"
      },
      {
        "value": "Acoustic Music Studio 🎤",
        "label": "Acoustic Music Studio 🎤"
      },
      {
        "value": "Coke Studio Fusion Stage 🎸",
        "label": "Coke Studio Stage 🎸"
      }
    ]
  },
  {
    "category": "💕 Romantic Places & Couple Locations",
    "options": [
      {
        "value": "Blooming Rose Garden at Golden Hour 🌹",
        "label": "Blooming Rose Garden at Golden Hour 🌹"
      },
      {
        "value": "Moonlit Palace Rooftop Terrace 🌕",
        "label": "Moonlit Palace Rooftop Terrace 🌕"
      },
      {
        "value": "Candlelit Indoor Library & Books 🕯️📚",
        "label": "Candlelit Library & Book Nook 🕯️📚"
      },
      {
        "value": "Riverside Sunset Promenade 🌅🌊",
        "label": "Riverside Sunset Promenade 🌅🌊"
      },
      {
        "value": "Flower Market & Gol Gappa Stall Evening 🌺",
        "label": "Desi Flower Market Evening 🌺"
      },
      {
        "value": "Snow-Capped Mountain Cabin & Fireplace ❄️🔥",
        "label": "Snow Mountain Cabin & Fireplace ❄️🔥"
      },
      {
        "value": "Cherry Blossom Garden (Sakura) 🌸",
        "label": "Cherry Blossom Garden (Sakura) 🌸"
      },
      {
        "value": "Rooftop Candlelight Dinner Setup 🍷🕯️",
        "label": "Rooftop Candlelight Dinner 🍷🕯️"
      },
      {
        "value": "Hidden Waterfall & Lush Green Valley 🌿💦",
        "label": "Hidden Waterfall & Green Valley 🌿💦"
      },
      {
        "value": "Vintage European Cobblestone Street 🇫🇷🌙",
        "label": "Vintage European Cobblestone Alley 🌙"
      },
      {
        "value": "Boat Ride on Moonlit Lake 🛶🌕",
        "label": "Moonlit Lake Boat Ride 🛶🌕"
      },
      {
        "value": "Desert Dunes at Sunset with Bonfire 🌄🔥",
        "label": "Desert Dunes Sunset & Bonfire 🌄🔥"
      },
      {
        "value": "Terrace with City View & Rain 🌧️🏙️",
        "label": "Rainy Terrace with City View 🌧️🏙️"
      },
      {
        "value": "Autumn Leaf Forest Path 🍂🌲",
        "label": "Autumn Forest Path 🍂🌲"
      },
      {
        "value": "Indoor Haveli Balcony with Diyas (Diwali / Night) 🪔",
        "label": "Heritage Haveli Balcony with Diyas 🪔"
      },
      {
        "value": "Old Vintage Railway Platform at Dusk 🚂🌅",
        "label": "Vintage Railway Platform at Dusk 🚂🌅"
      },
      {
        "value": "Glasshouse Botanical Conservatory 🌿🌸",
        "label": "Glasshouse Botanical Conservatory 🌿🌸"
      },
      {
        "value": "Seaside Lighthouse Balcony at Twilight 🗼🌊",
        "label": "Seaside Lighthouse Balcony at Twilight 🗼🌊"
      },
      {
        "value": "Kashmiri Apple Orchard in Bloom 🍎🌸",
        "label": "Kashmiri Apple Orchard in Bloom 🍎🌸"
      },
      {
        "value": "Candlelit Vine Covered Gazebo 🍇🕯️",
        "label": "Candlelit Vine Covered Gazebo 🍇🕯️"
      },
      {
        "value": "Heritage Library Window (Jharoka) 📚🪟",
        "label": "Heritage Library Window (Jharoka) 📚🪟"
      },
      {
        "value": "Starry Desert Oasis & Palm Trees 🌴✨",
        "label": "Starry Desert Oasis & Palm Trees 🌴✨"
      },
      {
        "value": "Hilltop Pavilion & City Lights View ⛰️🌃",
        "label": "Hilltop Pavilion & City Lights View ⛰️🌃"
      },
      {
        "value": "Lavender Field at Sunset 🪻🌅",
        "label": "Lavender Field at Sunset 🪻🌅"
      },
      {
        "value": "Old Town Café Balcony at Dusk 🍷🕯️",
        "label": "Old Town Café Balcony at Dusk 🍷🕯️"
      }
    ]
  },
  {
    "category": "🎸 Music Video & Stage Settings",
    "options": [
      {
        "value": "Live Concert Arena 🎤",
        "label": "Live Concert Arena 🎤"
      },
      {
        "value": "Underground Indie Club 🪩",
        "label": "Underground Indie Club 🪩"
      },
      {
        "value": "Modern Recording Studio Booth 🎧",
        "label": "Recording Studio Booth 🎧"
      },
      {
        "value": "Acoustic Beach Bonfire 🔥🌊",
        "label": "Acoustic Beach Bonfire 🔥🌊"
      },
      {
        "value": "Neon Cyberpunk Street 🌃",
        "label": "Neon Cyberpunk Street 🌃"
      }
    ]
  },
  {
    "category": "🎬 Bollywood & Desi Vibe Settings",
    "options": [
      {
        "value": "Grand Bollywood Palace / Haveli 🏰",
        "label": "Bollywood Palace / Haveli 🏰"
      },
      {
        "value": "Festive Desi Wedding / Mehndi Stage 🎉",
        "label": "Mehndi / Wedding Stage 🎉"
      },
      {
        "value": "Mustard Fields (Sarson ka Khet) 🌼",
        "label": "Mustard Fields (Sarson ka Khet) 🌼"
      },
      {
        "value": "Vibrant Indian Mela (Carnival) 🎪",
        "label": "Desi Mela (Carnival) 🎪"
      },
      {
        "value": "Rainy Desi Street (Romantic Monsoon) 🌧️",
        "label": "Monsoon Rainy Street 🌧️"
      },
      {
        "value": "Royal Rajasthani Desert Camp 🏜️",
        "label": "Rajasthani Desert Camp 🏜️"
      },
      {
        "value": "Glitzy Bollywood Dance Floor 🪩",
        "label": "Bollywood Disco Dance Floor 🪩"
      }
    ]
  },
  {
    "category": "🏠 Living Room & Indoor Floors",
    "options": [
      {
        "value": "Living Room Hardwood Floor with Giant Plush Teddy Bears",
        "label": "🧸 Living Room Hardwood Floor & Teddy Bears (Cat.mp4)"
      },
      {
        "value": "Polished Wooden Floor with Warm Indoor Sunlight",
        "label": "🪵 Polished Wooden Floor (Sunlit)"
      },
      {
        "value": "Neon Glow Disco Dance Studio & Balloons",
        "label": "🪩 Neon Glow Disco Studio"
      },
      {
        "value": "Clean Kitchen Countertop & Bakery Counter",
        "label": "🍳 Kitchen Countertop & Bakery"
      }
    ]
  },
  {
    "category": "🌴 Outdoor & Fantasy Settings",
    "options": [
      {
        "value": "Tropical Sandy Beach & Palm Trees",
        "label": "🏖️ Tropical Sandy Beach & Palms"
      },
      {
        "value": "Cherry Blossom Garden with Petals Falling",
        "label": "🌸 Cherry Blossom Garden (Sakura)"
      },
      {
        "value": "Pastel Rainbow Candy Land Floor",
        "label": "🌈 Pastel Rainbow Candy Land"
      },
      {
        "value": "Magical Sky Garden with Floating Clouds",
        "label": "☁️ Magical Sky Garden & Clouds"
      }
    ]
  },
  {
    "category": "🌳 Fruit Orchards & Gardens",
    "options": [
      {
        "value": "Lush Kiwi Orchard with Sliced Kiwis on Grass",
        "label": "🥝 Kiwi Orchard with Sliced Kiwis"
      },
      {
        "value": "Sunny Watermelon Patch with Giant Melon Slices",
        "label": "🍉 Sunny Watermelon Patch"
      },
      {
        "value": "Magical Strawberry Patch with Floating Berry Sparkles",
        "label": "🍓 Magical Strawberry Patch"
      },
      {
        "value": "Tropical Mango Grove under Golden Hour Sunlight",
        "label": "🥭 Tropical Mango Grove (Golden Hour)"
      },
      {
        "value": "Tropical Island Orchard with Palm Trees",
        "label": "🍍 Tropical Island Orchard & Palms"
      },
      {
        "value": "Vibrant Tropical Jungle Path with Banana Palms",
        "label": "🍌 Tropical Jungle Path & Banana Palms"
      },
      {
        "value": "Aesthetic Green Garden with Giant Sliced Avocados",
        "label": "🥑 Aesthetic Avocado Garden"
      },
      {
        "value": "Sun-dappled Orange Grove with Sliced Oranges",
        "label": "🍊 Sun-dappled Orange Grove"
      },
      {
        "value": "Sunny Italian Vineyard with Hanging Grapes",
        "label": "🍇 Sunny Italian Vineyard"
      },
      {
        "value": "Peach Blossom Garden with Petals Drifting in Wind",
        "label": "🍑 Peach Blossom Garden"
      },
      {
        "value": "Autumn Apple Orchard under Warm Afternoon Sun",
        "label": "🍎 Autumn Apple Orchard"
      },
      {
        "value": "Exotic Tropical Garden with Glowing Lotus Flowers",
        "label": "🐉 Exotic Tropical Garden (Neon Glow)"
      },
      {
        "value": "Cherry Blossom Orchard in Full Bloom",
        "label": "🍒 Cherry Blossom Orchard (Sakura)"
      },
      {
        "value": "Mediterranean Lemon Grove with Sunlight Bokeh",
        "label": "🍋 Mediterranean Lemon Grove"
      },
      {
        "value": "Tropical Sandy Beach with Gentle Turquoise Waves",
        "label": "🥥 Tropical Sandy Beach & Waves"
      },
      {
        "value": "Pear Blossom Garden with Soft Morning Sunlight",
        "label": "🍐 Pear Blossom Garden"
      },
      {
        "value": "Berry Patch Meadow with Oversized Blueberries",
        "label": "🫐 Berry Patch Meadow"
      },
      {
        "value": "Lush Meadow Garden with Giant Melon Cutouts",
        "label": "🍈 Lush Meadow with Melon Cutouts"
      },
      {
        "value": "Golden Countryside Cornfield under Blue Sky",
        "label": "🌽 Golden Countryside Cornfield"
      },
      {
        "value": "Giant Woven Picnic Fruit Basket Arena",
        "label": "🧺 Giant Picnic Fruit Basket Arena"
      }
    ]
  },
  {
    "category": "✨ Magical & Studio Settings",
    "options": [
      {
        "value": "Colorful Confetti Dance Studio with Balloons",
        "label": "🎈 Confetti Dance Studio & Balloons"
      },
      {
        "value": "Pastel Rainbow Candy Land Dance Floor",
        "label": "🌈 Pastel Rainbow Candy Land"
      },
      {
        "value": "Magical Floating Fruits Sky Garden",
        "label": "☁️ Magical Floating Fruits Sky Garden"
      }
    ]
  }
];



export default function NanoProGenerator() {
  const [activeTab, setActiveTab] = useState("character");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedCaption, setIsCopiedCaption] = useState(false);
  const [aiModel, setAiModel] = useState("claude-sonnet-4-6");

  // Character Settings
  const [characterType, setCharacterType] = useState("Any / AI Decides");
  const [clothing, setClothing] = useState("Any / AI Decides");
  const [age, setAge] = useState("Any / AI Decides");
  const [nationality, setNationality] = useState("Any / AI Decides");
  const [complexion, setComplexion] = useState("Any / AI Decides");
  const [visualStyle, setVisualStyle] = useState("3D Cartoon Style");
  const [aspectRatio, setAspectRatio] = useState("9:16");

  // Scene Settings
  const [backgroundStyle, setBackgroundStyle] = useState("Any / AI Decides");

  const [customVisualStyle, setCustomVisualStyle] = useState("");
  const [customCharacterType, setCustomCharacterType] = useState("");
  const [customClothing, setCustomClothing] = useState("");
  const [customAge, setCustomAge] = useState("");
  const [customNationality, setCustomNationality] = useState("");
  const [customComplexion, setCustomComplexion] = useState("");
  const [customBackgroundStyle, setCustomBackgroundStyle] = useState("");
  const [customAspectRatio, setCustomAspectRatio] = useState("");

  // FB Post Settings
  const [fbQuoteText, setFbQuoteText] = useState("");
  const [fbCharacterStyle, setFbCharacterStyle] = useState("Chibi Anime Girl");
  const [fbColorTheme, setFbColorTheme] = useState("Pink & Black");
  const [fbLayout, setFbLayout] = useState("Character Left, Text Right");
  const [fbFormat, setFbFormat] = useState("9:16 Mobile");
  const [fbTextStyle, setFbTextStyle] = useState("Bold Chunky Display + Handwritten Mix");
  const [fbDecorations, setFbDecorations] = useState("Hearts & Sparkles");
  const [fbBackground, setFbBackground] = useState("Soft Gradient");
  const [fbMood, setFbMood] = useState("Sassy & Confident");
  const [fbAge, setFbAge] = useState("Child (6-10 yrs)");
  const [fbNationality, setFbNationality] = useState("Pakistani");
  const [fbComplexion, setFbComplexion] = useState("Fair");
  const [fbDisableQuote, setFbDisableQuote] = useState(false);
  const [fbDisableImage, setFbDisableImage] = useState(false);
  const [fbPostTitle, setFbPostTitle] = useState("");
  const [fbPostTags, setFbPostTags] = useState<string[]>([]);

  // Shayari / Song Post Settings
  const [shyQuoteText, setShyQuoteText] = useState("");
  const [shyCharacterStyle, setShyCharacterStyle] = useState("Any / AI Decides");
  const [shyArtStyle, setShyArtStyle] = useState("Cinematic Silhouette");
  const [shyColorTheme, setShyColorTheme] = useState("Moody Monochromatic");
  const [shyLayout, setShyLayout] = useState("Centered Poetry");
  const [shyFormat, setShyFormat] = useState("9:16 Mobile");
  const [shyDisableQuote, setShyDisableQuote] = useState(false);
  const [shyDisableImage, setShyDisableImage] = useState(false);
  const [shyTextStyle, setShyTextStyle] = useState("Elegant Calligraphy & Serif Mix");
  const [shyMood, setShyMood] = useState("Melancholy & Romantic");

  const [promptHistory, setPromptHistory] = useState<any[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const itemsPerPage = 5;

  const handleRandomFbQuote = () => {
    const randomIndex = Math.floor(Math.random() * FB_POST_QUOTES.length);
    setFbQuoteText(FB_POST_QUOTES[randomIndex]);
  };

  const handleRandomShayariQuote = () => {
    const randomIndex = Math.floor(Math.random() * SHAYARI_QUOTES.length);
    setShyQuoteText(SHAYARI_QUOTES[randomIndex]);
  };

  // Character Reference (Library)
  const [showCharacterLibrary, setShowCharacterLibrary] = useState(false);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [savedCharacters, setSavedCharacters] = useState<any[]>([]);
  const [referenceCharacterInfo, setReferenceCharacterInfo] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("nanoProState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.generatedPrompt) setGeneratedPrompt(parsed.generatedPrompt);
        if (parsed.characterType) setCharacterType(parsed.characterType);
        if (parsed.clothing) setClothing(parsed.clothing);
        if (parsed.age) setAge(parsed.age);
        if (parsed.nationality) setNationality(parsed.nationality);
        if (parsed.complexion) setComplexion(parsed.complexion);
        if (parsed.visualStyle) setVisualStyle(parsed.visualStyle);
        if (parsed.aspectRatio) setAspectRatio(parsed.aspectRatio);
        if (parsed.backgroundStyle) setBackgroundStyle(parsed.backgroundStyle);
        if (parsed.customAspectRatio) setCustomAspectRatio(parsed.customAspectRatio);
        if (parsed.promptHistory) setPromptHistory(parsed.promptHistory);
        if (parsed.referenceCharacterInfo) setReferenceCharacterInfo(parsed.referenceCharacterInfo);
        if (parsed.referenceImage) setReferenceImage(parsed.referenceImage);
        
        // Added for persistent AI model and tabs
        if (parsed.aiModel) setAiModel(parsed.aiModel);
        if (parsed.activeTab) setActiveTab(parsed.activeTab);

        // FB Post Settings
        if (parsed.fbQuoteText !== undefined) setFbQuoteText(parsed.fbQuoteText);
        if (parsed.fbCharacterStyle) setFbCharacterStyle(parsed.fbCharacterStyle);
        if (parsed.fbColorTheme) setFbColorTheme(parsed.fbColorTheme);
        if (parsed.fbLayout) setFbLayout(parsed.fbLayout);
        if (parsed.fbFormat) setFbFormat(parsed.fbFormat);
        if (parsed.fbTextStyle) setFbTextStyle(parsed.fbTextStyle);
        if (parsed.fbDecorations) setFbDecorations(parsed.fbDecorations);
        if (parsed.fbBackground) setFbBackground(parsed.fbBackground);
        if (parsed.fbMood) setFbMood(parsed.fbMood);
        if (parsed.fbAge) setFbAge(parsed.fbAge);
        if (parsed.fbNationality) setFbNationality(parsed.fbNationality);
        if (parsed.fbComplexion) setFbComplexion(parsed.fbComplexion);
        if (parsed.fbDisableQuote !== undefined) setFbDisableQuote(parsed.fbDisableQuote);
        if (parsed.fbDisableImage !== undefined) setFbDisableImage(parsed.fbDisableImage);
        if (parsed.fbPostTitle !== undefined) setFbPostTitle(parsed.fbPostTitle);
        if (parsed.fbPostTags) setFbPostTags(parsed.fbPostTags);

        // Shayari Post Settings
        if (parsed.shyQuoteText !== undefined) setShyQuoteText(parsed.shyQuoteText);
        if (parsed.shyCharacterStyle) setShyCharacterStyle(parsed.shyCharacterStyle);
        if (parsed.shyArtStyle) setShyArtStyle(parsed.shyArtStyle);
        if (parsed.shyColorTheme) setShyColorTheme(parsed.shyColorTheme);
        if (parsed.shyLayout) setShyLayout(parsed.shyLayout);
        if (parsed.shyFormat) setShyFormat(parsed.shyFormat);
        if (parsed.shyDisableQuote !== undefined) setShyDisableQuote(parsed.shyDisableQuote);
        if (parsed.shyDisableImage !== undefined) setShyDisableImage(parsed.shyDisableImage);
        if (parsed.shyTextStyle) setShyTextStyle(parsed.shyTextStyle);
        if (parsed.shyMood) setShyMood(parsed.shyMood);

      } catch (e) {
        console.error("Failed to parse nanoProState", e);
      }
    }
  }, []);

  useEffect(() => {
    const state = {
      generatedPrompt,
      characterType,
      clothing,
      age,
      nationality,
      complexion,
      visualStyle,
      aspectRatio,
      backgroundStyle,
      customAspectRatio,
      promptHistory,
      referenceCharacterInfo,
      referenceImage,
      aiModel,
      activeTab,
      fbQuoteText,
      fbCharacterStyle,
      fbColorTheme,
      fbLayout,
      fbFormat,
      fbTextStyle,
      fbDecorations,
      fbBackground,
      fbMood,
      fbAge,
      fbNationality,
      fbComplexion,
      fbDisableQuote,
      fbDisableImage,
      fbPostTitle,
      fbPostTags,
      shyQuoteText,
      shyCharacterStyle,
      shyArtStyle,
      shyColorTheme,
      shyLayout,
      shyFormat,
      shyDisableQuote,
      shyDisableImage,
      shyTextStyle,
      shyMood,
    };
    localStorage.setItem("nanoProState", JSON.stringify(state));
  }, [
    generatedPrompt, characterType, clothing, age, nationality, complexion, visualStyle, 
    aspectRatio, backgroundStyle, customAspectRatio, promptHistory, referenceCharacterInfo, 
    referenceImage, aiModel, activeTab, fbQuoteText, fbCharacterStyle, fbColorTheme, 
    fbLayout, fbFormat, fbTextStyle, fbDecorations, fbBackground, fbMood, fbAge, 
    fbNationality, fbComplexion, fbDisableQuote, fbDisableImage, fbPostTitle, fbPostTags, shyQuoteText, shyCharacterStyle, shyArtStyle, shyColorTheme, 
    shyLayout, shyFormat, shyDisableQuote, shyDisableImage, shyTextStyle, shyMood
  ]);

  const fetchCharacterLibrary = async () => {
    setIsLoadingLibrary(true);
    try {
      const res = await fetch("/api/characters");
      const data = await res.json();
      if (Array.isArray(data)) setSavedCharacters(data);
    } catch (error) {
      console.error("Failed to load characters", error);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const handleResetDefaults = () => {
    setVisualStyle("3D Cartoon Style");
    setAspectRatio("9:16");
    setCharacterType("Any / AI Decides");
    setClothing("Any / AI Decides");
    setAge("Any / AI Decides");
    setNationality("Any / AI Decides");
    setComplexion("Any / AI Decides");
    setBackgroundStyle("Any / AI Decides");
    setCustomVisualStyle("");
    setCustomAspectRatio("");
    setCustomCharacterType("");
    setCustomClothing("");
    setCustomAge("");
    setCustomNationality("");
    setCustomComplexion("");
    setCustomBackgroundStyle("");

    // Reset FB Post Fields
    setFbQuoteText("");
    setFbCharacterStyle("Chibi Anime Girl");
    setFbColorTheme("Pink & Black");
    setFbLayout("Character Left, Text Right");
    setFbFormat("9:16 Mobile");
    setFbTextStyle("Bold Chunky Display + Handwritten Mix");
    setFbDecorations("Hearts & Sparkles");
    setFbBackground("Soft Gradient");
    setFbMood("Sassy & Confident");
    setFbAge("Child (6-10 yrs)");
    setFbNationality("Pakistani");
    setFbComplexion("Fair");
    setFbDisableQuote(false);
    setFbDisableImage(false);
    setFbPostTitle("");
    setFbPostTags([]);

    // Reset Shayari Post Fields
    setShyQuoteText("");
    setShyCharacterStyle("Any / AI Decides");
    setShyArtStyle("Cinematic Silhouette");
    setShyColorTheme("Moody Monochromatic");
    setShyLayout("Centered Poetry");
    setShyFormat("9:16 Mobile");
    setShyDisableQuote(false);
    setShyDisableImage(false);
    setShyTextStyle("Elegant Calligraphy & Serif Mix");
    setShyMood("Melancholy & Romantic");

    localStorage.removeItem("nanoProState");
  };

  const handleCopy = async (e?: React.MouseEvent, suffix?: string) => {
    if (e) {
      e.stopPropagation();
    }
    if (!generatedPrompt) return;
    try {
      let textToCopy = generatedPrompt;
      if (activeTab === "fb-post" || activeTab === "shayari-post") {
        // For FB post and Shayari: copy title + tags + prompt together
        const parts: string[] = [];
        if (fbPostTitle) parts.push(fbPostTitle);
        if (fbPostTags.length > 0) parts.push(fbPostTags.join(" "));
        parts.push("---");
        parts.push(generatedPrompt + (suffix || ""));
        textToCopy = parts.join("\n");
      } else if (suffix) {
        textToCopy += suffix;
      }
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyCaption = async () => {
    try {
      const parts: string[] = [];
      if (fbPostTitle) parts.push(fbPostTitle);
      if (fbPostTags.length > 0) parts.push(fbPostTags.join(" "));
      await navigator.clipboard.writeText(parts.join("\n\n"));
      setIsCopiedCaption(true);
      setTimeout(() => setIsCopiedCaption(false), 2000);
    } catch (err) {
      console.error("Failed to copy caption:", err);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let res: Response;
      let parameters: Record<string, any>;

      if (activeTab === "fb-post") {
        parameters = {
          quoteText: fbQuoteText,
          characterStyle: fbCharacterStyle,
          colorTheme: fbColorTheme,
          layout: fbLayout,
          format: fbFormat,
          textStyle: fbTextStyle,
          decorations: fbDecorations,
          background: fbBackground,
          mood: fbMood,
          age: fbAge,
          nationality: fbNationality,
          complexion: fbComplexion,
          disableQuote: fbDisableQuote,
          disableImage: fbDisableImage,
        };
        res = await fetch("/api/generate-fb-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aiModel, ...parameters }),
        });
      } else if (activeTab === "shayari-post") {
        parameters = {
          quoteText: shyQuoteText,
          characterStyle: shyCharacterStyle,
          artStyle: shyArtStyle,
          colorTheme: shyColorTheme,
          layout: shyLayout,
          format: shyFormat,
          disableQuote: shyDisableQuote,
          disableImage: shyDisableImage,
          textStyle: shyTextStyle,
          mood: shyMood,
        };
        res = await fetch("/api/generate-shayari-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aiModel, ...parameters }),
        });
      } else {
        parameters = {
          visualStyle: visualStyle === "Custom" ? customVisualStyle : visualStyle,
          characterType: characterType === "Custom" ? customCharacterType : characterType,
          clothing: clothing === "Custom" ? customClothing : clothing,
          age: age === "Custom" ? customAge : age,
          nationality: nationality === "Custom" ? customNationality : nationality,
          complexion: complexion === "Custom" ? customComplexion : complexion,
          backgroundStyle: backgroundStyle === "Custom" ? customBackgroundStyle : backgroundStyle,
        };
        res = await fetch("/api/generate-nano", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            aiModel,
            ...parameters,
            aspectRatio: aspectRatio === "Custom" ? customAspectRatio : aspectRatio,
            referenceCharacterInfo
          }),
        });
      }

      const data = await res.json();
      if (data.prompt) {
        setGeneratedPrompt(data.prompt);
        // Store FB/Shayari specific fields if present
        if (activeTab === "fb-post" || activeTab === "shayari-post") {
          setFbPostTitle(data.title || "");
          setFbPostTags(Array.isArray(data.tags) ? data.tags : []);
        } else {
          setFbPostTitle("");
          setFbPostTags([]);
        }
        setPromptHistory(prev => [{ 
          prompt: data.prompt, 
          title: data.title || "",
          tags: Array.isArray(data.tags) ? data.tags : [],
          timestamp: new Date().toLocaleTimeString(),
          parameters,
          tab: activeTab,
        }, ...prev]);
        setHistoryPage(1);
      } else {
        console.error(data.error);
        setGeneratedPrompt("Error generating prompt: " + data.error);
      }
    } catch (error) {
      console.error(error);
      setGeneratedPrompt("Failed to connect to the generator API.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
      <Navbar />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-3">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>New Feature</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Nano Pro Generator
              </h1>
              <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                Create highly optimized, perfect image prompts for Nano Pro. Customize characters, environments, and cinematic styles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Settings */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Category Tabs */}
              <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1 bg-slate-900/50 rounded-xl border border-white/5">
                {["Character", "Scene"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === tab.toLowerCase() 
                        ? (generateVideo ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "bg-purple-600 text-white shadow-lg shadow-purple-900/20") 
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {tab} Settings
                  </button>
                ))}
                <button
                  onClick={() => setActiveTab("fb-post")}
                  className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "fb-post"
                      ? (generateVideo ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-900/30" : "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-900/30")
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <span>📘</span> FB Quotes
                </button>
                <button
                  onClick={() => setActiveTab("shayari-post")}
                  className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "shayari-post"
                      ? (generateVideo ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-900/30" : "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-900/30")
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <span>🥀</span> Shayari / Song
                </button>
              </div>

              {/* Settings Area (Placeholder) */}
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {activeTab === "character" ? "👤 Character Builder" :
                     activeTab === "scene" ? "🎬 Scene Builder" :
                     activeTab === "shayari-post" ? "🥀 Shayari & Song Art" :
                     activeTab === "fb-post" ? "📘 Facebook Post Image" : "✨ Nano Pro Builder"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 hover:text-white transition-colors border border-white/10"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
                    </button>
                    {activeTab === "character" && (
                      <button 
                        type="button"
                        onClick={() => { setShowCharacterLibrary(true); fetchCharacterLibrary(); }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 transition-colors border border-indigo-500/20"
                      >
                        <Library className="w-3.5 h-3.5" /> Reuse Saved Character
                      </button>
                    )}
                  </div>
                </div>

                {referenceImage && (
                  <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center gap-4">
                    <img src={referenceImage} alt="Reference" className="w-16 h-16 object-cover rounded-lg shadow-md" />
                    <div>
                      <h4 className="text-white font-bold text-sm">Character Reference Active</h4>
                      <p className="text-indigo-200 text-xs mt-1">Traits will be forcefully injected into your prompt.</p>
                      <button onClick={() => { setReferenceImage(null); setReferenceCharacterInfo(null); }} className="text-xs text-red-400 mt-2 hover:underline">
                        Remove Reference
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "character" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Visual Style */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                          Visual Style
                        </label>
                        <select
                          value={visualStyle}
                          onChange={(e) => setVisualStyle(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          {VISUAL_STYLES.map(style => (
                            <option key={style.value} value={style.value}>{style.label}</option>
                          ))}
                          <option value="Custom">Custom...</option>
                        </select>
                        {visualStyle === "Custom" && (
                          <input
                            type="text"
                            value={customVisualStyle}
                            onChange={(e) => setCustomVisualStyle(e.target.value)}
                            placeholder="e.g. Vintage 1950s comic book style..."
                            className="w-full mt-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          />
                        )}
                      </div>
                      
                      {/* Aspect Ratio */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                          Aspect Ratio
                        </label>
                        <select
                          value={aspectRatio}
                          onChange={(e) => setAspectRatio(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="9:16">9:16 (Vertical - Shorts/TikTok)</option>
                          <option value="16:9">16:9 (Horizontal - YouTube)</option>
                          <option value="1:1">1:1 (Square - Instagram)</option>
                          <option value="4:3">4:3 (Standard)</option>
                          <option value="21:9">21:9 (Ultrawide Cinematic)</option>
                          <option value="4:5">4:5 (Instagram Portrait)</option>
                          <option value="Custom">Custom...</option>
                        </select>
                        {aspectRatio === "Custom" && (
                          <input
                            type="text"
                            value={customAspectRatio}
                            onChange={(e) => setCustomAspectRatio(e.target.value)}
                            placeholder="e.g. 9:16 or 2:3..."
                            className="w-full mt-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Character Type */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                          Character Type
                        </label>
                        <select
                          value={characterType}
                          onChange={(e) => setCharacterType(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="Any / AI Decides">Any / AI Decides</option>
                          {CHARACTER_TYPE_GROUPS.map((group, idx) => (
                            <optgroup key={idx} label={group.category} className="bg-slate-900 text-slate-300 font-bold">
                              {group.options.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-slate-950 text-white font-normal">
                                  {opt.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                          <option value="Custom">Custom...</option>
                        </select>
                        {characterType === "Custom" && (
                          <input
                            type="text"
                            value={customCharacterType}
                            onChange={(e) => setCustomCharacterType(e.target.value)}
                            placeholder="e.g. Candy boy..."
                            className="w-full mt-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          />
                        )}
                      </div>

                      {/* Clothing / Dressing */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                          Clothing / Dressing
                        </label>
                        <select
                          value={clothing}
                          onChange={(e) => setClothing(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="Any / AI Decides">Any / AI Decides</option>
                          {CLOTHING_GROUPS.map((group, idx) => (
                            <optgroup key={idx} label={group.category} className="bg-slate-900 text-slate-300 font-bold">
                              {group.options.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-slate-950 text-white font-normal">
                                  {opt.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                          <option value="Custom">Custom...</option>
                        </select>
                        {clothing === "Custom" && (
                          <input
                            type="text"
                            value={customClothing}
                            onChange={(e) => setCustomClothing(e.target.value)}
                            placeholder="e.g. Red hoodie and blue jeans..."
                            className="w-full mt-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Age */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                          Age
                        </label>
                        <select
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="Any / AI Decides">Any / AI Decides</option>
                          {AGE_GROUPS.map((group, idx) => (
                            <optgroup key={idx} label={group.category} className="bg-slate-900 text-slate-300 font-bold">
                              {group.options.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-slate-950 text-white font-normal">
                                  {opt.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                          <option value="Custom">Custom...</option>
                        </select>
                        {age === "Custom" && (
                          <input
                            type="text"
                            value={customAge}
                            onChange={(e) => setCustomAge(e.target.value)}
                            placeholder="e.g. Around 40 but looks 20..."
                            className="w-full mt-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          />
                        )}
                      </div>

                      {/* Nationality / Ethnicity */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                          Nationality / Ethnicity
                        </label>
                        <select
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="Any / AI Decides">Any / AI Decides</option>
                          {NATIONALITY_GROUPS.map((group, idx) => (
                            <optgroup key={idx} label={group.category} className="bg-slate-900 text-slate-300 font-bold">
                              {group.options.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-slate-950 text-white font-normal">
                                  {opt.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                          <option value="Custom">Custom...</option>
                        </select>
                        {nationality === "Custom" && (
                          <input
                            type="text"
                            value={customNationality}
                            onChange={(e) => setCustomNationality(e.target.value)}
                            placeholder="e.g. Cybernetic Martian..."
                            className="w-full mt-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Skin Tone / Complexion */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                          Skin Tone / Complexion
                        </label>
                        <select
                          value={complexion}
                          onChange={(e) => setComplexion(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="Any / AI Decides">Any / AI Decides</option>
                          {COMPLEXION_GROUPS.map((group, idx) => (
                            <optgroup key={idx} label={group.category} className="bg-slate-900 text-slate-300 font-bold">
                              {group.options.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-slate-950 text-white font-normal">
                                  {opt.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                          <option value="Custom">Custom...</option>
                        </select>
                        {complexion === "Custom" && (
                          <input
                            type="text"
                            value={customComplexion}
                            onChange={(e) => setCustomComplexion(e.target.value)}
                            placeholder="e.g. Pale with freckles..."
                            className="w-full mt-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          />
                        )}
                      </div>
                      
                      {/* Background Style */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                          Background Style
                        </label>
                        <select
                          value={backgroundStyle}
                          onChange={(e) => setBackgroundStyle(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="Any / AI Decides">Any / AI Decides</option>
                          {BACKGROUND_GROUPS.map((group, idx) => (
                            <optgroup key={idx} label={group.category} className="bg-slate-900 text-slate-300 font-bold">
                              {group.options.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-slate-950 text-white font-normal">
                                  {opt.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                          <option value="Custom">Custom...</option>
                        </select>
                        {backgroundStyle === "Custom" && (
                          <input
                            type="text"
                            value={customBackgroundStyle}
                            onChange={(e) => setCustomBackgroundStyle(e.target.value)}
                            placeholder="e.g. A busy futuristic street..."
                            className="w-full mt-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          />
                        )}
                      </div>
                    </div>
                  </div>) : activeTab === "fb-post" ? (
                  <div className="space-y-5">

                    {/* Quote / Message Text */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                          Quote / Message Text
                          <span className="ml-2 text-pink-400 font-normal normal-case hidden sm:inline">(the text that appears in the image)</span>
                        </label>
                        <button 
                          onClick={handleRandomFbQuote}
                          className="text-[10px] font-bold uppercase tracking-widest text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 px-2 py-1 rounded transition-colors"
                        >
                          🎲 Random Preset
                        </button>
                      </div>
                      <textarea
                        value={fbQuoteText}
                        onChange={(e) => setFbQuoteText(e.target.value)}
                        placeholder={`e.g. "Don't touch my phone. It's mine! 💕" or leave blank for AI to create`}
                        rows={3}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none"
                        disabled={fbDisableQuote}
                      />
                      <div className="flex gap-4 items-center">
                        <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit group">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${fbDisableQuote ? 'bg-pink-500 border-pink-500' : 'border-slate-600 group-hover:border-pink-500/50'}`}>
                            {fbDisableQuote && <span className="text-white text-[10px] font-bold">✓</span>}
                          </div>
                          <span className="text-xs font-semibold text-slate-300 group-hover:text-pink-300 transition-colors">Disable Quote</span>
                          <input type="checkbox" checked={fbDisableQuote} onChange={(e) => setFbDisableQuote(e.target.checked)} className="hidden" />
                        </label>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit group">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${fbDisableImage ? 'bg-pink-500 border-pink-500' : 'border-slate-600 group-hover:border-pink-500/50'}`}>
                            {fbDisableImage && <span className="text-white text-[10px] font-bold">✓</span>}
                          </div>
                          <span className="text-xs font-semibold text-slate-300 group-hover:text-pink-300 transition-colors">Disable Image</span>
                          <input type="checkbox" checked={fbDisableImage} onChange={(e) => setFbDisableImage(e.target.checked)} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Character Style */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Character Style</label>
                        <select
                          value={fbCharacterStyle}
                          onChange={(e) => setFbCharacterStyle(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          <option value="Chibi Anime Girl">Chibi Anime Girl (Big eyes, tiny body)</option>
                          <option value="Chibi Anime Boy">Chibi Anime Boy (Big eyes, tiny body)</option>
                          <option value="3D Cartoon Doll Girl">3D Cartoon Doll Girl (Pixar-like)</option>
                          <option value="3D Cartoon Doll Boy">3D Cartoon Doll Boy (Pixar-like)</option>
                          <option value="3D Cartoon Islamic Girl (Hijab)">3D Cartoon Islamic Girl (Hijab)</option>
                          <option value="3D Cartoon Islamic Boy (Kufi)">3D Cartoon Islamic Boy (Kufi/Thobe)</option>
                          <option value="3D Cartoon Korean Girl">3D Cartoon Korean Girl (K-Pop Style)</option>
                          <option value="3D Cartoon Korean Boy">3D Cartoon Korean Boy (K-Pop Style)</option>
                          <option value="Handsome Anime Boy">Handsome Anime Boy (Cool & Stylish)</option>
                          <option value="Cute Gamer Boy">Cute Gamer Boy (Headphones, Hoodie)</option>
                          <option value="3D Cartoon Desi Boy">3D Cartoon Desi Boy (Kurta/Shalwar Kameez)</option>
                          <option value="Streetwear Swag Boy">Streetwear Swag Boy (Cap, Sneakers, Jacket)</option>
                          <option value="Sad Heartbroken Boy">Sad/Heartbroken Boy (Moody, Aesthetic)</option>
                          <option value="Cute Little Chibi Doll">Cute Little Chibi Doll (Gender-neutral)</option>
                          <option value="Stylized Illustration Girl">Stylized Illustration Girl (Flat art)</option>
                          <option value="Stylized Illustration Boy">Stylized Illustration Boy (Flat art)</option>
                          <option value="Realistic Cute Baby Doll">Realistic Cute Baby Doll</option>
                          <option value="No Character - Text Only">No Character – Text Only</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                      {/* Mood / Attitude */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Mood / Attitude</label>
                        <select
                          value={fbMood}
                          onChange={(e) => setFbMood(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          <option value="Sassy & Confident">😎 Sassy & Confident</option>
                          <option value="Cute & Playful">🌸 Cute & Playful</option>
                          <option value="Motivational & Empowering">💪 Motivational & Empowering</option>
                          <option value="Chill & Unbothered">😌 Chill & Unbothered</option>
                          <option value="Happy & Joyful">😄 Happy & Joyful</option>
                          <option value="Angry & Protective">😤 Angry & Protective</option>
                          <option value="Sad & Emotional">😢 Sad & Emotional</option>
                          <option value="Mysterious & Cool">🕶️ Mysterious & Cool</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Character Age */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Character Age</label>
                        <select
                          value={fbAge}
                          onChange={(e) => setFbAge(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          <option value="Baby / Toddler (1-3 yrs)">👶 Baby / Toddler (1–3 yrs)</option>
                          <option value="Child (4-7 yrs)">🧒 Child (4–7 yrs)</option>
                          <option value="Child (6-10 yrs)">🧒 Child (6–10 yrs)</option>
                          <option value="Preteen (10-12 yrs)">🧑 Preteen (10–12 yrs)</option>
                          <option value="Teen (13-16 yrs)">🧑‍🦱 Teen (13–16 yrs)</option>
                          <option value="Young Adult (18-25 yrs)">👩 Young Adult (18–25 yrs)</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                      {/* Nationality / Ethnicity */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Nationality / Ethnicity</label>
                        <select
                          value={fbNationality}
                          onChange={(e) => setFbNationality(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          <optgroup label="South Asian">
                            <option value="Pakistani">🇵🇰 Pakistani</option>
                            <option value="Indian">🇮🇳 Indian</option>
                            <option value="Bangladeshi">🇧🇩 Bangladeshi</option>
                            <option value="Sri Lankan">🇱🇰 Sri Lankan</option>
                          </optgroup>
                          <optgroup label="Middle Eastern">
                            <option value="Arab / Middle Eastern">🇸🇦 Arab / Middle Eastern</option>
                            <option value="Turkish">🇹🇷 Turkish</option>
                            <option value="Persian / Iranian">🇮🇷 Persian / Iranian</option>
                          </optgroup>
                          <optgroup label="East Asian">
                            <option value="Korean">🇰🇷 Korean</option>
                            <option value="Japanese">🇯🇵 Japanese</option>
                            <option value="Chinese">🇨🇳 Chinese</option>
                          </optgroup>
                          <optgroup label="Western">
                            <option value="American / Western">🇺🇸 American / Western</option>
                            <option value="European">🇪🇺 European</option>
                            <option value="Latin / Hispanic">🌎 Latin / Hispanic</option>
                          </optgroup>
                          <optgroup label="African">
                            <option value="African">🌍 African</option>
                          </optgroup>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Complexion / Skin Tone */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Complexion / Skin Tone</label>
                        <select
                          value={fbComplexion}
                          onChange={(e) => setFbComplexion(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          <option value="Fair">Fair / Light Skin</option>
                          <option value="Wheatish">Wheatish / Medium Skin</option>
                          <option value="Olive">Olive / Tanned Skin</option>
                          <option value="Brown">Brown / Dark Skin</option>
                          <option value="Black">Black / Very Dark Skin</option>
                          <option value="Pale">Pale / Porcelain</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Color Theme */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Color Theme</label>
                        <select
                          value={fbColorTheme}
                          onChange={(e) => setFbColorTheme(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          <option value="Pink & Black">🩷 Pink & Black (Girly Glam)</option>
                          <option value="Teal & White">🩵 Teal & White (Fresh & Clean)</option>
                          <option value="Green & Cream">💚 Green & Cream (Natural)</option>
                          <option value="Black & White">🖤 Black & White (Edgy Minimal)</option>
                          <option value="Purple & Gold">💜 Purple & Gold (Royal)</option>
                          <option value="Red & White">❤️ Red & White (Bold Love)</option>
                          <option value="Blue & Pink">💙 Blue & Pink (Kawaii Pastel)</option>
                          <option value="Yellow & Black">💛 Yellow & Black (Energetic)</option>
                          <option value="Rainbow / Multicolor">🌈 Rainbow / Multicolor</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                      {/* Text Typography Style */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Typography Style</label>
                        <select
                          value={fbTextStyle}
                          onChange={(e) => setFbTextStyle(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          <option value="Bold Chunky Display + Handwritten Mix">Bold Chunky + Handwritten Mix</option>
                          <option value="Glitter 3D Metallic Letters">✨ Glitter 3D Metallic Letters</option>
                          <option value="Stitched / Embroidery Effect Letters">🧵 Stitched Embroidery Letters</option>
                          <option value="Graffiti / Street Art Font">🎨 Graffiti / Street Art</option>
                          <option value="Clean Sans-Serif Modern">🔤 Clean Sans-Serif Modern</option>
                          <option value="Handwritten Brush Script">✍️ Handwritten Brush Script</option>
                          <option value="Highlighted Keywords with Pastel Boxes">🖍️ Highlighted Keyword Boxes</option>
                          <option value="Mixed Sizes - Large Key Words Small Others">Mixed Sizes (Large Keywords)</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Layout */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Layout</label>
                        <select
                          value={fbLayout}
                          onChange={(e) => setFbLayout(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          <option value="Character Left, Text Right">Character Left, Text Right</option>
                          <option value="Character Right, Text Left">Character Right, Text Left</option>
                          <option value="Text Top, Character Bottom">Text Top, Character Bottom</option>
                          <option value="Character Bottom, Text Top Full Width">Character Bottom, Text Top Full Width</option>
                          <option value="Character Center with Text Surrounding">Character Center, Text Surrounding</option>
                          <option value="Full Background Character with Overlaid Text">Full BG Character + Text Overlay</option>
                          <option value="Text Only - No Character">Text Only (No Character)</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                      {/* Format */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Format / Aspect Ratio</label>
                        <select
                          value={fbFormat}
                          onChange={(e) => setFbFormat(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          <option value="9:16 Mobile">📱 9:16 Mobile / Stories (Recommended)</option>
                          <option value="4:5 Portrait">📸 4:5 Portrait (Facebook Feed)</option>
                          <option value="1:1 Square">⬜ 1:1 Square (Instagram/Facebook)</option>
                          <option value="16:9 Desktop">🖥️ 16:9 Desktop / Landscape</option>
                        </select>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Background */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Background</label>
                        <select
                          value={fbBackground}
                          onChange={(e) => setFbBackground(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          <option value="Soft Gradient">🌅 Soft Gradient</option>
                          <option value="Textured Painted Canvas">🎨 Textured Painted Canvas</option>
                          <option value="Clean White / Minimal">⬜ Clean White / Minimal</option>
                          <option value="Bokeh Blurred">✨ Bokeh Blurred</option>
                          <option value="Glitter / Sparkle Pattern">💎 Glitter / Sparkle Pattern</option>
                          <option value="Watercolor Wash">🖌️ Watercolor Wash</option>
                          <option value="Solid Bold Color">🟥 Solid Bold Color</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                      {/* Decorative Elements */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Decorative Elements</label>
                        <select
                          value={fbDecorations}
                          onChange={(e) => setFbDecorations(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          <option value="Hearts & Sparkles">💕 Hearts & Sparkles</option>
                          <option value="Butterflies & Flowers">🦋 Butterflies & Flowers</option>
                          <option value="Stars & Crowns">⭐ Stars & Crowns</option>
                          <option value="Doodles & Hand-drawn Icons">✏️ Doodles & Hand-drawn Icons</option>
                          <option value="Balloons & Confetti">🎈 Balloons & Confetti</option>
                          <option value="Lightning Bolts & Fire">⚡ Lightning & Fire</option>
                          <option value="Minimal - No Decorations">✖️ Minimal – No Decorations</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                    </div>

                    {/* Style reference note */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-pink-500/5 border border-pink-500/20">
                      <span className="text-pink-400 text-lg mt-0.5">💡</span>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Prompts are optimized for <span className="text-pink-300 font-semibold">Facebook post images</span> in the style of viral cute cartoon/chibi character posts — bold integrated typography, vibrant color themes, floating decorative elements, and attitude-filled quotes.
                      </p>
                    </div>

                  </div>
                ) : activeTab === "shayari-post" ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    
                    {/* Lyric / Shayari Text */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                          Poetry / Lyric Text
                          <span className="ml-2 text-rose-400 font-normal normal-case hidden sm:inline">(the text to display in the image)</span>
                        </label>
                        <button 
                          onClick={handleRandomShayariQuote}
                          className="text-[10px] font-bold uppercase tracking-widest text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-2 py-1 rounded transition-colors"
                        >
                          🎲 Random Preset
                        </button>
                      </div>
                      <textarea
                        value={shyQuoteText}
                        onChange={(e) => setShyQuoteText(e.target.value)}
                        placeholder={`e.g. "Tere bina zindagi adhoori lagti hai..." or leave blank for AI to create`}
                        rows={3}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                        disabled={shyDisableQuote}
                      />
                      <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit group">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${shyDisableQuote ? 'bg-rose-500 border-rose-500' : 'border-slate-600 group-hover:border-rose-500/50'}`}>
                          {shyDisableQuote && <span className="text-white text-[10px] font-bold">✓</span>}
                        </div>
                        <input
                          type="checkbox"
                          checked={shyDisableQuote}
                          onChange={(e) => setShyDisableQuote(e.target.checked)}
                          className="hidden"
                        />
                        <span className="text-xs font-semibold text-slate-300 group-hover:text-rose-300 transition-colors">
                          Disable Quote (Image Only)
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Art Style */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Art Style</label>
                        <select
                          value={shyArtStyle}
                          onChange={(e) => setShyArtStyle(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                        >
                          <option value="Cinematic Silhouette">Cinematic Silhouette</option>
                          <option value="Moody Rain & Window Drops">Moody Rain & Window Drops</option>
                          <option value="Double Exposure Nature">Double Exposure Nature</option>
                          <option value="Soft Ethereal Watercolor">Soft Ethereal Watercolor</option>
                          <option value="Vintage Film & Light Leaks">Vintage Film & Light Leaks</option>
                          <option value="Neon City Reflections">Neon City Reflections</option>
                          <option value="Minimalist Line Art">Minimalist Line Art</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                      {/* Mood / Feeling */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Mood / Feeling</label>
                        <select
                          value={shyMood}
                          onChange={(e) => setShyMood(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                        >
                          <option value="Melancholy & Romantic">🥀 Melancholy & Romantic</option>
                          <option value="Deep & Philosophical">🌙 Deep & Philosophical</option>
                          <option value="Heartbroken & Solitary">🌧️ Heartbroken & Solitary</option>
                          <option value="Peaceful & Ethereal">✨ Peaceful & Ethereal</option>
                          <option value="Nostalgic & Warm">🕰️ Nostalgic & Warm</option>
                          <option value="Passionate & Intense">🔥 Passionate & Intense</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Color Theme */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Color Theme</label>
                        <select
                          value={shyColorTheme}
                          onChange={(e) => setShyColorTheme(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                        >
                          <option value="Moody Monochromatic">🖤 Moody Monochromatic (B&W)</option>
                          <option value="Deep Blues & Cyan">🌌 Deep Blues & Cyan</option>
                          <option value="Warm Golden Hour">🌇 Warm Golden Hour</option>
                          <option value="Faded Vintage Sepia">🎞️ Faded Vintage Sepia</option>
                          <option value="Dark Reds & Shadows">🍷 Dark Reds & Shadows</option>
                          <option value="Muted Pastels">🌸 Muted Pastels</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                      {/* Typography Style */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Typography Style</label>
                        <select
                          value={shyTextStyle}
                          onChange={(e) => setShyTextStyle(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                        >
                          <option value="Elegant Calligraphy & Serif Mix">Elegant Calligraphy & Serif Mix</option>
                          <option value="Delicate Handwritten Script">Delicate Handwritten Script</option>
                          <option value="Vintage Typewriter Ink">Vintage Typewriter Ink</option>
                          <option value="Glowing Neon Sign">Glowing Neon Sign</option>
                          <option value="Faded Distressed Stencil">Faded Distressed Stencil</option>
                          <option value="Clean Minimalist Sans">Clean Minimalist Sans</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Layout */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Layout / Composition</label>
                        <select
                          value={shyLayout}
                          onChange={(e) => setShyLayout(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                        >
                          <option value="Centered Poetry">Centered Poetry</option>
                          <option value="Text in Negative Space (Sky/Water)">Text in Negative Space</option>
                          <option value="Split Screen: Art Top, Text Bottom">Split Screen: Art Top, Text Bottom</option>
                          <option value="Text Overlaid on Silhouettes">Text Overlaid on Silhouettes</option>
                          <option value="Any / AI Decides">Any / AI Decides</option>
                        </select>
                      </div>

                      {/* Format */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Format / Aspect Ratio</label>
                        <select
                          value={shyFormat}
                          onChange={(e) => setShyFormat(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                        >
                          <option value="9:16 Mobile">📱 9:16 Mobile / Reels</option>
                          <option value="4:5 Portrait">📸 4:5 Portrait</option>
                          <option value="1:1 Square">⬜ 1:1 Square</option>
                          <option value="16:9 Desktop">🖥️ 16:9 Desktop</option>
                        </select>
                      </div>

                    </div>

                    {/* Style reference note */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                      <span className="text-rose-400 text-lg mt-0.5">🥀</span>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Prompts are optimized for <span className="text-rose-300 font-semibold">poetic and artistic imagery</span> (like Shayari or Song Lyric posts) — featuring atmospheric moods, elegant typography, and highly aesthetic compositions.
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/20">
                    <div className="p-4 bg-slate-800/50 rounded-full">
                      <Sparkles className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-slate-300 font-medium">Work in Progress</h3>
                      <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                        The comprehensive parameter panels for {activeTab} are being actively developed.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Output */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-xl">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  AI Model
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="claude-sonnet-4-6">Claude 4.6 Sonnet (Most Capable)</option>
                  <option value="claude-sonnet-4-5-20250929">Claude 4.5 Sonnet (Legacy)</option>
                  <option value="claude-haiku-4-5-20251001">Claude 4.5 Haiku (Fastest)</option>
                  <option value="claude-opus-4-6">Claude 4.6 Opus (Complex Reasoning)</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full flex items-center justify-center gap-2 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 ${
                  activeTab === "fb-post"
                    ? (generateVideo ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-900/20" : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-900/20")
                    : activeTab === "shayari-post"
                    ? (generateVideo ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-900/20" : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-900/20")
                    : (generateVideo ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-900/20" : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/20")
                }`}
              >
                {isGenerating ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : activeTab === "fb-post" ? (
                  <span className="text-lg">📘</span>
                ) : activeTab === "shayari-post" ? (
                  <span className="text-lg">🥀</span>
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {isGenerating ? "Synthesizing Prompt..." : activeTab === "fb-post" ? "Generate FB Post Prompt" : activeTab === "shayari-post" ? "Generate Poetry Art Prompt" : "Generate Prompt"}
              </button>

              <div className={`bg-slate-900/60 border ${generateVideo ? 'border-blue-500/30' : 'border-purple-500/30'} rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden group`}>
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${generateVideo ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-indigo-500'}`}></div>
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                    Generated Output
                    {generatedPrompt && <span className="text-[10px] text-slate-500 font-normal">(click to copy)</span>}
                  </h3>
                  <div className="flex gap-2">
                    {generatedPrompt && (
                      <div className="flex gap-2 items-center flex-wrap">
                        <button
                          onClick={(e) => handleCopy(e)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            isCopied
                              ? "bg-green-500/20 border-green-500/40 text-green-400"
                              : activeTab === "fb-post"
                              ? "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30 text-pink-300 hover:text-white"
                              : activeTab === "shayari-post"
                              ? "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-300 hover:text-white"
                              : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white"
                          }`}
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {isCopied ? "✓ Copied!" : (activeTab === "fb-post" || activeTab === "shayari-post") ? "Copy All" : "Copy Prompt"}
                        </button>
                        
                        <button
                          onClick={(e) => handleCopy(e, " crop_16_9 16:9")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-300 hover:text-white"
                          title="Copy with 16:9 aspect ratio"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          16:9
                        </button>
                        <button
                          onClick={(e) => handleCopy(e, " crop_9_16 9:16")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-300 hover:text-white"
                          title="Copy with 9:16 aspect ratio"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          9:16
                        </button>
                      </div>
                    )}
                    <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Reset All">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="History">
                      <Clock className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* FB Post / Shayari: Social Title & Tags */}
                {(activeTab === "fb-post" || activeTab === "shayari-post") && (fbPostTitle || fbPostTags.length > 0) && (
                  <div className={`mb-3 p-3.5 rounded-xl border space-y-2.5 relative ${
                    activeTab === "shayari-post" ? "bg-rose-950/30 border-rose-500/20" : "bg-pink-950/30 border-pink-500/20"
                  }`}>
                    <button
                      onClick={handleCopyCaption}
                      className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all border ${
                        isCopiedCaption
                          ? "bg-green-500/20 border-green-500/40 text-green-400"
                          : activeTab === "shayari-post"
                          ? "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-300 hover:text-white"
                          : "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30 text-pink-300 hover:text-white"
                      }`}
                    >
                      <Copy className="w-3 h-3" />
                      {isCopiedCaption ? "✓ Copied!" : "Copy Text"}
                    </button>
                    {fbPostTitle && (
                      <div className="pr-20">
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                          activeTab === "shayari-post" ? "text-rose-400" : "text-pink-400"
                        }`}>📢 Post Caption / Title</span>
                        <p className={`text-sm leading-snug font-medium ${
                          activeTab === "shayari-post" ? "text-rose-100" : "text-pink-100"
                        }`}>{fbPostTitle}</p>
                      </div>
                    )}
                    {fbPostTags.length > 0 && (
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${
                          activeTab === "shayari-post" ? "text-rose-400" : "text-pink-400"
                        }`}>🏷️ Hashtags</span>
                        <div className="flex flex-wrap gap-2">
                          {fbPostTags.map((tag, i) => (
                            <span key={i} className={`text-xs font-bold border rounded-lg px-2.5 py-1 ${
                              activeTab === "shayari-post" ? "text-rose-300 bg-rose-500/10 border-rose-500/20" : "text-pink-300 bg-pink-500/10 border-pink-500/20"
                            }`}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-500 italic">☝️ "Copy All" copies caption + tags + image prompt together</p>
                  </div>
                )}

                {/* Prompt text box */}
                <div
                  onClick={(e) => handleCopy(e)}
                  title={generatedPrompt ? "Click to copy" : undefined}
                  className={`bg-black/40 rounded-xl p-4 min-h-[200px] border border-white/5 font-mono text-sm text-purple-200/90 leading-relaxed shadow-inner transition-colors ${
                    generatedPrompt ? "cursor-pointer hover:bg-black/60 hover:border-purple-500/20 active:scale-[0.995]" : ""
                  }`}
                >
                  {activeTab === "fb-post" && generatedPrompt ? (
                    <>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-2">🖼️ Image Prompt</span>
                      {generatedPrompt}
                    </>
                  ) : (
                    generatedPrompt || <span className="text-slate-600 italic">Your generated Nano Pro prompt will appear here...</span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* History Section */}
          {promptHistory.length > 0 && (
            <div className="mt-12 bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Prompt History</h2>
              </div>
              <div className="space-y-4">
                {promptHistory.slice((historyPage - 1) * itemsPerPage, historyPage * itemsPerPage).map((item, index) => (
                  <div key={index} className="bg-black/40 rounded-xl p-4 border border-white/5 relative group">
                    <div className="text-xs text-slate-500 mb-3 font-mono">{item.timestamp}</div>
                    {item.parameters && (
                      <div className="flex flex-wrap gap-2 mb-3 pr-12">
                        {Object.entries(item.parameters || {}).map(([key, value]) => {
                          if (!value || value === "Any / AI Decides") return null;
                          return (
                            <span key={key} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">
                              {key.replace(/([A-Z])/g, ' $1').trim()}: {String(value)}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Social Title & Tags in History */}
                    {(item.title || (item.tags && item.tags.length > 0)) && (
                      <div className="mb-3 p-3 rounded-xl bg-purple-950/20 border border-purple-500/10 space-y-2 pr-12">
                        {item.title && (
                          <div>
                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">📢 Post Caption / Title</span>
                            <p className="text-sm text-purple-200 leading-snug font-medium">{item.title}</p>
                          </div>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag: string, i: number) => (
                              <span key={i} className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-md px-2 py-0.5">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="font-mono text-sm text-purple-200/90 leading-relaxed pr-12">
                      {item.prompt}
                    </div>
                    <button 
                      onClick={async () => {
                        let textToCopy = item.prompt;
                        if (item.title || (item.tags && item.tags.length > 0)) {
                          const parts: string[] = [];
                          if (item.title) parts.push(item.title);
                          if (item.tags && item.tags.length > 0) parts.push(item.tags.join(" "));
                          parts.push("---");
                          parts.push(item.prompt);
                          textToCopy = parts.join("\n");
                        }
                        await navigator.clipboard.writeText(textToCopy);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy All to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {promptHistory.length > itemsPerPage && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                  <span className="text-sm text-slate-500">
                    Showing {(historyPage - 1) * itemsPerPage + 1}-{Math.min(historyPage * itemsPerPage, promptHistory.length)} of {promptHistory.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                      disabled={historyPage === 1}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 rounded-lg text-sm text-slate-300 transition-colors"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => setHistoryPage(p => Math.min(Math.ceil(promptHistory.length / itemsPerPage), p + 1))}
                      disabled={historyPage === Math.ceil(promptHistory.length / itemsPerPage)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 rounded-lg text-sm text-slate-300 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Character Library Modal */}
      {showCharacterLibrary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                📚 Character Library
              </h3>
              <button onClick={() => setShowCharacterLibrary(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1">
              {isLoadingLibrary ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  <span className="text-slate-400 text-sm">Loading characters...</span>
                </div>
              ) : savedCharacters.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>No characters saved yet.</p>
                  <p className="text-sm mt-2">Upload an image in the Idea Generator to save your first character!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {savedCharacters.map((char) => (
                    <div 
                      key={char.id} 
                      onClick={() => {
                        setReferenceImage(char.imageUrl);
                        setReferenceCharacterInfo(char.description);
                        setShowCharacterLibrary(false);
                      }}
                      className="group cursor-pointer bg-black/40 rounded-xl border border-white/5 hover:border-indigo-500/50 transition-all overflow-hidden flex flex-col"
                    >
                      <div className="aspect-square overflow-hidden relative">
                        <img 
                          src={char.imageUrl} 
                          alt={char.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-white text-xs font-bold truncate">{char.name}</p>
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
