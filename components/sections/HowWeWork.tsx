import { getDictionary } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HowWeWork() {
  const t = getDictionary().home.howWeWork;

  return (
    <section className="border-b border-line bg-paper-raised py-16 sm:py-20">
      <Container>
        <SectionHeading title={t.title} subtitle={t.subtitle} />

        <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((step, index) => (
            <li key={step.title}>
              <span className="font-mono text-sm text-gold">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
