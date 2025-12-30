import { ErrorCode } from "./codes";
import { AppError, AppErrorOptions } from "./base";

export class ValidationError extends AppError {
  constructor(details?: string, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.INVALID_INPUT, { ...options, details });
  }
}

export class MissingFieldError extends AppError {
  constructor(fieldName: string, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.MISSING_REQUIRED_FIELD, {
      ...options,
      details: fieldName,
      metadata: { fieldName, ...options?.metadata },
    });
  }
}
