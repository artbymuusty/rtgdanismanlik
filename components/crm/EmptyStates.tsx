"use client";

import { crmErrorMessage, isSessionError } from "@/lib/crm/error-messages";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/cn";

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2 p-4" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 animate-pulse rounded-[3px] bg-paper-raised" style={{ animationDelay: `${i * 40}ms` }} />
      ))}
    </div>
  );
}

export function EmptyResult({ hasFilters, onClearFilters }: { hasFilters: boolean; onClearFilters: () => void }) {
  return (
    <EmptyState
      title={hasFilters ? "Bu filtrelerle eşleşen lead yok." : "Henüz hiç lead yok."}
      description={hasFilters ? "Arama ve filtre kombinasyonunu gevşetmeyi dene." : "Website'den yeni bir başvuru geldiğinde burada görünecek."}
      action={
        hasFilters ? (
          <Button variant="secondary" onClick={onClearFilters} className="!px-4 !py-2 text-sm">
            Filtreleri temizle
          </Button>
        ) : undefined
      }
    />
  );
}

export function ErrorBanner({ error, onRetry, onGoToLogin }: { error: string; onRetry?: () => void; onGoToLogin?: () => void }) {
  const sessionExpired = isSessionError(error);
  return (
    <div className="mx-4 my-4 flex flex-col items-start gap-3 rounded-[3px] border border-danger/40 bg-danger/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-ink">{crmErrorMessage(error)}</p>
      <div className="flex shrink-0 gap-2">
        {sessionExpired && onGoToLogin ? (
          <Button variant="secondary" onClick={onGoToLogin} className="!px-3 !py-1.5 text-xs">
            Tekrar giriş yap
          </Button>
        ) : onRetry ? (
          <Button variant="secondary" onClick={onRetry} className="!px-3 !py-1.5 text-xs">
            Tekrar dene
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function SaveIndicator({ state }: { state: "idle" | "saving" | "saved" | "error" }) {
  if (state === "idle") return null;
  return (
    <span
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.08em]",
        state === "saving" && "text-muted",
        state === "saved" && "text-accent",
        state === "error" && "text-danger",
      )}
    >
      {state === "saving" ? "Kaydediliyor..." : state === "saved" ? "Kaydedildi" : "Kaydedilemedi"}
    </span>
  );
}
