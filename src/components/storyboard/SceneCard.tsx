"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Edit3,
  Video,
  Image as ImageIcon,
  MessageSquare,
  Music,
  Volume2,
  Camera,
  Layers,
  Sparkles,
  PackageCheck,
  Loader2,
  X,
  Save,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { copyToClipboard } from "@/lib/utils";

export interface SceneData {
  id: string;
  sceneNumber: number;
  duration: number; // Always 8
  narration?: string | null;
  dialogue?: string | null;
  imagePrompt: string;
  videoPrompt: string;
  camera: string;
  motion: string;
  lighting: string;
  sfx?: string | null;
  music?: string | null;
  continuityNotes?: string | null;
  previousSceneState?: string | null;
  nextSceneState?: string | null;
}

interface SceneCardProps {
  scene: SceneData;
  totalScenes: number;
  onRegenerateScene: (sceneId: string, prompt?: string) => Promise<void>;
  onUpdateScene: (sceneId: string, updatedData: Partial<SceneData>) => Promise<void>;
}

export function SceneCard({
  scene,
  totalScenes,
  onRegenerateScene,
  onUpdateScene,
}: SceneCardProps) {
  const { showToast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [editImagePrompt, setEditImagePrompt] = useState(scene.imagePrompt);
  const [editVideoPrompt, setEditVideoPrompt] = useState(scene.videoPrompt);
  const [editNarration, setEditNarration] = useState(scene.narration || "");
  const [editDialogue, setEditDialogue] = useState(scene.dialogue || "");
  const [customRegenPrompt, setCustomRegenPrompt] = useState("");
  const [showRegenDialog, setShowRegenDialog] = useState(false);

  const triggerCopy = async (key: string, text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      showToast(`${label} copied!`, "success");
      setTimeout(() => setCopiedKey(null), 2500);
    } else {
      showToast("Failed to copy to clipboard.", "error");
    }
  };

  const handleCopyPackage = () => {
    const flowPackage = `
========================================
GOOGLE FLOW SCENE PACKAGE - SCENE #${scene.sceneNumber} OF ${totalScenes}
Duration: 8 Seconds
========================================

STEP 1:
STARTING FRAME IMAGE PROMPT
${scene.imagePrompt}

STEP 2:
VIDEO MOTION PROMPT
${scene.videoPrompt}

DIALOGUE
${scene.dialogue || scene.narration || "N/A"}

CAMERA
${scene.camera}

MOTION
${scene.motion}

LIGHTING
${scene.lighting}

SFX
${scene.sfx || "Action-matched SFX cue"}

MUSIC
${scene.music || "Playful bouncy comedy score"}
========================================
`.trim();

    triggerCopy("package", flowPackage, `Scene #${scene.sceneNumber} Flow Package`);
  };

  const handleSaveEdits = async () => {
    try {
      await onUpdateScene(scene.id, {
        imagePrompt: editImagePrompt,
        videoPrompt: editVideoPrompt,
        narration: editNarration,
        dialogue: editDialogue,
      });
      setIsEditing(false);
      showToast(`Scene #${scene.sceneNumber} saved successfully.`, "success");
    } catch (e: any) {
      showToast(e.message || "Failed to save scene edits", "error");
    }
  };

  const handleRegenSubmit = async () => {
    setIsRegenerating(true);
    setShowRegenDialog(false);
    try {
      await onRegenerateScene(scene.id, customRegenPrompt.trim() || undefined);
      showToast(`Scene #${scene.sceneNumber} regenerated cleanly!`, "success");
    } catch (e: any) {
      showToast(e.message || "Regeneration failed", "error");
    } finally {
      setIsRegenerating(false);
      setCustomRegenPrompt("");
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-6 relative overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
            #{scene.sceneNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Scene {scene.sceneNumber}</h3>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 tracking-wider">
                8 SEC FLOW CLIP
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Clip {scene.sceneNumber} of {totalScenes}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyPackage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl gradient-bg-primary text-white text-xs font-semibold shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            {copiedKey === "package" ? (
              <Check className="w-3.5 h-3.5 text-emerald-300" />
            ) : (
              <PackageCheck className="w-3.5 h-3.5" />
            )}
            <span>{copiedKey === "package" ? "Package Copied!" : "Copy Full Scene Package"}</span>
          </button>

          <button
            onClick={() => setShowRegenDialog(!showRegenDialog)}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-700 hover:border-indigo-500/50 text-gray-200 hover:text-white text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
          >
            {isRegenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span>Regenerate Scene</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl bg-gray-900 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Edit scene content manually"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Single Scene Regeneration Modal / Dialog */}
      {showRegenDialog && (
        <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-500/40 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Targeted Scene #{scene.sceneNumber} Regeneration
            </span>
            <button
              onClick={() => setShowRegenDialog(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-indigo-200/80">
            Regenerates strictly Scene #{scene.sceneNumber}. Character Bible, Visual Bible, and surrounding continuity remain locked.
          </p>
          <input
            type="text"
            value={customRegenPrompt}
            onChange={(e) => setCustomRegenPrompt(e.target.value)}
            placeholder="Optional change request (e.g. Make character bounce higher, change lighting to warm golden)..."
            className="w-full p-2.5 rounded-lg glass-input text-xs"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setShowRegenDialog(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleRegenSubmit}
              className="px-4 py-1.5 rounded-lg gradient-bg-primary text-white text-xs font-semibold shadow-md"
            >
              Confirm Regeneration
            </button>
          </div>
        </div>
      )}

      {/* Main Content View / Edit Mode */}
      {isEditing ? (
        <div className="space-y-4 text-xs">
          {scene.sceneNumber === 1 && (
            <div className="space-y-1">
              <label className="font-semibold text-gray-300">Step 1: Starting Frame Image Prompt</label>
              <textarea
                value={editImagePrompt}
                onChange={(e) => setEditImagePrompt(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl glass-input font-mono"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="font-semibold text-gray-300">
              {scene.sceneNumber === 1 ? "Step 2: Video Motion Prompt (8-Sec Animation)" : "8-Sec Video Motion Prompt"}
            </label>
            <textarea
              value={editVideoPrompt}
              onChange={(e) => setEditVideoPrompt(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl glass-input font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-gray-300">Narration</label>
              <input
                type="text"
                value={editNarration}
                onChange={(e) => setEditNarration(e.target.value)}
                className="w-full p-2.5 rounded-lg glass-input"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-gray-300">Dialogue</label>
              <input
                type="text"
                value={editDialogue}
                onChange={(e) => setEditDialogue(e.target.value)}
                className="w-full p-2.5 rounded-lg glass-input"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-lg text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdits}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg gradient-bg-primary text-white font-semibold"
            >
              <Save className="w-3.5 h-3.5" /> Save Edits
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Narration / Spoken Dialogue */}
          {(scene.narration || scene.dialogue) && (
            <div className="p-4 rounded-xl bg-gray-900/70 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  Narration & Spoken Dialogue
                </span>
                <button
                  onClick={() =>
                    triggerCopy(
                      `narration_${scene.id}`,
                      scene.narration || scene.dialogue || "",
                      "Narration"
                    )
                  }
                  className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white"
                >
                  {copiedKey === `narration_${scene.id}` ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>Copy Narration</span>
                </button>
              </div>
              <p className="text-sm font-medium text-white italic">
                "{scene.narration || scene.dialogue}"
              </p>
            </div>
          )}

          {/* Google Flow Image-to-Video Pipeline */}
          {scene.sceneNumber === 1 ? (
            /* Scene 1: Displays both STARTING FRAME IMAGE PROMPT & 8-SEC VIDEO MOTION PROMPT */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* STEP 1: STARTING FRAME IMAGE PROMPT */}
              <div className="p-4 rounded-xl bg-black/40 border border-gray-800 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-indigo-400" />
                      STEP 1: STARTING FRAME IMAGE PROMPT
                    </span>
                    <button
                      onClick={() =>
                        triggerCopy(`img_${scene.id}`, scene.imagePrompt, "Starting Frame Image Prompt")
                      }
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 cursor-pointer"
                    >
                      {copiedKey === `img_${scene.id}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy Image Prompt</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-200 font-mono leading-relaxed select-all bg-black/50 p-3 rounded-lg border border-gray-800">
                    {scene.imagePrompt}
                  </p>
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-2">
                  <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span>Generate this image in Google Flow / Imagen as your starting video frame</span>
                </div>
              </div>

              {/* STEP 2: 8-SECOND VIDEO MOTION PROMPT */}
              <div className="p-4 rounded-xl bg-black/40 border border-gray-800 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-cyan-400" />
                      STEP 2: 8-SEC VIDEO MOTION PROMPT
                    </span>
                    <button
                      onClick={() =>
                        triggerCopy(`vid_${scene.id}`, scene.videoPrompt, "8-Sec Video Motion Prompt")
                      }
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 cursor-pointer"
                    >
                      {copiedKey === `vid_${scene.id}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy Video Motion Prompt</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-200 font-mono leading-relaxed select-all bg-black/50 p-3 rounded-lg border border-gray-800">
                    {scene.videoPrompt}
                  </p>
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-2">
                  <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>Use newly generated starting image in Google Flow to animate 8s motion</span>
                </div>
              </div>
            </div>
          ) : (
            /* Scenes 2+: Display ONLY 8-SEC VIDEO MOTION PROMPT (No redundant Image Prompt box) */
            <div className="p-4 rounded-xl bg-black/40 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-cyan-400" />
                  8-SEC VIDEO MOTION PROMPT
                </span>
                <button
                  onClick={() =>
                    triggerCopy(`vid_${scene.id}`, scene.videoPrompt, "8-Sec Video Motion Prompt")
                  }
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 cursor-pointer"
                >
                  {copiedKey === `vid_${scene.id}` ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>Copy Video Motion Prompt</span>
                </button>
              </div>
              <p className="text-xs text-gray-200 font-mono leading-relaxed select-all bg-black/50 p-3 rounded-lg border border-gray-800">
                {scene.videoPrompt}
              </p>
              <div className="text-[10px] text-cyan-300/80 flex items-center gap-1.5 pt-1">
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>
                  In Google Flow, attach the ending frame from Scene #{scene.sceneNumber - 1} as the starting frame to animate this 8-second motion.
                </span>
              </div>
            </div>
          )}

          {/* Technical Specs: Camera, Motion, SFX, Music */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-black/30 p-3 rounded-xl border border-gray-800">
              <span className="text-gray-400 block text-[10px] mb-0.5 flex items-center gap-1">
                <Camera className="w-3 h-3 text-indigo-400" /> Camera Angle
              </span>
              <span className="font-semibold text-gray-200">{scene.camera}</span>
            </div>

            <div className="bg-black/30 p-3 rounded-xl border border-gray-800">
              <span className="text-gray-400 block text-[10px] mb-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Character Motion
              </span>
              <span className="font-semibold text-gray-200">{scene.motion}</span>
            </div>

            <div className="bg-black/30 p-3 rounded-xl border border-gray-800">
              <span className="text-gray-400 block text-[10px] mb-0.5 flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-amber-400" /> SFX Cue
              </span>
              <span className="font-semibold text-gray-200">{scene.sfx || "None"}</span>
            </div>

            <div className="bg-black/30 p-3 rounded-xl border border-gray-800">
              <span className="text-gray-400 block text-[10px] mb-0.5 flex items-center gap-1">
                <Music className="w-3 h-3 text-rose-400" /> Music Track
              </span>
              <span className="font-semibold text-gray-200">{scene.music || "Background"}</span>
            </div>
          </div>

          {/* Scene Continuity Block */}
          {(scene.previousSceneState || scene.nextSceneState || scene.continuityNotes) && (
            <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 text-xs space-y-1.5">
              <div className="font-semibold text-gray-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Scene Continuity Flow
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                {scene.previousSceneState && (
                  <div className="text-gray-400">
                    <span className="text-indigo-300 font-semibold">Prev Scene State:</span>{" "}
                    {scene.previousSceneState}
                  </div>
                )}
                {scene.nextSceneState && (
                  <div className="text-gray-400">
                    <span className="text-cyan-300 font-semibold">Next Scene State:</span>{" "}
                    {scene.nextSceneState}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
