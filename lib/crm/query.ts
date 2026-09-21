import { CRM_COLUMNS, type CrmColumn, type CrmLead, type CrmQuery } from "./types";
import { FILTERABLE_COLUMNS, SEARCHABLE_COLUMNS } from "./fields";

/** Today, or `offsetDays` from today, as yyyy-mm-dd in the visitor's local
 * time zone — never a prediction, just a reliably computable calendar date.
 * Shared by the Filtrele panel's date presets and the "Bugün" panel. */
export function isoToday(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** dd.MM.yyyy or dd.MM.yyyy HH:mm (Apps Script's own format) or an ISO
 * string (what the public form sends as "Başvuru Tarihi") — CRM dates are
 * never a single consistent format because two different writers produce
 * them, so parsing has to accept both. Returns null when unparseable. */
export function parseCrmDate(value: string): Date | null {
  if (!value) return null;
  const dotted = value.match(/^(\d{2})\.(\d{2})\.(\d{4})(?: (\d{2}):(\d{2}))?/);
  if (dotted) {
    const [, d, m, y, h, min] = dotted;
    return new Date(Number(y), Number(m) - 1, Number(d), Number(h ?? 0), Number(min ?? 0));
  }
  const iso = new Date(value);
  return Number.isNaN(iso.getTime()) ? null : iso;
}

function matchesSearch(lead: CrmLead, needle: string): boolean {
  if (!needle) return true;
  const q = needle.toLocaleLowerCase("tr");
  return SEARCHABLE_COLUMNS.some((col) => lead[col].toLocaleLowerCase("tr").includes(q));
}

function matchesFilters(lead: CrmLead, filters: CrmQuery["filters"]): boolean {
  for (const column of Object.keys(filters) as CrmColumn[]) {
    const values = filters[column];
    if (!values || values.length === 0) continue;
    if (!values.includes(lead[column])) return false;
  }
  return true;
}

function matchesDate(lead: CrmLead, range: CrmQuery["dateFilter"]): boolean {
  if (!range || (!range.from && !range.to)) return true;
  const value = parseCrmDate(lead[range.column]);
  if (!value) return false;
  if (range.from && value < new Date(range.from + "T00:00:00")) return false;
  if (range.to && value > new Date(range.to + "T23:59:59")) return false;
  return true;
}

function compareValues(a: string, b: string, column: CrmColumn): number {
  if (column === "Başvuru Tarihi" || column === "İlk Görüşme Tarihi") {
    const da = parseCrmDate(a)?.getTime() ?? -Infinity;
    const db = parseCrmDate(b)?.getTime() ?? -Infinity;
    return da - db;
  }
  return a.localeCompare(b, "tr", { sensitivity: "base", numeric: true });
}

/** Search + filter + sort, unpaginated — the full matching set, in order.
 * Shared by runQuery() (adds pagination) and CSV export (wants every
 * matching row, not one page of them). */
export function filterAndSort(rows: CrmLead[], query: Pick<CrmQuery, "search" | "filters" | "dateFilter" | "sortBy" | "sortDir">): CrmLead[] {
  const filtered = rows.filter(
    (lead) => matchesSearch(lead, query.search.trim()) && matchesFilters(lead, query.filters) && matchesDate(lead, query.dateFilter),
  );
  return [...filtered].sort((a, b) => {
    const cmp = compareValues(a[query.sortBy], b[query.sortBy], query.sortBy);
    return query.sortDir === "asc" ? cmp : -cmp;
  });
}

export interface QueryResult {
  rows: CrmLead[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

/** Search + filter + sort + paginate — all server-side, over one cached
 * crm_list snapshot (see apps-script-client.ts / actions.ts), so the browser
 * only ever receives the one page it asked for. */
export function runQuery(rows: CrmLead[], query: CrmQuery): QueryResult {
  const sorted = filterAndSort(rows, query);
  const pageSize = Math.max(1, query.pageSize);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const page = Math.min(Math.max(1, query.page), pageCount);
  const start = (page - 1) * pageSize;

  return { rows: sorted.slice(start, start + pageSize), total: sorted.length, page, pageSize, pageCount };
}

/** Distinct, non-empty values actually present in LEADS_CRM right now, for
 * every checklist-style filterable column (the date column has its own
 * range UI instead) — real values from the real Sheet, per the brief, not a
 * hand-maintained list. Sorted with Turkish collation; enum columns get a
 * human label for display via lib/crm/fields.ts's enumLabel(), the facet
 * value itself is always the raw stored value so filtering still matches it. */
export function computeFacets(rows: CrmLead[]): Partial<Record<CrmColumn, string[]>> {
  const facets: Partial<Record<CrmColumn, string[]>> = {};
  for (const column of FILTERABLE_COLUMNS) {
    if (column === "Başvuru Tarihi") continue;
    const values = new Set<string>();
    for (const row of rows) if (row[column]) values.add(row[column]);
    facets[column] = [...values].sort((a, b) => a.localeCompare(b, "tr", { sensitivity: "base", numeric: true }));
  }
  return facets;
}

export interface StatusCounts {
  total: number;
  byStatus: Record<string, number>;
}

export function countByStatus(rows: CrmLead[]): StatusCounts {
  const byStatus: Record<string, number> = {};
  for (const lead of rows) byStatus[lead["Durum"]] = (byStatus[lead["Durum"]] ?? 0) + 1;
  return { total: rows.length, byStatus };
}

export interface TodayCounts {
  appliedToday: number;
  metToday: number;
}

/** Reliably computable "today" facts — never a prediction or estimate, just
 * counting rows whose own dated column falls on today's calendar date. */
export function computeTodayCounts(rows: CrmLead[]): TodayCounts {
  const today = isoToday();
  const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const isToday = (value: string) => {
    const d = parseCrmDate(value);
    return d ? dateKey(d) === today : false;
  };
  let appliedToday = 0;
  let metToday = 0;
  for (const lead of rows) {
    if (isToday(lead["Başvuru Tarihi"])) appliedToday++;
    if (isToday(lead["İlk Görüşme Tarihi"])) metToday++;
  }
  return { appliedToday, metToday };
}

function csvCell(value: string): string {
  // Same formula-injection concern as Sheets itself (see Code.gs
  // crmNeutralizeFormula) — a CSV opened in Excel/Sheets evaluates a
  // leading =/+/-/@ as a formula.
  const safe = /^[=+\-@]/.test(value) ? "'" + value : value;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

/** CSV of exactly the given rows (the caller already applied search/filter/sort),
 * with the real LEADS_CRM column names as the header — never renamed. */
export function toCsv(rows: CrmLead[], columns: readonly CrmColumn[] = CRM_COLUMNS): string {
  const lines = [columns.map(csvCell).join(",")];
  for (const row of rows) lines.push(columns.map((c) => csvCell(row[c])).join(","));
  return "﻿" + lines.join("\r\n"); // BOM so Excel opens Turkish characters correctly
}
