import type { Locale } from "./config";
import { locales } from "./config";

/**
 * Every public page, keyed by a stable name. The Turkish path is also the
 * name of the folder under app/[lang]/ (the "internal" path). English
 * visitors see English slugs (/en/how-we-help); proxy.ts rewrites those to
 * the internal folder, so there is one page implementation per route.
 */
export const routes = {
  home: { tr: "", en: "" },
  services: { tr: "/nasil-yardimci-oluyoruz", en: "/how-we-help" },
  mentorship: { tr: "/mentorluk", en: "/mentorship" },
  stories: { tr: "/ogrenci-hikayeleri", en: "/student-stories" },
  about: { tr: "/hakkimizda", en: "/about-us" },
  pricing: { tr: "/fiyatlar", en: "/pricing" },
  faq: { tr: "/sss", en: "/faq" },
  contact: { tr: "/iletisim", en: "/contact" },
  apply: { tr: "/basvuru", en: "/apply" },
  joinUs: { tr: "/bize-katilin", en: "/join-us" },
  privacy: { tr: "/gizlilik", en: "/privacy-policy" },
  kvkk: { tr: "/kvkk", en: "/data-protection-notice" },
  terms: { tr: "/kullanim-sartlari", en: "/terms-of-use" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;
export const routeKeys = Object.keys(routes) as RouteKey[];

/** Public, locale-prefixed path for a route: localizedPath("en", "apply") → "/en/apply". */
export function localizedPath(lang: Locale, key: RouteKey): string {
  return `/${lang}${routes[key][lang]}`;
}

/** Folder path under app/[lang]/ that implements a route. */
export function internalPath(lang: Locale, key: RouteKey): string {
  return `/${lang}${routes[key].tr}`;
}

function trimSlash(path: string): string {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

/** Strips a leading /tr or /en segment, returning [locale|null, rest]. */
export function splitLocale(pathname: string): [Locale | null, string] {
  const clean = trimSlash(pathname);
  for (const locale of locales) {
    if (clean === `/${locale}`) return [locale, ""];
    if (clean.startsWith(`/${locale}/`)) return [locale, clean.slice(locale.length + 1)];
  }
  return [null, clean === "/" ? "" : clean];
}

/**
 * Which route a path belongs to, accepting either language's slug (and with
 * or without the locale prefix) — so the language switcher, the active-link
 * check and the legacy-URL redirect all resolve pages the same way.
 */
export function routeKeyFromPath(pathname: string): RouteKey | null {
  const [, rest] = splitLocale(pathname);
  for (const key of routeKeys) {
    if (routes[key].tr === rest || routes[key].en === rest) return key;
  }
  return null;
}

/** The same page in another language ("/en/how-we-help" → "/tr/nasil-yardimci-oluyoruz"); home if unknown. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const key = routeKeyFromPath(pathname) ?? "home";
  return localizedPath(to, key);
}
