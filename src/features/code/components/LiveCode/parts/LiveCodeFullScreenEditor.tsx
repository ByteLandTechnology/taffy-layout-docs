/**
 * @module LiveCodeFullScreenEditor
 * @description A full-screen code editor component.
 * Provides a distraction-free environment for editing code with a split view
 * for code and preview/console.
 */

"use client";

import { X } from "lucide-react";
import {
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { useLiveCodeContext } from "../useLiveCodeContext";
import { getCurrentLocale, getUi } from "@/lib/locales";
import dynamic from "next/dynamic";

/**
 * Dynamically imported console viewer to prevent SSR issues.
 * Renders a loading skeleton while the component is being fetched.
 */
const CustomConsoleViewer = dynamic(() => import("../CustomConsole"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-slate-50 dark:bg-slate-900">
      <div className="flex h-full items-center justify-center text-slate-400">
        Loading console…
      </div>
    </div>
  ),
});

/**
 * Wrapper for the console viewer to be used within the full-screen editor.
 * Ensures consistent rendering structure.
 */
function LiveCodeConsoleViewOverride() {
  return <CustomConsoleViewer />;
}

/**
 * Full-screen editor component.
 *
 * Renders a modal overlay with a split-pane layout:
 * - Left pane: Sandpack code editor
 * - Right pane: Preview and console output
 *
 * It uses a portal-like fixed positioning to cover the entire screen.
 *
 * @returns The full-screen editor UI or null if not in full-screen mode.
 */
export function LiveCodeFullScreenEditor() {
  const { state, actions } = useLiveCodeContext();
  const locale = getCurrentLocale();
  const ui = getUi(locale);

  if (!state.isFullScreen) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
        <div className="font-semibold text-slate-900 dark:text-slate-100">
          {ui.fullScreenEditor}
        </div>
        <button
          onClick={() => actions.setFullScreen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Force override Sandpack border radius */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .sp-preview-container, .sp-preview-iframe, .sp-preview {
              border-radius: 0 !important;
            }
          `,
          }}
        />

        {/* Editor Pane */}
        <div className="w-1/2 border-r border-slate-200 dark:border-slate-800">
          <SandpackCodeEditor
            showTabs
            showLineNumbers
            showInlineErrors
            wrapContent
            className="h-full"
            style={
              {
                height: "100%",
                "--sp-colors-surface1": "transparent",
              } as React.CSSProperties
            }
          />
        </div>

        {/* Preview & Console Pane */}
        <div className="flex w-1/2 flex-col">
          <div className="relative flex-1 border-b border-slate-200 dark:border-slate-800">
            <SandpackPreview
              className="sandpack-preview absolute inset-0 h-full w-full rounded-none!"
              showOpenInCodeSandbox={false}
              showRefreshButton={true}
              showSandpackErrorOverlay={true}
              style={
                {
                  height: "100%",
                  "--sp-border-radius": "0px",
                } as React.CSSProperties
              }
            />
          </div>
          <div className="flex h-1/3 flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
            <div className="flex items-center border-b border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-900">
              {ui.console}
            </div>
            <div className="flex-1 overflow-auto">
              <LiveCodeConsoleViewOverride />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
