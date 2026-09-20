import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function JoinUsCta({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).joinUsCta;

  return (
    <section className="border-b border-line bg-paper-raised py-16 sm:py-20">
      <Container className="max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-gold">{t.eyebrow}</p>
        <h2 className="mt-3 text-balance font-display text-3xl font-semibold sm:text-4xl">{t.title}</h2>
        <p className="mt-4 text-muted">{t.description}</p>
        <div className="mt-6">
          <Button href={localizedPath(lang, "joinUs")} variant="secondary">
            {t.cta}
          </Button>
        </div>
      </Container>
    </section>
  );
}
