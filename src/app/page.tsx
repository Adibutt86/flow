"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { CreationWizard } from "@/components/wizard/CreationWizard";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { CATEGORIES } from "@/lib/categories";
import { CategoryId } from "@/lib/categories/types";
import { useToast } from "@/components/ui/Toast";
import {
  Wand2,
  Video,
  Sparkles,
  Layers,
  Clock,
  HelpCircle,
  PlusCircle,
  Film,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedWizardCat, setSelectedWizardCat] = useState<CategoryId | undefined>(undefined);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects || []);
        }
      }
    } catch (e: any) {
      console.error("Failed to fetch projects:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    const onFocus = () => {
      fetchProjects();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const contentType = res.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (res.ok && data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        showToast("Project deleted successfully.", "info");
      } else {
        throw new Error(data.error || "Failed to delete project");
      }
    } catch (e: any) {
      showToast(e.message || "Failed to delete project", "error");
    }
  };

  const handleOpenWizardWithCategory = (catId: CategoryId) => {
    setSelectedWizardCat(catId);
    setWizardOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-gray-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar onOpenWizard={() => { setSelectedWizardCat(undefined); setWizardOpen(true); }} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* HERO SECTION */}
        <section className="relative glass-card rounded-3xl p-8 md:p-12 border border-indigo-500/20 overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none animate-glow" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none animate-glow" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Optimized for Google Flow (8-Second Video Clips)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Create characters, stories, scenes & AI video prompts for{" "}
              <span className="gradient-text">short-form videos.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed">
              Transform your raw story idea into production-ready Character Bibles, Visual Bibles, 
              narrations, and exact 8-second visual & motion prompts designed specifically for Google Flow.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => { setSelectedWizardCat(undefined); setWizardOpen(true); }}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl gradient-bg-primary text-white font-bold text-sm shadow-xl shadow-indigo-500/30 hover:opacity-95 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Wand2 className="w-5 h-5" />
                <span>Create New Video Concept</span>
              </button>

              <a
                href="#google-flow-info"
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl glass-card border border-gray-700 text-gray-200 hover:text-white text-sm font-semibold transition-all hover:bg-gray-800/80"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Google Flow Constraint Guide</span>
              </a>
            </div>
          </div>
        </section>

        {/* GOOGLE FLOW CONSTRAINT INFO CARD */}
        <section id="google-flow-info" className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/40 border border-cyan-500/30 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-900/50 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Google Flow 8-Second Clips Architecture
              </h3>
              <p className="text-xs text-cyan-200/80">
                Google Flow is used for generating 8-second video clips. Select any duration (8s to 64s) and AI Short Studio automatically breaks your video into 8-second clip scenes with continuity locks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2 text-center text-xs">
            {[
              { s: 8, c: 1 },
              { s: 16, c: 2 },
              { s: 24, c: 3 },
              { s: 32, c: 4 },
              { s: 40, c: 5 },
              { s: 48, c: 6 },
              { s: 56, c: 7 },
              { s: 64, c: 8 },
            ].map((item) => (
              <div key={item.s} className="p-2.5 rounded-xl bg-black/40 border border-cyan-900/40">
                <div className="font-bold text-white text-sm">{item.s}s</div>
                <div className="text-[10px] text-cyan-400">{item.c} {item.c === 1 ? "clip" : "clips"}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES GRID SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Select Content Category
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Every category enforces specialized storytelling rules, pacing, and comedic/horror timing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(CATEGORIES) as CategoryId[]).map((catId) => (
              <CategoryCard
                key={catId}
                category={CATEGORIES[catId]}
                onSelect={() => handleOpenWizardWithCategory(catId)}
              />
            ))}
          </div>
        </section>

        {/* RECENT PROJECTS SECTION */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-indigo-400" />
                Recent Video Blueprints ({projects.length})
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Access your generated storyboards, character reference prompts, and Google Flow packages.
              </p>
            </div>

            <button
              onClick={() => { setSelectedWizardCat(undefined); setWizardOpen(true); }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/40 text-xs font-semibold text-indigo-200 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span>Create New Script</span>
            </button>
          </div>

          {isLoading ? (
            <div className="p-12 glass-card rounded-2xl text-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <p className="text-sm text-gray-400">Loading video projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 glass-card rounded-2xl text-center space-y-4 border border-dashed border-gray-800">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
                <Video className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No video blueprints created yet</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Click below to launch the Creation Wizard and generate your first Google Flow storyboard with character bibles & prompts.
                </p>
              </div>
              <button
                onClick={() => { setSelectedWizardCat(undefined); setWizardOpen(true); }}
                className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white font-semibold text-xs shadow-lg"
              >
                Create Your First Video Concept
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-gray-800/80 bg-[#090b10] py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-gray-400">AI Short Studio</span> • Google Flow Video Prompt & Storyboard Engine
          </div>
          <div className="text-[11px] text-gray-500">
            Generates 8-second clip scene packages for Google Flow. Video generation APIs can be connected seamlessly.
          </div>
        </div>
      </footer>

      <CreationWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        initialCategory={selectedWizardCat}
      />
    </div>
  );
}
