/**
 * @module features/playground/hooks/useTaffyLayout
 * @description Hook for interacting with the Taffy WASM engine to compute layouts.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { loadTaffy, TaffyTree, Display, Style } from "taffy-layout";
import {
  ALIGN_CONTENT_MAP,
  ALIGN_ITEMS_MAP,
  ALIGN_SELF_MAP,
  FLEX_DIRECTION_MAP,
  FLEX_WRAP_MAP,
  GRID_AUTOFLOW_MAP,
  ITEM_COLORS,
  JUSTIFY_CONTENT_MAP,
  buildTrackList,
  type DemoConfig,
  type LayoutNode,
  type NodeMeta,
} from "@/features/playground/components/PlaygroundConfig";

/**
 * Recursively collects layout nodes from the Taffy tree.
 *
 * Traverses the Taffy tree starting from the root node and builds a
 * hierarchy of LayoutNode objects with position, size, and metadata.
 *
 * @param taffyTree - The Taffy layout tree instance.
 * @param rootNode - The root node ID to start collection from.
 * @param metaById - Mapping of node IDs to their metadata.
 * @returns Array of LayoutNode objects representing the computed layout.
 */
const collectLayouts = (
  taffyTree: TaffyTree,
  rootNode: bigint,
  metaById: Record<string, NodeMeta>,
): LayoutNode[] => {
  const nodes = new Map<bigint, LayoutNode>();
  const childrenById = new Map<bigint, bigint[]>();
  const visited = new Set<bigint>();
  const queue = [rootNode];

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (nodeId === undefined) break;
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    const layout = taffyTree.getLayout(nodeId);
    const children = taffyTree.children(nodeId);
    const childIds: bigint[] = [];
    for (const child of children) {
      childIds.push(child);
    }

    nodes.set(nodeId, {
      id: nodeId,
      x: layout.x,
      y: layout.y,
      width: layout.width,
      height: layout.height,
      meta: metaById[nodeId.toString()],
    });
    childrenById.set(nodeId, childIds);

    for (const childId of childIds) {
      queue.push(childId);
    }
  }

  for (const [nodeId, childIds] of childrenById.entries()) {
    const node = nodes.get(nodeId);
    if (!node || childIds.length === 0) continue;
    const childNodes = childIds
      .map((childId) => nodes.get(childId))
      .filter((child): child is LayoutNode => Boolean(child));
    node.children = childNodes.length > 0 ? childNodes : undefined;
  }

  const rootLayout = nodes.get(rootNode);
  return rootLayout ? [rootLayout] : [];
};

/**
 * Hook to compute and manage the Taffy layout.
 *
 * Loads the Taffy WASM engine, computes the layout based on the provided
 * configuration, and returns the computed layout nodes, any errors, the
 * engine readiness state, and the preview size.
 *
 * @param config - The playground configuration containing layout settings.
 * @param availableSize - The available canvas size for the layout.
 * @param previewScale - The scale factors (percentage) for width and height.
 * @returns Object containing layoutNodes, error, engineReady, and previewSize.
 *
 * @example
 * const { layoutNodes, error, engineReady, previewSize } = useTaffyLayout(
 *   config,
 *   { width: 800, height: 600 },
 *   { width: 100, height: 100 }
 * );
 */
export function useTaffyLayout(
  config: DemoConfig,
  availableSize: { width: number; height: number },
  previewScale: { width: number; height: number },
) {
  const [layoutNodes, setLayoutNodes] = useState<LayoutNode[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [engineReady, setEngineReady] = useState(false);

  const previewSize = useMemo(
    () => ({
      width: Math.max(
        10,
        Math.round((availableSize.width * previewScale.width) / 100),
      ),
      height: Math.max(
        10,
        Math.round((availableSize.height * previewScale.height) / 100),
      ),
    }),
    [
      availableSize.width,
      availableSize.height,
      previewScale.width,
      previewScale.height,
    ],
  );

  useEffect(() => {
    let cancelled = false;
    loadTaffy()
      .then(() => {
        if (!cancelled) setEngineReady(true);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const computeLayout = useCallback(() => {
    if (!engineReady) {
      setError("Taffy WASM is still loading.");
      return;
    }

    if (previewSize.width === 0 || previewSize.height === 0) {
      return;
    }

    setError(null);

    try {
      const tree = new TaffyTree();
      const metaById: Record<string, NodeMeta> = {};
      const containerStyle = new Style();

      containerStyle.display =
        config.displayMode === "flex" ? Display.Flex : Display.Grid;
      containerStyle.size = {
        width: previewSize.width,
        height: previewSize.height,
      };
      containerStyle.padding = {
        left: config.container.padding,
        right: config.container.padding,
        top: config.container.padding,
        bottom: config.container.padding,
      };
      containerStyle.gap = {
        width: config.container.gapX,
        height: config.container.gapY,
      };

      if (config.displayMode === "flex") {
        containerStyle.flexDirection =
          FLEX_DIRECTION_MAP[config.container.flex.direction];
        containerStyle.justifyContent =
          JUSTIFY_CONTENT_MAP[config.container.flex.justifyContent];
        containerStyle.alignItems =
          ALIGN_ITEMS_MAP[config.container.flex.alignItems];
        containerStyle.alignContent =
          ALIGN_CONTENT_MAP[config.container.flex.alignContent];
        containerStyle.flexWrap = FLEX_WRAP_MAP[config.container.flex.wrap];
      } else {
        containerStyle.gridAutoFlow =
          GRID_AUTOFLOW_MAP[config.container.grid.autoFlow];
        containerStyle.gridTemplateColumns = buildTrackList(
          config.container.grid.columns,
          config.container.grid.columnMode,
          config.container.grid.columnSize,
        );
        containerStyle.gridTemplateRows = buildTrackList(
          config.container.grid.rows,
          config.container.grid.rowMode,
          config.container.grid.rowSize,
        );
      }

      const childIds: bigint[] = [];

      config.items.forEach((item, index) => {
        const itemStyle = new Style();
        itemStyle.size = {
          width: item.widthAuto ? "auto" : item.width,
          height: item.heightAuto ? "auto" : item.height,
        };

        itemStyle.alignSelf = ALIGN_SELF_MAP[item.alignSelf];

        if (config.displayMode === "flex") {
          itemStyle.flexGrow = item.flexGrow;
          itemStyle.flexShrink = item.flexShrink;
          itemStyle.flexBasis = item.flexBasisAuto ? "auto" : item.flexBasis;
        } else {
          if (item.columnSpan > 1) {
            itemStyle.gridColumn = {
              start: "auto",
              end: { span: item.columnSpan },
            };
          }
          if (item.rowSpan > 1) {
            itemStyle.gridRow = { start: "auto", end: { span: item.rowSpan } };
          }
        }

        const nodeId = tree.newLeaf(itemStyle);
        childIds.push(nodeId);
        metaById[nodeId.toString()] = {
          label: `Item ${index + 1}`,
          color: ITEM_COLORS[index % ITEM_COLORS.length],
          index,
        };
      });

      const rootNode = tree.newWithChildren(containerStyle, childIds);
      metaById[rootNode.toString()] = {
        label: "Container",
        color: "rgba(0, 122, 255, 0.12)",
      };

      tree.computeLayout(rootNode, {
        width: previewSize.width,
        height: previewSize.height,
      });

      const nodes = collectLayouts(tree, rootNode, metaById);
      setLayoutNodes(nodes);
    } catch (err) {
      setError(err instanceof Error ? (err.stack ?? err.message) : String(err));
    }
  }, [config, engineReady, previewSize]);

  useEffect(() => {
    if (engineReady) {
      const timer = setTimeout(() => {
        computeLayout();
      }, 0);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [engineReady, computeLayout]);

  return {
    layoutNodes,
    error,
    engineReady,
    previewSize,
  };
}
