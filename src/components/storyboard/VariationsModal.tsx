"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Check, X, Wand2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface VariationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  idea: string;
  language: string;
  currentHook?: string;
  currentEnding?: string;
  onApplyVariation: (type: string, selectedValue: string) => Promise<void>;
}

export function VariationsModal({
  isOpen,
  onClose,
  category,
  idea,
  language,
  currentHook,
  currentEnding,
  onApplyVariation,
}: VariationsModalProps) {
  const { showToast } = useToast();
  const [variationType, setVariationType] = useState<"hooks" | "punchlines" | "endings" | "story_ideas">("hooks");
  const [variations, setVariations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const fetchVariations = async (type: "hooks" | "punchlines" | "endings" | "story_ideas") => {
    setVariationType(type);
    setIsLoading(true);
    setSelectedIdx(null);
    try {
      const res = await fetch("/api/variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          category,
          idea,
          language,
          currentValue: type === "hooks" ? currentHook : type === "endings" ? currentEnding : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate variations");
      }
      setVariations(data.variations || []);
    } catch (e: any) {
      showToast(e.message || "Failed to generate variations", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (selectedIdx === null || !variations[selectedIdx]) {
      showToast("Please select a variation to apply.", "error");
      return;
    }
    try {
      await onApplyVariation(variationType, variations[selectedIdx]);
      showToast(`Variation applied successfully!`, "success");
      onClose();
    } catch (e: any) {
      showToast(e.message || "Failed to apply variation", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-card rounded-2xl border border-indigo-500/30 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-[#0d1019]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Generate Creative Variations</h3>
              <p className="text-xs text-gray-400">
                Explore alternative AI hooks, punchlines, endings & story angles.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "hooks", label: "3 Hooks" },
              { id: "punchlines", label: "3 Punchlines" },
              { id: "endings", label: "3 Endings" },
              { id: "story_ideas", label: "3 Story Ideas" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => fetchVariations(tab.id as any)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  variationType === tab.id
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                    : "bg-gray-900/60 border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action to trigger generation if empty */}
          {variations.length === 0 && !isLoading && (
            <div className="text-center p-8 rounded-2xl bg-gray-900/40 border border-gray-800 space-y-4">
              <Wand2 className="w-8 h-8 text-indigo-400 mx-auto" />
              <p className="text-sm text-gray-300">
                Click a category above to generate 3 unique AI variations.
              </p>
              <button
                onClick={() => fetchVariations(variationType)}
                className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-semibold shadow-lg"
              >
                Generate 3 {variationType.toUpperCase()}
              </button>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="p-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <p className="text-sm text-indigo-200 font-medium">
                Generating 3 unique {variationType}...
              </p>
            </div>
          )}

          {/* Variations List */}
          {!isLoading && variations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">Select one variation:</span>
                <button
                  onClick={() => fetchVariations(variationType)}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Options
                </button>
              </div>

              <div className="space-y-3">
                {variations.map((v, idx) => {
                  const isSel = selectedIdx === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedIdx(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSel
                          ? "bg-indigo-950/80 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500"
                          : "bg-gray-900/50 border-gray-800 text-gray-300 hover:border-gray-700"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                          isSel ? "bg-indigo-500 text-white" : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <p className="text-xs leading-relaxed font-medium pt-0.5">{v}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-800 bg-[#0d1019]/90">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={selectedIdx === null}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl gradient-bg-primary text-white text-xs font-semibold shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Apply Selected Variation
          </button>
        </div>
      </div>
    </div>
  );
}
