"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "framer-motion";
import type { StudentStory } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { StudentStoryCard } from "./StudentStoryCard";

const GAP_PX = 20; // matches gap-5

const arrowButtonClasses =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] border border-ink text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink";

/**
 * A bounded (never infinite) horizontal carousel built on native scroll +
 * scroll-snap: the track's own overflow-x-auto clips its content, so no
 * matter how wide the row of cards gets the page's own scrollWidth never
 * grows past window.innerWidth. Arrow clicks call scrollBy; touch swipe and
 * keyboard both drive the same native scroll position, so there is exactly
 * one source of truth for "where the carousel is."
 */
export function StudentStoryCarousel({ stories, isDemo }: { stories: StudentStory[]; isDemo: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(stories.length <= 1);
  const reduceMotion = useReducedMotion();

  const cardStep = useCallback(() => {
    const el = trackRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    return (card?.offsetWidth ?? 300) + GAP_PX;
  }, []);

  const updateBounds = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
  }, []);

  const onScroll = useCallback(() => {
    updateBounds();
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      const el = trackRef.current;
      if (!el) return;
      setIndex(Math.round(el.scrollLeft / cardStep()));
    }, 120);
  }, [cardStep, updateBounds]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateBounds();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [onScroll, updateBounds]);

  const scrollByCards = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * cardStep(), behavior: reduceMotion ? "auto" : "smooth" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByCards(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByCards(-1);
    }
  };

  if (stories.length === 0) return null;

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Diğer öğrenci hikâyeleri">
      <div className="mb-5 flex items-center justify-between">
        <p aria-live="polite" className="font-mono text-xs tabular-nums text-muted">
          {String(index + 1).padStart(2, "0")}/{String(stories.length).padStart(2, "0")}
        </p>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            aria-label="Önceki öğrenci hikâyesi"
            disabled={atStart}
            onClick={() => scrollByCards(-1)}
            className={arrowButtonClasses}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            aria-label="Sonraki öğrenci hikâyesi"
            disabled={atEnd}
            onClick={() => scrollByCards(1)}
            className={arrowButtonClasses}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={cn(
          "flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {stories.map((story, i) => (
          <div key={story.id} className="w-[min(78vw,300px)] shrink-0 snap-start">
            <StudentStoryCard story={story} isDemo={isDemo} priority={i === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}
