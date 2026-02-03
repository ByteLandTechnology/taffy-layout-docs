/**
 * Playground configuration types and presets.
 * @module features/playground/components/PlaygroundConfig
 * @description
 * Defines the data structures, option lists, and presets used by the layout
 * playground for configuring flex and grid behaviors.
 */

import {
  AlignContent,
  AlignItems,
  AlignSelf,
  FlexDirection,
  FlexWrap,
  GridAutoFlow,
  JustifyContent,
  type GridTemplateComponent,
  type TrackSizingFunction,
} from "taffy-layout";

/**
 * Layout node representation used for preview rendering.
 */
export interface LayoutNode {
  /** Node identifier from the Taffy layout tree. */
  id: bigint;
  /** Computed X position. */
  x: number;
  /** Computed Y position. */
  y: number;
  /** Computed width. */
  width: number;
  /** Computed height. */
  height: number;
  /** Optional nested child nodes. */
  children?: LayoutNode[];
  /** Optional metadata used by the UI. */
  meta?: NodeMeta;
}

/**
 * Display mode selection for the playground.
 */
export type DisplayMode = "flex" | "grid";

/**
 * Flex direction selection keys.
 */
export type FlexDirectionKey =
  | "row"
  | "column"
  | "rowReverse"
  | "columnReverse";

/**
 * Flex wrap selection keys.
 */
export type FlexWrapKey = "nowrap" | "wrap" | "wrapReverse";

/**
 * Align-items selection keys.
 */
export type AlignItemsKey =
  | "stretch"
  | "flexStart"
  | "center"
  | "flexEnd"
  | "start"
  | "end"
  | "baseline";

/**
 * Align-content selection keys.
 */
export type AlignContentKey =
  | "stretch"
  | "flexStart"
  | "center"
  | "flexEnd"
  | "start"
  | "end"
  | "spaceBetween"
  | "spaceAround"
  | "spaceEvenly";

/**
 * Justify-content selection keys.
 */
export type JustifyContentKey =
  | "flexStart"
  | "center"
  | "flexEnd"
  | "start"
  | "end"
  | "spaceBetween"
  | "spaceAround"
  | "spaceEvenly"
  | "stretch";

/**
 * Align-self selection keys.
 */
export type AlignSelfKey =
  | "auto"
  | "stretch"
  | "flexStart"
  | "center"
  | "flexEnd"
  | "start"
  | "end"
  | "baseline";

/**
 * Grid auto-flow selection keys.
 */
export type GridAutoFlowKey = "row" | "column" | "rowDense" | "columnDense";

/**
 * Track sizing mode for grid templates.
 */
export type TrackSizingMode = "fixed" | "fr";

/**
 * Configurable item entry in the playground.
 */
export interface DemoItem {
  /** Item width in pixels. */
  width: number;
  /** Item height in pixels. */
  height: number;
  /** Whether width should be auto-sized. */
  widthAuto: boolean;
  /** Whether height should be auto-sized. */
  heightAuto: boolean;
  /** Flex grow value. */
  flexGrow: number;
  /** Flex shrink value. */
  flexShrink: number;
  /** Flex basis value. */
  flexBasis: number;
  /** Whether flex basis should be auto. */
  flexBasisAuto: boolean;
  /** Align-self selection for the item. */
  alignSelf: AlignSelfKey;
  /** Grid row span for the item. */
  rowSpan: number;
  /** Grid column span for the item. */
  columnSpan: number;
}

/**
 * Playground configuration state.
 */
export interface DemoConfig {
  /** Display mode selection. */
  displayMode: DisplayMode;
  /** Container-level configuration. */
  container: {
    /** Container padding. */
    padding: number;
    /** Horizontal gap value. */
    gapX: number;
    /** Vertical gap value. */
    gapY: number;
    /** Flex container configuration. */
    flex: {
      /** Flex direction. */
      direction: FlexDirectionKey;
      /** Justify-content option. */
      justifyContent: JustifyContentKey;
      /** Align-items option. */
      alignItems: AlignItemsKey;
      /** Align-content option. */
      alignContent: AlignContentKey;
      /** Flex wrap option. */
      wrap: FlexWrapKey;
    };
    /** Grid container configuration. */
    grid: {
      /** Column count. */
      columns: number;
      /** Row count. */
      rows: number;
      /** Column sizing mode. */
      columnMode: TrackSizingMode;
      /** Column size for fixed sizing. */
      columnSize: number;
      /** Row sizing mode. */
      rowMode: TrackSizingMode;
      /** Row size for fixed sizing. */
      rowSize: number;
      /** Auto-flow setting for grid placement. */
      autoFlow: GridAutoFlowKey;
    };
  };
  /** Item configuration list. */
  items: DemoItem[];
}

/**
 * Preset definition for the playground.
 */
export interface DemoPreset {
  /** Preset display name. */
  name: string;
  /** Preset description text. */
  description: string;
  /** Preset configuration payload. */
  config: DemoConfig;
}

/**
 * Optional metadata applied to rendered nodes.
 */
export interface NodeMeta {
  /** Short label text. */
  label: string;
  /** Color token or hex color value. */
  color: string;
  /** Optional index used for labeling. */
  index?: number;
}

/**
 * Default color palette for demo items.
 */
export const ITEM_COLORS = [
  "#007aff",
  "#34c759",
  "#ff3b30",
  "#4da3ff",
  "#7ddc8b",
  "#ff8a80",
  "#1e40af",
  "#f97316",
];

/**
 * Flex direction selection options for UI controls.
 */
export const FLEX_DIRECTION_OPTIONS: {
  label: string;
  value: FlexDirectionKey;
}[] = [
  { label: "Row", value: "row" },
  { label: "Column", value: "column" },
  { label: "Row Reverse", value: "rowReverse" },
  { label: "Column Reverse", value: "columnReverse" },
];

/**
 * Justify-content selection options for UI controls.
 */
export const JUSTIFY_CONTENT_OPTIONS: {
  label: string;
  value: JustifyContentKey;
}[] = [
  { label: "Flex Start", value: "flexStart" },
  { label: "Center", value: "center" },
  { label: "Flex End", value: "flexEnd" },
  { label: "Space Between", value: "spaceBetween" },
  { label: "Space Around", value: "spaceAround" },
  { label: "Space Evenly", value: "spaceEvenly" },
  { label: "Start", value: "start" },
  { label: "End", value: "end" },
  { label: "Stretch", value: "stretch" },
];

/**
 * Align-items selection options for UI controls.
 */
export const ALIGN_ITEMS_OPTIONS: { label: string; value: AlignItemsKey }[] = [
  { label: "Stretch", value: "stretch" },
  { label: "Flex Start", value: "flexStart" },
  { label: "Center", value: "center" },
  { label: "Flex End", value: "flexEnd" },
  { label: "Start", value: "start" },
  { label: "End", value: "end" },
  { label: "Baseline", value: "baseline" },
];

/**
 * Align-content selection options for UI controls.
 */
export const ALIGN_CONTENT_OPTIONS: {
  label: string;
  value: AlignContentKey;
}[] = [
  { label: "Stretch", value: "stretch" },
  { label: "Flex Start", value: "flexStart" },
  { label: "Center", value: "center" },
  { label: "Flex End", value: "flexEnd" },
  { label: "Start", value: "start" },
  { label: "End", value: "end" },
  { label: "Space Between", value: "spaceBetween" },
  { label: "Space Around", value: "spaceAround" },
  { label: "Space Evenly", value: "spaceEvenly" },
];

/**
 * Flex wrap selection options for UI controls.
 */
export const FLEX_WRAP_OPTIONS: { label: string; value: FlexWrapKey }[] = [
  { label: "No Wrap", value: "nowrap" },
  { label: "Wrap", value: "wrap" },
  { label: "Wrap Reverse", value: "wrapReverse" },
];

/**
 * Grid auto-flow selection options for UI controls.
 */
export const GRID_AUTOFLOW_OPTIONS: {
  label: string;
  value: GridAutoFlowKey;
}[] = [
  { label: "Row", value: "row" },
  { label: "Column", value: "column" },
  { label: "Row Dense", value: "rowDense" },
  { label: "Column Dense", value: "columnDense" },
];

/**
 * Align-self selection options for UI controls.
 */
export const ALIGN_SELF_OPTIONS: { label: string; value: AlignSelfKey }[] = [
  { label: "Auto", value: "auto" },
  { label: "Stretch", value: "stretch" },
  { label: "Flex Start", value: "flexStart" },
  { label: "Center", value: "center" },
  { label: "Flex End", value: "flexEnd" },
  { label: "Start", value: "start" },
  { label: "End", value: "end" },
  { label: "Baseline", value: "baseline" },
];

/**
 * Map of flex direction keys to Taffy values.
 */
export const FLEX_DIRECTION_MAP: Record<FlexDirectionKey, FlexDirection> = {
  row: FlexDirection.Row,
  column: FlexDirection.Column,
  rowReverse: FlexDirection.RowReverse,
  columnReverse: FlexDirection.ColumnReverse,
};

/**
 * Map of flex wrap keys to Taffy values.
 */
export const FLEX_WRAP_MAP: Record<FlexWrapKey, FlexWrap> = {
  nowrap: FlexWrap.NoWrap,
  wrap: FlexWrap.Wrap,
  wrapReverse: FlexWrap.WrapReverse,
};

/**
 * Map of justify-content keys to Taffy values.
 */
export const JUSTIFY_CONTENT_MAP: Record<JustifyContentKey, JustifyContent> = {
  flexStart: JustifyContent.FlexStart,
  center: JustifyContent.Center,
  flexEnd: JustifyContent.FlexEnd,
  spaceBetween: JustifyContent.SpaceBetween,
  spaceAround: JustifyContent.SpaceAround,
  spaceEvenly: JustifyContent.SpaceEvenly,
  start: JustifyContent.Start,
  end: JustifyContent.End,
  stretch: JustifyContent.Stretch,
};

/**
 * Map of align-items keys to Taffy values.
 */
export const ALIGN_ITEMS_MAP: Record<AlignItemsKey, AlignItems> = {
  stretch: AlignItems.Stretch,
  flexStart: AlignItems.FlexStart,
  center: AlignItems.Center,
  flexEnd: AlignItems.FlexEnd,
  start: AlignItems.Start,
  end: AlignItems.End,
  baseline: AlignItems.Baseline,
};

/**
 * Map of align-content keys to Taffy values.
 */
export const ALIGN_CONTENT_MAP: Record<AlignContentKey, AlignContent> = {
  stretch: AlignContent.Stretch,
  flexStart: AlignContent.FlexStart,
  center: AlignContent.Center,
  flexEnd: AlignContent.FlexEnd,
  start: AlignContent.Start,
  end: AlignContent.End,
  spaceBetween: AlignContent.SpaceBetween,
  spaceAround: AlignContent.SpaceAround,
  spaceEvenly: AlignContent.SpaceEvenly,
};

/**
 * Map of align-self keys to Taffy values.
 */
export const ALIGN_SELF_MAP: Record<AlignSelfKey, AlignSelf> = {
  auto: AlignSelf.Auto,
  stretch: AlignSelf.Stretch,
  flexStart: AlignSelf.FlexStart,
  center: AlignSelf.Center,
  flexEnd: AlignSelf.FlexEnd,
  start: AlignSelf.Start,
  end: AlignSelf.End,
  baseline: AlignSelf.Baseline,
};

/**
 * Map of grid auto-flow keys to Taffy values.
 */
export const GRID_AUTOFLOW_MAP: Record<GridAutoFlowKey, GridAutoFlow> = {
  row: GridAutoFlow.Row,
  column: GridAutoFlow.Column,
  rowDense: GridAutoFlow.RowDense,
  columnDense: GridAutoFlow.ColumnDense,
};

/**
 * Default demo item configuration used for new items.
 */
export const defaultItem: DemoItem = {
  width: 120,
  height: 80,
  widthAuto: false,
  heightAuto: false,
  flexGrow: 0,
  flexShrink: 1,
  flexBasis: 0,
  flexBasisAuto: true,
  alignSelf: "auto",
  rowSpan: 1,
  columnSpan: 1,
};

/**
 * Create an array of demo items with optional overrides.
 * @param count - Number of items to create.
 * @param overrides - Optional overrides applied to each item.
 * @returns Array of demo items.
 */
export const createItems = (count: number, overrides?: Partial<DemoItem>) =>
  Array.from({ length: count }, () => ({ ...defaultItem, ...overrides }));

/**
 * Built-in presets for the playground.
 */
export const PRESETS: Record<string, DemoPreset> = {
  flexBetween: {
    name: "Flex · Space Between",
    description: "A row container distributing space between cards.",
    config: {
      displayMode: "flex",
      container: {
        padding: 16,
        gapX: 16,
        gapY: 16,
        flex: {
          direction: "row",
          justifyContent: "spaceBetween",
          alignItems: "center",
          alignContent: "stretch",
          wrap: "nowrap",
        },
        grid: {
          columns: 3,
          rows: 2,
          columnMode: "fixed",
          columnSize: 180,
          rowMode: "fixed",
          rowSize: 120,
          autoFlow: "row",
        },
      },
      items: createItems(3, { width: 140, height: 90 }),
    },
  },
  flexGrow: {
    name: "Flex · Grow",
    description: "Items grow proportionally to fill the row.",
    config: {
      displayMode: "flex",
      container: {
        padding: 12,
        gapX: 12,
        gapY: 12,
        flex: {
          direction: "row",
          justifyContent: "flexStart",
          alignItems: "stretch",
          alignContent: "stretch",
          wrap: "nowrap",
        },
        grid: {
          columns: 3,
          rows: 2,
          columnMode: "fixed",
          columnSize: 180,
          rowMode: "fixed",
          rowSize: 120,
          autoFlow: "row",
        },
      },
      items: [
        { ...defaultItem, width: 120, height: 90, flexGrow: 1 },
        { ...defaultItem, width: 120, height: 90, flexGrow: 2 },
        { ...defaultItem, width: 120, height: 90, flexGrow: 1 },
      ],
    },
  },
  flexWrap: {
    name: "Flex · Wrap",
    description: "Wrapping layout with align-content controls.",
    config: {
      displayMode: "flex",
      container: {
        padding: 16,
        gapX: 16,
        gapY: 16,
        flex: {
          direction: "row",
          justifyContent: "flexStart",
          alignItems: "center",
          alignContent: "spaceBetween",
          wrap: "wrap",
        },
        grid: {
          columns: 3,
          rows: 2,
          columnMode: "fixed",
          columnSize: 180,
          rowMode: "fixed",
          rowSize: 120,
          autoFlow: "row",
        },
      },
      items: createItems(8, { width: 140, height: 70 }),
    },
  },
  gridBasic: {
    name: "Grid · Basic",
    description: "Auto-placed grid tracks with fixed sizes.",
    config: {
      displayMode: "grid",
      container: {
        padding: 16,
        gapX: 12,
        gapY: 12,
        flex: {
          direction: "row",
          justifyContent: "flexStart",
          alignItems: "stretch",
          alignContent: "stretch",
          wrap: "nowrap",
        },
        grid: {
          columns: 3,
          rows: 2,
          columnMode: "fixed",
          columnSize: 200,
          rowMode: "fixed",
          rowSize: 120,
          autoFlow: "row",
        },
      },
      items: createItems(6, {
        width: 140,
        height: 80,
        widthAuto: true,
        heightAuto: true,
      }),
    },
  },
  gridSpans: {
    name: "Grid · Spans",
    description: "Mix spans to highlight grid placement.",
    config: {
      displayMode: "grid",
      container: {
        padding: 16,
        gapX: 12,
        gapY: 12,
        flex: {
          direction: "row",
          justifyContent: "flexStart",
          alignItems: "stretch",
          alignContent: "stretch",
          wrap: "nowrap",
        },
        grid: {
          columns: 4,
          rows: 3,
          columnMode: "fixed",
          columnSize: 160,
          rowMode: "fixed",
          rowSize: 100,
          autoFlow: "row",
        },
      },
      items: [
        {
          ...defaultItem,
          widthAuto: true,
          heightAuto: true,
          columnSpan: 2,
          rowSpan: 1,
        },
        {
          ...defaultItem,
          widthAuto: true,
          heightAuto: true,
          columnSpan: 1,
          rowSpan: 2,
        },
        {
          ...defaultItem,
          widthAuto: true,
          heightAuto: true,
          columnSpan: 2,
          rowSpan: 1,
        },
        {
          ...defaultItem,
          widthAuto: true,
          heightAuto: true,
          columnSpan: 1,
          rowSpan: 1,
        },
        {
          ...defaultItem,
          widthAuto: true,
          heightAuto: true,
          columnSpan: 1,
          rowSpan: 1,
        },
        {
          ...defaultItem,
          widthAuto: true,
          heightAuto: true,
          columnSpan: 1,
          rowSpan: 1,
        },
      ],
    },
  },
};

/**
 * Convert a sizing mode and value into a grid track definition.
 * @param mode - Track sizing mode.
 * @param value - Track size value.
 * @returns Track sizing function for Taffy grid templates.
 */
export const toTrack = (
  mode: TrackSizingMode,
  value: number,
): TrackSizingFunction =>
  mode === "fixed"
    ? { min: value, max: value }
    : { min: "auto", max: `${value}fr` };

/**
 * Build a track list with the provided sizing configuration.
 * @param count - Number of tracks.
 * @param mode - Track sizing mode.
 * @param value - Track size value.
 * @returns Array of grid template components.
 */
export const buildTrackList = (
  count: number,
  mode: TrackSizingMode,
  value: number,
): GridTemplateComponent[] =>
  Array.from({ length: Math.max(count, 1) }, () => toTrack(mode, value));

/**
 * Deep clone a playground configuration object.
 * @param config - Configuration to clone.
 * @returns Cloned configuration.
 */
export const cloneConfig = (config: DemoConfig): DemoConfig =>
  JSON.parse(JSON.stringify(config)) as DemoConfig;

/**
 * Format numbers for display in UI inputs.
 * @param value - Raw numeric value.
 * @returns Rounded display value.
 */
export const formatNumber = (value: number) => Math.round(value);
