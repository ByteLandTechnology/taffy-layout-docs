/**
 * @module CopyButton
 * @description Copy button component for code blocks. Provides a button that copies
 * code content to the clipboard with visual feedback on success.
 */

"use client";

import { Check, Copy } from "lucide-react";
import { useClipboard } from "@/features/code/hooks/useClipboard";

/**
 * Props for the CopyButton component
 * @property value - The text value to copy to clipboard
 * @property isSingleLine - Whether the code is single line, affects button positioning
 */
interface CopyButtonProps {
  value: string;
  isSingleLine: boolean;
}

/**
 * Renders a copy button for code blocks.
 * Shows a checkmark icon when content has been copied, copy icon otherwise.
 * Button appears on hover over the parent container.
 * @param props - The component props
 * @param props.value - The text to copy to clipboard
 * @param props.isSingleLine - Whether to use single-line positioning
 * @returns A button element with copy functionality
 */
export function CopyButton({ value, isSingleLine }: CopyButtonProps) {
  const { copied, copy } = useClipboard();

  return (
    <button
      onClick={() => copy(value)}
      className={`absolute right-2 rounded-md bg-slate-100/80 p-1.5 text-slate-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-700 ${
        isSingleLine ? "top-1/2 -translate-y-1/2" : "top-2"
      }`}
      aria-label="Copy code"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}
