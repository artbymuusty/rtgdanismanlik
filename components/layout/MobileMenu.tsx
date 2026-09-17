"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { NavLink } from "@/components/layout/NavLink";
import { cn } from "@/lib/cn";

interface NavLinkItem {
  href: string;
  label: string;
}

export function MobileMenu({
  primaryLinks,
  moreLinks,
  ctaLabel,
}: {
  primaryLinks: NavLinkItem[];
  moreLinks: NavLinkItem[];
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Standard disclosure-pattern behavior: Escape and outside clicks close
  // the menu, and Escape returns focus to the toggle so keyboard users
  // never lose their place.
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-[3px] border border-line px-3 text-sm transition-all duration-150 hover:border-accent active:scale-[0.96] motion-reduce:active:scale-100"
      >
        {open ? "Kapat" : "Menü"}
      </button>

      <div
        className={cn(
          "absolute right-0 top-full mt-2 w-72 origin-top-right rounded-[3px] border border-line bg-paper shadow-lg transition-all duration-200 ease-out",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <nav className="flex flex-col p-2" aria-label="Mobil menü">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              underline={false}
              className="rounded-[3px] px-3 py-2.5 hover:bg-paper-raised"
            >
              {link.label}
            </NavLink>
          ))}
          {moreLinks.length > 0 ? <div className="my-1 border-t border-line" /> : null}
          {moreLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              underline={false}
              className="rounded-[3px] px-3 py-2.5 hover:bg-paper-raised"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-2 pt-0">
          <Button href="/basvuru" className="w-full !py-3">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
