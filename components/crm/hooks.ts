"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";

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

/**
 * Focus management for a true modal (LeadDrawer, NewLeadDialog): on open,
 * moves focus into the panel (its own close button, so a screen-reader user
 * immediately hears the dialog's content and has an obvious way out); on
 * close, restores focus to whatever had it before the modal opened, so
 * closing the drawer doesn't strand the user's keyboard focus on <body>.
 * Also cycles Tab/Shift+Tab within the panel so focus never escapes to the
 * page behind the backdrop.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean): React.RefObject<T | null> {
  const containerRef = useRef<T | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    const focusable = () => container?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [];
    (focusable()[0] ?? container)?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const items = Array.from(focusable());
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [active]);

  return containerRef;
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

/**
 * Keeps a toolbar popover (Filtrele/Sırala/Sütunlar) inside the viewport
 * instead of a fixed `right-0`/`w-80` combination that overflows off-screen
 * whenever its trigger sits too close to the left edge (narrow viewports,
 * or a trigger early in the toolbar). Positions the panel with `fixed`
 * coordinates derived from the trigger's own bounding rect, clamped to stay
 * within [margin, viewport - panelWidth - margin] horizontally and capped
 * to the remaining vertical space so it never runs under the fold either.
 *
 * useLayoutEffect (not useEffect) so the first-open placement happens
 * before paint — no visible jump from an unpositioned frame.
 */
export function usePopoverPosition(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  panelRef: React.RefObject<HTMLElement | null>,
): React.CSSProperties {
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: "hidden" });

  useLayoutEffect(() => {
    if (!open) return;
    const margin = 12;

    function place() {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor || !panel) return;
      const a = anchor.getBoundingClientRect();
      const panelWidth = panel.offsetWidth;
      const maxLeft = Math.max(margin, window.innerWidth - margin - panelWidth);
      const left = Math.min(Math.max(a.right - panelWidth, margin), maxLeft);
      const maxHeight = Math.max(200, window.innerHeight - a.bottom - margin);
      setStyle({ position: "fixed", top: a.bottom + 6, left, maxHeight, visibility: "visible" });
    }

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, anchorRef, panelRef]);

  // No separate "reset on close" effect: the panel unmounts whenever
  // `open` is false (see each caller's `{open ? <div style={style}> : null}`),
  // and the layout effect above recomputes a fresh position synchronously,
  // before paint, the next time `open` becomes true — so a stale leftover
  // style from the previous open can never actually be seen.
  return style;
}

