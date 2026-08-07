import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateProjectContentWithClaude } from "@/lib/ai/claude";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function ensureProjectColumnsExist() {
  try {
    await db.$executeRawUnsafe(`
      ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "storySource" TEXT DEFAULT 'custom';
      ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "aiUsed" BOOLEAN DEFAULT false;
      ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "provider" TEXT;
      ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "model" TEXT;
      ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "generationMode" TEXT;
      ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "userId" TEXT;
    `);
  } catch (e) {
    // ignore raw migration error if already exists
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || request.headers.get("x-user-id");

    const whereCondition: any = {};
    if (userId && userId !== "all" && userId !== "master-user-id") {
      whereCondition.userId = userId;
    }

    let projects;
    try {
      projects = await db.project.findMany({
        where: whereCondition,
        orderBy: { createdAt: "desc" },
        include: {
          characters: true,
          visualBible: true,
          scenes: {
            orderBy: { sceneNumber: "asc" },
          },
        },
      });
    } catch (dbErr: any) {
      if (dbErr?.code === "P2022" || String(dbErr).includes("ColumnNotFound") || String(dbErr).includes("storySource")) {
        console.warn("Detected missing database columns, executing self-healing schema repair...");
        await ensureProjectColumnsExist();
        projects = await db.project.findMany({
          where: whereCondition,
          orderBy: { createdAt: "desc" },
          include: {
            characters: true,
            visualBible: true,
            scenes: {
              orderBy: { sceneNumber: "asc" },
            },
          },
        });
      } else {
        throw dbErr;
      }
    }
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch projects" },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const headerUserId = request.headers.get("x-user-id");
    const {
      title,
      category,
      idea,
      language = "English",
      visualStyle = "3D Cartoon",
      duration = 32,
      customInstructions,
      userCharacters,
      storySource = "ai",
      autoGenerate = true,
      userId: bodyUserId,
    } = body;

    const finalUserId = bodyUserId || headerUserId || "master-user-id";

    if (!category || !idea) {
      return NextResponse.json(
        { success: false, error: "Category and Idea are required." },
        { status: 200 }
      );
    }

    const clipCount = Math.max(1, Math.floor(Number(duration) / 8));
    const projectTitle = title || `${category} - ${idea.slice(0, 30)}...`;

    // Create base project record
    const project = await db.project.create({
      data: {
        title: projectTitle,
        category,
        idea,
        language,
        visualStyle,
        duration: Number(duration),
        clipCount,
        customInstructions,
        storySource,
        userId: finalUserId,
        status: autoGenerate ? "GENERATING" : "DRAFT",
      },
    });

    if (!autoGenerate) {
      return NextResponse.json({ success: true, project });
    }

    try {
      const generated = await generateProjectContentWithClaude({
        category,
        duration: Number(duration),
        language,
        visualStyle,
        idea,
        customInstructions,
        userCharacters,
      });

      // Update project with story details
      await db.project.update({
        where: { id: project.id },
        data: {
          title: generated.title || projectTitle,
          hook: generated.hook,
          summary: generated.summary,
          ending: generated.ending,
          storySource: "ai",
          aiUsed: generated.aiUsed,
          provider: generated.provider,
          model: generated.model,
          generationMode: generated.generationMode,
          status: "COMPLETED",
        },
      });

      // Create characters
      if (generated.characters && generated.characters.length > 0) {
        for (const c of generated.characters) {
          await db.character.create({
            data: {
              projectId: project.id,
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

      // Create Visual Bible
      if (generated.visualBible) {
        const vb = generated.visualBible;
        await db.visualBible.create({
          data: {
            projectId: project.id,
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

      // Create 8-second scenes
      if (generated.scenes && generated.scenes.length > 0) {
        for (const s of generated.scenes) {
          await db.scene.create({
            data: {
              projectId: project.id,
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

      // Log generation history
      await db.generation.create({
        data: {
          projectId: project.id,
          type: "STORY_FULL",
          prompt: JSON.stringify({ category, duration, language, visualStyle, idea, provider: "Claude" }),
          response: JSON.stringify(generated),
        },
      });

      // Fetch complete updated project
      const finalProject = await db.project.findUnique({
        where: { id: project.id },
        include: {
          characters: true,
          visualBible: true,
          scenes: { orderBy: { sceneNumber: "asc" } },
        },
      });

      return NextResponse.json({ success: true, project: finalProject });
    } catch (genError: any) {
      console.error("AI Generation / Save error:", genError);
      await db.project.update({
        where: { id: project.id },
        data: { status: "ERROR" },
      });

      const details = genError?.details || {};
      return NextResponse.json(
        {
          success: false,
          stage: details.stage || "AI Generation",
          scene: details.scene,
          field: details.field,
          reason: details.reason || genError.message || "Failed during AI generation",
          error: genError.message || "Failed during AI generation",
          projectId: project.id,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
    const details = error?.details || {};
    return NextResponse.json(
      {
        success: false,
        stage: details.stage || "Project Request",
        scene: details.scene,
        field: details.field,
        reason: details.reason || error.message || "Failed to create project",
        error: error.message || "Failed to create project",
      },
      { status: 200 }
    );
  }
}
