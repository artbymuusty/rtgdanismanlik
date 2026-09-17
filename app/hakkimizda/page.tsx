import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { EditorialPhoto } from "@/components/ui/EditorialPhoto";
import { Reveal } from "@/components/ui/Reveal";

export function generateMetadata(): Metadata {
  const t = getDictionary().about;
  return { title: t.title, description: t.intro, alternates: { canonical: "/hakkimizda" } };
}

export default function AboutPage() {
  const t = getDictionary().about;

  return (
    <div className="py-16 sm:py-20">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h1 className="text-balance font-display text-4xl font-semibold sm:text-5xl">{t.title}</h1>
          <p className="mt-4 font-display text-xl italic text-muted">{t.intro}</p>
        </div>
        <EditorialPhoto
          src={t.imageSrc ?? "/images/cities/cologne.jpg"}
          alt={t.imageAlt ?? "Köln, Almanya"}
          ratio="4 / 5"
          sizes="(min-width: 1024px) 40vw, 100vw"
          priority
        />
      </Container>

      <Container className="mt-16 max-w-2xl">
        <div className="relative flex flex-col gap-10">
          <div aria-hidden="true" className="absolute bottom-2 left-5 top-2 w-px bg-line" />
          {t.sections.map((section, index) => (
            <Reveal key={section.heading} delay={index * 0.05} className="relative flex gap-6">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper font-mono text-xs text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="pt-1.5">
                <h2 className="font-display text-xl font-semibold sm:text-2xl">{section.heading}</h2>
                <p className="mt-3 text-muted">{section.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
