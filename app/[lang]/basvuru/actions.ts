"use server";

import { leadSchema, type LeadInput } from "@/lib/validation/lead";
import { invalidFormError, submitToAppsScript, toLocale } from "@/lib/google-apps-script";

export type SubmitLeadResult = { ok: true } | { ok: false; error: string };

export async function submitLead(input: LeadInput, lang?: string): Promise<SubmitLeadResult> {
  // `lang` only picks the language of the error text; it never reaches the
  // Sheet, so the stored answers (option values) are identical in every language.
  const locale = toLocale(lang);

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
