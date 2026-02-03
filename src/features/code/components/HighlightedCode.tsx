/**
 * @module features/code/components/HighlightedCode
 * @description Code display component with syntax highlighting and clipboard copy functionality
 *
 * Renders code blocks with syntax highlighting using Prism.js, includes a copy button
 * that appears on hover, and manages clipboard state.
 */

"use client";

import { Check, Copy } from "lucide-react";
import { useClipboard } from "@/features/code/hooks/useClipboard";
import { highlightCode } from "@/features/code/lib/prism";

/**
 * Props for the HighlightedCode component
 */
interface HighlightedCodeProps {
  /** The code content to display */
  code: string;
  /** The programming language for syntax highlighting */
  language: string;
  /** Additional CSS classes for the pre element */
  className?: string;
}

/**
 * Renders syntax-highlighted code with copy functionality
 * @param code - The code content to display
 * @param language - The programming language for syntax highlighting
 * @param className - Additional CSS classes for the pre element
 * @returns JSX element containing the highlighted code
 */
export default function HighlightedCode({
  code,
  language,
  className,
}: HighlightedCodeProps) {
  const highlightedCode = highlightCode(code, language);
  const { copied, copy } = useClipboard();

  return (
    <div className="group relative">
      <pre
        className={`overflow-x-auto language-${language} ${className || ""}`}
        tabIndex={0}
        suppressHydrationWarning
      >
        {highlightedCode !== code ? (
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        ) : (
          <code className={`language-${language}`}>{code}</code>
        )}
      </pre>
      <button
        onClick={() => copy(code)}
        className="absolute top-2 right-2 rounded-md bg-slate-100/10 p-1.5 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-100/20 hover:text-slate-200"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
