"use client";

import { useRef } from "react";
import { Logo } from "./parts/Logo";
import { MenuButton } from "./parts/MenuButton";
import { MobileMenu } from "./parts/MobileMenu";
import Search from "@/features/docs/components/Search";
import { useMobileMenu } from "./hooks/useMobileMenu";
import type { MobileHeaderProps } from "./types";

/**
 * Mobile header layout with search and a collapsible menu.
 * @module components/layouts/SiteHeader/MobileHeader
 * @param props - Mobile header props including locale and navigation data.
 * @returns Mobile header JSX.
 */
export function MobileHeader({
  locale,
  navGroups,
  activeGroup,
  ui,
  basePath,
}: MobileHeaderProps) {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const { isOpen, toggle, close } = useMobileMenu({
    menuRef,
    menuButtonRef,
    firstLinkRef,
  });

  return (
    <div className="flex w-full items-center justify-between md:hidden">
      <Logo locale={locale} basePath={basePath} />
      <div className="flex items-center gap-2">
        <Search />
        <MenuButton
          ref={menuButtonRef}
          isOpen={isOpen}
          onClick={toggle}
          ariaLabel={
            isOpen
              ? (ui.closeMenu ?? "Close menu")
              : (ui.openMenu ?? "Open menu")
          }
        />
      </div>
      {isOpen && (
        <MobileMenu
          ref={menuRef}
          navGroups={navGroups}
          activeGroup={activeGroup}
          ui={ui}
          firstLinkRef={firstLinkRef}
          onClose={close}
        />
      )}
    </div>
  );
}
