import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      aiModel = "claude-3-5-sonnet-20241022",
      quoteText,
      characterStyle = "Chibi Anime Girl",
      colorTheme = "Pink & Black",
      layout = "Character Left, Text Right",
      format = "9:16 Mobile",
      textStyle = "Bold Chunky Display + Handwritten Mix",
      decorations = "Hearts & Sparkles",
      background = "Soft Gradient",
      mood = "Sassy & Confident",
      age = "Child (6-10 yrs)",
      nationality = "Pakistani",
      complexion = "Fair",
      generateVideo = false,
      videoVariation = "Simple Character Animation",
      targetPlatform = "Both",
      disableQuote = false,
      disableImage = false,
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

    // Map format to aspect ratio parameter
    const formatToAR: Record<string, string> = {
      "9:16 Mobile": "9:16",
      "4:5 Portrait": "4:5",
      "1:1 Square": "1:1",
      "16:9 Desktop": "16:9",
    };
    const arParam = formatToAR[format] || "9:16";

    const systemPrompt = `You are an expert AI image prompt engineer who specializes in generating Facebook post image prompts.

You have deep knowledge of the specific visual style that goes viral on Facebook — characterized by:
- Cute chibi/cartoon/anime-style characters with oversized expressive eyes, chubby cheeks, and small bodies
${disableQuote ? "- NO text overlay in the image, purely character and scene focus" : "- Bold, dynamic typography integrated naturally into the scene (NOT added as a separate overlay after)"}
${disableQuote ? "- Attitude-filled character expression and pose" : "- Attitude-filled quotes and sassy/motivational messages rendered as part of the image composition"}
- Highly vibrant, cohesive color themes
- Floating decorative elements that match the mood (e.g. glowing hearts, sparkles, stars)
- Clean, colorful backgrounds (often soft gradients or bokeh)

${referenceCharacterInfo ? `\nCRITICAL CHARACTER REUSE: The user wants to reuse a previously generated character. MUST include ALL of the following physical traits explicitly in your prompt to ensure the character looks exactly the same:\n"""\n${referenceCharacterInfo}\n"""\n\n` : ''}REFERENCE STYLE BREAKDOWN (from analyzed viral posts):
1. "Don't Touch My Phone" style: Pink 3D stitched/puffy letters with black outlines, glitter effects on key words, chibi girl hugging phone, pink gradient bg, heart/butterfly decorations
2. Quote poster style: Clean teal/white bg, mix of serif + script fonts, keyword highlight boxes, small chibi girl in corner, doodle stars/hearts scattered around
3. Attitude girl poster: White bg, chibi girl standing with crossed arms/sunglasses, text beside character, some keywords in pink pill/highlighted boxes, minimal decorations
4. "My life / My choices" style: Split-color keywords (each word different accent color), chibi boy center, clean minimal bg, text arranged beside character

${disableQuote ? "NOTE: The user has requested to DISABLE quotes/text for this generation. Do NOT include any typography, text, or letters in the image prompt. Focus entirely on the character and the aesthetic scene." : ""}`;

    const userPrompt = `Generate a Facebook post image prompt package with these specifications:

CHARACTER STYLE: ${characterStyle}
CHARACTER AGE: ${age}
CHARACTER NATIONALITY / ETHNICITY: ${nationality}
MOOD / ATTITUDE: ${mood}
COLOR THEME: ${colorTheme}
${disableQuote ? "" : `TYPOGRAPHY STYLE: ${textStyle}`}
LAYOUT: ${layout}
FORMAT: ${format} (aspect ratio --ar ${arParam})
BACKGROUND: ${background}
DECORATIVE ELEMENTS: ${decorations}
${disableQuote ? "QUOTE / MESSAGE TEXT TO INCLUDE: NONE (DO NOT INCLUDE ANY TEXT/TYPOGRAPHY IN THE IMAGE)" : (quoteText ? `QUOTE / MESSAGE TEXT TO INCLUDE: "${quoteText}" (If it's in Urdu/Arabic script, keep it EXACTLY as written with perfect spelling. NEVER use Hindi/Devanagari script.)` : "QUOTE / MESSAGE TEXT: Create a fitting sassy/motivational/cute quote that matches the mood — MUST BE WRITTEN IN ROMAN/ENGLISH SCRIPT (e.g. 'zindagi', not 'ज़िंदगी'). NEVER USE HINDI/DEVANAGARI SCRIPTS.")}

OUTPUT FORMAT — respond with ONLY this exact JSON structure (if disableImage is true, set the 'prompt' field to an empty string), no extra text before or after:
{
  "prompt": "<the full detailed image generation prompt ending with --ar ${arParam}>",
  "title": "<a catchy, engaging Facebook post caption/title — 1-2 sentences, emoji-rich, viral-worthy, written in the voice of the quote's mood>",
  "tags": ["#tag1", "#tag2", "#tag3"]
}

PROMPT REQUIREMENTS:
${disableQuote ? "1. NO TYPOGRAPHY — Do not mention any text, fonts, or words in the prompt." : "1. Typography described as PART OF THE IMAGE COMPOSITION — text exists within the illustrated scene."}
${disableQuote ? "2. Composition focuses entirely on the character and the environment." : "2. Specific font characteristics: letter weight, stroke outlines, 3D depth, glitter/metallic effects, color fills, shadows\n3. Exact text placement relative to character"}
4. Specific decorative element placement and environmental details.
5. Character's exact pose, expression, and props that reinforce the quote's attitude.
6. FULL CHARACTER VISIBILITY: Explicitly state that the character is "fully in frame", "full body visible", or "zoomed out" to ensure they are NOT cropped or cut off at the edges, especially for vertical mobile formats.
7. CHARACTER IDENTITY: The character must look unmistakably ${nationality} and be a ${age} — include specific ethnic facial features, a ${complexion} complexion/skin tone, and culturally accurate details appropriate for ${nationality} children.
8. IMAGE QUALITY: End the prompt with high-end render keywords (e.g., "8k resolution, highly detailed, octane render, Unreal Engine 5, masterpiece, vibrant studio lighting, sharp focus").
9. Prompt ends with: --ar ${arParam}
${generateVideo ? "10. VIDEO ANIMATION INSTRUCTIONS: The user wants to animate this image. MUST explicitly add '10 sec video, ' followed by cinematic camera movement, character motion, and environmental animation descriptions at the very end of the prompt, right before the --ar tag." : ""}

TITLE REQUIREMENTS:
- Create a VERY SHORT, punchy, and highly unique Facebook caption
- Maximum 1 short sentence or phrase (under 10 words if possible)
- Must be creative, interesting, and stand out from generic captions
- Use 1-2 relevant emojis naturally
- Match the mood: ${mood}
- Written as if a real person is posting this (not marketing speak)
- If the quote is provided in Urdu script, you may write the title in flawless Urdu. Otherwise, MUST ALWAYS BE IN ENGLISH SCRIPT (Roman/Latin letters only). NEVER write in Hindi (Devanagari) script.

TAGS REQUIREMENTS:
- Exactly 3 hashtags
- Mix of broad reach + niche (e.g. #cutekids + #pakikids + #kidsquotes)
- No spaces in tags, use camelCase for multi-word`;

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
      throw new Error(lastError?.message || "Failed to generate FB post prompt.");
    }

    // Parse the JSON response
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
    console.error("Error generating FB post prompt:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
