import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function generateMetadata(): Metadata {
  const t = getDictionary().pricing;
  return { title: t.title, description: t.intro, alternates: { canonical: "/fiyatlar" } };
}

export default function PricingPage() {
  const t = getDictionary().pricing;
  const services = getDictionary().services.items;

  const serviceTitle = (slug: string) => services.find((s) => s.slug === slug)?.title ?? slug;

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="text-balance font-display text-4xl font-semibold sm:text-5xl">{t.title}</h1>
        <p className="mt-4 font-display text-xl italic text-muted">{t.intro}</p>
      </Container>

      <Container className="mt-12 max-w-3xl">
        <div className="rounded-[3px] border border-line bg-paper-raised p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-gold">{t.intake.eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">{t.intake.title}</h2>
          <p className="mt-3 text-muted">{t.intake.description}</p>
          <div className="mt-5">
            <Button href="/basvuru" className="!px-4 !py-2.5 text-sm">
              {t.intake.cta}
            </Button>
          </div>
        </div>
      </Container>

      <Container className="mt-16">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t.tiersTitle}</h2>
        <p className="mt-2 max-w-2xl text-muted">{t.tiersSubtitle}</p>

        <div className="mt-10 flex flex-col">
          {t.tiers.map((tier, index) => (
            <article
              key={tier.id}
              className="grid grid-cols-1 gap-6 border-t border-line py-10 first:border-t-0 first:pt-0 lg:grid-cols-[1fr_1fr]"
            >
              <div>
                <span className="font-mono text-sm text-gold">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-2xl font-semibold">{tier.name}</h3>
                <p className="mt-1 text-sm uppercase tracking-[0.08em] text-muted">{tier.tagline}</p>
                <p className="mt-4 text-ink">{tier.description}</p>
                <p className="mt-4 text-sm text-muted">{tier.idealFor}</p>
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">Bu kapsamda</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {tier.includes.map((slug) => (
                      <li key={slug} className="flex items-start gap-2 text-sm text-ink">
                        <span aria-hidden="true" className="mt-1 text-accent">
                          —
                        </span>
                        {serviceTitle(slug)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5">
                  <p className="font-mono text-sm text-muted">{tier.priceLabel}</p>
                  <Button href="/basvuru" variant="secondary" className="!px-4 !py-2.5 text-sm">
                    {tier.cta}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>

      <Container className="mt-16">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t.comparisonTitle}</h2>
        <p className="mt-2 max-w-2xl text-muted">{t.comparisonNote}</p>

        <div className="mt-8 overflow-x-auto rounded-[3px] border border-line">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-paper-raised">
                <th scope="col" className="px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.08em] text-muted">
                  Hizmet
                </th>
                {t.tiers.map((tier) => (
                  <th
                    key={tier.id}
                    scope="col"
                    className="px-4 py-3 text-left font-display text-base font-semibold text-ink"
                  >
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.slug} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-4 py-3 text-left font-normal text-ink">
                    {service.title}
                  </th>
                  {t.tiers.map((tier) => {
                    const included = tier.includes.includes(service.slug);
                    return (
                      <td key={tier.id} className="px-4 py-3 text-accent">
                        {included ? (
                          <span aria-label="Dahil">✓</span>
                        ) : (
                          <span aria-hidden="true" className="text-line">
                            —
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-line bg-paper-raised">
                <th scope="row" className="px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.08em] text-muted">
                  Ücret
                </th>
                {t.tiers.map((tier) => (
                  <td key={tier.id} className="px-4 py-3 text-sm text-muted">
                    {tier.priceLabel}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="mt-6 max-w-2xl font-display text-base italic text-muted">{t.honestyNote}</p>
      </Container>

      <Container className="mt-16 max-w-2xl rounded-[3px] border border-accent bg-paper-raised p-8 text-center">
        <h2 className="font-display text-2xl font-semibold">{t.cta.title}</h2>
        <p className="mt-3 text-muted">{t.cta.description}</p>
        <div className="mt-6">
          <Button href="/basvuru">{t.cta.label}</Button>
        </div>
      </Container>
    </div>
  );
}
