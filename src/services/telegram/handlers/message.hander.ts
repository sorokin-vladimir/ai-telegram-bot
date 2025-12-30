import { Message } from "node-telegram-bot-api";
import { WHITE_LIST } from "../../../config/env";
import { WhitelistError } from "../../../utils/errors/auth.errors";
import { TelegramSendMessageError } from "../../../utils/errors/telegram.errors";
import { logger } from "../../../utils/logger";
import { buildValidationPrompt } from "../../../utils/prompts";
import { getClaudeResponse } from "../../ai/claude.service";
import { getGeminiResponse } from "../../ai/gemini.service";
import { getGrokResponse } from "../../ai/grok.service";
import { getFinalValidation } from "../../ai/validator.service";
import { bot } from "../bot";

export const messageHandler = async (msg: Message): Promise<Message | void> => {
  if (!msg.text || msg.text.startsWith("/")) return;

  const chatId = msg.chat.id;

  if (!WHITE_LIST?.includes(chatId)) {
    logger.warn({ chatId, username: msg.from?.username }, "Unauthorized access attempt");
    throw new WhitelistError(chatId);
  }

  const question = msg.text;

  logger.info({ chatId, question }, "Processing user question");

  let message: Message;
  try {
    message = await bot.sendMessage(
      chatId,
      "🤖 Запрашиваю ответы у Claude, Gemini и Grok...",
    );
  } catch (error) {
    throw new TelegramSendMessageError(chatId, {
      metadata: { action: "send_initial_message" },
      originalError: error as Error,
    });
  }

  try {
    const [claudeText, geminiText, grokText] = await Promise.all([
      getClaudeResponse(question),
      getGeminiResponse(question),
      getGrokResponse(question),
    ]);

    logger.info({ chatId }, "Received all AI responses");

    const validationPrompt = buildValidationPrompt(
      question,
      claudeText,
      geminiText,
      grokText,
    );

    await bot.editMessageText(
      "✅ Получил все ответы. Отправляю на валидацию в OpenAI...",
      { chat_id: chatId, message_id: message.message_id },
    );

    const finalAnswer = await getFinalValidation(validationPrompt);

    await bot.editMessageText(finalAnswer || "Ошибка при финальной обработке", {
      chat_id: chatId,
      message_id: message.message_id,
      parse_mode: "Markdown",
    });

    logger.info({ chatId }, "Successfully processed question");
  } catch (error) {
    logger.error({ chatId, error }, "Error processing message");

    try {
      await bot.editMessageText(
        `Произошла ошибка при обработке запроса. Попробуйте позже.`,
        {
          chat_id: chatId,
          message_id: message.message_id,
        },
      );
    } catch (editError) {
      logger.error({ chatId, editError }, "Failed to send error message to user");
    }

    throw error;
  }
};
