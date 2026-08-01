"use client";

import React from "react";
import Link from "next/link";
import { Film, Clock, Layers, ArrowRight, Trash2, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { getCategoryConfig } from "@/lib/categories";
import { StorySourceBadge } from "@/components/common/StorySourceBadge";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    category: string;
    idea: string;
    duration: number;
    clipCount: number;
    status: string;
    storySource?: string | null;
    aiUsed?: boolean | null;
    provider?: string | null;
    model?: string | null;
    createdAt: string;
  };
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const categoryConfig = getCategoryConfig(project.category);

  return (
    <div className="group glass-card glass-card-hover rounded-2xl p-5 border border-gray-800 flex flex-col justify-between relative overflow-hidden">
      <div>
        {/* Card Header: Category & Source Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
              {categoryConfig.name}
            </span>
            <StorySourceBadge storySource={project.storySource} aiUsed={project.aiUsed} />
          </div>

          <div className="flex items-center gap-2">
            {project.status === "COMPLETED" && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            )}
            {project.status === "GENERATING" && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                <Loader2 className="w-3 h-3 animate-spin" /> Generating
              </span>
            )}
            {project.status === "ERROR" && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-500/30">
                <AlertCircle className="w-3 h-3" /> Error
              </span>
            )}

            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(project.id);
                }}
                className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <Link href={`/projects/${project.id}`}>
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2 line-clamp-1">
            {project.title}
          </h3>
        </Link>

        {/* Idea excerpt */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 italic bg-black/30 p-2.5 rounded-lg border border-gray-800/60">
          "{project.idea}"
        </p>
      </div>

      {/* Footer Info */}
      <div>
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 pt-3 border-t border-gray-800/80">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{project.duration} sec</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {project.clipCount} {project.clipCount === 1 ? "Flow clip" : "Flow clips"} (8s ea)
            </span>
          </div>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-gray-900/80 border border-gray-800 group-hover:border-indigo-500/40 text-xs font-semibold text-gray-200 group-hover:text-white transition-all"
        >
          <span>Open Storyboard</span>
          <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
