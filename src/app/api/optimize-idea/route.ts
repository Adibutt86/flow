import { NextResponse } from "next/server";
import { optimizeIdeaWithClaude } from "@/lib/ai/claude";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { rawIdea, aiModel } = body;

    if (!rawIdea) {
      return NextResponse.json({ success: false, error: "Raw idea is required" }, { status: 400 });
    }

    const optimized = await optimizeIdeaWithClaude(rawIdea, aiModel);

    return NextResponse.json({ success: true, optimized });
  } catch (error: any) {
    console.error("POST /api/optimize-idea error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to optimize idea" },
      { status: 500 }
    );
  }
}
