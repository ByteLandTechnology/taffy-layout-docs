/**
 * @module useLiveCodeContext
 * @description Hook to access the LiveCode context.
 */

"use client";

import { useContext } from "react";
import { LiveCodeContext } from "./LiveCodeContext";

/**
 * Retrieves the LiveCode context.
 *
 * Must be used within a `LiveCodeProvider`.
 *
 * @throws {Error} If used outside of a LiveCodeProvider.
 * @returns The LiveCode context value.
 */
export function useLiveCodeContext() {
  const context = useContext(LiveCodeContext);

  if (context === undefined) {
    throw new Error(
      "useLiveCodeContext must be used within a LiveCodeProvider",
    );
  }

  return context;
}
