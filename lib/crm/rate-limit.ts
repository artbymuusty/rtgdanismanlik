import "server-only";

/**
 * Best-effort login throttle: a fixed window per key (IP, when available).
 * In-memory and per server instance — a serverless cold start or a second
 * instance resets it — so this is defense-in-depth alongside the
 * timing-safe secret comparison and the session cookie, not the sole
 * protection against brute-forcing CRM_ADMIN_SECRET.
 */
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; windowStart: number }>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    attempts.set(key, { count: 1, windowStart: now });
    return false;
  }
  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

export function resetRateLimit(key: string): void {
  attempts.delete(key);
}
