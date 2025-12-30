import { Anthropic } from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "../../config/env";
import { ClaudeError } from "../../utils/errors/ai.errors";
import { defaultPrompt } from "../../utils/prompts";

const MODEL = "claude-sonnet-4-5-20250929";
const TIMEOUT = 60_000; // 1 minute

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  timeout: TIMEOUT,
  // @ts-expect-error
  defaultQuery: defaultPrompt,
});

export async function getClaudeResponse(question: string): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: "user", content: question }],
    });
    return response.content[0].type === "text" ? response.content[0].text : "";
  } catch (error) {
    throw new ClaudeError("Failed to get response", {
      metadata: { model: MODEL, question },
      originalError: error as Error,
    });
  }
}
