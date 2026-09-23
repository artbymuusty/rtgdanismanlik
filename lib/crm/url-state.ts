import { CRM_COLUMNS, DEFAULT_QUERY, type CrmColumn, type CrmQuery, type DateRangeFilter, type SortDirection } from "./types";

/**
 * Bidirectional CrmQuery <-> URL query string, so /crm's filter/search/
 * sort/page state survives a refresh, is bookmarkable/shareable, and
 * responds to browser back/forward — without any new backend contract
 * (this only ever affects what the CLIENT asks crmListAction for; the
 * Apps Script side never sees a URL).
 *
 * Every real CRM_COLUMN is a valid query key (URLSearchParams encodes the
 * Turkish characters/spaces itself — the address bar looks encoded, but
 * every value round-trips exactly), which avoids inventing and maintaining
 * a second slug dictionary that could silently drift from the real column
 * names/enum values. Reserved keys ("q", "sort", "page", "pageSize",
 * "dateColumn", "dateFrom", "dateTo") don't collide with any real column.
 */
const RESERVED_KEYS = new Set(["q", "sort", "page", "pageSize", "dateColumn", "dateFrom", "dateTo"]);

export function queryToSearchParams(query: CrmQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search) params.set("q", query.search);

  for (const column of CRM_COLUMNS) {
    const values = query.filters[column];
    if (values && values.length > 0) params.set(column, values.join(","));
  }

  if (query.dateFilter?.from || query.dateFilter?.to) {
    params.set("dateColumn", query.dateFilter.column);
    if (query.dateFilter.from) params.set("dateFrom", query.dateFilter.from);
    if (query.dateFilter.to) params.set("dateTo", query.dateFilter.to);
  }

  if (query.sortBy !== DEFAULT_QUERY.sortBy || query.sortDir !== DEFAULT_QUERY.sortDir) {
    params.set("sort", `${query.sortBy}:${query.sortDir}`);
  }
  if (query.page !== DEFAULT_QUERY.page) params.set("page", String(query.page));
  if (query.pageSize !== DEFAULT_QUERY.pageSize) params.set("pageSize", String(query.pageSize));

  return params;
}

/** Accepts anything with a `.get(key)` method — a real URLSearchParams
 * (client) or a small adapter built from Next's server-side searchParams
 * object (see nextSearchParamsToQuery below). Never throws on garbage
 * input: an unrecognized column/value/direction is simply ignored, same
 * as a first-ever visit with no query string at all. */
export function searchParamsToQuery(params: { get(key: string): string | null }): CrmQuery {
  const filters: CrmQuery["filters"] = {};
  for (const column of CRM_COLUMNS) {
    if (RESERVED_KEYS.has(column)) continue; // no real column collides today, but never trust that silently
    const raw = params.get(column);
    if (raw) {
      const values = raw.split(",").filter(Boolean);
      if (values.length > 0) filters[column] = values;
    }
  }

  let dateFilter: DateRangeFilter | undefined;
  const dateColumn = params.get("dateColumn");
  const dateFrom = params.get("dateFrom") || undefined;
  const dateTo = params.get("dateTo") || undefined;
  if (dateColumn && (CRM_COLUMNS as readonly string[]).includes(dateColumn) && (dateFrom || dateTo)) {
    dateFilter = { column: dateColumn as CrmColumn, from: dateFrom, to: dateTo };
  }

  let sortBy: CrmColumn = DEFAULT_QUERY.sortBy;
  let sortDir: SortDirection = DEFAULT_QUERY.sortDir;
  const sortRaw = params.get("sort");
  if (sortRaw) {
    const [col, dir] = sortRaw.split(":");
    if (col && (CRM_COLUMNS as readonly string[]).includes(col)) sortBy = col as CrmColumn;
    if (dir === "asc" || dir === "desc") sortDir = dir;
  }

  const pageRaw = Number(params.get("page"));
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : DEFAULT_QUERY.page;
  const pageSizeRaw = Number(params.get("pageSize"));
  const pageSize = [50, 100, 250].includes(pageSizeRaw) ? pageSizeRaw : DEFAULT_QUERY.pageSize;

  return {
    search: params.get("q") ?? "",
    filters,
    dateFilter,
    sortBy,
    sortDir,
    page,
    pageSize,
  };
}

/** Next.js's server-side `searchParams` prop is a plain
 * Record<string, string | string[] | undefined>, not a URLSearchParams —
 * this adapts it (first value wins for a repeated key) so app/crm/page.tsx
 * can share the exact same parsing logic the client uses. */
export function nextSearchParamsToQuery(searchParams: Record<string, string | string[] | undefined>): CrmQuery {
  const map = new Map<string, string>();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") map.set(key, value);
    else if (Array.isArray(value) && typeof value[0] === "string") map.set(key, value[0]);
  }
  return searchParamsToQuery({ get: (key) => map.get(key) ?? null });
}
