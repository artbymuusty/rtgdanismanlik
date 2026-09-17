"use server";

import { leadSchema, type LeadInput } from "@/lib/validation/lead";

export type SubmitLeadResult = { ok: true } | { ok: false; error: string };

/**
 * CP3: validation foundation only. The Google Apps Script Web App that
 * actually delivers this to Sheets is wired up in CP5 (see the rebuild
 * plan) — until then this reports the honest "not connected yet" state
 * instead of silently pretending to succeed.
 */
export async function submitLead(input: LeadInput): Promise<SubmitLeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Formda eksik veya hatalı bir alan var." };
  }

  return {
    ok: false,
    error: "Başvuru altyapısı henüz bağlanmadı. Lütfen İletişim sayfasındaki kanallardan bize ulaş.",
  };
}
