import type { Locale } from "@/lib/i18n/config";

/**
 * Kept apart from the two dictionaries on purpose: the error boundary
 * (app/[lang]/error.tsx) is a client component present on every page, and
 * importing a whole dictionary there would ship both languages to every
 * visitor. Both dictionaries reuse these strings for `common.error`.
 */
export const errorMessages: Record<
  Locale,
  { eyebrow: string; title: string; description: string; retry: string; home: string }
> = {
  tr: {
    eyebrow: "Bir şeyler ters gitti",
    title: "Sayfa yüklenirken bir sorun oluştu.",
    description: "Sayfayı yeniden deneyebilirsin ya da ana sayfaya dönebilirsin.",
    retry: "Tekrar Dene",
    home: "Ana Sayfaya Dön",
  },
  en: {
    eyebrow: "Something went wrong",
    title: "There was a problem loading this page.",
    description: "You can try again or go back to the home page.",
    retry: "Try Again",
    home: "Back to Home",
  },
  de: {
    eyebrow: "Etwas ist schiefgelaufen",
    title: "Es gab ein Problem beim Laden dieser Seite.",
    description: "Du kannst es erneut versuchen oder zur Startseite zurückkehren.",
    retry: "Erneut versuchen",
    home: "Zur Startseite",
  },
};
