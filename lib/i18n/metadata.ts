import type { Metadata } from "next";
import { locales, type Locale } from "./config";
import { localizedPath, type RouteKey } from "./routes";

/**
 * Title/description plus the canonical URL and hreflang alternates for one
 * page, so search engines serve each visitor the right language version and
 * never treat the two as duplicates.
 */
export function pageMetadata(
  lang: Locale,
  key: RouteKey,
  { title, description }: { title: string; description: string },
): Metadata {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[locale] = localizedPath(locale, key);
  languages["x-default"] = localizedPath("en", key);

  return {
    title,
    description,
    alternates: { canonical: localizedPath(lang, key), languages },
  };
}
