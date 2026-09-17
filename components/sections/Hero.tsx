import Image from "next/image";
import { getDictionary } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  const t = getDictionary().home.hero;

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/berlin-hauptbahnhof.jpg"
          alt="Berlin Hauptbahnhof, Almanya'ya varışın ilk durağı"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/10" />
      </div>

      <Container className="relative py-24 sm:py-32 lg:py-40">
        <div className="max-w-xl rounded-[3px] border border-paper/20 bg-paper/10 p-8 backdrop-blur-md sm:p-10">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-gold">{t.eyebrow}</p>
          <h1 className="max-w-lg text-balance font-display text-4xl font-semibold leading-[1.08] text-paper sm:text-5xl md:text-6xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-md text-lg text-paper/80">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/basvuru">{t.ctaPrimary}</Button>
            <Button
              href="/nasil-yardimci-oluyoruz"
              variant="secondary"
              className="!border-paper/40 !text-paper hover:!bg-paper hover:!text-ink"
            >
              {t.ctaSecondary}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
