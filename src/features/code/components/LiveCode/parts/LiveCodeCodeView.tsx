/**
 * @module LiveCodeCodeView
 * @description Code view component for LiveCode.
 *
 * Displays the source code of the LiveCode example with syntax highlighting.
 * This component renders only when the "code" tab is active, showing
 * the highlighted code using the HighlightedCode component.
 *
 * @example
 * ```tsx
 * <LiveCodeCodeView />
 * ```
 */

"use client";

import HighlightedCode from "@/features/code/components/HighlightedCode";
import { useLiveCodeContext } from "../useLiveCodeContext";

/**
 * Code view component for LiveCode.
 *
 * Renders the syntax-highlighted source code of the LiveCode example.
 * Only displays when the active tab is "code", otherwise returns null.
 * Uses the HighlightedCode component for consistent syntax highlighting
 * across the codebase.
 *
 * @returns The rendered code view with syntax highlighting, or null if not on code tab
 */
export function LiveCodeCodeView() {
  const { state, meta } = useLiveCodeContext();

  if (state.tab !== "code") {
    return null;
  }

  return (
    <HighlightedCode
      code={meta.code}
      language={meta.language}
      className="m-0! rounded-none! shadow-none!"
    />
  );
}
