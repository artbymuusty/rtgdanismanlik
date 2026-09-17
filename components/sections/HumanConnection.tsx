import { getDictionary } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EditorialPhoto } from "@/components/ui/EditorialPhoto";
import { Reveal } from "@/components/ui/Reveal";

export function HumanConnection() {
  const t = getDictionary().home.humanConnection;

  return (
    <section className="border-b border-line py-16 sm:py-20">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="relative">
          <EditorialPhoto
            src={t.imageSrc}
            alt={t.imageAlt}
            ratio="4 / 3"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
          <span className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-line bg-paper/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink">
            {t.metadata}
          </span>
        </div>

        <Reveal className="lg:max-w-sm">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">{t.eyebrow}</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold leading-[1.15] sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-5 text-muted">{t.description}</p>
          <div className="mt-7">
            <Button href="/basvuru">{t.cta}</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
