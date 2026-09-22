"use server";

import { headers } from "next/headers";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";
import { submitContactMessage as sendToAppsScript, toLocale } from "@/lib/contact/apps-script-client";
import { clientKeyFromHeaders, createRateLimiter } from "@/lib/rate-limit";

export type SubmitContactResult = { ok: true } | { ok: false; error: string };

const INVALID_FORM_ERRORS: Record<string, string> = {
  tr: "Formda eksik veya hatalı bir alan var.",
  en: "A field in the form is missing or incorrect.",
  de: "Im Formular fehlt eine Angabe oder sie ist fehlerhaft.",
};

const RATE_LIMITED_ERRORS: Record<string, string> = {
  tr: "Çok fazla mesaj gönderdin. Birkaç dakika sonra tekrar dene.",
  en: "You've sent too many messages. Please try again in a few minutes.",
  de: "Du hast zu viele Nachrichten gesendet. Bitte versuche es in ein paar Minuten erneut.",
};

// A real visitor sends at most a handful of contact messages; 5 per 10
// minutes per IP comfortably covers that while blocking a spam burst.
// Best-effort/in-memory, like the CRM login limiter — defense-in-depth
// alongside Code.gs's own field validation, never the sole protection.
const rateLimiter = createRateLimiter(10 * 60_000, 5);

export async function submitContactForm(input: ContactInput, lang?: string): Promise<SubmitContactResult> {
  const locale = toLocale(lang);

  const h = await headers();
  const key = clientKeyFromHeaders(h);
  if (rateLimiter.isRateLimited(key)) {
    return { ok: false, error: RATE_LIMITED_ERRORS[locale] };
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: INVALID_FORM_ERRORS[locale] };
  }

  const { honeypot, ...payload } = parsed.data;

  // Bot trap: a real visitor never fills this hidden field. Report success
  // without ever reaching Apps Script, so a bot has no signal it was
  // rejected — same pattern as the lead/mentor-application forms.
  if (honeypot) {
    return { ok: true };
  }

  const result = await sendToAppsScript(payload, locale);
  if (!result.ok) return result;
  return { ok: true };
}
