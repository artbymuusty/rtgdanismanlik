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

import { fallbackLocale, isLocale, type Locale } from "@/lib/i18n/config";

const REQUEST_TIMEOUT_MS = 8000;

const GENERIC_ERRORS: Record<Locale, string> = {
  tr: "Başvurun şu anda tamamlanamadı. Lütfen İletişim sayfasındaki kanallardan bize ulaş.",
  en: "Your application couldn't be completed right now. Please reach us through the channels on the Contact page.",
  de: "Deine Bewerbung konnte gerade nicht abgeschlossen werden. Bitte melde dich über die Kanäle auf der Kontaktseite bei uns.",
};

const INVALID_FORM_ERRORS: Record<Locale, string> = {
  tr: "Formda eksik veya hatalı bir alan var.",
  en: "A field in the form is missing or incorrect.",
  de: "Im Formular fehlt eine Angabe oder sie ist fehlerhaft.",
};

/** The client passes its language along; anything unexpected falls back safely. */
export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : fallbackLocale;
}

export function invalidFormError(locale: Locale): string {
  return INVALID_FORM_ERRORS[locale];
}

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
export async function submitToAppsScript(
  request: AppsScriptRequest,
  locale: Locale = "tr",
): Promise<AppsScriptResult> {
  const GENERIC_ERROR = GENERIC_ERRORS[locale];
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
      // Status + content-type only (never the body) — an HTML content-type
      // here means Apps Script served a login/error page instead of doPost's
      // JSON, i.e. a wrong URL, wrong deployment access, or a script error.
      console.error(
        `[google-apps-script] malformed response body (status ${response.status}, content-type ${response.headers.get("content-type") ?? "none"}, redirected ${response.redirected})`,
      );
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
