import { getDictionary } from "@/lib/content";
import { EditorialPhoto } from "@/components/ui/EditorialPhoto";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * One strong visual moment rather than a photo in every section — per the
 * "bir section'a fotoğraf koymak zorunda değilsin" brief. Panels render a
 * real photo once one exists at the given path; until then a captioned
 * placeholder names the specific moment that photo will show, so the
 * section reads as an intentional triptych rather than three empty boxes.
 */
export function VisualStorytelling() {
  const t = getDictionary().home.visualStory;

  return (
    <section className="border-b border-line py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.description} />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-5">
          <div className="relative sm:col-span-3">
            <EditorialPhoto alt={t.captions[0]} ratio="3 / 4" src="/images/germany/humboldt-campus.jpg" />
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-line bg-paper/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink">
              {t.captions[0]}
            </span>
          </div>
          <div className="flex flex-col gap-4 sm:col-span-2">
            <div className="relative">
              <EditorialPhoto alt={t.captions[1]} ratio="1 / 1" src="/images/cities/munich.jpg" />
              <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-line bg-paper/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink">
                {t.captions[1]}
              </span>
            </div>
            <div className="relative">
              <EditorialPhoto alt={t.captions[2]} ratio="16 / 10" src="/images/germany/leipzig-library.jpg" />
              <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-line bg-paper/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink">
                {t.captions[2]}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
