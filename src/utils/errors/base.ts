import { ErrorCode } from './codes';
import { ERROR_MESSAGES, ERROR_HTTP_STATUS } from './messages';
import { logger, notifyTelegramError } from '../logger';

export interface AppErrorOptions {
  details?: string;
  metadata?: Record<string, any>;
  shouldNotify?: boolean;
  originalError?: Error;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly httpStatus: number;
  public readonly details?: string;
  public readonly metadata?: Record<string, any>;
  public readonly timestamp: Date;
  public readonly shouldNotify: boolean;
  public readonly originalError?: Error;

  constructor(code: ErrorCode, options?: AppErrorOptions) {
    const message = ERROR_MESSAGES[code];
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.httpStatus = ERROR_HTTP_STATUS[code];
    this.details = options?.details;
    this.metadata = options?.metadata;
    this.timestamp = new Date();
    this.shouldNotify = options?.shouldNotify ?? false;
    this.originalError = options?.originalError;

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);

    // Log error
    this.log();

    // Send Telegram notification if needed
    if (this.shouldNotify) {
      this.notify();
    }
  }

  private log(): void {
    const logLevel = this.httpStatus >= 500 ? 'error' : 'warn';

    logger[logLevel]({
      errorCode: this.code,
      message: this.message,
      details: this.details,
      metadata: this.metadata,
      httpStatus: this.httpStatus,
      ...(this.originalError && { originalError: this.originalError.message, stack: this.originalError.stack }),
    });
  }

  private async notify(): Promise<void> {
    await notifyTelegramError(this.code, this.message, {
      details: this.details,
      ...this.metadata,
    });
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      httpStatus: this.httpStatus,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
    };
  }

  // User-facing message (without metadata)
  toUserMessage(): string {
    return this.details ? `${this.message}: ${this.details}` : this.message;
  }
}
