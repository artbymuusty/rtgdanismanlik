import { fallbackLocale, isLocale, type Locale } from "./config";

export interface LocaleSignals {
  /** Value of the NEXT_LOCALE cookie, if any. */
  cookie?: string | null;
  /** ISO 3166-1 alpha-2 country from the edge (x-vercel-ip-country). */
  country?: string | null;
}

/**
 * Picks the language for a visitor who arrives without a locale in the URL.
 * Order, first match wins:
 *   1. An explicit earlier choice (cookie) — always respected.
 *   2. Country is Türkiye → Turkish.
 *   3. Country is Germany, Austria, or Switzerland → German.
 *   4. Any other known country → English.
 *   5. No country signal (including crawlers) → Turkish, the safe fallback.
 */
export function detectLocale({ cookie, country }: LocaleSignals): Locale {
  if (isLocale(cookie)) return cookie;

  const code = country?.trim().toUpperCase();
  if (code === "TR") return "tr";
  if (code === "DE" || code === "AT" || code === "CH") return "de";
  if (code) return "en";

  return fallbackLocale;
}
