"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { CategoryId } from "@/lib/categories/types";
import { useToast } from "@/components/ui/Toast";
import { StorySourceBadge } from "@/components/common/StorySourceBadge";
import {
  Ghost,
  Laugh,
  MessageCircle,
  Sparkles,
  Dog,
  Eye,
  Film,
  Sliders,
  Clock,
  Globe,
  Palette,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Wand2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkle,
  RefreshCw,
  Bot,
  Smile,
} from "lucide-react";

interface CreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: CategoryId;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Ghost: <Ghost className="w-5 h-5" />,
  Laugh: <Laugh className="w-5 h-5" />,
  MessageCircle: <MessageCircle className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Dog: <Dog className="w-5 h-5" />,
  Eye: <Eye className="w-5 h-5" />,
  Film: <Film className="w-5 h-5" />,
  Sliders: <Sliders className="w-5 h-5" />,
  Smile: <Smile className="w-5 h-5" />,
};

const DURATION_OPTIONS = [
  { duration: 8, clips: 1, label: "8 sec", note: "1 Flow clip" },
  { duration: 10, clips: 1, label: "10 sec", note: "1 Flow clip" },
  { duration: 16, clips: 2, label: "16 sec", note: "2 Flow clips" },
  { duration: 24, clips: 3, label: "24 sec", note: "3 Flow clips" },
  { duration: 32, clips: 4, label: "32 sec", note: "4 Flow clips (Recommended)" },
  { duration: 40, clips: 5, label: "40 sec", note: "5 Flow clips" },
  { duration: 48, clips: 6, label: "48 sec", note: "6 Flow clips" },
  { duration: 56, clips: 7, label: "56 sec", note: "7 Flow clips" },
  { duration: 64, clips: 8, label: "64 sec", note: "8 Flow clips" },
];

const LANGUAGES = [
  { id: "English", label: "English", desc: "Standard English narration & dialogue" },
  { id: "Hindi", label: "Hindi (Roman Urdu Script)", desc: "Desi conversational Hindi in Roman Urdu script" },
  { id: "Punjabi", label: "Punjabi", desc: "Conversational Punjabi jokes & Pind banter" },
  { id: "Urdu", label: "Urdu (Roman Urdu)", desc: "Authentic Urdu storytelling in Roman Urdu" },
  { id: "Roman Urdu", label: "Roman Urdu", desc: "Pakistani conversational Roman Urdu style" },
];

const VISUAL_STYLES = [
  { id: "3D Cartoon", label: "3D Cartoon", desc: "High-quality 3D animation style" },
  { id: "Cinematic 35mm", label: "Cinematic 35mm", desc: "High production value photorealistic film" },
  { id: "Anime", label: "Anime", desc: "Japanese anime animation artwork" },
  { id: "Photorealistic", label: "Photorealistic", desc: "Ultra-detailed real life visuals" },
  { id: "Cyberpunk", label: "Cyberpunk", desc: "Neon-lit futuristic sci-fi aesthetic" },
  { id: "Watercolor", label: "Watercolor", desc: "Dreamy hand-painted artistic style" },
  { id: "Dark Fantasy", label: "Dark Fantasy", desc: "Ominous gothic high-contrast lighting" },
  { id: "Retro 80s", label: "Retro 80s Synthwave", desc: "80s neon synthwave aesthetic" },
  { id: "Realistic", label: "Realistic", desc: "True-to-life standard realism" },
];

export function CreationWizard({ isOpen, onClose, initialCategory }: CreationWizardProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<CategoryId>(initialCategory || "FUNNY");
  const [duration, setDuration] = useState<number>(32);
  const [idea, setIdea] = useState<string>("");
  const [language, setLanguage] = useState<string>(initialCategory === "CARBOX" ? "ASMR Unboxing Effects" : "English");
  const [visualStyle, setVisualStyle] = useState<string>(initialCategory === "CARBOX" ? "Realistic" : "3D Cartoon");
  const [userCharacters, setUserCharacters] = useState<string>("");
  const [customInstructions, setCustomInstructions] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
      if (initialCategory === "CARBOX") {
        setLanguage("ASMR Unboxing Effects");
        setVisualStyle("Realistic");
      } else if (initialCategory === "PUNJABI_JOKE") {
        setLanguage("Punjabi");
      } else if (initialCategory === "HINDI_JOKE") {
        setLanguage("Hindi");
      }
    }
  }, [initialCategory]);



  // Storyboard Generation states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");

  if (!isOpen) return null;

  const currentCategoryConfig = CATEGORIES[category] || CATEGORIES.FUNNY;



  const handleGenerate = async () => {
    if (!idea.trim()) {
      showToast("Please enter your story idea before generating.", "error");
      return;
    }

    setIsGenerating(true);
    setGenerationStep("Connecting to Claude API (Anthropic)...");

    try {
      setTimeout(() => setGenerationStep("Building Character Bible & Visual Bible..."), 1800);
      setTimeout(() => setGenerationStep("Designing 8-second Google Flow clips..."), 4500);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          duration,
          language,
          visualStyle,
          idea,
          userCharacters: userCharacters.trim() || undefined,
          customInstructions: customInstructions.trim() || undefined,
          autoGenerate: true,
        }),
      });

      const data = await res.json().catch(() => ({
        success: false,
        error: `Server response error (${res.status})`,
      }));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate project");
      }

      showToast("Video Script & Flow Prompts created successfully with Claude API!", "success");
      onClose();
      window.location.href = `/projects/${data.project.id}`;
    } catch (err: any) {
      console.error("Wizard generation error:", err);
      showToast(err.message || "Failed to generate story. Please try again.", "error");
      setIsGenerating(false);
    }
  };

  const selectedClipCount = Math.floor(duration / 8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-card rounded-2xl border border-indigo-500/20 shadow-2xl overflow-hidden my-2 sm:my-8">
        {/* Wizard Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800 bg-[#0d1019]/90">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-bg-primary flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
              <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white">Create Video Script (Claude API)</h2>
              <p className="text-[11px] sm:text-xs text-gray-400">
                Step {step} of 4: {step === 1 ? "Select Category" : step === 2 ? "Duration & Language" : step === 3 ? "Story Idea & Style" : "Review & Generate"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Choose Video Category</h3>
                <p className="text-sm text-gray-400">
                  Each category applies tailored storytelling rules, hook dynamics, and pacing for Google Flow.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(Object.keys(CATEGORIES) as CategoryId[]).map((catKey) => {
                  const cat = CATEGORIES[catKey];
                  const isSelected = category === catKey;
                  return (
                    <button
                      key={catKey}
                      onClick={() => {
                        setCategory(catKey);
                        if (catKey === "CARBOX") {
                          setLanguage("ASMR Unboxing Effects");
                          setVisualStyle("Realistic");
                        } else if (catKey === "PUNJABI_JOKE") {
                          setLanguage("Punjabi");
                        } else if (catKey === "HINDI_JOKE") {
                          setLanguage("Hindi");
                        }
                      }}
                      className={`flex flex-col text-left p-4 rounded-xl transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500"
                          : "bg-gray-900/40 border-gray-800 hover:border-gray-700 hover:bg-gray-900/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            isSelected ? "bg-indigo-600 text-white" : "bg-gray-800 text-indigo-400"
                          }`}
                        >
                          {CATEGORY_ICONS[cat.iconName] || <Sparkles className="w-5 h-5" />}
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-indigo-400" />}
                      </div>
                      <h4 className="font-semibold text-sm text-white mb-1">{cat.name}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2">{cat.description}</p>
                    </button>
                  );
                })}
              </div>

              {/* Selected Category Rules Preview */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
                <div className="font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Storytelling Rules for {currentCategoryConfig.name}:
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentCategoryConfig.storytellingRules.map((rule, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-indigo-900/50 border border-indigo-700/40 text-indigo-200"
                    >
                      ✓ {rule}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DURATION & LANGUAGE */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Select Total Duration & Language</h3>
                <p className="text-sm text-gray-400">
                  Google Flow generates 8-second visual clips. We will divide your video script into exact 8s scenes using Claude API.
                </p>
              </div>

              {/* Engine Badge */}
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-3 text-amber-200">
                <Bot className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-amber-300">
                    Engine: Claude API (Anthropic)
                  </div>
                  <div className="text-xs text-amber-200/80">
                    Powered by Claude 3.7 Sonnet for high-quality storytelling script creation.
                  </div>
                </div>
              </div>

              {/* Google Flow 8s Constraint Banner */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-3">
                <Clock className="w-6 h-6 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-cyan-200">
                    Google Flow Constraint: 8 Seconds = 1 Visual Clip
                  </div>
                  <div className="text-xs text-cyan-300/80">
                    Every scene generated will be optimized as an 8-second visual clip with camera motion and dialogue cues.
                  </div>
                </div>
              </div>

              {/* Duration Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DURATION_OPTIONS.map((opt) => {
                  const isSelected = duration === opt.duration;
                  return (
                    <button
                      key={opt.duration}
                      onClick={() => setDuration(opt.duration)}
                      className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-950/70 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500"
                          : "bg-gray-900/40 border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <span className="text-xl font-bold text-white mb-0.5">{opt.label}</span>
                      <span className="text-xs font-semibold text-indigo-400 mb-1">
                        {opt.clips} {opt.clips === 1 ? "Flow clip" : "Flow clips"}
                      </span>
                      <span className="text-[10px] text-gray-400">{opt.note}</span>
                    </button>
                  );
                })}
              </div>

              {/* Language Selection */}
              <div className="pt-4 border-t border-gray-800">
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  Language Support
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(category === "CARBOX" 
                    ? [{ id: "ASMR Unboxing Effects", label: "ASMR Unboxing Effects", desc: "No dialogue, only realistic unpacking sounds" }] 
                    : LANGUAGES
                  ).map((lang) => {
                    const isSel = (category === "CARBOX") ? true : language === lang.id;
                    return (
                      <button
                        key={lang.id}
                        onClick={() => {
                          if (category !== "CARBOX") setLanguage(lang.id);
  
                        }}
                        className={`p-3 rounded-xl border text-left flex flex-col transition-all ${category !== "CARBOX" ? "cursor-pointer" : "cursor-default"} ${
                          isSel
                            ? "bg-indigo-950/60 border-indigo-500 text-white"
                            : "bg-gray-900/40 border-gray-800 text-gray-300 hover:border-gray-700"
                        }`}
                      >
                        <span className="font-semibold text-sm mb-0.5">{lang.label}</span>
                        <span className="text-xs text-gray-400">{lang.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: IDEA & VISUAL STYLE */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Story Idea & Visual Style</h3>
                <p className="text-sm text-gray-400">
                  Describe your concept or open the Ideas Page to generate 5 fresh script ideas using Claude API.
                </p>
              </div>

              {/* Story Idea Textarea & AI Suggest Button */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-white flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Video Core Idea / Concept *
                  </label>
                  <a
                    href="/ideas"
                    target="_blank"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-500/40 text-amber-200 text-xs font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <Sparkle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Open Ideas Page</span>
                  </a>
                </div>

                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder={`Paste your idea here or describe your story concept for ${currentCategoryConfig.name}...`}
                  rows={4}
                  className="w-full p-4 rounded-xl glass-input text-sm resize-none"
                />
              </div>

              {/* Visual Style Grid */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  Visual Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {VISUAL_STYLES.map((vs) => {
                    const isSel = visualStyle === vs.id;
                    return (
                      <button
                        key={vs.id}
                        onClick={() => setVisualStyle(vs.id)}
                        className={`p-3 rounded-xl border text-left flex flex-col transition-all cursor-pointer ${
                          isSel
                            ? "bg-indigo-950/70 border-indigo-500 text-white shadow-md"
                            : "bg-gray-900/40 border-gray-800 text-gray-300 hover:border-gray-700"
                        }`}
                      >
                        <span className="font-semibold text-xs text-white mb-1">{vs.label}</span>
                        <span className="text-[10px] text-gray-400 line-clamp-2">{vs.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Collapsible Advanced Preferences */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showAdvanced ? "Hide Advanced Character & Prompt Settings" : "Show Advanced Character & Prompt Settings"}
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Specific Character Preferences (Optional)
                      </label>
                      <input
                        type="text"
                        value={userCharacters}
                        onChange={(e) => setUserCharacters(e.target.value)}
                        placeholder="e.g. Main character: Chintu (8 year old boy, red t-shirt, messy black hair)"
                        className="w-full p-3 rounded-lg glass-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Custom Directives or Exclusions (Optional)
                      </label>
                      <input
                        type="text"
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                        placeholder="e.g. Include slapstick sound effects, end with a frozen surprised face frame"
                        className="w-full p-3 rounded-lg glass-input text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Review & Generate Script</h3>
                <p className="text-sm text-gray-400">
                  Confirm your video settings. Claude API (Anthropic) will generate a Character Bible, Visual Bible, and {selectedClipCount} x 8-second scene prompts for Google Flow.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pb-4 border-b border-gray-800">
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">AI Engine</span>
                    <span className="font-semibold text-sm text-amber-400">
                      Claude (Anthropic)
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">Category</span>
                    <span className="font-semibold text-sm text-indigo-300">
                      {currentCategoryConfig.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">Duration</span>
                    <span className="font-semibold text-sm text-cyan-300">
                      {duration}s ({selectedClipCount} clips)
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">Language</span>
                    <span className="font-semibold text-sm text-emerald-300">{language}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">Visual Style</span>
                    <span className="font-semibold text-sm text-amber-300">{visualStyle}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block mb-1">Story Concept</span>
                  <p className="text-sm text-gray-200 bg-black/40 p-3 rounded-xl border border-gray-800 italic">
                    "{idea}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
                  <Wand2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-300 mb-0.5">
                      Claude API Video Script Pipeline
                    </div>
                    <div>
                      Claude API will generate: (1) Complete Story Script & Hook, (2) Locked Character Bible & Reference Prompts, (3) Visual Bible, and (4) {selectedClipCount} individual 8-second visual scenes with image & video prompts optimized for Google Flow.
                    </div>
                  </div>
                </div>
              </div>

              {/* Generating overlay status */}
              {isGenerating && (
                <div className="p-6 rounded-2xl bg-amber-950/80 border border-amber-500/50 flex flex-col items-center justify-center text-center gap-3 animate-pulse">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                  <div className="font-bold text-white text-base">{generationStep}</div>
                  <div className="text-xs text-amber-300">
                    Applying {currentCategoryConfig.name} rules & 8-second clip constraints with Claude API...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-t border-gray-800 bg-[#0d1019]/90 gap-2">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={isGenerating}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 text-xs sm:text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => {
                if (step === 3 && !idea.trim()) {
                  showToast("Please enter your story concept.", "error");
                  return;
                }
                setStep((s) => s + 1);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl gradient-bg-primary text-white text-xs sm:text-sm font-medium shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl gradient-bg-primary text-white font-semibold text-xs sm:text-sm shadow-xl shadow-indigo-500/30 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Script...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Video Script</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
