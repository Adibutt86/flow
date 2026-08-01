import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { regenerateSingleSceneWithClaude } from "@/lib/ai/claude";
import type { Scene, Character } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sceneId } = await params;
    const body = await request.json().catch(() => ({}));
    const { userPromptToRegen } = body;

    // Fetch scene with parent project, characters, visual bible, and surrounding scenes
    const scene = await db.scene.findUnique({
      where: { id: sceneId },
      include: {
        project: {
          include: {
            characters: true,
            visualBible: true,
            scenes: {
              orderBy: { sceneNumber: "asc" },
            },
          },
        },
      },
    });

    if (!scene || !scene.project) {
      return NextResponse.json(
        { success: false, error: "Scene not found" },
        { status: 404 }
      );
    }

    const { project } = scene;
    const prevScene = project.scenes.find((s: Scene) => s.sceneNumber === scene.sceneNumber - 1);
    const nextScene = project.scenes.find((s: Scene) => s.sceneNumber === scene.sceneNumber + 1);

    const charactersSummary = project.characters.map((c: Character) => ({
      name: c.name,
      appearance: c.appearance,
      clothing: c.clothing,
    }));

    const visualBibleSummary = project.visualBible
      ? {
          style: project.visualBible.style,
          lighting: project.visualBible.lighting,
          colorPalette: project.visualBible.colorPalette,
          environment: project.visualBible.environment,
        }
      : {
          style: project.visualStyle,
          lighting: "Warm",
          colorPalette: "Vibrant",
          environment: "Standard",
        };

    const regeneratedData = await regenerateSingleSceneWithClaude({
      category: project.category,
      language: project.language,
      visualStyle: project.visualStyle,
      idea: project.idea,
      sceneNumber: scene.sceneNumber,
      totalScenes: project.scenes.length,
      characters: charactersSummary,
      visualBible: visualBibleSummary,
      previousSceneState: prevScene?.nextSceneState || scene.previousSceneState || undefined,
      currentSceneNotes: scene.continuityNotes || undefined,
      nextSceneState: nextScene?.previousSceneState || scene.nextSceneState || undefined,
      userPromptToRegen,
    });

    // Update only this scene in the database
    const updatedScene = await db.scene.update({
      where: { id: sceneId },
      data: {
        narration: regeneratedData.narration,
        dialogue: regeneratedData.dialogue,
        imagePrompt: regeneratedData.imagePrompt,
        videoPrompt: regeneratedData.videoPrompt,
        camera: regeneratedData.camera,
        motion: regeneratedData.motion,
        lighting: regeneratedData.lighting,
        sfx: regeneratedData.sfx,
        music: regeneratedData.music,
        continuityNotes: regeneratedData.continuityNotes,
        previousSceneState: regeneratedData.previousSceneState,
        nextSceneState: regeneratedData.nextSceneState,
        status: "GENERATED",
      },
    });

    // Log generation history
    await db.generation.create({
      data: {
        projectId: project.id,
        type: "SCENE_REGEN",
        prompt: `Regenerate Scene #${scene.sceneNumber}: ${userPromptToRegen || "General refresh"}`,
        response: JSON.stringify(updatedScene),
      },
    });

    return NextResponse.json({ success: true, scene: updatedScene });
  } catch (error: any) {
    console.error("POST /api/scenes/[id]/regenerate error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to regenerate scene" },
      { status: 500 }
    );
  }
}
