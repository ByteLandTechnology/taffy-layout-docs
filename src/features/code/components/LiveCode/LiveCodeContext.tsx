/**
 * @module features/code/components/LiveCode/LiveCodeContext
 * @description React context for LiveCode state management
 *
 * Creates the React context that provides LiveCode state and actions
 * throughout the component tree. This context is consumed by the
 * useLiveCodeContext hook.
 */

"use client";

import { createContext } from "react";
import type { LiveCodeContextValue } from "./types";

/**
 * React context for LiveCode state and actions
 *
 * Contains the LiveCodeContextValue with state, actions, and metadata,
 * or undefined if accessed outside of a LiveCodeProvider.
 */
export const LiveCodeContext = createContext<LiveCodeContextValue | undefined>(
  undefined,
);
