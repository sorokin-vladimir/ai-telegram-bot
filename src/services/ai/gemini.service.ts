import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../../config/env";
import { GeminiError } from "../../utils/errors/ai.errors";

const MODEL = "gemini-2.5-flash";

const genai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
  // timeout: 60_000, // 1 minute
  // defaultQuery: defaultPrompt,
});

export async function getGeminiResponse(question: string): Promise<string> {
  try {
    const result = await genai.models.generateContent({
      model: MODEL,
      contents: question,
    });
    return result.text ?? "";
  } catch (error) {
    throw new GeminiError("Failed to get response", {
      metadata: { model: MODEL, question },
      originalError: error as Error,
    });
  }
}
