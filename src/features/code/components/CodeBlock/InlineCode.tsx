/**
 * @module InlineCode
 * @description Inline code component for rendering short code snippets within text.
 * Provides consistent styling for inline code elements with theme-aware colors.
 */

import type { ComponentProps } from "react";

/**
 * Props for the InlineCode component
 * Extends all native code element props
 */
export type InlineCodeProps = ComponentProps<"code">;

/**
 * Renders inline code with consistent styling.
 * Automatically applies theme-aware background and text colors.
 * @param props - The component props
 * @param props.children - The code content to display
 * @param props.className - Additional CSS class names
 * @returns A styled inline code element
 */
export function InlineCode({ children, className, ...props }: InlineCodeProps) {
  return (
    <code
      {...props}
      className={
        className ||
        "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200"
      }
      suppressHydrationWarning
    >
      {children}
    </code>
  );
}
