"use client";

import { Button, Tooltip } from "@heroui/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useCallback, useState } from "react";
import type { ThemeToggleProps } from "@/types/theme";

/**
 * Theme toggle button with animated sun/moon icons.
 * @module components/ThemeToggle
 * @param props - Theme toggle configuration and label props.
 * @returns Theme toggle button JSX.
 */
export function ThemeToggle({
  label = "Toggle theme",
  tooltipLight = "Switch to light mode",
  tooltipDark = "Switch to dark mode",
  labelLight = "Light mode",
  labelDark = "Dark mode",
  variant = "light",
  size = "md",
}: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = useCallback(() => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 500);
  }, [toggleTheme]);

  /**
   * Render a placeholder to avoid hydration mismatches before mounting.
   */
  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant={variant}
        radius="full"
        size={size}
        isDisabled
        aria-label={label}
        className="opacity-50"
      >
        <div className="h-5 w-5 rounded-full bg-current opacity-20" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Tooltip
      content={isDark ? tooltipLight : tooltipDark}
      className="dark:text-slate-100"
    >
      <Button
        isIconOnly
        variant={variant}
        radius="full"
        size={size}
        onPress={handleToggle}
        aria-label={label}
        className={`relative overflow-hidden ${
          isDark
            ? "bg-slate-800 text-purple-400 hover:bg-slate-700"
            : "bg-white/80 text-amber-500 hover:bg-slate-50"
        } ease-spring transition-all duration-300`}
      >
        <span className="sr-only">{isDark ? labelDark : labelLight}</span>

        <Sun
          size={20}
          aria-hidden="true"
          className={`ease-spring absolute inset-0 m-auto transition-all duration-500 ${
            isDark
              ? "scale-0 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          } ${isAnimating && !isDark ? "animate-theme-toggle" : ""} `}
        />

        <Moon
          size={20}
          aria-hidden="true"
          className={`ease-spring absolute inset-0 m-auto transition-all duration-500 ${
            isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 -rotate-90 opacity-0"
          } ${isAnimating && isDark ? "animate-theme-toggle" : ""} `}
        />
      </Button>
    </Tooltip>
  );
}
