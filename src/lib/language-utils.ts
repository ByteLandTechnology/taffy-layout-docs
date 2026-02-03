/**
 * Language normalization helpers for code blocks.
 * @module lib/language-utils
 * @description
 * Maps shorthand or alias language identifiers to canonical names used by the
 * syntax highlighter and code rendering components.
 */

/**
 * Language aliases mapped to canonical highlighter identifiers.
 */
export const LANGUAGE_ALIASES: Record<string, string> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "javascript",
  sh: "bash",
  shell: "bash",
} as const;

/**
 * Normalize a language identifier to a canonical highlighter key.
 * @param lang - Raw language string, often derived from a Markdown fence.
 * @returns Canonical language identifier for syntax highlighting.
 */
export function normalizeLanguage(lang: string): string {
  const lower = lang.toLowerCase();
  return LANGUAGE_ALIASES[lower] || lower;
}
