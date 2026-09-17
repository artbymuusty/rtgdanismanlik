import Image from "next/image";
import { cn } from "@/lib/cn";

/** Deterministic per-instance variation so a page with many placeholders
 * (e.g. 12 student stories) doesn't render 12 identical boxes. */
function focalPoint(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return { x: 62 + (h % 28), y: 60 + ((h >> 5) % 30) };
}

/**
 * Real photo when `src` is provided. Otherwise a map-contour placeholder —
 * concentric rings anchored at a point, like a location marked on a
 * topographic map — echoing the WorldMap motif instead of a generic dot
 * grid. Never a stock photo, never a "missing image" look. Ready to
 * receive real photography (see public/images/{hero,students,mentors,
 * germany,cities}) without any code change: just pass `src`.
 */
export function EditorialPhoto({
  src,
  alt,
  className,
  ratio = "4 / 5",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={cn("group relative overflow-hidden rounded-[3px] border border-line", className)} style={{ aspectRatio: ratio }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  const { x, y } = focalPoint(alt);

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative overflow-hidden rounded-[3px] border border-line bg-paper-raised",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: "radial-gradient(var(--color-line) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: `repeating-radial-gradient(circle at ${x}% ${y}%, transparent 0px, transparent 20px, var(--color-gold) 21px, transparent 22px)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-paper-raised via-transparent to-transparent" />
      <span
        aria-hidden="true"
        className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ left: `${x}%`, top: `${y}%` }}
      />
      <div className="absolute left-0 top-0 h-full w-[3px] bg-accent" />
    </div>
  );
}
