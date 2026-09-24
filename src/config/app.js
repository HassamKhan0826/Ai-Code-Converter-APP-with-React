/**
 * App-wide settings. None of these values are secret.
 *
 * import.meta.env.VITE_* values are baked into the public JavaScript
 * bundle at build time, so they must never contain keys or passwords.
 */
export const APP_NAME = "AI Code Converter";

/** Largest input we send to the AI. Protects the user's Puter usage and avoids timeouts. */
export const MAX_INPUT_CHARS = 20_000;

/** Optional model override from .env (e.g. VITE_AI_MODEL=gpt-5-nano). Empty = Puter's default. */
export const AI_MODEL = import.meta.env.VITE_AI_MODEL?.trim() || undefined;
