/**
 * @module HighlightedBlock
 * @description Syntax-highlighted code block component that displays code
 * with proper syntax highlighting. Includes a copy button that appears on hover.
 */

"use client";

import { CopyButton } from "./CopyButton";
import type { HighlightedBlockProps } from "./types";

/**
 * Syntax-highlighted code block component.
 * Renders code with syntax highlighting applied to children.
 * @param props - The component props
 * @param props.code - The code string to display
 * @param props.language - The programming language of the code
 * @param props.highlightedChildren - Pre-highlighted React elements
 * @param props.className - Additional CSS class names
 * @returns A styled container with highlighted code and copy button
 */
export function HighlightedBlock({
  code,
  language,
  highlightedChildren,
  className,
}: HighlightedBlockProps) {
  const isSingleLine = code.split("\n").length === 1;

  return (
    <div className={`group relative ${className || ""}`}>
      <code
        className={className || ""}
        data-language={language}
        suppressHydrationWarning
      >
        {highlightedChildren}
      </code>
      <CopyButton value={code} isSingleLine={isSingleLine} />
    </div>
  );
}
