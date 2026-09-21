import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { detectLocale } from "@/lib/i18n/detect";
import { internalPath, localizedPath, routeKeyFromPath, routes, splitLocale } from "@/lib/i18n/routes";

/**
 * Language routing.
 *
 *  - No locale in the URL (/, /basvuru, /how-we-help …): pick the visitor's
 *    language (cookie → country → safe fallback, see detect.ts) and
 *    redirect to the same page under /tr, /en or /de. Temporary + no-store,
 *    because the answer differs per visitor.
 *  - /en/<english-slug>, /de/<german-slug>: rewritten to the folder that
 *    implements the page (app/[lang]/<turkish-folder>), so each language's
 *    URLs are in that language while the code has one implementation per page.
 *  - Another language's slug under a locale (/en/basvuru, /de/how-we-help)
 *    is redirected to the canonical slug — no duplicate URLs.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const [locale, rest] = splitLocale(pathname);

  if (!locale) {
    const target = detectLocale({
      cookie: request.cookies.get(LOCALE_COOKIE)?.value,
      country: request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry"),
    });
    const key = routeKeyFromPath(pathname);
    const destination = key ? localizedPath(target, key) : `/${target}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(new URL(`${destination}${search}`, request.url));
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Vary", "Accept-Language, Cookie");
    return response;
  }

  const key = routeKeyFromPath(pathname);
  if (!key || rest === "") return NextResponse.next();

  const canonical = routes[key][locale];
  if (rest !== canonical) {
    return NextResponse.redirect(new URL(`${localizedPath(locale, key)}${search}`, request.url), 308);
  }

  const internal = internalPath(locale, key);
  if (internal !== pathname) {
    return NextResponse.rewrite(new URL(`${internal}${search}`, request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Skip Next internals, API routes and any path with a file extension
  // (images, robots.txt, sitemap.xml, favicon…).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
