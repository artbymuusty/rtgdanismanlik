import { notFound } from "next/navigation";

/**
 * Any unknown path under /tr or /en lands here and renders the localized
 * 404 (app/[lang]/not-found.tsx) inside the normal header/footer layout.
 */
export default function UnknownPage() {
  notFound();
}
