import { getDictionary } from "@/lib/content";
import { whatsappLinkFor } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function FinalCta() {
  const t = getDictionary().home.finalCta;
  const whatsapp = whatsappLinkFor();

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper sm:py-28">
      <svg
        aria-hidden="true"
        viewBox="0 0 800 400"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
      >
        <path
          d="M40 340 Q 300 60 760 90"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1.4"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
        <circle cx="40" cy="340" r="4" fill="var(--color-paper)" />
        <circle cx="760" cy="90" r="4" fill="var(--color-gold)" />
      </svg>

      <Container className="relative max-w-2xl text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-gold">Nereden Olursan Ol · Almanya</p>
        <h2 className="text-balance font-display text-4xl font-semibold sm:text-5xl">{t.title}</h2>
        <p className="mt-4 text-lg text-paper/75">{t.description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/basvuru">{t.ctaPrimary}</Button>
          {whatsapp ? (
            <Button href={whatsapp} variant="secondary" className="!border-paper !text-paper hover:!bg-paper hover:!text-ink">
              {t.ctaSecondary}
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
