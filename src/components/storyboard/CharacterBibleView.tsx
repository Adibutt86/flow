"use client";

import React, { useState } from "react";
import { Copy, Lock, Unlock, UserCheck, Sparkles, Check, Shirt, Smile, User } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { copyToClipboard } from "@/lib/utils";

interface Character {
  id: string;
  name: string;
  role: string;
  age?: string | null;
  gender?: string | null;
  appearance: string;
  face?: string | null;
  hair?: string | null;
  eyes?: string | null;
  skinTone?: string | null;
  bodyType?: string | null;
  clothing: string;
  accessories?: string | null;
  personality: string;
  expressions?: string | null;
  typicalPoses?: string | null;
  referencePrompt: string;
  locked: boolean;
}

interface CharacterBibleViewProps {
  characters: Character[];
  onToggleLock?: (id: string, currentLock: boolean) => void;
}

export function CharacterBibleView({ characters, onToggleLock }: CharacterBibleViewProps) {
  const { showToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyRefPrompt = async (character: Character) => {
    const success = await copyToClipboard(character.referencePrompt);
    if (success) {
      setCopiedId(character.id);
      showToast(`Character Reference Prompt for '${character.name}' copied to clipboard!`, "success");
      setTimeout(() => setCopiedId(null), 2500);
    } else {
      showToast("Failed to copy prompt to clipboard.", "error");
    }
  };

  if (!characters || characters.length === 0) {
    return (
      <div className="p-8 rounded-2xl glass-card text-center text-gray-400">
        No characters created yet for this project.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            Character Bible ({characters.length})
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Locked character blueprints prevent AI model drift across all 8-second clips.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {characters.map((char) => (
          <div
            key={char.id}
            className="glass-card rounded-2xl p-6 border border-gray-800 space-y-5 relative overflow-hidden"
          >
            {/* Header / Lock badge */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-bg-primary flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
                  {char.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{char.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {char.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {char.age ? `Age: ${char.age}` : ""} {char.gender ? `• ${char.gender}` : ""}
                  </p>
                </div>
              </div>

              {onToggleLock && (
                <button
                  onClick={() => onToggleLock(char.id, char.locked)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    char.locked
                      ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
                      : "bg-gray-900 border-gray-700 text-gray-400"
                  }`}
                  title={char.locked ? "Character Bible is LOCKED" : "Lock Character"}
                >
                  {char.locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{char.locked ? "LOCKED" : "UNLOCKED"}</span>
                </button>
              )}
            </div>

            {/* Trait Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-black/30 p-3 rounded-xl border border-gray-800/60 space-y-1">
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-400" /> Appearance & Build
                </span>
                <p className="text-gray-200 font-semibold">{char.appearance}</p>
                {char.skinTone && <p className="text-[11px] text-gray-400">Skin: {char.skinTone}</p>}
                {char.hair && <p className="text-[11px] text-gray-400">Hair: {char.hair}</p>}
              </div>

              <div className="bg-black/30 p-3 rounded-xl border border-gray-800/60 space-y-1">
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <Shirt className="w-3.5 h-3.5 text-cyan-400" /> Signature Outfit
                </span>
                <p className="text-gray-200 font-semibold">{char.clothing}</p>
                {char.accessories && <p className="text-[11px] text-gray-400">Accessories: {char.accessories}</p>}
              </div>

              <div className="bg-black/30 p-3 rounded-xl border border-gray-800/60 space-y-1 col-span-2">
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5 text-amber-400" /> Personality & Expressions
                </span>
                <p className="text-gray-200 font-medium">{char.personality}</p>
                {char.expressions && <p className="text-[11px] text-gray-400">Expressions: {char.expressions}</p>}
              </div>
            </div>

            {/* Character Reference Image Prompt Box */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Google Flow Master Character Reference Prompt
                </span>
                <button
                  onClick={() => handleCopyRefPrompt(char)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  {copiedId === char.id ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === char.id ? "Copied!" : "Copy Ref Prompt"}</span>
                </button>
              </div>
              <p className="text-xs text-indigo-100/90 font-mono bg-black/50 p-3 rounded-lg border border-indigo-900/50 leading-relaxed select-all">
                {char.referencePrompt}
              </p>
              <p className="text-[11px] text-indigo-300/70 italic">
                Paste this prompt into your image generator (e.g. Midjourney / Imagen) to create the master reference sheet (front, 3/4, side, full body).
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
