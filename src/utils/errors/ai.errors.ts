import { ErrorCode } from "./codes";
import { AppError, AppErrorOptions } from "./base";

export class AIServiceError extends AppError {
  constructor(
    code: ErrorCode,
    serviceName: string,
    details?: string,
    options?: Omit<AppErrorOptions, "details">,
  ) {
    super(code, {
      ...options,
      details,
      metadata: { serviceName, ...options?.metadata },
    });
  }
}

export class ClaudeError extends AIServiceError {
  constructor(details?: string, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.CLAUDE_ERROR, "Claude", details, {
      ...options,
      shouldNotify: options?.shouldNotify ?? true,
    });
  }
}

export class GeminiError extends AIServiceError {
  constructor(details?: string, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.GEMINI_ERROR, "Gemini", details, {
      ...options,
      shouldNotify: options?.shouldNotify ?? true,
    });
  }
}

export class GrokError extends AIServiceError {
  constructor(details?: string, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.GROK_ERROR, "Grok", details, {
      ...options,
      shouldNotify: options?.shouldNotify ?? true,
    });
  }
}

export class OpenAIError extends AIServiceError {
  constructor(details?: string, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.OPENAI_ERROR, "OpenAI", details, {
      ...options,
      shouldNotify: options?.shouldNotify ?? true,
    });
  }
}

export class AIServiceTimeoutError extends AppError {
  constructor(
    serviceName: string,
    timeout: number,
    options?: Omit<AppErrorOptions, "details">,
  ) {
    super(ErrorCode.AI_SERVICE_TIMEOUT, {
      ...options,
      details: `${serviceName} timeout after ${timeout}ms`,
      metadata: { serviceName, timeout, ...options?.metadata },
      shouldNotify: options?.shouldNotify ?? true,
    });
  }
}

export class AIServiceUnavailableError extends AppError {
  constructor(serviceName: string, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.AI_SERVICE_UNAVAILABLE, {
      ...options,
      details: `${serviceName} is unavailable`,
      metadata: { serviceName, ...options?.metadata },
      shouldNotify: options?.shouldNotify ?? true,
    });
  }
}
