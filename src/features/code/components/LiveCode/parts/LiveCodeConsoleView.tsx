/**
 * @module LiveCodeConsoleView
 * @description Console view component for LiveCode.
 *
 * Displays the interactive console output from the LiveCode sandbox.
 * Shows console logs, errors, and warnings from the running code.
 * This component only renders when sandpack is active and manages
 * visibility based on the current tab selection.
 *
 * @example
 * ```tsx
 * <LiveCodeConsoleView />
 * ```
 */

"use client";

import dynamic from "next/dynamic";
import { useLiveCodeContext } from "../useLiveCodeContext";

const CustomConsoleViewer = dynamic(() => import("../CustomConsole"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full animate-pulse bg-slate-50">
      <div className="flex h-full items-center justify-center text-slate-400">
        Loading console…
      </div>
    </div>
  ),
});

/**
 * Console view component for LiveCode.
 *
 * Renders the interactive console output showing logs, errors, and warnings
 * from the running sandbox. Only displays when sandpack is active and uses
 * CSS display:none to preserve state when switching tabs rather than unmounting.
 *
 * @returns The rendered console view, or null if sandpack should not render
 */
export function LiveCodeConsoleView() {
  const { state } = useLiveCodeContext();

  if (!state.shouldRenderSandpack) {
    return null;
  }

  const style = state.tab === "console" ? {} : { display: "none" };

  return (
    <div style={style}>
      <CustomConsoleViewer />
    </div>
  );
}
