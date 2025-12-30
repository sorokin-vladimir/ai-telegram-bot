export const defaultPrompt = `Answer concisely, but without sacrificing the meaning. The answer must be in the same language as the original question. Provide the response as plain text.`;

export function buildValidationPrompt(
  question: string,
  claude: string,
  gemini: string,
  grok: string,
): string {
  return `
You are an expert who synthesizes information from multiple responses to the same question in order to produce the most accurate, complete, and correct final answer.

Original question: ${question}

Here are several responses from different models:
${claude.trim()}

${gemini.trim()}

${grok.trim()}

Task:
- Analyze all responses.
- Identify the consensus, correct factual errors, and resolve contradictions.
- Supplement with missing information from your knowledge only if it is critical for accuracy.
- Create one coherent, concise, and complete answer.

Critical output rules:
- Respond ONLY as if answering the original question directly — provide the clean final answer.
- Do NOT quote or reference the intermediate responses.
- Do NOT describe the validation, checking, or comparison process.
- Do NOT add phrases like "Based on analysis...", "Validation shows...", "Final answer:", etc.
- Format the response in readable Markdown (use headings, lists, tables as appropriate).
- Be concise if the question calls for brevity; provide full details if depth is needed.
- The answer must be in the same language as the original question.
- Format the response as correct Markdown (for Telegram).

Just output the final answer to the question.
`;
}
