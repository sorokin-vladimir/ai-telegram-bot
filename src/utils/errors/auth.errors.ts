import { ErrorCode } from "./codes";
import { AppError, AppErrorOptions } from "./base";

export class UnauthorizedError extends AppError {
  constructor(details?: string, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.UNAUTHORIZED, { ...options, details });
  }
}

export class ForbiddenError extends AppError {
  constructor(details?: string, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.FORBIDDEN, { ...options, details });
  }
}

export class InvalidTokenError extends AppError {
  constructor(details?: string, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.INVALID_TOKEN, { ...options, details });
  }
}

export class WhitelistError extends AppError {
  constructor(chatId: number, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.USER_NOT_IN_WHITELIST, {
      ...options,
      metadata: { chatId, ...options?.metadata },
    });
  }
}
