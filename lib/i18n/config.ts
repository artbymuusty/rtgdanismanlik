/**
 * The site's three languages. Turkish is the original language of every
 * page; German is shown to visitors from Germany, Austria and Switzerland,
 * English to everyone else outside Türkiye (see detect.ts).
 */
export const locales = ["tr", "en", "de"] as const;
export type Locale = (typeof locales)[number];

/** Used when a request carries no usable country signal — including crawlers.
 * The public site's safe/default language is Turkish. */
export const fallbackLocale: Locale = "tr";

/** Remembers a visitor's explicit language choice (set by the language
 * switcher) so it wins over automatic detection on later visits. Name
 * follows the Next.js i18n convention. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** BCP 47 tag for <html lang>, Open Graph and date formatting. */
export const htmlLang: Record<Locale, string> = { tr: "tr", en: "en", de: "de" };
export const ogLocale: Record<Locale, string> = { tr: "tr_TR", en: "en_US", de: "de_DE" };
export const dateLocale: Record<Locale, string> = { tr: "tr-TR", en: "en-GB", de: "de-DE" };
