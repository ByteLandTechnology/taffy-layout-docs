"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  DEFAULT_LOCALE,
  localeLabel,
  localeList,
  type Locale,
} from "@/lib/locales";
import { Globe } from "lucide-react";

/**
 * Props for the locale switcher dropdown.
 */
interface LocaleSwitcherProps {
  /** Accessible label for the switcher button. */
  label: string;
  /** Optional tooltip text for the switcher button. */
  tooltip?: string;
  /** Optional label for the dropdown menu. */
  menuLabel?: string;
}

/**
 * Locale selector dropdown for switching documentation languages.
 * @module components/LocaleSwitcher
 * @param props - Locale switcher configuration and labels.
 * @returns Locale switcher JSX.
 */
export default function LocaleSwitcher({
  label,
  tooltip,
  menuLabel,
}: LocaleSwitcherProps) {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/").filter(Boolean);
  const possibleLocale = segments[0];
  const currentLocale = localeList.includes(possibleLocale as Locale)
    ? (possibleLocale as Locale)
    : DEFAULT_LOCALE;
  const rest = currentLocale === DEFAULT_LOCALE ? segments : segments.slice(1);

  return (
    <Dropdown placement="bottom-end" shadow="lg" className="min-w-[120px]">
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          radius="full"
          aria-label={label}
          title={tooltip || label}
          className="bg-white/80 dark:bg-slate-800/80"
        >
          <Globe className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={menuLabel || "Select language"}
        selectedKeys={[currentLocale]}
        selectionMode="single"
        variant="flat"
        className="p-1"
      >
        {localeList.map((locale) => {
          const isActive = locale === currentLocale;
          const target = (() => {
            if (!rest.length)
              return locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
            const suffix = rest.join("/");
            return locale === DEFAULT_LOCALE
              ? `/${suffix}`
              : `/${locale}/${suffix}`;
          })();

          return (
            <DropdownItem
              key={locale}
              as={NextLink}
              href={target}
              className={`rounded-xl px-3 py-1.5 ${isActive ? "text-primary" : "text-slate-600 dark:text-slate-400"}`}
            >
              {localeLabel(locale)}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
}
