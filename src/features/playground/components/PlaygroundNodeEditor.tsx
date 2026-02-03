/**
 * @module features/playground/components/PlaygroundNodeEditor
 * @description Floating editor for modifying properties of selected layout nodes.
 */

import React from "react";
import {
  type DemoItem,
  type DemoConfig,
  ALIGN_SELF_OPTIONS,
  type AlignSelfKey,
} from "./PlaygroundConfig";

/**
 * Props for the PlaygroundNodeEditor component.
 */
interface PlaygroundNodeEditorProps {
  /** The currently selected layout item to edit. */
  selectedItem: DemoItem;
  /** The global playground configuration. */
  config: DemoConfig;
  /** Callback to update properties of the selected item. */
  updateItem: (patch: Partial<DemoItem>) => void;
  /** Callback to close the editor. */
  onClose: () => void;
}

/**
 * Inline property editor for a selected playground node.
 *
 * Renders form controls within a floating tooltip for editing the selected
 * item’s dimensions, flex properties (when in flex mode), grid span (when in
 * grid mode), and alignment. The editor closes via the onClose callback.
 *
 * @example
 * <PlaygroundNodeEditor
 *   selectedItem={selectedItem}
 *   config={config}
 *   updateItem={updateItem}
 *   onClose={() => setSelectedItemIndex(null)}
 * />
 */
export const PlaygroundNodeEditor: React.FC<PlaygroundNodeEditorProps> = ({
  selectedItem,
  config,
  updateItem,
  onClose,
}) => {
  return (
    <div className="playground-tooltip-content">
      <button
        type="button"
        aria-label="Close editor"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          cursor: "pointer",
          opacity: 0.5,
          zIndex: 10,
          background: "transparent",
          border: "none",
          padding: 0,
        }}
        onClick={onClose}
      >
        ×
      </button>
      <div className="playground-field">
        <label>
          <span className="playground-tag playground-tag-size">Size</span>
        </label>
        <div className="playground-row">
          <label className="playground-inline">
            <input
              type="checkbox"
              checked={selectedItem.widthAuto}
              onChange={(event) =>
                updateItem({ widthAuto: event.target.checked })
              }
              name="item-width-auto"
              aria-label="Auto width"
              autoComplete="off"
            />
            Auto W
          </label>
          <input
            className="playground-input small"
            type="number"
            min={0}
            value={selectedItem.width}
            onChange={(event) =>
              updateItem({ width: Number(event.target.value) })
            }
            disabled={selectedItem.widthAuto}
            name="item-width"
            aria-label="Item width"
            autoComplete="off"
          />
        </div>
        <div className="playground-row">
          <label className="playground-inline">
            <input
              type="checkbox"
              checked={selectedItem.heightAuto}
              onChange={(event) =>
                updateItem({ heightAuto: event.target.checked })
              }
              name="item-height-auto"
              aria-label="Auto height"
              autoComplete="off"
            />
            Auto H
          </label>
          <input
            className="playground-input small"
            type="number"
            min={0}
            value={selectedItem.height}
            onChange={(event) =>
              updateItem({ height: Number(event.target.value) })
            }
            disabled={selectedItem.heightAuto}
            name="item-height"
            aria-label="Item height"
            autoComplete="off"
          />
        </div>
      </div>

      {config.displayMode === "flex" ? (
        <>
          <div className="playground-field">
            <label>
              <span className="playground-tag playground-tag-flex">
                Flex Grow
              </span>
            </label>
            <div className="playground-row">
              <input
                className="playground-input small"
                type="number"
                min={0}
                value={selectedItem.flexGrow}
                onChange={(event) =>
                  updateItem({
                    flexGrow: Number(event.target.value),
                  })
                }
                name="item-flex-grow"
                aria-label="Flex grow"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="playground-field">
            <label>
              <span className="playground-tag playground-tag-flex">
                Flex Shrink
              </span>
            </label>
            <div className="playground-row">
              <input
                className="playground-input small"
                type="number"
                min={0}
                value={selectedItem.flexShrink}
                onChange={(event) =>
                  updateItem({
                    flexShrink: Number(event.target.value),
                  })
                }
                name="item-flex-shrink"
                aria-label="Flex shrink"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="playground-field">
            <label>
              <span className="playground-tag playground-tag-flex">
                Flex Basis
              </span>
            </label>
            <div className="playground-row">
              <label className="playground-inline">
                <input
                  type="checkbox"
                  checked={selectedItem.flexBasisAuto}
                  onChange={(event) =>
                    updateItem({
                      flexBasisAuto: event.target.checked,
                    })
                  }
                  name="item-flex-basis-auto"
                  aria-label="Auto flex basis"
                  autoComplete="off"
                />
                Auto
              </label>
              <input
                className="playground-input small"
                type="number"
                min={0}
                value={selectedItem.flexBasis}
                onChange={(event) =>
                  updateItem({
                    flexBasis: Number(event.target.value),
                  })
                }
                disabled={selectedItem.flexBasisAuto}
                name="item-flex-basis"
                aria-label="Flex basis"
                autoComplete="off"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="playground-field">
            <label>
              <span className="playground-tag playground-tag-grid">
                Grid Span (Column)
              </span>
            </label>
            <div className="playground-row">
              <input
                className="playground-input small"
                type="number"
                min={1}
                value={selectedItem.columnSpan}
                onChange={(event) =>
                  updateItem({
                    columnSpan: Number(event.target.value),
                  })
                }
                name="item-column-span"
                aria-label="Grid column span"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="playground-field">
            <label>
              <span className="playground-tag playground-tag-grid">
                Grid Span (Row)
              </span>
            </label>
            <div className="playground-row">
              <input
                className="playground-input small"
                type="number"
                min={1}
                value={selectedItem.rowSpan}
                onChange={(event) =>
                  updateItem({ rowSpan: Number(event.target.value) })
                }
                name="item-row-span"
                aria-label="Grid row span"
                autoComplete="off"
              />
            </div>
          </div>
        </>
      )}

      <div className="playground-field">
        <label>
          <span className="playground-tag playground-tag-align">
            Align Self
          </span>
        </label>
        <select
          className="playground-select small"
          value={selectedItem.alignSelf}
          onChange={(event) =>
            updateItem({
              alignSelf: event.target.value as AlignSelfKey,
            })
          }
          name="item-align-self"
          aria-label="Align self"
          autoComplete="off"
        >
          {ALIGN_SELF_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
