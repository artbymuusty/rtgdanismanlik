import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { CRM_SESSION_TTL_SECONDS } from "./config";

/**
 * A minimal signed, stateless session token — no session store needed for a
 * single shared admin secret. Format: "<base64url(payload)>.<base64url(hmac)>".
 * The payload only ever carries a timestamp; nothing derived from user input
 * goes into it, so there's nothing here for an attacker to control.
 */
interface SessionPayload {
  iat: number; // issued-at, epoch seconds
  exp: number; // expiry, epoch seconds
}

function b64url(input: Buffer): string {
  return input.toString("base64url");
}

function sign(payload: string, secret: string): string {
  return b64url(createHmac("sha256", secret).update(payload).digest());
}

export function createSessionToken(secret: string, now = Date.now()): string {
  const iat = Math.floor(now / 1000);
  const payload: SessionPayload = { iat, exp: iat + CRM_SESSION_TTL_SECONDS };
  const encoded = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  return `${encoded}.${sign(encoded, secret)}`;
}

/** Verifies signature and expiry. Never throws — a malformed/tampered/expired
 * token is simply invalid, same as a missing one. */
export function verifySessionToken(token: string | undefined | null, secret: string, now = Date.now()): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [encoded, signature] = parts;

  let expectedSig: string;
  try {
    expectedSig = sign(encoded, secret);
  } catch {
    return false;
  }
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<SessionPayload>;
    if (typeof payload.exp !== "number") return false;
    return Math.floor(now / 1000) < payload.exp;
  } catch {
    return false;
  }
}

/** Constant-time secret comparison for the login form — a plain `===` on a
 * short-circuiting string compare would leak timing information about how
 * many leading characters matched. */
export function secretsMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // Compare against a fixed-length buffer first so an empty/short `a` still
  // takes the same code path length as a correct one (no early return).
  const padded = Buffer.alloc(bufB.length);
  bufA.copy(padded, 0, 0, Math.min(bufA.length, bufB.length));
  return bufA.length === bufB.length && timingSafeEqual(padded, bufB);
}
