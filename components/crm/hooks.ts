"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/**
 * Per-browser UI preference (visible columns, custom saved views, the
 * "acting as" name) — never CRM lead data. Guarded against a blocked/absent
 * localStorage (private browsing, storage-partitioning edge cases): the
 * component still works, it just doesn't remember the preference.
 */
export function useLocalStorageState<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setAndPersist = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === "function" ? (value as (p: T) => T)(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Storage full/blocked: the in-memory state still updates for this session.
        }
        return next;
      });
    },
    [key],
  );

  return [state, setAndPersist];
}

/** Debounces a fast-changing value (search input) so it doesn't fire a
 * server action on every keystroke. */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

/** True once the viewport is at or above the query's breakpoint — used to
 * switch between the desktop spreadsheet-style table and the mobile card
 * list. useSyncExternalStore (React's own pattern for subscribing to a
 * browser API) reports `initial` on the server/first paint and the real
 * value as soon as the client subscribes — no effect, no render-then-correct
 * flash logic to get wrong. */
export function useMediaQuery(query: string, initial = true): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => initial,
  );
}

/** Fires `onOutside` for a pointerdown outside every ref in `refs`, and
 * `onEscape` for the Escape key — the shared behaviour every popover
 * (filters, columns, status editor) in the CRM needs. */
export function useDismiss(refs: React.RefObject<HTMLElement | null>[], onDismiss: () => void, active: boolean): void {
  useEffect(() => {
    if (!active) return;
    function handlePointer(e: PointerEvent) {
      if (refs.every((r) => r.current && !r.current.contains(e.target as Node))) onDismiss();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs identity is stable per caller
  }, [active, onDismiss]);
}

