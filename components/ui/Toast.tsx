"use client";

import { useCallback, useEffect, useState } from "react";

/** Bottom-center transient message — generic, not CRM-specific, so any
 * future page can reuse it. `role="status"` (not "alert") since a toast
 * confirms something that already happened, it doesn't demand immediate
 * attention the way a validation error does. */
export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <div
        role="status"
        className="pointer-events-auto rounded-[3px] border border-line bg-ink px-4 py-2.5 text-sm text-paper shadow-lg motion-safe:animate-[crm-slide-up_180ms_ease-out]"
      >
        {message}
      </div>
    </div>
  );
}

/** Message state + auto-dismiss timer for <Toast>. Kept separate from the
 * component itself so a caller that wants its own layout/positioning can
 * still reuse the state logic. */
export function useToast(durationMs = 4000) {
  const [message, setMessage] = useState<string | null>(null);
  const show = useCallback((next: string) => setMessage(next), []);

  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => setMessage(null), durationMs);
    return () => clearTimeout(id);
  }, [message, durationMs]);

  return { message, show };
}
