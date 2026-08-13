import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      aiModel = "claude-sonnet-4-6",
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
    } = body;

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "",
    });

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
- Bold, dynamic typography integrated naturally into the scene (NOT added as a separate overlay after)
- Attitude-filled quotes and sassy/motivational messages rendered as part of the image composition
- Vibrant, thematic color palettes that run through both the character and text
- Floating decorative elements (hearts, sparkles, butterflies, stars, bows, etc.) scattered organically
- Mixed font styles in the SAME image: chunky display fonts for key words, handwritten script for others
- Highlighted/underlined keywords using colored boxes, paint strokes, or pill shapes
- Clean or softly textured backgrounds that let the character and text pop
- The character and text feel compositionally unified — not separate layers
- Perfect mobile portrait framing (9:16) for Facebook Stories / Reels, or square for posts

REFERENCE STYLE BREAKDOWN (from analyzed viral posts):
1. "Don't Touch My Phone" style: Pink 3D stitched/puffy letters with black outlines, glitter effects on key words, chibi girl hugging phone, pink gradient bg, heart/butterfly decorations
2. Quote poster style: Clean teal/white bg, mix of serif + script fonts, keyword highlight boxes, small chibi girl in corner, doodle stars/hearts scattered around
3. Attitude girl poster: White bg, chibi girl standing with crossed arms/sunglasses, text beside character, some keywords in pink pill/highlighted boxes, minimal decorations
4. "My life / My choices" style: Split-color keywords (each word different accent color), chibi boy center, clean minimal bg, text arranged beside character`;

    const userPrompt = `Generate a Facebook post image prompt package with these specifications:

CHARACTER STYLE: ${characterStyle}
CHARACTER AGE: ${age}
CHARACTER NATIONALITY / ETHNICITY: ${nationality}
MOOD / ATTITUDE: ${mood}
COLOR THEME: ${colorTheme}
TYPOGRAPHY STYLE: ${textStyle}
LAYOUT: ${layout}
FORMAT: ${format} (aspect ratio --ar ${arParam})
BACKGROUND: ${background}
DECORATIVE ELEMENTS: ${decorations}
${quoteText ? `QUOTE / MESSAGE TEXT TO INCLUDE: "${quoteText}"` : "QUOTE / MESSAGE TEXT: Create a fitting sassy/motivational/cute quote that matches the mood — make it short, punchy, and viral-worthy"}

OUTPUT FORMAT — respond with ONLY this exact JSON structure, no extra text before or after:
{
  "prompt": "<the full detailed image generation prompt ending with --ar ${arParam}>",
  "title": "<a catchy, engaging Facebook post caption/title — 1-2 sentences, emoji-rich, viral-worthy, written in the voice of the quote's mood>",
  "tags": ["#tag1", "#tag2", "#tag3"]
}

PROMPT REQUIREMENTS:
1. Typography described as PART OF THE IMAGE COMPOSITION — text exists within the illustrated scene
2. Specific font characteristics: letter weight, stroke outlines, 3D depth, glitter/metallic effects, color fills, shadows
3. Exact text placement relative to character
4. Specific decorative element placement
5. Character's exact pose, expression, and props that reinforce the quote's attitude
6. FULL CHARACTER VISIBILITY: Explicitly state that the character is "fully in frame", "full body visible", or "zoomed out" to ensure they are NOT cropped or cut off at the edges, especially for vertical mobile formats
7. CHARACTER IDENTITY: The character must look unmistakably ${nationality} and be a ${age} — include specific ethnic facial features, skin tone, and culturally accurate details appropriate for ${nationality} children
8. Prompt ends with: --ar ${arParam}

TITLE REQUIREMENTS:
- Engaging, emotional, shareable Facebook caption
- 1-2 short sentences
- Use relevant emojis naturally
- Match the mood: ${mood}
- Written as if a real person is posting this (not marketing speak)

TAGS REQUIREMENTS:
- Exactly 3 hashtags
- Mix of broad reach + niche (e.g. #cutekids + #pakikids + #kidsquotes)
- No spaces in tags, use camelCase for multi-word`;

    const response = await anthropic.messages.create({
      model: aiModel,
      max_tokens: 900,
      temperature: 0.8,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Parse the JSON response
    let prompt = "";
    let title = "";
    let tags: string[] = [];

    try {
      // Extract JSON from the response (handle any extra whitespace/text)
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        prompt = parsed.prompt || rawText;
        title = parsed.title || "";
        tags = Array.isArray(parsed.tags) ? parsed.tags.slice(0, 3) : [];
      } else {
        // Fallback: treat whole response as prompt
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
