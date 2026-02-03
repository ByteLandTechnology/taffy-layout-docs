/**
 * @module LiveCodeBadge
 * @description A status badge component indicating live/active state.
 */

"use client";

/**
 * Live status badge.
 *
 * Displays a pulsing green dot to indicate a "live" or "active" status,
 * typically used to show that the code execution environment is running.
 *
 * @returns A visual badge component with a pulsing animation.
 */
export function LiveCodeBadge() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
    </span>
  );
}
