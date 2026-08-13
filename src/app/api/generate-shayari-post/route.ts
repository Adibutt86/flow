import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      aiModel = "claude-sonnet-4-6",
      quoteText,
      artStyle = "Cinematic Silhouette",
      colorTheme = "Moody Monochromatic",
      layout = "Centered Poetry",
      format = "9:16 Mobile",
      textStyle = "Elegant Calligraphy & Serif Mix",
      mood = "Melancholy & Romantic",
      disableQuote = false,
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

    const systemPrompt = `You are an expert AI image prompt engineer who specializes in generating artistic, poetic imagery for Shayari and Song lyrics.

You have deep knowledge of the specific visual style for poetry and music aesthetics on social media — characterized by:
- Deeply atmospheric, moody, and highly artistic visual compositions (silhouettes, double exposures, rainy windows, bokeh lights, misty landscapes).
${disableQuote ? "- NO text overlay in the image, purely aesthetic and cinematic focus." : "- Elegant typography integrated naturally into the scene (delicate calligraphy, elegant serifs, handwritten scripts)."}
- Emotional and cinematic lighting that matches the mood of the poetry.
- Often featuring solitary figures, couples in the distance, or purely aesthetic nature/urban environments.
- Muted, cinematic, or carefully curated color palettes (not overly saturated like typical FB posts).
${disableQuote ? "- The imagery speaks for itself through atmosphere and emotion, without any words." : "- The text must feel like a natural part of the art, perhaps glowing softly, written in the sky, reflecting on water, or floating elegantly in empty space."}
- Perfect mobile portrait framing (9:16) for Reels/TikToks, or square for Instagram posts.

REFERENCE STYLE BREAKDOWN:
1. "Moody Rain" style: Cinematic shot of rain droplets on a window, blurred city lights in the background (bokeh)${disableQuote ? "" : ", delicate white serif text placed elegantly in the center"}.
2. "Silhouette Sunset" style: Warm golden hour gradient, black silhouette of a solitary figure looking at the horizon${disableQuote ? "" : ", elegant cursive script floating in the sky"}.
3. "Watercolor Dream" style: Soft, ethereal watercolor washes blending into each other${disableQuote ? "" : ", text appearing as if painted with ink"}.
4. "Vintage Film" style: Grainy, nostalgic film aesthetic, light leaks, polaroid framing${disableQuote ? "" : ", typewriter font text"}.

${disableQuote ? "NOTE: The user has requested to DISABLE quotes/text for this generation. Do NOT include any typography, text, or letters in the image prompt. Focus entirely on the artistic imagery." : ""}`;

    const userPrompt = `Generate a Shayari/Song artistic image prompt package with these specifications:

ART STYLE: ${artStyle}
MOOD / FEELING: ${mood}
COLOR THEME: ${colorTheme}
${disableQuote ? "" : `TYPOGRAPHY STYLE: ${textStyle}`}
LAYOUT: ${layout}
FORMAT: ${format} (aspect ratio --ar ${arParam})
${disableQuote ? "POETRY / LYRIC TEXT TO INCLUDE: NONE (DO NOT INCLUDE ANY TEXT OR TYPOGRAPHY IN THE IMAGE)" : (quoteText ? `POETRY / LYRIC TEXT TO INCLUDE: "${quoteText}" (If it's in Urdu/Arabic script, keep it EXACTLY as written with perfect spelling. NEVER use Hindi/Devanagari script.)` : "POETRY / LYRIC TEXT: Create a fitting short romantic or deep shayari line that matches the mood — MUST BE WRITTEN IN ROMAN/ENGLISH SCRIPT (e.g. 'zindagi', not 'ज़िंदगी'). NEVER USE HINDI/DEVANAGARI SCRIPTS.")}

OUTPUT FORMAT — respond with ONLY this exact JSON structure, no extra text before or after:
{
  "prompt": "<the full detailed image generation prompt ending with --ar ${arParam}>",
  "title": "<a poetic, aesthetic social media caption — 1-2 lines, using elegant emojis like 🥀, 🌙, ✨, 🌧️, written in a poetic tone>",
  "tags": ["#tag1", "#tag2", "#tag3"]
}

PROMPT REQUIREMENTS:
${disableQuote ? "1. NO TYPOGRAPHY — Do not mention any text, fonts, or words in the prompt. Do not describe text placements." : "1. Typography described as PART OF THE IMAGE COMPOSITION — text exists within the illustrated scene.\n2. Exact text placement relative to the background and figures."}
3. Specific lighting, mood, and atmospheric details (e.g., volumetric fog, soft cinematic rain, lens flare).
4. If figures are present, describe them artistically (e.g., silhouettes, out of focus, back-lit) to maintain a poetic, non-distracting focus on the overall mood.
5. Make sure the scene feels "aesthetic" and deeply emotional.
6. IMAGE QUALITY: End the prompt with high-end render keywords (e.g., "8k resolution, cinematic lighting, masterpiece, hyper-detailed photography, Unreal Engine 5, octane render, photorealistic").
7. Prompt ends with: --ar ${arParam}

TITLE REQUIREMENTS:
- Create a VERY SHORT, deeply poetic, and highly unique aesthetic caption
- Maximum 1 short phrase or line (under 10 words if possible)
- Must be creative, interesting, and deeply emotional (avoid generic cliches)
- Use 1-2 aesthetic emojis (e.g., 🥀, 🌙, 🖤, ✨)
- Match the mood: ${mood}
- If the quote is provided in Urdu script, you may write the title in flawless Urdu. Otherwise, MUST ALWAYS BE IN ENGLISH SCRIPT (Roman/Latin letters only). NEVER write in Hindi (Devanagari) script.

TAGS REQUIREMENTS:
- Exactly 3 hashtags
- Focus on poetry, aesthetic, shayari, song lyrics (e.g., #ShayariLovers, #AestheticVibes, #PoeticSoul)
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
