import "server-only";
import { CRM_LIST_CACHE_TTL_MS } from "./config";
import type { CrmLead } from "./types";

/**
 * Best-effort, per-server-instance cache of the last crm_list() result.
 * Apps Script has no query endpoint of its own (see AGENTS notes in
 * apps-script-client.ts) — every crm_list call reads the whole LEADS_CRM
 * sheet, so this is what lets rapid search/sort/page interactions in the UI
 * avoid one Apps Script round trip per keystroke, without ever caching
 * across a write. A cold serverless instance simply starts with an empty
 * cache; that's fine, it fills on the first request.
 */
interface CacheEntry {
  rows: CrmLead[];
  team: string[];
  statuses: string[];
  fetchedAt: number;
}

let cache: CacheEntry | null = null;

export function getCachedList(): CacheEntry | null {
  if (!cache) return null;
  if (Date.now() - cache.fetchedAt > CRM_LIST_CACHE_TTL_MS) return null;
  return cache;
}

export function setCachedList(entry: Omit<CacheEntry, "fetchedAt">): void {
  cache = { ...entry, fetchedAt: Date.now() };
}

/** Called after any successful write so the next read is never stale. */
export function invalidateCrmCache(): void {
  cache = null;
}
