import { getOpenAIResponse } from "./openai.service";

export async function getFinalValidation(prompt: string): Promise<string> {
  return getOpenAIResponse(prompt);
}
