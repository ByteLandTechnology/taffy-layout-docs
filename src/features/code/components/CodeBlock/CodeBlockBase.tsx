/**
 * @module CodeBlockBase
 * @description Base code block component that provides a simple, unhighlighted
 * code block with copy functionality. Used as a fallback when syntax highlighting
 * is not available or not needed.
 */

import { CopyButton } from "./CopyButton";
import type { LanguageBlockProps } from "./types";

/**
 * Props for the CodeBlockBase component
 * @property children - Optional child elements to render inside the code block
 * @property code - The code string to display
 * @property language - The programming language of the code
 * @property className - Additional CSS class names
 */
export interface CodeBlockBaseProps extends LanguageBlockProps {
  children?: React.ReactNode;
}

/**
 * Base code block component that renders code without syntax highlighting.
 * Includes a copy button that appears on hover.
 * @param props - The component props
 * @param props.code - The code string to display
 * @param props.language - The programming language of the code
 * @param props.className - Additional CSS class names
 * @param props.children - Optional child elements to render inside the code block
 * @returns A styled pre element containing the code
 */
export function CodeBlockBase({
  code,
  language,
  className,
  children,
}: CodeBlockBaseProps) {
  const isSingleLine = code.split("\n").length === 1;

  return (
    <div className={`group relative ${className || ""}`}>
      <pre
        className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900"
        data-language={language}
      >
        <code className="language-{language}">{children || code}</code>
      </pre>
      <CopyButton value={code} isSingleLine={isSingleLine} />
    </div>
  );
}
