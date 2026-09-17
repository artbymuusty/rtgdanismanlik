import type { Dictionary, Locale } from "./types";
import { tr } from "./tr";

const dictionaries: Partial<Record<Locale, Dictionary>> = {
  tr,
};

/**
 * TR-first: only `tr` is implemented today. To add English or German,
 * create `lib/content/en.ts` / `lib/content/de.ts` matching the `Dictionary`
 * type and register it here — no component changes required.
 */
export function getDictionary(locale: Locale = "tr"): Dictionary {
  return dictionaries[locale] ?? tr;
}

export type { Dictionary, Locale } from "./types";
