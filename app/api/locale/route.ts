import { NextResponse, type NextRequest } from "next/server";
import { isLocale, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "@/lib/i18n/config";

/**
 * Records an explicit language choice before navigating. Keeping this server
 * side avoids client-side cookie mutation and makes the preference available
 * to proxy.ts on the visitor's next locale-less request.
 */
export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale");
  const next = request.nextUrl.searchParams.get("next");

  if (!isLocale(locale) || !next?.startsWith("/") || next.startsWith("//")) {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 302);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
