import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      aiModel = "claude-3-5-sonnet-20241022",
      visualStyle,
      aspectRatio,
      characterType,
      clothing,
      age,
      nationality,
      complexion,
      backgroundStyle,
      referenceCharacterInfo,
      generateVideo = false,
      generateImagePrompt = true,
      videoVariation = "Simple Character Animation",
      targetPlatform = "Both"
    } = body;

    const resolveModel = (model: string) => {
      if (model && (model.includes("3-7") || model.includes("3.7"))) {
        return "claude-3-7-sonnet-20250219";
      }
      if (model && (model.includes("haiku") || model.includes("Haiku") || model.includes("4-5-haiku"))) {
        return "claude-3-5-haiku-20241022";
      }
      if (model && (model.includes("opus") || model.includes("Opus") || model.includes("4-6-opus"))) {
        return "claude-3-opus-20240229";
      }
      return "claude-3-5-sonnet-20241022";
    };

    const preferredModel = resolveModel(aiModel);
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";
    const geminiApiKey = process.env.GEMINI_API_KEY || "";

    const prompt = `You are an expert prompt engineer for an AI generator. 
Write detailed prompts based on the following parameters:

- Visual Style: ${visualStyle}
- Character Type: ${characterType}
- Age: ${age}
- Nationality/Ethnicity: ${nationality}
- Skin Tone / Complexion: ${complexion || "Any / AI Decides"}
- Clothing: ${clothing}
- Background/Environment: ${backgroundStyle}

${referenceCharacterInfo ? `CRITICAL CHARACTER REUSE: The user wants to reuse a previously generated character. MUST include ALL of the following physical traits explicitly in your prompt to ensure the character looks exactly the same:
"""
${referenceCharacterInfo}
"""` : ""}

CRITICAL RULES:
1. Provide ONLY a valid JSON object. Do not include any explanations, greetings, or markdown code blocks (e.g. \`\`\`json).
2. The JSON object must contain the following string keys:
   - "prompt": ${generateImagePrompt === false ? '"The user has explicitly disabled image prompt generation. You MUST return an empty string for this field."' : '"The highly detailed, cinematic image generation prompt. ' + (generateVideo ? 'CRITICAL: The user intends to generate a video from this. You MUST add video motion instructions at the end of the prompt specifying it is a \\"10 sec video\\", describing the exact camera movement and character motion.' : '') + ' It MUST end with exactly: --ar " + aspectRatio'}
${generateVideo && (targetPlatform === 'Both' || targetPlatform === 'Google Flow') ? `   - "googleFlowVideoPrompt": A video animation prompt for Google Flow based on the exact same character and scene.
     Explicit Timing: 
     - 0-3 seconds: Character performs the specified natural movement (${videoVariation}).
     - 3-5 seconds: Character settles or looks toward the camera.
     - 5-8 seconds: Text smoothly appears.
     - Final seconds: Text remains clearly visible without being covered. Avoid distorted/hidden text.` : ''}
${generateVideo && (targetPlatform === 'Both' || targetPlatform === 'Gemini') ? `   - "geminiVideoPrompt": A video animation prompt for Gemini using the exact same scene and character details. Follow the same explicit timing constraints as above.` : ''}
`;

    let rawText = "";
    let lastError: any = null;

    const modelsToTry = Array.from(new Set([
      preferredModel,
      "claude-3-5-sonnet-20241022",
      "claude-3-5-sonnet-latest",
      "claude-3-7-sonnet-20250219",
      "claude-3-5-haiku-20241022",
      "claude-3-5-haiku-latest",
      "claude-3-haiku-20240307",
      "claude-3-opus-20240229",
    ]));

    if (aiModel.startsWith("gemini") && geminiApiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const response = await ai.models.generateContent({
          model: aiModel.includes("1.5") ? "gemini-1.5-pro" : "gemini-2.0-flash",
          contents: prompt,
        });
        rawText = response.text || "";
      } catch (gemErr: any) {
        console.warn("Direct Gemini error:", gemErr?.message || gemErr);
      }
    }

    if (!rawText && anthropicApiKey) {
      const anthropic = new Anthropic({ apiKey: anthropicApiKey });
      for (const modelName of modelsToTry) {
        try {
          const response = await anthropic.messages.create({
            model: modelName,
            max_tokens: 1000,
            temperature: 0.7,
            messages: [{ role: "user", content: prompt }],
          });
          rawText = response.content[0].type === "text" ? response.content[0].text : "";
          if (rawText) break;
        } catch (err: any) {
          console.warn(`Anthropic model (${modelName}) error:`, err?.message || err);
          lastError = err;
        }
      }
    }

    // Secondary fallback: Gemini API if Anthropic fails or not executed
    if (!rawText && geminiApiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });
        rawText = response.text || "";
      } catch (gemErr: any) {
        console.warn("Gemini fallback error:", gemErr?.message || gemErr);
      }
    }

    if (!rawText) {
      const errMsg = lastError?.error?.message || lastError?.message || "Failed to generate prompt. All model endpoints failed.";
      throw new Error(errMsg);
    }

    let result = { prompt: rawText };
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // fallback if parsing fails
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error generating nano prompt:", error);
    const msg = error?.error?.message || error?.message || "Failed to generate prompt";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
