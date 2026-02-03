/**
 * @module CustomConsole
 * @description Custom console output viewer for Sandpack.
 */

"use client";

import { useSandpackConsole } from "@codesandbox/sandpack-react";
import {
  formatConsoleData,
  getLogLevelClass,
} from "@/features/benchmark/lib/console-utils";

/**
 * Custom console viewer component.
 *
 * Displays logs from the Sandpack console. It formats the log data
 * and applies styling based on the log level (log, warn, error).
 *
 * @returns A scrollable list of console logs or a placeholder if empty.
 */
export default function CustomConsoleViewer() {
  const { logs } = useSandpackConsole({ resetOnPreviewRestart: false });

  return (
    <div className="flex h-[500px] flex-col rounded-b-2xl border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex-1 overflow-auto p-0 font-mono text-sm">
        {logs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-400 italic dark:text-slate-500">
            No console output
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`border-b border-slate-100 px-3 py-2 last:border-0 dark:border-slate-800 ${getLogLevelClass(
                log.method,
              )}`}
            >
              <div className="break-all whitespace-pre-wrap">
                {formatConsoleData(log.data)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
