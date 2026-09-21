import "server-only";
import { getAppsScriptConfig } from "./config";

const REQUEST_TIMEOUT_MS = 15000;

export type CrmActionType = "crm_list" | "crm_get" | "crm_update" | "crm_bulk_update" | "crm_create";

/**
 * A CRM-specific result shape (distinct from the public form's
 * AppsScriptResult in lib/google-apps-script.ts): CRM callers need the
 * error CODE ("conflict", "invalid_status", ...) to react to it — a public
 * form never should. Never throws.
 */
export type CrmScriptResult<T = Record<string, unknown>> =
  | ({ ok: true } & T)
  | { ok: false; error: string; field?: string };

/**
 * Calls one crm_* Apps Script action. Separate from submitToAppsScript() in
 * lib/google-apps-script.ts (the public form's client) — same URL/secret,
 * different request/response contract, and CRM callers are always already
 * behind requireCrmSession(). Never logs the secret or the request/response
 * bodies (which carry lead personal data).
 */
export async function callCrmAction<T = Record<string, unknown>>(
  type: CrmActionType,
  params: Record<string, unknown> = {},
): Promise<CrmScriptResult<T>> {
  const config = getAppsScriptConfig();
  if (!config) {
    console.error("[crm] not configured: GOOGLE_APPS_SCRIPT_URL/GOOGLE_APPS_SCRIPT_SECRET missing");
    return { ok: false, error: "not_configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: config.secret, type, ...params }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`[crm] non-200 response: ${response.status} (action ${type})`);
      return { ok: false, error: "apps_script_unavailable" };
    }

    const data: unknown = await response.json().catch(() => null);
    if (!data || typeof data !== "object" || !("ok" in data)) {
      console.error(`[crm] malformed response body (action ${type})`);
      return { ok: false, error: "apps_script_unavailable" };
    }

    return data as CrmScriptResult<T>;
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    console.error(`[crm] request failed: ${isAbort ? "timeout" : "network error"} (action ${type})`);
    return { ok: false, error: isAbort ? "timeout" : "network_error" };
  } finally {
    clearTimeout(timeout);
  }
}
