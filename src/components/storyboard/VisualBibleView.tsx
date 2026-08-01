"use client";

import React from "react";
import { Palette, Camera, Sun, Layers, Sparkles, SlidersHorizontal, Image as ImageIcon } from "lucide-react";

interface VisualBible {
  id: string;
  style: string;
  lighting: string;
  colorPalette: string;
  cameraStyle: string;
  lens: string;
  environment: string;
  atmosphere: string;
  texture: string;
  renderingStyle: string;
  aspectRatio: string;
}

interface VisualBibleViewProps {
  visualBible: VisualBible | null;
  fallbackStyle?: string;
}

export function VisualBibleView({ visualBible, fallbackStyle }: VisualBibleViewProps) {
  if (!visualBible) {
    return (
      <div className="p-8 rounded-2xl glass-card text-center text-gray-400">
        Default Visual Style: <span className="text-indigo-300 font-semibold">{fallbackStyle || "3D Cartoon"}</span>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-cyan-400" />
            Visual Bible
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Unified art style, camera optics, color palette & lighting guidelines for all 8-second scenes.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
          Aspect Ratio: {visualBible.aspectRatio || "9:16 Vertical"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div className="bg-black/30 p-4 rounded-xl border border-gray-800 space-y-1">
          <span className="text-gray-400 font-medium flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> Art & Rendering Style
          </span>
          <p className="text-sm font-bold text-white">{visualBible.style}</p>
          <p className="text-gray-400">{visualBible.renderingStyle}</p>
        </div>

        <div className="bg-black/30 p-4 rounded-xl border border-gray-800 space-y-1">
          <span className="text-gray-400 font-medium flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-300" /> Lighting & Atmosphere
          </span>
          <p className="text-sm font-bold text-white">{visualBible.lighting}</p>
          <p className="text-gray-400">{visualBible.atmosphere}</p>
        </div>

        <div className="bg-black/30 p-4 rounded-xl border border-gray-800 space-y-1">
          <span className="text-gray-400 font-medium flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-rose-400" /> Color Palette
          </span>
          <p className="text-sm font-bold text-white">{visualBible.colorPalette}</p>
          <p className="text-gray-400">Textures: {visualBible.texture}</p>
        </div>

        <div className="bg-black/30 p-4 rounded-xl border border-gray-800 space-y-1 md:col-span-2">
          <span className="text-gray-400 font-medium flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-indigo-400" /> Camera Optics & Framing Style
          </span>
          <p className="text-sm font-bold text-white">{visualBible.cameraStyle}</p>
          <p className="text-gray-400">Lens: {visualBible.lens}</p>
        </div>

        <div className="bg-black/30 p-4 rounded-xl border border-gray-800 space-y-1">
          <span className="text-gray-400 font-medium flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-emerald-400" /> Environment World
          </span>
          <p className="text-sm font-bold text-white">{visualBible.environment}</p>
        </div>
      </div>
    </div>
  );
}
