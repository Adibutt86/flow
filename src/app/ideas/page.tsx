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
  Trash2,
  Heart,
  FileVideo,
  Edit3,
  Search,
  RotateCcw,
  ArrowUpDown,
  Bookmark,
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

const KIDS_HEALTH_GROUPS = [
  {
    category: "Kids Health & Fitness",
    options: [
      "Happy Chubby Kid",
      "Cute Chubby Boy",
      "Cute Chubby Girl",
      "Healthy Lifestyle",
      "Healthy Eating",
      "Fun Exercise",
      "Active Play",
      "Morning Workout",
      "Dance Challenge",
      "Fruit Time",
      "Veggie Challenge",
      "Water Break",
      "Family Fitness",
      "Playground Fun",
      "Jump Rope Challenge",
      "Mini Sports Star",
      "Stretch & Smile",
      "Feel Strong",
      "Happy & Healthy",
      "Kids Fitness",
      "Tiny Athlete",
      "Energy Boost",
      "Healthy & Active",
      "Healthy Habits",
    ],
  },
  {
    category: "Vibes & Moods",
    options: [
      "Cheerful & Energetic",
      "Cute & Playful",
      "Happy Explorer",
      "Sunshine Smile",
      "Rainbow Adventure",
      "Confidence Boost",
      "Big Smiles",
      "Positive Energy",
      "Self-Love",
      "Before School Routine",
      "Weekend Fun",
    ],
  },
  {
    category: "Everyday Styles & Outfits",
    options: [
      "Colorful Casual",
      "Storybook Princess (everyday, not fancy)",
      "Nature Lover",
      "Little Dancer",
      "Mini Gardener",
      "Cozy Homewear",
      "Soft Pastel Style",
      "Sporty Toddler",
    ],
  },
  {
    category: "ASMR & Sensory",
    options: [
      "Satisfying Sounds",
      "Soft Whisper",
      "Crunchy Food",
    ],
  },
  {
    category: "Comedy & Fun",
    options: [
      "Silly Kid",
      "Funny Teacher",
      "Dad Jokes",
    ],
  },
];

const KIDS_HEALTH_OPTIONS = KIDS_HEALTH_GROUPS.flatMap((g) => g.options);

const CHARACTER_SETUP_OPTIONS = [
  "One Cute Little Girl",
  "One Cute Little Boy",
  "Two Kids (Siblings)",
  "Two Kids (Friends)",
  "Twins",
  "One Girl & One Boy",
  "Two Little Girls",
  "Two Little Boys",
  "Brother & Sister",
  "Best Friends",
  "Three Happy Kids",
  "Happy Family",
  "Child & Mom",
  "Child & Dad",
  "Child & Doctor",
  "Child & Teacher",
  "Child & Friendly Robot",
  "Child & Teddy Bear",
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
}

interface IdeasPageSettings {
  category?: CategoryId;
  language?: string;
  visualStyle?: string;
  videoDuration?: number;
  customDialogue?: string;
  kidsAge?: string;
  kidsHealth?: string;
  characterSetup?: string;
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
          kidsHealth,
          aiModel,
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
  const [kidsHealth, setKidsHealth] = useState(initialSettings.kidsHealth || "Cheerful & Energetic");
  const [characterSetup, setCharacterSetup] = useState(initialSettings.characterSetup || "One Cute Little Girl");
  const [kidsNationality, setKidsNationality] = useState(initialSettings.kidsNationality || "Global / Any");
  
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
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("flow-saved-ideas");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

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
        kidsHealth,
        characterSetup,
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
    kidsHealth,
    characterSetup,
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
  ]);

  const handleResetSettings = () => {
    setCategory("FUNNY");
    setLanguage("Urdu");
    setVisualStyle("3D Cartoon Style");
    setVideoDuration(10);
    setCustomDialogue("");
    setKidsAge("Toddler (2-4 yrs)");
    setKidsHealth("Cheerful & Energetic");
    setCharacterSetup("One Cute Little Girl");
    setKidsNationality("Global / Any");
    setCarboxBrand("Premium BMW");
    setCarboxColor("Glossy Black");
    setCarboxPackaging("Elegant Retail Box");
    setCarboxBackground("Clean White Studio Tabletop");
    setCustomIdea("");
    setFilterCategory("ALL");
    setSearchQuery("");
    setSortBy("NEWEST");
    setCurrentPage(1);
    setAiModel("claude-3-7-sonnet-20250219");
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
        body: JSON.stringify({ category, language, visualStyle, videoDuration, customDialogue, kidsAge, kidsHealth, characterSetup, kidsNationality, carboxBrand, carboxColor, carboxPackaging, carboxBackground, aiModel }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.reason || data.error || "Failed to generate ideas");
      }
      
      const newIdeas: SavedIdea[] = data.ideas.map((text: string) => {
        const id = Date.now().toString() + Math.random().toString(36).slice(2);
        const cleanBrand = (carboxBrand || "car").toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").slice(0, 12);
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
          aiModel: aiModel || "claude-3-7-sonnet-20250219",
        };
      });
      
      const updated = [...newIdeas, ...savedIdeas];
      saveToStorage(updated);
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
        <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-slate-950/70 border border-indigo-500/20 shadow-xl backdrop-blur-xl space-y-6">
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
                  rows={3}
                  placeholder='e.g. Abu: "Chips kahan gaye?" \n Bachha: "Taqeeqat jaari hain!" (Or click Suggest AI Dialogue)'
                  className={`w-full px-4 py-3 rounded-xl bg-black/60 border border-amber-500/40 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-y ${
                    isRtl ? "text-right leading-relaxed font-sans" : "text-left"
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
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Characters Age</label>
                <select
                  value={kidsAge}
                  onChange={(e) => setKidsAge(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium cursor-pointer"
                >
                  {KIDS_AGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Kids Health / Vibe</label>
                <select
                  value={kidsHealth}
                  onChange={(e) => setKidsHealth(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium cursor-pointer"
                >
                  {KIDS_HEALTH_GROUPS.map((group) => (
                    <optgroup key={group.category} label={group.category} className="bg-slate-900 text-indigo-300 font-bold">
                      {group.options.map((opt) => (
                        <option key={opt} value={opt} className="bg-black text-white font-normal">
                          {opt}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Character Setup</label>
                <select
                  value={characterSetup}
                  onChange={(e) => setCharacterSetup(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium cursor-pointer"
                >
                  {CHARACTER_SETUP_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Nationality</label>
                <select
                  value={kidsNationality}
                  onChange={(e) => setKidsNationality(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium cursor-pointer"
                >
                  <option value="Global / Any" className="bg-slate-900 text-white">Global / Any</option>
                  <option value="American" className="bg-slate-900 text-white">American</option>
                  <option value="Indian / South Asian" className="bg-slate-900 text-white">Indian / South Asian</option>
                  <option value="Pakistani" className="bg-slate-900 text-white">Pakistani</option>
                  <option value="East Asian (Japanese/Korean/Chinese)" className="bg-slate-900 text-white">East Asian</option>
                  <option value="African" className="bg-slate-900 text-white">African</option>
                  <option value="European" className="bg-slate-900 text-white">European</option>
                  <option value="Middle Eastern" className="bg-slate-900 text-white">Middle Eastern</option>
                  <option value="Latin American" className="bg-slate-900 text-white">Latin American</option>
                </select>
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
        <div ref={savedIdeasSectionRef} className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-slate-950/70 border border-slate-800/80 shadow-xl backdrop-blur-xl space-y-5">
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
              {paginatedIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="group flex flex-col md:flex-row items-start justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-black/40 border border-slate-800 hover:border-indigo-500/30 transition-all shadow-md hover:shadow-xl"
                >
                  <div className="flex-1 space-y-3 w-full">
                    <p
                      dir={idea.language === "Urdu" || idea.language === "Punjabi" ? "rtl" : "ltr"}
                      className={`text-sm sm:text-base text-slate-100 leading-relaxed font-sans select-text ${
                        idea.language === "Urdu" || idea.language === "Punjabi" ? "text-right" : "text-left"
                      }`}
                    >
                      {idea.text}
                    </p>
                    
                    <div className="flex items-center gap-2 flex-wrap pt-1">
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
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap w-full md:w-auto justify-start md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                    {/* Favorite Toggle Button */}
                    <button
                      onClick={() => handleToggleFavorite(idea.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                        idea.isFavorite 
                          ? "bg-rose-950/60 border-rose-500/50 text-rose-400 hover:bg-rose-900/60 shadow-md shadow-rose-950/40" 
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/40"
                      }`}
                      title={idea.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={`w-4 h-4 ${idea.isFavorite ? "fill-current" : ""}`} />
                    </button>

                    {/* Simple Copy Prompt Button */}
                    <button
                      onClick={() => handleCopy(idea.text, idea.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white hover:border-indigo-500/40 transition-all cursor-pointer active:scale-95 shadow-sm"
                      title="Copy exact prompt text"
                    >
                      {copiedId === idea.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>Copy Prompt</span>
                    </button>

                    {/* Mobile & Full Options */}
                    <button
                      onClick={() => handleCopy(`[FORMAT: 9:16 Vertical Aspect Ratio optimized for TikTok/Shorts/Reels. Center all main action.]\n\n${idea.text}`, `${idea.id}-mobile`)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950/50 border border-indigo-700/50 text-xs font-bold text-indigo-300 hover:text-white hover:bg-indigo-900/60 transition-all cursor-pointer active:scale-95 shadow-sm"
                      title="Copy Mobile Prompt (9:16)"
                    >
                      {copiedId === `${idea.id}-mobile` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>9:16 Mobile</span>
                    </button>

                    <button
                      onClick={() => handleCopy(`[FORMAT: 16:9 Widescreen Aspect Ratio.]\n\n${idea.text}`, `${idea.id}-full`)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                      title="Copy Full Prompt (16:9)"
                    >
                      {copiedId === `${idea.id}-full` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>16:9 Full</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteIdea(idea.id)}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-all cursor-pointer active:scale-95"
                      title="Delete idea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
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
    </div>
  );
}
