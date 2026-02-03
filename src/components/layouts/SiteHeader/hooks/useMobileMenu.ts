"use client";

import { useState, useCallback, useEffect, type RefObject } from "react";

/**
 * Options for the mobile menu focus and event handling hook.
 */
interface UseMobileMenuOptions {
  /** Ref to the menu container element. */
  menuRef: RefObject<HTMLElement | null>;
  /** Ref to the menu toggle button element. */
  menuButtonRef: RefObject<HTMLElement | null>;
  /** Ref to the first link in the mobile menu for focus management. */
  firstLinkRef: RefObject<HTMLElement | null>;
}

/**
 * Manage mobile menu open state, focus trapping, and escape handling.
 * @module components/layouts/SiteHeader/hooks/useMobileMenu
 * @param options - Refs for the menu container, trigger button, and first link.
 * @returns Mobile menu state and action handlers.
 */
export function useMobileMenu({
  menuRef,
  menuButtonRef,
  firstLinkRef,
}: UseMobileMenuOptions) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  /**
   * Close the menu when the Escape key is pressed.
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        close();
        menuButtonRef.current?.focus();
      }
    },
    [isOpen, close, menuButtonRef],
  );

  /**
   * Trap focus within the menu while it is open.
   */
  const handleMenuKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    },
    [menuRef],
  );

  /**
   * Sync event listeners and focus changes with open state.
   */
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => firstLinkRef.current?.focus(), 100);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown, firstLinkRef]);

  return {
    isOpen,
    open,
    close,
    toggle,
    handleMenuKeyDown,
  };
}
