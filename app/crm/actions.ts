"use server";

import { isCrmSessionValid } from "@/lib/crm/auth";
import { callCrmAction } from "@/lib/crm/apps-script-client";
import { getCachedList, invalidateCrmCache, setCachedList } from "@/lib/crm/cache";
import { computeFacets, countByStatus, filterAndSort, runQuery, toCsv, type StatusCounts } from "@/lib/crm/query";
import {
  CRM_COLUMNS,
  rowToLead,
  type ActivityEntry,
  type CrmColumn,
  type CrmLead,
  type CrmQuery,
  type SnapshotInfo,
} from "@/lib/crm/types";

type Fail = { ok: false; error: string; field?: string };

interface RawListResult {
  columns: string[];
  statuses: string[];
  team: string[];
  rows: { v: string[]; ver: string }[];
  total: number;
  fetchedAt: string;
}

async function loadAllLeads(force: boolean): Promise<{ ok: true; rows: CrmLead[]; team: string[]; statuses: string[] } | Fail> {
  if (!force) {
    const cached = getCachedList();
    if (cached) return { ok: true, rows: cached.rows, team: cached.team, statuses: cached.statuses };
  }

  const result = await callCrmAction<RawListResult>("crm_list");
  if (!result.ok) return result;

  const rows = result.rows.map((r) => rowToLead(r.v, r.ver));
  setCachedList({ rows, team: result.team, statuses: result.statuses });
  return { ok: true, rows, team: result.team, statuses: result.statuses };
}

export interface CrmListResponse {
  ok: true;
  rows: CrmLead[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  counts: StatusCounts;
  team: string[];
  statuses: string[];
  facets: Partial<Record<CrmColumn, string[]>>;
}

/** The table's one read action: session-gated, served from the short-lived
 * cache unless `force` (the Refresh button, or right after a write). */
export async function crmListAction(query: CrmQuery, force = false): Promise<CrmListResponse | Fail> {
  if (!(await isCrmSessionValid())) return { ok: false, error: "unauthorized" };

  const loaded = await loadAllLeads(force);
  if (!loaded.ok) return loaded;

  const result = runQuery(loaded.rows, query);
  return {
    ok: true,
    ...result,
    counts: countByStatus(loaded.rows),
    team: loaded.team,
    statuses: loaded.statuses,
    facets: computeFacets(loaded.rows),
  };
}

interface RawGetResult {
  row: { v: string[]; ver: string };
  snapshot: SnapshotInfo;
  activity: ActivityEntry[];
}

export async function crmGetAction(id: string): Promise<{ ok: true; row: CrmLead; snapshot: SnapshotInfo; activity: ActivityEntry[] } | Fail> {
  if (!(await isCrmSessionValid())) return { ok: false, error: "unauthorized" };
  const result = await callCrmAction<RawGetResult>("crm_get", { id });
  if (!result.ok) return result;
  return { ok: true, row: rowToLead(result.row.v, result.row.ver), snapshot: result.snapshot, activity: result.activity };
}

interface RawUpdateResult {
  row: { v: string[]; ver: string };
  lifecycle: { dateStamped: boolean; snapshot: string; error: string } | null;
}

export interface CrmUpdateResponse {
  ok: true;
  row: CrmLead;
  lifecycle: { dateStamped: boolean; snapshot: string; error: string } | null;
}

/**
 * The table/drawer's one write action for a single lead — by ID, with
 * optimistic-concurrency (`expectedVersion`). `actor` is the free-text name
 * the CRM user entered once in the toolbar (see components/crm/ActorBadge),
 * used only for the audit trail, never for authorization.
 */
export async function crmUpdateAction(
  id: string,
  changes: Partial<Record<CrmColumn, string>>,
  expectedVersion: string,
  actor: string,
): Promise<CrmUpdateResponse | (Fail & { row?: CrmLead })> {
  if (!(await isCrmSessionValid())) return { ok: false, error: "unauthorized" };
  const result = await callCrmAction<RawUpdateResult & { row: { v: string[]; ver: string } }>("crm_update", {
    id,
    changes,
    expectedVersion,
    actor,
  });
  if (!result.ok) {
    const conflictRow = (result as Fail & { row?: { v: string[]; ver: string } }).row;
    return { ...result, row: conflictRow ? rowToLead(conflictRow.v, conflictRow.ver) : undefined };
  }
  invalidateCrmCache();
  return { ok: true, row: rowToLead(result.row.v, result.row.ver), lifecycle: result.lifecycle };
}

interface RawBulkResult {
  results: { id: string; ok: boolean; error?: string; row?: { v: string[]; ver: string } }[];
  updated: number;
  failed: number;
}

export interface CrmBulkUpdateResponse {
  ok: true;
  updated: number;
  failed: number;
  results: { id: string; ok: boolean; error?: string; row?: CrmLead }[];
}

/** Bulk assignment (Sorumlu / Durum / Mentor ID only — enforced again on the
 * Apps Script side). Confirmation for a destructive-feeling bulk action is
 * the caller's (UI) job; there is no bulk delete to confirm. */
export async function crmBulkUpdateAction(
  ids: string[],
  changes: Partial<Record<CrmColumn, string>>,
  actor: string,
): Promise<CrmBulkUpdateResponse | Fail> {
  if (!(await isCrmSessionValid())) return { ok: false, error: "unauthorized" };
  const result = await callCrmAction<RawBulkResult>("crm_bulk_update", { ids, changes, actor });
  if (!result.ok) return result;
  invalidateCrmCache();
  return {
    ok: true,
    updated: result.updated,
    failed: result.failed,
    results: result.results.map((r) => ({ id: r.id, ok: r.ok, error: r.error, row: r.row ? rowToLead(r.row.v, r.row.ver) : undefined })),
  };
}

interface RawCreateResult {
  id: string;
  existing: boolean;
  row: { v: string[]; ver: string } | null;
}

/** Manual lead entry. Its own action and its own field allow-list — this
 * never reuses the public website's `submitLead` server action or its
 * validation, and always writes Source = "manual" on the Apps Script side. */
export async function crmCreateAction(
  fields: Partial<Record<CrmColumn, string>>,
  requestId: string,
): Promise<{ ok: true; id: string; existing: boolean; row: CrmLead | null } | Fail> {
  if (!(await isCrmSessionValid())) return { ok: false, error: "unauthorized" };
  const result = await callCrmAction<RawCreateResult>("crm_create", { fields, requestId });
  if (!result.ok) return result;
  invalidateCrmCache();
  return { ok: true, id: result.id, existing: result.existing, row: result.row ? rowToLead(result.row.v, result.row.ver) : null };
}

/** CSV of every row matching the current search/filters/sort (not just the
 * visible page) — the real column names, in the real LEADS_CRM order. */
export async function crmExportCsvAction(
  query: Pick<CrmQuery, "search" | "filters" | "dateFilter" | "sortBy" | "sortDir">,
  columns: CrmColumn[] = [...CRM_COLUMNS],
): Promise<{ ok: true; csv: string; count: number } | Fail> {
  if (!(await isCrmSessionValid())) return { ok: false, error: "unauthorized" };
  const loaded = await loadAllLeads(false);
  if (!loaded.ok) return loaded;
  const rows = filterAndSort(loaded.rows, query);
  return { ok: true, csv: toCsv(rows, columns), count: rows.length };
}
