import "server-only";
import { fallbackLocale, isLocale, type Locale } from "@/lib/i18n/config";
import type { ContactCategory } from "@/lib/validation/contact";

/**
 * Server-only client for the contact form's own `type: "contact"` Apps
 * Script action (see integrations/google-apps-script/Code.gs's
 * handleContactRequest()). Separate from submitToAppsScript() in
 * lib/google-apps-script.ts (the lead/mentor_application forms) and from
 * lib/crm/apps-script-client.ts (the CRM's crm_* actions) — same URL/secret,
 * a different request/response contract each time, same pattern this
 * codebase already uses for that reason.
 */

const REQUEST_TIMEOUT_MS = 8000;

const GENERIC_ERRORS: Record<Locale, string> = {
  tr: "Mesaj gönderilemedi. Tekrar deneyin veya farklı bir iletişim kanalı kullanın.",
  en: "Your message couldn't be sent. Please try again or use a different contact channel.",
  de: "Deine Nachricht konnte nicht gesendet werden. Bitte versuche es erneut oder nutze einen anderen Kontaktweg.",
};

export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : fallbackLocale;
}

export function contactGenericError(locale: Locale): string {
  return GENERIC_ERRORS[locale];
}

export type ContactSubmitResult = { ok: true; id: string } | { ok: false; error: string };

interface ContactRequest {
  email: string;
  category: ContactCategory;
  subject: string;
  message: string;
}

/**
 * Never throws and never surfaces a technical error to the caller — every
 * failure path (missing config, timeout, network error, non-200, a
 * malformed or `ok:false` response, a genuine MailApp send failure)
 * collapses to the same generic, RTG-toned error. Only a short, PII-free
 * category is logged server-side — never the message body or the
 * visitor's own e-mail address.
 */
export async function submitContactMessage(request: ContactRequest, locale: Locale = "tr"): Promise<ContactSubmitResult> {
  const GENERIC_ERROR = GENERIC_ERRORS[locale];
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;

  if (!url || !secret) {
    console.error("[contact] not configured: GOOGLE_APPS_SCRIPT_URL/GOOGLE_APPS_SCRIPT_SECRET missing");
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
        type: "contact",
        submittedAt: new Date().toISOString(),
        source: "rtg-website",
        ...request,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`[contact] non-200 response: ${response.status}`);
      return { ok: false, error: GENERIC_ERROR };
    }

    const data: unknown = await response.json().catch(() => null);
    if (!data || typeof data !== "object" || !("ok" in data)) {
      console.error(
        `[contact] malformed response body (status ${response.status}, content-type ${response.headers.get("content-type") ?? "none"}, redirected ${response.redirected})`,
      );
      return { ok: false, error: GENERIC_ERROR };
    }

    const result = data as { ok?: boolean; id?: string; error?: string };
    if (result.ok === true && typeof result.id === "string" && result.id) {
      return { ok: true, id: result.id };
    }

    console.error(`[contact] rejected: ${result.error ?? "unknown"}`);
    return { ok: false, error: GENERIC_ERROR };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    console.error(`[contact] request failed: ${isAbort ? "timeout" : "network error"}`);
    return { ok: false, error: GENERIC_ERROR };
  } finally {
    clearTimeout(timeout);
  }
}
