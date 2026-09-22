import "server-only";

/**
 * Best-effort fixed-window rate limiter, per key (typically an IP).
 * In-memory and per server instance — a serverless cold start or a second
 * instance resets it — so this is defense-in-depth, not the sole
 * protection against abuse. Each caller gets its own Map (via
 * createRateLimiter) so limits/state never leak between unrelated
 * features (e.g. CRM login vs. the public contact form).
 */
export function createRateLimiter(windowMs: number, maxAttempts: number) {
  const attempts = new Map<string, { count: number; windowStart: number }>();

  return {
    isRateLimited(key: string): boolean {
      const now = Date.now();
      const entry = attempts.get(key);
      if (!entry || now - entry.windowStart > windowMs) {
        attempts.set(key, { count: 1, windowStart: now });
        return false;
      }
      entry.count++;
      return entry.count > maxAttempts;
    },
    reset(key: string): void {
      attempts.delete(key);
    },
  };
}

/** Vercel sets x-forwarded-for / x-real-ip; falls back to a shared bucket
 * (still throttles overall volume) when neither is present, e.g. locally. */
export function clientKeyFromHeaders(h: Headers): string {
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}
