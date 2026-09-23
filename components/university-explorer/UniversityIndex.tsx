"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GermanUniversity } from "@/data/german-universities";

/**
 * The "browse all 28" panel — progressive disclosure: hidden by default,
 * a plain searchable list once opened. Clicking a row jumps the carousel
 * to that university and closes the panel. Escape/backdrop-click close it;
 * focus moves into the search field on open and returns to whatever
 * opened it on close.
 */
export function UniversityIndex({
  open,
  onClose,
  onSelect,
  universities,
  currentIndex,
  title,
  searchPlaceholder,
  searchAriaLabel,
  emptyState,
  closeLabel,
  rankLabel,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (index: number) => void;
  universities: GermanUniversity[];
  currentIndex: number;
  title: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
  emptyState: string;
  closeLabel: string;
  rankLabel: string;
}) {
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    searchRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const container = panelRef.current;
      if (!container) return;
      const focusable = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return universities.map((u, i) => ({ u, i }));
    return universities.map((u, i) => ({ u, i })).filter(({ u }) => u.name.toLocaleLowerCase("tr").includes(q) || u.city.toLocaleLowerCase("tr").includes(q));
  }, [universities, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[8vh] pb-8 motion-safe:animate-[uni-fade-in_150ms_ease-out]" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-[3px] border border-line bg-paper shadow-2xl outline-none motion-safe:animate-[uni-scale-in_180ms_ease-out]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
          <button type="button" onClick={onClose} aria-label={closeLabel} className="rounded-[3px] border border-line px-3 py-1.5 text-sm text-ink hover:border-accent">
            {closeLabel}
          </button>
        </div>
        <div className="border-b border-line px-5 py-3">
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchAriaLabel}
            className="w-full rounded-[3px] border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus-visible:border-accent"
          />
        </div>
        <ul className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-muted">{emptyState}</li>
          ) : (
            filtered.map(({ u, i }) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-current={i === currentIndex ? "true" : undefined}
                  className={
                    "flex w-full items-center justify-between gap-3 rounded-[3px] px-3 py-2.5 text-left text-sm transition-colors " +
                    (i === currentIndex ? "bg-accent text-accent-ink" : "text-ink hover:bg-paper-raised")
                  }
                >
                  <span className="min-w-0 truncate">
                    <span className="truncate font-medium">{u.name}</span>
                    <span className={"ml-1.5 " + (i === currentIndex ? "text-accent-ink/70" : "text-muted")}>· {u.city}</span>
                  </span>
                  <span className={"shrink-0 font-mono text-xs " + (i === currentIndex ? "text-accent-ink/70" : "text-muted")}>
                    {rankLabel} #{u.qsRank}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
