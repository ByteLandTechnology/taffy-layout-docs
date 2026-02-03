import { type HomePageProps } from "./types";
import { HeroSection } from "./HeroSection";
import { EntryPoints } from "./EntryPoints";
import { FeaturesGrid } from "./FeaturesGrid";

/**
 * Home page layout.
 * Composes the Hero section, entry points, and feature grid.
 * @module features/home/components/HomePage
 * @param props - Home page content and localization props.
 * @returns The rendered Home page.
 */
export default function HomePage({
  hero,
  features,
  ui,
  locale,
}: HomePageProps) {
  const highlights = [ui.flexboxGrid, ui.fastDeterministic, ui.portableAPI];

  return (
    <main className="relative">
      <div className="fixed inset-0 -z-30 bg-slate-50"></div>
      <div className="bg-grid fixed inset-0 -z-20 opacity-40"></div>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-rgb-blue/5 animate-blob inter-font absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full blur-[120px]"></div>
        <div className="bg-rgb-green/5 animate-blob absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full blur-[120px] [animation-delay:2s]"></div>
        <div className="bg-rgb-red/5 animate-blob absolute bottom-[-10%] left-[20%] h-[500px] w-[500px] rounded-full blur-[120px] [animation-delay:4s]"></div>
      </div>

      <HeroSection hero={hero} ui={ui} highlights={highlights} />
      <EntryPoints ui={ui} locale={locale} />
      <FeaturesGrid features={features} ui={ui} />
    </main>
  );
}
