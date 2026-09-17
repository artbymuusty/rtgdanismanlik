import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EditorialPhoto } from "@/components/ui/EditorialPhoto";
import { cn } from "@/lib/cn";

export function generateMetadata(): Metadata {
  const t = getDictionary().services;
  return { title: t.title, description: t.intro, alternates: { canonical: "/nasil-yardimci-oluyoruz" } };
}

export default function ServicesPage() {
  const t = getDictionary().services;

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="text-balance font-display text-4xl font-semibold sm:text-5xl">{t.title}</h1>
        <p className="mt-4 text-lg text-muted">{t.intro}</p>
      </Container>

      <Container className="mt-16 flex flex-col gap-16">
        {t.items.map((service, index) => {
          const reverse = index % 2 === 1;
          return (
            <article
              key={service.slug}
              id={service.slug}
              className="border-t border-line pt-14 first:border-t-0 first:pt-0"
            >
              <div
                className={cn(
                  "grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14",
                  reverse && "lg:grid-cols-[1.15fr_0.85fr]",
                )}
              >
                <div className={cn("relative", reverse && "lg:order-2")}>
                  <EditorialPhoto alt={service.title} ratio="4 / 3" />
                  <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper/90 font-mono text-xs text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className={reverse ? "lg:order-1" : undefined}>
                  <h2 className="font-display text-2xl font-semibold sm:text-3xl">{service.title}</h2>
                  <p className="mt-3 font-display text-lg italic text-muted">{service.shortDescription}</p>

                  <div className="mt-6 flex flex-col gap-5 border-t border-line pt-6">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">Problem</p>
                      <p className="mt-1 text-ink">{service.problem}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">Nasıl yardımcı oluyoruz</p>
                      <p className="mt-1 text-ink">{service.help}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">Kimler için</p>
                      <p className="mt-1 text-ink">{service.forWhom}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-6 border-t border-line pt-6 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">Süreç</p>
                      <ol className="mt-2 flex flex-col gap-2">
                        {service.process.map((step, stepIndex) => (
                          <li key={step} className="flex gap-3 text-sm text-ink">
                            <span className="font-mono text-muted">{stepIndex + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">Kapsam</p>
                      <p className="mt-1 text-sm text-muted">{service.scope}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button href="/basvuru" variant="secondary" className="!px-4 !py-2.5 text-sm">
                      {service.nextStep}
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </Container>
    </div>
  );
}
