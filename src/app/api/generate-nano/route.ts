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
      referenceCharacterInfo
    } = body;

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "",
    });

    const prompt = `You are an expert prompt engineer for an AI image generator called "Nano Pro". 
Write a highly detailed, cinematic image generation prompt based on the following parameters:

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
1. Provide ONLY the final prompt text. Do not include any explanations, greetings, or introductory text.
2. The prompt MUST end with the exact aspect ratio parameter: --ar ${aspectRatio}
3. The prompt should be highly descriptive, covering lighting, camera angle, environment, and subject details.`;

    const response = await anthropic.messages.create({
      model: aiModel,
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const generatedPrompt = response.content[0].type === 'text' ? response.content[0].text : "";

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error: any) {
    console.error("Error generating nano prompt:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
