"use client";

import { useMemo, useRef, useState } from "react";
import { FIELDS, GROUP_LABELS, enumLabel } from "@/lib/crm/fields";
import { CRM_STATUSES, type CrmColumn, type CrmQuery, type DateRangeFilter } from "@/lib/crm/types";
import { useDismiss } from "./hooks";
import { StatusBadge } from "./StatusSelect";
import { cn } from "@/lib/cn";

function isoToday(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const DATE_PRESETS: { label: string; range: () => DateRangeFilter }[] = [
  { label: "Bugün", range: () => ({ from: isoToday(), to: isoToday() }) },
  { label: "Son 7 gün", range: () => ({ from: isoToday(-6), to: isoToday() }) },
  { label: "Son 30 gün", range: () => ({ from: isoToday(-29), to: isoToday() }) },
];

export function activeFilterCount(query: Pick<CrmQuery, "filters" | "dateFilter">): number {
  let n = Object.values(query.filters).filter((v) => v && v.length > 0).length;
  if (query.dateFilter?.from || query.dateFilter?.to) n++;
  return n;
}

export function FilterPanel({
  filters,
  dateFilter,
  facets,
  team,
  onFiltersChange,
  onDateFilterChange,
  onClearAll,
}: {
  filters: CrmQuery["filters"];
  dateFilter: DateRangeFilter | undefined;
  facets: Partial<Record<CrmColumn, string[]>>;
  team: string[];
  onFiltersChange: (next: CrmQuery["filters"]) => void;
  onDateFilterChange: (next: DateRangeFilter | undefined) => void;
  onClearAll: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss([ref], () => setOpen(false), open);

  const filterFields = useMemo(() => FIELDS.filter((f) => f.filterable && f.column !== "Başvuru Tarihi"), []);
  const count = activeFilterCount({ filters, dateFilter });

  function toggle(column: CrmColumn, value: string) {
    const current = filters[column] ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onFiltersChange({ ...filters, [column]: next.length > 0 ? next : undefined });
  }

  function optionsFor(column: CrmColumn): string[] {
    if (column === "Durum") return [...CRM_STATUSES];
    if (column === "Sorumlu") return team.length > 0 ? team : (facets["Sorumlu"] ?? []);
    return facets[column] ?? [];
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-[3px] border px-3 text-sm transition-colors",
          count > 0 ? "border-accent text-accent" : "border-line text-ink hover:border-accent",
        )}
      >
        Filtrele
        {count > 0 ? <span className="rounded-full bg-accent px-1.5 text-xs text-accent-ink">{count}</span> : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 flex max-h-[75vh] w-80 flex-col overflow-hidden rounded-[3px] border border-line bg-paper shadow-lg">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <p className="text-sm font-medium text-ink">Filtreler</p>
            {count > 0 ? (
              <button type="button" onClick={onClearAll} className="text-xs text-accent hover:underline">
                Tümünü temizle
              </button>
            ) : null}
          </div>

          <div className="overflow-y-auto p-3">
            <section className="border-b border-line pb-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Başvuru Tarihi</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {DATE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => onDateFilterChange(p.range())}
                    className="rounded-full border border-line px-2.5 py-1 text-xs text-ink hover:border-accent"
                  >
                    {p.label}
                  </button>
                ))}
                {dateFilter ? (
                  <button type="button" onClick={() => onDateFilterChange(undefined)} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:border-danger hover:text-danger">
                    Temizle
                  </button>
                ) : null}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="date"
                  aria-label="Başlangıç tarihi"
                  value={dateFilter?.from ?? ""}
                  onChange={(e) => onDateFilterChange({ ...dateFilter, from: e.target.value || undefined })}
                  className="w-full rounded-[3px] border border-line bg-paper px-2 py-1.5 text-xs text-ink outline-none focus-visible:border-accent"
                />
                <span className="text-xs text-muted">–</span>
                <input
                  type="date"
                  aria-label="Bitiş tarihi"
                  value={dateFilter?.to ?? ""}
                  onChange={(e) => onDateFilterChange({ ...dateFilter, to: e.target.value || undefined })}
                  className="w-full rounded-[3px] border border-line bg-paper px-2 py-1.5 text-xs text-ink outline-none focus-visible:border-accent"
                />
              </div>
            </section>

            {filterFields.map((field) => {
              const options = optionsFor(field.column);
              if (options.length === 0) return null;
              const selected = filters[field.column] ?? [];
              return (
                <section key={field.column} className="border-b border-line py-3 last:border-b-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                    {field.column}
                    {GROUP_LABELS[field.group] ? "" : ""}
                  </p>
                  <ul className="mt-2 flex max-h-40 flex-col gap-1 overflow-y-auto">
                    {options.map((value) => (
                      <li key={value}>
                        <label className="flex cursor-pointer items-center gap-2 rounded-[3px] px-1 py-1 text-sm text-ink hover:bg-paper-raised">
                          <input
                            type="checkbox"
                            checked={selected.includes(value)}
                            onChange={() => toggle(field.column, value)}
                            className="h-4 w-4 accent-accent"
                          />
                          {field.column === "Durum" ? <StatusBadge status={value} /> : <span className="truncate">{enumLabel(field.column, value)}</span>}
                        </label>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
