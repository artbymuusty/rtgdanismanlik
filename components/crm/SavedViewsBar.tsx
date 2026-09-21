"use client";

import { useState } from "react";
import { BUILTIN_VIEWS, type CustomView } from "@/lib/crm/views";
import type { CrmQuery } from "@/lib/crm/types";
import { useLocalStorageState } from "./hooks";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "rtg-crm-custom-views-v1";

function sameQuery(a: Pick<CrmQuery, "search" | "filters" | "dateFilter">, b: Pick<CrmQuery, "search" | "filters" | "dateFilter">): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function SavedViewsBar({
  query,
  onApply,
}: {
  query: Pick<CrmQuery, "search" | "filters" | "dateFilter">;
  onApply: (query: Pick<CrmQuery, "search" | "filters" | "dateFilter">) => void;
}) {
  const [customViews, setCustomViews] = useLocalStorageState<CustomView[]>(STORAGE_KEY, []);
  const [naming, setNaming] = useState(false);
  const [draftName, setDraftName] = useState("");

  const hasAnyFilter = query.search.trim() !== "" || Object.values(query.filters).some((v) => v && v.length > 0) || Boolean(query.dateFilter);

  function saveCurrent() {
    const label = draftName.trim();
    if (!label) return;
    setCustomViews((prev) => [...prev, { id: `custom-${Date.now()}`, label, query }]);
    setDraftName("");
    setNaming(false);
  }
  function removeCustom(id: string) {
    setCustomViews((prev) => prev.filter((v) => v.id !== id));
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-line bg-paper-raised/60 px-4 py-2">
      {BUILTIN_VIEWS.map((view) => {
        const viewQuery = { search: "", filters: view.filters, dateFilter: undefined };
        const active = sameQuery(query, viewQuery);
        return (
          <button
            key={view.id}
            type="button"
            onClick={() => onApply(viewQuery)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              active ? "border-accent bg-accent text-accent-ink" : "border-line text-ink hover:border-accent",
            )}
          >
            {view.label}
          </button>
        );
      })}

      {customViews.length > 0 ? <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" /> : null}
      {customViews.map((view) => {
        const active = sameQuery(query, view.query);
        return (
          <span
            key={view.id}
            className={cn(
              "flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
              active ? "border-gold bg-gold/10 text-gold" : "border-line text-ink",
            )}
          >
            <button type="button" onClick={() => onApply(view.query)} className="max-w-[10rem] truncate">
              {view.label}
            </button>
            <button type="button" onClick={() => removeCustom(view.id)} aria-label={`${view.label} görünümünü sil`} className="text-muted hover:text-danger">
              ✕
            </button>
          </span>
        );
      })}

      <span className="ml-auto" />
      {naming ? (
        <div className="flex items-center gap-1">
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveCurrent();
              if (e.key === "Escape") setNaming(false);
            }}
            placeholder="Görünüm adı"
            className="w-40 rounded-[3px] border border-line bg-paper px-2 py-1 text-xs text-ink outline-none focus-visible:border-accent"
          />
          <button type="button" onClick={saveCurrent} className="rounded-[3px] bg-accent px-2 py-1 text-xs text-accent-ink">
            Kaydet
          </button>
          <button type="button" onClick={() => setNaming(false)} className="rounded-[3px] px-2 py-1 text-xs text-muted">
            Vazgeç
          </button>
        </div>
      ) : hasAnyFilter ? (
        <button type="button" onClick={() => setNaming(true)} className="text-xs text-accent hover:underline">
          Görünümü kaydet
        </button>
      ) : null}
    </div>
  );
}
