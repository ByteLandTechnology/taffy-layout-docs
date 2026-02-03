/**
 * @module icons
 * @description Centralized icon registry and management for the codebase.
 * Provides a type-safe mapping of icon names to Lucide icons with consistent
 * naming conventions across the application.
 *
 * @example
 * ```tsx
 * import { getIcon, ICONS } from './icons';
 *
 * const Icon = getIcon('github');
 * // or
 * const Icon = ICONS.github;
 * ```
 */

import {
  BookOpen,
  Code2,
  Gauge,
  FlaskConical,
  Check,
  Copy,
  LayoutGrid,
  Zap,
  BadgeCheck,
  MonitorSmartphone,
  type LucideIcon,
  ChevronRight,
  Menu,
  X,
  Languages,
  Moon,
  Sun,
} from "lucide-react";
import { GithubIcon } from "../components/GithubIcon";

/**
 * Registry of all available icons mapped to their Lucide components.
 * Use this object directly or {@link getIcon} for type-safe icon access.
 *
 * @example
 * ```tsx
 * import { ICONS } from './icons';
 *
 * const MyComponent = () => <ICONS.github />;
 * ```
 */
export const ICONS = {
  docs: BookOpen,
  api: Code2,
  benchmark: Gauge,
  playground: FlaskConical,
  github: GithubIcon,
  check: Check,
  copy: Copy,
  grid: LayoutGrid,
  zap: Zap,
  badge: BadgeCheck,
  monitor: MonitorSmartphone,
  chevronRight: ChevronRight,
  menu: Menu,
  close: X,
  languages: Languages,
  moon: Moon,
  sun: Sun,
} as const;

/**
 * Union type of all available icon names in the registry.
 * Use this type for props that accept icon names.
 *
 * @example
 * ```tsx
 * interface Props {
 *   iconName: IconName;
 * }
 * ```
 */
export type IconName = keyof typeof ICONS;

/**
 * Retrieves the Lucide icon component for a given icon name.
 *
 * @param name - The name of the icon to retrieve
 * @returns The Lucide icon component
 *
 * @example
 * ```tsx
 * import { getIcon } from './icons';
 *
 * const Icon = getIcon('github');
 * return <Icon size={24} />;
 * ```
 */
export function getIcon(name: IconName): LucideIcon {
  return ICONS[name];
}

/**
 * Re-export of the LucideIcon type for convenience.
 * Use this type when typing icon props or variables.
 */
export type { LucideIcon };
