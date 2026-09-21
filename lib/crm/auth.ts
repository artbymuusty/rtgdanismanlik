import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CRM_SESSION_COOKIE, CRM_SESSION_TTL_SECONDS, getCrmAdminSecret } from "./config";
import { createSessionToken, verifySessionToken } from "./session";

/** True once a valid, unexpired session cookie is present. Never throws —
 * a missing CRM_ADMIN_SECRET (misconfiguration) simply means "not
 * authenticated", the same as a bad cookie; it never falls open. */
export async function hasCrmSession(): Promise<boolean> {
  const secret = getCrmAdminSecret();
  if (!secret) return false;
  const jar = await cookies();
  return verifySessionToken(jar.get(CRM_SESSION_COOKIE)?.value, secret);
}

/** Guard for every CRM server action and the /crm page itself. Redirects to
 * /crm/login (not a bare 401) since these are called from Server Components
 * / Server Actions serving a browser tab, not a JSON API client. */
export async function requireCrmSession(): Promise<void> {
  if (!(await hasCrmSession())) redirect("/crm/login");
}

/** Same check for a data-returning server action, where a redirect would be
 * the wrong shape for the caller (it expects `{ok, error}`, not a thrown
 * navigation). Use this in app/crm/actions.ts; use requireCrmSession() in
 * the page component instead. */
export async function isCrmSessionValid(): Promise<boolean> {
  return hasCrmSession();
}

export async function createCrmSession(): Promise<void> {
  const secret = getCrmAdminSecret();
  if (!secret) throw new Error("CRM_ADMIN_SECRET is not configured");
  const jar = await cookies();
  jar.set(CRM_SESSION_COOKIE, createSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CRM_SESSION_TTL_SECONDS,
  });
}

export async function destroyCrmSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(CRM_SESSION_COOKIE);
}
