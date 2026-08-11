"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Image as ImageIcon, Copy, RefreshCw, RotateCcw, Clock, Library, X, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function NanoProGenerator() {
  const [activeTab, setActiveTab] = useState("character");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiModel, setAiModel] = useState("claude-sonnet-4-6");

  // Character Settings
  const [characterType, setCharacterType] = useState("Any / AI Decides");
  const [clothing, setClothing] = useState("Any / AI Decides");
  const [age, setAge] = useState("Any / AI Decides");
  const [nationality, setNationality] = useState("Any / AI Decides");
  const [complexion, setComplexion] = useState("Any / AI Decides");
  const [visualStyle, setVisualStyle] = useState("3D Cartoon Style");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [isCopied, setIsCopied] = useState(false);

  // Scene Settings
  const [backgroundStyle, setBackgroundStyle] = useState("Any / AI Decides");

  const [customVisualStyle, setCustomVisualStyle] = useState("");
  const [customCharacterType, setCustomCharacterType] = useState("");
  const [customClothing, setCustomClothing] = useState("");
  const [customAge, setCustomAge] = useState("");
  const [customNationality, setCustomNationality] = useState("");
  const [customComplexion, setCustomComplexion] = useState("");
  const [customBackgroundStyle, setCustomBackgroundStyle] = useState("");

  const [promptHistory, setPromptHistory] = useState<any[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const itemsPerPage = 5;

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
        if (parsed.promptHistory) setPromptHistory(parsed.promptHistory);
        if (parsed.referenceCharacterInfo) setReferenceCharacterInfo(parsed.referenceCharacterInfo);
        if (parsed.referenceImage) setReferenceImage(parsed.referenceImage);
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
      promptHistory,
      referenceCharacterInfo,
      referenceImage,
    };
    localStorage.setItem("nanoProState", JSON.stringify(state));
  }, [generatedPrompt, characterType, clothing, age, nationality, complexion, visualStyle, aspectRatio, backgroundStyle, promptHistory, referenceCharacterInfo, referenceImage]);

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

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-nano", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiModel,
          visualStyle: visualStyle === "Custom" ? customVisualStyle : visualStyle,
          aspectRatio,
          characterType: characterType === "Custom" ? customCharacterType : characterType,
          clothing: clothing === "Custom" ? customClothing : clothing,
          age: age === "Custom" ? customAge : age,
          nationality: nationality === "Custom" ? customNationality : nationality,
          complexion: complexion === "Custom" ? customComplexion : complexion,
          backgroundStyle: backgroundStyle === "Custom" ? customBackgroundStyle : backgroundStyle,
          referenceCharacterInfo
        }),
      });
      const data = await res.json();
      if (data.prompt) {
        setGeneratedPrompt(data.prompt);
        setPromptHistory(prev => [{ 
          prompt: data.prompt, 
          timestamp: new Date().toLocaleTimeString(),
          parameters: {
            visualStyle: visualStyle === "Custom" ? customVisualStyle : visualStyle,
            characterType: characterType === "Custom" ? customCharacterType : characterType,
            clothing: clothing === "Custom" ? customClothing : clothing,
            age: age === "Custom" ? customAge : age,
            nationality: nationality === "Custom" ? customNationality : nationality,
            complexion: complexion === "Custom" ? customComplexion : complexion,
            backgroundStyle: backgroundStyle === "Custom" ? customBackgroundStyle : backgroundStyle,
          }
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
                {["Character", "Scene", "Shayari", "Song"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === tab.toLowerCase() 
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {tab} Settings
                  </button>
                ))}
              </div>

              {/* Settings Area (Placeholder) */}
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {activeTab === "character" ? "👤 Character Builder" :
                     activeTab === "scene" ? "🎬 Scene Builder" :
                     activeTab === "shayari" ? "📖 Shayari Mood" : "🎵 Song Atmosphere"}
                  </h2>
                  {activeTab === "character" && (
                    <button 
                      onClick={() => { setShowCharacterLibrary(true); fetchCharacterLibrary(); }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 transition-colors border border-indigo-500/20"
                    >
                      <Library className="w-3.5 h-3.5" /> Reuse Saved Character
                    </button>
                  )}
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
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                          Visual Style
                        </label>
                        <select
                          value={visualStyle}
                          onChange={(e) => setVisualStyle(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="3D Cartoon Style">3D Cartoon Style</option>
                          <option value="Photorealistic">Photorealistic</option>
                          <option value="Anime / Manga">Anime / Manga</option>
                          <option value="Cinematic 8k">Cinematic 8k</option>
                          <option value="Watercolor">Watercolor</option>
                          <option value="Cyberpunk">Cyberpunk</option>
                          <option value="Claymation">Claymation</option>
                          <option value="Pencil Sketch">Pencil Sketch</option>
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
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <option value="Girl">Girl</option>
                        <option value="Boy">Boy</option>
                        <option value="Female">Female (Adult)</option>
                        <option value="Male">Male (Adult)</option>
                        <option value="Elderly Woman">Elderly Woman</option>
                        <option value="Elderly Man">Elderly Man</option>
                        <option value="Girl in Banana Shape">Girl in Banana Shape</option>
                        <option value="Boy in Banana Shape">Boy in Banana Shape</option>
                        <option value="Cute Toddler in Strawberry Suit">Cute Toddler in Strawberry Suit</option>
                        <option value="Cute Toddler in Watermelon Suit">Cute Toddler in Watermelon Suit</option>
                        <option value="Dancing Cat">Dancing Cat</option>
                        <option value="Cute Dog">Cute Dog</option>
                        <option value="Robot">Robot</option>
                        <option value="Alien">Alien</option>
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
                        <option value="Casual (T-shirt and jeans)">Casual (T-shirt and jeans)</option>
                        <option value="Traditional Pakistani (Shalwar Kameez)">Traditional Pakistani (Shalwar Kameez)</option>
                        <option value="Formal Wear (Suit/Dress)">Formal Wear (Suit/Dress)</option>
                        <option value="Winter Wear (Sweater/Jacket)">Winter Wear (Sweater/Jacket)</option>
                        <option value="School Uniform">School Uniform</option>
                        <option value="Superhero Costume">Superhero Costume</option>
                        <option value="Pajamas">Pajamas</option>
                        <option value="Golden Yellow Corn Husk Suit with Husk Leaves">Golden Yellow Corn Husk Suit with Husk Leaves</option>
                        <option value="Fruit Salad Combo Costumes">Fruit Salad Combo Costumes</option>
                        <option value="Watermelon Striped Romper">Watermelon Striped Romper</option>
                        <option value="Strawberry Suit">Strawberry Suit</option>
                        <option value="Banana Shape Suit">Banana Shape Suit</option>
                        <option value="Charcoal Sherwani & Ivory Muslin Dupatta">Charcoal Sherwani & Ivory Muslin Dupatta</option>
                        <option value="Sportswear">Sportswear</option>
                        <option value="Vintage 90s Outfit">Vintage 90s Outfit</option>
                        <option value="Cyberpunk Techwear">Cyberpunk Techwear</option>
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
                        <option value="Infant (0-1)">Infant (0-1 years)</option>
                        <option value="Baby (1-2)">Baby (1-2 years)</option>
                        <option value="Toddler (3-5)">Toddler (3-5 years)</option>
                        <option value="Child (6-12)">Child (6-12 years)</option>
                        <option value="Teenager (13-19)">Teenager (13-19 years)</option>
                        <option value="Young Adult (20-35)">Young Adult (20-35 years)</option>
                        <option value="Adult (36-55)">Adult (36-55 years)</option>
                        <option value="Elderly (56-70)">Elderly (56-70 years)</option>
                        <option value="Senior (71+)">Senior (71+ years)</option>
                        <option value="Immortal / Ageless">Immortal / Ageless</option>
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
                        <option value="Pakistani">Pakistani</option>
                        <option value="Indian">Indian</option>
                        <option value="South Asian">South Asian</option>
                        <option value="Middle Eastern">Middle Eastern</option>
                        <option value="Arab">Arab</option>
                        <option value="Caucasian / White">Caucasian / White</option>
                        <option value="East Asian">East Asian</option>
                        <option value="Southeast Asian">Southeast Asian</option>
                        <option value="African / Black">African / Black</option>
                        <option value="Hispanic / Latino">Hispanic / Latino</option>
                        <option value="Native American / Indigenous">Native American / Indigenous</option>
                        <option value="Mixed / Multiracial">Mixed / Multiracial</option>
                        <option value="Fantasy / Otherworldly">Fantasy / Otherworldly</option>
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
                          <option value="Fair / Pale">Fair / Pale</option>
                          <option value="Light">Light</option>
                          <option value="Medium / Olive">Medium / Olive</option>
                          <option value="Tan / Brown">Tan / Brown</option>
                          <option value="Dark Brown">Dark Brown</option>
                          <option value="Black">Black</option>
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
                          <option value="Solid Green Screen">Solid Green Screen (For Chroma Key)</option>
                          <option value="Solid Blue Screen">Solid Blue Screen</option>
                          <option value="Solid White Background">Solid White Background</option>
                          <option value="Solid Black Background">Solid Black Background</option>
                          <option value="Natural / Realistic Setting">Natural / Realistic Setting</option>
                          <option value="Abstract Gradient">Abstract Gradient</option>
                          <option value="Studio Backdrop">Studio Backdrop</option>
                          <option value="Blurry Bokeh">Blurry Bokeh</option>
                          <option value="Cinematic Studio Lighting">Cinematic Studio Lighting</option>
                          <option value="Dreamy Soft Focus">Dreamy Soft Focus</option>
                          <option value="Neon Cyberpunk Alley">Neon Cyberpunk Alley</option>
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
                  </div>
                ) : activeTab === "scene" ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/20">
                    <div className="p-4 bg-slate-800/50 rounded-full">
                      <Sparkles className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-slate-300 font-medium">Work in Progress</h3>
                      <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                        The Scene parameters panel is being actively developed.
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
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-purple-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
              >
                {isGenerating ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {isGenerating ? "Synthesizing Prompt..." : "Generate Prompt"}
              </button>

              <div className="bg-slate-900/60 border border-purple-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                    Generated Output
                  </h3>
                  <div className="flex gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors tooltip-trigger" title="Reset All">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors tooltip-trigger" title="History">
                      <Clock className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-black/40 rounded-xl p-4 min-h-[200px] border border-white/5 font-mono text-sm text-purple-200/90 leading-relaxed shadow-inner">
                  {generatedPrompt || (
                    <span className="text-slate-600 italic">Your generated Nano Pro prompt will appear here...</span>
                  )}
                </div>

                {generatedPrompt && (
                  <button 
                    onClick={handleCopy}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-colors text-sm font-semibold border border-white/5"
                  >
                    <Copy className={`w-4 h-4 ${isCopied ? "text-green-400" : ""}`} /> 
                    {isCopied ? "Copied!" : "Copy Image Prompt"}
                  </button>
                )}
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
                    <div className="font-mono text-sm text-purple-200/90 leading-relaxed pr-12">
                      {item.prompt}
                    </div>
                    <button 
                      onClick={async () => {
                        await navigator.clipboard.writeText(item.prompt);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy to clipboard"
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
