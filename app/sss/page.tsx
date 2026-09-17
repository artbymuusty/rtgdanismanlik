import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import { Container } from "@/components/ui/Container";

export function generateMetadata(): Metadata {
  const t = getDictionary().faq;
  return { title: t.title, description: t.intro, alternates: { canonical: "/sss" } };
}

export default function FaqPage() {
  const t = getDictionary().faq;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const categories = Array.from(new Set(t.items.map((item) => item.category)));

  return (
    <div className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="max-w-3xl">
        <h1 className="text-balance font-display text-4xl font-semibold sm:text-5xl">{t.title}</h1>
        <p className="mt-4 text-lg text-muted">{t.intro}</p>
      </Container>

      <Container className="mt-14 max-w-3xl flex flex-col gap-12">
        {categories.map((category) => (
          <div key={category}>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-gold">{category}</p>
            <div className="mt-4 flex flex-col divide-y divide-line border-y border-line">
              {t.items
                .filter((item) => item.category === category)
                .map((item) => (
                  <details key={item.question} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-medium transition-colors hover:text-accent">
                      {item.question}
                      <span className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-45 group-open:text-accent">
                        +
                      </span>
                    </summary>
                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <p className="mt-3 text-muted">{item.answer}</p>
                      </div>
                    </div>
                  </details>
                ))}
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
