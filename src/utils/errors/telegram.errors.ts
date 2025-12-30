import { ErrorCode } from "./codes";
import { AppError, AppErrorOptions } from "./base";

export class TelegramError extends AppError {
  constructor(details?: string, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.TELEGRAM_API_ERROR, {
      ...options,
      details,
      shouldNotify: options?.shouldNotify ?? true,
    });
  }
}

export class TelegramSendMessageError extends AppError {
  constructor(chatId: number, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.TELEGRAM_SEND_MESSAGE_FAILED, {
      ...options,
      details: `Chat ID: ${chatId}`,
      metadata: { chatId, ...options?.metadata },
    });
  }
}
