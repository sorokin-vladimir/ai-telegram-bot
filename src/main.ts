import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";
import { Anthropic } from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(token, { polling: true });

const defaultPrompt = `Answer concisely, but without sacrificing the meaning. The answer must be in the same language as the original question. Provide the response as plain text.`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60_000, // 1 minute
  // @ts-expect-error
  defaultQuery: defaultPrompt,
});
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 60_000, // 1 minute
  // @ts-expect-error
  defaultQuery: defaultPrompt,
});
const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
  // timeout: 60_000, // 1 minute
  // defaultQuery: defaultPrompt,
});

// @ts-expect-error
const whiteList = JSON.parse(process.env.WHITE_LIST);

// === Запросы к моделям ===
async function getClaudeResponse(question: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    messages: [{ role: "user", content: question }],
  });
  return response.content[0].type === "text" ? response.content[0].text : "";
}

async function getGeminiResponse(question: string): Promise<string> {
  const result = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: question,
  });
  return result.text ?? "";
}

async function getGrokResponse(question: string): Promise<string> {
  const { text } = await generateText({
    model: xai.responses("grok-4-1-fast-reasoning"),
    system: defaultPrompt,
    prompt: question,
  });
  return text;
}

async function getFinalValidation(prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-5.1",
    messages: [{ role: "user", content: prompt }],
  });
  return completion.choices[0].message.content || "";
}

// === Сборка промптов ===
function buildValidationPrompt(
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

// === Основной обработчик ===
bot.on("message", async (msg) => {
  if (!msg.text || msg.text.startsWith("/")) return;

  if (!whiteList?.includes(msg.chat.id)) {
    return bot.sendMessage(msg.chat.id, "Не для тебя цветочек цвел!");
  }

  const chatId = msg.chat.id;
  const question = msg.text;

  const message = await bot.sendMessage(
    chatId,
    "🤖 Запрашиваю ответы у Claude, Gemini и Grok...",
  );

  try {
    const [claudeText, geminiText, grokText] = await Promise.all([
      getClaudeResponse(question),
      getGeminiResponse(question),
      getGrokResponse(question),
    ]);

    // bot.sendMessage(chatId, "✅ Claude: " + claudeText, {
    //   parse_mode: "Markdown",
    // });
    // bot.sendMessage(chatId, "✅ Gemini: " + geminiText, {
    //   parse_mode: "Markdown",
    // });
    // bot.sendMessage(chatId, "✅ Grok: " + grokText, { parse_mode: "Markdown" });

    const validationPrompt = buildValidationPrompt(
      question,
      claudeText,
      geminiText,
      grokText,
    );

    bot.editMessageText(
      "✅ Получил все ответы. Отправляю на валидацию в OpenAI...",
      { chat_id: chatId, message_id: message.message_id },
    );

    const finalAnswer = await getFinalValidation(validationPrompt);

    bot.editMessageText(finalAnswer || "Ошибка при финальной обработке", {
      chat_id: chatId,
      message_id: message.message_id,
      parse_mode: "Markdown",
    });
  } catch (error: any) {
    console.error(error);
    bot.editMessageText(`Ошибка: ${error.message || error}`, {
      chat_id: chatId,
      message_id: message.message_id,
    });
  }
});

console.log("Bot is running...");
