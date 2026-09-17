import type { StudentStory } from "@/lib/content/types";
import { EditorialPhoto } from "@/components/ui/EditorialPhoto";

/**
 * Compact carousel-item variant — the rich four-field narrative lives on
 * FeaturedStudentStory instead, so this card stays scannable at a glance.
 */
export function StudentStoryCard({
  story,
  isDemo = false,
  priority = false,
}: {
  story: StudentStory;
  isDemo?: boolean;
  priority?: boolean;
}) {
  return (
    <article>
      <div className="relative">
        <EditorialPhoto
          src={story.photoSrc}
          alt={`${story.name}, ${story.university}`}
          ratio="3 / 4"
          priority={priority}
          sizes="300px"
        />
        {isDemo ? (
          <span className="absolute right-3 top-3 rounded-full border border-gold bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-gold">
            Örnek
          </span>
        ) : null}
        <span className="absolute bottom-3 left-3 rounded-full border border-line bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ink">
          {story.city} · {story.year}
        </span>
      </div>

      <p className="mt-4 line-clamp-3 font-display text-base italic leading-snug text-ink">&ldquo;{story.quote}&rdquo;</p>
      <p className="mt-2 text-sm text-muted">
        {story.name} · {story.university}
      </p>
    </article>
  );
}
