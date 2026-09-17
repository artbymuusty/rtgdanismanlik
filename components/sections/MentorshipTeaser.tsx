import { getDictionary } from "@/lib/content";
import { mentors } from "@/lib/content/mentors";
import { demoMentors } from "@/lib/content/mentors.demo";
import { demoContentEnabled } from "@/lib/content/demo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EditorialPhoto } from "@/components/ui/EditorialPhoto";
import { Reveal } from "@/components/ui/Reveal";

export function MentorshipTeaser() {
  const t = getDictionary().home.mentorship;
  const isDemo = mentors.length === 0 && demoContentEnabled;
  const featured = (isDemo ? demoMentors : mentors)[0];

  return (
    <section className="border-b border-line py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <Reveal>
          <h2 className="text-balance font-display text-3xl font-semibold sm:text-4xl">{t.title}</h2>
          <p className="mt-4 max-w-lg text-muted">{t.description}</p>
          <div className="mt-6">
            <Button href="/mentorluk" variant="secondary">
              {t.cta}
            </Button>
          </div>
        </Reveal>

        {featured ? (
          <div className="relative">
            <EditorialPhoto
              src={featured.photoSrc}
              alt={`${featured.name}, ${featured.role}`}
              ratio="4 / 5"
              sizes="(min-width: 1024px) 35vw, 100vw"
            />
            {isDemo ? (
              <span className="absolute right-3 top-3 rounded-full border border-gold bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-gold">
                Örnek
              </span>
            ) : null}
            {featured.quote ? (
              <span className="absolute bottom-3 left-3 right-3 rounded-[3px] border border-line bg-paper/95 px-4 py-3 font-display text-sm italic leading-snug text-ink">
                &ldquo;{featured.quote}&rdquo;
              </span>
            ) : null}
          </div>
        ) : (
          <div className="rounded-[3px] border border-line bg-paper-raised p-8">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-gold">Yaklaşımımız</p>
            <p className="mt-3 font-display text-xl italic text-ink">
              Görevleri başvuru yapmak değil, doğru kararı vermeni kolaylaştırmak.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
