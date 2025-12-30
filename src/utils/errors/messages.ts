import { ErrorCode } from './codes';

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // General
  [ErrorCode.UNKNOWN_ERROR]: 'Unknown error',
  [ErrorCode.INTERNAL_ERROR]: 'Internal server error',

  // Validation
  [ErrorCode.INVALID_INPUT]: 'Invalid input',
  [ErrorCode.MISSING_REQUIRED_FIELD]: 'Missing required field',

  // Auth
  [ErrorCode.UNAUTHORIZED]: 'Unauthorized',
  [ErrorCode.FORBIDDEN]: 'Forbidden',
  [ErrorCode.INVALID_TOKEN]: 'Invalid token',
  [ErrorCode.USER_NOT_IN_WHITELIST]: 'Access denied',

  // AI Services
  [ErrorCode.AI_SERVICE_UNAVAILABLE]: 'AI service unavailable',
  [ErrorCode.AI_SERVICE_TIMEOUT]: 'AI service timeout',
  [ErrorCode.AI_SERVICE_INVALID_RESPONSE]: 'Invalid AI service response',
  [ErrorCode.CLAUDE_ERROR]: 'Claude service error',
  [ErrorCode.GEMINI_ERROR]: 'Gemini service error',
  [ErrorCode.GROK_ERROR]: 'Grok service error',
  [ErrorCode.OPENAI_ERROR]: 'OpenAI service error',

  // Telegram
  [ErrorCode.TELEGRAM_API_ERROR]: 'Telegram API error',
  [ErrorCode.TELEGRAM_SEND_MESSAGE_FAILED]: 'Failed to send message',

  // Config
  [ErrorCode.CONFIG_MISSING_ENV_VAR]: 'Missing environment variable',
  [ErrorCode.CONFIG_INVALID_ENV_VAR]: 'Invalid environment variable',
};

export const ERROR_HTTP_STATUS: Record<ErrorCode, number> = {
  // General
  [ErrorCode.UNKNOWN_ERROR]: 500,
  [ErrorCode.INTERNAL_ERROR]: 500,

  // Validation
  [ErrorCode.INVALID_INPUT]: 400,
  [ErrorCode.MISSING_REQUIRED_FIELD]: 400,

  // Auth
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.INVALID_TOKEN]: 401,
  [ErrorCode.USER_NOT_IN_WHITELIST]: 403,

  // AI Services
  [ErrorCode.AI_SERVICE_UNAVAILABLE]: 503,
  [ErrorCode.AI_SERVICE_TIMEOUT]: 504,
  [ErrorCode.AI_SERVICE_INVALID_RESPONSE]: 502,
  [ErrorCode.CLAUDE_ERROR]: 502,
  [ErrorCode.GEMINI_ERROR]: 502,
  [ErrorCode.GROK_ERROR]: 502,
  [ErrorCode.OPENAI_ERROR]: 502,

  // Telegram
  [ErrorCode.TELEGRAM_API_ERROR]: 502,
  [ErrorCode.TELEGRAM_SEND_MESSAGE_FAILED]: 502,

  // Config
  [ErrorCode.CONFIG_MISSING_ENV_VAR]: 500,
  [ErrorCode.CONFIG_INVALID_ENV_VAR]: 500,
};
