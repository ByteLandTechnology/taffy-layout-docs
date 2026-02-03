/**
 * Home page type definitions.
 * @module features/home/components/types
 * @description
 * Defines the data structures used by the home page hero, feature highlights,
 * and entry points.
 */

import { type Locale, type UiStrings } from "@/lib/locales";

/**
 * Action button definition for the hero section.
 */
export interface HeroAction {
  /** Optional theme token for styling the action button. */
  theme?: "brand" | "alt";
  /** Button label text. */
  text: string;
  /** Destination link for the action. */
  link: string;
}

/**
 * Hero content payload for the home page.
 */
export interface HeroData {
  /** Optional product or project name. */
  name?: string;
  /** Optional headline text. */
  text?: string;
  /** Optional descriptive tagline. */
  tagline?: string;
  /** Optional hero image data. */
  image?: { src: string; alt?: string };
  /** Optional list of hero actions. */
  actions?: HeroAction[];
}

/**
 * Feature highlight definition.
 */
export interface Feature {
  /** Feature title text. */
  title: string;
  /** Feature detail description. */
  details: string;
}

/**
 * Props for the home page component.
 */
export interface HomePageProps {
  /** Optional hero configuration. */
  hero?: HeroData;
  /** Optional feature list for the highlights section. */
  features?: Feature[];
  /** Localized UI strings. */
  ui: UiStrings;
  /** Current locale for routing. */
  locale: Locale;
}
