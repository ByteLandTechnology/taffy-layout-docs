/**
 * @module LiveCodeTab
 * @description Individual tab button component for LiveCode.
 *
 * Renders a clickable tab button that switches between different views
 * (preview, code, console) in the LiveCode component. Handles active state
 * styling and integrates with the LiveCode context for state management.
 *
 * @example
 * ```tsx
 * <LiveCodeTabs>
 *   <LiveCodeTab
 *     tab="preview"
 *     label="Preview"
 *     icon={<EyeIcon className="h-4 w-4" />}
 *   />
 *   <LiveCodeTab
 *     tab="code"
 *     label="Code"
 *     icon={<CodeIcon className="h-4 w-4" />}
 *   />
 * </LiveCodeTabs>
 * ```
 */

"use client";

import { useLiveCodeContext } from "../useLiveCodeContext";
import type { LiveCodeTab as TabType } from "../types";
import type { ReactNode } from "react";

/**
 * Props for the LiveCodeTab component.
 * @property tab - The tab identifier (preview, code, or console)
 * @property label - Accessible label for the tab button
 * @property icon - The icon element to display in the tab button
 */
export interface LiveCodeTabProps {
  tab: TabType;
  label: string;
  icon: ReactNode;
}

/**
 * Individual tab button component for LiveCode.
 *
 * Renders a tab button that switches the LiveCode view when clicked.
 * Handles active/inactive styling and accessibility attributes.
 * Integrates with LiveCodeContext for state management.
 *
 * @param props - The component props
 * @param props.tab - The tab type identifier
 * @param props.label - Accessible label for the tab
 * @param props.icon - Icon element to display
 * @returns The rendered tab button
 */
export function LiveCodeTab({ tab, label, icon }: LiveCodeTabProps) {
  const { state, actions } = useLiveCodeContext();
  const isActive = state.tab === tab;

  return (
    <button
      type="button"
      onClick={() => actions.setTab(tab)}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
        isActive
          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      }`}
      aria-pressed={isActive}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}
