/**
 * @module features/playground/components/PlaygroundPreview
 * @description Visualizes the computed Taffy layout and handles interactions.
 */

import React, { useRef, useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import {
  formatNumber,
  type DemoConfig,
  type DemoItem,
  type LayoutNode,
} from "./PlaygroundConfig";
import { PlaygroundNodeEditor } from "./PlaygroundNodeEditor";

/**
 * Props for the PlaygroundPreview component.
 */
interface PlaygroundPreviewProps {
  /** Calculated layout nodes from Taffy engine. */
  layoutNodes: LayoutNode[];
  /** Current size of the preview container. */
  previewSize: { width: number; height: number };
  /** Callback to report the available size for layout computation. */
  setAvailableSize: (size: { width: number; height: number }) => void;
  /** Index of the currently selected item, or null if none. */
  selectedItemIndex: number | null;
  /** Callback to change the selected item index. */
  setSelectedItemIndex: (index: number | null) => void;
  /** Complete playground configuration object. */
  config: DemoConfig;
  /** Callback to update a specific item's properties. */
  updateItem: (patch: Partial<DemoItem>) => void;
}

/**
 * Recursively searches for a layout node by its index.
 *
 * @param nodes - Array of layout nodes to search through.
 * @param targetIndex - The item index to find.
 * @returns The matching LayoutNode or null if not found.
 */
const findNodeRecursive = (
  nodes: LayoutNode[],
  targetIndex: number,
): LayoutNode | null => {
  for (const node of nodes) {
    if (node.meta?.index === targetIndex) {
      return node;
    }
    if (node.children) {
      const found = findNodeRecursive(node.children, targetIndex);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Visual preview canvas for the playground.
 *
 * Renders the computed layout as interactive visual nodes that users can
 * click to select and edit. Displays a tooltip editor when a node is selected.
 * Handles resize observation and tooltip positioning.
 *
 * @example
 * <PlaygroundPreview
 *   layoutNodes={layoutNodes}
 *   previewSize={previewSize}
 *   setAvailableSize={setAvailableSize}
 *   selectedItemIndex={selectedItemIndex}
 *   setSelectedItemIndex={setSelectedItemIndex}
 *   config={config}
 *   updateItem={updateItem}
 * />
 */
export default function PlaygroundPreview({
  layoutNodes,
  previewSize,
  setAvailableSize,
  selectedItemIndex,
  setSelectedItemIndex,
  config,
  updateItem,
}: PlaygroundPreviewProps) {
  const previewSurfaceRef = useRef<HTMLDivElement | null>(null);
  const previewRootRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const element = previewSurfaceRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      setAvailableSize({
        width: Math.floor(Math.max(200, entry.contentRect.width)),
        height: Math.floor(Math.max(200, entry.contentRect.height)),
      });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [setAvailableSize]);

  useEffect(() => {
    if (selectedItemIndex === null) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (tooltipRef.current?.contains(target)) {
        return;
      }

      if (previewRootRef.current?.contains(target)) {
        return;
      }

      setSelectedItemIndex(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [selectedItemIndex, setSelectedItemIndex]);

  const selectedItem =
    selectedItemIndex !== null ? config.items[selectedItemIndex] : null;
  const selectedNode =
    selectedItemIndex !== null
      ? findNodeRecursive(layoutNodes, selectedItemIndex)
      : null;

  const updateTooltipPosition = useCallback(() => {
    if (!selectedNode || !previewRootRef.current) {
      setTooltipPosition(null);
      return;
    }

    const rootRect = previewRootRef.current.getBoundingClientRect();
    setTooltipPosition({
      x: rootRect.left + selectedNode.x + selectedNode.width / 2,
      y: rootRect.top + selectedNode.y,
    });
  }, [selectedNode]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      updateTooltipPosition();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [updateTooltipPosition, previewSize.width, previewSize.height]);

  useEffect(() => {
    if (!selectedNode) return;
    const surface = previewSurfaceRef.current;

    const handleUpdate = () => updateTooltipPosition();
    surface?.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate);

    return () => {
      surface?.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [selectedNode, updateTooltipPosition]);

  const renderNode = (node: LayoutNode) => {
    const itemIndex = node.meta?.index;
    const isSelected = itemIndex === selectedItemIndex;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (itemIndex === undefined) {
        setSelectedItemIndex(null);
        return;
      }
      setSelectedItemIndex(itemIndex);
    };

    const sizeLabel = `${formatNumber(node.width)} × ${formatNumber(node.height)}`;

    const content = (
      <div
        key={node.id.toString()}
        className={`playground-node ${isSelected ? "playground-node-selected" : ""}`}
        style={{
          left: node.x,
          top: node.y,
          width: node.width,
          height: node.height,
          backgroundColor: node.meta?.color,
          borderColor: node.meta?.color,
        }}
        onClick={handleClick}
        onMouseDownCapture={(event) => {
          event.preventDefault();
        }}
        onTouchStartCapture={(event) => {
          event.preventDefault();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            const mockEvent = {
              currentTarget: event.currentTarget,
              clientX: rect.left + rect.width / 2,
              clientY: rect.top + rect.height / 2,
            } as unknown as React.MouseEvent;
            handleClick(mockEvent);
          }
        }}
      >
        {itemIndex !== undefined && (
          <div className="playground-node-content">
            <span className="playground-node-size">{sizeLabel}</span>
          </div>
        )}
        {node.children?.map((child) => renderNode(child))}
      </div>
    );

    return content;
  };

  return (
    <div className="playground-preview-body">
      <div
        ref={previewSurfaceRef}
        className="playground-preview-surface"
        style={{}}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedItemIndex(null);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Clear selection"
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelectedItemIndex(null);
          }
        }}
      >
        <div
          ref={previewRootRef}
          className="playground-preview-root"
          style={{
            width: previewSize.width,
            height: previewSize.height,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedItemIndex(null);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Clear selection"
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setSelectedItemIndex(null);
            }
          }}
        >
          {layoutNodes.map(renderNode)}

          {selectedItem &&
          selectedNode &&
          tooltipPosition &&
          typeof document !== "undefined"
            ? createPortal(
                <div
                  className="playground-tooltip-anchor"
                  style={{
                    left: tooltipPosition.x,
                    top: tooltipPosition.y - 12,
                  }}
                >
                  <div className="playground-tooltip" ref={tooltipRef}>
                    <button
                      className="playground-tooltip-close absolute top-3 right-3 z-10"
                      onClick={() => setSelectedItemIndex(null)}
                      aria-label="Close editor"
                    >
                      ×
                    </button>
                    <PlaygroundNodeEditor
                      selectedItem={selectedItem}
                      config={config}
                      updateItem={updateItem}
                      onClose={() => setSelectedItemIndex(null)}
                    />
                  </div>
                </div>,
                document.body,
              )
            : null}
        </div>
      </div>
    </div>
  );
}
