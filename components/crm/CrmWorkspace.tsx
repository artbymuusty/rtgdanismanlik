"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  crmBulkUpdateAction,
  crmExportCsvAction,
  crmExportCsvByIdsAction,
  crmListAction,
  crmUpdateAction,
  type CrmListResponse,
} from "@/app/crm/actions";
import { activeFilterCount } from "./FilterPanel";
import { crmErrorMessage, isSessionError } from "@/lib/crm/error-messages";
import type { CrmColumn, CrmLead, CrmQuery, DateRangeFilter, SortDirection } from "@/lib/crm/types";
import type { StatusCounts, TodayCounts } from "@/lib/crm/query";
import { STATUS_NOT_MET } from "@/lib/crm/types";
import { useActorName } from "./ActorBadge";
import { useVisibleColumns } from "./ColumnsMenu";
import { useDebouncedValue, useMediaQuery } from "./hooks";
import { Topbar } from "./Topbar";
import { KpiStrip } from "./KpiStrip";
import { TodayPanel } from "./TodayPanel";
import { SavedViewsBar } from "./SavedViewsBar";
import { Toolbar } from "./Toolbar";
import { DataTable } from "./DataTable";
import { MobileLeadList } from "./MobileLeadList";
import { LeadDrawer } from "./LeadDrawer";
import { BulkBar } from "./BulkBar";
import { NewLeadDialog } from "./NewLeadDialog";
import { EmptyResult, ErrorBanner, TableSkeleton } from "./EmptyStates";
import type { CellSaveResult } from "./EditableCells";

function downloadCsv(csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rtg-crm-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

type LoadResult = CrmListResponse | { ok: false; error: string };

function isFail(r: LoadResult): r is { ok: false; error: string } {
  return r.ok === false;
}

export function CrmWorkspace({ initialQuery, initialResult }: { initialQuery: CrmQuery; initialResult: LoadResult }) {
  const router = useRouter();
  const [actor] = useActorName();
  const [visibleColumns, setVisibleColumns] = useVisibleColumns();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const searchRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState(initialQuery.search);
  const debouncedSearch = useDebouncedValue(search, 300);
  const [filters, setFilters] = useState<CrmQuery["filters"]>(initialQuery.filters);
  const [dateFilter, setDateFilter] = useState<DateRangeFilter | undefined>(initialQuery.dateFilter);
  const [sortBy, setSortBy] = useState<CrmColumn>(initialQuery.sortBy);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(initialQuery.sortDir);
  const [page, setPage] = useState(initialQuery.page);
  const [pageSize, setPageSize] = useState(initialQuery.pageSize);

  const query: CrmQuery = useMemo(
    () => ({ search: debouncedSearch, filters, dateFilter, sortBy, sortDir, page, pageSize }),
    [debouncedSearch, filters, dateFilter, sortBy, sortDir, page, pageSize],
  );
  const filterKey = JSON.stringify({ debouncedSearch, filters, dateFilter, sortBy, sortDir });

  const [rows, setRows] = useState<CrmLead[]>(isFail(initialResult) ? [] : initialResult.rows);
  const [meta, setMeta] = useState(
    isFail(initialResult)
      ? {
          total: 0,
          page: 1,
          pageCount: 1,
          counts: { total: 0, byStatus: {} } as StatusCounts,
          team: [] as string[],
          statuses: [] as string[],
          facets: {},
          today: { appliedToday: 0, metToday: 0 } as TodayCounts,
        }
      : {
          total: initialResult.total,
          page: initialResult.page,
          pageCount: initialResult.pageCount,
          counts: initialResult.counts,
          team: initialResult.team,
          statuses: initialResult.statuses,
          facets: initialResult.facets,
          today: initialResult.today,
        },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(isFail(initialResult) ? initialResult.error : null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openLead, setOpenLead] = useState<CrmLead | null>(null);
  const [showNewLead, setShowNewLead] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const skipInitialFetch = useRef(true);

  const flashToast = useCallback((message: string) => setToast(message), []);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  const load = useCallback(
    async (q: CrmQuery, force: boolean, silent = false) => {
      if (!silent) setLoading(true);
      const result = await crmListAction(q, force);
      if (!silent) setLoading(false);
      if (!result.ok) {
        setError(result.error);
        if (isSessionError(result.error)) router.push("/crm/login");
        return;
      }
      setError(null);
      setRows(result.rows);
      setMeta({
        total: result.total,
        page: result.page,
        pageCount: result.pageCount,
        counts: result.counts,
        team: result.team,
        statuses: result.statuses,
        facets: result.facets,
        today: result.today,
      });
    },
    [router],
  );

  // Reset to page 1 and clear selection whenever the filter/search/sort
  // combination changes — adjusted during render (React's documented
  // pattern for this), not in an effect, so it lands in the same commit as
  // the change that caused it rather than costing an extra render+effect cycle.
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setPage(1);
    setSelected(new Set());
  }

  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }
    load(query, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filterKey, page, pageSize, sortBy, sortDir]);

  // "/" focuses search from anywhere that isn't already an editable field.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/") return;
      const el = document.activeElement;
      const typing = el instanceof HTMLElement && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
      if (typing) return;
      e.preventDefault();
      searchRef.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Header click (DataTable) only toggles the currently-visible column;
  // SortMenu (Toolbar) sets any of the 23 columns with an explicit direction.
  // Both write the same sortBy/sortDir state, so they never conflict.
  function handleSort(column: CrmColumn) {
    if (column === sortBy) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(column);
      setSortDir("asc");
    }
  }
  function handleSortChange(column: CrmColumn, dir: SortDirection) {
    setSortBy(column);
    setSortDir(dir);
  }

  function clearFilters() {
    setFilters({});
    setDateFilter(undefined);
    setSearch("");
  }

  function applyQuickQuery(q: Pick<CrmQuery, "search" | "filters" | "dateFilter">) {
    setSearch(q.search);
    setFilters(q.filters);
    setDateFilter(q.dateFilter);
  }

  async function saveField(lead: CrmLead, column: CrmColumn, value: string): Promise<CellSaveResult> {
    const optimistic = { ...lead, [column]: value };
    setRows((prev) => prev.map((r) => (r.ID === lead.ID ? optimistic : r)));
    setOpenLead((prev) => (prev && prev.ID === lead.ID ? optimistic : prev));

    const result = await crmUpdateAction(lead.ID, { [column]: value }, lead.version, actor || "CRM Kullanıcısı");
    if (result.ok) {
      setRows((prev) => prev.map((r) => (r.ID === lead.ID ? result.row : r)));
      setOpenLead((prev) => (prev && prev.ID === lead.ID ? result.row : prev));
      load(query, true, true); // refresh counts/facets in the background; cache was just invalidated
      return { ok: true };
    }

    const restored = result.row ?? lead; // a "conflict" reply carries the row's real current state
    setRows((prev) => prev.map((r) => (r.ID === lead.ID ? restored : r)));
    setOpenLead((prev) => (prev && prev.ID === lead.ID ? restored : prev));
    flashToast(crmErrorMessage(result.error));
    if (isSessionError(result.error)) router.push("/crm/login");
    return { ok: false, error: result.error };
  }

  async function handleBulkApply(changes: Record<string, string>) {
    const ids = [...selected];
    const result = await crmBulkUpdateAction(ids, changes, actor || "CRM Kullanıcısı");
    if (!result.ok) {
      if (isSessionError(result.error)) router.push("/crm/login");
      return result;
    }
    setRows((prev) => prev.map((r) => result.results.find((x) => x.id === r.ID && x.row)?.row ?? r));
    setSelected(new Set());
    load(query, true, true);
    // BulkBar unmounts the instant selection clears above, taking any local
    // "N kayıt güncellendi" state with it before the user can read it — the
    // shared toast (which does not depend on BulkBar staying mounted) is
    // the one place this result can actually be seen.
    flashToast(result.failed > 0 ? `${result.updated} kayıt güncellendi, ${result.failed} kayıt güncellenemedi.` : `${result.updated} kayıt güncellendi.`);
    return { ok: true as const, updated: result.updated, failed: result.failed };
  }

  async function handleExport() {
    const result = await crmExportCsvAction({ search: query.search, filters: query.filters, dateFilter: query.dateFilter, sortBy: query.sortBy, sortDir: query.sortDir }, visibleColumns);
    if (!result.ok) {
      flashToast(crmErrorMessage(result.error));
      return;
    }
    downloadCsv(result.csv);
  }

  // The bulk bar's own CSV export: re-derives the exact selected rows from
  // the server-side cache by ID, rather than trusting the client's
  // currently-loaded page state, since a selection can span pages/filters.
  async function handleBulkExportCsv() {
    const result = await crmExportCsvByIdsAction([...selected], visibleColumns);
    if (!result.ok) {
      flashToast(crmErrorMessage(result.error));
      return;
    }
    downloadCsv(result.csv);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleSelectAllOnPage() {
    setSelected((prev) => {
      const allSelected = rows.every((r) => prev.has(r.ID));
      const next = new Set(prev);
      for (const r of rows) {
        if (allSelected) next.delete(r.ID);
        else next.add(r.ID);
      }
      return next;
    });
  }

  const hasFilters = activeFilterCount({ filters, dateFilter }) > 0 || search.trim() !== "";

  return (
    <div className="flex h-dvh flex-col">
      <Topbar search={search} onSearchChange={setSearch} onRefresh={() => load(query, true)} refreshing={loading} searchRef={searchRef} />
      <KpiStrip counts={meta.counts} onApply={applyQuickQuery} />
      <TodayPanel
        appliedToday={meta.today.appliedToday}
        awaitingFirstMeeting={meta.counts.byStatus[STATUS_NOT_MET] ?? 0}
        metToday={meta.today.metToday}
        onApply={applyQuickQuery}
      />
      <SavedViewsBar query={{ search, filters, dateFilter }} onApply={applyQuickQuery} />
      <Toolbar
        query={query}
        visibleColumns={visibleColumns}
        facets={meta.facets}
        team={meta.team}
        onFiltersChange={setFilters}
        onDateFilterChange={setDateFilter}
        onClearFilters={clearFilters}
        onSortChange={handleSortChange}
        onColumnsChange={setVisibleColumns}
        onExport={handleExport}
        onNewLead={() => setShowNewLead(true)}
      />

      <div className="min-h-0 flex-1 overflow-hidden">
        {error ? (
          <ErrorBanner error={error} onRetry={() => load(query, true)} onGoToLogin={() => router.push("/crm/login")} />
        ) : loading && rows.length === 0 ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <EmptyResult hasFilters={hasFilters} onClearFilters={clearFilters} />
        ) : isDesktop ? (
          <DataTable
            rows={rows}
            visibleColumns={visibleColumns}
            sortBy={sortBy}
            sortDir={sortDir}
            onSortChange={handleSort}
            selected={selected}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAllOnPage}
            onOpenLead={(id) => setOpenLead(rows.find((r) => r.ID === id) ?? null)}
            onCellSave={saveField}
            team={meta.team}
            statuses={meta.statuses}
          />
        ) : (
          <div className="h-full overflow-y-auto">
            <MobileLeadList rows={rows} selected={selected} onToggleSelect={toggleSelect} onOpenLead={(id) => setOpenLead(rows.find((r) => r.ID === id) ?? null)} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2 text-sm text-muted">
        <p>
          {meta.total === 0 ? "0 kayıt" : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, meta.total)} / ${meta.total} kayıt`}
        </p>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5">
            Sayfa boyutu
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="rounded-[3px] border border-line bg-paper px-2 py-1 text-ink">
              {[50, 100, 250].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-1">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-[3px] border border-line px-2 py-1 text-ink disabled:opacity-40">
              ← Önceki
            </button>
            <span>
              {meta.page} / {meta.pageCount}
            </span>
            <button type="button" disabled={page >= meta.pageCount} onClick={() => setPage((p) => p + 1)} className="rounded-[3px] border border-line px-2 py-1 text-ink disabled:opacity-40">
              Sonraki →
            </button>
          </div>
        </div>
      </div>

      {selected.size > 0 ? (
        <BulkBar count={selected.size} team={meta.team} onApply={handleBulkApply} onExportCsv={handleBulkExportCsv} onClear={() => setSelected(new Set())} />
      ) : null}

      {openLead ? (
        <LeadDrawer
          key={openLead.ID}
          lead={openLead}
          statuses={meta.statuses.length > 0 ? meta.statuses : (["İlk görüşme yapılmadı", "İlk görüşme yapıldı"] as const)}
          team={meta.team}
          onClose={() => setOpenLead(null)}
          onSave={(column, value) => saveField(openLead, column, value)}
          onLeadRefreshed={(lead) => {
            setOpenLead(lead);
            setRows((prev) => prev.map((r) => (r.ID === lead.ID ? lead : r)));
          }}
          position={(() => {
            const i = rows.findIndex((r) => r.ID === openLead.ID);
            return i >= 0 ? { index: i, total: rows.length } : null;
          })()}
          onNavigate={(direction) => {
            const i = rows.findIndex((r) => r.ID === openLead.ID);
            if (i < 0) return;
            const next = direction === "next" ? i + 1 : i - 1;
            if (next >= 0 && next < rows.length) setOpenLead(rows[next]);
          }}
        />
      ) : null}

      {showNewLead ? (
        <NewLeadDialog
          team={meta.team}
          onCreated={(lead) => {
            load(query, true);
            flashToast(`${lead.Ad} ${lead.Soyad} eklendi.`);
          }}
          onClose={() => setShowNewLead(false)}
        />
      ) : null}

      {toast ? (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
          <div className="pointer-events-auto rounded-[3px] border border-line bg-ink px-4 py-2.5 text-sm text-paper shadow-lg">{toast}</div>
        </div>
      ) : null}
    </div>
  );
}
