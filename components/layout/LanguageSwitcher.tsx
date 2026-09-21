"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { switchLocalePath } from "@/lib/i18n/routes";
import { cn } from "@/lib/cn";

/**
 * TR | EN | DE toggle. Country detection can be wrong (a Turkish student living
 * in Germany, a German reading the Turkish site), so the visitor can always
 * pick a language; the choice is stored in a cookie that proxy.ts honours
 * ahead of any automatic detection on later visits.
 */
export function LanguageSwitcher({
  lang,
  label,
  names,
}: {
  lang: Locale;
  label: string;
  names: Record<Locale, string>;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="flex items-center rounded-full border border-line p-0.5 text-xs font-medium">
      {locales.map((locale) => {
        const isCurrent = locale === lang;
        const classes = cn(
          "flex h-10 min-w-10 items-center justify-center rounded-full px-2.5 font-mono uppercase tracking-[0.06em] transition-colors",
          isCurrent ? "bg-accent text-accent-ink" : "text-ink hover:text-accent active:opacity-60",
        );

        if (isCurrent) {
          return (
            <span key={locale} aria-current="true" title={names[locale]} className={classes}>
              <span aria-hidden="true">{locale}</span>
              <span className="sr-only">{names[locale]}</span>
            </span>
          );
        }

        const destination = switchLocalePath(pathname, locale);
        return (
          <a
            key={locale}
            href={`/api/locale?locale=${locale}&next=${encodeURIComponent(destination)}`}
            hrefLang={locale}
            lang={locale}
            title={names[locale]}
            className={classes}
          >
            <span aria-hidden="true">{locale}</span>
            <span className="sr-only">{names[locale]}</span>
          </a>
        );
      })}
    </nav>
  );
}
