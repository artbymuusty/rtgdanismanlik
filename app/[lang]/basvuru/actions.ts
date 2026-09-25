"use server";

import { headers } from "next/headers";
import { leadSchema, type LeadInput } from "@/lib/validation/lead";
import { invalidFormError, submitToAppsScript, toLocale } from "@/lib/google-apps-script";
import { clientKeyFromHeaders, createRateLimiter } from "@/lib/rate-limit";
import type { Locale } from "@/lib/i18n/config";

export type SubmitLeadResult = { ok: true } | { ok: false; error: string };

const RATE_LIMITED_ERRORS: Record<Locale, string> = {
  tr: "Çok fazla başvuru gönderdin. Birkaç dakika sonra tekrar dene.",
  en: "You've sent too many applications. Please try again in a few minutes.",
  de: "Du hast zu viele Bewerbungen gesendet. Bitte versuche es in ein paar Minuten erneut.",
};

// A real applicant submits this form once (it's a deliberate, multi-step
// assessment, not a quick message); 5 per 10 minutes per IP comfortably
// covers retries while blocking a scripted spam burst. Best-effort/
// in-memory, like the contact form's own limiter — its own separate Map
// (createRateLimiter), so it can never share state with or be starved by
// the contact form's or CRM login's limiters.
const rateLimiter = createRateLimiter(10 * 60_000, 5);

export async function submitLead(input: LeadInput, lang?: string): Promise<SubmitLeadResult> {
  // `lang` only picks the language of the error text; it never reaches the
  // Sheet, so the stored answers (option values) are identical in every language.
  const locale = toLocale(lang);

  const h = await headers();
  const key = clientKeyFromHeaders(h);
  if (rateLimiter.isRateLimited(key)) {
    return { ok: false, error: RATE_LIMITED_ERRORS[locale] };
  }

  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: invalidFormError(locale) };
  }

  const { honeypot, submissionId, ...payload } = parsed.data;

  // Bot trap: a real visitor never fills this hidden field. Report success
  // without ever reaching Apps Script/Sheets, so a bot has no signal that
  // it was rejected.
  if (honeypot) {
    return { ok: true };
  }

  const result = await submitToAppsScript({ type: "lead", submissionId, payload }, locale);
  if (!result.ok) return result;
  return { ok: true };
}
