import dotenv from "dotenv";
import {
  InvalidEnvVarError,
  MissingEnvVarError,
} from "../utils/errors/config.errors";

// Load environment variables
dotenv.config();

type EnvVarType = "string" | "number" | "boolean" | "array";

function getAndValidateEnvVar<T extends EnvVarType>(
  name: string,
  type: T,
): T extends "array"
  ? number[]
  : T extends "string"
    ? string
    : T extends "number"
      ? number
      : T extends "boolean"
        ? boolean
        : never {
  const value = process.env[name];

  if (!value) {
    throw new MissingEnvVarError(name, { shouldNotify: true });
  }

  if (type === "string") {
    return value as any;
  }

  if (type === "number") {
    const num = Number(value);
    if (isNaN(num)) {
      throw new InvalidEnvVarError(name, "Must be a valid number", {
        shouldNotify: true,
      });
    }
    return num as any;
  }

  if (type === "boolean") {
    const lower = value.toLowerCase();
    if (
      lower !== "true" &&
      lower !== "false" &&
      lower !== "1" &&
      lower !== "0"
    ) {
      throw new InvalidEnvVarError(name, "Must be true/false or 1/0", {
        shouldNotify: true,
      });
    }
    return (lower === "true" || lower === "1") as any;
  }

  if (type === "array") {
    let parsed: any;
    try {
      parsed = JSON.parse(value);
    } catch (err) {
      throw new InvalidEnvVarError(name, "Must be a valid JSON", {
        shouldNotify: true,
        metadata: { originalError: (err as Error).message },
      });
    }

    if (!Array.isArray(parsed)) {
      throw new InvalidEnvVarError(name, "Must be an array", {
        shouldNotify: true,
      });
    }

    if (!parsed.every((item) => typeof item === "number")) {
      throw new InvalidEnvVarError(name, "Array must contain only numbers", {
        shouldNotify: true,
      });
    }

    return parsed as any;
  }

  throw new InvalidEnvVarError(name, `Unknown type: ${type}`, {
    shouldNotify: true,
  });
}

// Required variables
export const TELEGRAM_BOT_TOKEN: string = getAndValidateEnvVar(
  "TELEGRAM_BOT_TOKEN",
  "string",
);

export const OPENAI_API_KEY: string = getAndValidateEnvVar(
  "OPENAI_API_KEY",
  "string",
);

export const ANTHROPIC_API_KEY: string = getAndValidateEnvVar(
  "ANTHROPIC_API_KEY",
  "string",
);

export const GEMINI_API_KEY: string = getAndValidateEnvVar(
  "GEMINI_API_KEY",
  "string",
);

export const XAI_API_KEY: string = getAndValidateEnvVar(
  "XAI_API_KEY",
  "string",
);

export const WHITE_LIST: number[] = getAndValidateEnvVar("WHITE_LIST", "array");

export const ADMIN_CHAT_ID: number = getAndValidateEnvVar(
  "ADMIN_CHAT_ID",
  "number",
);

// Optional variables with defaults
export const LOG_LEVEL: string = process.env.LOG_LEVEL || "info";
export const NODE_ENV: string = process.env.NODE_ENV || "development";
