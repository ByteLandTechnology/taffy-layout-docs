/**
 * @module features/code/components/LiveCode/LiveCodeProvider
 * @description State provider for LiveCode components
 *
 * Manages the state and actions for the LiveCode component system.
 * Handles tab switching, Sandpack rendering lifecycle, and fullscreen
 * state. Wraps children with LiveCodeContext.Provider.
 */

"use client";

import { useState, useCallback, type ReactNode } from "react";
import { LiveCodeContext } from "./LiveCodeContext";
import type { LiveCodeTab, LiveCodeContextValue } from "./types";

/**
 * Props for the LiveCodeProvider component
 */
interface LiveCodeProviderProps {
  /** Child components that will have access to LiveCode context */
  children: ReactNode;
  /** The source code to display and execute */
  code: string;
  /** The programming language (ts or tsx) */
  language: "ts" | "tsx";
  /** Optional template files for the sandbox */
  templates?: {
    /** Helper code for preview rendering */
    previewHelpers: string;
    /** Setup code for the sandbox */
    setup: string;
    /** React index file template */
    reactIndex: string;
    /** TypeScript index file template */
    tsIndex: string;
  };
}

/**
 * Provides LiveCode state and actions to child components
 *
 * Manages tab state, Sandpack rendering lifecycle, and fullscreen mode.
 * Auto-triggers Sandpack rendering when switching to preview or console tabs.
 *
 * @param children - Child components with LiveCode context access
 * @param code - Source code to display and execute
 * @param language - Programming language (ts or tsx)
 * @param templates - Optional template files for the sandbox
 * @returns Provider component wrapping children with LiveCode context
 */
export function LiveCodeProvider({
  children,
  code,
  language,
  templates,
}: LiveCodeProviderProps) {
  const [tab, setTabState] = useState<LiveCodeTab>("code");
  const [shouldRenderSandpack, setShouldRenderSandpack] = useState(false);
  const [sandpackReady, setSandpackReady] = useState(false);
  const [isFullScreen, setFullScreenState] = useState(false);

  // Switch tabs and ensure Sandpack is running if viewing preview/console
  const setTab = useCallback(
    (newTab: LiveCodeTab) => {
      setTabState(newTab);

      // Auto-trigger sandpack rendering when switching to preview/console
      if (newTab !== "code" && !shouldRenderSandpack) {
        setShouldRenderSandpack(true);
        setSandpackReady(false);
      }
    },
    [shouldRenderSandpack],
  );

  // Toggle fullscreen mode and ensure Sandpack is running
  const setFullScreen = useCallback(
    (fullScreen: boolean) => {
      setFullScreenState(fullScreen);
      if (fullScreen && !shouldRenderSandpack) {
        setShouldRenderSandpack(true);
        setSandpackReady(false);
      }
    },
    [shouldRenderSandpack],
  );

  /**
   * Memoized context value to prevent unnecessary re-renders.
   */
  const contextValue: LiveCodeContextValue = {
    state: {
      tab,
      shouldRenderSandpack,
      sandpackReady,
      isFullScreen,
    },
    actions: {
      setTab,
      setSandpackReady,
      setFullScreen,
    },
    meta: {
      code,
      language,
      templates,
    },
  };

  return (
    <LiveCodeContext.Provider value={contextValue}>
      {children}
    </LiveCodeContext.Provider>
  );
}
