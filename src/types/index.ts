/**
 * Barrel exports for shared application types.
 * @module types/index
 * @description
 * Re-exports commonly used types to provide a single import surface for
 * documentation metadata, navigation, and localization types.
 */

/**
 * Document metadata type used for navigation and indexing.
 * @remarks Sourced from the docs parsing layer.
 */
export type { DocMeta } from "@/features/docs/lib/docs";

/**
 * Document data type including content and frontmatter.
 * @remarks Used when rendering markdown pages and previews.
 */
export type { DocData } from "@/features/docs/lib/docs";

/**
 * Navigation item type used to build the docs tree.
 * @remarks Represents a leaf or group in the navigation hierarchy.
 */
export type { NavItem } from "@/features/docs/lib/docs";

/**
 * Navigation component prop types.
 * @remarks Re-exports interfaces describing nav group inputs and props.
 */
export * from "./navigation";

/**
 * Table of contents item type for on-page navigation.
 * @remarks Represents heading anchors extracted from content.
 */
export type { TocItem } from "@/features/docs/lib/docs";

/**
 * Locale string map for localizable labels.
 * @remarks Use when a label is optional in some languages.
 */
export interface LocaleString {
  /** English label. */
  en: string;
  /** Simplified Chinese label. */
  zh?: string;
  /** Japanese label. */
  ja?: string;
}

/**
 * Branded types for type-safe identifiers.
 * @remarks Helps prevent mixing of route and locale values.
 */
export * from "./brand";
