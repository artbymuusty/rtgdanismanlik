import { notFound } from "next/navigation";

/**
 * Any unknown path under /tr, /en or /de lands here and renders the
 * localized 404 (app/[lang]/not-found.tsx) inside the normal header/footer.
 */
export default function UnknownPage() {
  notFound();
}
