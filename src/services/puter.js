/**
 * The ONLY file in the app that talks to Puter directly.
 *
 * Why one file? If Puter changes its API, or you later move AI calls to
 * your own backend, you only edit this file. Components never touch
 * `puter` or `window.puter` themselves.
 *
 * Security notes:
 * - There are no API keys here, and there never should be. Puter uses a
 *   "user-pays" model: each visitor signs in with their own Puter account.
 * - Puter.js itself stores the visitor's sign-in token in this browser's
 *   localStorage. Signing out removes it.
 * - Puter.js is installed from npm and pinned in package-lock.json, instead
 *   of a <script> tag that always downloads whatever the latest version is.
 */

// The SDK is large, so it is loaded in the background right after the page
// appears instead of blocking the first paint. `puter` is set once it's ready.
let puter = null;
const puterReady = import("@heyputer/puter.js").then((module) => {
  puter = module.puter;
  return puter;
});

/** Resolves when the Puter SDK has loaded. Rejects if it couldn't be downloaded. */
export function loadPuter() {
  return puterReady;
}

/* ----------------------------- Auth ----------------------------- */

export function isSignedIn() {
  return puter?.auth.isSignedIn() ?? false;
}

/**
 * Opens Puter's sign-in popup. Must run in response to a click or key press,
 * or the browser blocks the popup. The SDK is normally loaded long before
 * the user clicks, so no await happens before the popup opens.
 */
export async function signIn() {
  const sdk = puter ?? (await puterReady);
  await sdk.auth.signIn();
}

export function signOut() {
  puter?.auth.signOut();
}

/** Returns `{ username }` for the signed-in user, or null. We keep nothing else about the user. */
export async function getCurrentUser() {
  const sdk = await puterReady;
  if (!sdk.auth.isSignedIn()) return null;
  const user = await sdk.auth.getUser();
  return user?.username ? { username: user.username } : null;
}

/* ------------------------------ AI ------------------------------ */

/**
 * Streams a chat completion, yielding text chunks as they arrive.
 *
 * @param {Array<{role: string, content: string}>} messages
 * @param {{ model?: string }} [options]
 */
export async function* streamChat(messages, { model } = {}) {
  const sdk = await puterReady;
  const options = { stream: true };
  if (model) options.model = model;

  const response = await sdk.ai.chat(messages, options);

  // Streaming response: an async iterator of parts.
  if (response && typeof response[Symbol.asyncIterator] === "function") {
    for await (const part of response) {
      if (part?.error) throw part.error;
      // Skip non-text parts (e.g. a model's hidden "reasoning" parts).
      const isText = part?.type === undefined || part?.type === "text";
      if (isText && typeof part?.text === "string" && part.text) yield part.text;
    }
    return;
  }

  // Fallback: some models ignore `stream` and return a whole message.
  yield extractText(response);
}

/** Pulls plain text out of the different response shapes Puter can return. */
function extractText(response) {
  if (typeof response === "string") return response;
  const content = response?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((part) => (typeof part === "string" ? part : part?.text ?? "")).join("");
  }
  return "";
}

/* ---------------------------- Errors ---------------------------- */

/**
 * Puter sometimes rejects with plain objects instead of Error instances.
 * This turns anything it throws into a sentence we can show the user.
 */
export function describePuterError(error) {
  const raw =
    (typeof error === "string" && error) ||
    error?.message ||
    error?.error?.message ||
    (typeof error?.error === "string" && error.error) ||
    "";
  const text = String(raw);

  if (/dynamically imported module|importing a module script/i.test(text)) {
    return "Couldn't load Puter. Check your internet connection and reload the page.";
  }
  if (/popup|blocked/i.test(text)) {
    return "Your browser blocked the Puter sign-in window. Allow pop-ups for this site, then try again.";
  }
  if (/cancel|closed|denied/i.test(text)) {
    return "Sign-in was cancelled. Sign in to Puter to convert code.";
  }
  if (error?.status === 401 || /unauthori[sz]ed/i.test(text)) {
    return "Your Puter session has expired. Sign in again to continue.";
  }
  if (/insufficient|usage limit|funds/i.test(text)) {
    return "Your Puter account has reached its AI usage limit.";
  }
  if (/network|failed to fetch|timeout/i.test(text)) {
    return "Couldn't reach Puter. Check your internet connection and try again.";
  }
  return text ? `Conversion failed: ${text}` : "Conversion failed for an unknown reason. Try again.";
}
