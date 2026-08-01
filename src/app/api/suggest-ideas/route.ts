import { NextResponse } from "next/server";
import { generateIdeaSuggestionsWithClaude } from "@/lib/ai/claude";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { category = "FUNNY", language = "English", visualStyle = "3D Cartoon", seed } = body;

    const ideas = await generateIdeaSuggestionsWithClaude({
      category,
      language,
      visualStyle,
      seed: seed || Date.now(),
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
