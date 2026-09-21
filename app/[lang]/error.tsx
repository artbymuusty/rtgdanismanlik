"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { errorMessages } from "@/lib/content/error-messages";
import { fallbackLocale } from "@/lib/i18n/config";
import { localizedPath, splitLocale } from "@/lib/i18n/routes";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [locale] = splitLocale(usePathname());
  const lang = locale ?? fallbackLocale;
  const t = errorMessages[lang];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-24 sm:py-32">
      <Container className="max-w-xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">{t.eyebrow}</p>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold sm:text-5xl">{t.title}</h1>
        <p className="mt-4 text-lg text-muted">{t.description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>{t.retry}</Button>
          <Button href={localizedPath(lang, "home")} variant="secondary">
            {t.home}
          </Button>
        </div>
      </Container>
    </div>
  );
}
