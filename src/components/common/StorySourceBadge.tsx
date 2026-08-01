"use client";

import React from "react";
import { Sparkles, PenLine, CheckCircle } from "lucide-react";

export type StorySourceType = "ai" | "custom" | "custom_fallback";

interface StorySourceBadgeProps {
  storySource?: string | null;
  aiUsed?: boolean | null;
  provider?: string | null;
  model?: string | null;
  showDetails?: boolean;
}

export function StorySourceBadge({
  storySource = "custom",
  aiUsed = true,
  provider = "Claude (Anthropic)",
  model = "claude-3-7-sonnet",
  showDetails = false,
}: StorySourceBadgeProps) {
  let badgeConfig = {
    label: "Claude AI Script",
    tooltip: "Generated using Anthropic Claude API",
    bg: "bg-amber-950/80 border-amber-500/40 text-amber-300",
    icons: (
      <div className="flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
      </div>
    ),
  };

  if (!aiUsed && storySource === "custom_fallback") {
    badgeConfig = {
      label: "Custom + Pipeline",
      tooltip: "Your custom idea expanded using the built-in Pipeline Engine.",
      bg: "bg-gray-900 border-gray-700 text-gray-300",
      icons: (
        <div className="flex items-center gap-1">
          <PenLine className="w-3.5 h-3.5 text-gray-400" />
        </div>
      ),
    };
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm transition-all cursor-help ${badgeConfig.bg}`}
        title={badgeConfig.tooltip}
      >
        {badgeConfig.icons}
        <span>{badgeConfig.label}</span>
      </div>

      {showDetails && (
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 pt-1 border-t border-gray-800/60 mt-1">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            AI Status: <strong className="text-gray-200">{aiUsed ? "✓ Active Claude API" : "Pipeline Mode"}</strong>
          </span>
          {provider && (
            <span>
              Provider: <strong className="text-gray-200">{provider}</strong>
            </span>
          )}
          {model && (
            <span>
              Model: <strong className="text-gray-200">{model}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
