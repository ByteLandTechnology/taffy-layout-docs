"use client";

import { forwardRef } from "react";
import { Menu, X } from "lucide-react";
import type { MenuButtonProps } from "../types";

/**
 * Mobile menu toggle button with open/close icon state.
 * @module components/layouts/SiteHeader/parts/MenuButton
 * @param props - Button props including open state and aria label.
 * @param ref - Forwarded ref for focus management.
 * @returns Menu toggle button JSX.
 */
export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ isOpen, onClick, ariaLabel }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        onClick={onClick}
        className="focus:ring-primary rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-2 focus:outline-none focus:ring-inset dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={ariaLabel}
      >
        {isOpen ? (
          <X size={24} aria-hidden="true" />
        ) : (
          <Menu size={24} aria-hidden="true" />
        )}
      </button>
    );
  },
);

MenuButton.displayName = "MenuButton";
