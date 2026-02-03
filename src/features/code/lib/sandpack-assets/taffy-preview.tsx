/**
 * @module taffy-preview
 * @description Preview visualizer for Taffy Layout structures.
 * Intercepts Taffy tree operations to collect layout data and renders
 * a visual representation of the nodes.
 */

const colorPalette = [
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#f472b6",
  "#c084fc",
  "#f97316",
];

interface PreviewLayout {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface PreviewTree {
  getLayout(node: unknown): PreviewLayout;
  __previewChildren: Map<unknown, unknown[]>;
}

function getChildrenMap(tree: PreviewTree) {
  if (!tree.__previewChildren) tree.__previewChildren = new Map();
  return tree.__previewChildren;
}

function wrapTree(mod: {
  TaffyTree: { prototype: Record<string, unknown> };
  __previewWrapped?: boolean;
}) {
  if (!mod?.TaffyTree || mod.__previewWrapped) return;
  const proto = mod.TaffyTree.prototype as {
    newLeaf: unknown;
    newWithChildren: unknown;
    addChild: unknown;
  };
  const originalNewLeaf = proto.newLeaf as (style: unknown) => unknown;
  const originalNewWithChildren = proto.newWithChildren as (
    style: unknown,
    children: unknown[],
  ) => unknown;
  const originalAddChild = proto.addChild as (
    parent: unknown,
    child: unknown,
  ) => unknown;

  proto.newLeaf = function (style: unknown) {
    const node = originalNewLeaf.call(this, style);
    getChildrenMap(this as unknown as PreviewTree).set(node, []);
    return node;
  };

  proto.newWithChildren = function (style: unknown, children: unknown[] = []) {
    const node = originalNewWithChildren.call(this, style, children);
    getChildrenMap(this as unknown as PreviewTree).set(node, children);
    return node;
  };

  if (typeof originalAddChild === "function") {
    proto.addChild = function (parent: unknown, child: unknown) {
      const result = originalAddChild.call(this, parent, child);
      const map = getChildrenMap(this as unknown as PreviewTree);
      const list = map.get(parent) || [];
      if (!list.includes(child)) list.push(child);
      map.set(parent, list);
      if (!map.has(child)) map.set(child, []);
      return result;
    };
  }
  mod.__previewWrapped = true;
}

function collectNodesWithPositions(tree: PreviewTree, root: unknown) {
  const map = getChildrenMap(tree);
  const visited = new Set<unknown>();
  const result: {
    node: unknown;
    layout: PreviewLayout;
    x: number;
    y: number;
    isLeaf: boolean;
  }[] = [];

  const walk = (node: unknown, offsetX: number, offsetY: number) => {
    if (!node || visited.has(node)) return;
    visited.add(node);
    const layout = tree.getLayout(node);
    const x = (layout?.x ?? 0) + offsetX;
    const y = (layout?.y ?? 0) + offsetY;
    const children = map.get(node) || [];
    result.push({ node, layout, x, y, isLeaf: children.length === 0 });
    children.forEach((child: unknown) => walk(child, x, y));
  };

  walk(root, 0, 0);
  return result;
}

/**
 * Visualizes a Taffy Layout tree.
 *
 * Renders a set of nested boxes representing the layout nodes,
 * displaying their dimensions and positions.
 *
 * @param props.tree - The preview-wrapped Taffy tree interface.
 * @param props.root - The root node of the layout to visualize.
 * @returns A React component rendering the layout visualization.
 */
export function TaffyTreePreview({
  tree,
  root,
}: {
  tree: PreviewTree;
  root: unknown;
}) {
  if (!tree || !root || typeof tree.getLayout !== "function") {
    return <div style={{ padding: 12 }}>No layout data.</div>;
  }
  const nodes = collectNodesWithPositions(tree, root);
  const rootLayout = tree.getLayout(root);
  const width = rootLayout?.width ?? 0;
  const height = rootLayout?.height ?? 0;

  return (
    <div
      style={{
        display: "inline-block",
        verticalAlign: "top",
        maxWidth: "100%",
        overflow: "visible",
        boxSizing: "border-box",
        padding: "4px", // Tiny padding for shadows
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          position: "relative",
          width,
          height,
          backgroundColor: "rgba(191, 219, 254, 0.45)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
          overflow: "hidden",
          borderRadius: 16,
          boxSizing: "border-box",
        }}
      >
        {nodes.map(({ layout, x, y, isLeaf }, index) => {
          const color =
            index === 0
              ? "var(--taffy-root-bg, rgba(255, 255, 255, 0.45))"
              : colorPalette[(index - 1) % colorPalette.length];
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: layout.width ?? 0,
                height: layout.height ?? 0,
                background: color,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: 12,
                color:
                  index === 0 ? "var(--taffy-root-text, #1e293b)" : "#1e293b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
                boxShadow:
                  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                pointerEvents: "none",
                boxSizing: "border-box",
                border:
                  index === 0
                    ? "var(--taffy-root-border, 1.5px solid rgba(255, 255, 255, 0.7))"
                    : "2px solid rgba(255,255,255,0.4)",
                transition: "all 0.2s ease",
              }}
            >
              {isLeaf && layout.width > 30 && layout.height > 15 ? (
                <span style={{ textShadow: "0 1px 2px rgba(255,255,255,0.2)" }}>
                  {(layout.width % 1 === 0
                    ? layout.width
                    : layout.width.toFixed(1)) +
                    "×" +
                    (layout.height % 1 === 0
                      ? layout.height
                      : layout.height.toFixed(1))}
                </span>
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Registers the preview mechanism by wrapping the Taffy module.
 *
 * @param mod - The Taffy WASM module to instrument.
 */
export function registerPreview(mod: {
  TaffyTree: unknown;
  TaffyTreePreview?: unknown;
}) {
  wrapTree(
    mod as {
      TaffyTree: { prototype: Record<string, unknown> };
      __previewWrapped?: boolean;
    },
  );
  if (mod) {
    mod.TaffyTreePreview = TaffyTreePreview;
  }
  if (typeof globalThis !== "undefined") {
    (globalThis as unknown as { TaffyTreePreview: unknown }).TaffyTreePreview =
      TaffyTreePreview;
  }
}
