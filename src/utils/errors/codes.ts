export enum ErrorCode {
  // General errors (1000-1099)
  UNKNOWN_ERROR = 1000,
  INTERNAL_ERROR = 1001,

  // Validation errors (1100-1199)
  INVALID_INPUT = 1100,
  MISSING_REQUIRED_FIELD = 1101,

  // Authentication/Authorization errors (1200-1299)
  UNAUTHORIZED = 1200,
  FORBIDDEN = 1201,
  INVALID_TOKEN = 1202,
  USER_NOT_IN_WHITELIST = 1203,

  // AI Service errors (1300-1399)
  AI_SERVICE_UNAVAILABLE = 1300,
  AI_SERVICE_TIMEOUT = 1301,
  AI_SERVICE_INVALID_RESPONSE = 1302,
  CLAUDE_ERROR = 1310,
  GEMINI_ERROR = 1311,
  GROK_ERROR = 1312,
  OPENAI_ERROR = 1313,

  // Telegram errors (1400-1499)
  TELEGRAM_API_ERROR = 1400,
  TELEGRAM_SEND_MESSAGE_FAILED = 1401,

  // Configuration errors (1500-1599)
  CONFIG_MISSING_ENV_VAR = 1500,
  CONFIG_INVALID_ENV_VAR = 1501,
}

// Validate uniqueness at module load time
const codes = Object.values(ErrorCode).filter((v) => typeof v === 'number') as number[];
const uniqueCodes = new Set(codes);

if (codes.length !== uniqueCodes.size) {
  const duplicates = codes.filter((code, index) => codes.indexOf(code) !== index);
  throw new Error(`Duplicate error codes found: ${duplicates.join(', ')}`);
}
