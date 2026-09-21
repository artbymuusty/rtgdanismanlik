"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCrmAdminSecret } from "@/lib/crm/config";
import { createCrmSession, destroyCrmSession } from "@/lib/crm/auth";
import { secretsMatch } from "@/lib/crm/session";
import { isRateLimited, resetRateLimit } from "@/lib/crm/rate-limit";

export type CrmLoginResult = { ok: true } | { ok: false; error: "not_configured" | "invalid_secret" | "rate_limited" };

async function clientKey(): Promise<string> {
  const h = await headers();
  // Vercel sets x-forwarded-for / x-real-ip; falls back to a shared bucket
  // (still throttles overall attempt volume) when neither is present, e.g. locally.
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function login(secret: string): Promise<CrmLoginResult> {
  const key = await clientKey();
  if (isRateLimited(key)) {
    return { ok: false, error: "rate_limited" };
  }

  const expected = getCrmAdminSecret();
  if (!expected) {
    console.error("[crm] login rejected: CRM_ADMIN_SECRET is not configured");
    return { ok: false, error: "not_configured" };
  }

  // Never logs the submitted or expected secret — only the outcome.
  if (typeof secret !== "string" || !secretsMatch(secret, expected)) {
    console.error("[crm] login rejected: invalid secret");
    return { ok: false, error: "invalid_secret" };
  }

  resetRateLimit(key);
  await createCrmSession();
  return { ok: true };
}

export async function logout(): Promise<void> {
  await destroyCrmSession();
  redirect("/crm/login");
}
