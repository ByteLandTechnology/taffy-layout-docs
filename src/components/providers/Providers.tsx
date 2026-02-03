"use client";

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";

/**
 * Props for the application providers wrapper.
 */
interface ProvidersProps {
  /** Provider children to render. */
  children: React.ReactNode;
}

/**
 * Application-level providers for UI libraries.
 * @module components/providers/Providers
 * @param props - Provider wrapper props.
 * @returns Provider tree JSX.
 */
export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>;
}
