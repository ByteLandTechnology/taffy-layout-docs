/**
 * @module LiveCodeEditButton
 * @description Button to toggle the full-screen editor mode.
 */

"use client";

import { Maximize2 } from "lucide-react";
import { useLiveCodeContext } from "../useLiveCodeContext";

/**
 * Button component to maximize the code editor.
 *
 * Displays a maximize icon and triggers the full-screen mode action
 * from the LiveCode context.
 *
 * @returns A button element to open the full-screen editor.
 */
export function LiveCodeEditButton() {
  const { actions } = useLiveCodeContext();

  return (
    <button
      onClick={() => actions.setFullScreen(true)}
      className="ml-2 flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      title="Open full screen editor"
      aria-label="Open full screen editor"
    >
      <Maximize2 className="h-3.5 w-3.5" />
    </button>
  );
}
