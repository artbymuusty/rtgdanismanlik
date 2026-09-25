import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import { getLang, type LangParams } from "@/lib/i18n/params";
import { pageMetadata } from "@/lib/i18n/metadata";
import { Container } from "@/components/ui/Container";
import { EditorialPhoto } from "@/components/ui/EditorialPhoto";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  const t = getDictionary(lang).about;
  return pageMetadata(lang, "about", { title: t.title, description: t.intro });
}

export default async function AboutPage({ params }: { params: LangParams }) {
  const lang = await getLang(params);
  const t = getDictionary(lang).about;

  return (
    <div className="py-16 sm:py-20">
      {t.imageSrc ? (
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h1 className="text-balance font-display text-4xl font-semibold sm:text-5xl">{t.title}</h1>
            <p className="mt-4 font-display text-xl italic text-muted">{t.intro}</p>
          </div>
          <EditorialPhoto src={t.imageSrc} alt={t.imageAlt ?? ""} ratio="4 / 5" sizes="(min-width: 1024px) 40vw, 100vw" priority />
        </Container>
      ) : (
        // No real, relevant photo exists for this page yet (see the
        // Dictionary["about"] type's own doc comment: "omitted, not stock
        // art, until one exists") — a generic city/landmark photo was
        // deliberately removed rather than kept as filler (V1.1 visual
        // trust revision). A strong, single-column text composition
        // carries the hero instead of pairing it with an unrelated image.
        <Container className="max-w-3xl border-l-2 border-accent pl-6 sm:pl-10">
          <h1 className="text-balance font-display text-4xl font-semibold sm:text-5xl">{t.title}</h1>
          <p className="mt-6 text-balance font-display text-2xl italic leading-snug text-ink sm:text-3xl">{t.intro}</p>
        </Container>
      )}

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
