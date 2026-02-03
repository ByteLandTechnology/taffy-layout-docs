"use client";

import NextLink from "next/link";
import Image from "next/image";
import type { LogoProps } from "../types";

/**
 * Site logo linking to the locale root.
 * @module components/layouts/SiteHeader/parts/Logo
 * @param props - Logo props including locale base path.
 * @returns Logo link JSX.
 */
export function Logo({ basePath }: LogoProps) {
  return (
    <NextLink
      href={basePath || "/"}
      className="group flex items-center gap-3 pr-4 transition-opacity hover:opacity-90"
    >
      <div className="h-10 w-10 shrink-0">
        <Image
          src="/images/taffy.svg"
          alt="Taffy Layout Logo"
          width={40}
          height={40}
          className="h-full w-full"
        />
      </div>
      <div className="hidden sm:block">
        <span className="text-gradient-tri block pb-1 text-xl leading-tight font-black tracking-tight">
          Taffy Layout
        </span>
      </div>
    </NextLink>
  );
}
