"use client";

import { useCallback, useId, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/content/types";
import { GERMAN_UNIVERSITIES } from "@/data/german-universities";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EditorialPhoto } from "@/components/ui/EditorialPhoto";
import { UniversityIndex } from "./UniversityIndex";
import { UniversityImagePlaceholder } from "./UniversityImagePlaceholder";

type ExplorerText = Dictionary["home"]["universityExplorer"];

/**
 * German spelling is the source of truth in data/german-universities.ts.
 * Only these two cities have an established, distinct form per locale —
 * every other city (Tübingen, Göttingen, Erlangen, ...) is shown as-is in
 * all three languages, matching this repo's existing city-naming
 * convention (see lib/content/tr.ts).
 */
const CITY_OVERRIDES: Partial<Record<string, Partial<Record<Locale, string>>>> = {
  München: { en: "Munich", tr: "Münih" },
  Köln: { en: "Cologne" },
};

function localizedCityName(city: string, lang: Locale): string {
  return CITY_OVERRIDES[city]?.[lang] ?? city;
}

const SWIPE_THRESHOLD_PX = 40;

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M12.5 5L7.5 10L12.5 15" : "M7.5 5L12.5 10L7.5 15"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The homepage's "explore Germany's ranked universities" section — a
 * one-at-a-time carousel (28 QS-ranked universities, see
 * data/german-universities.ts) plus a searchable browse-all panel. Built
 * as a client component (per lib/content/index.ts's own guidance) that
 * receives its dictionary slice as a prop rather than importing the
 * dictionary module itself, so the other two languages stay out of its
 * bundle; a thin server wrapper (UniversityExplorerSection) does the
 * getDictionary() call.
 */
export function UniversityExplorer({ lang, t }: { lang: Locale; t: ExplorerText }) {
  const universities = GERMAN_UNIVERSITIES;
  const total = universities.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [indexOpen, setIndexOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const indexButtonRef = useRef<HTMLButtonElement>(null);
  const liveRegionId = useId();

  const current = universities[index];
  const city = localizedCityName(current.city, lang);

  const goTo = useCallback(
    (nextIndex: number, dir: "next" | "prev") => {
      setDirection(dir);
      setIndex(((nextIndex % total) + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(index + 1, "next"), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1, "prev"), [goTo, index]);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  }

  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: TouchEvent<HTMLDivElement>) {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null) return;
    const endX = e.changedTouches[0]?.clientX ?? startX;
    const delta = endX - startX;
    if (delta > SWIPE_THRESHOLD_PX) goPrev();
    else if (delta < -SWIPE_THRESHOLD_PX) goNext();
  }

  function handleSelect(selectedIndex: number) {
    setDirection(selectedIndex >= index ? "next" : "prev");
    setIndex(selectedIndex);
    setIndexOpen(false);
    indexButtonRef.current?.focus();
  }

  const slideAnimationClass =
    direction === "next" ? "motion-safe:animate-[uni-slide-from-right_320ms_ease-out]" : "motion-safe:animate-[uni-slide-from-left_320ms_ease-out]";

  return (
    <section className="border-b border-line py-16 sm:py-20">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.description} className="sm:max-w-2xl" />
          <button
            type="button"
            ref={indexButtonRef}
            onClick={() => setIndexOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-[3px] border border-line px-4 py-2.5 font-mono text-xs uppercase tracking-[0.08em] text-ink transition-colors hover:border-accent sm:self-auto"
          >
            {t.indexButtonLabel}
          </button>
        </div>

        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{t.rankingSourceLabel}</p>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={t.title}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-describedby={liveRegionId}
          className="mt-8 rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <div key={current.id} className={"grid grid-cols-1 gap-4 sm:grid-cols-5 " + slideAnimationClass}>
            <div className="relative sm:col-span-3">
              {current.images?.primary ? (
                <EditorialPhoto
                  alt={current.images.primary.alt}
                  ratio="3 / 4"
                  src={current.images.primary.src}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              ) : (
                <UniversityImagePlaceholder
                  ratio="3 / 4"
                  name={current.name}
                  city={city}
                  rankLabel={t.rankLabel}
                  qsRank={current.qsRank}
                  unavailableLabel={t.photoPending}
                />
              )}
              <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 rounded-[3px] border border-line bg-paper/90 px-3.5 py-2.5">
                <span className="min-w-0">
                  <span className="block truncate font-display text-base font-semibold text-ink">{current.name}</span>
                  <span className="block font-mono text-[11px] uppercase tracking-[0.06em] text-muted">{city}</span>
                </span>
                <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-semibold text-accent-ink">
                  {t.rankLabel} #{current.qsRank}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:col-span-2">
              {current.images?.secondary ? (
                <EditorialPhoto
                  alt={current.images.secondary.alt}
                  ratio="1 / 1"
                  src={current.images.secondary.src}
                  sizes="(min-width: 1024px) 25vw, 100vw"
                />
              ) : (
                <UniversityImagePlaceholder
                  ratio="1 / 1"
                  name={current.name}
                  city={city}
                  rankLabel={t.rankLabel}
                  qsRank={current.qsRank}
                  unavailableLabel={t.photoPending}
                />
              )}
              {current.images?.tertiary ? (
                <EditorialPhoto
                  alt={current.images.tertiary.alt}
                  ratio="16 / 10"
                  src={current.images.tertiary.src}
                  sizes="(min-width: 1024px) 25vw, 100vw"
                />
              ) : (
                <UniversityImagePlaceholder
                  ratio="16 / 10"
                  name={current.name}
                  city={city}
                  rankLabel={t.rankLabel}
                  qsRank={current.qsRank}
                  unavailableLabel={t.photoPending}
                />
              )}
            </div>
          </div>
        </div>

        <p id={liveRegionId} aria-live="polite" className="sr-only">
          {current.name}, {city} — {t.rankLabel} #{current.qsRank}, {index + 1}/{total}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              aria-label={t.prevAriaLabel}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronIcon direction="left" />
            </button>
            <span className="font-mono text-xs text-muted" aria-hidden="true">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={goNext}
              aria-label={t.nextAriaLabel}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
          <a
            href={current.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-accent hover:underline"
          >
            {t.exploreCta} ↗
          </a>
        </div>
      </Container>

      <UniversityIndex
        open={indexOpen}
        onClose={() => {
          setIndexOpen(false);
          indexButtonRef.current?.focus();
        }}
        onSelect={handleSelect}
        universities={universities.map((u) => ({ ...u, city: localizedCityName(u.city, lang) }))}
        currentIndex={index}
        title={t.indexTitle}
        searchPlaceholder={t.indexSearchPlaceholder}
        searchAriaLabel={t.indexSearchAriaLabel}
        emptyState={t.indexEmptyState}
        closeLabel={t.indexClose}
        rankLabel={t.rankLabel}
      />
    </section>
  );
}
