import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateProjectContent } from "@/lib/ai/gemini";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await db.project.findUnique({
      where: { id },
      include: { characters: true, visualBible: true },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 200 }
      );
    }

    await db.project.update({
      where: { id },
      data: { status: "GENERATING" },
    });

    const generated = await generateProjectContent({
      category: project.category,
      duration: project.duration,
      language: project.language,
      visualStyle: project.visualStyle,
      idea: project.idea,
      customInstructions: project.customInstructions || undefined,
    });

    // Clear existing child records if regenerating
    await db.scene.deleteMany({ where: { projectId: id } });
    await db.character.deleteMany({ where: { projectId: id } });
    await db.visualBible.deleteMany({ where: { projectId: id } });

    await db.project.update({
      where: { id },
      data: {
        title: generated.title || project.title,
        hook: generated.hook,
        summary: generated.summary,
        ending: generated.ending,
        status: "COMPLETED",
      },
    });

    if (generated.characters) {
      for (const c of generated.characters) {
        await db.character.create({
          data: {
            projectId: id,
            name: c.name,
            role: c.role || "Main Character",
            age: c.age,
            gender: c.gender,
            appearance: c.appearance,
            face: c.face,
            hair: c.hair,
            eyes: c.eyes,
            skinTone: c.skinTone,
            bodyType: c.bodyType,
            clothing: c.clothing,
            accessories: c.accessories,
            personality: c.personality,
            expressions: c.expressions,
            typicalPoses: c.typicalPoses,
            referencePrompt: c.referencePrompt,
            locked: true,
          },
        });
      }
    }

    if (generated.visualBible) {
      const vb = generated.visualBible;
      await db.visualBible.create({
        data: {
          projectId: id,
          style: vb.style,
          lighting: vb.lighting,
          colorPalette: vb.colorPalette,
          cameraStyle: vb.cameraStyle,
          lens: vb.lens,
          environment: vb.environment,
          atmosphere: vb.atmosphere,
          texture: vb.texture,
          renderingStyle: vb.renderingStyle,
          aspectRatio: vb.aspectRatio || "9:16",
        },
      });
    }

    if (generated.scenes) {
      for (const s of generated.scenes) {
        await db.scene.create({
          data: {
            projectId: id,
            sceneNumber: s.sceneNumber,
            duration: 8,
            narration: s.narration,
            dialogue: s.dialogue,
            imagePrompt: s.imagePrompt,
            videoPrompt: s.videoPrompt,
            camera: s.camera,
            motion: s.motion,
            lighting: s.lighting,
            sfx: s.sfx,
            music: s.music,
            continuityNotes: s.continuityNotes,
            previousSceneState: s.previousSceneState,
            nextSceneState: s.nextSceneState,
            status: "GENERATED",
          },
        });
      }
    }

    await db.generation.create({
      data: {
        projectId: id,
        type: "PROJECT_GENERATE",
        prompt: project.idea,
        response: JSON.stringify(generated),
      },
    });

    const updatedProject = await db.project.findUnique({
      where: { id },
      include: {
        characters: true,
        visualBible: true,
        scenes: { orderBy: { sceneNumber: "asc" } },
      },
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error: any) {
    console.error("POST /api/projects/[id]/generate error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate project content" },
      { status: 200 }
    );
  }
}
