"use client";

import { useEffect, useRef, useState } from "react";
import { NavLink } from "@/components/layout/NavLink";
import { cn } from "@/lib/cn";

/**
 * The header's "More" dropdown. Opens on click/tap (state-driven, so it
 * works on iPad Safari, which does not focus a button when it is tapped)
 * and, for mouse users, also on hover. Escape or an outside tap closes it.
 */
export function MoreMenu({
  label,
  navLabel,
  links,
}: {
  label: string;
  navLabel: string;
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={ref} className="group relative">
      <button
        ref={toggleRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 py-2 text-sm font-medium text-ink transition-colors hover:text-accent active:opacity-60"
      >
        {label}
        <svg
          width="9"
          height="6"
          viewBox="0 0 9 6"
          fill="none"
          aria-hidden="true"
          className={cn("mt-px transition-transform duration-150", open && "rotate-180")}
        >
          <path d="M1 1L4.5 5L8 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* The pt-2 strip is part of the hover area, so the menu doesn't close while the pointer crosses the gap. */}
      <div
        className={cn(
          "absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-2 transition-all duration-150",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
        )}
      >
        <nav className="flex flex-col rounded-[3px] border border-line bg-paper p-2 shadow-lg" aria-label={navLabel}>
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              underline={false}
              className="rounded-[3px] px-3 py-3 hover:bg-paper-raised"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
