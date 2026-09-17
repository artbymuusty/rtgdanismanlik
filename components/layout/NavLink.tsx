"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Shared nav link for Header + MobileMenu: real aria-current="page" on the
 * active route (not just a color change) and one consistent hover/focus
 * language across both — default/hover/active states, no pills or boxes.
 */
export function NavLink({
  href,
  children,
  className,
  onClick,
  underline = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  /** Thin underline-reveal on hover — the horizontal top-level nav's
   * language. Dropdown/menu list items use a background highlight
   * instead (set false) so hover states don't stack into noise. */
  underline?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-sm font-medium transition-colors hover:text-accent active:opacity-60",
        underline && "underline-offset-4 hover:underline",
        isActive ? "text-accent" : "text-ink",
        className,
      )}
    >
      {children}
    </Link>
  );
}
