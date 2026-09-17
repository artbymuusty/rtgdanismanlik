import { getDictionary } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { WorldMap } from "@/components/ui/WorldMap";

export function Journey() {
  const t = getDictionary().home.journey;

  return (
    <section className="border-b border-line bg-paper-raised py-16 sm:py-24">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-gold">{t.eyebrow}</p>
          <h2 className="text-balance font-display text-3xl font-semibold sm:text-4xl">{t.title}</h2>
          <p className="mt-4 max-w-md text-muted">{t.description}</p>
        </Reveal>
        <WorldMap />
      </Container>
    </section>
  );
}
