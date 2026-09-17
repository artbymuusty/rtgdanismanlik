import { getDictionary } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ServicesOverview() {
  const t = getDictionary();
  const { title, subtitle, cta } = t.home.services;

  return (
    <section className="border-b border-line py-16 sm:py-20">
      <Container>
        <SectionHeading title={title} subtitle={subtitle} />

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((service) => (
            <Card as="li" key={service.slug}>
              <h3 className="font-display text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-muted">{service.shortDescription}</p>
            </Card>
          ))}
        </ul>

        <div className="mt-8">
          <Button href="/nasil-yardimci-oluyoruz" variant="secondary">
            {cta}
          </Button>
        </div>
      </Container>
    </section>
  );
}
