/**
 * Looks for things that look like secrets (API keys, private keys,
 * passwords) in code BEFORE it leaves the browser.
 *
 * This is a safety net, not a guarantee: it catches common formats,
 * but it can't recognise every secret. Users should still avoid pasting
 * real credentials into any online tool.
 */

const PLACEHOLDER = "REDACTED_SECRET";

/**
 * Each rule has a regex. If the rule has a `value` group, only that part
 * is replaced when redacting, so `password = "hunter2hunter2"` becomes
 * `password = "REDACTED_SECRET"` and the code still reads naturally.
 */
const RULES = [
  {
    label: "Private key",
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
  },
  { label: "AWS access key", pattern: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
  { label: "GitHub token", pattern: /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})\b/g },
  { label: "AI provider API key", pattern: /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}\b/g },
  { label: "Google API key", pattern: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { label: "Stripe key", pattern: /\b(?:sk|rk)_live_[0-9A-Za-z]{16,}\b/g },
  { label: "Slack token", pattern: /\bxox[abprs]-[0-9A-Za-z-]{10,}\b/g },
  { label: "JSON Web Token", pattern: /\beyJ[\w-]{10,}\.eyJ[\w-]{10,}\.[\w-]{10,}\b/g },
  {
    label: "Password in a connection string",
    pattern: /\b[a-z][a-z0-9+.-]*:\/\/[^\s:/@"'`]+:(?<value>[^\s@"'`]{3,})@/gi,
  },
  {
    label: "Hard-coded password or key",
    pattern:
      /\b[\w.-]*(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret)[\w.-]*["']?\s*[:=]\s*["'`](?<value>[^"'`\s]{6,})["'`]/gi,
  },
];

function lineNumberAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) if (text.charCodeAt(i) === 10) line += 1;
  return line;
}

/**
 * @returns {Array<{ label: string, line: number }>} at most one finding per line.
 * Rules are ordered most-specific first, so "AWS access key" wins over the
 * generic "Hard-coded password or key" when both match the same line.
 */
export function scanForSecrets(code) {
  const byLine = new Map();
  for (const { label, pattern } of RULES) {
    for (const match of code.matchAll(pattern)) {
      if (match.groups?.value === PLACEHOLDER) continue;
      const line = lineNumberAt(code, match.index);
      if (!byLine.has(line)) byLine.set(line, { label, line });
    }
  }
  return [...byLine.values()].sort((a, b) => a.line - b.line);
}

/** Returns a copy of `code` with every finding replaced by a placeholder. */
export function redactSecrets(code) {
  return RULES.reduce(
    (text, { pattern }) =>
      text.replace(pattern, (match, ...args) => {
        const groups = args.at(-1);
        if (typeof groups === "object" && groups?.value) {
          return match.replace(groups.value, PLACEHOLDER);
        }
        return PLACEHOLDER;
      }),
    code,
  );
}
