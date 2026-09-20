import type { Dictionary, Locale } from "./types";
import { tr } from "./tr";
import { en } from "./en";

const dictionaries: Record<Locale, Dictionary> = { tr, en };

/**
 * Dictionaries are plain, serializable data (no functions), so server
 * components can pass a slice straight to a client component as props —
 * client components should receive what they need instead of importing
 * this module, which keeps the other language out of their bundle.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary, Locale } from "./types";
