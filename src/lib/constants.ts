/**
 * Shared constants used across the documentation site.
 * @module lib/constants
 * @description
 * Centralizes common configuration values for theming, navigation, and content
 * rendering to keep shared settings consistent across features.
 */

import { type Locale } from "./locales";
import {
  BookOpen,
  Code2,
  Gauge,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

/**
 * Theme-related configuration values.
 * @remarks Used by the theme provider and toggle components.
 */
export const THEME = {
  /** localStorage key for persisted theme preference. */
  STORAGE_KEY: "taffy-theme",
  /** Default theme mode used when none is stored. */
  DEFAULT: "system" as const,
  /** Attribute used to apply theme styling to the root element. */
  ATTRIBUTE: "class" as const,
} as const;

/**
 * Fallback sort order for documents without explicit ordering.
 */
export const DEFAULT_ORDER = 9999;

/**
 * Supported Markdown file extensions for content sources.
 */
export const MD_EXTENSIONS = [".md", ".mdx"] as const;

/**
 * Localized changelog page titles keyed by locale.
 */
export const CHANGELOG_TITLES: Record<Locale, string> = {
  en: "Changelog",
  zh: "更新日志",
  ja: "変更ログ",
} as const;

/**
 * Navigation group configuration for the top-level docs navigation.
 */
export interface NavGroupConfig {
  /** Route segment that identifies the group. */
  segment: string;
  /** Icon shown alongside the group label. */
  icon: LucideIcon;
  /** Localization key used to resolve the group label. */
  labelKey: string;
}

/**
 * Ordered list of navigation groups available in the site header.
 */
export const NAV_GROUPS: NavGroupConfig[] = [
  { segment: "docs", icon: BookOpen, labelKey: "docs" },
  { segment: "api", icon: Code2, labelKey: "api" },
  { segment: "benchmark", icon: Gauge, labelKey: "benchmark" },
  { segment: "playground", icon: FlaskConical, labelKey: "playground" },
] as const;
