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
}

export default function IdeasPage() {
  const { showToast } = useToast();

  // Generation controls
  const [category, setCategory] = useState<CategoryId>("FUNNY");
  const [language, setLanguage] = useState("English");
  const [visualStyle, setVisualStyle] = useState("3D Cartoon");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Cute Kids specific options
  const [kidsAge, setKidsAge] = useState("Toddler (2-4 yrs)");
  const [kidsHealth, setKidsHealth] = useState("Healthy & Energetic");
  const [characterSetup, setCharacterSetup] = useState("One Cute Little Girl");
  const [kidsNationality, setKidsNationality] = useState("Global / Any");
  
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
        body: JSON.stringify({ category, language, visualStyle, kidsAge, kidsHealth, characterSetup, kidsNationality }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.reason || data.error || "Failed to generate ideas");
      }
      
      const newIdeas: SavedIdea[] = data.ideas.map((text: string) => ({
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        text,
        category,
        language,
        visualStyle,
        createdAt: new Date().toISOString(),
      }));
      
      const updated = [...newIdeas, ...savedIdeas];
      saveToStorage(updated);
      
      showToast(`Generated and saved ${data.ideas.length} ideas!`, "success");
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

  // Filtered & paginated saved ideas
  const filteredIdeas =
    filterCategory === "ALL"
      ? savedIdeas
      : filterCategory === "FAVORITES"
      ? savedIdeas.filter((i) => i.isFavorite)
      : savedIdeas.filter((i) => i.category === filterCategory);

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
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
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
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
                  <option value="Pre-teen (9-12 yrs)">Pre-teen (9-12 yrs)</option>
                </select>
              </div>

              {/* Kids Health */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Kids Health</label>
                <select
                  value={kidsHealth}
                  onChange={(e) => setKidsHealth(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Healthy & Energetic">Healthy & Energetic</option>
                  <option value="Chubby & Cute">Chubby & Cute</option>
                  <option value="Fragile & Sweet">Fragile & Sweet</option>
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

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-bg-primary text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isGenerating ? "Generating with Claude..." : "✨ Generate 5 Ideas"}
          </button>
        </div>



        {/* Saved Ideas with Pagination */}
        <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white">
              Saved Ideas ({filteredIdeas.length})
            </h2>

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
