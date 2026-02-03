/**
 * Site footer with copyright notice.
 * @module components/layouts/SiteFooter
 * @returns Footer JSX.
 */

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8 dark:text-slate-400">
        <p>© {new Date().getFullYear()} ByteLand Technology Limited</p>
      </div>
    </footer>
  );
}
