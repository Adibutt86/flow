"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

import { SceneCard, SceneData } from "@/components/storyboard/SceneCard";
import { VariationsModal } from "@/components/storyboard/VariationsModal";
import { CreationWizard } from "@/components/wizard/CreationWizard";
import { useToast } from "@/components/ui/Toast";
import { getCategoryConfig } from "@/lib/categories";
import { copyToClipboard } from "@/lib/utils";
import { StorySourceBadge } from "@/components/common/StorySourceBadge";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import {
  ArrowLeft,
  Wand2,
  Film,
  PackageCheck,
  Sparkles,
  Clock,
  Globe,
  RefreshCw,
  Trash2,
  Check,
  Copy,
  Loader2,
  AlertCircle,
  Lock,
} from "lucide-react";

export default function ProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoggedIn, setIsAuthModalOpen } = useUser();
  const { isLight } = useTheme();

  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"storyboard" | "export">("storyboard");
  const [variationsOpen, setVariationsOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [isRegeneratingAll, setIsRegeneratingAll] = useState(false);
  const [copiedPackage, setCopiedPackage] = useState(false);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setProject(data.project);
      } else {
        throw new Error(data.error || "Failed to load project");
      }
    } catch (e: any) {
      showToast(e.message || "Failed to load project details", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleRegenerateScene = async (sceneId: string, prompt?: string) => {
    const res = await fetch(`/api/scenes/${sceneId}/regenerate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPromptToRegen: prompt }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Scene regeneration failed");
    }
    // Update local scene state
    setProject((prev: any) => ({
      ...prev,
      scenes: prev.scenes.map((s: any) => (s.id === sceneId ? data.scene : s)),
    }));
  };

  const handleUpdateScene = async (sceneId: string, updatedData: Partial<SceneData>) => {
    const res = await fetch(`/api/scenes/${sceneId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to update scene");
    }
    setProject((prev: any) => ({
      ...prev,
      scenes: prev.scenes.map((s: any) => (s.id === sceneId ? data.scene : s)),
    }));
  };

  const handleToggleCharacterLock = async (charId: string, currentLock: boolean) => {
    const res = await fetch(`/api/characters/${charId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked: !currentLock }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setProject((prev: any) => ({
        ...prev,
        characters: prev.characters.map((c: any) => (c.id === charId ? data.character : c)),
      }));
      showToast(`Character lock updated to ${!currentLock ? "LOCKED" : "UNLOCKED"}`, "info");
    }
  };

  const handleRegenerateAll = async () => {
    if (!confirm("Regenerate the entire story, Character Bible & all scene prompts?")) return;
    setIsRegeneratingAll(true);
    try {
      const res = await fetch(`/api/projects/${id}/generate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Regeneration failed");
      }
      setProject(data.project);
      showToast("Full project blueprint regenerated successfully!", "success");
    } catch (e: any) {
      showToast(e.message || "Failed to regenerate project", "error");
    } finally {
      setIsRegeneratingAll(false);
    }
  };

  const handleApplyVariation = async (type: string, selectedValue: string) => {
    let updatePayload: any = {};
    if (type === "hooks") updatePayload.hook = selectedValue;
    else if (type === "endings" || type === "punchlines") updatePayload.ending = selectedValue;
    else if (type === "story_ideas") updatePayload.summary = selectedValue;

    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setProject(data.project);
    } else {
      throw new Error(data.error || "Failed to update project variation");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Project deleted.", "info");
        router.push("/");
      }
    } catch (e) {
      showToast("Failed to delete project.", "error");
    }
  };

  const handleCopyFullFlowPackage = async () => {
    if (!project) return;
    let text = `=================================================\n`;
    text += `GOOGLE FLOW FULL STORYBOARD PACKAGE\n`;
    text += `Title: ${project.title}\n`;
    text += `Category: ${project.category}\n`;
    text += `Total Duration: ${project.duration} Seconds (${project.clipCount} Clips @ 8s)\n`;
    text += `Language: ${project.language}\n`;
    text += `Visual Style: ${project.visualStyle}\n`;
    text += `=================================================\n\n`;

    text += `--- STORY SUMMARY ---\n`;
    text += `Hook (First 2s): ${project.hook || "N/A"}\n`;
    text += `Summary: ${project.summary || "N/A"}\n`;
    text += `Ending / Punchline: ${project.ending || "N/A"}\n\n`;

    if (project.characters && project.characters.length > 0) {
      text += `--- CHARACTER BIBLE ---\n`;
      project.characters.forEach((c: any) => {
        text += `[${c.name}] (${c.role})\n`;
        text += `Appearance: ${c.appearance}\n`;
        text += `Clothing: ${c.clothing}\n`;
        text += `Ref Prompt: ${c.referencePrompt}\n\n`;
      });
    }

    if (project.scenes && project.scenes.length > 0) {
      text += `--- 8-SECOND SCENE CLIPS ---\n`;
      project.scenes.forEach((s: any) => {
        text += `SCENE #${s.sceneNumber} (8 SECONDS)\n`;
        text += `Audio & Spoken Voice: ${s.narration || s.dialogue || "Pure ASMR Audio (No Spoken Dialogue or Narration)"}\n`;
        text += `IMAGE PROMPT:\n${s.imagePrompt}\n`;
        text += `VIDEO PROMPT (8-SEC MOTION):\n${s.videoPrompt}\n`;
        text += `Camera: ${s.camera} | Motion: ${s.motion} | SFX: ${s.sfx || "None"}\n`;
        text += `-------------------------------------------------\n\n`;
      });
    }

    const success = await copyToClipboard(text);
    if (success) {
      setCopiedPackage(true);
      showToast("Full Google Flow Storyboard Package copied!", "success");
      setTimeout(() => setCopiedPackage(false), 3000);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${
        isLight ? "bg-zinc-100 text-zinc-900" : "bg-[#07090e] text-slate-100"
      }`}>
        <Navbar />
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
            <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600 font-medium" : "text-slate-300"}`}>
              Please log in to your account (Hassan or Adi) to access video project details and storyboards.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl gradient-bg-primary text-white font-extrabold text-sm shadow-xl shadow-indigo-500/30 hover:opacity-95 transition-all active:scale-95 cursor-pointer w-full"
          >
            Login to Access Website
          </button>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isLight ? "bg-zinc-100 text-zinc-900" : "bg-[#07090e] text-gray-100"
      }`}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className={`rounded-2xl p-8 text-center space-y-3 border shadow-lg ${
            isLight ? "bg-white border-slate-200 text-slate-900" : "glass-card text-slate-100"
          }`}>
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
            <p className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-gray-300"}`}>Loading Storyboard Blueprint...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isLight ? "bg-zinc-100 text-zinc-900" : "bg-[#07090e] text-gray-100"
      }`}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className={`rounded-2xl p-8 text-center space-y-4 max-w-md border shadow-lg ${
            isLight ? "bg-white border-slate-200 text-slate-900" : "glass-card text-slate-100"
          }`}>
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h2 className={`text-lg font-black ${isLight ? "text-slate-900" : "text-white"}`}>Project Not Found</h2>
            <Link
              href="/"
              className="inline-block px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryConfig = getCategoryConfig(project.category);

  return (
    <div className={`min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${
      isLight ? "bg-zinc-100 text-zinc-900" : "bg-[#07090e] text-gray-100"
    }`}>
      <Navbar onOpenWizard={() => setWizardOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setVariationsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-200 text-xs font-semibold shadow-md hover:bg-indigo-900 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Generate Variations</span>
            </button>

            <button
              onClick={handleRegenerateAll}
              disabled={isRegeneratingAll}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gray-900 border border-gray-700 hover:border-indigo-500/40 text-gray-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              {isRegeneratingAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              )}
              <span>Regenerate All</span>
            </button>

            <button
              onClick={handleDelete}
              className="p-1.5 sm:p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Header Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                  {categoryConfig.name}
                </span>
                <StorySourceBadge
                  storySource={project.storySource}
                  aiUsed={project.aiUsed}
                  provider={project.provider}
                  model={project.model}
                  showDetails={true}
                />
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {project.duration}s ({project.clipCount} Flow Clips)
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> {project.language}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                  {project.visualStyle}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {project.title}
              </h1>
            </div>

            <button
              onClick={handleCopyFullFlowPackage}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl gradient-bg-primary text-white font-bold text-xs shadow-xl shadow-indigo-500/25 hover:opacity-95 transition-all shrink-0 cursor-pointer"
            >
              {copiedPackage ? <Check className="w-4 h-4 text-emerald-300" /> : <PackageCheck className="w-4 h-4" />}
              <span>{copiedPackage ? "Full Package Copied!" : "Copy Full Flow Package"}</span>
            </button>
          </div>

          {/* Story Outline Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {project.hook && (
              <div className="p-4 rounded-xl bg-black/40 border border-gray-800 space-y-1">
                <span className="text-indigo-400 font-bold block">Opening Hook (First 2s)</span>
                <p className="text-gray-200">{project.hook}</p>
              </div>
            )}
            {project.summary && (
              <div className="p-4 rounded-xl bg-black/40 border border-gray-800 space-y-1 md:col-span-2">
                <span className="text-cyan-400 font-bold block">Story Synopsis</span>
                <p className="text-gray-200">{project.summary}</p>
              </div>
            )}
            {project.ending && (
              <div className="p-4 rounded-xl bg-black/40 border border-gray-800 space-y-1 md:col-span-3">
                <span className="text-amber-400 font-bold block">Ending / Punchline</span>
                <p className="text-gray-200 italic">{project.ending}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 space-x-2">
          {[
            { id: "storyboard", label: `Storyboard (${project.scenes?.length || 0} Clips)`, icon: Film },
            { id: "export", label: "Flow Export Package", icon: PackageCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  isSel
                    ? "border-indigo-500 text-indigo-400 bg-indigo-950/30 rounded-t-xl"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: STORYBOARD SCENES */}
        {activeTab === "storyboard" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                8-Second Google Flow Clip Scenes
              </h2>
              <span className="text-xs text-gray-400">
                Each card represents an 8-second visual prompt & motion package.
              </span>
            </div>

            <div className="space-y-6">
              {project.scenes?.map((scene: any) => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  totalScenes={project.scenes.length}
                  onRegenerateScene={handleRegenerateScene}
                  onUpdateScene={handleUpdateScene}
                />
              ))}
            </div>
          </div>
        )}



        {/* TAB 4: EXPORT PACKAGE */}
        {activeTab === "export" && (
          <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-indigo-400" />
                  Google Flow Master Package
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Copy prompts directly into Google Flow web app to render your 8-second clips.
                </p>
              </div>
              <button
                onClick={handleCopyFullFlowPackage}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs shadow-md"
              >
                {copiedPackage ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPackage ? "Copied All!" : "Copy Entire Package"}</span>
              </button>
            </div>

            {/* Formatted Package Preview */}
            <div className="bg-black/60 p-6 rounded-xl border border-gray-800 font-mono text-xs text-gray-300 space-y-6 leading-relaxed select-all">
              <div>
                <div className="text-indigo-400 font-bold text-sm border-b border-gray-800 pb-2 mb-2">
                  === PROJECT: {project.title} ===
                </div>
                <div>Category: {project.category} | Duration: {project.duration}s ({project.clipCount} clips @ 8s)</div>
                <div>Language: {project.language} | Visual Style: {project.visualStyle}</div>
              </div>

              {project.characters?.length > 0 && (
                <div>
                  <div className="text-cyan-400 font-bold border-b border-gray-800 pb-1 mb-2">
                    --- CHARACTER REFERENCE PROMPTS ---
                  </div>
                  {project.characters.map((c: any) => (
                    <div key={c.id} className="mb-3">
                      <div className="font-bold text-white">Character: {c.name} ({c.role})</div>
                      <div className="text-gray-400 font-sans text-[11px] mb-1">Ref Prompt:</div>
                      <div className="bg-gray-900 p-2.5 rounded-lg border border-gray-800 text-indigo-200">
                        {c.referencePrompt}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <div className="text-emerald-400 font-bold border-b border-gray-800 pb-1 mb-2">
                  --- 8-SECOND VISUAL CLIP PROMPTS ---
                </div>
                {project.scenes?.map((s: any) => (
                  <div key={s.id} className="p-4 rounded-xl bg-gray-950 border border-gray-800 mb-4 space-y-2">
                    <div className="text-white font-bold">SCENE #{s.sceneNumber} (8 SECONDS)</div>
                    <div><span className="text-gray-400">Narration/Dialogue:</span> "{s.narration || s.dialogue || "N/A"}"</div>
                    {s.sceneNumber === 1 && (
                      <div>
                        <span className="text-indigo-300 font-bold">STEP 1: STARTING FRAME IMAGE PROMPT:</span>
                        <div className="bg-black p-2 rounded border border-gray-800 text-gray-200 mt-1">{s.imagePrompt}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-cyan-300 font-bold">
                        {s.sceneNumber === 1 ? "STEP 2: 8-SEC VIDEO MOTION PROMPT:" : "8-SEC VIDEO MOTION PROMPT (Attach prev clip end frame):"}
                      </span>
                      <div className="bg-black p-2 rounded border border-gray-800 text-gray-200 mt-1">{s.videoPrompt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* VARIATIONS MODAL */}
      <VariationsModal
        isOpen={variationsOpen}
        onClose={() => setVariationsOpen(false)}
        category={project.category}
        idea={project.idea}
        language={project.language}
        currentHook={project.hook}
        currentEnding={project.ending}
        onApplyVariation={handleApplyVariation}
      />

      {/* CREATION WIZARD MODAL */}
      <CreationWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </div>
  );
}
