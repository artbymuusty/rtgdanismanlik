"use server";

import { mentorApplicationSchema, type MentorApplicationInput } from "@/lib/validation/mentor-application";
import { invalidFormError, submitToAppsScript, toLocale } from "@/lib/google-apps-script";

export type SubmitMentorApplicationResult = { ok: true } | { ok: false; error: string };

export async function submitMentorApplication(
  input: MentorApplicationInput,
  lang?: string,
): Promise<SubmitMentorApplicationResult> {
  const locale = toLocale(lang);

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
