import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      aiModel = "claude-3-5-sonnet-20241022",
      quoteText,
      characterStyle = "Any / AI Decides",
      artStyle = "Cinematic Silhouette",
      colorTheme = "Moody Monochromatic",
      layout = "Centered Poetry",
      format = "9:16 Mobile",
      disableQuote = false,
      disableImage = false,
      textStyle = "Elegant Calligraphy & Serif Mix",
      mood = "Melancholy & Romantic",
      referenceCharacterInfo,
    } = body;

    const resolveModel = (model: string) => {
      if (model && (model.includes("opus") || model.includes("Opus"))) {
        return "claude-opus-4-6";
      }
      if (model && (model.includes("haiku") || model.includes("Haiku"))) {
        return "claude-haiku-4-5-20251001";
      }
      return "claude-sonnet-4-6";
    };

    const preferredModel = resolveModel(aiModel);
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";
    const geminiApiKey = process.env.GEMINI_API_KEY || "";

    const formatToAR: Record<string, string> = {
      "9:16 Mobile": "9:16",
      "4:5 Portrait": "4:5",
      "1:1 Square": "1:1",
      "16:9 Desktop": "16:9",
    };
    const arParam = formatToAR[format] || "9:16";

    const systemPrompt = `You are an expert AI image prompt engineer who specializes in generating poetic, romantic, and emotional Shayari/Song post image prompts.

You have deep knowledge of aesthetic poetry visuals that go viral on social media — characterized by:
- Deeply evocative artistic styles (Studio Ghibli, Oil Painting, Cinematic Silhouettes, Dark Moody Realism)
- Poetic lighting (moonlit lakes, rainy windows, golden hour, lantern-lit Mehfil courtyards, autumn leaves)
${disableQuote ? "- NO text overlay in the image, purely artistic scene focus" : "- Elegant Urdu/Arabic calligraphy or refined typography integrated seamlessly into the artwork"}
- Rich emotional resonance matching classic & modern Urdu/Hindi poetry (Ghalib, Faiz, Jaun Elia, Rahat Indori)

${referenceCharacterInfo ? `\nCRITICAL CHARACTER REUSE: The user wants to reuse a previously generated character. MUST include ALL of the following physical traits explicitly in your prompt to ensure the character looks exactly the same:\n"""\n${referenceCharacterInfo}\n"""\n\n` : ''}${disableQuote ? "NOTE: The user has requested to DISABLE quotes/text for this generation. Do NOT include any typography, text, or letters in the image prompt." : ""}`;

    const userPrompt = `Generate a Shayari/Song post image prompt package with these specifications:

ARTISTIC STYLE: ${artStyle}
CHARACTER STYLE / CAST: ${characterStyle}
POETRY MOOD: ${mood}
COLOR PALETTE: ${colorTheme}
LAYOUT COMPOSITION: ${layout}
${disableQuote ? "" : `TYPOGRAPHY STYLE: ${textStyle}`}
FORMAT: ${format} (aspect ratio --ar ${arParam})
${disableQuote ? "SHAYARI / SONG TEXT: NONE (DO NOT INCLUDE ANY TEXT IN THE IMAGE)" : (quoteText ? `SHAYARI / SONG TEXT: "${quoteText}"` : "SHAYARI / SONG TEXT: Select a beautiful, deeply moving Shayari line that matches the mood — MUST BE WRITTEN IN ROMAN/ENGLISH SCRIPT. NEVER USE HINDI/DEVANAGARI SCRIPTS.")}

OUTPUT FORMAT — respond with ONLY this exact JSON structure (if disableImage is true, set the 'prompt' field to an empty string), no extra text:
{
  "prompt": "<the full detailed image generation prompt ending with --ar ${arParam}>",
  "title": "<a short, deeply poetic caption — 1 sentence, elegant emojis, perfect for Instagram/FB reel caption>",
  "tags": ["#UrduShayari", "#PoetryLovers", "#DeepLines"]
}`;

    let rawText = "";
    let lastError: any = null;

    const modelsToTry = Array.from(new Set([
      preferredModel,
      "claude-sonnet-4-6",
      "claude-sonnet-4-5-20250929",
      "claude-haiku-4-5-20251001",
      "claude-opus-4-6",
    ]));

    if (anthropicApiKey) {
      const anthropic = new Anthropic({ apiKey: anthropicApiKey });
      for (const modelName of modelsToTry) {
        try {
          const response = await anthropic.messages.create({
            model: modelName,
            max_tokens: 900,
            temperature: 0.8,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          });
          rawText = response.content[0].type === "text" ? response.content[0].text : "";
          if (rawText) break;
        } catch (err: any) {
          console.warn(`Anthropic model (${modelName}) error:`, err?.message || err);
          lastError = err;
        }
      }
    }

    if (!rawText && geminiApiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: `${systemPrompt}\n\n${userPrompt}`,
        });
        rawText = response.text || "";
      } catch (gemErr: any) {
        console.warn("Gemini fallback error:", gemErr?.message || gemErr);
      }
    }

    if (!rawText) {
      throw new Error(lastError?.message || "Failed to generate Shayari post prompt.");
    }

    let prompt = "";
    let title = "";
    let tags: string[] = [];

    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        prompt = parsed.prompt || rawText;
        title = parsed.title || "";
        tags = Array.isArray(parsed.tags) ? parsed.tags.slice(0, 3) : [];
      } else {
        prompt = rawText;
      }
    } catch {
      prompt = rawText;
    }

    return NextResponse.json({ prompt, title, tags });
  } catch (error: any) {
    console.error("Error generating Shayari post prompt:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
