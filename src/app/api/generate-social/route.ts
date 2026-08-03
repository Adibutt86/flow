import { NextResponse } from "next/server";
import { generateSocialContentWithClaude } from "@/lib/ai/claude";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { ideaText, category = "FUNNY", language = "Urdu", visualStyle = "3D Cartoon Style", aiModel } = body;

    if (!ideaText || typeof ideaText !== "string") {
      return NextResponse.json(
        { success: false, error: "ideaText is required" },
        { status: 400 }
      );
    }

    const social = await generateSocialContentWithClaude({
      ideaText,
      category,
      language,
      visualStyle,
      aiModel,
    });

    return NextResponse.json({ success: true, social });
  } catch (error: any) {
    console.error("POST /api/generate-social error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate social media content" },
      { status: 200 }
    );
  }
}
