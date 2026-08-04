import { NextResponse } from "next/server";
import { generateIdeaSuggestionsWithClaude } from "@/lib/ai/claude";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { category = "FUNNY", language = "Urdu", visualStyle = "3D Cartoon Style", videoDuration = 8, customDialogue, seed, kidsAge, kidsLocation, kidsHealth, kidsVibe, characterSetup, charactersPerScene, kidsNationality, carboxBrand, carboxColor, carboxPackaging, carboxBackground, aiModel } = body;

    const ideas = await generateIdeaSuggestionsWithClaude({
      category,
      language,
      visualStyle,
      videoDuration: Number(videoDuration),
      customDialogue,
      kidsAge,
      kidsLocation,
      kidsHealth,
      kidsVibe,
      characterSetup,
      charactersPerScene,
      kidsNationality,
      carboxBrand,
      carboxColor,
      carboxPackaging,
      carboxBackground,
      seed: seed || Date.now(),
      aiModel,
    });

    return NextResponse.json({ success: true, ideas });
  } catch (error: any) {
    console.error("POST /api/suggest-ideas error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to suggest ideas" },
      { status: 200 }
    );
  }
}
