import type { Locale } from "./config";
import { locales } from "./config";

/**
 * Every public page, keyed by a stable name. The Turkish path is also the
 * name of the folder under app/[lang]/ (the "internal" path). English
 * visitors see English slugs (/en/how-we-help); proxy.ts rewrites those to
 * the internal folder, so there is one page implementation per route.
 */
export const routes = {
  home: { tr: "", en: "", de: "" },
  services: { tr: "/nasil-yardimci-oluyoruz", en: "/how-we-help", de: "/wie-wir-helfen" },
  mentorship: { tr: "/mentorluk", en: "/mentorship", de: "/mentoring" },
  stories: { tr: "/ogrenci-hikayeleri", en: "/student-stories", de: "/studentenerfolgsgeschichten" },
  about: { tr: "/hakkimizda", en: "/about-us", de: "/ueber-uns" },
  pricing: { tr: "/fiyatlar", en: "/pricing", de: "/preise" },
  faq: { tr: "/sss", en: "/faq", de: "/faq" },
  contact: { tr: "/iletisim", en: "/contact", de: "/kontakt" },
  apply: { tr: "/basvuru", en: "/apply", de: "/bewerben" },
  joinUs: { tr: "/bize-katilin", en: "/join-us", de: "/mach-mit" },
  privacy: { tr: "/gizlilik", en: "/privacy-policy", de: "/datenschutzerklaerung" },
  kvkk: { tr: "/kvkk", en: "/data-protection-notice", de: "/datenschutzhinweis" },
  terms: { tr: "/kullanim-sartlari", en: "/terms-of-use", de: "/nutzungsbedingungen" },
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

/** Strips a leading /tr, /en or /de segment, returning [locale|null, rest]. */
export function splitLocale(pathname: string): [Locale | null, string] {
  const clean = trimSlash(pathname);
  for (const locale of locales) {
    if (clean === `/${locale}`) return [locale, ""];
    if (clean.startsWith(`/${locale}/`)) return [locale, clean.slice(locale.length + 1)];
  }
  return [null, clean === "/" ? "" : clean];
}

/**
 * Which route a path belongs to, accepting any language's slug (and with or
 * without the locale prefix) — so the language switcher, the active-link
 * check and the legacy-URL redirect all resolve pages the same way.
 */
export function routeKeyFromPath(pathname: string): RouteKey | null {
  const [, rest] = splitLocale(pathname);
  for (const key of routeKeys) {
    if (locales.some((locale) => routes[key][locale] === rest)) return key;
  }
  return null;
}

/** The same page in another language ("/en/how-we-help" → "/de/wie-wir-helfen"); home if unknown. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const key = routeKeyFromPath(pathname) ?? "home";
  return localizedPath(to, key);
}
