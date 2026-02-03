/**
 * @module app/layout
 * @description Root layout component for the Taffy Layout documentation site.
 * Provides the global HTML structure, fonts, theme provider, and error boundary.
 */

import type { ReactNode } from "react";
import { Exo_2, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Providers } from "@/components/providers/Providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Metadata } from "next";

/**
 * Exo 2 font configuration.
 */
const exo = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo",
  display: "swap",
});

/**
 * JetBrains Mono font configuration.
 */
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  /**
   * Base URL for metadata resolution.
   */
  metadataBase: new URL("https://taffylayout.com"),
  /**
   * Default title and template.
   */
  title: {
    default: "Taffy Layout",
    template: "%s | Taffy Layout",
  },
  /**
   * Default application description.
   */
  description:
    "A high performance, flexible, and robust flexbox and grid layout engine for every platform.",
  /**
   * SEO Keywords.
   */
  keywords: [
    "layout",
    "flexbox",
    "grid",
    "rust",
    "wasm",
    "ui",
    "taffy",
    "css",
    "browser",
    "server",
  ],
  authors: [{ name: "Taffy Contributors" }],
  openGraph: {
    title: "Taffy Layout",
    description: "High performance flexbox and grid layout engine",
    url: "https://taffylayout.com",
    siteName: "Taffy Layout",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Taffy Layout",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taffy Layout",
    description: "High performance flexbox and grid layout engine",
    images: ["/favicon.png"],
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: "/favicon.png",
  },
  alternates: {
    canonical: "./",
    languages: {
      "en-US": "/",
      "zh-CN": "/zh",
      "ja-JP": "/ja",
    },
  },
};

/**
 * Props for the RootLayout component.
 * @property children - The child components to render within the layout.
 */
interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Root layout component that wraps all pages.
 * @param props - The component props.
 * @param props.children - Child components to render.
 * @returns The root HTML layout with providers and theme support.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      className={`${exo.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head></head>
      <body className="min-h-screen antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider
          defaultTheme="system"
          enableSystem
          storageKey="taffy-theme"
        >
          <Providers>
            <ErrorBoundary>
              <div id="main-content">{children}</div>
            </ErrorBoundary>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
