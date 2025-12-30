import { ADMIN_CHAT_ID } from "./config/env";
import { stopBot, bot } from "./services/telegram/bot";
import { messageHandler } from "./services/telegram/handlers/message.hander";
import { logger, setTelegramNotifier } from "./utils/logger";

// Set up Telegram notifier for critical errors
setTelegramNotifier(async (text: string) => {
  try {
    await bot.sendMessage(ADMIN_CHAT_ID, text, { parse_mode: "Markdown" });
  } catch (error) {
    logger.error({ error }, "Failed to send Telegram notification");
  }
});

// Register message handler
bot.on("message", async (msg) => {
  try {
    await messageHandler(msg);
  } catch (error) {
    logger.error({ error, chatId: msg.chat.id }, "Unhandled error in message handler");
  }
});

// Graceful shutdown handler
async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  try {
    await stopBot();
    logger.info("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error({ error }, "Error during graceful shutdown");
    process.exit(1);
  }
}

// Register shutdown handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  logger.fatal({ error }, "Uncaught exception");
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  logger.fatal({ reason, promise }, "Unhandled rejection");
  gracefulShutdown("unhandledRejection");
});

logger.info("Bot started successfully");
