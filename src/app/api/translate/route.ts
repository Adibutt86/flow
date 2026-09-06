import { NextResponse } from "next/server";
import { translateDialogueWithClaude } from "@/lib/ai/claude";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ success: false, error: "No text provided" }, { status: 400 });
    }
    const translated = await translateDialogueWithClaude(text);
    return NextResponse.json({ success: true, translated });
  } catch (error: any) {
    console.error("Translate error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
