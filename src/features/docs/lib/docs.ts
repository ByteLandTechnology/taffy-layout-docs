/**
 * @module features/docs/lib/docs
 * @description Core documentation library for reading and processing MDX documentation files.
 * Provides functions for file discovery, frontmatter parsing, table of contents extraction,
 * and sidebar navigation generation.
 */

import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { cache } from "react";
import {
  DEFAULT_LOCALE,
  localeBasePath,
  localeDir,
  type Locale,
} from "@/lib/locales";

/**
 * Frontmatter data extracted from MDX files
 * @interface FrontMatterData
 * @property {string} [title] - Document title
 * @property {string} [sidebar_label] - Label for sidebar navigation
 * @property {number} [sidebar_position] - Position for sidebar ordering
 * @property {unknown} [key] - Additional custom frontmatter properties
 */
export interface FrontMatterData {
  title?: string;
  sidebar_label?: string;
  sidebar_position?: number;
  [key: string]: unknown;
}

/**
 * Metadata about a documentation page
 * @interface DocMeta
 * @property {string} title - Page title
 * @property {string[]} slug - URL slug segments
 * @property {number} order - Sidebar ordering value
 * @property {boolean} isIndex - Whether this is an index page
 */
export interface DocMeta {
  title: string;
  slug: string[];
  order: number;
  isIndex: boolean;
}

/**
 * Complete documentation page data including content
 * @interface DocData
 * @property {string} title - Page title
 * @property {string[]} slug - URL slug segments
 * @property {string} content - Raw MDX content
 * @property {FrontMatterData} data - Frontmatter data
 * @property {TocItem[]} toc - Table of contents items
 * @property {boolean} isIndex - Whether this is an index page
 */
export interface DocData {
  title: string;
  slug: string[];
  content: string;
  data: FrontMatterData;
  toc: TocItem[];
  isIndex: boolean;
}

/**
 * Navigation item for sidebar structure
 * @interface NavItem
 * @property {string} title - Item title
 * @property {string} [href] - Link URL
 * @property {number} order - Ordering value
 * @property {NavItem[]} [children] - Child navigation items
 * @property {string} [segment] - URL segment identifier
 */
export interface NavItem {
  title: string;
  href?: string;
  order: number;
  children?: NavItem[];
  segment?: string;
}

/**
 * Table of contents item
 * @interface TocItem
 * @property {string} id - Heading ID (slug)
 * @property {string} text - Heading text
 * @property {number} level - Heading level (2 or 3)
 */
export interface TocItem {
  id: string;
  text: string;
  level: number;
}

import { DEFAULT_ORDER, MD_EXTENSIONS } from "@/lib/constants";

/**
 * Get the documentation root directory for a locale
 * @param {Locale} locale - Locale code
 * @returns {string} Absolute path to documentation root
 * @example
 * const root = docsRoot('en');
 */
const docsRoot = cache((locale: Locale) => {
  const root = path.resolve(process.cwd(), "taffy-layout", localeDir(locale));
  return root;
});

function isIgnoredPath(locale: Locale, relativePath: string) {
  const normalized = relativePath.toLowerCase();
  if (
    normalized === "readme.md" ||
    normalized === "readme.mdx" ||
    normalized.endsWith("/readme.md") ||
    normalized.endsWith("/readme.mdx")
  ) {
    return true;
  }
  if (locale === DEFAULT_LOCALE) {
    if (relativePath.startsWith("i18n/")) return true;
    if (relativePath.startsWith("public/")) return true;
  }
  return false;
}

function readFileSyncSafe(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

function extractTitle(content: string) {
  const match = /^#\s+(.+)$/m.exec(content);
  return match?.[1]?.trim();
}

function unescapeTitle(value: string) {
  return value
    .replace(/\\</g, "<")
    .replace(/\\>/g, ">")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function extractToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) continue;
    const level = match[1].length;
    const textRaw = match[2].replace(/\s+#$/, "").trim();
    const text = unescapeTitle(textRaw);
    const id = slugger.slug(text);
    items.push({ id, text, level });
  }

  return items;
}

function slugFromFile(root: string, filePath: string) {
  const rel = path.relative(root, filePath).replace(/\\/g, "/");
  const withoutExt = rel.replace(/\.(md|mdx)$/i, "");
  const parts = withoutExt.split("/").filter(Boolean);
  if (parts[parts.length - 1] === "index") {
    parts.pop();
  }
  return parts;
}

function titleFromSlug(slug: string[]) {
  const fallback = slug.length ? slug[slug.length - 1] : "Home";
  return fallback
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function docHref(locale: Locale, slug: string[]) {
  const base = `${localeBasePath(locale)}/docs`;
  if (!slug.length) return base;
  return `${base}/${slug.join("/")}`;
}

const listDocFiles = cache((locale: Locale) => {
  const root = docsRoot(locale);
  const results: string[] = [];
  const walk = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const entryPath = path.join(current, entry.name);
      const rel = path.relative(root, entryPath).replace(/\\/g, "/");
      if (entry.isDirectory()) {
        if (isIgnoredPath(locale, rel + "/")) continue;
        walk(entryPath);
      } else if (entry.isFile()) {
        if (isIgnoredPath(locale, rel)) continue;
        if (
          MD_EXTENSIONS.some((ext) => entry.name.toLowerCase().endsWith(ext))
        ) {
          results.push(entryPath);
        }
      }
    }
  };
  walk(root);
  return results;
});

export const getAllDocSlugs = cache(async (locale: Locale) => {
  const root = docsRoot(locale);
  return listDocFiles(locale).map((filePath) => slugFromFile(root, filePath));
});

export const getDocMetaList = cache(async (locale: Locale) => {
  const root = docsRoot(locale);
  return listDocFiles(locale).map((filePath) => {
    const source = readFileSyncSafe(filePath);
    const { data: rawData, content } = matter(source);
    const data = rawData as FrontMatterData;
    const slug = slugFromFile(root, filePath);
    const isIndex = path.basename(filePath).toLowerCase().startsWith("index.");
    const titleRaw =
      data.title ||
      data.sidebar_label ||
      extractTitle(content) ||
      titleFromSlug(slug);
    const title = unescapeTitle(titleRaw);
    const order =
      typeof data.sidebar_position === "number"
        ? data.sidebar_position
        : DEFAULT_ORDER;

    // Special handling for changelog - use translated title
    if (slug.length === 1 && slug[0] === "changelog") {
      const changelogTitles: Record<Locale, string> = {
        en: "Changelog",
        zh: "更新日志",
        ja: "変更ログ",
      };
      return {
        title: changelogTitles[locale] || "Changelog",
        slug,
        order,
        isIndex,
      } satisfies DocMeta;
    }

    return { title, slug, order, isIndex } satisfies DocMeta;
  });
});

function resolveDocPath(locale: Locale, slug: string[]) {
  const root = docsRoot(locale);
  const slugPath = slug.join("/");
  const base = path.join(root, slugPath);
  const candidates = [
    path.join(base, "index.md"),
    path.join(base, "index.mdx"),
    `${base}.md`,
    `${base}.mdx`,
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

export const getDoc = cache(async (locale: Locale, slug: string[]) => {
  // Special handling for changelog - use root CHANGELOG.md
  const isChangelog = slug.length === 1 && slug[0] === "changelog";

  let filePath: string | null = null;
  let source = "";
  let data: FrontMatterData = {};
  let content = "";

  if (isChangelog) {
    // Use the CHANGELOG.md from taffy-layout root
    filePath = path.resolve(process.cwd(), "taffy-layout", "CHANGELOG.md");
    source = readFileSyncSafe(filePath);
    data = { title: "Changelog" };
    content = source;

    // Add locale warning for non-English pages
    if (locale !== DEFAULT_LOCALE) {
      const warning = getLocaleWarning(locale);
      if (warning) {
        content = warning + "\n\n---\n\n" + content;
      }
    }
  } else {
    filePath = resolveDocPath(locale, slug);
    if (!filePath) return null;
    source = readFileSyncSafe(filePath);
    const parsed = matter(source);
    data = parsed.data as FrontMatterData;
    content = parsed.content;
  }

  const isIndex = filePath
    ? path.basename(filePath).toLowerCase().startsWith("index.")
    : false;
  const titleRaw =
    data.title ||
    data.sidebar_label ||
    extractTitle(content) ||
    titleFromSlug(slug);
  const title = unescapeTitle(titleRaw);

  // Process INCLUDE directives
  const processedContent =
    isChangelog || !filePath
      ? content
      : processIncludeDirectives(content, filePath);

  return {
    title,
    slug,
    content: processedContent,
    data,
    toc: extractToc(processedContent),
    isIndex,
  } satisfies DocData;
});

/**
 * Get locale-specific warning message
 */
function getLocaleWarning(locale: Locale): string | null {
  if (locale === DEFAULT_LOCALE) return null;

  const warnings: Record<Locale, string> = {
    en: "",
    zh: "> **注意：** Changelog 仅提供英文版本以保持准确性和一致性。",
    ja: "> **注意：** Changelog は英語版のみ提供されています。",
  };

  return warnings[locale] || null;
}

/**
 * Process <!-- INCLUDE path/to/file --> directives
 */
function processIncludeDirectives(
  content: string,
  currentFilePath: string,
): string {
  const includeRegex = /<!--\s*INCLUDE\s+(.+?)\s*-->/g;
  let match;
  let result = content;

  while ((match = includeRegex.exec(content)) !== null) {
    const includePath = match[1].trim();
    const resolvedPath = path.resolve(
      path.dirname(currentFilePath),
      includePath,
    );
    try {
      const includedContent = readFileSyncSafe(resolvedPath);
      result = result.replace(match[0], includedContent);
    } catch (error) {
      console.warn(`Failed to include file: ${resolvedPath}`, error);
    }
  }

  return result;
}

export const getSidebar = cache(async (locale: Locale) => {
  const docs = await getDocMetaList(locale);
  const root: NavItem = { title: "root", order: 0, children: [] };
  let home: NavItem | null = null;

  for (const doc of docs) {
    if (doc.slug[0] === "intro") {
      continue;
    }
    if (!doc.slug.length && doc.isIndex) {
      home = {
        title: doc.title,
        href: locale === DEFAULT_LOCALE ? "/" : `${localeBasePath(locale)}/`,
        order: doc.order,
        segment: "",
      };
      continue;
    }

    let current = root;
    doc.slug.forEach((segment, index) => {
      if (!current.children) current.children = [];
      const isLeaf = index === doc.slug.length - 1;
      if (isLeaf && !doc.isIndex) return;
      let section = current.children.find((child) => child.segment === segment);
      if (!section) {
        section = {
          title: titleFromSlug([segment]),
          order: DEFAULT_ORDER,
          segment,
          children: [],
        };
        current.children.push(section);
      }
      current = section;
    });

    if (doc.isIndex) {
      current.title = doc.title;
      current.href = docHref(locale, doc.slug);
      current.order = doc.order;
    } else {
      if (!current.children) current.children = [];
      current.children.push({
        title: doc.title,
        href: docHref(locale, doc.slug),
        order: doc.order,
        segment: doc.slug[doc.slug.length - 1],
      });
    }
  }

  const sortTree = (items?: NavItem[]) => {
    if (!items) return;
    items.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
    items.forEach((item) => sortTree(item.children));
  };

  sortTree(root.children);
  const navItems = root.children ?? [];
  if (home) {
    navItems.unshift(home);
  }
  return navItems;
});
