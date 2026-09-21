/**
 * CRM-only configuration. Kept apart from lib/site-config.ts because none of
 * this is public site config — CRM_ADMIN_SECRET must never be prefixed
 * NEXT_PUBLIC_ and never imported from a "use client" file.
 */
import "server-only";

/** HttpOnly session cookie for /crm. Not the public NEXT_LOCALE cookie. */
export const CRM_SESSION_COOKIE = "rtg_crm_session";

/** A work session is valid for 8 hours, then the admin logs in again. */
export const CRM_SESSION_TTL_SECONDS = 8 * 60 * 60;

/** How long a crm_list response is reused across requests on this server
 * instance before Apps Script is called again. Every write (update / bulk
 * update / create) invalidates it immediately, and "Refresh" in the UI
 * bypasses it — this only smooths repeated reads (typing in search, sorting)
 * within the same few seconds. Apps Script has no query endpoint of its own,
 * so paginating/searching/sorting happens here, over this cached snapshot. */
export const CRM_LIST_CACHE_TTL_MS = 8000;

export function getCrmAdminSecret(): string | null {
  return process.env.CRM_ADMIN_SECRET || null;
}

export function getAppsScriptConfig(): { url: string; secret: string } | null {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!url || !secret) return null;
  return { url, secret };
}
