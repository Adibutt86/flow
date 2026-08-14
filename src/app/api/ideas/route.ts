import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || request.headers.get("x-user-id");

    const whereCondition: any = {};
    if (userId && userId !== "all" && userId !== "master-user-id") {
      whereCondition.userId = userId;
    }

    const ideas = await db.idea.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
    });
    
    // Parse JSON string back to object
    const parsedIdeas = ideas.map((idea) => ({
      ...idea,
      socialContent: idea.socialContent ? JSON.parse(idea.socialContent) : undefined,
    }));
    
    return NextResponse.json({ success: true, ideas: parsedIdeas });
  } catch (error: any) {
    console.error("GET /api/ideas error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const headerUserId = request.headers.get("x-user-id");
    const {
      text,
      category,
      language,
      visualStyle,
      aiModel,
      customDialogue,
      musicType,
      seriousDialogueStyle,
      socialContent,
      videoFileName,
      kidsClothing,
      kidsExpression,
      kidsFood,
      kidsProp,
      timeOfDay,
      storyBeat,
      cameraShot,
      customSceneDescription,
      outroEffects,
      isShortIdea,
      withoutDialogue,
      withoutMusic,
      userId: bodyUserId,
    } = body;

    const finalUserId = bodyUserId || headerUserId || "master-user-id";

    const idea = await db.idea.create({
      data: {
        text,
        category,
        language,
        visualStyle,
        aiModel,
        customDialogue,
        musicType,
        seriousDialogueStyle,
        videoFileName,
        kidsClothing,
        kidsExpression,
        kidsFood,
        kidsProp,
        timeOfDay,
        storyBeat,
        cameraShot,
        customSceneDescription,
        outroEffects,
        isShortIdea: Boolean(isShortIdea),
        withoutDialogue: Boolean(withoutDialogue),
        withoutMusic: Boolean(withoutMusic),
        userId: finalUserId,
        socialContent: socialContent ? JSON.stringify(socialContent) : null,
      },
    });

    return NextResponse.json({ success: true, idea: {
      ...idea,
      socialContent: idea.socialContent ? JSON.parse(idea.socialContent) : undefined
    } });
  } catch (error: any) {
    console.error("POST /api/ideas error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save idea" },
      { status: 500 }
    );
  }
}
