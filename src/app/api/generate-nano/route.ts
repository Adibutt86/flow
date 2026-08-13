import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

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
      generateVideo = false, generateImagePrompt = true,
      videoVariation = "Simple Character Animation",
      targetPlatform = "Both"
    } = body;

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "",
    });

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
\"\"\"
${referenceCharacterInfo}
\"\"\"` : ""}

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

    const response = await anthropic.messages.create({
      model: aiModel,
      max_tokens: 1000,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = response.content[0].type === 'text' ? response.content[0].text : "";
    
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
    return NextResponse.json({ error: error.message || "Failed to generate prompt" }, { status: 500 });
  }
}

