"use client";

import { useRef, useState } from "react";
import { CRM_COLUMNS, type CrmColumn } from "@/lib/crm/types";
import { DEFAULT_VISIBLE_COLUMNS } from "@/lib/crm/fields";
import { useLocalStorageState, useDismiss } from "./hooks";

const STORAGE_KEY = "rtg-crm-columns-v2";

/** Persisted, ordered list of visible columns. Sanitized against the real
 * CRM_COLUMNS every read, so a future column rename in lib/crm/types.ts
 * can't leave a stale, unrenderable name stuck in someone's browser. */
export function useVisibleColumns(): [CrmColumn[], (next: CrmColumn[]) => void] {
  const [stored, setStored] = useLocalStorageState<CrmColumn[]>(STORAGE_KEY, DEFAULT_VISIBLE_COLUMNS);
  const clean = stored.filter((c, i) => CRM_COLUMNS.includes(c) && stored.indexOf(c) === i);
  return [clean.length > 0 ? clean : DEFAULT_VISIBLE_COLUMNS, setStored];
}

export function ColumnsMenu({ visible, onChange }: { visible: CrmColumn[]; onChange: (next: CrmColumn[]) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss([ref], () => setOpen(false), open);

  const hidden = CRM_COLUMNS.filter((c) => !visible.includes(c));

  function move(index: number, dir: -1 | 1) {
    const next = [...visible];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }
  function hide(column: CrmColumn) {
    if (visible.length <= 1) return; // always keep at least one column
    onChange(visible.filter((c) => c !== column));
  }
  function show(column: CrmColumn) {
    onChange([...visible, column]);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-9 items-center gap-1.5 rounded-[3px] border border-line px-3 text-sm text-ink transition-colors hover:border-accent"
      >
        Kolonlar
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-[70vh] w-72 overflow-y-auto rounded-[3px] border border-line bg-paper p-3 shadow-lg">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Görünür</p>
          <ul className="mt-1.5 flex flex-col gap-0.5">
            {visible.map((column, i) => (
              <li key={column} className="flex items-center gap-1 rounded-[3px] px-1.5 py-1 hover:bg-paper-raised">
                <span className="flex-1 truncate text-sm text-ink">{column}</span>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`${column} sola/yukarı taşı`} className="rounded p-1 text-muted hover:text-ink disabled:opacity-30">
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === visible.length - 1}
                  aria-label={`${column} sağa/aşağı taşı`}
                  className="rounded p-1 text-muted hover:text-ink disabled:opacity-30"
                >
                  ↓
                </button>
                <button type="button" onClick={() => hide(column)} aria-label={`${column} kolonunu gizle`} className="rounded p-1 text-muted hover:text-danger">
                  ✕
                </button>
              </li>
            ))}
          </ul>
          {hidden.length > 0 ? (
            <>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Gizli</p>
              <ul className="mt-1.5 flex flex-col gap-0.5">
                {hidden.map((column) => (
                  <li key={column} className="flex items-center gap-2 rounded-[3px] px-1.5 py-1 hover:bg-paper-raised">
                    <span className="flex-1 truncate text-sm text-muted">{column}</span>
                    <button type="button" onClick={() => show(column)} className="rounded p-1 text-xs text-accent hover:underline">
                      Göster
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <button
            type="button"
            onClick={() => onChange(DEFAULT_VISIBLE_COLUMNS)}
            className="mt-3 w-full rounded-[3px] border border-line py-1.5 text-xs text-muted hover:border-accent hover:text-ink"
          >
            Varsayılana dön
          </button>
        </div>
      ) : null}
    </div>
  );
}
