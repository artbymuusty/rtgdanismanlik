"use client";

import { useEffect, useMemo, useState } from "react";
import { BUILTIN_VIEWS } from "@/lib/crm/views";
import type { CrmQuery } from "@/lib/crm/types";
import { useDismiss, useFocusTrap } from "./hooks";

type QuickQuery = Pick<CrmQuery, "search" | "filters" | "dateFilter">;

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
}

/**
 * ⌘K / Ctrl+K command menu — a fast, keyboard-first way to jump to a
 * saved view, refresh, or open a new lead without reaching for the mouse.
 * Deliberately small: it wraps EXISTING actions (views, refresh, new
 * lead, search focus) rather than inventing new CRM behavior — this is a
 * shortcut layer, not a second way to run commands the rest of the UI
 * doesn't also expose.
 */
export function CommandPalette({
  open,
  onClose,
  onApplyView,
  onRefresh,
  onNewLead,
  onFocusSearch,
}: {
  open: boolean;
  onClose: () => void;
  onApplyView: (query: QuickQuery) => void;
  onRefresh: () => void;
  onNewLead: () => void;
  onFocusSearch: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useFocusTrap<HTMLDivElement>(open);
  useDismiss([dialogRef], onClose, open);

  const items: CommandItem[] = useMemo(() => {
    const viewItems: CommandItem[] = BUILTIN_VIEWS.map((v) => ({
      id: `view-${v.id}`,
      label: v.label,
      hint: "Görünüm",
      run: () => onApplyView({ search: "", filters: v.filters, dateFilter: undefined }),
    }));
    return [
      { id: "search", label: "Lead ara", hint: "/", run: onFocusSearch },
      ...viewItems,
      { id: "refresh", label: "CRM yenile", hint: "Yenile", run: onRefresh },
      { id: "new-lead", label: "Yeni lead", hint: "+ Yeni Lead", run: onNewLead },
    ];
  }, [onApplyView, onFocusSearch, onRefresh, onNewLead]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return items;
    return items.filter((i) => i.label.toLocaleLowerCase("tr").includes(q));
  }, [items, query]);

  // Reset to a clean slate every time the palette opens — adjusted during
  // render (not an effect) since this only needs to happen when `open`'s
  // own value changes, exactly the documented pattern for this.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }
  // Keep the highlighted row in range as filtering narrows the list.
  const [lastFilteredLength, setLastFilteredLength] = useState(filtered.length);
  if (filtered.length !== lastFilteredLength) {
    setLastFilteredLength(filtered.length);
    if (activeIndex >= filtered.length) setActiveIndex(Math.max(0, filtered.length - 1));
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[activeIndex];
        if (item) {
          item.run();
          onClose();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIndex, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/30 px-4 pt-[12vh] motion-safe:animate-[crm-fade-in_120ms_ease-out]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Komut menüsü"
        className="w-full max-w-lg overflow-hidden rounded-[3px] border border-line bg-paper shadow-2xl outline-none motion-safe:animate-[crm-scale-in_120ms_ease-out]"
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Bir komut ara… (görünüm, yenile, yeni lead)"
          aria-label="Komut ara"
          role="combobox"
          aria-expanded="true"
          aria-controls="crm-command-list"
          className="w-full border-b border-line bg-paper px-4 py-3.5 text-sm text-ink outline-none placeholder:text-muted"
        />
        <ul id="crm-command-list" role="listbox" aria-label="Komutlar" className="max-h-80 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted">Eşleşen komut yok.</li>
          ) : (
            filtered.map((item, i) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    item.run();
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between rounded-[3px] px-3 py-2.5 text-left text-sm ${
                    i === activeIndex ? "bg-accent text-accent-ink" : "text-ink hover:bg-paper-raised"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.hint ? (
                    <span className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.06em] ${i === activeIndex ? "text-accent-ink/70" : "text-muted"}`}>
                      {item.hint}
                    </span>
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="flex items-center gap-3 border-t border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
          <span>↑↓ gezin</span>
          <span>↵ seç</span>
          <span>esc kapat</span>
        </div>
      </div>
    </div>
  );
}
