"use server";

import { mentorApplicationSchema, type MentorApplicationInput } from "@/lib/validation/mentor-application";
import { submitToAppsScript } from "@/lib/google-apps-script";

export type SubmitMentorApplicationResult = { ok: true } | { ok: false; error: string };

export async function submitMentorApplication(input: MentorApplicationInput): Promise<SubmitMentorApplicationResult> {
  const parsed = mentorApplicationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Formda eksik veya hatalı bir alan var." };
  }

  const { honeypot, submissionId, ...payload } = parsed.data;

  // Bot trap: a real visitor never fills this hidden field. Report success
  // without ever reaching Apps Script/Sheets, so a bot has no signal that
  // it was rejected.
  if (honeypot) {
    return { ok: true };
  }

  const result = await submitToAppsScript({ type: "mentor_application", submissionId, payload });
  if (!result.ok) return result;
  return { ok: true };
}
