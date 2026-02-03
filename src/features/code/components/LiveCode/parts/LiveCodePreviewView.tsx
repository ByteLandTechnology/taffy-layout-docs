/**
 * @module LiveCodePreviewView
 * @description Preview view component for LiveCode.
 *
 * Renders the interactive code preview using Sandpack's preview component.
 * Manages the loading state and visibility based on the current tab selection.
 * This component displays the live output of the code being edited.
 *
 * @example
 * ```tsx
 * <LiveCodePreviewView />
 * ```
 */

"use client";

import dynamic from "next/dynamic";
import { useLiveCodeContext } from "../useLiveCodeContext";

// Dynamically import SandpackPreview to avoid SSR issues and reduce initial bundle size
const SandpackPreview = dynamic(
  () => import("@codesandbox/sandpack-react").then((m) => m.SandpackPreview),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse bg-slate-50 dark:bg-slate-900" />
    ),
  },
);

/**
 * Preview view component for LiveCode.
 *
 * Renders the interactive preview of the code using Sandpack's SandpackPreview
 * component. Handles loading states and visibility based on tab selection.
 * The component preserves iframe state when switching tabs by using display:none
 * instead of unmounting.
 *
 * @returns The rendered preview view, or null if sandpack should not render
 */
export function LiveCodePreviewView() {
  const { state } = useLiveCodeContext();

  // Only render if sandpack should be rendered (setup triggered)
  if (!state.shouldRenderSandpack) {
    return null;
  }

  // Use display: none instead of unmounting to preserve iframe state
  const style = state.tab === "preview" ? {} : { display: "none" };

  return (
    <div className="relative" style={style}>
      {!state.sandpackReady && (
        <div className="absolute inset-0 z-10 flex h-[400px] items-center justify-center bg-slate-50 dark:bg-slate-900">
          <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500 dark:border-slate-700 dark:border-t-blue-400" />
            <span className="text-sm">Loading sandbox…</span>
          </div>
        </div>
      )}
      <SandpackPreview
        className="sandpack-preview rounded-none!"
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
        showSandpackErrorOverlay={false}
        style={
          { height: 500, "--sp-border-radius": "0px" } as React.CSSProperties
        }
      />
    </div>
  );
}
