/**
 * @module features/playground/hooks/usePlaygroundConfig
 * @description Hook for managing the playground's configuration state (container, items, etc.).
 */

import { useState, useCallback } from "react";
import {
  DemoConfig,
  PRESETS,
  cloneConfig,
  defaultItem,
} from "@/features/playground/components/PlaygroundConfig";

/**
 * Hook to manage playground configuration state and updates.
 *
 * Provides state for the current configuration, the active preset key,
 * and callback functions to update various parts of the configuration
 * including container, flex, grid, and item count.
 *
 * @example
 * const {
 *   config,
 *   setConfig,
 *   presetKey,
 *   updateContainer,
 *   updateFlex,
 *   updateGrid,
 *   updateItemCount,
 *   handlePresetChange,
 * } = usePlaygroundConfig();
 *
 * @returns An object containing the configuration state and update functions.
 */
export function usePlaygroundConfig() {
  const [presetKey, setPresetKey] =
    useState<keyof typeof PRESETS>("flexBetween");
  const [config, setConfig] = useState<DemoConfig>(
    cloneConfig(PRESETS.flexBetween.config),
  );

  /**
   * Updates container-level properties with a partial patch.
   *
   * @param patch - Partial container properties to merge.
   */
  const updateContainer = useCallback(
    (patch: Partial<DemoConfig["container"]>) => {
      setConfig((prev) => ({
        ...prev,
        container: { ...prev.container, ...patch },
      }));
    },
    [],
  );

  /**
   * Updates flex-specific container properties with a partial patch.
   *
   * @param patch - Partial flex properties to merge.
   */
  const updateFlex = useCallback(
    (patch: Partial<DemoConfig["container"]["flex"]>) => {
      setConfig((prev) => ({
        ...prev,
        container: {
          ...prev.container,
          flex: { ...prev.container.flex, ...patch },
        },
      }));
    },
    [],
  );

  /**
   * Updates grid-specific container properties with a partial patch.
   *
   * @param patch - Partial grid properties to merge.
   */
  const updateGrid = useCallback(
    (patch: Partial<DemoConfig["container"]["grid"]>) => {
      setConfig((prev) => ({
        ...prev,
        container: {
          ...prev.container,
          grid: { ...prev.container.grid, ...patch },
        },
      }));
    },
    [],
  );

  /**
   * Updates the total number of items in the playground.
   *
   * Adds or removes items to match the target count.
   *
   * @param count - The desired number of items (minimum 1).
   */
  const updateItemCount = useCallback((count: number) => {
    setConfig((prev) => {
      const nextCount = Math.max(1, count);
      const items = [...prev.items];
      if (nextCount > items.length) {
        for (let i = items.length; i < nextCount; i += 1) {
          items.push({ ...defaultItem });
        }
      } else if (nextCount < items.length) {
        items.splice(nextCount);
      }
      return { ...prev, items };
    });
  }, []);

  /**
   * Switches to a different preset configuration.
   *
   * @param nextKey - The preset key to load.
   */
  const handlePresetChange = useCallback((nextKey: keyof typeof PRESETS) => {
    setPresetKey(nextKey);
    setConfig(cloneConfig(PRESETS[nextKey].config));
  }, []);

  return {
    config,
    setConfig,
    presetKey,
    updateContainer,
    updateFlex,
    updateGrid,
    updateItemCount,
    handlePresetChange,
  };
}
