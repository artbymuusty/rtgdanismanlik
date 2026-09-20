import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";

export type LangParams = Promise<{ lang: string }>;

/** Reads and validates the [lang] route segment; anything else is a 404. */
export async function getLang(params: LangParams): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}
