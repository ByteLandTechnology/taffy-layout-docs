/**
 * @module LiveCodeFrame
 * @description Container frame component for LiveCode.
 *
 * Provides a styled container frame that wraps LiveCode content with
 * consistent border, border-radius, and background styling. This component
 * serves as the outermost container for LiveCode interactive examples.
 *
 * @example
 * ```tsx
 * <LiveCodeFrame>
 *   <LiveCodeHeader>
 *     <LiveCodeTabs>...</LiveCodeTabs>
 *   </LiveCodeHeader>
 *   <LiveCodePreviewView />
 * </LiveCodeFrame>
 * ```
 */

"use client";

import type { ReactNode } from "react";

/**
 * Props for the LiveCodeFrame component.
 * @property children - The content to render inside the frame
 */
export interface LiveCodeFrameProps {
  children: ReactNode;
}

/**
 * Container frame component for LiveCode.
 *
 * Renders a styled container with border, rounded corners, and appropriate
 * background colors. This component serves as the outer wrapper for LiveCode
 * examples, providing consistent visual styling across light and dark themes.
 *
 * @param props - The component props
 * @param props.children - Content to render inside the frame
 * @returns The rendered frame component
 */
export function LiveCodeFrame({ children }: LiveCodeFrameProps) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      {children}
    </div>
  );
}
