/**
 * @module LiveCodeTabs
 * @description Tabs container component for LiveCode.
 *
 * Provides a container for tab buttons within the LiveCode header.
 * Arranges tab buttons in a horizontal flex layout with consistent spacing.
 * This component is designed to work with LiveCodeTab children.
 *
 * @example
 * ```tsx
 * <LiveCodeTabs>
 *   <LiveCodeTab tab="preview" label="Preview" icon={<EyeIcon />} />
 *   <LiveCodeTab tab="code" label="Code" icon={<CodeIcon />} />
 *   <LiveCodeTab tab="console" label="Console" icon={<TerminalIcon />} />
 * </LiveCodeTabs>
 * ```
 */

"use client";

import type { ReactNode } from "react";

/**
 * Props for the LiveCodeTabs component.
 * @property children - The tab buttons to render inside the tabs container
 */
export interface LiveCodeTabsProps {
  children: ReactNode;
}

/**
 * Tabs container component for LiveCode.
 *
 * Renders a flex container for tab buttons with consistent gap spacing.
 * Designed to be used inside LiveCodeHeader with LiveCodeTab children.
 *
 * @param props - The component props
 * @param props.children - Tab button components to render
 * @returns The rendered tabs container
 */
export function LiveCodeTabs({ children }: LiveCodeTabsProps) {
  return <div className="flex items-center gap-2">{children}</div>;
}
