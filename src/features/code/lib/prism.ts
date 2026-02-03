/**
 * @module prism
 * @description Syntax highlighting configuration using PrismJS.
 * This module configures and exports a code highlighting function with support
 * for multiple languages commonly used in the Taffy Layout documentation.
 *
 * @example
 * ```ts
 * import { highlightCode } from './prism';
 *
 * const highlighted = highlightCode('const x = 1;', 'typescript');
 * ```
 */

import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-rust";

/**
 * Highlights code using PrismJS with the specified language.
 * Returns the original code if highlighting fails or the language is not supported.
 *
 * @param code - The source code to highlight
 * @param language - The programming language for syntax highlighting.
 *   Supported languages: 'ts', 'tsx', 'typescript', 'js', 'javascript', 'jsx',
 *   'json', 'css', 'bash', 'markdown', 'rust'
 * @returns The highlighted HTML string, or the original code if highlighting fails
 *
 * @example
 * ```ts
 * const code = `const greeting = "Hello World";`;
 * const highlighted = highlightCode(code, 'typescript');
 * // Returns HTML with syntax highlighting classes
 * ```
 */
export function highlightCode(code: string, language: string): string {
  if (!code || !language) {
    return code;
  }

  const prismLang =
    language === "ts" || language === "tsx"
      ? "typescript"
      : language.toLowerCase();

  if (!Prism.languages[prismLang]) {
    return code;
  }

  try {
    return Prism.highlight(code, Prism.languages[prismLang], prismLang);
  } catch (error) {
    console.warn("Failed to highlight code:", error);
    return code;
  }
}
