import { ErrorCode } from "./codes";
import { AppError, AppErrorOptions } from "./base";

export class ConfigError extends AppError {
  constructor(
    code: ErrorCode,
    details?: string,
    options?: Omit<AppErrorOptions, "details">,
  ) {
    super(code, {
      ...options,
      details,
      shouldNotify: options?.shouldNotify ?? true,
    });
  }
}

export class MissingEnvVarError extends ConfigError {
  constructor(varName: string, options?: Omit<AppErrorOptions, "details">) {
    super(ErrorCode.CONFIG_MISSING_ENV_VAR, varName, {
      ...options,
      metadata: { varName, ...options?.metadata },
    });
  }
}

export class InvalidEnvVarError extends ConfigError {
  constructor(
    varName: string,
    reason: string,
    options?: Omit<AppErrorOptions, "details">,
  ) {
    super(ErrorCode.CONFIG_INVALID_ENV_VAR, `${varName}: ${reason}`, {
      ...options,
      metadata: { varName, reason, ...options?.metadata },
    });
  }
}
