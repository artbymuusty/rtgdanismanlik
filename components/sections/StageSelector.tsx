"use client";

import { useState } from "react";
import { getDictionary } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

export function StageSelector() {
  const t = getDictionary().home.stageSelector;
  const allStages = [...t.stages, t.fallback];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = allStages.find((stage) => stage.id === selectedId) ?? null;

  return (
    <section className="border-b border-line bg-paper-raised py-16 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="text-balance font-display text-3xl font-semibold sm:text-4xl">{t.title}</h2>
          <p className="mt-2 max-w-xl text-muted">{t.subtitle}</p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" role="radiogroup" aria-label={t.title}>
          {allStages.map((stage) => {
            const isSelected = stage.id === selectedId;
            return (
              <button
                key={stage.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedId(stage.id)}
                className={cn(
                  "rounded-[3px] border px-4 py-4 text-left text-sm font-medium transition-colors",
                  isSelected
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line bg-paper text-ink hover:border-accent",
                )}
              >
                {stage.label}
              </button>
            );
          })}
        </div>

        {selected ? (
          <div className="mt-6 rounded-[3px] border border-accent bg-paper p-6 sm:p-8">
            <p className="max-w-2xl text-ink">{selected.description}</p>
            <div className="mt-5">
              <Button href={`/basvuru?asama=${selected.id}`}>{selected.cta}</Button>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
