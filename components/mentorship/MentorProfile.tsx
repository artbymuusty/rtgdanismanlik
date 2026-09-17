import type { Mentor } from "@/lib/content/types";
import { EditorialPhoto } from "@/components/ui/EditorialPhoto";

/**
 * Editorial portrait + story layout — a person to know, not a generic
 * "team card." Reuses the same photo/quote/meta language as
 * FeaturedStudentStory so mentors and students read as one visual system.
 */
export function MentorProfile({ mentor, isDemo = false }: { mentor: Mentor; isDemo?: boolean }) {
  return (
    <article className="grid grid-cols-1 gap-8 sm:grid-cols-[0.7fr_1.3fr] sm:items-center sm:gap-10">
      <div className="relative">
        <EditorialPhoto
          src={mentor.photoSrc}
          alt={`${mentor.name}, ${mentor.role}`}
          ratio="4 / 5"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 35vw, 100vw"
        />
        {isDemo ? (
          <span className="absolute right-3 top-3 rounded-full border border-gold bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-gold">
            Örnek
          </span>
        ) : null}
      </div>

      <div>
        <h3 className="font-display text-2xl font-semibold">{mentor.name}</h3>
        <p className="text-sm text-muted">{mentor.role}</p>

        {mentor.quote ? (
          <p className="mt-4 font-display text-lg italic leading-snug text-ink">&ldquo;{mentor.quote}&rdquo;</p>
        ) : null}

        <p className="mt-4 text-ink">{mentor.bio}</p>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5">
          <div>
            <dt className="font-mono text-xs uppercase tracking-[0.08em] text-muted">Almanya deneyimi</dt>
            <dd className="mt-1 text-sm text-ink">{mentor.germanyExperience}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-[0.08em] text-muted">Eğitim geçmişi</dt>
            <dd className="mt-1 text-sm text-ink">{mentor.education}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-[0.08em] text-muted">Uzmanlık alanı</dt>
            <dd className="mt-1 text-sm text-ink">{mentor.specialty}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
