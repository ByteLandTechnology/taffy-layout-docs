/**
 * Benchmark data structures and case definitions.
 * @module features/benchmark/lib/benchmark
 * @description
 * Defines benchmark case generation and tree builders for Taffy and Yoga
 * layout engines.
 */

import { TaffyTree, Style, Display, FlexDirection } from "taffy-layout";
import Yoga from "yoga-layout-prebuilt";

/**
 * Result metrics for a benchmark run.
 */
export interface BenchmarkResult {
  /** Human-readable benchmark name. */
  name: string;
  /** Taffy build time in milliseconds. */
  taffyBuildTime: number;
  /** Taffy layout time in milliseconds. */
  taffyLayoutTime: number;
  /** Yoga build time in milliseconds. */
  yogaBuildTime: number;
  /** Yoga layout time in milliseconds. */
  yogaLayoutTime: number;
  /** Current Taffy build time for in-progress runs. */
  currentTaffyBuild?: number;
  /** Current Taffy layout time for in-progress runs. */
  currentTaffyLayout?: number;
  /** Current Yoga build time for in-progress runs. */
  currentYogaBuild?: number;
  /** Current Yoga layout time for in-progress runs. */
  currentYogaLayout?: number;
  /** Run status for UI display. */
  status: "pending" | "running" | "completed" | "error";
  /** Completion progress from 0 to 100. */
  progress: number;
}

/**
 * Context returned from Taffy tree builders.
 */
export interface TaffyContext {
  /** Build time in milliseconds. */
  time: number;
  /** Taffy tree instance. */
  tree: TaffyTree;
  /** Root node identifier for layout computation. */
  root: bigint;
  /** Styles allocated during tree creation for cleanup. */
  styles: Style[];
}

/**
 * Context returned from Yoga tree builders.
 */
export interface YogaContext {
  /** Build time in milliseconds. */
  time: number;
  /** Yoga root node for layout computation. */
  root: Yoga.YogaNode;
}

/**
 * Base definition shared by all benchmark cases.
 */
interface BaseCase {
  /** Display group for UI grouping. */
  group: string;
  /** Human-readable case name. */
  name: string;
  /** Localization key for the case name. */
  nameKey: string;
  /** Node count or depth for the case. */
  count: number;
  /** Case type to determine builder behavior. */
  type: "nested" | "flat" | "chain";
  /** Number of iterations per benchmark run. */
  iterations: number;
}

/**
 * Benchmark case for nested or flat tree structures.
 */
interface NestedOrFlatCase extends BaseCase {
  /** Number of nodes to generate. */
  nodes: number;
  /** Optional branching factor for nested trees. */
  bf?: number;
}

/**
 * Benchmark case for chained (linear) tree structures.
 */
interface ChainCase extends BaseCase {
  /** Chain depth for the linear layout. */
  depth: number;
}

/**
 * Union of supported benchmark case definitions.
 */
export type BenchmarkCase = NestedOrFlatCase | ChainCase;

/**
 * Benchmark case with executable builder and layout functions.
 */
export type RunnableBenchmarkCase = BenchmarkCase & {
  /** Taffy builder and cleanup functions. */
  taffy: {
    build: () => TaffyContext;
    layout: (ctx: TaffyContext) => number;
    cleanup: (ctx: TaffyContext) => void;
  };
  /** Yoga builder and cleanup functions. */
  yoga: {
    build: () => YogaContext;
    layout: (ctx: YogaContext) => number;
    cleanup: (ctx: YogaContext) => void;
  };
  /** Sample code snippet for the Taffy case. */
  taffyCode: string;
  /** Sample code snippet for the Yoga case. */
  yogaCode: string;
  /** Description of the benchmark scenario. */
  description: string;
};
/**
 * Taffy tree builder utilities for benchmark cases.
 * @remarks Uses queue-based traversal for balanced tree generation.
 */
const taffyBuilder = {
  /**
   * Builds a nested tree structure for Taffy.
   * @param totalNodes - Total number of nodes to create.
   * @param bf - Branching factor for the tree.
   * @returns The constructed Taffy tree context.
   */
  buildNested: (totalNodes: number, bf: number) => {
    const tree = new TaffyTree();
    const style = new Style({
      display: Display.Flex,
      flexDirection: FlexDirection.Column,
      flexGrow: 1,
      width: 10,
      height: 10,
    });
    const root = tree.newLeaf(style);

    let createdCount = 1;
    const queue: bigint[] = [root];

    const start = performance.now();
    while (queue.length > 0 && createdCount < totalNodes) {
      const parent = queue.shift();
      if (parent === undefined) break;
      for (let i = 0; i < bf && createdCount < totalNodes; i++) {
        const child = tree.newLeaf(style);
        tree.addChild(parent, child);
        createdCount++;
        queue.push(child);
      }
    }
    const end = performance.now();
    return { time: end - start, tree, root, styles: [style] };
  },

  /**
   * Builds a flat tree structure for Taffy (one root, many children).
   * @param totalNodes - Total number of nodes to create.
   * @returns The constructed Taffy tree context.
   */
  buildFlat: (totalNodes: number) => {
    const tree = new TaffyTree();
    const rootStyle = new Style({ display: Display.Flex });
    const leafStyle = new Style({ width: 10, height: 10 });
    const root = tree.newLeaf(rootStyle);
    const start = performance.now();
    for (let i = 0; i < totalNodes - 1; i++) {
      tree.addChild(root, tree.newLeaf(leafStyle));
    }
    const end = performance.now();
    return { time: end - start, tree, root, styles: [rootStyle, leafStyle] };
  },

  /**
   * Builds a linear chain of nodes for Taffy.
   * @param depth - The depth of the chain.
   * @returns The constructed Taffy tree context.
   */
  buildChain: (depth: number) => {
    const tree = new TaffyTree();
    const style = new Style({
      display: Display.Flex,
      flexDirection: FlexDirection.Column,
      flexGrow: 1,
    });
    const leafStyle = new Style({ width: 10, height: 10 });
    let curr = tree.newLeaf(leafStyle);
    const start = performance.now();
    for (let i = 0; i < depth - 1; i++) {
      const container = tree.newLeaf(style);
      tree.addChild(container, curr);
      curr = container;
    }
    const end = performance.now();
    return { time: end - start, tree, root: curr, styles: [style, leafStyle] };
  },
};

/**
 * Yoga tree builder utilities for benchmark cases.
 * @remarks Uses queue-based traversal for balanced tree generation.
 */
const yogaBuilder = {
  /**
   * Builds a nested tree structure for Yoga.
   * @param totalNodes - Total number of nodes to create.
   * @param bf - Branching factor for the tree.
   * @returns The constructed Yoga tree context.
   */
  buildNested: (totalNodes: number, bf: number) => {
    const root = Yoga.Node.create();
    root.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);

    let createdCount = 1;
    const queue: Yoga.YogaNode[] = [root];

    const start = performance.now();
    while (queue.length > 0 && createdCount < totalNodes) {
      const parent = queue.shift();
      if (!parent) break;
      for (let i = 0; i < bf && createdCount < totalNodes; i++) {
        const child = Yoga.Node.create();
        child.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
        child.setWidth(10);
        child.setHeight(10);
        child.setFlexGrow(1);
        parent.insertChild(child, parent.getChildCount());
        createdCount++;
        queue.push(child);
      }
    }
    const end = performance.now();
    return { time: end - start, root };
  },

  /**
   * Builds a flat tree structure for Yoga (one root, many children).
   * @param totalNodes - Total number of nodes to create.
   * @returns The constructed Yoga tree context.
   */
  buildFlat: (totalNodes: number) => {
    const root = Yoga.Node.create();
    const start = performance.now();
    for (let i = 0; i < totalNodes - 1; i++) {
      const leaf = Yoga.Node.create();
      leaf.setWidth(10);
      leaf.setHeight(10);
      root.insertChild(leaf, i);
    }
    const end = performance.now();
    return { time: end - start, root };
  },

  /**
   * Builds a linear chain of nodes for Yoga.
   * @param depth - The depth of the chain.
   * @returns The constructed Yoga tree context.
   */
  buildChain: (depth: number) => {
    let curr = Yoga.Node.create();
    curr.setWidth(10);
    curr.setHeight(10);
    const start = performance.now();
    for (let i = 0; i < depth - 1; i++) {
      const container = Yoga.Node.create();
      container.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
      container.setFlexGrow(1);
      container.insertChild(curr, 0);
      curr = container;
    }
    const end = performance.now();
    return { time: end - start, root: curr };
  },
};

/**
 * Benchmark case definitions aligned with documentation scenarios.
 */
export const benchmarkCases: RunnableBenchmarkCase[] = [
  {
    group: "Nested Tree",
    name: "Nested / 10 Nodes",
    nameKey: "nestedNodes",
    count: 10,
    nodes: 10,
    bf: 10,
    type: "nested" as const,
    iterations: 50,
  },
  {
    group: "Nested Tree",
    name: "Nested / 100 Nodes",
    nameKey: "nestedNodes",
    count: 100,
    nodes: 100,
    bf: 10,
    type: "nested" as const,
    iterations: 50,
  },
  {
    group: "Nested Tree",
    name: "Nested / 1,000 Nodes",
    nameKey: "nestedNodes",
    count: 1000,
    nodes: 1000,
    bf: 10,
    type: "nested" as const,
    iterations: 20,
  },
  {
    group: "Nested Tree",
    name: "Nested / 10,000 Nodes",
    nameKey: "nestedNodes",
    count: 10000,
    nodes: 10000,
    bf: 10,
    type: "nested" as const,
    iterations: 10,
  },
  {
    group: "Nested Tree",
    name: "Nested / 100,000 Nodes",
    nameKey: "nestedNodes",
    count: 100000,
    nodes: 100000,
    bf: 10,
    type: "nested" as const,
    iterations: 2,
  },

  {
    group: "Flat Tree",
    name: "Flat / 10 Nodes",
    nameKey: "flatNodes",
    count: 10,
    nodes: 10,
    type: "flat" as const,
    iterations: 50,
  },
  {
    group: "Flat Tree",
    name: "Flat / 100 Nodes",
    nameKey: "flatNodes",
    count: 100,
    nodes: 100,
    type: "flat" as const,
    iterations: 50,
  },
  {
    group: "Flat Tree",
    name: "Flat / 1,000 Nodes",
    nameKey: "flatNodes",
    count: 1000,
    nodes: 1000,
    type: "flat" as const,
    iterations: 20,
  },
  {
    group: "Flat Tree",
    name: "Flat / 10,000 Nodes",
    nameKey: "flatNodes",
    count: 10000,
    nodes: 10000,
    type: "flat" as const,
    iterations: 10,
  },
  {
    group: "Flat Tree",
    name: "Flat / 100,000 Nodes",
    nameKey: "flatNodes",
    count: 100000,
    nodes: 100000,
    type: "flat" as const,
    iterations: 2,
  },

  {
    group: "Binary Tree",
    name: "Binary / 4,000 Nodes",
    nameKey: "binaryNodes",
    count: 4000,
    nodes: 4000,
    bf: 2,
    type: "nested" as const,
    iterations: 20,
  },
  {
    group: "Binary Tree",
    name: "Binary / 10,000 Nodes",
    nameKey: "binaryNodes",
    count: 10000,
    nodes: 10000,
    bf: 2,
    type: "nested" as const,
    iterations: 10,
  },
  {
    group: "Binary Tree",
    name: "Binary / 100,000 Nodes",
    nameKey: "binaryNodes",
    count: 100000,
    nodes: 100000,
    bf: 2,
    type: "nested" as const,
    iterations: 2,
  },

  {
    group: "Linear Chain",
    name: "Chain / 100 Levels",
    nameKey: "chainLevels",
    count: 100,
    depth: 100,
    type: "chain" as const,
    iterations: 20,
  },
  {
    group: "Linear Chain",
    name: "Chain / 250 Levels",
    nameKey: "chainLevels",
    count: 250,
    depth: 250,
    type: "chain" as const,
    iterations: 10,
  },
].map((c) => {
  const isChain = c.type === "chain";
  const size = isChain ? (c as ChainCase).depth : (c as NestedOrFlatCase).nodes;

  return {
    ...c,
    description: isChain
      ? `Linear chain hierarchy with ${size} levels deeply nested.`
      : `${size.toLocaleString()} node ${c.type} hierarchy structure.`,
    taffy: {
      /**
       * Executes the Taffy tree build process for the benchmark case.
       */
      build: (): TaffyContext => {
        if (c.type === "nested") {
          const nc = c as NestedOrFlatCase;
          return taffyBuilder.buildNested(nc.nodes, nc.bf ?? 10);
        }
        if (c.type === "flat") {
          const nc = c as NestedOrFlatCase;
          return taffyBuilder.buildFlat(nc.nodes);
        }
        return taffyBuilder.buildChain((c as ChainCase).depth);
      },
      /**
       * Executes the Taffy layout computation.
       * @param ctx - The Taffy context from the build phase.
       * @returns The duration of the layout computation in milliseconds.
       */
      layout: (ctx: TaffyContext) => {
        const start = performance.now();
        ctx.tree.computeLayout(ctx.root, { width: 1000, height: 1000 });
        return performance.now() - start;
      },
      /**
       * Cleans up Taffy resources.
       * @param ctx - The Taffy context to clean up.
       */
      cleanup: (ctx: TaffyContext) => {
        ctx.tree.free();
        ctx.styles.forEach((s) => s.free());
      },
    },
    yoga: {
      /**
       * Executes the Yoga tree build process for the benchmark case.
       */
      build: (): YogaContext => {
        if (c.type === "nested") {
          const nc = c as NestedOrFlatCase;
          return yogaBuilder.buildNested(nc.nodes, nc.bf ?? 10);
        }
        if (c.type === "flat") {
          const nc = c as NestedOrFlatCase;
          return yogaBuilder.buildFlat(nc.nodes);
        }
        return yogaBuilder.buildChain((c as ChainCase).depth);
      },
      /**
       * Executes the Yoga layout computation.
       * @param ctx - The Yoga context from the build phase.
       * @returns The duration of the layout computation in milliseconds.
       */
      layout: (ctx: YogaContext) => {
        const start = performance.now();
        ctx.root.calculateLayout(1000, 1000, Yoga.DIRECTION_LTR);
        return performance.now() - start;
      },
      /**
       * Cleans up Yoga resources.
       * @param ctx - The Yoga context to clean up.
       */
      cleanup: (ctx: YogaContext) => {
        ctx.root.freeRecursive();
      },
    },
    taffyCode: `// Hierarchy: ${c.type} | Scale: ${size}`,
    yogaCode: `// Hierarchy: ${c.type} | Scale: ${size}`,
  };
});
