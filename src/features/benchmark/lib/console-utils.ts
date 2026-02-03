/**
 * Console formatting helpers for benchmark output.
 * @module features/benchmark/lib/console-utils
 */

/**
 * Format an array of console arguments into a display string.
 * @param data - Console argument list.
 * @returns Joined string representation suitable for UI display.
 */
export function formatConsoleData(data: unknown[] | undefined | null): string {
  if (!data || !Array.isArray(data)) return "";
  return data
    .map((d) => {
      if (typeof d === "object" && d !== null) {
        if (d instanceof Error) {
          return d.toString();
        }
        try {
          return JSON.stringify(d, null, 2);
        } catch {
          return String(d);
        }
      }
      return String(d);
    })
    .join(" ");
}

/**
 * Resolve CSS classes for console log levels.
 * @param method - Console method name (e.g., error, warn).
 * @returns Tailwind class string for the log level styling.
 */
export function getLogLevelClass(method: string): string {
  const classes: Record<string, string> = {
    error: "console-log-error",
    warn: "console-log-warn",
  };
  return classes[method] || "text-slate-700 dark:text-slate-300";
}
