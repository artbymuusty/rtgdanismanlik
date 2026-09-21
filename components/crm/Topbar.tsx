"use client";

import { forwardRef } from "react";
import { STATUS_MET, STATUS_NOT_MET, type CrmColumn, type CrmQuery, type DateRangeFilter } from "@/lib/crm/types";
import type { StatusCounts } from "@/lib/crm/query";
import { FilterPanel } from "./FilterPanel";
import { ColumnsMenu } from "./ColumnsMenu";
import { ActorBadge } from "./ActorBadge";
import { Button } from "@/components/ui/Button";
import { logout } from "@/app/crm/login/actions";

function Stat({ label, value, tone }: { label: string; value: number; tone?: "muted" | "accent" | "gold" | "danger" }) {
  return (
    <div className="flex flex-col items-start px-3 first:pl-0">
      <span
        className={
          "font-mono text-base font-semibold leading-none " +
          (tone === "accent" ? "text-accent" : tone === "gold" ? "text-gold" : tone === "danger" ? "text-danger" : "text-ink")
        }
      >
        {value}
      </span>
      <span className="mt-0.5 whitespace-nowrap text-[10px] uppercase tracking-[0.06em] text-muted">{label}</span>
    </div>
  );
}

export const SearchInput = forwardRef<HTMLInputElement, { value: string; onChange: (v: string) => void }>(function SearchInput(
  { value, onChange },
  ref,
) {
  return (
    <input
      ref={ref}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Ad, e-posta, telefon, ID, not, mesaj ara… ( / )"
      className="h-9 w-56 rounded-[3px] border border-line bg-paper px-3 text-sm text-ink outline-none focus-visible:border-accent sm:w-72"
    />
  );
});

export function Topbar({
  counts,
  query,
  visibleColumns,
  facets,
  team,
  onSearchChange,
  onFiltersChange,
  onDateFilterChange,
  onClearFilters,
  onColumnsChange,
  onRefresh,
  onExport,
  onNewLead,
  refreshing,
  searchRef,
}: {
  counts: StatusCounts;
  query: CrmQuery;
  visibleColumns: CrmColumn[];
  facets: Partial<Record<CrmColumn, string[]>>;
  team: string[];
  onSearchChange: (v: string) => void;
  onFiltersChange: (f: CrmQuery["filters"]) => void;
  onDateFilterChange: (d: DateRangeFilter | undefined) => void;
  onClearFilters: () => void;
  onColumnsChange: (cols: CrmColumn[]) => void;
  onRefresh: () => void;
  onExport: () => void;
  onNewLead: () => void;
  refreshing: boolean;
  searchRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <header className="flex flex-wrap items-center gap-4 border-b border-line px-4 py-3">
      <div className="flex items-center gap-4">
        <p className="font-display text-lg font-semibold text-ink">RTG CRM</p>
        <div className="hidden items-center divide-x divide-line lg:flex">
          <Stat label="Toplam" value={counts.total} />
          <Stat label="Bekleyen İlk Görüşme" value={counts.byStatus[STATUS_NOT_MET] ?? 0} tone="muted" />
          <Stat label="İlk Görüşme Yapıldı" value={counts.byStatus[STATUS_MET] ?? 0} tone="accent" />
          <Stat label="Süreçte" value={counts.byStatus["Süreçte"] ?? 0} tone="gold" />
          <Stat label="Olumlu" value={counts.byStatus["Olumlu Sonuçlandı"] ?? 0} tone="accent" />
          <Stat label="Olumsuz" value={counts.byStatus["Olumsuz Sonuçlandı"] ?? 0} tone="danger" />
        </div>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <SearchInput ref={searchRef} value={query.search} onChange={onSearchChange} />
        <FilterPanel
          filters={query.filters}
          dateFilter={query.dateFilter}
          facets={facets}
          team={team}
          onFiltersChange={onFiltersChange}
          onDateFilterChange={onDateFilterChange}
          onClearAll={onClearFilters}
        />
        <ColumnsMenu visible={visibleColumns} onChange={onColumnsChange} />
        <button type="button" onClick={onRefresh} disabled={refreshing} className="flex h-9 items-center gap-1.5 rounded-[3px] border border-line px-3 text-sm text-ink transition-colors hover:border-accent disabled:opacity-60">
          {refreshing ? "Yenileniyor..." : "Yenile"}
        </button>
        <button type="button" onClick={onExport} className="flex h-9 items-center gap-1.5 rounded-[3px] border border-line px-3 text-sm text-ink transition-colors hover:border-accent">
          CSV Aktar
        </button>
        <Button onClick={onNewLead} className="!h-9 !px-3 !py-0 text-sm">
          + Lead ekle
        </Button>
        <ActorBadge />
        <form action={logout}>
          <button type="submit" className="flex h-9 items-center rounded-[3px] border border-line px-3 text-sm text-muted transition-colors hover:border-danger hover:text-danger">
            Çıkış yap
          </button>
        </form>
      </div>
    </header>
  );
}
