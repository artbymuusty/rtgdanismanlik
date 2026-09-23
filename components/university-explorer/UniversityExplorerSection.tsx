import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { UniversityExplorer } from "./UniversityExplorer";

/**
 * Thin server-side wrapper: reads this locale's dictionary slice here (per
 * lib/content/index.ts's own guidance) and hands it to the interactive
 * client component, instead of letting the client component import
 * getDictionary itself and pull in all three languages.
 */
export function UniversityExplorerSection({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).home.universityExplorer;
  return <UniversityExplorer lang={lang} t={t} />;
}
