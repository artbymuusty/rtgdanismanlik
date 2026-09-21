import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { localizedPath, routeKeys } from "@/lib/i18n/routes";
import { siteConfig } from "@/lib/site-config";

// One entry per page per language, each listing its translations so search
// engines connect the Turkish, English and German versions of the same page.
export default function sitemap(): MetadataRoute.Sitemap {
  return routeKeys.flatMap((key) =>
    locales.map((lang) => ({
      url: `${siteConfig.url}${localizedPath(lang, key)}`,
      lastModified: new Date(),
      changeFrequency: key === "home" ? ("weekly" as const) : ("monthly" as const),
      priority: key === "home" ? 1 : 0.6,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}${localizedPath(l, key)}`])),
          "x-default": `${siteConfig.url}${localizedPath("en", key)}`,
        },
      },
    })),
  );
}
