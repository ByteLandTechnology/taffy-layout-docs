/**
 * @module TabButton
 * @description A button component used for tab navigation in the LiveCode editor.
 */

"use client";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

/**
 * Tab button component.
 *
 * A styled button used to switch between different views (e.g., Code, Preview, Console).
 * It highlights when active and provides hover effects.
 *
 * @param props - Component properties.
 * @param props.active - Whether this tab is currently active.
 * @param props.onClick - Handler for click events.
 * @param props.label - Accessible label for the button.
 * @param props.icon - Icon element to display.
 * @returns A button element styled as a tab.
 */
export default function TabButton({
  active,
  onClick,
  label,
  icon,
}: TabButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
        active
          ? "bg-slate-900 text-white"
          : "text-slate-600 hover:bg-slate-200/60"
      }`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}
