import { NextResponse } from "next/server";
import { generateVariationsWithClaude } from "@/lib/ai/claude";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type = "hooks", category, idea, language = "English", currentValue } = body;

    if (!category || !idea) {
      return NextResponse.json(
        { success: false, error: "Category and Idea are required." },
        { status: 400 }
      );
    }

    const variations = await generateVariationsWithClaude({
      type,
      category,
      idea,
      language,
      currentValue,
    });

    return NextResponse.json({ success: true, type, variations });
  } catch (error: any) {
    console.error("POST /api/variations error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate variations" },
      { status: 500 }
    );
  }
}
