/**
 * @module features/playground/components/Playground
 * @description The main container for the interactive Taffy playground.
 * Orchestrates configuration, layout computation, and child components.
 */

import { useCallback, useState } from "react";
import { PRESETS, type DemoItem } from "./PlaygroundConfig";
import PlaygroundControls from "./PlaygroundControls";
import PlaygroundPreview from "./PlaygroundPreview";

import { getCurrentLocale, getUi } from "@/lib/locales";
import { usePlaygroundConfig } from "@/features/playground/hooks/usePlaygroundConfig";
import { useTaffyLayout } from "@/features/playground/hooks/useTaffyLayout";

/**
 * Main Playground component that orchestrates the layout configuration, state management,
 * and rendering of the Taffy layout engine demo.
 *
 * Handles layout computation via useTaffyLayout and manages UI state for controls and preview.
 */
export default function Playground() {
  const locale = getCurrentLocale();
  const ui = getUi(locale);

  // Playground State
  const {
    config,
    setConfig,
    presetKey,
    updateContainer,
    updateFlex,
    updateGrid,
    updateItemCount,
    handlePresetChange,
  } = usePlaygroundConfig();

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );
  const [availableSize, setAvailableSize] = useState({ width: 0, height: 0 });
  const [previewScale, setPreviewScale] = useState({ width: 100, height: 100 });

  // Taffy Layout Computation
  const { layoutNodes, error, previewSize } = useTaffyLayout(
    config,
    availableSize,
    previewScale,
  );

  // Safely manage selectedItemIndex when items change (derive state during render)
  if (selectedItemIndex !== null && selectedItemIndex >= config.items.length) {
    setSelectedItemIndex(Math.max(0, config.items.length - 1));
  }

  // Item Update Handler
  const updateItem = useCallback(
    (patch: Partial<DemoItem>) => {
      if (selectedItemIndex === null) return;
      setConfig((prev) => ({
        ...prev,
        items: prev.items.map((item, index) =>
          index === selectedItemIndex ? { ...item, ...patch } : item,
        ),
      }));
    },
    [selectedItemIndex, setConfig],
  );

  // Map preset keys to translation keys
  const presetNameKeys: Record<string, keyof typeof ui> = {
    flexBetween: "presetFlexBetween",
    flexCenter: "presetFlexCenter",
    flexGrow: "presetFlexGrow",
    flexWrap: "presetFlexWrap",
    gridBasic: "presetGridBasic",
    gridSpans: "presetGridSpans",
  };

  const presetDescKeys: Record<string, keyof typeof ui> = {
    flexBetween: "presetFlexBetweenDesc",
    flexCenter: "presetFlexCenterDesc",
    flexGrow: "presetFlexGrowDesc",
    flexWrap: "presetFlexWrapDesc",
    gridBasic: "presetGridBasicDesc",
    gridSpans: "presetGridSpansDesc",
  };

  const getPresetName = (key: string) => {
    const nameKey = presetNameKeys[key];
    return nameKey ? String(ui[nameKey]) : key;
  };

  const getPresetDesc = (key: string) => {
    const descKey = presetDescKeys[key];
    return descKey ? String(ui[descKey]) : "";
  };

  return (
    <main className="playground-shell mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="playground-header">
        <div>
          <h1 className="mb-2 text-4xl font-black text-slate-900 dark:text-slate-50">
            {ui.taffyPlayground}
          </h1>
          <p className="playground-subtitle">
            {getPresetDesc(String(presetKey))}
          </p>
        </div>
        <div className="playground-header-actions">
          <select
            className="playground-select"
            value={presetKey}
            onChange={(event) =>
              handlePresetChange(event.target.value as keyof typeof PRESETS)
            }
            aria-label="Select preset"
            name="playground-preset"
            autoComplete="off"
          >
            {Object.entries(PRESETS).map(([key]) => (
              <option key={key} value={key}>
                {getPresetName(key)}
              </option>
            ))}
          </select>
        </div>
      </header>

      {error && <div className="playground-error">⚠️ {error}</div>}

      <div className="playground-body">
        <section className="playground-panel">
          <div className="playground-panel-header">
            <PlaygroundControls
              config={config}
              setConfig={setConfig}
              previewScale={previewScale}
              setPreviewScale={setPreviewScale}
              updateContainer={updateContainer}
              updateFlex={updateFlex}
              updateGrid={updateGrid}
              updateItemCount={updateItemCount}
            />
          </div>

          <div className="playground-panel-body">
            <PlaygroundPreview
              layoutNodes={layoutNodes}
              previewSize={previewSize}
              setAvailableSize={setAvailableSize}
              selectedItemIndex={selectedItemIndex}
              setSelectedItemIndex={setSelectedItemIndex}
              config={config}
              updateItem={updateItem}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
