"use client";

import { useParams } from "next/navigation";
import { fallbackLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";
import type { Dictionary } from "@/lib/content/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Next.js gives not-found.tsx no route params, so the server file passes both
 * languages' (small) messages and this client component picks the one that
 * matches the URL's [lang] segment.
 */
export function LocalizedNotFound({ messages }: { messages: Record<Locale, Dictionary["common"]["notFound"]> }) {
  const params = useParams<{ lang?: string }>();
  const lang = isLocale(params.lang) ? params.lang : fallbackLocale;
  const t = messages[lang];

  return (
    <div className="py-24 sm:py-32">
      <Container className="max-w-xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">{t.eyebrow}</p>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold sm:text-5xl">{t.title}</h1>
        <p className="mt-4 text-lg text-muted">{t.description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={localizedPath(lang, "home")}>{t.home}</Button>
          <Button href={localizedPath(lang, "contact")} variant="secondary">
            {t.contact}
          </Button>
        </div>
      </Container>
    </div>
  );
}
