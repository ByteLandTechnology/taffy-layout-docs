/**
 * @module TopNav
 * @description Top navigation bar component for documentation site.
 * Provides navigation groups, GitHub link, theme toggle, and locale switcher.
 */

"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { UiStrings } from "@/lib/locales";
import { BookOpen, Code2, FlaskConical, Gauge, Github } from "lucide-react";
import { Tooltip } from "@heroui/react";

/**
 * Navigation group configuration
 */
interface NavGroup {
  /** Unique identifier for the group */
  key: string;
  /** Display title for the group */
  title: string;
  /** URL path for the group */
  href: string;
}

/**
 * Props for the TopNav component
 */
interface TopNavProps {
  /** Array of navigation groups to display */
  groups: NavGroup[];
  /** Currently active group key */
  activeGroup?: string;
  /** UI strings for localization */
  ui: UiStrings;
}

/**
 * Top navigation bar component
 * @param props - Component properties
 * @returns Navigation bar with groups, theme toggle, and locale switcher
 */
export default function TopNav({ groups, activeGroup, ui }: TopNavProps) {
  const groupIcons: Record<string, ReactElement> = {
    docs: <BookOpen size={18} />,
    api: <Code2 size={18} />,
    benchmark: <Gauge size={18} />,
    playground: <FlaskConical size={18} />,
  };

  return (
    <>
      {/* Desktop navigation */}
      <div className="hidden items-center gap-2 md:flex">
        {groups.map((group) => (
          <Tooltip
            key={group.key}
            content={group.title}
            className="dark:text-slate-100"
          >
            <Link
              href={group.href}
              aria-label={group.title}
              title={group.title}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                group.key === activeGroup
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              }`}
            >
              {groupIcons[group.key] ?? <BookOpen size={18} />}
              <span className="sr-only">{group.title}</span>
            </Link>
          </Tooltip>
        ))}
        {groups.length ? (
          <span className="mx-1 h-5 w-px self-center bg-slate-200" />
        ) : null}
        <Tooltip content={ui.githubTooltip} className="dark:text-slate-100">
          <a
            href="https://github.com/ByteLandTechnology/taffy-layout"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <Github size={20} />
          </a>
        </Tooltip>

        <ThemeToggle
          label={ui.themeToggle}
          tooltipLight={ui.themeSwitchToLight}
          tooltipDark={ui.themeSwitchToDark}
          labelLight={ui.themeLightLabel}
          labelDark={ui.themeDarkLabel}
        />
      </div>

      {/* Mobile navigation */}
      <div className="flex items-center gap-3">
        <LocaleSwitcher
          label={ui.langLabel}
          tooltip={ui.languageTooltip}
          menuLabel={ui.languageMenuLabel}
        />

        <div className="md:hidden">
          <ThemeToggle
            label={ui.themeToggle}
            tooltipLight={ui.themeSwitchToLight}
            tooltipDark={ui.themeSwitchToDark}
            labelLight={ui.themeLightLabel}
            labelDark={ui.themeDarkLabel}
            size="sm"
            variant="light"
          />
        </div>
      </div>
    </>
  );
}
