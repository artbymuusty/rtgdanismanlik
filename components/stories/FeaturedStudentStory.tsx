import type { Dictionary, StudentStory } from "@/lib/content/types";
import { EditorialPhoto } from "@/components/ui/EditorialPhoto";
import { cn } from "@/lib/cn";

export function FeaturedStudentStory({
  story,
  isDemo = false,
  reverse = false,
  label,
  t,
  sample,
}: {
  story: StudentStory;
  isDemo?: boolean;
  reverse?: boolean;
  /** Overrides the default "featured story" eyebrow (the stories page shows city · field instead). */
  label?: string;
  t: Pick<Dictionary["stories"], "featuredLabel" | "startedFrom" | "stepsTaken" | "nowWhere">;
  sample: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14",
        reverse && "lg:grid-cols-[1.15fr_0.85fr]",
      )}
    >
      <div className={cn("relative", reverse && "lg:order-2")}>
        <EditorialPhoto
          src={story.photoSrc}
          alt={`${story.name}, ${story.university}`}
          ratio="4 / 5"
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
        />
        {isDemo ? (
          <span className="absolute right-4 top-4 rounded-full border border-gold bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-gold">
            {sample}
          </span>
        ) : null}
        <span className="absolute bottom-4 left-4 rounded-full border border-line bg-paper/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink">
          {story.city} · {story.year}
        </span>
      </div>

      <div className={reverse ? "lg:order-1" : undefined}>
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-gold">{label ?? t.featuredLabel}</p>
        <p className="mt-4 text-balance font-display text-2xl italic leading-snug text-ink sm:text-3xl">
          &ldquo;{story.quote}&rdquo;
        </p>
        <p className="mt-4 font-semibold text-ink">{story.name}</p>
        <p className="text-sm text-muted">
          {story.university} · {story.field}
        </p>

        <div className="mt-8 flex flex-col gap-5 border-t border-line pt-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{t.startedFrom}</p>
            <p className="mt-1 text-ink">{story.startingPoint}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{t.stepsTaken}</p>
            <p className="mt-1 text-ink">{story.stepsTaken}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{t.nowWhere}</p>
            <p className="mt-1 text-ink">{story.now}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
