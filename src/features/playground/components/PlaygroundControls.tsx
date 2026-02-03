/**
 * @module features/playground/components/PlaygroundControls
 * @description Toolbar controls for the playground, enabling configuration of layout properties.
 */

import React, { useState } from "react";
import {
  ALIGN_ITEMS_OPTIONS,
  FLEX_DIRECTION_OPTIONS,
  FLEX_WRAP_OPTIONS,
  GRID_AUTOFLOW_OPTIONS,
  JUSTIFY_CONTENT_OPTIONS,
  type DemoConfig,
  type DisplayMode,
  type FlexDirectionKey,
  type FlexWrapKey,
  type GridAutoFlowKey,
  type JustifyContentKey,
  type AlignItemsKey,
  type TrackSizingMode,
} from "./PlaygroundConfig";

/**
 * Props for the PlaygroundControls component.
 */
interface PlaygroundControlsProps {
  /** The current configuration state of the playground demo. */
  config: DemoConfig;
  /** State setter for updating the playground configuration. */
  setConfig: React.Dispatch<React.SetStateAction<DemoConfig>>;
  /** The current scale of the preview area (width/height percentages). */
  previewScale: { width: number; height: number };
  /** State setter for updating the preview scale. */
  setPreviewScale: React.Dispatch<
    React.SetStateAction<{ width: number; height: number }>
  >;
  /** Helper function to update container-level styles. */
  updateContainer: (patch: Partial<DemoConfig["container"]>) => void;
  /** Helper function to update flexbox specific configuration. */
  updateFlex: (patch: Partial<DemoConfig["container"]["flex"]>) => void;
  /** Helper function to update grid specific configuration. */
  updateGrid: (patch: Partial<DemoConfig["container"]["grid"]>) => void;
  /** Helper function to update the number of items in the layout. */
  updateItemCount: (count: number) => void;
}

/**
 * Toolbar control panel for the playground.
 *
 * Renders an interactive toolbar allowing users to adjust canvas dimensions,
 * display mode (flex/grid), padding, gap, and layout-specific properties
 * including columns, rows, and flex direction.
 *
 * @example
 * <PlaygroundControls
 *   config={config}
 *   setConfig={setConfig}
 *   previewScale={previewScale}
 *   setPreviewScale={setPreviewScale}
 *   updateContainer={updateContainer}
 *   updateFlex={updateFlex}
 *   updateGrid={updateGrid}
 *   updateItemCount={updateItemCount}
 * />
 */
export default function PlaygroundControls({
  config,
  setConfig,
  previewScale,
  setPreviewScale,
  updateContainer,
  updateFlex,
  updateGrid,
  updateItemCount,
}: PlaygroundControlsProps) {
  const [activeSlider, setActiveSlider] = useState<"width" | "height" | null>(
    null,
  );

  const updateScale = (axis: "width" | "height", value: number) => {
    setPreviewScale((prev) => ({
      ...prev,
      [axis]: Math.min(100, Math.max(10, value)),
    }));
  };

  return (
    <div className="playground-toolbar">
      <div className="toolbar-group">
        <label className="toolbar-label">Canvas:</label>
        <div className="playground-row gap-1">
          <span className="playground-tag-size text-[0.6rem]">W</span>
          <div
            className="group relative flex items-center"
            onFocus={() => setActiveSlider("width")}
            onBlur={(e) => {
              if (
                !e.relatedTarget ||
                !e.currentTarget.contains(e.relatedTarget as Node)
              ) {
                setActiveSlider(null);
              }
            }}
          >
            <input
              className="playground-input small"
              type="number"
              min={10}
              max={100}
              value={previewScale.width}
              onChange={(event) =>
                updateScale("width", Number(event.target.value))
              }
              autoComplete="off"
              inputMode="numeric"
              name="preview-width"
              aria-label="Preview width percentage"
            />
            {activeSlider === "width" && (
              <div className="absolute top-full left-1/2 z-20 w-[120px] -translate-x-1/2 pt-2">
                <div className="flex rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={previewScale.width}
                    onChange={(event) =>
                      updateScale("width", Number(event.target.value))
                    }
                    className="w-full cursor-pointer"
                    name="preview-width-range"
                    aria-label="Preview width slider"
                    autoComplete="off"
                  />
                </div>
              </div>
            )}
          </div>
          <span className="playground-tag-size text-[0.6rem]">%</span>
        </div>
        <div className="playground-row gap-1">
          <span className="playground-tag-size text-[0.6rem]">H</span>
          <div
            className="group relative flex items-center"
            onFocus={() => setActiveSlider("height")}
            onBlur={(e) => {
              if (
                !e.relatedTarget ||
                !e.currentTarget.contains(e.relatedTarget as Node)
              ) {
                setActiveSlider(null);
              }
            }}
          >
            <input
              className="playground-input small"
              type="number"
              min={10}
              max={100}
              value={previewScale.height}
              onChange={(event) =>
                updateScale("height", Number(event.target.value))
              }
              autoComplete="off"
              inputMode="numeric"
              name="preview-height"
              aria-label="Preview height percentage"
            />
            {activeSlider === "height" && (
              <div className="absolute top-full left-1/2 z-20 w-[120px] -translate-x-1/2 pt-2">
                <div className="flex rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={previewScale.height}
                    onChange={(event) =>
                      updateScale("height", Number(event.target.value))
                    }
                    className="w-full cursor-pointer"
                    name="preview-height-range"
                    aria-label="Preview height slider"
                    autoComplete="off"
                  />
                </div>
              </div>
            )}
          </div>
          <span className="playground-tag-size text-[0.6rem]">%</span>
        </div>
      </div>

      <div className="toolbar-group">
        <label className="toolbar-label">Display:</label>
        <select
          className="playground-select small"
          value={config.displayMode}
          onChange={(event) =>
            setConfig((prev) => ({
              ...prev,
              displayMode: event.target.value as DisplayMode,
            }))
          }
          aria-label="Display mode"
          name="display-mode"
          autoComplete="off"
        >
          <option value="flex">Flex</option>
          <option value="grid">Grid</option>
        </select>
      </div>

      <div className="toolbar-group">
        <label className="toolbar-label">Padding:</label>
        <input
          className="playground-input small"
          type="number"
          min={0}
          max={100}
          value={config.container.padding}
          onChange={(event) =>
            updateContainer({ padding: Number(event.target.value) })
          }
          aria-label="Container padding"
          name="container-padding"
          autoComplete="off"
        />
      </div>

      <div className="toolbar-group">
        <label className="toolbar-label">Gap:</label>
        <input
          className="playground-input small"
          type="number"
          min={0}
          max={100}
          value={config.container.gapX}
          onChange={(event) =>
            updateContainer({ gapX: Number(event.target.value) })
          }
          aria-label="Horizontal gap"
          name="container-gap-x"
          autoComplete="off"
        />
        <input
          className="playground-input small"
          type="number"
          min={0}
          max={100}
          value={config.container.gapY}
          onChange={(event) =>
            updateContainer({ gapY: Number(event.target.value) })
          }
          aria-label="Vertical gap"
          name="container-gap-y"
          autoComplete="off"
        />
      </div>

      {config.displayMode === "flex" ? (
        <>
          <div className="toolbar-group">
            <label className="toolbar-label">Direction:</label>
            <select
              className="playground-select small"
              value={config.container.flex.direction}
              onChange={(event) =>
                updateFlex({
                  direction: event.target.value as FlexDirectionKey,
                })
              }
              aria-label="Flex direction"
              name="flex-direction"
              autoComplete="off"
            >
              {FLEX_DIRECTION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-group">
            <label className="toolbar-label">Justify:</label>
            <select
              className="playground-select small"
              value={config.container.flex.justifyContent}
              onChange={(event) =>
                updateFlex({
                  justifyContent: event.target.value as JustifyContentKey,
                })
              }
              aria-label="Justify content"
              name="justify-content"
              autoComplete="off"
            >
              {JUSTIFY_CONTENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-group">
            <label className="toolbar-label">Align:</label>
            <select
              className="playground-select small"
              value={config.container.flex.alignItems}
              onChange={(event) =>
                updateFlex({
                  alignItems: event.target.value as AlignItemsKey,
                })
              }
              aria-label="Align items"
              name="align-items"
              autoComplete="off"
            >
              {ALIGN_ITEMS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-group">
            <label className="toolbar-label">Wrap:</label>
            <select
              className="playground-select small"
              value={config.container.flex.wrap}
              onChange={(event) =>
                updateFlex({
                  wrap: event.target.value as FlexWrapKey,
                })
              }
              aria-label="Flex wrap"
              name="flex-wrap"
              autoComplete="off"
            >
              {FLEX_WRAP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="toolbar-group">
            <label className="toolbar-label">Columns:</label>
            <input
              className="playground-input small"
              type="number"
              min={1}
              max={20}
              value={config.container.grid.columns}
              onChange={(event) =>
                updateGrid({
                  columns: Number(event.target.value),
                })
              }
              aria-label="Grid columns"
              name="grid-columns"
              autoComplete="off"
            />
            <select
              className="playground-select small"
              value={config.container.grid.columnMode}
              onChange={(event) =>
                updateGrid({
                  columnMode: event.target.value as TrackSizingMode,
                })
              }
              aria-label="Grid column sizing mode"
              name="grid-column-mode"
              autoComplete="off"
            >
              <option value="fixed">Fixed</option>
              <option value="fr">fr</option>
            </select>
            <input
              className="playground-input small"
              type="number"
              min={10}
              max={500}
              value={config.container.grid.columnSize}
              onChange={(event) =>
                updateGrid({
                  columnSize: Number(event.target.value),
                })
              }
              aria-label="Grid column size"
              name="grid-column-size"
              autoComplete="off"
            />
          </div>

          <div className="toolbar-group">
            <label className="toolbar-label">Rows:</label>
            <input
              className="playground-input small"
              type="number"
              min={1}
              max={20}
              value={config.container.grid.rows}
              onChange={(event) =>
                updateGrid({
                  rows: Number(event.target.value),
                })
              }
              aria-label="Grid rows"
              name="grid-rows"
              autoComplete="off"
            />
            <select
              className="playground-select small"
              value={config.container.grid.rowMode}
              onChange={(event) =>
                updateGrid({
                  rowMode: event.target.value as TrackSizingMode,
                })
              }
              aria-label="Grid row sizing mode"
              name="grid-row-mode"
              autoComplete="off"
            >
              <option value="fixed">Fixed</option>
              <option value="fr">fr</option>
            </select>
            <input
              className="playground-input small"
              type="number"
              min={10}
              max={500}
              value={config.container.grid.rowSize}
              onChange={(event) =>
                updateGrid({
                  rowSize: Number(event.target.value),
                })
              }
              aria-label="Grid row size"
              name="grid-row-size"
              autoComplete="off"
            />
          </div>

          <div className="toolbar-group">
            <label className="toolbar-label">Flow:</label>
            <select
              className="playground-select small"
              value={config.container.grid.autoFlow}
              onChange={(event) =>
                updateGrid({
                  autoFlow: event.target.value as GridAutoFlowKey,
                })
              }
              aria-label="Grid auto flow"
              name="grid-auto-flow"
              autoComplete="off"
            >
              {GRID_AUTOFLOW_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="toolbar-group">
        <label className="toolbar-label">Items:</label>
        <input
          className="playground-input small"
          type="number"
          min={1}
          max={20}
          value={config.items.length}
          onChange={(event) => updateItemCount(Number(event.target.value))}
          aria-label="Item count"
          name="item-count"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
