import pino from 'pino';

// Telegram notification function type
type TelegramNotifier = (message: string) => Promise<void>;

let telegramNotifier: TelegramNotifier | null = null;

// Create Pino logger instance
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Set Telegram notifier for critical errors
export function setTelegramNotifier(notifier: TelegramNotifier): void {
  telegramNotifier = notifier;
}

// Send error notification to Telegram
export async function notifyTelegramError(
  errorCode: number,
  message: string,
  metadata?: Record<string, any>
): Promise<void> {
  if (!telegramNotifier) {
    return;
  }

  try {
    const text = `
🚨 *Critical Error*

*Code:* ${errorCode}
*Message:* ${message}
*Time:* ${new Date().toISOString()}
${metadata ? `*Metadata:* \`${JSON.stringify(metadata, null, 2)}\`` : ''}
    `.trim();

    await telegramNotifier(text);
  } catch (err) {
    logger.error({ err, errorCode, message }, 'Failed to send Telegram notification');
  }
}
