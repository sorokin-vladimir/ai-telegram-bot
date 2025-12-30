import TelegramBot from "node-telegram-bot-api";
import { TELEGRAM_BOT_TOKEN } from "../../config/env";
import { TelegramError } from "../../utils/errors/telegram.errors";
import { logger } from "../../utils/logger";

export const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10,
    },
  },
});

// Handle polling errors
bot.on("polling_error", (error) => {
  throw new TelegramError("Polling error", {
    metadata: { error: error.message },
    originalError: error,
  });
});

// Handle webhook errors
bot.on("webhook_error", (error) => {
  throw new TelegramError("Webhook error", {
    metadata: { error: error.message },
    originalError: error,
  });
});

// Graceful stop method
export async function stopBot(): Promise<void> {
  logger.info("Stopping Telegram bot...");
  try {
    await bot.stopPolling();
    logger.info("Telegram bot stopped successfully");
  } catch (error) {
    logger.error({ error }, "Error stopping bot");
    throw error;
  }
}
