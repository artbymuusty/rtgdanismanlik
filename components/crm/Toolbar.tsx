"use client";

import { enumLabel } from "@/lib/crm/fields";
import { formatCrmDate } from "@/lib/crm/format";
import type { CrmColumn, CrmQuery, DateRangeFilter, SortDirection } from "@/lib/crm/types";
import { FilterPanel } from "./FilterPanel";
import { FilterChip } from "./FilterChip";
import { SortMenu } from "./SortMenu";
import { ColumnsMenu } from "./ColumnsMenu";
import { Button } from "@/components/ui/Button";

/** The data-shaping row: Filtrele, Sırala, Sütunlar, Export, Yeni Lead. */
export function Toolbar({
  query,
  visibleColumns,
  facets,
  team,
  onFiltersChange,
  onDateFilterChange,
  onClearFilters,
  onSortChange,
  onColumnsChange,
  onExport,
  onNewLead,
}: {
  query: CrmQuery;
  visibleColumns: CrmColumn[];
  facets: Partial<Record<CrmColumn, string[]>>;
  team: string[];
  onFiltersChange: (f: CrmQuery["filters"]) => void;
  onDateFilterChange: (d: DateRangeFilter | undefined) => void;
  onClearFilters: () => void;
  onSortChange: (column: CrmColumn, dir: SortDirection) => void;
  onColumnsChange: (cols: CrmColumn[]) => void;
  onExport: () => void;
  onNewLead: () => void;
}) {
  const filterColumns = Object.keys(query.filters) as CrmColumn[];
  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  for (const column of filterColumns) {
    const values = query.filters[column] ?? [];
    for (const value of values) {
      chips.push({
        key: `${column}:${value}`,
        label: `${column}: ${enumLabel(column, value)}`,
        onRemove: () => onFiltersChange({ ...query.filters, [column]: values.filter((v) => v !== value) || undefined }),
      });
    }
  }
  if (query.dateFilter?.from || query.dateFilter?.to) {
    const d = query.dateFilter;
    const range = [d.from ? formatCrmDate(d.from) : "…", d.to ? formatCrmDate(d.to) : "…"].join(" – ");
    chips.push({ key: "date", label: `${d.column}: ${range}`, onRemove: () => onDateFilterChange(undefined) });
  }

  return (
    <div className="border-b border-line px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <FilterPanel
          filters={query.filters}
          dateFilter={query.dateFilter}
          facets={facets}
          team={team}
          onFiltersChange={onFiltersChange}
          onDateFilterChange={onDateFilterChange}
          onClearAll={onClearFilters}
        />
        <SortMenu sortBy={query.sortBy} sortDir={query.sortDir} onChange={onSortChange} />
        <ColumnsMenu visible={visibleColumns} onChange={onColumnsChange} />

        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={onExport} className="flex h-9 items-center gap-1.5 rounded-[3px] border border-line px-3 text-sm text-ink transition-colors hover:border-accent">
            CSV Aktar
          </button>
          <Button onClick={onNewLead} className="!h-9 !px-3 !py-0 text-sm">
            + Yeni Lead
          </Button>
        </div>
      </div>

      {chips.length > 0 ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 motion-safe:animate-[crm-fade-in_120ms_ease-out]">
          {chips.map((c) => (
            <FilterChip key={c.key} label={c.label} onRemove={c.onRemove} />
          ))}
          <button type="button" onClick={onClearFilters} className="ml-1 text-xs text-accent hover:underline">
            Tümünü temizle
          </button>
        </div>
      ) : null}
    </div>
  );
}
