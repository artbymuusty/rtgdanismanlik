import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { EditorialPhoto } from "@/components/ui/EditorialPhoto";
import { MentorApplicationForm } from "@/components/recruitment/MentorApplicationForm";

export function generateMetadata(): Metadata {
  const t = getDictionary().bizeKatilin;
  return { title: t.title, description: t.intro, alternates: { canonical: "/bize-katilin" } };
}

export default function JoinUsPage() {
  const t = getDictionary().bizeKatilin;

  return (
    <div className="py-16 sm:py-20">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-gold">{t.eyebrow}</p>
          <h1 className="text-balance font-display text-4xl font-semibold leading-[1.1] sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{t.intro}</p>
        </div>

        <div className="relative">
          <EditorialPhoto alt={t.imageCaption} ratio="4 / 5" src="/images/hero/berlin-hauptbahnhof.jpg" priority />
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-line bg-paper/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink">
            {t.imageCaption}
          </span>
        </div>
      </Container>

      <Container className="mt-16 max-w-3xl">
        <div className="flex flex-col gap-10">
          {t.sections.map((section) => (
            <div key={section.heading} className="border-t border-line pt-8 first:border-t-0 first:pt-0">
              <h2 className="font-display text-xl font-semibold">{section.heading}</h2>
              <p className="mt-3 text-muted">{section.body}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-gold">Başvuru</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">{t.formTitle}</h2>
          <p className="mt-3 max-w-sm text-muted">{t.formDescription}</p>
        </div>
        <MentorApplicationForm />
      </Container>
    </div>
  );
}
