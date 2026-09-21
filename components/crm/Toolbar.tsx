"use client";

import type { CrmColumn, CrmQuery, DateRangeFilter, SortDirection } from "@/lib/crm/types";
import { FilterPanel } from "./FilterPanel";
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
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2.5">
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
  );
}
