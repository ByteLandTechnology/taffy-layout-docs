"use client";

import TopNav from "@/features/docs/components/TopNav";
import Search from "@/features/docs/components/Search";
import { Logo } from "./parts/Logo";
import type { DesktopHeaderProps } from "./types";

/**
 * Desktop header layout with logo, search, and top navigation.
 * @module components/layouts/SiteHeader/DesktopHeader
 * @param props - Desktop header props including locale and navigation data.
 * @returns Desktop header JSX.
 */
export function DesktopHeader({
  locale,
  navGroups,
  activeGroup,
  ui,
  basePath,
}: DesktopHeaderProps) {
  return (
    <div className="hidden w-full items-center justify-between md:flex">
      <Logo locale={locale} basePath={basePath} />
      <div className="flex items-center gap-4">
        <Search />
        <TopNav groups={navGroups} activeGroup={activeGroup} ui={ui} />
      </div>
    </div>
  );
}
