import { NextResponse } from "next/server";
import { generateDialogueSuggestionWithClaude } from "@/lib/ai/claude";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { category = "FUNNY", language = "Urdu", customIdea, kidsAge, kidsHealth, aiModel } = body;

    if (category === "CARBOX") {
      return NextResponse.json(
        { success: false, error: "Car Unboxing videos forbid spoken dialogue." },
        { status: 200 }
      );
    }

    const dialogue = await generateDialogueSuggestionWithClaude({
      category,
      language,
      customIdea,
      kidsAge,
      kidsHealth,
      aiModel,
    });

    return NextResponse.json({ success: true, dialogue });
  } catch (error: any) {
    console.error("POST /api/suggest-dialogue error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to suggest dialogue" },
      { status: 200 }
    );
  }
}
