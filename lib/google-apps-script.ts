/**
 * Server-only client for the RTG Google Apps Script Web App backend (see
 * integrations/google-apps-script/Code.gs + GOOGLE_APPS_SCRIPT_SETUP.md).
 * Only ever imported from Server Actions — never from a "use client"
 * component — so GOOGLE_APPS_SCRIPT_URL / GOOGLE_APPS_SCRIPT_SECRET never
 * reach the browser bundle. Both are plain (non-`NEXT_PUBLIC_`) server
 * env vars for exactly that reason.
 *
 * Apps Script Web Apps don't expose custom HTTP request headers to
 * doPost(e) (only e.postData / e.parameter / e.queryString), so the
 * shared secret travels inside the JSON body instead of a header.
 */

const REQUEST_TIMEOUT_MS = 8000;

const GENERIC_ERROR = "Başvuru şu anda tamamlanamadı. Lütfen İletişim sayfasındaki kanallardan bize ulaş.";

export type AppsScriptResult = { ok: true; id: string } | { ok: false; error: string };

interface AppsScriptRequest {
  type: "lead" | "mentor_application";
  submissionId: string;
  payload: Record<string, unknown>;
}

/**
 * Never throws and never surfaces a technical error to the caller — every
 * failure path (missing config, timeout, network error, non-200, a
 * malformed or `ok:false` response) collapses to the same generic,
 * RTG-toned error. Only a short, PII-free category is logged
 * server-side (never the payload — no name/email/phone/free-text).
 */
export async function submitToAppsScript(request: AppsScriptRequest): Promise<AppsScriptResult> {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;

  if (!url || !secret) {
    console.error("[google-apps-script] not configured: GOOGLE_APPS_SCRIPT_URL/GOOGLE_APPS_SCRIPT_SECRET missing");
    return { ok: false, error: GENERIC_ERROR };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        submittedAt: new Date().toISOString(),
        source: "rtg-website",
        ...request,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(`[google-apps-script] non-200 response: ${response.status}`);
      return { ok: false, error: GENERIC_ERROR };
    }

    const data: unknown = await response.json().catch(() => null);
    if (!data || typeof data !== "object" || !("ok" in data)) {
      console.error("[google-apps-script] malformed response body");
      return { ok: false, error: GENERIC_ERROR };
    }

    const result = data as { ok?: boolean; id?: string; error?: string };
    if (result.ok === true && typeof result.id === "string" && result.id) {
      return { ok: true, id: result.id };
    }

    console.error(`[google-apps-script] rejected: ${result.error ?? "unknown"}`);
    return { ok: false, error: GENERIC_ERROR };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    console.error(`[google-apps-script] request failed: ${isAbort ? "timeout" : "network error"}`);
    return { ok: false, error: GENERIC_ERROR };
  } finally {
    clearTimeout(timeout);
  }
}
