import OpenAI from "openai";
import { OPENAI_API_KEY } from "../../config/env";
import { OpenAIError } from "../../utils/errors/ai.errors";
import { defaultPrompt } from "../../utils/prompts";

const MODEL = "gpt-5.1";
const TIMEOUT = 60_000; // 1 minute

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  timeout: TIMEOUT,
  // @ts-expect-error
  defaultQuery: defaultPrompt,
});

export async function getOpenAIResponse(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message.content || "";
  } catch (error) {
    throw new OpenAIError("Failed to get response", {
      metadata: { model: MODEL },
      originalError: error as Error,
    });
  }
}
