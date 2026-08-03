"use client";

import React, { useState } from "react";
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
  Trash2,
  Heart,
  FileVideo,
  Edit3,
  Search,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const LANGUAGE_OPTIONS = ["English", "Hindi", "Urdu", "Roman Urdu", "Punjabi"];
const VISUAL_STYLES = [
  "3D Cartoon",
  "3D Cartoon Style",
  "Anime",
  "Realistic",
  "Watercolor",
  "Comic Book",
  "Dark Fantasy",
  "Retro 80s",
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
}

export default function IdeasPage() {
  const { showToast } = useToast();

  // Generation controls
  const [category, setCategory] = useState<CategoryId>("FUNNY");
  const [language, setLanguage] = useState("Urdu");
  const [visualStyle, setVisualStyle] = useState("3D Cartoon Style");
  const [videoDuration, setVideoDuration] = useState<number>(8);
  const [customDialogue, setCustomDialogue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggestingDialogue, setIsSuggestingDialogue] = useState(false);

  const handleSuggestDialogue = async () => {
    if (category === "CARBOX") return;
    setIsSuggestingDialogue(true);
    try {
      const res = await fetch("/api/suggest-dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, language, customIdea, kidsAge, kidsHealth }),
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
  const [kidsAge, setKidsAge] = useState("Toddler (2-4 yrs)");
  const [kidsHealth, setKidsHealth] = useState("Healthy & Energetic");
  const [characterSetup, setCharacterSetup] = useState("One Cute Little Girl");
  const [kidsNationality, setKidsNationality] = useState("Global / Any");
  
  // Carbox specific options
  const [carboxBrand, setCarboxBrand] = useState("Premium BMW");
  const [carboxColor, setCarboxColor] = useState("Glossy Black");
  const [carboxPackaging, setCarboxPackaging] = useState("Elegant Retail Box");
  const [carboxBackground, setCarboxBackground] = useState("Clean White Studio Tabletop");
  
  // Custom Idea Optimization
  const [customIdea, setCustomIdea] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedData, setOptimizedData] = useState<{title: string, scenes: {sceneNumber: number, content: string}[]} | null>(null);
  const [activeSceneTab, setActiveSceneTab] = useState(1);
  // Saved ideas
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("flow-saved-ideas");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Copied state tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter
  const [filterCategory, setFilterCategory] = useState<CategoryId | "ALL" | "FAVORITES">("ALL");

  // Editable Filename state
  const [editingFileNameId, setEditingFileNameId] = useState<string | null>(null);
  const [editingFileNameText, setEditingFileNameText] = useState("");

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

  const handleSaveFileName = (id: string) => {
    let formatted = editingFileNameText.trim().replace(/\.mp4$/i, "");
    if (!formatted) {
      setEditingFileNameId(null);
      return;
    }
    const updated = savedIdeas.map((i) =>
      i.id === id ? { ...i, videoFileName: formatted } : i
    );
    saveToStorage(updated);
    setEditingFileNameId(null);
    showToast(`Video name saved as "${formatted}"`, "success");
  };

  const saveToStorage = (ideas: SavedIdea[]) => {
    setSavedIdeas(ideas);
    localStorage.setItem("flow-saved-ideas", JSON.stringify(ideas));
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
        body: JSON.stringify({ rawIdea: customIdea }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to optimize idea");
      }
      setOptimizedData(data.optimized);
      setActiveSceneTab(1);
      showToast("Idea optimized successfully!", "success");
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
        body: JSON.stringify({ category, language, visualStyle, videoDuration, customDialogue, kidsAge, kidsHealth, characterSetup, kidsNationality, carboxBrand, carboxColor, carboxPackaging, carboxBackground }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.reason || data.error || "Failed to generate ideas");
      }
      
      const newIdeas: SavedIdea[] = data.ideas.map((text: string) => {
        const id = Date.now().toString() + Math.random().toString(36).slice(2);
        const cleanBrand = carboxBrand.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").slice(0, 12);
        const cleanId = id.slice(-4);
        const videoFileName = category === "CARBOX" 
          ? `carbox_${cleanBrand}_${cleanId}`
          : `${category.toLowerCase()}_${cleanId}`;
        return {
          id,
          text,
          category,
          language,
          visualStyle,
          createdAt: new Date().toISOString(),
          videoFileName,
        };
      });
      
      const updated = [...newIdeas, ...savedIdeas];
      saveToStorage(updated);
      
      showToast(`Generated and saved ${data.ideas.length} idea!`, "success");
    } catch (e: any) {
      showToast(e.message || "Failed to generate ideas", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteIdea = (id: string) => {
    const updated = savedIdeas.filter((i) => i.id !== id);
    saveToStorage(updated);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = savedIdeas.map((i) => 
      i.id === id ? { ...i, isFavorite: !i.isFavorite } : i
    );
    saveToStorage(updated);
  };

  const handleCopy = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      showToast("Copied to clipboard!", "success");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Search Query state
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered & paginated saved ideas (matches category filter AND video filename/prompt search)
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

  const totalPages = Math.max(1, Math.ceil(filteredIdeas.length / ITEMS_PER_PAGE));
  const paginatedIdeas = filteredIdeas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const categoryEntries = Object.values(CATEGORIES);

  return (
    <div className="min-h-screen bg-[#090b10] text-gray-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 tracking-tight">
            <Lightbulb className="w-8 h-8 text-amber-400" />
            AI Idea Generator
          </h1>
          <p className="text-sm text-gray-400">
            Generate story ideas with Claude AI, save them, and copy-paste into the video creator.
          </p>
        </div>

        {/* Custom Idea Optimizer */}
        <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Optimize Custom Idea (e.g. from ChatGPT)
          </h2>
          
          <div className="space-y-3">
            <textarea
              value={customIdea}
              onChange={(e) => setCustomIdea(e.target.value)}
              placeholder="Paste your raw story idea here..."
              className="w-full h-32 px-4 py-3 rounded-xl bg-black/50 border border-gray-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
            <button
              onClick={handleOptimize}
              disabled={isOptimizing || !customIdea.trim()}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isOptimizing ? "Optimizing & Splitting into Scenes..." : "Rewrite & Optimize into Video Script"}
            </button>
          </div>

          {optimizedData && (
            <div className="mt-6 space-y-4 pt-6 border-t border-gray-800">
              <h3 className="text-lg font-bold text-emerald-400">
                {optimizedData.title}
              </h3>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {optimizedData.scenes.map((scene) => (
                  <button
                    key={scene.sceneNumber}
                    onClick={() => setActiveSceneTab(scene.sceneNumber)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeSceneTab === scene.sceneNumber
                        ? "bg-emerald-500 text-white shadow-md"
                        : "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    Scene {scene.sceneNumber}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-gray-800 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                {optimizedData.scenes.find(s => s.sceneNumber === activeSceneTab)?.content}
              </div>
              
              <button
                onClick={() => handleCopy(optimizedData.scenes.find(s => s.sceneNumber === activeSceneTab)?.content || "", "opt-scene")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-xs text-gray-300 hover:text-white hover:border-emerald-500/40 transition-all cursor-pointer"
              >
                {copiedId === "opt-scene" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === "opt-scene" ? "Copied Scene Content!" : "Copy Scene Content"}
              </button>
            </div>
          )}
        </div>

        {/* Generation Controls */}
        <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Generate New Ideas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Category</label>
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
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {categoryEntries.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={category === "CARBOX"}
              >
                {category === "CARBOX" ? (
                  <option value="ASMR Unboxing Effects">ASMR Unboxing Effects</option>
                ) : (
                  LANGUAGE_OPTIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Visual Style */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Visual Style</label>
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {VISUAL_STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Video Prompt Format Option */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-indigo-300 flex items-center gap-1">
                Video Prompt Duration
              </label>
              <select
                value={videoDuration}
                onChange={(e) => setVideoDuration(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-indigo-500/50 text-sm text-white focus:outline-none focus:border-indigo-400 transition-colors"
              >
                <option value={8}>8 Sec Story Clip Format</option>
                <option value={10}>⚡ 10 Sec Fast & Energetic Cinematic Video Prompt</option>
              </select>
            </div>

            {/* Custom Spoken Dialogue Input Box */}
            {category !== "CARBOX" && (
              <div className="space-y-1.5 md:col-span-4">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <span>💬 Custom Spoken Dialogue (Optional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleSuggestDialogue}
                    disabled={isSuggestingDialogue}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-medium text-amber-300 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                    title="Generate a short, natural dialogue line with AI"
                  >
                    {isSuggestingDialogue ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    {isSuggestingDialogue ? "Suggesting..." : "✨ Suggest AI Dialogue"}
                  </button>
                </div>
                <input
                  type="text"
                  value={customDialogue}
                  onChange={(e) => setCustomDialogue(e.target.value)}
                  placeholder='e.g. "Abey sun! Ye cake mera hai, tu side pe ho ja!" (Or click Suggest AI Dialogue)'
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-amber-500/40 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            )}
          </div>

          {category === "CUTE_KIDS" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Kids Age */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Characters Age</label>
                <select
                  value={kidsAge}
                  onChange={(e) => setKidsAge(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Baby (0-2 yrs)">Baby (0-2 yrs)</option>
                  <option value="Toddler (2-4 yrs)">Toddler (2-4 yrs)</option>
                  <option value="Child (5-8 yrs)">Child (5-8 yrs)</option>
                  <option value="Teenager (13-17 yrs)">Teenager (13-17 yrs)</option>
                  <option value="Young Adult (18-24 yrs)">Young Adult (18-24 yrs)</option>
                  <option value="Adult (25-50 yrs)">Adult (25-50 yrs)</option>
                  <option value="Elderly (60+ yrs)">Elderly (60+ yrs)</option>
                </select>
              </div>

              {/* Kids Health */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Kids Health / Vibe</label>
                <select
                  value={kidsHealth}
                  onChange={(e) => setKidsHealth(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Healthy & Energetic">Healthy & Energetic</option>
                  <option value="Chubby & Cute">Chubby & Cute</option>
                  <option value="Slim & Active">Slim & Active</option>
                  <option value="Athletic & Fit">Athletic & Fit</option>
                  <option value="Disabled / Wheelchair">Disabled / Wheelchair</option>
                  <option value="Special Needs / Sensitive">Special Needs / Sensitive</option>
                </select>
              </div>

              {/* Character Setup */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Character Setup</label>
                <select
                  value={characterSetup}
                  onChange={(e) => setCharacterSetup(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="One Cute Little Girl">One Cute Little Girl</option>
                  <option value="One Cute Little Boy">One Cute Little Boy</option>
                  <option value="Two Kids (Siblings)">Two Kids (Siblings)</option>
                  <option value="Two Kids (Friends)">Two Kids (Friends)</option>
                  <option value="Twins">Twins</option>
                </select>
              </div>

              {/* Nationality */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Nationality</label>
                <select
                  value={kidsNationality}
                  onChange={(e) => setKidsNationality(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Global / Any">Global / Any</option>
                  <option value="American">American</option>
                  <option value="Indian / South Asian">Indian / South Asian</option>
                  <option value="Pakistani">Pakistani</option>
                  <option value="East Asian (Japanese/Korean/Chinese)">East Asian</option>
                  <option value="African">African</option>
                  <option value="European">European</option>
                  <option value="Middle Eastern">Middle Eastern</option>
                  <option value="Latin American">Latin American</option>
                </select>
              </div>
            </div>
          )}

          {category === "CARBOX" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Brand */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Vehicle Type / Category / Brand / Model</label>
                <select
                  value={carboxBrand}
                  onChange={(e) => setCarboxBrand(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Hypercar">Hypercar</option>
                  <option value="Supercar">Supercar</option>
                  <option value="Sports Car">Sports Car</option>
                  <option value="Luxury Sedan">Luxury Sedan</option>
                  <option value="Muscle Car">Muscle Car</option>
                  <option value="Classic Car">Classic Car</option>
                  <option value="Rally Car">Rally Car</option>
                  <option value="Formula Race Car">Formula Race Car</option>
                  <option value="Drift Car">Drift Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Pickup Truck">Pickup Truck</option>
                  <option value="Heavy Duty Truck">Heavy Duty Truck</option>
                  <option value="Monster Truck">Monster Truck</option>
                  <option value="Electric Vehicle">Electric Vehicle</option>
                  <option value="Police Car (Emergency)">Police Car (Emergency)</option>
                  <option value="Ambulance (Emergency)">Ambulance (Emergency)</option>
                  <option value="Fire Truck (Emergency)">Fire Truck (Emergency)</option>
                  <option value="City Bus">City Bus</option>
                  <option value="School Bus">School Bus</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Sport Bike">Sport Bike</option>
                  <option value="Cruiser Bike">Cruiser Bike</option>
                  <option value="Adventure Bike">Adventure Bike</option>
                  <option value="Dirt Bike">Dirt Bike</option>
                  <option value="Scooter">Scooter</option>
                  <option value="ATV / Quad Bike">ATV / Quad Bike</option>
                  <option value="Farm Tractor">Farm Tractor</option>
                  <option value="Construction Excavator">Construction Excavator</option>
                  <option value="Premium BMW">Premium BMW</option>
                  <option value="Mercedes Benz">Mercedes Benz</option>
                  <option value="Porsche 911">Porsche 911</option>
                  <option value="Ferrari">Ferrari</option>
                  <option value="Lamborghini">Lamborghini</option>
                  <option value="JDM Nissan GTR">JDM Nissan GTR</option>
                </select>
              </div>

              {/* Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Vehicle Color</label>
                <select
                  value={carboxColor}
                  onChange={(e) => setCarboxColor(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Pearl White">Pearl White</option>
                  <option value="Gloss Black">Gloss Black</option>
                  <option value="Matte Black">Matte Black</option>
                  <option value="Metallic Silver">Metallic Silver</option>
                  <option value="Gunmetal Gray">Gunmetal Gray</option>
                  <option value="Racing Red">Racing Red</option>
                  <option value="Crimson Red">Crimson Red</option>
                  <option value="Electric Blue">Electric Blue</option>
                  <option value="Navy Blue">Navy Blue</option>
                  <option value="Emerald Green">Emerald Green</option>
                  <option value="British Racing Green">British Racing Green</option>
                  <option value="Sunset Orange">Sunset Orange</option>
                  <option value="Bright Yellow">Bright Yellow</option>
                  <option value="Gold">Gold</option>
                  <option value="Rose Gold">Rose Gold</option>
                  <option value="Copper">Copper</option>
                  <option value="Purple">Purple</option>
                  <option value="Pink">Pink</option>
                  <option value="Matte Olive">Matte Olive</option>
                  <option value="Desert Sand">Desert Sand</option>
                  <option value="Carbon Fiber">Carbon Fiber</option>
                  <option value="Chrome">Chrome</option>
                  <option value="Color-shifting Chameleon">Color-shifting Chameleon</option>
                  <option value="Neon Gradient">Neon Gradient</option>
                  <option value="Custom Livery">Custom Livery</option>
                </select>
              </div>

              {/* Packaging */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Packaging Style</label>
                <select
                  value={carboxPackaging}
                  onChange={(e) => setCarboxPackaging(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Premium Aluminum Case">Premium Aluminum Case</option>
                  <option value="Luxury Wooden Crate">Luxury Wooden Crate</option>
                  <option value="Carbon Fiber Case">Carbon Fiber Case</option>
                  <option value="Tempered Glass Display Box">Tempered Glass Display Box</option>
                  <option value="Acrylic Display Case">Acrylic Display Case</option>
                  <option value="Flight Case">Flight Case</option>
                  <option value="Magnetic Gift Box">Magnetic Gift Box</option>
                  <option value="Velvet Collector's Box">Velvet Collector's Box</option>
                  <option value="Transparent Showcase Box">Transparent Showcase Box</option>
                  <option value="Industrial Metal Crate">Industrial Metal Crate</option>
                  <option value="Futuristic Capsule">Futuristic Capsule</option>
                  <option value="Titanium Case">Titanium Case</option>
                  <option value="Military Supply Crate">Military Supply Crate</option>
                  <option value="Premium Leather Case">Premium Leather Case</option>
                  <option value="Luxury Suitcase">Luxury Suitcase</option>
                  <option value="Sci-Fi Energy Container">Sci-Fi Energy Container</option>
                  <option value="Elegant Retail Box">Elegant Retail Box</option>
                  <option value="Vintage Blister Pack">Vintage Blister Pack</option>
                </select>
              </div>

              {/* Background */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Tabletop Background</label>
                <select
                  value={carboxBackground}
                  onChange={(e) => setCarboxBackground(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Matte Black Studio">Matte Black Studio</option>
                  <option value="White Marble">White Marble</option>
                  <option value="Black Marble">Black Marble</option>
                  <option value="Carbon Fiber Mat">Carbon Fiber Mat</option>
                  <option value="Brushed Aluminum">Brushed Aluminum</option>
                  <option value="Dark Walnut Wood">Dark Walnut Wood</option>
                  <option value="Oak Wood">Oak Wood</option>
                  <option value="Concrete">Concrete</option>
                  <option value="Glass Surface">Glass Surface</option>
                  <option value="Acrylic">Acrylic</option>
                  <option value="Leather Surface">Leather Surface</option>
                  <option value="Granite">Granite</option>
                  <option value="Slate Stone">Slate Stone</option>
                  <option value="Premium Fabric">Premium Fabric</option>
                  <option value="Neon Cyberpunk Table">Neon Cyberpunk Table</option>
                  <option value="Mirror Surface">Mirror Surface</option>
                  <option value="Racing Garage Workbench">Racing Garage Workbench</option>
                  <option value="Luxury Showroom Floor">Luxury Showroom Floor</option>
                  <option value="Industrial Steel Platform">Industrial Steel Platform</option>
                  <option value="Clean White Studio Tabletop">Clean White Studio Tabletop</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
              <span className="text-sm">✨</span>
              <span>
                <strong>Clean Video Mandate:</strong> Completely clean & unobstructed video (no text, logos, banners, watermarks, captions, or UI overlays).
                {category === "CARBOX" && " Model-specific branding permitted for car videos."}
              </span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-bg-primary text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isGenerating ? "Generating with Claude..." : "✨ Generate 1 Idea"}
            </button>
          </div>
        </div>



        {/* Saved Ideas with Pagination */}
        <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white">
              Saved Ideas ({filteredIdeas.length})
            </h2>

            {/* Search by Video File Name or Keyword */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by file name (e.g. carbox_bmw)..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/60 border border-indigo-500/40 text-xs text-indigo-100 placeholder-gray-500 focus:outline-none focus:border-indigo-400 transition-colors shadow-inner font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => { setFilterCategory("ALL"); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  filterCategory === "ALL"
                    ? "bg-indigo-950 border-indigo-500/40 text-indigo-200"
                    : "bg-gray-900 border-gray-700 text-gray-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => { setFilterCategory("FAVORITES"); setCurrentPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  filterCategory === "FAVORITES"
                    ? "bg-rose-950 border-rose-500/40 text-rose-200"
                    : "bg-gray-900 border-gray-700 text-gray-400 hover:text-rose-400"
                }`}
              >
                <Heart className="w-3 h-3" />
                Favorites
              </button>
              {categoryEntries.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setFilterCategory(cat.id); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    filterCategory === cat.id
                      ? "bg-indigo-950 border-indigo-500/40 text-indigo-200"
                      : "bg-gray-900 border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

          {paginatedIdeas.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              {savedIdeas.length === 0
                ? "No saved ideas yet. Generate some ideas above!"
                : "No ideas match this filter."}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="group flex items-start justify-between gap-4 p-4 rounded-xl bg-black/30 border border-gray-800 hover:border-gray-700 transition-all"
                >
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-gray-200 leading-relaxed">{idea.text}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                        {CATEGORIES[idea.category]?.name || idea.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {idea.language}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                        {idea.visualStyle}
                      </span>

                      {/* Unique Video Filename Badge & Inline Editor */}
                      {editingFileNameId === idea.id ? (
                        <div className="flex items-center gap-1 bg-black/80 border border-indigo-500 rounded-lg px-2 py-0.5 text-xs shadow-md">
                          <FileVideo className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <input
                            type="text"
                            value={editingFileNameText}
                            onChange={(e) => setEditingFileNameText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveFileName(idea.id);
                              if (e.key === "Escape") setEditingFileNameId(null);
                            }}
                            className="bg-transparent text-indigo-200 text-xs font-mono focus:outline-none w-52"
                            placeholder="carbox_bmw_01"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveFileName(idea.id)}
                            className="text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded px-2 py-0.5 transition-colors cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-indigo-950/40 border border-indigo-500/30 rounded-lg px-2.5 py-0.5 text-xs text-indigo-200">
                          <FileVideo className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="font-mono text-[11px] text-indigo-300 font-semibold select-all">
                            {getFallbackFileName(idea)}
                          </span>
                          <button
                            onClick={() => {
                              setEditingFileNameId(idea.id);
                              setEditingFileNameText(getFallbackFileName(idea));
                            }}
                            className="text-gray-400 hover:text-indigo-300 p-0.5 transition-colors cursor-pointer"
                            title="Edit Video Filename"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleCopy(getFallbackFileName(idea), `${idea.id}-filename`)}
                            className="flex items-center gap-1 text-[10px] font-semibold text-gray-300 hover:text-white transition-colors border-l border-indigo-500/30 pl-1.5 ml-0.5 cursor-pointer"
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
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleFavorite(idea.id)}
                      className={`p-2 rounded-lg border transition-all cursor-pointer ${
                        idea.isFavorite 
                          ? "bg-rose-950/50 border-rose-500/40 text-rose-400 hover:bg-rose-900/50" 
                          : "bg-gray-900 border-gray-700 text-gray-400 hover:text-rose-400 hover:border-rose-500/40"
                      }`}
                      title={idea.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${idea.isFavorite ? "fill-current" : ""}`} />
                    </button>
                    {idea.category === "CUTE_KIDS" ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(`[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]\n\n${idea.text}`, `${idea.id}-mobile`)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-900/30 border border-indigo-700/50 text-[10px] font-semibold text-indigo-300 hover:text-white hover:bg-indigo-800/50 transition-all cursor-pointer"
                          title="Copy Mobile Prompt (9:16)"
                        >
                          {copiedId === `${idea.id}-mobile` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          9:16 Mobile
                        </button>
                        <button
                          onClick={() => handleCopy(`[FORMAT: 16:9 Widescreen Aspect Ratio.]\n\n${idea.text}`, `${idea.id}-full`)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-[10px] font-semibold text-gray-400 hover:text-white hover:border-gray-500 transition-all cursor-pointer"
                          title="Copy Full Prompt (16:9)"
                        >
                          {copiedId === `${idea.id}-full` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          16:9 Full
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCopy(idea.text, idea.id)}
                        className="p-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-400 hover:text-white hover:border-indigo-500/40 transition-all cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedId === idea.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteIdea(idea.id)}
                      className="p-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-400 hover:text-rose-400 hover:border-rose-500/40 transition-all cursor-pointer"
                      title="Delete idea"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-xs text-gray-300 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>
              <span className="text-xs text-gray-400 font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-xs text-gray-300 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
