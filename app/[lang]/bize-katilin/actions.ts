"use server";

import { headers } from "next/headers";
import { mentorApplicationSchema, type MentorApplicationInput } from "@/lib/validation/mentor-application";
import { invalidFormError, submitToAppsScript, toLocale } from "@/lib/google-apps-script";
import { clientKeyFromHeaders, createRateLimiter } from "@/lib/rate-limit";
import type { Locale } from "@/lib/i18n/config";

export type SubmitMentorApplicationResult = { ok: true } | { ok: false; error: string };

const RATE_LIMITED_ERRORS: Record<Locale, string> = {
  tr: "Çok fazla başvuru gönderdin. Birkaç dakika sonra tekrar dene.",
  en: "You've sent too many applications. Please try again in a few minutes.",
  de: "Du hast zu viele Bewerbungen gesendet. Bitte versuche es in ein paar Minuten erneut.",
};

// Same rationale/limits as the lead form's own limiter (see
// app/[lang]/basvuru/actions.ts) — its own separate Map, isolated from
// every other feature's rate limiter.
const rateLimiter = createRateLimiter(10 * 60_000, 5);

export async function submitMentorApplication(
  input: MentorApplicationInput,
  lang?: string,
): Promise<SubmitMentorApplicationResult> {
  const locale = toLocale(lang);

  const h = await headers();
  const key = clientKeyFromHeaders(h);
  if (rateLimiter.isRateLimited(key)) {
    return { ok: false, error: RATE_LIMITED_ERRORS[locale] };
  }

  const parsed = mentorApplicationSchema.safeParse(input);
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

  const result = await submitToAppsScript({ type: "mentor_application", submissionId, payload }, locale);
  if (!result.ok) return result;
  return { ok: true };
}
