/**
 * Locale metadata and UI string resources.
 * @module lib/locales
 * @description
 * Provides locale definitions, helpers, and localized UI strings used across
 * the documentation site.
 */

/**
 * Default locale used when no locale segment is present.
 */
export const DEFAULT_LOCALE = "en";

/**
 * Locale configuration map containing labels and documentation directories.
 */
export const LOCALES = {
  en: {
    label: "English",
    dir: "docs",
  },
  zh: {
    label: "中文",
    dir: "docs/i18n/zh-CN",
  },
  ja: {
    label: "日本語",
    dir: "docs/i18n/ja-JP",
  },
} as const;

/**
 * Ordered list of supported locale keys.
 */
export const LOCALE_KEYS = ["en", "zh", "ja"] as const;
/**
 * Union type of supported locale keys.
 */
export type Locale = (typeof LOCALE_KEYS)[number];

/**
 * Array form of supported locale keys for iteration.
 */
export const localeList = [...LOCALE_KEYS];

/**
 * Type guard to validate a locale string.
 * @param value - Candidate locale string.
 * @returns True when the value is a supported locale key.
 */
export function isLocale(value: string): value is Locale {
  return value in LOCALES;
}

/**
 * Resolve the content directory for a locale.
 * @param locale - Locale key.
 * @returns Directory name containing documentation content.
 */
export function localeDir(locale: Locale) {
  return LOCALES[locale].dir;
}

/**
 * Resolve the human-readable label for a locale.
 * @param locale - Locale key.
 * @returns Display label for locale selectors.
 */
export function localeLabel(locale: Locale) {
  return LOCALES[locale].label;
}

/**
 * Build the locale base path for routing.
 * @param locale - Locale key.
 * @returns Empty string for default locale, otherwise a locale-prefixed path.
 */
export function localeBasePath(locale: Locale) {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

/**
 * Localized UI strings for navigation, labels, and feature descriptions.
 */
export const UI_STRINGS = {
  en: {
    docs: "Documentation",
    gettingStarted: "Getting Started",
    api: "API",
    benchmark: "Benchmark",
    playground: "Playground",
    navigation: "Navigation",
    close: "Close",
    menu: "Menu",
    docsGroups: "Docs groups",
    inThisGroup: "In this group",
    browseDocs: "Browse docs",
    onThisPage: "On this page",
    docSubtitle: "Documentation",
    notFoundTitle: "Page not found",
    notFoundBody: "The documentation page you are looking for does not exist.",
    backHome: "Back to home",
    langLabel: "Language",
    changelog: "Changelog",
    changelogNotTranslated:
      "This page is only available in English. Please switch to English to view the changelog.",
    missingTranslation: "This page is not yet translated. Showing English.",
    homeTitle: "Why Taffy?",
    homeSubtitle: "A quick overview of what makes Taffy Layout special.",
    entryPoints: "Entry points",
    whyTaffy: "Why Taffy",
    open: "Open",
    closeMenu: "Close menu",
    openMenu: "Open menu",
    builtWith: "Built with Rust & WASM",
    heroDescription:
      "A fast, flexible, and robust flexbox and grid layout engine for every platform.",
    flexboxGrid: "Flexbox and Grid layouts without a DOM.",
    fastDeterministic: "Fast, deterministic layout for custom renderers.",
    portableAPI: "Portable API built for real-world UI engines.",
    fullBenchmarkSuite: "Benchmark",
    run: "Run",
    stop: "Stop",
    scenario: "SCENARIO",
    buildPhase: "BUILD PHASE",
    layoutPhase: "LAYOUT PHASE",
    pending: "Pending",
    faster: "faster",
    slower: "slower",
    taffyPlayground: "Playground",
    presetFlexBetween: "Flex · Space Between",
    presetFlexBetweenDesc: "A row container distributing space between cards.",
    presetFlexCenter: "Flex · Center",
    presetFlexCenterDesc: "Items centered in the container.",
    presetFlexGrow: "Flex · Grow",
    presetFlexGrowDesc: "Items grow proportionally to fill the row.",
    presetFlexWrap: "Flex · Wrap",
    presetFlexWrapDesc: "Wrapping layout with align-content controls.",
    presetGridBasic: "Grid · Basic",
    presetGridBasicDesc: "Auto-placed grid tracks with fixed sizes.",
    presetGridSpans: "Grid · Spans",
    presetGridSpansDesc: "Mix spans to highlight grid placement.",
    themeToggle: "Toggle theme",
    themeSwitchToLight: "Switch to light mode",
    themeSwitchToDark: "Switch to dark mode",
    themeLightLabel: "Light mode",
    themeDarkLabel: "Dark mode",
    githubTooltip: "GitHub repository",
    languageTooltip: "Select language",
    languageMenuLabel: "Select language",
    searchDocs: "Search docs…",
    searchDocumentation: "Search documentation",
    searchTooltip: "Search documentation",
    searchPlaceholder: "Search documentation…",
    searchResults: "Search results",
    noResultsFound: "No results found for",

    /** Benchmark scenario labels. */
    nestedNodes: "Nested / {{count}} Nodes",
    flatNodes: "Flat / {{count}} Nodes",
    binaryNodes: "Binary / {{count}} Nodes",
    chainLevels: "Chain / {{count}} Levels",

    /** Entry point descriptions for the home page. */
    docsDesc: "Start with the guided overview and the full docs map.",
    apiDesc: "Typed API docs, enums, classes, and functions.",
    benchmarkDesc: "Run the full performance suite in the browser.",
    playgroundDesc: "Experiment with layouts and visualize results.",
    fullScreenEditor: "Full Screen Editor",
    console: "Console",
  },
  zh: {
    docs: "文档",
    gettingStarted: "快速开始",
    api: "API",
    benchmark: "基准测试",
    playground: "游乐场",
    navigation: "导航",
    close: "关闭",
    menu: "菜单",
    docsGroups: "文档分组",
    inThisGroup: "当前分组",
    browseDocs: "浏览文档",
    onThisPage: "本页导航",
    docSubtitle: "文档",
    notFoundTitle: "页面未找到",
    notFoundBody: "你访问的文档页面不存在。",
    backHome: "返回首页",
    langLabel: "语言",
    changelog: "更新日志",
    changelogNotTranslated:
      "此页面仅在英文版中提供。请切换到英文查看更新日志。",
    missingTranslation: "该页面暂无翻译，已显示英文版本。",
    homeTitle: "为什么选择 Taffy？",
    homeSubtitle: "快速了解 Taffy Layout 的优势。",
    entryPoints: "入口",
    whyTaffy: "为什么选 Taffy",
    open: "打开",
    closeMenu: "关闭菜单",
    openMenu: "打开菜单",
    builtWith: "使用 Rust 与 WASM 构建",
    heroDescription: "一个快速、灵活且健壮的跨平台弹性盒子与网格布局引擎。",
    flexboxGrid: "无需 DOM 的弹性盒子与网格布局。",
    fastDeterministic: "为自定义渲染器提供快速、确定性的布局。",
    portableAPI: "为真实世界 UI 引擎打造的便携 API。",
    fullBenchmarkSuite: "基准测试",
    run: "运行",
    stop: "停止",
    scenario: "场景",
    buildPhase: "构建阶段",
    layoutPhase: "布局阶段",
    pending: "等待中",
    faster: "倍更快",
    slower: "倍更慢",
    taffyPlayground: "游乐场",
    presetFlexBetween: "Flex · 两端对齐",
    presetFlexBetweenDesc: "在行容器中均匀分布空间。",
    presetFlexCenter: "Flex · 居中对齐",
    presetFlexCenterDesc: "项目在容器中居中对齐。",
    presetFlexGrow: "Flex · 增长",
    presetFlexGrowDesc: "项目按比例增长以填充行。",
    presetFlexWrap: "Flex · 换行",
    presetFlexWrapDesc: "带对齐内容控制的换行布局。",
    presetGridBasic: "Grid · 基础",
    presetGridBasicDesc: "固定大小的自动放置网格轨道。",
    presetGridSpans: "Grid · 跨度",
    presetGridSpansDesc: "混合跨度以突出网格放置。",
    themeToggle: "切换主题",
    themeSwitchToLight: "切换到浅色模式",
    themeSwitchToDark: "切换到深色模式",
    themeLightLabel: "浅色模式",
    themeDarkLabel: "深色模式",
    githubTooltip: "GitHub 仓库",
    languageTooltip: "切换语言",
    languageMenuLabel: "选择语言",
    searchDocs: "搜索文档…",
    searchDocumentation: "搜索文档",
    searchTooltip: "搜索文档",
    searchPlaceholder: "搜索文档…",
    searchResults: "搜索结果",
    noResultsFound: "未找到结果",

    /** Benchmark scenario labels. */
    nestedNodes: "嵌套 / {{count}} 节点",
    flatNodes: "扁平 / {{count}} 节点",
    binaryNodes: "二叉 / {{count}} 节点",
    chainLevels: "链式 / {{count}} 层",

    /** Entry point descriptions for the home page. */
    docsDesc: "从引导概述和完整文档地图开始。",
    apiDesc: "类型化的 API 文档、枚举、类和函数。",
    benchmarkDesc: "在浏览器中运行完整的性能测试套件。",
    playgroundDesc: "试验布局并可视化结果。",
    fullScreenEditor: "全屏编辑器",
    console: "控制台",
  },
  ja: {
    docs: "ドキュメント",
    gettingStarted: "はじめに",
    api: "API",
    benchmark: "ベンチマーク",
    playground: "プレイグラウンド",
    navigation: "ナビゲーション",
    close: "閉じる",
    menu: "メニュー",
    docsGroups: "ドキュメント分類",
    inThisGroup: "このグループ",
    browseDocs: "ドキュメントを見る",
    onThisPage: "このページ",
    docSubtitle: "ドキュメント",
    notFoundTitle: "ページが見つかりません",
    notFoundBody: "指定されたドキュメントページは存在しません。",
    backHome: "ホームへ戻る",
    langLabel: "言語",
    changelog: "変更ログ",
    changelogNotTranslated:
      "このページは英語版のみご利用いただけます。変更ログを表示するには英語版に切り替えてください。",
    missingTranslation:
      "このページの翻訳はまだありません。英語版を表示しています。",
    homeTitle: "なぜ Taffy？",
    homeSubtitle: "Taffy Layout の特長を簡潔に紹介します。",
    entryPoints: "エントリーポイント",
    whyTaffy: "なぜ Taffy か",
    open: "開く",
    closeMenu: "メニューを閉じる",
    openMenu: "メニューを開く",
    builtWith: "Rust と WASM で構築",
    heroDescription:
      "すべてのプラットフォーム向けの高速で柔軟かつ堅牢なフレックスボックス＆グリッドレイアウトエンジン。",
    flexboxGrid: "DOM なしでのフレックスボックスとグリッドレイアウト。",
    fastDeterministic: "カスタムレンダラー向けの高速で決定論的なレイアウト。",
    portableAPI: "実世界の UI エンジンのためのポータブル API。",
    fullBenchmarkSuite: "ベンチマーク",
    run: "実行",
    stop: "停止",
    scenario: "シナリオ",
    buildPhase: "ビルドフェーズ",
    layoutPhase: "レイアウトフェーズ",
    pending: "保留中",
    faster: "倍速い",
    slower: "倍遅い",
    taffyPlayground: "プレイグラウンド",
    presetFlexBetween: "Flex · 両端揃え",
    presetFlexBetweenDesc: "カード間にスペースを均等に配分する行コンテナ。",
    presetFlexCenter: "Flex · 中央揃え",
    presetFlexCenterDesc: "アイテムをコンテナの中央に配置します。",
    presetFlexGrow: "Flex · グロウ",
    presetFlexGrowDesc: "アイテムが行を埋めるように比例して成長します。",
    presetFlexWrap: "Flex · ラップ",
    presetFlexWrapDesc: "align-contentコントロール付きのラップレイアウト。",
    presetGridBasic: "Grid · 基本",
    presetGridBasicDesc: "固定サイズの自動配置グリッドトラック。",
    presetGridSpans: "Grid · スパン",
    presetGridSpansDesc: "グリッド配置を強調するためのミックススパン。",
    themeToggle: "テーマを切り替え",
    themeSwitchToLight: "ライトモードに切り替え",
    themeSwitchToDark: "ダークモードに切り替え",
    themeLightLabel: "ライトモード",
    themeDarkLabel: "ダークモード",
    githubTooltip: "GitHub リポジトリ",
    languageTooltip: "言語を切り替え",
    languageMenuLabel: "言語を選択",
    searchDocs: "ドキュメントを検索…",
    searchDocumentation: "ドキュメントを検索",
    searchTooltip: "ドキュメントを検索",
    searchPlaceholder: "ドキュメントを検索…",
    searchResults: "検索結果",
    noResultsFound: "結果が見つかりません",

    /** Benchmark scenario labels. */
    nestedNodes: "ネスト / {{count}} ノード",
    flatNodes: "フラット / {{count}} ノード",
    binaryNodes: "バイナリ / {{count}} ノード",
    chainLevels: "チェーン / {{count}} レベル",

    /** Entry point descriptions for the home page. */
    docsDesc: "ガイド付きの概要と完全なドキュメントマップから始めます。",
    apiDesc: "型付き API ドキュメント、列挙型、クラス、および関数。",
    benchmarkDesc: "ブラウザで完全なパフォーマンス スイートを実行します。",
    playgroundDesc: "レイアウトを試し、結果を視覚化します。",
    fullScreenEditor: "フルスクリーンエディタ",
    console: "コンソール",
  },
} as const;

/**
 * Resolved UI string bundle type for a locale.
 */
export type UiStrings = (typeof UI_STRINGS)[Locale];

/**
 * Resolve UI strings for the given locale, with English fallback.
 * @param locale - Locale key.
 * @returns Localized UI strings.
 */
export function getUi(locale: Locale): UiStrings {
  return UI_STRINGS[locale] || UI_STRINGS.en;
}

/**
 * Determine the current locale from the browser location.
 * @returns Detected locale or default locale when none is present.
 * @remarks Only available in client-side components.
 */
export function getCurrentLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const pathname = window.location.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const possibleLocale = segments[0];

  return isLocale(possibleLocale) ? possibleLocale : DEFAULT_LOCALE;
}
