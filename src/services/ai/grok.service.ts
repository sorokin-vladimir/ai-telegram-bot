import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";
import { XAI_API_KEY } from "../../config/env";
import { GrokError } from "../../utils/errors/ai.errors";
import { defaultPrompt } from "../../utils/prompts";

const MODEL = "grok-4-1-fast-reasoning";

export async function getGrokResponse(question: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: xai.responses(MODEL),
      system: defaultPrompt,
      prompt: question,
    });
    return text;
  } catch (error) {
    throw new GrokError("Failed to get response", {
      metadata: { model: MODEL, question },
      originalError: error as Error,
    });
  }
}
