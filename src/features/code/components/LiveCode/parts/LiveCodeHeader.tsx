/**
 * @module LiveCodeHeader
 * @description Header component for LiveCode container.
 *
 * Provides a styled header area for LiveCode components, typically containing
 * navigation tabs and action buttons. The header features a subtle border
 * and background styling that distinguishes it from the main content area.
 *
 * @example
 * ```tsx
 * <LiveCodeHeader>
 *   <LiveCodeTabs>
 *     <LiveCodeTab tab="preview" label="Preview" icon={<EyeIcon />} />
 *   </LiveCodeTabs>
 * </LiveCodeHeader>
 * ```
 */

"use client";

import type { ReactNode } from "react";

/**
 * Props for the LiveCodeHeader component.
 * @property children - The content to render inside the header, typically tabs and buttons
 */
export interface LiveCodeHeaderProps {
  children: ReactNode;
}

/**
 * Header component for LiveCode container.
 *
 * Renders a styled header with border and background, designed to contain
 * navigation elements like tabs and action buttons. The component applies
 * consistent styling across light and dark themes.
 *
 * @param props - The component props
 * @param props.children - Content to render in the header
 * @returns The rendered header component
 */
export function LiveCodeHeader({ children }: LiveCodeHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-900">
      {children}
    </div>
  );
}
