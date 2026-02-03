/**
 * @module useLiveCode
 * @description Custom hook for managing the local state of the LiveCode component.
 */

import { useState } from "react";

/**
 * Hook to manage LiveCode state.
 *
 * Handles tab switching, fullscreen mode, and determines when to render the Sandpack instance.
 * Sandpack is loaded lazily or when needed (e.g., switching to preview/console or fullscreen).
 *
 * @param initialTab - The initial tab to display (default: "code").
 * @returns An object containing the current state and action handlers.
 */
export function useLiveCode(
  initialTab: "code" | "preview" | "console" = "code",
) {
  const [tab, setTab] = useState<"code" | "preview" | "console">(initialTab);
  // Track if we should render sandpack - use both state and current tab value
  const [shouldRenderSandpack, setShouldRenderSandpack] = useState(false);
  const [isFullScreen, setFullScreenState] = useState(false);

  const handleTabChange = (newTab: "code" | "preview" | "console") => {
    // Mark that we need sandpack BEFORE changing tab
    // This ensures the next render will have shouldRenderSandpack = true
    if (newTab !== "code") {
      setShouldRenderSandpack(true);
    }
    setTab(newTab);
  };

  const setFullScreen = (fullScreen: boolean) => {
    setFullScreenState(fullScreen);
    if (fullScreen) {
      setShouldRenderSandpack(true);
    }
  };

  // Sandpack should be rendered if:
  // 1. It has been explicitly marked as needed (shouldRenderSandpack)
  // 2. AND we're not on the code tab (to avoid unnecessary rendering)
  // 3. OR if we are in full screen mode (we always need sandpack there)
  const showSandpack = (shouldRenderSandpack && tab !== "code") || isFullScreen;

  return {
    tab,
    setTab,
    isSandpackInitialized: showSandpack,
    handleTabChange,
    isFullScreen,
    setFullScreen,
  };
}
