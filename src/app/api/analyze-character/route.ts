import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  try {
    const { imageBase64, name } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Anthropic API key is not configured" }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey });
    
    const match = imageBase64.match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,/);
    let mimeType = "image/jpeg";
    if (match) {
      let ext = match[1].toLowerCase();
      if (ext === "jpg") ext = "jpeg";
      mimeType = `image/${ext}`;
    }
    
    const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;

    const modelsToTry = [
      "claude-3-5-sonnet-20241022",
      "claude-3-5-sonnet-latest",
      "claude-3-7-sonnet-20250219",
      "claude-3-5-haiku-20241022",
      "claude-3-haiku-20240307",
    ];

    let description = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await anthropic.messages.create({
          model: modelName,
          max_tokens: 500,
          temperature: 0.2,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: mimeType as any,
                    data: base64Data,
                  },
                },
                {
                  type: "text",
                  text: "Analyze this image of a child. Extract and describe their facial features, hair style, clothing, and overall vibe in high detail. This description will be used as a character reference in a video generation prompt. Be descriptive but concise.",
                },
              ],
            },
          ],
        });
        description = response.content[0].type === 'text' ? response.content[0].text : "";
        if (description) break;
      } catch (err: any) {
        console.warn(`Anthropic model (${modelName}) error in analyze-character:`, err?.message || err);
        lastError = err;
      }
    }

    if (!description) {
      const msg = lastError?.error?.message || lastError?.message || "Failed to analyze image with AI models.";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    // Save to database
    const savedCharacter = await db.referenceCharacter.create({
      data: {
        name: name || "Reference Character",
        imageUrl: imageBase64,
        description: description,
        category: "CUTE_KIDS",
      }
    });

    return NextResponse.json({ character: savedCharacter });
  } catch (error: any) {
    console.error("Error analyzing character image:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze image" },
      { status: 500 }
    );
  }
}
